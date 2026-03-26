export async function onRequest(context) {
  const request = context.request;

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const userAgent = request.headers.get('User-Agent') || 'unknown';
  const visited_at = new Date().toISOString();

  // Parse device and browser from user agent
  const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
  const browser =
    userAgent.includes('Chrome') ? 'Chrome' :
    userAgent.includes('Firefox') ? 'Firefox' :
    userAgent.includes('Safari') ? 'Safari' :
    userAgent.includes('Edg') ? 'Edge' : 'Other';

  await context.env.DB.prepare(
    'INSERT INTO visits (ip, device, browser, visited_at) VALUES (?, ?, ?, ?)'
  ).bind(ip, device, browser, visited_at).run();

  return new Response('ok', { status: 200 });
}
