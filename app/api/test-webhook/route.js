export async function POST(req) {
  console.log('Test webhook called');
  return new Response('Test webhook received', { status: 200 });
}