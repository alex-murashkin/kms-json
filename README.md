# kms-json
Module for encrypting and decrypting JSON objects using AWS Key Management Service (KMS) customer master keys.

## Usage

* Install the package: `npm install kms-json`
* Require and instantiate `kms-json`:

  ```javascript
  const KmsJson = require('kms-json');
  const kmsJson = new KmsJson({
      awsKmsSettings: {
        accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        region: 'us-east-1',
        apiVersion: '2014-11-01'
      },
      keyId: 'arn:aws:kms:us-east-1:123456789123:key/a7c08fe1-b767-4883-8c94-85726579d57c'
  });
  ```

Supported options:

Name                | Type         | Description
------------------- | ------------ | --------
awsKmsSettings      | Object       | Settings object passed into the `AWS.KMS` constructor as defined in [AWS Javascript SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property). Can be used to specify credentials, region, etc.
keyId               | string (ARN) | ARN of a KMS key
encoding            | string       | Character encoding to represent the encoded string. See [Node.JS Buffer API](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)

* Encrypt a JSON:  

```javascript
const encrypted = yield kmsJson.encrypt({
  password: '123',
  userName: '12'
});
console.log(encrypted);
// outputs something like "0101020078c99e38275140f38a86222f8...3cc"
// depending on the key, payload size and encoding
```
* Decrypt an encrypted JSON:

```javascript
const decrypted = yield kmsJson.decrypt(encrypted);
console.log(decrypted); // outputs { password: '123', userName: '12' }

```
