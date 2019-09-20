/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const AbstractType = require('./../AbstractType');
const BC = require('./../../BC');

const P_SIZE_ENCODED = Symbol('size_encoded');

/**
 * A field type to write bytes without prepending the length. This cannot be decoded in some circumstances.
 */
class BytesWithoutLength extends AbstractType {

  /**
   * Constructor
   *
   * @param {String} id
   */
  constructor(id = null) {
    super(id || 'bytes_without_length');
    this.description('Bytes without length prepended.');
  }

  /**
   * @inheritDoc AbstractType#encodedSize
   */
  get encodedSize() {
    return this[P_SIZE_ENCODED];
  }

  /**
   * In fact this does nothing other than updating the internal size.
   *
   * @param {BC|Buffer|Uint8Array|String} bc
   * @param {Object} options
   * @param {*} all
   * @returns {BC}
   */
  decodeFromBytes(bc, options = {}, all = null) {
    this[P_SIZE_ENCODED] = bc.length;
    return bc;
  }

  /**
   * Encodes the given value to a collection of bytes.
   *
   * @param {Buffer|Uint8Array|BC|String} value
   * @returns {BC}
   */
  encodeToBytes(value) {
    value = this.determineValue(value);
    let encoded = BC.from(value);

    this[P_SIZE_ENCODED] = encoded.length;
    return encoded;
  }
}

module.exports = BytesWithoutLength;
