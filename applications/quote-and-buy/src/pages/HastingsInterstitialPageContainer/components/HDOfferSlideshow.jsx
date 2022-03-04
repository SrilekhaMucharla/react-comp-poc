import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'react-bootstrap';

function HDOfferSlideshow(props) {
    const { items, interval } = props;
    return (
        <Carousel fade interval={interval} pause={false} controls={false} indicators={false}>
            {(items && items.length > 0) && items.map((subtitle, index) => (
                <Carousel.Item key={`item no ${index + 1}`}>
                    {subtitle}
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

HDOfferSlideshow.propTypes = {
    items: PropTypes.arrayOf(PropTypes.element).isRequired,
    interval: PropTypes.number
};

HDOfferSlideshow.defaultProps = {
    interval: 1000
};

export default HDOfferSlideshow;
