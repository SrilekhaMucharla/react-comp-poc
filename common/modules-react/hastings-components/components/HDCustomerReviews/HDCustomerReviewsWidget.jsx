import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
// import './HDCustomerReviews.scss';

const BREAKPOINT = 1200;
const RESIZE_EVENT = 'resize';
const REVIEWS_BADGE_ID = 'reviews-badge';

const HDCustomerReviewsWidget = ({
    onLoadReviewsBagde
}) => {
    const calcSize = useCallback(() => ((window.innerWidth < BREAKPOINT) ? 'small' : 'medium'));

    const [size, setSize] = useState(calcSize());

    useEffect(() => {
        const handleResize = () => {
            setSize(calcSize());
        };

        window.addEventListener(RESIZE_EVENT, handleResize);

        return () => window.removeEventListener(RESIZE_EVENT, handleResize);
    }, []);

    useEffect(() => {
        onLoadReviewsBagde(REVIEWS_BADGE_ID, size);
    }, [onLoadReviewsBagde, size]);

    return (
        <div className="customer-reviews-container">
            <div id="badge-horizontal" className="reviews-badge badge-horizontal" />
            <div id="badge-vertical" className="reviews-badge badge-vertical" />
        </div>
    );
};

HDCustomerReviewsWidget.propTypes = {
    onLoadReviewsBagde: PropTypes.func.isRequired,
};

export default HDCustomerReviewsWidget;
