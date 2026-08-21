const encoder = new TextEncoder();

async function constantTimeEquals(left: string, right: string): Promise<boolean> {
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(left)),
    crypto.subtle.digest('SHA-256', encoder.encode(right)),
  ]);

  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let diff = leftBytes.length ^ rightBytes.length;
  for (let i = 0; i < leftBytes.length; i++) {
    diff |= leftBytes[i] ^ (rightBytes[i] ?? 0);
  }
  return diff === 0;
}

export async function isInternalRequest(request: Request): Promise<boolean> {
  const expected = process.env.PAYLOAD_SECRET;
  if (!expected) return false;

  const auth = request.headers.get('authorization') ?? '';
  return constantTimeEquals(auth, `Bearer ${expected}`);
}
