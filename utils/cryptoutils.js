import crypto, { randomBytes } from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY;
const iv = Buffer.from(process.env.IV, "hex");

//Encryption Function

export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

// Decrypt function
export function decrypt(hash) {
  const iv = Buffer.from(hash.iv, "hex");
  const encryptedText = Buffer.from(hash.content, "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export default { encrypt, decrypt };
