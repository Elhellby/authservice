const configuration = require("./configuration")
const crypto = require("crypto");
const algorithm = "aes-192-cbc";
const key = crypto.scryptSync(configuration.getKey('KEY'), 'salt', 24);
const iv = Buffer.alloc(16, 0);

module.exports = {
    encrypt: (unencryptedValue) => {

        console.log(iv)


        const cipher = crypto.createCipheriv(algorithm, key, iv);
        var encrypted = cipher.update(unencryptedValue, 'utf8', 'hex') + cipher.final('hex');
        return encrypted;
    },
    decrypt: (encryptedValue) => {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        var decrypted = decipher.update(encryptedValue, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    }
}