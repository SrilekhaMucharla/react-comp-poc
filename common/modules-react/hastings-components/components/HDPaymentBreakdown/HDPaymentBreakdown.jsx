import React from 'react';
import PropTypes from 'prop-types';
import HDCircle from './HDCircle';
import HDDescription from './HDDescription';

const HDPaymentBreakdown = (props) => {
    const { title, steps, className } = props;

    return (
        <section className={className}>
            <header>
                <h2 className="hd-text-title pt-3 pt-md-0  pl-1 pl-md-0">{title}</h2>
            </header>
            <div className="hd-steps-container theme-white">
                <div className="hd-steps__gradient-col">
                    <div className="hd-steps__gradient-col__vertical-dash" />
                </div>
                <div className="hd-steps__col-container">
                    {steps.map((step, i) => (
                        <div className={`hd-steps__col-container__row ${step.className || ''}`} key={step.id || i} data-testid="payment-breakdown-row">
                            <div className="hd-steps__col-container__row__circle-col">
                                <HDCircle {...step.circle} />
                            </div>
                            <div className="hd-steps__col-container__row__description-col">
                                <HDDescription {...step.description} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

HDPaymentBreakdown.propTypes = {
    title: PropTypes.node.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        circle: PropTypes.shape({ ...HDCircle.propTypes }),
        description: PropTypes.shape({ ...HDDescription.propTypes })
    })).isRequired,
    className: PropTypes.string
};

HDPaymentBreakdown.defaultProps = {
    className: ''
};

export default HDPaymentBreakdown;
