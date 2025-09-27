import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = "codeville-pos-crypto-key-secret!";

// Create a proper 32-byte key from your secret
function getKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET_KEY).digest();
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Get the authentication tag for GCM mode
  const authTag = cipher.getAuthTag();

  // Return format: iv:authTag:encryptedData
  return (
    iv.toString("hex") +
    ":" +
    authTag.toString("hex") +
    ":" +
    encrypted.toString("hex")
  );
}

export function decrypt(text: string): string {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts[0], "hex");
  const authTag = Buffer.from(textParts[1], "hex");
  const encryptedText = Buffer.from(textParts[2], "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
}
