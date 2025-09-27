import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = "codeville-pos-crypto-key-secret!";

export function encrypt(text: string): string {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );

  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");

  let encryptedText = Buffer.from(textParts.join(":"), "hex");

  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
