/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Abstract = require('./Abstract');
const BC = require('@pascalcoin-sbx/common').BC;
const Curve = require('@pascalcoin-sbx/common').Types.Keys.Curve;
const PublicKeyCoder = require('@pascalcoin-sbx/common').Coding.Pascal.Keys.PublicKey;

const P_NAME = Symbol('block');
const P_ENC_PUBKEY = Symbol('publicKey');
const P_CAN_USE = Symbol('can_user');
const P_B58_PUBKEY = Symbol('b58_pubkey');
const P_EC_NID = Symbol('ec_nid');
const P_X = Symbol('x');
const P_Y = Symbol('y');

/**
 * Holds information about a public key in the wallet (fetched via rpc).
 */
class WalletPublicKey extends Abstract {
  /**
     * Constructor
     *
     * @param {Object} data
     */
  static createFromRPC(data) {
    let walletPublicKey = new WalletPublicKey(data);

    walletPublicKey[P_NAME] = data.name;
    walletPublicKey[P_ENC_PUBKEY] = new PublicKeyCoder().decodeFromBytes(BC.fromHex(data.publicKey));
    walletPublicKey[P_CAN_USE] = !!data.can_use;

    walletPublicKey[P_B58_PUBKEY] = null;
    walletPublicKey[P_EC_NID] = null;
    walletPublicKey[P_X] = null;
    walletPublicKey[P_Y] = null;
    if (data.b58_pubkey !== undefined) {
      walletPublicKey[P_B58_PUBKEY] = data.b58_pubkey;
    }
    if (data.ec_nid !== undefined) {
      walletPublicKey[P_EC_NID] = new Curve(parseInt(data.ec_nid, 10));
    }
    if (data.x !== undefined) {
      walletPublicKey[P_X] = BC.fromHex(data.x);
    }
    if (data.y !== undefined) {
      walletPublicKey[P_Y] = BC.fromHex(data.y);
    }

    return walletPublicKey;
  }

  /**
     * Gets the name of the key.
     *
     * @returns {String}
     */
  get name() {
    return this[P_NAME];
  }

  /**
     * Gets the public key.
     *
     * @returns {BC}
     */
  get publicKey() {
    return this[P_ENC_PUBKEY];
  }

  /**
     * Gets a flag indicating whether the key can be used.
     *
     * @returns {Boolean}
     */
  get canUse() {
    return this[P_CAN_USE];
  }

  /**
     * Gets the base58 public key if returned by the node.
     *
     * @returns {String|null}
     */
  get base58PublicKey() {
    return this[P_B58_PUBKEY];
  }

  /**
     * Gets the used curve if returned by the node.
     *
     * @returns {Curve|null}
     */
  get ecNid() {
    return this[P_EC_NID];
  }

  /**
     * Gets the X value of the key if returned by the node.
     *
     * @returns {BC|null}
     */
  get x() {
    return this[P_X];
  }

  /**
     * Gets the Y value of the key if returned by the node.
     *
     * @returns {BC|null}
     */
  get y() {
    return this[P_Y];
  }
}

module.exports = WalletPublicKey;
