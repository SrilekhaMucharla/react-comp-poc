import React, { useContext, useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved
import { CookiesProvider } from 'react-cookie';
// eslint-disable-next-line import/no-unresolved
import productMetadata from 'product-metadata';
import { ViewModelServiceFactory } from 'gw-portals-viewmodel-js';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import { TranslatorContext } from '../integration/TranslatorContext';

import BaseRouter from '../routes/BaseRouter/BaseRouter';
// import './App.scss';
import '../assets/sass-refactor/main.scss';
import { BASENAME } from '../routes/BaseRouter/RouteConst';

export default function App() {
    const translator = useContext(TranslatorContext);

    const viewModelService = useMemo(() => ViewModelServiceFactory.getViewModelService(productMetadata, translator), [translator]);

    return (
        <ViewModelServiceContext.Provider value={viewModelService}>
            <CookiesProvider>
                <Router basename={BASENAME}>
                    <BaseRouter />
                </Router>
            </CookiesProvider>
        </ViewModelServiceContext.Provider>
    );
}
