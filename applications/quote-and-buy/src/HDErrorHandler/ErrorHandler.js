import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import HDInvalidURLErrorPage from '../pages/HDInvalidURLErrorPage/HDInvalidURLErrorPage';
import HDDataSchemaErrorPage from '../pages/HDDataSchemaErrorPage/HDDataSchemaErrorPage';
import { clearErrorStatusCode } from '../redux-thunk/actions/errorStatusCode.action';
import HDQuoteDeclinePage from '../pages/wizard-pages/HDQuoteDeclinePage/HDQuoteDeclinePage';

// Error handle component: it will wrap all our app roots and render fallback error UI component
const ErrorHandler = ({ children }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const errorStatusCode = useSelector((state) => state.errorStatus.errorStatusCode);

    // clean the errorStatusCode and listner whenever the user navigates to a new URL
    // After rendering error state
    React.useEffect(() => {
        // Listen for changes to the current location.
        const unlisten = history.listen(() => {
            dispatch(clearErrorStatusCode());
        });
        // cleanup the listener on unmount
        return unlisten;
    }, []);

    // If found errorStatusCode render an error page. If there is no error status, then render
    // the children as normal
    const renderContent = () => {
        if (errorStatusCode === 404) {
            return <HDInvalidURLErrorPage />;
        }
        if (errorStatusCode === 716) {
            return (
                <div className="page-content-wrapper">
                    <HDQuoteDeclinePage showHomepageButton />
                </div>
            );
        }
        if (errorStatusCode === 503 || errorStatusCode) {
            return <HDDataSchemaErrorPage />;
        }
        return children;
    };

    return (
        <>
            {renderContent()}
        </>
    );
};

ErrorHandler.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node),
        PropTypes.node]).isRequired,
};

export default ErrorHandler;
