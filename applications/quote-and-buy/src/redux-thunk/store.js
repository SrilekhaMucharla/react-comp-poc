import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers/index';

const store = createStore(
    rootReducer,
    {},
    compose(
        applyMiddleware()
    )
);

export default store;
