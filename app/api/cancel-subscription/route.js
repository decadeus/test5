import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { subscriptionId } = await req.json();

  if (!subscriptionId) {
    return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
  }

  try {
    // Cancel the subscription on Stripe at the end of the current period
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update the subscription in our database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        // canceled_at: new Date(canceledSubscription.canceled_at * 1000).toISOString(),
        // cancel_at_period_end: true,
      })
      .eq('id', subscriptionId);

    if (updateError) {
      console.error('Error updating subscription in DB:', updateError);
      return NextResponse.json({ error: 'Failed to update subscription in database', details: updateError }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscription cancellation scheduled successfully', canceledSubscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription', details: error.message }, { status: 500 });
  }
} 