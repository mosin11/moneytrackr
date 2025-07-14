export async function encryptData(plainObj) {
  
 const secretKey = process.env.REACT_APP_ENCRYPT_KEY;
// Frontend: encryptData.js
  const text = JSON.stringify(plainObj);
  //const secretKey = 'My@ssphraseKey9875'; // must match backend

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(secretKey));

 

  // Import the key for AES-GCM
  const key = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM
  const encoded = encoder.encode(text);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}



  return {
  iv: arrayBufferToBase64(iv),
  ciphertext: arrayBufferToBase64(encryptedBuffer) // includes tag
};


}



