import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
// import './HastingsDirectIntroPage.scss';
import { connect } from 'react-redux';
import HastingDirectCustomerPage from '../HastingDirectCustomerPage/HastingDirectCustomerPage';

class HastingsDirectIntroPage extends Component {
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func
        }).isRequired
    };

    render() {
        return (
            <div className="introContainer" id="hdIntroMainContainer">
                <HastingDirectCustomerPage
                    {...this.props}
                />
            </div>
        );
    }
}

export default withRouter(connect()(HastingsDirectIntroPage));
