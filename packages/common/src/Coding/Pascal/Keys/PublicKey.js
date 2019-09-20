/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Curve = require('./Curve');
const BytesWithLength = require('../../Core/BytesWithLength');
const BytesFixedLength = require('../../Core/BytesFixedLength');
const BytesWithoutLength = require('../../Core/BytesWithoutLength');
const Decissive = require('../../Decissive');
const CompositeType = require('../../CompositeType');
const BC = require('../../../BC');
const Sha = require('../../../Sha');
const Base58 = require('../../../Base58');
const PublicKeyType = require('./../../../../src/Types/Keys/PublicKey');

/**
 * A Public Key value.
 */
class PublicKey extends CompositeType {

  /**
   * Constructor.
   *
   * @param {String} id
   * @param {Boolean} omitXYLenghts
   */
  constructor(id = null, omitXYLenghts = false) {
    super(id || 'public_key');
    this.addSubType(new Curve('curve'));

    // oh come on..
    if (omitXYLenghts) {
      this.addSubType(new Decissive('x', 'curve', (curve) => {
        return new BytesFixedLength('x', curve.xylPublicKey('x'));
      }));
      this.addSubType(new Decissive('y', 'curve', (curve) => {
        return new BytesFixedLength('y', curve.xylPublicKey('y'));
      }));
    } else {
      this.addSubType(
        new BytesWithLength('x', 2, 'x_length', 'Length of X value')
          .description('The X value of the public key.')
      );
      this.addSubType(
        new BytesWithLength('y', 2, 'y_length', 'Length of Y value')
          .description('The X value of the public key.')
      );
    }
  }

  /**
   * Reads a value and returns a new PascalCoin PublicKey instance.
   *
   * @param {BC|Buffer|Uint8Array|String} bc
   * @param {Object} options
   * @param {*} all
   * @returns {PublicKeyType}
   */
  decodeFromBytes(bc, options = {}, all = null) {
    const decoded = super.decodeFromBytes(bc);

    return new PublicKeyType(decoded.x, decoded.y, decoded.curve);
  }

  /**
   * Gets the base58 representation of a public key.
   *
   * @returns {String}
   */
  encodeToBase58(publicKey) {
    const prefix = BC.fromHex('01');
    const encoded = this.encodeToBytes(publicKey);
    const aux = Sha.sha256(encoded);
    const suffix = aux.slice(0, 4);

    const raw = BC.concat(prefix, encoded, suffix);

    return Base58.encode(raw);
  }

  /**
   * Gets a public key instance from the given base58 string.
   *
   * @param {String} base58
   * @returns {PublicKey}
   */
  decodeFromBase58(base58) {
    const decoded = Base58.decode(base58);

    return this.decodeFromBytes(decoded.slice(1, -4));
  }
}

module.exports = PublicKey;
