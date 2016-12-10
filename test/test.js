'use strict';

const
  sinon = require('sinon'),
  chai = require('chai'),
  assert = chai.assert,
  KmsJson = require('../index.js');

chai.use(require('chai-as-promised'));

const
  testKeyId = '123',
  encryptedText = 'YnVmZmVy',
  encryptedTextAsBuffer = Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
  plainJson = {
    "protected": '12345'
  },
  plainJsonBuffer = new Buffer('{"protected":"12345"}', 'utf-8');

describe('kms-json', function() {
  let sandbox, kmsJson, awsKmsMock;

  before(function() {
    kmsJson = new KmsJson({
      keyId: testKeyId
    });

    sandbox = sinon.sandbox.create();
    awsKmsMock = sandbox.mock(kmsJson.kms);
  });

  after(function() {
    awsKmsMock.verify();
    sandbox.restore();
  })

  it('calls kms.encrypt with right arguments and resolves', function() {
    awsKmsMock.expects('encrypt')
      .withArgs({
        KeyId: testKeyId,
        Plaintext: plainJsonBuffer
      })
      .returns({
        promise: () => Promise.resolve({
          CiphertextBlob: encryptedTextAsBuffer
        })
      });

    return kmsJson.encrypt(plainJson).then(result => {
      assert.equal(result, encryptedText);
    });
  });

  it('rejects when kms.encrypt rejects', function() {
    awsKmsMock.expects('encrypt')
      .withArgs({
        KeyId: testKeyId,
        Plaintext: plainJsonBuffer
      })
      .returns({
        promise: () => Promise.reject(new Error('AWS error'))
      });

    return assert.isRejected(
      kmsJson.encrypt(plainJson),
      /AWS error/,
      'Expected to be rejected');
  });

  it('calls kms.decrypt with right arguments and resolves', function() {
    awsKmsMock.expects('decrypt')
      .withArgs({
        CiphertextBlob: encryptedTextAsBuffer
      })
      .returns({
        promise: () => Promise.resolve({
          Plaintext: plainJsonBuffer
        })
      });

    return kmsJson.decrypt(encryptedText).then(result => {
      assert.deepEqual(result, plainJson);
    });
  });

  it('rejects when kms.decrypt rejects', function() {
    awsKmsMock.expects('decrypt')
      .withArgs({
        CiphertextBlob: encryptedTextAsBuffer
      })
      .returns({
        promise: () => Promise.reject(new Error('AWS error'))
      });

    return assert.isRejected(
      kmsJson.decrypt(encryptedText),
      /AWS error/,
      'Expected to be rejected');
  });
});
