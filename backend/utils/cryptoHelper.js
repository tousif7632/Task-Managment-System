const CryptoJS = require('crypto-js');

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.CRYPTO_SECRET
  ).toString();
};

const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.CRYPTO_SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = { encrypt, decrypt };