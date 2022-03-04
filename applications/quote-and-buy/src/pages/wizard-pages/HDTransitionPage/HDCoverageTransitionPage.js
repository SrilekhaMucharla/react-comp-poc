import React, {
    useEffect, useState
} from 'react';
import PropTypes from 'prop-types';
// animations
import Lottie from 'react-lottie';
import { Container, Row, Col } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import {
    HDLabelRefactor
} from 'hastings-components';
import covData from '../__transitions__/Cover_selected_DEF.json';
import * as messages from './HDTransitionPage.messages';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';

const HDCoverageTransitionPage = (props) => {
    const {
        setNavigation, handleForward
    } = props;
    const [stopDriverAnimation, setStopDriverAnimation] = useState(false);
    const dispatch = useDispatch();
    const transitionForward = () => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('dip-to-black');
        newDiv.classList.add('fadeOut');
        newDiv.addEventListener('animationend', () => {
            newDiv.parentNode.removeChild(newDiv);
        });
        document.body.appendChild(newDiv);
        setStopDriverAnimation(true);
        handleForward();
    };
    const coverageOptions = {
        loop: true,
        autoplay: true,
        animationData: covData,
        rendererSettings: {
            preserveAspectRatio: 'xMinYMax slice'
        }
    };
    const [dimensions, setDimensions] = React.useState({
        width: '400',
        height: '400'
    });
    useEffect(() => {
        // set initial navigation on every page
        // don't use validation from previous step !!!
        dispatch(setNavigation({
            canForward: true,
            showForward: false,
            updateQuoteFlag: false,
            triggerLWRAPICall: false
        }));
        setTimeout(() => {
            transitionForward();
        }, 6700);
        function handleResize() {
            setDimensions({
                //  1080x1183 width and heigth of JSON animation
                width: document.getElementById('anim-holder').innerWidth,
                height: document.getElementById('anim-holder').innerWidth * 1080 / 1183
            });
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <Container>
            <Row className="transition__banner">
                <Col sm={12} xs={12} md={6} lg={7} className="transition__banner_header section-left">
                    <h1><span>{messages.coverageTransitionHeader}</span></h1>
                    <HDLabelRefactor Tag="h3" text={messages.coverageTransitionLabel} />
                </Col>
                <Col sm={12} xs={12} md={6} lg={5} id="anim-holder" className="section-right">
                    <Lottie
                        options={coverageOptions}
                        height={dimensions.height}
                        width={dimensions.width}
                        isStopped={stopDriverAnimation} />
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction
};

HDCoverageTransitionPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDCoverageTransitionPage);
