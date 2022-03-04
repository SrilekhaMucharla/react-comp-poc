import React from 'react';
import defaultTranslator from '../testHelper';
import { TranslatorContext } from '../../../../integration/TranslatorContext';

const withTranslator = (content, translator = defaultTranslator) => {
    // eslint-disable-next-line no-undef
    const ContentToRender = renderContent(content);
    return (
        <TranslatorContext.Provider value={translator}>
            <ContentToRender />
        </TranslatorContext.Provider>
    );
};

export default withTranslator;
