/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
    useEffect, useState, useRef
} from 'react';
import PropTypes from 'prop-types';
// animations
import Lottie from 'react-lottie';
import { Container, Row, Col } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import {
    HDLabelRefactor
} from 'hastings-components';
import driverData from '../__transitions__/Driver_details_DEF.json';
// import './HDTransitionPage.scss';
import * as messages from './HDTransitionPage.messages';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';

const HDTransitionPage = (props) => {
    const {
        setNavigation, handleForward,
    } = props;
    const [stopDriverAnimation, setStopDriverAnimation] = useState(false);
    const fadedOut = useRef(false);
    const dispatch = useDispatch();
    const transitionForward = () => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('dip-to-black');
        newDiv.classList.add('fadeInFromNone');
        document.body.appendChild(newDiv);
        newDiv.addEventListener('animationend', () => {
            if (!fadedOut.current) {
                fadedOut.current = true;
                newDiv.classList.replace('fadeInFromNone', 'fadeOut');
                setStopDriverAnimation(true);
                handleForward();
            } else {
                newDiv.parentNode.removeChild(newDiv);
            }
        });
    };
    const driverOptions = {
        loop: false,
        autoplay: true,
        animationData: driverData,
        rendererSettings: {
            preserveAspectRatio: 'xMinYMax slice',
        }
    };

    const [dimensions, setDimensions] = React.useState({
        width: '400',
        height: '400'
    });

    useEffect(() => {
        window.scroll(0, 0);
        // set initial navigation on every page
        // don't use validation from previous step !!!
        dispatch(setNavigation({
            canForward: true,
            showForward: false
        }));
        setTimeout(() => {
            transitionForward();
        }, 3000);
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
        <Container id="animation-driver-details" className="transition__banner">
            <Row>
                <Col sm={12} xs={12} md={6} lg={6} className="transition__banner_header">
                    <h1><span>{messages.driverTransitionHeader}</span></h1>
                    <HDLabelRefactor Tag="h3" text={messages.driverTransitionLabel} />
                </Col>
                <Col onClick={() => handleForward()} sm={12} xs={12} md={6} lg={6} id="anim-holder">
                    <Lottie
                        options={driverOptions}
                        isPaused={stopDriverAnimation}
                        height={dimensions.height}
                        width={dimensions.width} />
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

HDTransitionPage.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired }).isRequired,
    setNavigation: PropTypes.func.isRequired,
    handleForward: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HDTransitionPage);
