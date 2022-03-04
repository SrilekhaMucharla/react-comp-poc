import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import { HDRibbon } from 'hastings-components';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import DeleteDriverModal from './DeleteDriverModal';
import useAnotherDriver from '../__helpers__/useAnotherDriver';
import routes from '../../../routes/WizardRouter/RouteConst';
import * as messages from './HDAddAnotherDriver.messages';
import EventEmmiter from '../../../EventHandler/event';

const RemoveDriverRibbon = ({ pageMetadata }) => {
    const [hideRibbon, setHideRibbon] = useState(false);
    const history = useHistory();
    const location = useLocation();

    const moveRibbonHandler = (event) => {
        setHideRibbon(event.hide);
    };
    EventEmmiter.subscribe('change', moveRibbonHandler);

    const [driverIndex, isAnotherDriver, driverFixedId] = useAnotherDriver(location);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const drivers = useSelector((state) => state.wizardState.data.submissionVM.lobData.privateCar.coverables.drivers.value);
    const editDriverIndex = drivers
            && drivers.length && !!driverFixedId && drivers.findIndex((driver) => driver.fixedId === driverFixedId) !== -1
        ? drivers.findIndex((driver) => driver.fixedId === driverFixedId)
        : driverIndex;

    const onDelete = () => setShowDeleteModal(true);

    const hideDeleteModal = () => setShowDeleteModal(false);

    const onDeleteConfirm = () => {
        hideDeleteModal();
        _.pullAt(drivers, editDriverIndex);
        history.push(routes.ADD_ANOTHER_DRIVER);
    };

    const firstName = _.get(drivers, `${editDriverIndex}.person.firstName`, null);
    const lastName = _.get(drivers, `${editDriverIndex}.person.lastName`, null);
    const driverName = firstName && lastName ? ` ${firstName} ${lastName}` : null;

    const hideRibbonCustomClass = (isHidden) => {
        if (isHidden) return 'remove-driver-ribbon__hide-anim';
        return '';
    };

    useEffect(() => {
        return () => {
            EventEmmiter.unsubscribe('change');
        };
    }, []);

    return (
        <>
            <HDRibbon
                text={driverName}
                actionText={isAnotherDriver ? messages.removeDriver : null}
                onClick={onDelete}
                className={`remove-driver-ribbon${hideRibbonCustomClass(hideRibbon)}`} />
            <DeleteDriverModal
                pageMetadata={pageMetadata}
                show={showDeleteModal}
                onCancel={hideDeleteModal}
                onConfirm={() => onDeleteConfirm()}
                onClose={hideDeleteModal}
                driverName={driverName} />
        </>
    );
};

RemoveDriverRibbon.propTypes = {
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired,
};

export default RemoveDriverRibbon;
