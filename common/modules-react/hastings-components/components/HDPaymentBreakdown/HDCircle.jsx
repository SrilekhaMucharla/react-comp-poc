import React from 'react';
import PropTypes from 'prop-types';
import greenTickIcon from '../../icons/green-tick-icon.svg';

const HDCircle = (props) => {
    const { date, type } = props;

    if (type === 'green') {
        return (
            <div id className="hd-step-circle-green" data-testid="circle-green">
                <img width="38px" src={greenTickIcon} alt="green tick icon" />
            </div>
        );
    }

    if (type === 'violet') {
        return (
            <div className="hd-step-circle-date" data-testid="circle-violet">
                <span><strong>{date.day}</strong></span>
                <span>{date.shortMonth}</span>
            </div>
        );
    }

    return (
        date
            ? (
                <div className="hd-step-circle-date" data-testid="circle-date">
                    <span><strong>{date.day}</strong></span>
                    <span>{date.shortMonth}</span>
                </div>
            )
            : <div className="hd-step-circle-small" data-testid="circle-dot" />
    );
};

HDCircle.propTypes = {
    date: PropTypes.shape({
        day: PropTypes.number,
        shortMonth: PropTypes.string
    }),
    type: PropTypes.oneOf(['green', 'violet', 'dot'])
};

HDCircle.defaultProps = {
    date: null,
    type: 'dot'
};

export default HDCircle;
