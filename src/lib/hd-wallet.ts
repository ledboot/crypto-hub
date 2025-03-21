import { wordlist } from '@scure/bip39/wordlists/english';
import * as bip39 from '@scure/bip39';
import { HDKey } from "@scure/bip32";
import {DerivePriKeyParams} from '@/types/common';
import * as secp256k1 from '@noble/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import { CoinType } from '@/types/common';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';



export function getMnemonic(mnemonicLength: number) {
    const mnemonic = bip39.generateMnemonic(wordlist, mnemonicLength);
    return mnemonic;
}

export function mnemonicToSeed(mnemonic: string, passphrase?: string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
    return seed;
}

export function getDerivedPrivateKey(param: DerivePriKeyParams, passphrase?: string) {
  const masterSeed = bip39.mnemonicToSeedSync(param.mnemonic, passphrase);
  const childKey = HDKey.fromMasterSeed(masterSeed);
  const derivedKey = childKey.derive(param.hdPath);
  const privateKey = derivedKey.privateKey;
  if (!privateKey) {
    throw new Error('failed to get private key');
  }
  const publicKey = derivedKey.publicKey;
  if (!publicKey) {
    throw new Error('failed to get public key');
  }
  const privateKeyHex = Buffer.from(privateKey).toString('hex');
  const publicKeyHex = Buffer.from(publicKey).toString('hex');
  let addressHex: string | undefined
  switch (param.coinType){
    case CoinType.BTC:
      addressHex = getBitcoinAddress(privateKey);
      break;
    case CoinType.ETH:
      addressHex = getEthereumAddress(privateKey);
      break;
    default:
      throw new Error('unsupported coin type');
  }

  return {
    privateKey: privateKeyHex,
    addressHex: addressHex,
    publicKey: publicKeyHex,
  };
}

// Function to get Ethereum address
function getEthereumAddress(privateKey: Uint8Array) {
  const publicKey = secp256k1.getPublicKey(privateKey, false);
  const addressBytes = keccak_256(publicKey.slice(1)).slice(-20);
  const ethAddress = '0x' + Buffer.from(addressBytes).toString('hex');
  return ethAddress;
}


function getBitcoinAddress(privateKey: Uint8Array) {
  const ECPair = ECPairFactory(ecc);
  const keyPair = ECPair.fromPrivateKey(privateKey, {
    network: bitcoin.networks.bitcoin,
  });

  const wif = keyPair.toWIF();
  console.log('wif:', wif);
  
  const network = bitcoin.networks.bitcoin;

  const p2pkhAddress = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(keyPair.publicKey),
    network,
  }).address;
  console.log('P2PKH address:', p2pkhAddress); // eg：1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

  const redeemScript = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(keyPair.publicKey), network: bitcoin.networks.bitcoin });
  const p2shAddress = bitcoin.payments.p2sh({
    redeem: redeemScript,
    network: bitcoin.networks.bitcoin,
  }).address;
  console.log('P2SH address:', p2shAddress); // eg：3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy

  const bech32Address = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(keyPair.publicKey),
    network: bitcoin.networks.bitcoin,
  }).address;
  console.log('Bech32 address:', bech32Address); // eg：bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq

  return p2pkhAddress;
}
