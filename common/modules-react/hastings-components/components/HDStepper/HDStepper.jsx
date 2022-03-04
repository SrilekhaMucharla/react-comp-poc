import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Row } from 'react-bootstrap';
import { gsap } from 'gsap';
import _ from 'lodash';
import iconTick from './Icons_Tick.svg';

const HDStepper = ({
    steps, currentStep, milestone, stepperStart, stepperTwo, stepperThree
}) => {
    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const currentStepIndex = steps.findIndex((step) => step === currentStep);
    const stepsLength = steps.length;

    useEffect(() => {
        steps.map((step, index) => {
            const inProgress = index === currentStepIndex;
            const completed = index < currentStepIndex;
            const notStarted = index > currentStepIndex;
            const lastStep = index === stepsLength - 1;
            const isCurrentStepAMilestone = milestone && currentStepIndex === index;

            const stepsContainer = document.getElementById('steps-container');

            let circleWidth;
            let stepContainerWidth;
            let stepTwoOffsetInit;
            let stepThreeOffsetInit;
            let beforeLineWidth;
            let beforeLineOffset;
            let afterLineWidth;
            let afterLineOffset;
            let lineFullwidth;
            let lastDuration;
            let dotScaleFactor;

            if (stepsContainer) {
                stepContainerWidth = stepsContainer.offsetWidth;
            }

            if (dimensions.width > 768) {
                circleWidth = '38';
                lastDuration = 0.6;
                dotScaleFactor = dimensions.width / circleWidth * 3;
            } else {
                circleWidth = '30';
                lastDuration = 0.2;
                dotScaleFactor = dimensions.width / circleWidth * 5;
            }

            stepTwoOffsetInit = stepContainerWidth - (4 * circleWidth);
            stepThreeOffsetInit = stepContainerWidth - (3 * circleWidth);
            beforeLineWidth = stepContainerWidth - (4 * circleWidth);
            beforeLineOffset = circleWidth;
            afterLineWidth = circleWidth;
            afterLineOffset = stepContainerWidth - (2 * circleWidth);
            lineFullwidth = stepContainerWidth - 1;

            // TRANSITION TO STEP 1
            if (currentStepIndex === 0 && stepContainerWidth && stepperStart) {
                // reset
                gsap.to('#stepper-line-1', { x: beforeLineOffset, width: 0, duration: 0 });
                gsap.to('.blue-line-before', { x: 0, width: 0, duration: 0 });
                gsap.to('.blue-line-after', { x: 0, width: 0, duration: 0 });
                gsap.to('#stepper-line-2', { x: afterLineOffset, width: 0, duration: 0 });
                gsap.to('#stepper-step-2 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-1 .in-progress', { scale: 0, duration: 0 });
                gsap.to('#stepper-step-1 .stepper-text', { opacity: 0, duration: 0 });
                gsap.to('#stepper-step-2', { x: stepTwoOffsetInit, opacity: 0, duration: 0 });
                gsap.to('#stepper-step-3', { x: stepThreeOffsetInit, opacity: 0, duration: 0 });
                gsap.to('#stepper-step-3 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-pink-line-1', { x: beforeLineOffset, width: 0, duration: 0 });
                // action start
                gsap.to('.blue-line-before', { width: '100%', duration: 1.2, delay: 0.1 });
                gsap.to('#stepper-step-1 .in-progress', {
                    scale: 1, x: 0, display: 'block', opacity: 1, duration: 0.5, delay: 1
                });
                gsap.to('#stepper-step-1 .stepper-text', { opacity: 1, duration: 0.5, delay: 1.2 });
                gsap.to('#stepper-line-1', {
                    x: beforeLineOffset, width: beforeLineWidth, duration: 0.3, delay: 1.4
                });
                gsap.to('#stepper-step-2', {
                    x: stepTwoOffsetInit, opacity: 1, duration: 0.5, delay: 1.7
                });
                gsap.to('#stepper-line-2', {
                    x: afterLineOffset, width: afterLineWidth, duration: 0.3, delay: 2.1
                });
                gsap.to('#stepper-step-3', {
                    x: stepThreeOffsetInit, opacity: 1, duration: 0.5, delay: 2.4
                });
                gsap.to('.blue-line-after', { width: '100%', duration: 0.3, delay: 2.8 });
            }
            // STATIC STEP 1
            if (currentStepIndex === 0 && stepContainerWidth && !stepperStart) {
                gsap.to('#stepper-step-1 .in-progress', {
                    scale: 1, display: 'block', opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-1 .stepper-text', { opacity: 1, duration: 0 });
                gsap.to('#stepper-step-2', {
                    x: stepTwoOffsetInit, display: 'block', opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-3', {
                    x: stepThreeOffsetInit, display: 'block', opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-2 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-2 .in-progress', { display: 'none', opacity: 0, duration: 0 });
                gsap.to('#stepper-step-3 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-line-1', { x: beforeLineOffset, width: beforeLineWidth, duration: 0 });
                gsap.to('#stepper-line-2', { x: afterLineOffset, width: afterLineWidth, duration: 0 });
                gsap.to('#stepper-pink-line-1', { x: beforeLineOffset, width: 0, duration: 0 });
            }
            // STEP 1 COMPLETED
            if (currentStepIndex === 0 && stepContainerWidth && milestone) {
                // reset
                gsap.to('#stepper-step-1 .in-progress', {
                    scale: 1, display: 'block', opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-1 .tick', {
                    scale: 0, display: 'block', opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-2 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-2 .in-progress', { display: 'none', opacity: 0, duration: 0 });
                gsap.to('#stepper-step-3 .not-started', { display: 'block', opacity: 1, duration: 0 });
                // action
                gsap.to('#stepper-step-1 .in-progress', {
                    scale: 0, display: 'block', opacity: 1, duration: 0.3, delay: 1
                });
                gsap.to('#stepper-step-1 .tick', {
                    scale: 1, display: 'block', opacity: 1, duration: 0.3, delay: 1
                });
            }
            // TRANSITION TO STEP 2
            if (currentStepIndex === 1 && stepContainerWidth && stepperTwo) {
                gsap.to('#stepper-step-1 .tick', {
                    display: 'block', scale: 1, opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-2 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-3 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-pink-line-1', { x: circleWidth, width: 0, duration: 0 });
                gsap.to('#stepper-step-2 .in-progress', { display: 'none', opacity: 0, duration: 0 });
                gsap.to('#stepper-pink-line-1', {
                    x: circleWidth, width: beforeLineWidth, duration: 1, delay: 2
                });
                gsap.to('#stepper-step-2 .in-progress', {
                    display: 'block', opacity: 1, duration: 0.6, delay: 3.1
                });
                gsap.to('#stepper-step-2', { x: stepTwoOffsetInit, duration: 0 });
                gsap.to('#stepper-step-3', { x: stepThreeOffsetInit, duration: 0 });
                gsap.to('#stepper-line-1', { x: beforeLineOffset, width: beforeLineWidth, duration: 0 });
                gsap.to('#stepper-line-2', { x: afterLineOffset, width: afterLineWidth, duration: 0 });
            }
            // STATIC STEP 2
            if (currentStepIndex === 1 && stepContainerWidth && !stepperTwo) {
                gsap.to('#stepper-step-2', { x: stepTwoOffsetInit, duration: 0 });
                gsap.to('#stepper-step-3', { x: stepThreeOffsetInit, duration: 0 });
                gsap.to('#stepper-line-1', { x: beforeLineOffset, width: beforeLineWidth, duration: 0 });
                gsap.to('#stepper-line-2', { x: afterLineOffset, width: afterLineWidth, duration: 0 });
                gsap.to('#stepper-step-1 .tick', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-2 .in-progress', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-3 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-pink-line-1', { x: circleWidth, width: beforeLineWidth, duration: 0 });
            }
            // TRANSITION TO STEP 3
            if (currentStepIndex === 2 && stepContainerWidth && stepperThree) {
                gsap.to('#stepper-step-2', { x: stepTwoOffsetInit, duration: 0 });
                gsap.to('#stepper-step-3', { x: stepThreeOffsetInit, duration: 0 });
                gsap.to('#stepper-line-1', { display: 'none', duration: 0 });
                gsap.to('#stepper-line-2', { x: afterLineOffset, width: afterLineWidth, duration: 0 });
                gsap.to('#stepper-step-1 .tick', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-2 .in-progress', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-step-2 .not-started', { display: 'none', opacity: 0, duration: 0 });
                gsap.to('#stepper-step-3 .not-started', { display: 'block', opacity: 1, duration: 0 });
                gsap.to('#stepper-pink-line-1', { x: 0, width: stepThreeOffsetInit, duration: 0 });
                // TRANSITION PART

                // number 2 to tickmark
                gsap.to('#stepper-step-2 .tick', {
                    scale: 0, display: 'block', opacity: 1, duration: 0
                });
                gsap.to('#stepper-step-2 .tick', { scale: 1, duration: 0.3, delay: 1.2 });
                gsap.to('#stepper-step-2 .in-progress', {
                    scale: 0, display: 'block', opacity: 1, duration: 0.3, delay: 1.2
                });
                // line 2-3 becomes pink
                gsap.to('#stepper-pink-line-1', { width: lineFullwidth, duration: 0.5, delay: 2.4 });
                gsap.to('#stepper-line-2', { display: 'none', duration: 0, delay: 2.9 });
                // number 2 move on x to left
                gsap.to('#stepper-step-2', { x: circleWidth, duration: 0.6, delay: 2.7 });
                // number 3 active
                gsap.to('#stepper-step-3 .in-progress', {
                    display: 'block', opacity: 1, duration: 0.6, delay: 2.6
                });
                // number 1 left
                gsap.to('#stepper-step-1', { x: -dimensions.width, duration: 0.6, delay: 3.6 });
                // number 2 left
                gsap.to('#stepper-step-2', { x: -dimensions.width, duration: 0.6, delay: 4 });
                // pink line left
                gsap.to('#stepper-pink-line-1', { width: 0, duration: 0.4, delay: 4.6 });
                gsap.to('#wrapping-line-left', { x: -dimensions.width, duration: 0.4, delay: 5 });
                gsap.to('#wrapping-line-right', {
                    x: -dimensions.width, duration: 0.4, delay: 4.6, zIndex: 1
                });
                // number 3 left
                gsap.to('#stepper-step-3', { x: -dimensions.width, duration: 0.6, delay: 5.4 });
                gsap.to('#stepper-line-2', { opacity: 0, duration: 0.5, delay: 5.4 });
                // blue dot corner
                gsap.to('#blue-dot', {
                    display: 'block', opacity: 0, duration: 0, delay: 0
                });
                gsap.to('#blue-dot', {
                    scale: dotScaleFactor, opacity: 1, duration: 1.2, delay: 5.5
                });
                // blue fade out
                // from transition
                gsap.to('#blue-dot', {
                    display: 'none', opacity: 0, duration: 0, delay: 8
                });
            }
        });
    }, [currentStep, milestone, stepperStart, stepperTwo, stepperThree, dimensions]);


    const renderSteps = steps.map((step, index) => {
        return (
            <>
                <div id={`stepper-step-${index + 1}`} className="stepper-step">
                    <div className="circle-wrapper">
                        <img className="tick " src={iconTick} alt="Completed" />
                        <div className="circle in-progress">{index + 1}</div>
                        <div className="circle not-started">{index + 1}</div>
                    </div>
                    <div className="stepper-text">{step}</div>
                </div>

            </>
        );
    });


    useEffect(() => {
        const handleResize = _.debounce(() => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
        }, 100);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    return (
        <Row className="hd-stepper" noGutters>
            <div id="blue-dot" className="blue-dot" />
            <Col sm={1} xs={1} md={2} lg={4}>
                <div id="wrapping-line-left" className="wrapping-line stepper-line flex-line blue-line-before" />
            </Col>
            <Col id="steps-container" className="steps-container" sm={10} xs={10} md={8} lg={4}>
                <div id="stepper-line-1" className={classNames('before', 'stepper-line blue-line')} />
                {renderSteps}
                <div id="stepper-line-2" className={classNames('after', 'stepper-line blue-line')} />
                <div id="stepper-pink-line-1" className={classNames('after', 'stepper-line pink-line')} />
            </Col>
            <Col sm={1} xs={1} md={2} lg={4}>
                <div id="wrapping-line-right" className="wrapping-line stepper-line flex-line blue-line blue-line-after" />
            </Col>
        </Row>
    );
};


HDStepper.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentStep: PropTypes.string.isRequired,
    milestone: PropTypes.bool,
    stepperStart: PropTypes.bool,
    stepperTwo: PropTypes.bool,
    stepperThree: PropTypes.bool
};

HDStepper.defaultProps = {
    milestone: false,
    stepperStart: false,
    stepperTwo: false,
    stepperThree: false,
};

export default HDStepper;
