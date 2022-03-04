import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import PropTypes from 'prop-types';
// import styles from './HDWarningModalStyle.module.scss';
import HDButton from '../HDButton/HDButton';

const HDWarningModal = (props) => {
    const {
        onBack,
        onLeave,
        backBtnLabel,
        leaveBtnLabel,
        keyboard,
        ariaLabelledBy,
        animation,
        autoFocus,
        backdrop,
        backdropClassName,
        centered,
        dialogClassName,
        dialogAs,
        header,
        body,
        manager,
        onEnter,
        onEntered,
        onEntering,
        onEscapeKeyDown,
        onExit,
        onExited,
        onExiting,
        onHide,
        onShow,
        restoreFocus,
        restoreFocusOptions,
        scrollable
    } = props;
    const [show, setShow] = useState(false);
    const [useKeyboard, setUseKeyboard] = useState(keyboard);

    const showModalAction = () => {
        setShow(true);
    };

    const handleClose = useCallback(() => {
        setShow(false);
        if (onHide) {
            onHide();
        }
    });

    const handleOnBack = useCallback(() => {
        setShow(false);
        onBack();
    });

    const handleOnLeave = useCallback(() => {
        setShow(false);
        onLeave();
    });
    useEffect(() => {
        if (backdrop === 'static') {
            setUseKeyboard(false);
        }
    }, []);

    return (
        <>
            <HDButton onClick={showModalAction} variant="btnsecondary" label="cancel" />
            <Modal
                id="hd-modal-dialog"
                aria-labelledby={ariaLabelledBy}
                show={show}
                animation={animation}
                autoFocus={autoFocus}
                backdrop={backdrop}
                backdropClassName={backdropClassName}
                centered={centered}
                onHide={handleClose}
                dialogClassName={dialogClassName}
                dialogAs={dialogAs}
                keyboard={useKeyboard}
                manager={manager}
                onEnter={onEnter}
                onEntered={onEntered}
                onEntering={onEntering}
                onEscapeKeyDown={onEscapeKeyDown}
                onExit={onExit}
                onExited={onExited}
                onExiting={onExiting}
                onShow={onShow}
                restoreFocus={restoreFocus}
                restoreFocusOptions={restoreFocusOptions}
                scrollable={scrollable}
            >
                <Modal.Header bsPrefix='hastings-modal-header'>
                    <Modal.Title bsPrefix='hastings-modal-title'>
                        {header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body bsPrefix='hastings-modal-body'>
                    <p>
                        {body}
                    </p>
                </Modal.Body>
                <Modal.Footer bsPrefix='hastings-modal-footer'>
                    <Button id="back-btn" variant="btnback" className='hastings-modal-btn-back' onClick={handleOnBack}>{backBtnLabel}</Button>
                    <Button id="leave-btn" variant="dark" className='hastings-modal-btn-leave' onClick={handleOnLeave}>{leaveBtnLabel}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
HDWarningModal.propTypes = {
    onBack: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    backBtnLabel: PropTypes.string,
    leaveBtnLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.oneOfType([PropTypes.any]),
    animation: PropTypes.bool,
    autoFocus: PropTypes.bool,
    backdrop: PropTypes.oneOf(['static', true, false]),
    backdropClassName: PropTypes.string,
    centered: PropTypes.bool,
    dialogClassName: PropTypes.string,
    dialogAs: PropTypes.elementType,
    header: PropTypes.string,
    body: PropTypes.string,
    keyboard: PropTypes.bool,
    manager: PropTypes.objectOf(PropTypes.object),
    onEnter: PropTypes.func,
    onEntered: PropTypes.func,
    onEntering: PropTypes.func,
    onEscapeKeyDown: PropTypes.func,
    onExit: PropTypes.func,
    onExited: PropTypes.func,
    onExiting: PropTypes.func,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    restoreFocus: PropTypes.bool,
    restoreFocusOptions: PropTypes.objectOf(PropTypes.shape),
    scrollable: PropTypes.bool
};

HDWarningModal.defaultProps = {
    header: 'Are you sure?',
    body: 'Your details won’t be saved if you leave now but don’t worry, you can save them further on.',
    backBtnLabel: 'Go Back',
    leaveBtnLabel: 'Yes, Leave',
    ariaLabelledBy: 'contained-modal-center',
    animation: true,
    autoFocus: true,
    backdrop: 'static',
    backdropClassName: undefined,
    centered: false,
    dialogClassName: 'hastings-modal-dialog',
    dialogAs: ModalDialog,
    keyboard: true,
    manager: undefined,
    onEnter: undefined,
    onEntered: undefined,
    onEntering: undefined,
    onEscapeKeyDown: undefined,
    onExit: undefined,
    onExited: undefined,
    onExiting: undefined,
    onHide: undefined,
    onShow: undefined,
    restoreFocus: true,
    restoreFocusOptions: undefined,
    scrollable: false,
};

export default HDWarningModal;
