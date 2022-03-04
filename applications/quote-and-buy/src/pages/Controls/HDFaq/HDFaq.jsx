import {
    HDAccordionRefactor, HDLabelRefactor,
    HDOverlayPopup,
    HDTextInputRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import headsetIcon from '../../../assets/images/icons/headset-icon.svg';
import helpIcon from '../../../assets/images/icons/help-icon.svg';
import { OPENING_HOURS } from '../../../constant/const';
import { ROOT as ROOT_EPTICA_ID } from '../../../customer/directintegrations/faq/epticaMapping';
import useFullscreenLoader from '../Loader/useFullscreenLoader';
import { getTopDocuments, searchByTerm } from './faqHelper';
import * as messages from './HDFaq.messages';

const DELAY_TIME = 1000;

const HDFaq = ({
    epticaId,
    isInPopup
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [HDFullscreenLoader, showLoader, hideLoader] = useFullscreenLoader();

    useEffect(() => {
        const updateQuestions = async (apiCall) => {
            try {
                showLoader();
                const resp = await apiCall();
                setQuestions(resp);
                setError(false);
            } catch {
                setQuestions([]);
                setError(true);
            } finally {
                hideLoader();
            }
        };

        if (!searchTerm && open && epticaId) {
            updateQuestions(() => getTopDocuments(epticaId));
        }

        const searchHandler = setTimeout(() => {
            if (searchTerm && open && epticaId) {
                updateQuestions(() => searchByTerm(ROOT_EPTICA_ID, searchTerm));
            }
        }, DELAY_TIME);

        return () => clearTimeout(searchHandler);
    }, [searchTerm, open, epticaId]);

    const handleSearchTextChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearSearchText = () => {
        setSearchTerm('');
        setOpen(true);
    };

    const handleClose = () => {
        setQuestions([]);
        setOpen(false);
    };

    return (
        <div className="faq">
            <HDOverlayPopup
                id="faq-overlay"
                customStyle="faq-overlay"
                overlayButtonIcon={(
                    <div className="help-icon">
                        {(!isInPopup) && (
                            <img src={helpIcon} alt={messages.helpText} />
                        )}
                        <HDLabelRefactor Tag="a" text={(isInPopup) ? messages.faqsText : messages.helpText} />
                    </div>
                )}
                labelText={messages.title}
                onBeforeOpen={clearSearchText}
                onBeforeClose={handleClose}
            >
                <div className="faq-content">
                    <Row className="margin-bottom-md">
                        <Col>
                            <HDTextInputRefactor
                                placeholder={messages.searchInputPlaceholder}
                                value={searchTerm}
                                onChange={handleSearchTextChange}
                                className="input-group--on-white" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {error && (
                                <div className="invalid-field my-0">
                                    <div className="message">
                                        {messages.error}
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>
                    <Row className="margin-top-lg">
                        <Col>
                            <HDLabelRefactor Tag="p" className="font-medium" text={messages.topQuestionsHeader} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <HDAccordionRefactor cards={questions} supportInnerHTML />
                        </Col>
                    </Row>
                </div>
                <div className="faq-footer">
                    <Row>
                        <Col>
                            <div className="phone-details">
                                <p className="font-bold">
                                    <img src={headsetIcon} alt={messages.customerSupportText} />
                                    {messages.customerSupportText}
                                </p>
                                <p className="call-center">{ messages.customerSupportPhoneNumber }</p>
                            </div>
                        </Col>
                        <Col>
                            <div className="open-hours">
                                <p>{`${OPENING_HOURS[0].days}: \t${OPENING_HOURS[0].hours}`}</p>
                                <p>{`${OPENING_HOURS[1].days}: \t${OPENING_HOURS[1].hours}`}</p>
                                <p>{`${OPENING_HOURS[2].days}: \t${OPENING_HOURS[2].hours}`}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </HDOverlayPopup>
            {HDFullscreenLoader}
        </div>
    );
};

const mapStateToProps = (state) => ({
    epticaId: state.epticaId
});

HDFaq.propTypes = {
    epticaId: PropTypes.number,
    isInPopup: PropTypes.bool,
};

HDFaq.defaultProps = {
    epticaId: null,
    isInPopup: false,
};

export default connect(mapStateToProps, null)(HDFaq);
