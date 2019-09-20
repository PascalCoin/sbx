/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const BaseAction = require('./BaseAction');
const PascalInfo = require('@pascalcoin-sbx/common').PascalInfo;
const Currency = require('@pascalcoin-sbx/common').Types.Currency;

/**
 * An object that holds infos about an operation action. It extends the
 * BaseAction functionality by methods which are useful for operations.
 */
class OperationAction extends BaseAction {
  /**
   * Constructor
   *
   * @param {String} method
   * @param {Object} params
   * @param {Executor} executor
   * @param {*} DestinationType
   * @param {Boolean} returnsArray
   */
  constructor(method, params, executor, DestinationType, returnsArray) {
    super(method, params, executor, DestinationType, returnsArray);
    this.params.fee = new Currency(0);
    this.params.payload = '';
    this.params.payload_method = 'none';
  }

  /**
     * Sets the payload of the action.
     *
     * @param {String|BC} payload
     * @param {String} payloadMethod
   * @param {String} password
   * @param {PublicKey} pubkey
     * @returns {OperationAction}
     */
  withPayload(payload, payloadMethod = 'none', password = null, pubkey = null) {
    this.params.payload = payload;
    this.params.payload_method = payloadMethod;
    if (password !== null) {
      this.params.pwd = password;
    }
    if (pubkey !== null) {
      this.params.pubkey = pubkey;
    }

    return this;
  }

  /**
     * Sets the fee.
     *
     * @param {Number|Currency} fee
     * @returns {OperationAction}
     */
  withFee(fee) {
    this.params.fee = new Currency(fee);
    return this;
  }

  /**
   * Sets the fee to the minimum.
   *
   * @returns {OperationAction}
   */
  withMinFee(lastKnownBlock = null) {
    this.params.fee = PascalInfo.MIN_FEE(lastKnownBlock);
    return this;
  }

  /**
     * Gets a flag indicating whether the current action is valid.
     *
     * @returns {boolean}
     */
  isValid() {
    return super.isValid();
  }
}

module.exports = OperationAction;
