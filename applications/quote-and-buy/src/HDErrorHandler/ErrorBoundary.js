import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HDInvalidURLErrorPage from '../pages/HDInvalidURLErrorPage/HDInvalidURLErrorPage';

export default class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: ''
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error) {
        this.setState({ error });
    }

    render() {
        const { hasError, error } = this.state;

        if (hasError) {
            // eslint-disable-next-line no-console
            console.error(error);

            return (
                <HDInvalidURLErrorPage />
            );
        }
        // eslint-disable-next-line react/destructuring-assignment
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node),
        PropTypes.node]).isRequired,
};
