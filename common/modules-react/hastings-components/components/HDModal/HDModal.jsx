/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { createPortal } from 'react-dom';
import { Row, Col, Container } from 'react-bootstrap';
import classNames from 'classnames';
import HDButtonRefactor from '../HDButtonRefactor/HDButtonRefactor';
import HDLabelRefactor from '../HDLabelRefactor/HDLabelRefactor';
import crossCircleBlack from '../../../../../applications/quote-and-buy/src/assets/images/icons/cross_circle_black.svg';

const HDModal = (props) => {
    const {
        show,
        headerText,
        cancelLabel,
        confirmLabel,
        onCancel,
        onConfirm,
        onClose,
        onBeforeOpen,
        children,
        customStyle,
        className,
        hideCancelButton,
        hideConfirmButton,
        hideFooter,
        hideClose,
        disableConfirm
    } = props;

    const [isStacked, setIsStacked] = useState(false);
    const [customStyles, setCustomStyles] = useState([]);
    const [isVisibible, setIsVisible] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const divToRender = document.getElementById('portal-root');

    useEffect(() => {
        if (show && onBeforeOpen) {
            onBeforeOpen();
        }
    }, [show]);

    // clean up on unmount
    useEffect(() => {
        return () => {
            if (document.body.classList.contains('hd-modal-open')) {
                document.body.classList.remove('hd-modal-open');
            }
        };
    }, []);


    useEffect(() => {
        setCustomStyles(customStyle.split(' '));
    }, [customStyle]);

    const fullWidthFooterBtns = hideCancelButton || hideCancelButton || customStyles.includes('footer-btns-w-100');
    const revBtnOrder = customStyles.includes('rev-button-order');

    const footer = (
        <Container fluid className="p-0">
            {customStyles.includes('wide')
                ? (
                    <Row
                        className={classNames(
                            'modal__footer',
                            { 'footer-btns-w-100': fullWidthFooterBtns },
                            { 'flex-column-reverse': revBtnOrder },
                            { 'flex-sm-row-reverse': revBtnOrder && !fullWidthFooterBtns }
                        )}
                    >
                        {!hideConfirmButton && (
                            <Col
                                xs={12}
                                sm={!fullWidthFooterBtns ? 6 : undefined}
                                className={classNames(
                                    { 'modal-btn-pr-small': !fullWidthFooterBtns },
                                    { 'pt-2': !hideCancelButton && revBtnOrder },
                                    { 'pt-sm-0': !hideCancelButton && !fullWidthFooterBtns && revBtnOrder }
                                )}
                            >
                                <HDButtonRefactor
                                    className="btn-primary btn-block theme-white"
                                    label={confirmLabel}
                                    onClick={onConfirm}
                                    data-testid="confirm-button"
                                    variant="primary"
                                    disabled={disableConfirm} />

                            </Col>
                        )}
                        {!hideCancelButton && (
                            <Col
                                xs={12}
                                sm={!fullWidthFooterBtns ? 6 : undefined}
                                className={classNames(
                                    { 'modal-btn-pl-small': !fullWidthFooterBtns },
                                    { 'pt-3': !hideConfirmButton && !revBtnOrder },
                                    { 'pt-sm-0': !hideConfirmButton && !fullWidthFooterBtns && !revBtnOrder }
                                )}
                            >
                                <HDButtonRefactor
                                    className="btn-secondary btn-block theme-white"
                                    label={cancelLabel}
                                    onClick={onCancel}
                                    data-testid="cancel-button"
                                    variant="secondary" />
                            </Col>
                        )}
                    </Row>
                )
                : (
                    <Row
                        className={classNames(
                            'modal__footer',
                            { 'footer-btns-w-100': fullWidthFooterBtns },
                            { 'flex-column-reverse': revBtnOrder },
                            { 'flex-sm-row-reverse': revBtnOrder && !fullWidthFooterBtns }
                        )}
                    >
                        {!hideCancelButton && (
                            <Col
                                xs={12}
                                sm={!fullWidthFooterBtns ? 6 : undefined}
                                className={classNames(
                                    { 'modal-btn-pr-small': !fullWidthFooterBtns },
                                    { 'pt-3': !hideConfirmButton && revBtnOrder },
                                    { 'pt-sm-0': !hideConfirmButton && !fullWidthFooterBtns && revBtnOrder }
                                )}
                            >
                                <HDButtonRefactor
                                    className="btn-secondary btn-block theme-white"
                                    label={cancelLabel}
                                    onClick={onCancel}
                                    data-testid="cancel-button" />

                            </Col>
                        )}
                        {!hideConfirmButton && (
                            <Col
                                xs={12}
                                sm={!fullWidthFooterBtns ? 6 : undefined}
                                className={classNames(
                                    { 'modal-btn-pl-small': !fullWidthFooterBtns },
                                    { 'pt-2': !hideCancelButton && !revBtnOrder },
                                    { 'pt-sm-0': !hideCancelButton && !fullWidthFooterBtns }
                                )}
                            >
                                <HDButtonRefactor
                                    className="btn-primary btn-block theme-white"
                                    label={confirmLabel}
                                    onClick={onConfirm}
                                    data-testid="confirm-button" />

                            </Col>
                        )}
                    </Row>
                )}
        </Container>
    );

    useEffect(() => {
        if (show) {
            setShowContent(true);
        } else {
            setIsVisible(false);
            if (customStyle === 'wide') {
                setTimeout(() => {
                    setShowContent(false);
                }, 500);
            } else {
                setShowContent(false);
            }
        }
    }, [show]);

    useEffect(() => {
        if (showContent) {
            if (document.body.classList.contains('hd-modal-open')) {
                setIsStacked(true);
            } else {
                document.body.classList.add('hd-modal-open');
            }
            setIsVisible(true);
        } else if (!isStacked) {
            document.body.classList.remove('hd-modal-open');
        } else {
            setIsStacked(false);
        }
    }, [showContent]);

    const modalClassNames = classNames(
        `hastings-modal theme-white ${className} ${customStyle}`,
        { narrow: customStyle !== 'wide' },
    );

    const contentClassNames = classNames(
        'hastings-modal-content',
        { 'is-visible': isVisibible }
    );

    const dialogBox = () => {
        return (
            <>
                {showContent
                    ? (
                        <div className={modalClassNames}>
                            <div className={contentClassNames}>
                                {(headerText || !hideClose) && (
                                    <div className="hd-modal-header">
                                        {!hideClose && (
                                            <span data-testid="close-button" onClick={onClose}>
                                                <img src={crossCircleBlack} alt="cross_circle_black_img" />
                                            </span>
                                        )}
                                        {headerText && (
                                            <HDLabelRefactor Tag="h2" text={headerText} />
                                        )}
                                    </div>
                                )}
                                <div className="hd-modal-body">
                                    {children}
                                </div>
                                <div className="hd-modal-footer">
                                    {!hideFooter && footer}
                                </div>
                            </div>
                        </div>
                    ) : ''}
            </>
        );
    };

    return (
        createPortal(dialogBox(), divToRender)
    );
};

HDModal.propTypes = {
    show: PropTypes.bool.isRequired,
    headerText: PropTypes.string,
    cancelLabel: PropTypes.string,
    confirmLabel: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired,
    customStyle: PropTypes.string,
    className: PropTypes.string,
    hideCancelButton: PropTypes.bool,
    hideConfirmButton: PropTypes.bool,
    hideFooter: PropTypes.bool,
    hideClose: PropTypes.bool,
    onBeforeOpen: PropTypes.func
};

HDModal.defaultProps = {
    headerText: '',
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    onCancel: () => { },
    onClose: () => { },
    onBeforeOpen: () => {},
    customStyle: '',
    className: '',
    hideFooter: false,
    hideCancelButton: false,
    hideConfirmButton: false,
    hideClose: false,
};

export default HDModal;
