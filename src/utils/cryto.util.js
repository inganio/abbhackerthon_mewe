import NodeRSA from "node-rsa";
import fs from "fs";

const privateKey = fs.readFileSync("cert/private_key.pem"); // Replace with the actual path to your private key
const server = new NodeRSA(privateKey, "private", {
  encryptionScheme: "pkcs1",
});

function decryptImageData(imageData) {
  const imageBuffer = Buffer.from(imageData, "base64");
  return server.decrypt(imageBuffer, "buffer");
}

module.exports = {
  decryptImageData,
};
