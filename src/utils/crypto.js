const ALGORITHM = "AES-CBC";
let cachedKey = null;

async function getKey() {
  if (cachedKey) {
    // console.log("Using cached key==>", cachedKey)
    return cachedKey;
  }

  const envKey = import.meta.env.VITE_API_ENCRYPTION_KEY;
  const rawKey = Uint8Array.from(atob(envKey), (c) => c.charCodeAt(0));

  cachedKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"],
  );

  // console.log("New key created:", cachedKey)
  return cachedKey;
}

export async function encryptPayload(data) {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encoded = new TextEncoder().encode(JSON.stringify(data));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded,
  );

  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.byteLength);

  // hasing without special character
  return Array.from(combined)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function decryptResponse(encryptedText) {
  const key = await getKey();

  // Hex → Uint8Array
  const combined = new Uint8Array(
    encryptedText.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );

  const iv = combined.slice(0, 16);
  const ciphertext = combined.slice(16);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext,
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch (err) {
    console.error("Decryption failed:", err);
    throw err;
  }
}
