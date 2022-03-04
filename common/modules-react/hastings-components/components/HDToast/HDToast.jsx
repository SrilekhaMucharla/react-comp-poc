import React from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'react-bootstrap';
import tickIcon from './assets/022_tick.svg';
import tickLightIcon from './assets/022_tick_light.svg';
import tickIconWhite from './assets/tick-icon-white.svg';
import crossIcon from './assets/023_cross.svg';
// import './HDToast.scss';

const iconTypeDict = {
    tick: {
        icon: tickIcon,
        alt: 'toast tick icon',
        class: 'hd-toast-icon--tick'
    },
    tickLight: {
        icon: tickLightIcon,
        alt: 'toast tick icon',
        class: 'hd-toast-icon--tick-light'
    },
    tickWhite: {
        icon: tickIconWhite,
        alt: 'toast tick icon',
        class: 'hd-toast-icon--white'
    },
    cross: {
        icon: crossIcon,
        alt: 'toast cross icon',
        class: 'hd-toast-icon--cross'
    }
};

const HDToast = ({
    position,
    toastList
}) => {
    return (toastList && (
        <div className={`hd-toast-list-container ${position}`}>
            {toastList.map((toast) => {
                return (
                    <Toast className={`hd-toast hd-toast--${toast.bgColor}`}>
                        <Toast.Body>
                            <img
                                className={`hd-toast-icon ${iconTypeDict[toast.iconType].class}`}
                                src={iconTypeDict[toast.iconType].icon}
                                alt={iconTypeDict[toast.iconType].alt} />
                            <div className="hd-toast-text-wrapper">
                                {toast.content}
                            </div>
                        </Toast.Body>
                    </Toast>
                );
            })}
        </div>
    )
    );
};

HDToast.propTypes = {
    position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-right', 'bottom-left']),
    toastList: PropTypes.arrayOf(PropTypes.shape({
        bgColor: PropTypes.oneOf(['main', 'light']),
        iconType: PropTypes.oneOf(['tick', 'cross']),
        content: PropTypes.node
    })).isRequired
};

export default HDToast;
