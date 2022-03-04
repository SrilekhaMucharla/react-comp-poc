import React from 'react';
import PropTypes from 'prop-types';

const HDDescription = (props) => {
    const {
        quote,
        tooltip,
        label,
        name,
        extraSpace
    } = props;

    return (
        <>
            {label && (
                <div className="hd-description-label">
                    {label.map((labelLine) => (
                        <>
                            <span>{labelLine}</span>
                            <br />
                        </>
                    ))}
                </div>
            )}
            {name && (
                <div className="hd-description-name">
                    {name.map((nameLine) => (
                        <>
                            <span>{nameLine}</span>
                        </>
                    ))
                    }
                </div>
            )}
            <div className="hd-description-detail">
                {quote && quote.single && (
                    <div className="hd-quote" data-testid="description-quote-single">
                        {quote.single}
                    </div>
                )
                }
                {quote && quote.instalments && (
                    <div className="hd-instalments" data-testid="description-quote-instalments">
                        {'('}
                        {quote.instalments.join(' + ')}
                        {')'}
                    </div>

                )}
                {tooltip && (
                    <div className="hd-tooltip-wrapper">
                        {tooltip}
                    </div>
                )
                }
            </div>
            {extraSpace && (
                <div className="hd-extra-spacing" />
            )}
        </>
    );
};

HDDescription.propTypes = {
    quote: PropTypes.shape({
        single: PropTypes.string,
        instalments: PropTypes.arrayOf(PropTypes.string)
    }),
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    name: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.arrayOf(PropTypes.string),
    extraSpace: PropTypes.arrayOf(PropTypes.string),
};

HDDescription.defaultProps = {
    quote: null,
    tooltip: null,
    name: null,
    label: null,
    extraSpace: null
};

export default HDDescription;
