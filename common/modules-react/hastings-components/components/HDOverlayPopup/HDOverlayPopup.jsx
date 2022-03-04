/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
// import './hd-overlay-popup.scss';
import { PropTypes } from 'prop-types';
import { createPortal } from 'react-dom';
import { Row, Col } from 'react-bootstrap';
import HDButtonRefactor from '../HDButtonRefactor/HDButtonRefactor';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';
import crossCircleBlack from '../../../../../applications/quote-and-buy/src/assets/images/icons/cross_circle_black.svg';

function HDOverlayPopup({
    children,
    id,
    hidden,
    confirmButton,
    cancelButton,
    onConfirm,
    onCancel,
    onBeforeOpen,
    onBeforeClose,
    showButtons,
    overlayButtonIcon,
    disabledConfirmButton,
    hideOnConfirm,
    labelText,
    customStyle,
    className,
    overlayButtonsClassName,
    closeOnSelect,
    headerBar
}) {
    const divToRender = document.getElementById('portal-root');
    const [modalShow, setModalShow] = useState(false);
    const [isStacked, setIsStacked] = useState(false);
    const [isVisibible, setIsVisible] = useState(false);
    const MODAL_CLOSE_DELAY = 500;

    useEffect(() => {
        if (closeOnSelect) {
            setModalShow(!closeOnSelect);
        }
    }, [closeOnSelect]);

    useEffect(() => {
        if (modalShow) {
            if (document.body.classList.contains('hd-modal-open')) {
                setIsStacked(true);
            } else {
                document.body.classList.add('hd-modal-open');
            }
            setTimeout(() => {
                setIsVisible(true);
            });
        } else if (!isStacked) {
            document.body.classList.remove('hd-modal-open');
        }
    }, [modalShow]);

    const handleCloseAnimation = (onAfterAnimation) => {
        setIsVisible(false);
        setTimeout(() => {
            if (typeof onAfterAnimation === 'function') {
                onAfterAnimation();
            }
            setModalShow(false);
        }, MODAL_CLOSE_DELAY);
    };

    const handleConfirm = (event) => {
        onConfirm(event);
        if (hideOnConfirm) {
            handleCloseAnimation();
        }
    };

    const handleCancel = (event) => {
        onCancel(event);
        handleCloseAnimation();
    };

    const handleClose = () => {
        handleCloseAnimation(onBeforeClose);
    };

    const handleClick = (event) => {
        if (typeof onBeforeOpen === 'function') {
            onBeforeOpen(event);
        }
        setModalShow(true);
    };

    const renderOverlay = () => (
        <div id={id} className={`hd-information-tooltip theme-white ${customStyle} ${className}`}>
            <div className="overlay">
                <div className="overlay-outside" onClick={handleClose} />
                <div className="overlay-container--outer">
                    <div className={`overlay-container${isVisibible ? ' is-visible' : ''}${headerBar ? ' overlay-container-multi' : ''}`}>
                        {headerBar}
                        <div className={`overlay-close${headerBar ? ' overlay-close-multi' : ''}`}>
                            <div onClick={handleClose}><img width={30} height={30} src={crossCircleBlack} alt="close" /></div>
                        </div>
                        {labelText && (
                            <div className="overlay-header">
                                <HDLabelRefactor Tag="h2" text={labelText} />
                            </div>
                        )}
                        <div className="overlay-body">{children}</div>
                        {showButtons && (
                            <div className="overlay-footer">
                                <Row>
                                    <Col xs={12} sm={6} className="pr-xs">
                                        <HDButtonRefactor
                                            variant="primary"
                                            className="theme-white"
                                            disabled={disabledConfirmButton}
                                            onClick={handleConfirm}
                                            label={confirmButton}
                                            fullWidth />
                                    </Col>
                                    <Col xs={12} sm={6} className="pl-xs overlay-footer__cancel-btn">
                                        <HDButtonRefactor
                                            variant="secondary"
                                            className="theme-white"
                                            onClick={handleCancel}
                                            label={cancelButton}
                                            fullWidth />
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`hd-information-tooltip ${className}`}>
            <div hidden={hidden} id={id} className={`hd-overlay-btn ${overlayButtonsClassName}`} onClick={handleClick}>
                {overlayButtonIcon}
            </div>
            {modalShow && createPortal(renderOverlay(), divToRender)}
        </div>
    );
}

HDOverlayPopup.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
    confirmButton: PropTypes.string,
    cancelButton: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onBeforeOpen: PropTypes.func,
    onBeforeClose: PropTypes.func,
    showButtons: PropTypes.bool,
    overlayButtonIcon: PropTypes.node,
    labelText: PropTypes.string,
    disabledConfirmButton: PropTypes.bool,
    hideOnConfirm: PropTypes.bool,
    customStyle: PropTypes.string,
    className: PropTypes.string,
    overlayButtonsClassName: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    headerBar: PropTypes.shape({})
};

HDOverlayPopup.defaultProps = {
    hidden: false,
    confirmButton: 'Confirm',
    cancelButton: 'Cancel',
    onConfirm: () => { },
    onCancel: () => { },
    onBeforeOpen: () => { },
    onBeforeClose: () => { },
    showButtons: false,
    overlayButtonIcon: null,
    disabledConfirmButton: false,
    labelText: '',
    hideOnConfirm: true,
    customStyle: '',
    className: '',
    overlayButtonsClassName: '',
    closeOnSelect: false,
    headerBar: null
};

export default HDOverlayPopup;
