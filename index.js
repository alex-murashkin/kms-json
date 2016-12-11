'use strict';

const
  AWS = require('aws-sdk'),
  assert = require('assert');

class KmsJson {
  constructor(options) {
    assert(options, '"options" must be provided');
    assert(options.keyId, '"options.keyId" must be provided');
    this.kms = new AWS.KMS(options.awsKmsSettings);
    this.keyId = options.keyId;
    this.encoding = options.encoding || 'base64';
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
