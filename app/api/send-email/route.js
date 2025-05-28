// app/api/send-email/route.js
export async function POST(req) {
  const { email, message } = await req.json();

  try {
    const response = await fetch('https://igoqwthxpqjrnflhpkil.supabase.co/functions/v1/resend-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error }), { status: response.status });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}