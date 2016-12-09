'use strict';

const AWS = require('aws-sdk');

class KmsJson {
  constructor(options) {
    this.kms = new AWS.KMS(options.awsKmsSettings);
    this.keyId = options.keyId;
    this.encoding = options.encoding || 'hex';
  }

  encrypt(inputJson) {
    return this.kms.encrypt({
      KeyId: this.keyId,
      Plaintext: new Buffer(JSON.stringify(inputJson))
    }).promise().then(data => data.CiphertextBlob.toString(this.encoding));
  }

  decrypt(cipherText) {
    return this.kms.decrypt({
        CiphertextBlob: new Buffer(cipherText, this.encoding)
      }).promise().then(data => JSON.parse(data.Plaintext.toString()));
  }
}

module.exports = KmsJson;
