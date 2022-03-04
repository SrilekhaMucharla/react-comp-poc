import React from 'react';
import PropTypes from 'prop-types';
import { HDLabelRefactor } from 'hastings-components';


export default function HDHeader({ messages }) {
    return (
        <header>
            <HDLabelRefactor
                id="important-stuff-header"
                className="text-white"
                Tag="h1"
                text={messages.title} />
            <HDLabelRefactor
                id="important-stuff-subheader"
                className="text-white"
                Tag="p"
                text={messages.paragraphText} />
        </header>
    );
}

HDHeader.propTypes = {
    messages: PropTypes.shape({ title: PropTypes.string, paragraphText: PropTypes.string })
};

HDHeader.defaultProps = {
    messages: { title: '', paragraphText: '' }
};
