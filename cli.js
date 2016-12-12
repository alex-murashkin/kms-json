#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const
  yargs = require('yargs'),
  co = require('co'),
  getStdin = require('get-stdin'),
  KmsJson = require('./index.js');

function* main() {
  const argv = yargs
    .usage([
      '[json-object] | node cli ',
      '-r [region]',
      '-k [access-key-id]',
      '-s [secret-access-key]',
      '-m ["decrypt" OR "encrypt"]',
      '-y [kms-key-id]',
      '-c [encoding]'
    ].join(' '))

    .demand('m')
    .alias('m', 'mode')
    .choices('m', ['encrypt', 'decrypt'])
    .describe('m', 'Mode')

    .demand('r')
    .alias('r', 'region')
    .describe('r', 'AWS Region')
    .nargs('r', 1)

    .demand('k')
    .alias('k', 'access-key-id')
    .describe('k', 'AWS Access Key Id')
    .nargs('k', 1)

    .demand('s')
    .alias('s', 'secret-access-key')
    .describe('s', 'AWS Secret Access Key')
    .nargs('s', 1)

    .demand('y')
    .alias('y', 'kms-key-id')
    .describe('y', 'AWS KMS key id')
    .nargs('y', 1)

    .demand('c')
    .alias('c', 'encoding')
    .describe('c', 'Encoding of ciphertext')
    .nargs('c', 1)

    .help('h')
    .alias('h', 'help')

    .epilog('More examples at http://github.com/AlexanderMS/kms-json')

    .wrap(80)
    .argv;

  const kmsJson = new KmsJson({
    awsKmsSettings: {
      accessKeyId: argv.accessKeyId,
      secretAccessKey: argv.secretAccessKey,
      region: argv.region
    },
    encoding: argv.encoding,
    keyId: argv.kmsKeyId
  });

  const rawInput = yield getStdin();
  const input = rawInput.trim();
  if (argv.m === 'decrypt') {
    console.log('Provided ciphertext:');
    console.log(input);
    console.log('Specified encoding:', argv.encoding);
    console.log('Decrypting...');
    return kmsJson.decrypt(input)
      .then(result => console.log(result));
  } else {
    const inputJson = JSON.parse(input);
    console.log('Provided JSON:');
    console.log(JSON.stringify(inputJson, null, 2));
    console.log('Specified encoding: ', argv.encoding);
    console.log('Encrypting...');
    return kmsJson.encrypt(input)
      .then(result => console.log(result));
  }
}

co(main).catch(err => console.error(err));
