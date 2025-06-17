export async function POST(req) {
  return new Response('Test webhook received', { status: 200 });
}