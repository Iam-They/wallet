import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import uid from 'uid';
import { LEDGER_RECEIVE_PATH } from '@/constants';
import { importPubKey, importAddress } from '../../../service';
import * as log from '@/utils/electronLogger';
import CreateNewAddress from '@/components/CreateNewAddress';
import { getPubKeyLedger } from '../../../service';
import { addReceiveTxnsRequest } from '../../../reducer';
import { PaymentRequest } from '@/typings/models';

interface CreateNewAddressPageLedgerProps extends RouteComponentProps {
  addReceiveTxns: (data: any) => void;
  paymentRequests: PaymentRequest[];
}

const CreateNewAddressLedgerPage: React.FunctionComponent<CreateNewAddressPageLedgerProps> = ({
  history,
  addReceiveTxns,
  paymentRequests,
}: CreateNewAddressPageLedgerProps) => {
  const onSubmit = async (label: string, addressTypeChecked: boolean) => {
    try {
      log.info('Create address ledger');
      const keyIndex = paymentRequests.length;
      const {
        data: { pubkey, address },
      } = await getPubKeyLedger(
        keyIndex,
        addressTypeChecked ? 'legacy' : 'p2sh'
      );
      const data = {
        label,
        id: uid(),
        time: new Date().toString(),
        address,
      };
      await importPubKey(pubkey, keyIndex);
      await importAddress(address, keyIndex);
      addReceiveTxns(data);
      history.push(LEDGER_RECEIVE_PATH);
      log.info('Created address ledger');
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <CreateNewAddress
      history={history}
      receivePath={LEDGER_RECEIVE_PATH}
      handleSubmit={onSubmit}
    />
  );
};

const mapStateToProps = (state) => {
  const { ledgerWallet } = state;
  return {
    paymentRequests: ledgerWallet.paymentRequests,
  };
};

const mapDispatchToProps = {
  addReceiveTxns: (data: any) => addReceiveTxnsRequest(data),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewAddressLedgerPage);