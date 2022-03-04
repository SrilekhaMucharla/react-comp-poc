import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Col, Row, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { HDLabelRefactor } from 'hastings-components';
import { getIpidDocumnet } from '../../redux-thunk/actions';
import iconCross from '../../assets/images/icons/cross_circle_white.svg';

const HDDownloadPage = (props) => {
    const { dispatch } = props;
    // Read parameters:
    // ${pageName}/${docParam.documentUUID}/${docParam.referenceNumber}/${docParam.sessionUUID}

    const {
        pageName, documentUUID, referenceNumber, sessionUUID
    } = useParams();
    const [cookies, setCookie] = useCookies(['download_a_file']);

    const handleBrowserBack = () => {
        window.close();
    };

    useEffect(() => {
        if (cookies.download_a_file === 'true') {
            setCookie('download_a_file', false, {
                path: '/'
            });
            handleBrowserBack();
        } else {
            setCookie('download_a_file', true, {
                path: '/'
            });

            dispatch(getIpidDocumnet({ sessionUUID: sessionUUID, referenceNumber: referenceNumber, documentUUID: documentUUID }, pageName));
        }
    }, []);

    return (
        <Container fluid className="background-body page-content-wrapper">
            <Container>
                <Row>
                    <Col className="px-0" sm={12} xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                        <div>
                            <Container>
                                <h2>Downloading a file...</h2>
                                <HDLabelRefactor
                                    Tag="a"
                                    text="After downloading, you can close this window."
                                    onClick={() => handleBrowserBack()}
                                    icon={<img src={iconCross} alt="Close" />}
                                    iconPosition="r" />
                            </Container>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    getIpidDocumnet
});

HDDownloadPage.propTypes = {
    dispatch: PropTypes.shape({}).isRequired,
};


export default connect(null, mapDispatchToProps)(HDDownloadPage);
