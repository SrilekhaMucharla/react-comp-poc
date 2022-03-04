import React from 'react';
// import './HDAgreeAndContinueComponent.scss';
import * as Message from './HDOtherThingsPage.messages';

class HDAgreeAndContinueomponent extends React.Component {
    render() {
        return (
            <div className="agree-container">
                <div className="agree-content">
                    <p className="substitute-vehicle-info-icon"><span>!</span></p>
                    <div className="agree-text">
                        {Message.agreeterms}
                    </div>
                </div>
                <div className="agree-footer" />
            </div>
        );
    }
}
export default HDAgreeAndContinueomponent;
