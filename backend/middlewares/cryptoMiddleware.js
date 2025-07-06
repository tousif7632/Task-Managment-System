const CryptoJS = require('crypto-js');

const decryptRequest = (req, res, next) => {
  if (req.body && req.body.data) {
    try {
      const bytes = CryptoJS.AES.decrypt(req.body.data, process.env.CRYPTO_SECRET);
      req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (err) {
      return res.status(400).json({ error: 'Invalid encrypted data' });
    }
  }
  next();
};

const encryptResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (data && typeof data === 'object') {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.CRYPTO_SECRET
      ).toString();
      originalSend.call(this, { data: encryptedData });
    } else {
      originalSend.call(this, data);
    }
  };
  next();
};

module.exports = {
  decryptRequest,
  encryptResponse
};