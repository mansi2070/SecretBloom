
/**
 * A simple end-to-end encryption utility for ChatSecure
 * 
 * This is a simplified version for demonstration purposes.
 * In a production app, you would use a proper encryption library like Signal Protocol.
 */

// Generate a random key
export async function generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Export the key to a string format
export async function exportKey(key: CryptoKey): Promise<string> {
  const exportedKey = await window.crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(exportedKey);
}

// Import a key from string format
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(keyString);
  return window.crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypt a message
export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Generate a random IV (Initialization Vector)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data
  );
  
  // Combine IV and encrypted data for storage/transmission
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  return arrayBufferToBase64(combined);
}

// Decrypt a message
export async function decryptMessage(
  encryptedMessage: string,
  key: CryptoKey
): Promise<string> {
  const data = base64ToArrayBuffer(encryptedMessage);
  
  // Extract IV and encrypted data
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);
  
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
  return window.btoa(binary);
}

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a session key for temporary usage
export async function generateSessionKey(): Promise<string> {
  const key = await generateKey();
  return exportKey(key);
}
