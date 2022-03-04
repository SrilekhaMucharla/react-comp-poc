// React
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// Redux
import Thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { logger } from 'redux-logger';
// GW
import { LocaleService } from 'gw-portals-i18n-react';
import { TranslatorContext } from './integration/TranslatorContext';

import 'regenerator-runtime';
// Hastings
import rootReducer from './redux-thunk/reducers/index';
import runWebchat from './customer/directintegrations/webchat/webchat';
import ErrorBoundary from './HDErrorHandler/ErrorBoundary';
import App from './app/App';

runWebchat();

const composeEnhancers = (
    typeof window !== 'undefined'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

function configureStore() {
    return createStore(
        rootReducer,
        composeEnhancers(
            applyMiddleware(
                Thunk,
                logger
            )
        ),
    );
}

const store = configureStore();

let messages = null;

function defaultTranslator(messageID = '') {
    let wrappedKey = messageID;
    if (typeof messageID.id === 'object') {
        wrappedKey = messageID.id;
    }

    if (!messageID.id) {
        wrappedKey = { id: messageID };
    }

    const message = messages[wrappedKey.id];

    if (message === undefined || message === null || message === '') {
        console.warn('Message key ', wrappedKey.id, ' not found!');

        if (wrappedKey.defaultMessage) {
            return wrappedKey.defaultMessage;
        }

        return wrappedKey.id.substring(wrappedKey.id.lastIndexOf('.') + 1);
    }

    return message;
}

// If anyone have better idea, please share!
LocaleService
    .loadMessages('en_GB')
    .then((results) => {
        messages = results;

        ReactDOM.render(
            <ErrorBoundary>
                <Provider store={store}>
                    <Router>
                        <TranslatorContext.Provider value={defaultTranslator}>
                            <App />
                        </TranslatorContext.Provider>
                    </Router>

                </Provider>
            </ErrorBoundary>, document.getElementById('root')
        );
    });
