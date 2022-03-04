import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';

const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const location = useLocation();
    const isAppStartPoint = useSelector((state) => state.wizardState.app.isAppStartPoint);

    return (
        <Route {...rest}>
            {isAppStartPoint
                ? <Component />
                : <Redirect to={{ pathname: '/invalidURL', state: { from: location } }} />
            }
        </Route>
    );
};

PrivateRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
    path: PropTypes.string.isRequired
};

export default PrivateRoute;
