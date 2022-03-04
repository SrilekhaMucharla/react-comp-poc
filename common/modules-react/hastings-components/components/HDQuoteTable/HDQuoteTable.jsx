import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledDiv = styled.div`
.quote-table-head {
    display:flex;
    background: ${(props) => (props.primary ? 'linear-gradient(90deg, #E7EBF1 50%, #FFF 50%)' : 'linear-gradient(90deg, #FFF 50%, #E7EBF1 50%)')};
    text-align:center;
    border-bottom: 1px solid #60759C;
    & div {
        flex:1;
        font-size:20px;
        font-weight:bold;
        .table-header-label{
            line-height: 21.6px;
            background-color:#0069CC;
            display:inline-block;
            padding:4px 14px;
            border-radius:0 0 4px 4px;
            font-size:18px;
            font-weight: bold;
            color:#fff;
            margin-bottom: 16px;
            @media (max-width: 768px) {
                font-size:12px;
                margin-bottom: 10px;
            }
        }
        @media (max-width: 768px) {
            font-size:18px;
            }
        .table-header-value{
            margin-bottom:37px;
            color: #011831;
            font-family: TTNormsPro;
            font-weight: bold;
            font-size: 18px;
            line-height: 21.6px;
            @media (max-width: 768px) {
                margin-bottom:31.5px;
            }
        }
    }
}
.table-header-label-empty{
    visibility:hidden;
}
.quote-table-body {
    display: flex;
    flex-direction: column;
    background:  ${(props) => (props.primary ? 'linear-gradient(90deg, #E6EFF9 50%, #FFF 50%)' : 'linear-gradient(90deg, #FFF 50%, #E6EFF9 50%)')};
    text-align:center;
}
.quote-table-data-row{
    display: flex;
}

.quote-table-row{
    & > p > p {
        margin-bottom: 0
    }
    &:nth-child(odd) {
        background:  ${(props) => (props.primary ? 'linear-gradient(90deg, #DFE8F4 50%, #F7F7F9 50%)' : 'linear-gradient(90deg, #F7F7F9 50%, #DFE8F4 50%)')};
    }
    & > p {
        margin-top:15px;
        font-size:12px;
        font-family: TTNormsPro;
        font-weight: bold;
        color: #01355a;
        line-height:14.4px;
        &:first-child{
            line-height: 1.2;
            margin-bottom: 0;
            white-space: pre-wrap;
        }
    }
}
.quote-table-head-img{
    width:100%;
    height:100%;
}
.inverted-text{
    font-family: TTNormsPro-Bold;
    font-size: 12px !important;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #FFFFFF;
    position: relative;
    width: 20%;
    margin: 0% 40%;
    padding: 10px;
    border-radius: 2px;
    background-color: #e40034 !important;
    @media (max-width: 768px) {
        width:60%;
        margin: 0% 20%;
    }
}
  
.inverted-text:after{
    content: '';
    position:absolute;
    bottom:100%;
    left:50%;
    margin-left:-10px;
    width:0;
    height:0;
    border-left: 10px solid transparent;
    border-right:10px solid transparent;
    border-bottom:10px solid #e40034 !important;
}

.quote-table-data{
    flex:1;
    font-size:16px;
    font-family: TTNormsPro;
    margin: 15px 10px 20px 10px;
    line-height: 24px;
    &:nth-child(2){
        font-family: TTNormsPro;
        font-weight: bold;
    }
    .quote-table-icon{
        border-radius: 100%;
        color: white;
        &.fa-check{
            background-color: #0069cc;
            padding: 4px 4px;
            font-size: 12px;
        }
        &.fa-times{
            background-color: #E40034;
            padding: 3px 5.5px;
        }
    }
}
`;

const HDQuoteTable = ({ headerValues, data, primary, className }) => {
    return (
        <StyledDiv primary={primary} className={className}>
            <div className="quote-table-head">
                {headerValues.map(({
                    value, imageUrl, topLabel, secondaryLabel
                }) => (
                    <React.Fragment key={value}>
                        {
                            imageUrl ? (
                                <div>
                                    <img className="quote-table-head-img" src={imageUrl} alt={value} />
                                    {secondaryLabel ? <div className="inverted-text">{secondaryLabel}</div> : null}
                                </div>
                            ) : (
                                <div>
                                    <p className={`table-header-label ${!topLabel && 'table-header-label-empty'}`}>{topLabel || 'Enhanced'}</p>
                                    <p className="table-header-value">{value}</p>
                                </div>
                            )
                        }
                    </React.Fragment>
                ))}
            </div>
            <div className="quote-table-body">
                {
                    data && data.length && data.map(({ name, values }) => (
                        <div className="quote-table-row" key={name}>
                            <p>{name}</p>
                            <div className="quote-table-data-row">
                                {values.map((value) => {
                                    const { value: val = value, subheader } = value;
                                    return (
                                        <div className="quote-table-data" key={val}>
                                            {(typeof val === 'boolean') ? (
                                                <i className={`quote-table-icon fas fa-${(val) ? 'check' : 'times'}`} />
                                            ) : (
                                                <>{val}</>
                                            )}
                                            {subheader && <div className="cell-subheader">{subheader}</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                }
            </div>
        </StyledDiv>
    );
};

HDQuoteTable.propTypes = {
    headerValues: PropTypes.arrayOf(PropTypes.shape({
        topLabel: PropTypes.string,
        value: PropTypes.string,
        imageUrl: PropTypes.node,
        secondaryLabel: PropTypes.string
    })).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.node || PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
    })),
    primary: PropTypes.bool,
    className: PropTypes.string
};

HDQuoteTable.defaultProps = {
    data: [],
    primary: false,
    className: ''
};

export default HDQuoteTable;
