# kms-json

[![npm version](https://badge.fury.io/js/kms-json.svg)](https://badge.fury.io/js/kms-json)
[![CircleCI](https://circleci.com/gh/AlexanderMS/kms-json.svg?style=shield)](https://circleci.com/gh/AlexanderMS/kms-json)
[![Coverage Status](https://coveralls.io/repos/github/AlexanderMS/kms-json/badge.svg?branch=master)](https://coveralls.io/github/AlexanderMS/kms-json?branch=master)

Node.JS module for encrypting and decrypting JSON objects using AWS Key Management Service (KMS) customer master keys.

A CLI wrapper is also available.

## Usage

* Install the package: `npm install kms-json`
* Require and instantiate `kms-json`:

  ```javascript
  const KmsJson = require('kms-json');
  const kmsJson = new KmsJson({
    awsKmsSettings: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      region: 'us-east-1'
    },
    keyId: 'arn:aws:kms:us-east-1:123456:key/a7c08fe1-b767-4883-8c94-85726'
  });
  ```

Supported options:

Name                | Type            | Description
:------------------ | :-------------- | :--------
awsKmsSettings      | Object          | Settings object passed into the `AWS.KMS` constructor as defined in [AWS Javascript SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property). Can be used to specify credentials, region, API version, etc. **Default**: `{}`
keyId               | string          | Cutomer master key's Amazon Resource Name (ARN) or unique key id (See [AWS Javascript SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property), `KeyId`). **Required**
encoding            | string          | Character encoding to represent the encrypted string. **Default**: `'base64'` See [Node.JS Buffer API](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)


* Encrypt a JSON object:  

```javascript
const encrypted = yield kmsJson.encrypt({
  fullName: 'John Connor',
  userId: 123,
  isActive: true
});
console.log(encrypted);
// outputs a string like "AQECAHgNzJL58IXknWSXEuLX+0y9U4qC...rilpa8RMxzFV1"
// depending on the key, payload size, and encoding
```

* Decrypt an encrypted JSON object:

```javascript
const decrypted = yield kmsJson.decrypt(encrypted);
console.log(decrypted);
// outputs { fullName: 'John Connor', userId: 123, isActive: true }
```

## CLI

`node cli -h`
```sh
[json-object] | node cli  -r [region] -k [access-key-id] -s [secret-access-key]
-m ["decrypt" OR "encrypt"] -y [kms-key-id] -c [encoding]

Options:
  -m, --mode               Mode       [required] [choices: "encrypt", "decrypt"]
  -r, --region             AWS Region                                 [required]
  -k, --access-key-id      AWS Access Key Id                          [required]
  -s, --secret-access-key  AWS Secret Access Key                      [required]
  -y, --kms-key-id         AWS KMS key id                             [required]
  -c, --encoding           Encoding of ciphertext                     [required]
  -h, --help               Show help                                   [boolean]

More examples at http://github.com/AlexanderMS/kms-json
```

* Encrypt:

```sh
$ echo '{"fullName": "John Connor", "userId": 123, "isActive": true }' | node cli -r "us-east-1" -y "arn:aws:kms:us-east-1:123456:key/a7c08fe1-b767-4883-8c94-85726" -k "AKIAIOSFODNN7EXAMPLE" -s "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" -m encrypt -c "base64"
Provided JSON:
{
  "fullName": "John Connor",
  "userId": 123,
  "isActive": true
}
Specified encoding: base64
Encrypting...
AQECAHgNzJL58IXknWSXEuLX+0y9U4qCdOkGemXt5OM+6ba0aAAAAKkwgaYGCSqGSIb3DQEHBqCBmDCBlQIBADCBjwYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzkDMa60HA8ePR8vIECARCAYssYOWcDTa6SfQRce2brSAZuDZS2TdJGksWyXvSiILLOgRKlyigZKbImXlboeYzIUDeSwivIBprmC1glq+3UrTRoPl+fZRJA4wjnBhBeVyCjEBQhmsFl1warilpa8RMxzFV1
```

* Decrypt:

```sh
$ echo 'AQECAHgNzJL58IXknWSXEuLX+0y9U4qCdOkGemXt5OM+6ba0aAAAAKkwgaYGCSqGSIb3DQEHBqCBmDCBlQIBADCBjwYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzkDMa60HA8ePR8vIECARCAYssYOWcDTa6SfQRce2brSAZuDZS2TdJGksWyXvSiILLOgRKlyigZKbImXlboeYzIUDeSwivIBprmC1glq+3UrTRoPl+fZRJA4wjnBhBeVyCjEBQhmsFl1warilpa8RMxzFV1' | node cli -r "us-east-1" -y "arn:aws:kms:us-east-1:123456:key/a7c08fe1-b767-4883-8c94-85726" -k "AKIAIOSFODNN7EXAMPLE" -s "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" -m decrypt -c "base64"
Provided ciphertext:
AQECAHgNzJL58IXknWSXEuLX+0y9U4qCdOkGemXt5OM+6ba0aAAAAKkwgaYGCSqGSIb3DQEHBqCBmDCBlQIBADCBjwYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAzkDMa60HA8ePR8vIECARCAYssYOWcDTa6SfQRce2brSAZuDZS2TdJGksWyXvSiILLOgRKlyigZKbImXlboeYzIUDeSwivIBprmC1glq+3UrTRoPl+fZRJA4wjnBhBeVyCjEBQhmsFl1warilpa8RMxzFV1
Specified encoding:  base64
Decrypting...
{"fullName": "John Connor", "userId": 123, "isActive": true }
```

For Windows command line (`cmd.exe`), do not wrap the piped input with quotes, i.e., replace `'{"fullName": "John Connor"... }'` with `{"fullName": "John Connor"... }`
