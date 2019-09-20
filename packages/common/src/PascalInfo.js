/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Currency = require('./Types/Currency');

/**
 * Gets information about forks and features.
 */
class PascalInfo {

  /**
   * Gets the min fee.
   *
   * @param {Number|null} block
   * @returns {Currency}
   * @constructor
   */
  static MIN_FEE(block = null) {
    return Currency.fromMolina(1);
  }

  /**
   * Gets the block number when 50% inflation reduction was introduced.
   *
   * @returns {Number}
   * @constructor
   */
  static get PIP_0010() {
    return 210240;
  }

  /**
   * Gets the block number when PIP-10 was activated.
   *
   * @returns {Number}
   * @constructor
   */
  static get INFLATION_REDUCTION() {
    return PascalInfo.PIP_0010;
  }

  /**
   * Gets a value indicating whether the given block has inflation reduction
   * activated (PIP-10).
   *
   * @param {number} block
   * @returns {boolean}
   */
  static isInflationReduction(block) {
    return block >= PascalInfo.INFLATION_REDUCTION;
  }

  /**
   * Gets the block number when RandomHash was activated.
   *
   * @returns {Number}
   * @constructor
   */
  static get PIP_0009() {
    return 260000;
  }

  /**
   * Gets the block number when RandomHash was activated.
   *
   * @returns {Number}
   * @constructor
   */
  static get RANDOM_HASH() {
    return PascalInfo.PIP_0009;
  }

  /**
   * Gets a value indicating if randomhash was active at the given block.
   *
   * @param {Number} block
   * @returns {boolean}
   */
  static isRandomHash(block) {
    return block >= PascalInfo.RANDOM_HASH;
  }

  /**
   * Gets the block number when developer reward was introduced.
   *
   * @returns {Number}
   * @constructor
   */
  static get PIP_0011() {
    return 210000;
  }

  /**
   * Gets the block number when developer reward was introduced.
   *
   * @returns {Number}
   * @constructor
   */
  static get DEVELOPER_REWARD() {
    return PascalInfo.PIP_0011;
  }

  /**
   * Gets a value indicating whether the given block was mined with activated
   * developer award.
   *
   * @param {number} block
   * @returns {boolean}
   */
  static isDeveloperReward(block) {
    return block >= PascalInfo.DEVELOPER_REWARD;
  }

  /**
   * Gets the max payload length in bytes.
   *
   * @return {number}
   * @constructor
   */
  static get MAX_PAYLOAD_LENGTH() {
    return 255;
  }
}

module.exports = PascalInfo;
