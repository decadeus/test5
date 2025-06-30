import Stripe from 'stripe';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("Stripe webhook reçu :", event.type);

  if (event.type === 'customer.subscription.created' || event.type === 'checkout.session.completed') {
    console.log("Début traitement event :", event.type);
    let email = null;
    let subscription = null;
    let stripeCustomerId = null;
    let stripeSubscriptionId = null;
    let isChangeSubscription = false;
    let oldSubscriptionId = null;
    let userId = null;

    if (event.type === 'customer.subscription.created') {
      subscription = event.data.object;
      try {
        const customer = await stripe.customers.retrieve(subscription.customer);
        email = customer.email;
        stripeCustomerId = subscription.customer;
        stripeSubscriptionId = subscription.id;
      } catch (err) {
        // console.warn('⚠️ Impossible de récupérer l'email client :', err.message);
      }
    } else if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      email = session.customer_email || session.customer_details?.email;
      stripeCustomerId = session.customer;
      
      // Vérifier si c'est un changement d'abonnement
      if (session.subscription_data?.metadata?.change_subscription === 'true') {
        isChangeSubscription = true;
        oldSubscriptionId = session.subscription_data.metadata.old_subscription_id;
        userId = session.subscription_data.metadata.user_id;
      }
      
      // Pour récupérer l'id de souscription Stripe, il faut parfois faire un appel supplémentaire :
      if (session.subscription) {
        stripeSubscriptionId = session.subscription;
        try {
          subscription = await stripe.subscriptions.retrieve(session.subscription);
        } catch (err) {
          // console.warn('⚠️ Impossible de récupérer la souscription Stripe :', err.message);
        }
      }
    }

    if (email) {
      console.log("Email récupéré :", email);
      
      if (!userId) {
        let userData = null;
        const password = "101080";
        const { data: userDataResult, error: userError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (userDataResult?.user?.id) {
          userId = userDataResult.user.id;
        } else if (userError) {
          const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers({ email });
          if (existingUser?.users?.[0]?.id) {
            userId = existingUser.users[0].id;
          }
        }
      }
      
      if (userId) {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: userId,
              email,
              role: 'promoteur',
              subscribed_at: new Date().toISOString(),
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              is_active: true,
            },
          ])
          .eq('id', userId);
      }
    } else {
      console.log("Aucun email trouvé pour l'événement :", event.type);
    }

    // Insérer la souscription dans la table subscriptions si on a les infos nécessaires
    if (subscription) {
      let plan_id = null;
      let product_id = null;
      try {
        if (subscription.items && subscription.items.data && subscription.items.data[0]) {
          plan_id = subscription.items.data[0].price.id;
          product_id = subscription.items.data[0].price.product;
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du plan ou du produit Stripe :', err);
      }
      const status = subscription.status;
      const is_active = status === 'active' || status === 'trialing';
      const created_at = subscription.created ? new Date(subscription.created * 1000).toISOString() : null;

      // LOG des valeurs à insérer
      console.log('Tentative d\'insertion dans subscriptions:', {
        id: subscription.id,
        customer_id: subscription.customer,
        email,
        status,
        is_active,
        created_at,
        plan_id,
        product_id,
      });

      // Vérification des champs obligatoires
      if (!subscription.id || !subscription.customer || !status || is_active === undefined || !created_at) {
        console.error('Champ obligatoire manquant pour l\'insertion subscription', {
          id: subscription.id,
          customer_id: subscription.customer,
          status,
          is_active,
          created_at,
        });
        return new Response('Champ obligatoire manquant pour l\'insertion subscription', { status: 400 });
      }

      // Si c'est un changement d'abonnement, désactiver l'ancien
      if (isChangeSubscription && oldSubscriptionId) {
        console.log("Désactivation de l'ancien abonnement :", oldSubscriptionId);
        const { error: deactivateError } = await supabase
          .from('subscriptions')
          .update({ is_active: false })
          .eq('id', oldSubscriptionId);
        
        if (deactivateError) {
          console.error('Erreur désactivation ancien abonnement :', deactivateError);
        }
        
        // Annuler l'abonnement Stripe
        try {
          await stripe.subscriptions.cancel(oldSubscriptionId);
          console.log("Ancien abonnement Stripe annulé :", oldSubscriptionId);
        } catch (err) {
          console.error('Erreur annulation abonnement Stripe :', err);
        }
      }
      
      // Liste stricte des champs autorisés dans la table subscriptions
      const allowedFields = [
        'id',
        'customer_id',
        'email',
        'status',
        'is_active',
        'created_at',
        'plan_id',
        'product_id',
        'description',
        'nickname',
        'product_name',
      ];
      // Construction de l'objet à insérer
      let subscriptionInsert = {
        id: subscription.id,
        customer_id: subscription.customer,
        email,
        status,
        is_active,
        created_at,
        plan_id,
        product_id,
        // description, nickname, product_name peuvent être ajoutés ici si tu veux les remplir
      };
      // Nettoyage : on retire tout champ non autorisé ou undefined
      Object.keys(subscriptionInsert).forEach(key => {
        if (!allowedFields.includes(key) || subscriptionInsert[key] === undefined) {
          delete subscriptionInsert[key];
        }
      });
      console.log('Objet envoyé à Supabase:', subscriptionInsert);
      const { error: upsertError } = await supabase.from('subscriptions').upsert([
        subscriptionInsert
      ], { onConflict: 'id' });
      if (upsertError) {
        console.error('Erreur upsert subscription :', upsertError);
        return new Response('Erreur upsert subscription', { status: 500 });
      }
    }
  }

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object;
    const status = subscription.status;
    const is_active = status === 'active' || status === 'trialing';
    // Construction de l'objet à updater
    const allowedFields = [
      'status',
      'is_active',
      // tu peux ajouter d'autres champs autorisés ici si besoin
    ];
    let updateObj = {
      status,
      is_active,
      // autres champs si besoin
    };
    Object.keys(updateObj).forEach(key => {
      if (!allowedFields.includes(key) || updateObj[key] === undefined) {
        delete updateObj[key];
      }
    });
    console.log('Objet envoyé à Supabase (update):', updateObj);
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(updateObj)
      .eq('id', subscription.id);

    if (updateError) {
      console.error('Erreur update subscription :', updateError);
      return new Response('Erreur update subscription', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
