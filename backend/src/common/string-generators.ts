import { randomBytes, createHash } from 'crypto';

// Returns a new random hex string of the given even size.
export function randomHexString(size: number): string {
  if (size === 0) {
    throw new Error('Can\'t create zero-length randomHexString.');
  }
  if (size % 2 !== 0) {
    throw new Error('randomHexString size must be divisible by 2.')
  }
  return randomBytes(size / 2).toString('hex');
}

/**
 * Random string that includes numbers and lower-case letters.
 */
export function randomStringLc(size: number): string {
  return generateRandomString(size,
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789');
}

// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
export function randomString(size: number): string {
  return generateRandomString(size,
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789');
}

function generateRandomString(size: number, chars: string) {
  let objectId = '';
  const bytes = randomBytes(size);

  for (let i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }

  return objectId;
}

// Returns a new random alphanumeric string suitable for object ID.
export function newObjectId(size: number = 10): string {
  return randomString(size);
}

// Returns a new random hex string suitable for secure tokens.
export function generateToken(): string {
  return randomHexString(32);
}

export function md5Hash(string: string): string {
  return createHash('md5').update(string).digest('hex');
}
