import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import HastingsDirectIntroPage from '../HastingsDirectIntroPage/HastingsDirectIntroPage';

const HastingDirectContainer = (props) => {
    return (
        <div className="hasting-direct-container car-bg-outer">
            <HastingsDirectIntroPage {...props} />
            <div className="car-bg" />
        </div>
    );
};

export default withRouter(connect()(HastingDirectContainer));
