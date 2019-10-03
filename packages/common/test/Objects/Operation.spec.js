const fs = require('fs');
const path = require('path');
const Currency = require('@pascalcoin-sbx/common').Types.Currency;
const Payload = require('@pascalcoin-sbx/common').Types.Payload;
const OperationHash = require('@pascalcoin-sbx/common').Types.OperationHash;
const OperationHashCoder = require('@pascalcoin-sbx/common').Coding.Pascal.OperationHash;
const AccountNumber = require('@pascalcoin-sbx/common').Types.AccountNumber;
const Operation = require('@pascalcoin-sbx/common').Objects.Operation;
const Sender = require('@pascalcoin-sbx/common').Objects.Sender;
const Changer = require('@pascalcoin-sbx/common').Objects.Changer;
const Receiver = require('@pascalcoin-sbx/common').Objects.Receiver;
const BC = require('@pascalcoin-sbx/common').BC;

const chai = require('chai');

chai.expect();
const expect = chai.expect;

const optypes = [
  // Operation.BLOCKCHAIN_REWARD,
  Operation.TRANSACTION,
  Operation.CHANGE_KEY,
  // Operation.RECOVER_FUNDS,
  Operation.LIST_FOR_SALE,
  Operation.DELIST,
  Operation.BUY,
  Operation.CHANGE_KEY_ACCOUNT,
  Operation.CHANGE_ACCOUNT_INFO,
  Operation.MULTI_OPERATION,
  Operation.DATA
];

describe('Core.Types.Operation', () => {
  it('can be created from a RPC response', () => {

    optypes.forEach((opt) => {
      const operations = JSON.parse(fs.readFileSync(path.join(__dirname, '/../fixtures/ops/optype_' + opt + '.json')));

      operations.forEach((op) => {
        Operation.createFromObject(op);
      });
    });
  });

  it('can handle pending ops', () => {

    const operations = JSON.parse(fs.readFileSync(path.join(__dirname, '/../fixtures/ops/pending.json')));

    operations.forEach((op) => {
      let operation = Operation.createFromObject(op);

      expect(operation.isPending()).to.be.equal(true);
    });

  });

  it('can be created from raw and contains valid values', () => {
    optypes.forEach((opt) => {
      const operations = JSON.parse(fs.readFileSync(path.join(__dirname, '/../fixtures/ops/optype_' + opt + '.json')));

      operations.forEach((op) => {

        let operation = Operation.createFromObject(op);

        expect(operation.isPending()).to.be.equal(false);

        if (op.valid === undefined) {
          expect(operation.isValid).to.be.equal(true);
        } else {
          expect(operation.isValid).to.be.equal(op.valid);
        }

        if (op.errors === undefined) {
          expect(operation.errors).to.be.equal(null);
        } else {
          expect(operation.errors).to.be.equal(op.errors);
        }

        expect(operation.payload).to.be.instanceof(Payload);
        if (op.payload === undefined) {
          expect(operation.payload.toHex()).to.be.equal('');
        } else {
          expect(operation.payload.toHex()).to.be.equal(op.payload);
        }

        expect(operation.blockNumber).to.be.equal(op.block);
        expect(operation.blockTime).to.be.equal(op.time);
        expect(operation.opBlock).to.be.equal(op.opblock);

        if (operation.maturation !== 0) {
          expect(operation.maturation).to.be.equal(op.maturation);
        }

        expect(operation.opType).to.be.equal(op.optype);

        if (op.account === undefined) {
          expect(operation.accountNumber).to.be.equal(null);
        } else {
          expect(operation.accountNumber).to.be.instanceof(AccountNumber);
          expect(operation.accountNumber.account).to.be.equal(op.account);
        }
        expect(operation.opDescription).to.be.equal(op.optxt);

        expect(operation.amount).to.be.instanceof(Currency);
        expect(operation.amount.toStringOpt()).to.be.equal(op.amount_s.toString());

        expect(operation.fee).to.be.instanceof(Currency);
        expect(operation.fee.toStringOpt()).to.be.equal(op.fee_s.toString());

        if (op.balance === undefined) {
          expect(operation.balance).to.be.equal(null);
        } else {
          expect(operation.balance).to.be.instanceof(Currency);
          expect(operation.balance.toStringOpt()).to.be.equal(op.balance.toString());
        }

        expect(operation.opType).to.be.equal(op.optype);
        if (operation.opType !== Operation.BLOCKCHAIN_REWARD) {
          expect(operation.opHash).to.be.instanceof(OperationHash);
          expect(new OperationHashCoder().encodeToBytes(operation.opHash).toHex()).to.be.equal(op.ophash);
        } else {
          expect(operation.opHash).to.be.instanceof(BC);
          expect(operation.opHash.toHex()).to.be.equal(op.ophash);
        }

        if (op.old_ophash !== undefined) {
          expect(operation.oldOpHash).to.be.instanceof(BC);
          expect(operation.oldOpHash.toHex()).to.be.equal(op.old_ophash);
        } else {
          expect(operation.oldOpHash).to.be.equal(null);
        }

        expect(operation.subType).to.be.equal(op.subtype);

        if (op.signer_account === undefined) {
          expect(operation.signerAccountNumber).to.be.equal(null);
        } else {
          expect(operation.signerAccountNumber).to.be.instanceof(AccountNumber);
          expect(operation.signerAccountNumber.account).to.be.equal(op.signer_account);
        }

        expect(operation.senders.length).to.be.equal(op.senders.length);
        expect(operation.changers.length).to.be.equal(op.changers.length);
        expect(operation.receivers.length).to.be.equal(op.receivers.length);

        operation.senders.forEach((sender) => {
          expect(sender).to.be.instanceof(Sender);
        });
        operation.changers.forEach((changer) => {
          expect(changer).to.be.instanceof(Changer);
        });
        operation.receivers.forEach((receiver) => {
          expect(receiver).to.be.instanceof(Receiver);
        });
      });
    });
  });

  it('has methods to check for an explicit type', () => {
    const isMap = {};

    isMap[Operation.BLOCKCHAIN_REWARD] = 'isBlockchainReward';
    isMap[Operation.TRANSACTION] = 'isTransaction';
    isMap[Operation.CHANGE_KEY] = 'isChangeKey';
    isMap[Operation.RECOVER_FUNDS] = 'isRecoverFunds';
    isMap[Operation.LIST_FOR_SALE] = 'isListForSale';
    isMap[Operation.DELIST] = 'isDelist';
    isMap[Operation.BUY] = 'isBuy';
    isMap[Operation.CHANGE_KEY_ACCOUNT] = 'isChangeKeyAccount';
    isMap[Operation.CHANGE_ACCOUNT_INFO] = 'isChangeAccountInfo';
    isMap[Operation.MULTI_OPERATION] = 'isMultiOperation';
    isMap[Operation.DATA] = 'isData';

    optypes.forEach((opt) => {
      const operations = JSON.parse(fs.readFileSync(path.join(__dirname, '/../fixtures/ops/optype_' + opt + '.json')));

      operations.forEach((op) => {
        let operation = Operation.createFromObject(op);

        Object.keys(isMap).forEach((isOpType) => {
          isOpType = parseInt(isOpType, 10);
          expect(operation[isMap[isOpType]]()).to.be.equal(isOpType === opt);
        });
      });
    });
  });
});
