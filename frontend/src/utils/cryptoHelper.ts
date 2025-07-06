import CryptoJS from 'crypto-js';

export const encrypt = (data: any): string => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_CRYPTO_SECRET!
  ).toString();
};

export const decrypt = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    process.env.NEXT_PUBLIC_CRYPTO_SECRET!
  );
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};