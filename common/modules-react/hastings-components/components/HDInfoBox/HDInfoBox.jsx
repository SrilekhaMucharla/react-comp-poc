import React from 'react';
import PropTypes from 'prop-types';


const HDInfoBox = ({ policyDetails }) => {
    return (
        <table>
            <tbody className="hd-info-box__table__body">
                {policyDetails.map(({ key, value }, rowIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={rowIndex}>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

HDInfoBox.propTypes = {
    policyDetails: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
    })).isRequired,
};

export default HDInfoBox;
