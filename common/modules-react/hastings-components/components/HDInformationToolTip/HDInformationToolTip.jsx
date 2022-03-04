/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
// import './hd-information-tooltip.scss';
import { PropTypes } from 'prop-types';

function HDInformationToolTip(props) {
    const {
        heading, content, hidden
    } = props;
    const [modalShow, setModalShow] = React.useState(false);
    useEffect(() => {
        if (modalShow) {
            document.body.classList.add('hd-modal-open');
        } else {
            document.body.classList.remove('hd-modal-open');
        }
    }, [modalShow]);

    return (
        <div className="hd-information-tooltip">
            <button hidden={hidden} type="button" className="hd-tooltip" onClick={() => setModalShow(true)}>
                <i className="fa fa-info-circle" aria-hidden="true" />
            </button>
            {modalShow
                ? (
                    <div className="modal">
                        <div className="modal-outside" onClick={() => setModalShow(false)} />
                        <div className="modal-container">
                            <div className="modal-header">
                                {heading}
                                <div className="modal-close">
                                    <div onClick={() => setModalShow(false)}><i className="fa fa-close" aria-hidden="true" /></div>
                                </div>
                            </div>
                            {/* <hr /> */}
                            <div className="modal-body">{content}</div>
                        </div>
                    </div>
                ) : ''}
        </div>
    );
}

HDInformationToolTip.propTypes = {
    heading: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    hidden: PropTypes.bool
};

HDInformationToolTip.defaultProps = {
    hidden: false
};

export default HDInformationToolTip;
