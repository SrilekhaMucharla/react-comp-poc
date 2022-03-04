import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = (toOpacity) => keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: ${toOpacity};
    }
`;

const Overlay = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: ${(props) => props.color};
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 1000004;
    opacity: ${(props) => props.opacity};
    animation: ${(props) => css`${props.animationDuration}s ${fadeIn(props.opacity)} ease-in`};
`;

const HDOverlay = (props) => {
    const { bgColor, opacity, animationDuration } = props;

    React.useEffect(() => {
        const previousStyle = { ...document.body.style };
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style = previousStyle;
        };
    }, []);

    return <Overlay color={bgColor} opacity={opacity} animationDuration={animationDuration} />;
};

HDOverlay.propTypes = {
    bgColor: PropTypes.string,
    opacity: PropTypes.number,
    animationDuration: PropTypes.number
};

HDOverlay.defaultProps = {
    bgColor: '#011831',
    opacity: 0.9,
    animationDuration: 1
};

export default HDOverlay;
