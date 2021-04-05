import BigNumber from 'bignumber.js';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Progress,
  Row,
} from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import styles from '../popOver.module.scss';
import { getPageTitle } from '../../../utils/utility';
import { Helmet } from 'react-helmet';
import { MdCamera } from 'react-icons/md';
import { DownloadSnapshotSteps } from '../types';
import {
  OFFICIAL_SNAPSHOT_URL,
  SNAPSHOT_BLOCK,
  SNAPSHOT_PROVIDER,
} from '@defi_types/snapshot';
import { openDownloadSnapshotModal } from '../reducer';
import { disableReindex, restartApp } from '../../../utils/isElectron';
import { triggerNodeShutdown } from '../../../worker/queue';
import { stopBinary } from '../../../app/service';
import moment from 'moment';
import { onSnapshotDownloadRequest } from '../service';

const SnapshotDownloadModal: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const {
    isSnapshotDownloadOpen,
    snapshotDownloadData,
    snapshotDownloadSteps,
  } = useSelector((state: RootState) => state.popover);

  const getPercentage = (): string => {
    const completion = snapshotDownloadData.completionRate;
    return new BigNumber(completion).times(100).toFixed(2);
  };

  const getStepTitle = (step: DownloadSnapshotSteps): string => {
    let title = '';
    switch (step) {
      case DownloadSnapshotSteps.SnapshotRequest:
        title = 'alerts.snapshotSyncRecommended';
        break;
      case DownloadSnapshotSteps.DownloadSnapshot:
        title = 'alerts.downloadingSnapshot';
        break;
      case DownloadSnapshotSteps.SnapshotApplied:
        title = 'alerts.snapshotApplied';
        break;
      case DownloadSnapshotSteps.ApplyingSnapshot:
        title = 'alerts.applyingSnapshot';
        break;
      default:
        break;
    }
    return I18n.t(title);
  };

  const getStepDescription = (step: DownloadSnapshotSteps): string => {
    let title = '';
    switch (step) {
      case DownloadSnapshotSteps.SnapshotRequest:
        title = 'alerts.snapshotDescription';
        break;
      case DownloadSnapshotSteps.DownloadSnapshot:
        title = `
        Downloading ${getPercentage()}% of snapshot from ${OFFICIAL_SNAPSHOT_URL}`;
        return title;
      case DownloadSnapshotSteps.SnapshotApplied:
        return I18n.t('alerts.startSyncBlock', { from: SNAPSHOT_BLOCK });
      case DownloadSnapshotSteps.ApplyingSnapshot:
        title = 'alerts.unpackingSnaphot';
        return I18n.t(title, { address: snapshotDownloadData.downloadPath });
      default:
        break;
    }
    return I18n.t(title);
  };

  const onApplyFinish = async () => {
    disableReindex();
    dispatch(openDownloadSnapshotModal(false));
    await triggerNodeShutdown(false);
    await stopBinary();
    restartApp();
  };

  const getSnapshotSize = (bytes: number): string => {
    return new BigNumber(bytes).dividedBy(1073741824).toFixed(2);
  };

  const onDownloadStart = () => {
    onSnapshotDownloadRequest();
  };

  const closeModal = () => {
    dispatch(openDownloadSnapshotModal(false));
  };

  const barStyle = { borderRadius: '1rem' };

  return (
    <Modal
      isOpen={isSnapshotDownloadOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw', height: '100vh', margin: '0' }}
      centered
    >
      {DownloadSnapshotSteps.SnapshotRequest === snapshotDownloadSteps && (
        <Button
          color='link'
          onClick={closeModal}
          className={styles.floatingCancel}
        >
          {I18n.t('alerts.cancel')}
        </Button>
      )}
      <ModalBody style={{ padding: '4rem 6rem' }}>
        <div className='main-wrapper'>
          <>
            <Helmet>
              <title>{getPageTitle(I18n.t('alerts.snapshot'))}</title>
            </Helmet>
          </>
          <div className='content'>
            <section className='d-flex flex-column'>
              <div className='d-flex justify-content-center mb-3'>
                <MdCamera size={20} className={styles.iconBadge} />
              </div>
              <h2>{getStepTitle(snapshotDownloadSteps)}</h2>
              <div className={`${styles.syncHeading} mb-4`}>
                {getStepDescription(snapshotDownloadSteps)}
              </div>
              {/* Snapshot Request Body */}
              {DownloadSnapshotSteps.SnapshotRequest ===
                snapshotDownloadSteps && (
                <>
                  <section>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotDate')}</Col>
                      <Col md='8'>{`${moment(
                        snapshotDownloadData.snapshotDate
                      ).format('LLLL')} (${moment(
                        snapshotDownloadData.snapshotDate
                      ).fromNow()})`}</Col>
                    </Row>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotSize')}</Col>
                      <Col md='8'>{`${getSnapshotSize(
                        snapshotDownloadData.remoteSize
                      )} GB`}</Col>
                    </Row>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotProvider')}</Col>
                      <Col md='8'>{SNAPSHOT_PROVIDER}</Col>
                    </Row>
                    <Row>
                      <Col md='4'>{I18n.t('alerts.snapshotUrl')}</Col>
                      <Col md='8'>{OFFICIAL_SNAPSHOT_URL}</Col>
                    </Row>
                  </section>
                  <section className={'mt-4'}>
                    <small className={styles.snapshotSubclaim}>
                      {I18n.t('alerts.afterDownload')}
                    </small>
                  </section>
                </>
              )}
              {/* Progress Bar */}
              {[
                DownloadSnapshotSteps.DownloadSnapshot,
                DownloadSnapshotSteps.ApplyingSnapshot,
              ].includes(snapshotDownloadSteps) && (
                <Progress
                  animated
                  striped={false}
                  className={styles.syncProgress}
                  value={getPercentage()}
                  style={barStyle}
                  barStyle={barStyle}
                />
              )}
            </section>
          </div>
        </div>
      </ModalBody>
      {[
        DownloadSnapshotSteps.SnapshotRequest,
        DownloadSnapshotSteps.SnapshotApplied,
      ].includes(snapshotDownloadSteps) && (
        <ModalFooter className='justify-content-center'>
          {snapshotDownloadSteps === DownloadSnapshotSteps.SnapshotRequest && (
            <Button
              onClick={onDownloadStart}
              color='primary'
              block
              className={styles.btnWidth}
            >
              {I18n.t('alerts.continueWithSnapshot')}
            </Button>
          )}
          {snapshotDownloadSteps === DownloadSnapshotSteps.SnapshotApplied && (
            <Button
              onClick={onApplyFinish}
              color='primary'
              block
              className={styles.btnWidth}
            >
              {I18n.t('alerts.closeBtnLabel')}
            </Button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
};

export default SnapshotDownloadModal;