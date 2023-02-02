import  JSEncrypt from '@/utils/jsencrypt.min.js';

// const CryptoJS = require('crypto-js');

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAp9zXAX/Du15JqlMmdmcA\n' +
  'GrCuAWkD+pTKyIHcHzYUNC+dWmUMCrET+8vcqSV49jtLBNcmMZx0ummgfpumPI8g\n' +
  'ESW2TU4ZrmwyzpQQd7q9O1OPGuVr6CQhLUXUdBwz8INPU0Oy9grEBQrUs696QY44\n' +
  'Z/CbkMOemfvlFdvSMJVKCxurvm5LD+6KGX84/lTJLuSLTpcqZj6qA6+AgA4l3o+C\n' +
  '0jmxc+d6G402jQ/SBXysjS3M5gCP9a6CWZPvsLHcqIlkV1MypW85vGJmY9ayqWDF\n' +
  'na1j4zaJNGL8q54k4d1QGCr/L93Lgi/6hQ5cyfLbfNgVsQVDOnSoScg8XxkT768V\n' +
  'HSW2UL41YO/o+jyLB+sdyR+aEkXUnQTiDf575xjOevQihZNDzOyeqE3o7C4k8UJK\n' +
  'tFIGg532Zxo/4y0hNy58zDBGWbWOud10gNluQrhgb2mK8QEwiHdhWSmPPCe3YP11\n' +
  'Fb4AlQeafUmI4mUoLlbsMhxmEU7KhvbEnLdEbD6Z6wgnZTfR3EXzIuvMak7B5YZU\n' +
  'YlQHX54cDtYou6gAdU9NGOineTcWKgQmPjI8oGgRllJiqCDpem35WgdwQ1W6oB1n\n' +
  'xdW+1UAFwtS02RPr1UV1fZN5oDHZ5kmGFeE6+KgAzoyRrkZzm+IMeYk21pvvheu7\n' +
  'DLZxktFdP0OHsqMfCwqEqM8CAwEAAQ==\n' +
  '-----END PUBLIC KEY-----';
const priviteKey =
  '-----BEGIN PRIVATE KEY-----\n' +
  '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\n' +
  'wus6F96czuDq6vC8Jhl7vsSAmDaK\n' +
  '-----END PRIVATE KEY-----';
// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt.JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对需要加密的数据进行加密
}
//解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt.JSEncrypt();
  encryptor.setPrivateKey(priviteKey); // 设置公钥
  return encryptor.decrypt(txt); // 对需要加密的数据进行加密
}
