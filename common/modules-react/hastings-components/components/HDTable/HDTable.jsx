/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import HDImageRadioButton from '../HDImageRadioButton/HDImageRadioButton';
import HDTableCell from './HDTableCell';
import HDBubble from '../HDBubble/HDBubble';
import initializeResponsiveObserver from '../../common/initializeResponsiveObserver';

const HDTable = ({
    name,
    headerValues,
    selectedHeaderValue,
    topHeader,
    onSelect,
    data,
    moreDetailsPopups,
    moreDetailsLabel,
    defaultIndex,
    className,
    hideBubbleOnHeaderSticky,
    onlineProduct,
}) => {
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(defaultIndex);
    const tableHeaderRef = useRef();
    const topSentinelRef = useRef();
    const bottomSentinelRef = useRef();

    useEffect(() => {
        setSelectedColumnIndex(defaultIndex);
    }, [defaultIndex]);

    const handleSelection = (event, index) => {
        onSelect(event);
        setSelectedColumnIndex(index);
    };

    const shiftBubbleOnStickyHeader = () => {
        const observerCallback = ([e]) => e.target.classList.toggle('is-stickied', e.intersectionRatio < 1);
        const observerOptions = () => ({ rootMargin: `-${parseInt(getComputedStyle(tableHeaderRef.current).top, 10) + 1}px 0px 100% 0px`, threshold: [1] });
        return initializeResponsiveObserver(observerCallback, observerOptions, tableHeaderRef);
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (hideBubbleOnHeaderSticky) {
            return shiftBubbleOnStickyHeader();
        }
    }, [hideBubbleOnHeaderSticky]);

    const shiftVehicleRibbonOnStickyHeaderIn = () => {
        const observerCallback = ([e]) => {
            const targetInfo = e.boundingClientRect;
            if (e.intersectionRatio < 1 && targetInfo.top < e.rootBounds.top
                && !document.body.classList.contains('vehicle-ribbon-hidden-mobile-landscape')) {
                document.body.classList.add('vehicle-ribbon-hidden-mobile-landscape');
                if (e.boundingClientRect.top <= e.rootBounds.top && e.intersectionRatio > 0) {
                    window.scrollBy({
                        top: 40,
                        behavior: 'smooth'
                    });
                }
            } else if (targetInfo.bottom >= e.rootBounds.top && e.isIntersecting
                && targetInfo.bottom < e.rootBounds.bottom
                && document.body.classList.contains('vehicle-ribbon-hidden-mobile-landscape')) {
                document.body.classList.remove('vehicle-ribbon-hidden-mobile-landscape');
                if (e.boundingClientRect.top <= e.rootBounds.top && e.intersectionRatio < 1) {
                    window.scrollBy({
                        top: -40,
                        behavior: 'smooth'
                    });
                }
            }
        };
        const observerOptions = { threshold: [0, 1] };
        const initializationGuard = () => window.matchMedia('(max-width: 992px) and (orientation: landscape)').matches;
        return initializeResponsiveObserver(observerCallback, observerOptions, topSentinelRef, initializationGuard);
    };

    const shiftVehicleRibbonOnStickyHeaderOut = () => {
        const observerCallback = ([e]) => {
            if (e.intersectionRatio === 1 && e.boundingClientRect.bottom > e.rootBounds.top) {
                document.body.classList.add('vehicle-ribbon-hidden-mobile-landscape');
            } else if (e.boundingClientRect.top < e.rootBounds.top && e.boundingClientRect.bottom < e.rootBounds.bottom) {
                document.body.classList.remove('vehicle-ribbon-hidden-mobile-landscape');
            }
        };
        const observerOptions = { threshold: [1] };
        const initializationGuard = () => window.matchMedia('(max-width: 992px) and (orientation: landscape)').matches;
        return initializeResponsiveObserver(observerCallback, observerOptions, bottomSentinelRef, initializationGuard);
    };

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (document.querySelector('.vehicle-ribbon')) {
            return _.over([shiftVehicleRibbonOnStickyHeaderIn(), shiftVehicleRibbonOnStickyHeaderOut()]);
        }
    }, []);

    const gridTemplateColumns = `repeat(${headerValues.length}, 1fr)`;

    return (
        <div className={`hd-table ${className}`}>
            <div ref={topSentinelRef} className="hd-table__sticky-sentinel hd-table__sticky-sentinel--top" />
            {topHeader}
            <div ref={tableHeaderRef} className="hd-table__header">
                <div className="hd-table__header__grid" style={{ gridTemplateColumns }}>
                    {headerValues.map(({
                        value,
                        image,
                        headerLabelValue,
                        secondaryLabel,
                        stickyHeaderText
                    }, i) => (
                        <>
                            <div
                                key={i}
                                className={classnames('hd-table__header__grid__item', {
                                    selected: (selectedColumnIndex === i)
                                })}
                            >
                                {stickyHeaderText && <HDBubble>{stickyHeaderText}</HDBubble>}
                                <HDImageRadioButton
                                    name={name}
                                    currentValue={value}
                                    value={selectedHeaderValue}
                                    labelValue={headerLabelValue}
                                    secondaryLabel={secondaryLabel}
                                    onChange={(event) => handleSelection(event, i)}
                                    image={image}
                                    selected={selectedColumnIndex === i}
                                    hideInput={!onSelect}
                                    onlineProduct={onlineProduct} />
                            </div>
                        </>
                    ))}
                </div>
            </div>
            <div className="hd-table__body">
                {data.map(({ rowLabel, highlighted, cells }, rowIndex) => (
                    <div
                        className={classnames('hd-table__body__row', { 'hd-table__body__row--highlighted': highlighted })}
                        style={{ gridTemplateColumns }}
                        key={rowIndex}
                    >
                        {rowLabel && (
                            <div className="hd-table__body__row__label">
                                {rowLabel}
                            </div>
                        )}
                        {cells.map(({
                            label,
                            value,
                            topDescription,
                            bottomDescription,
                            extraLines,
                            boldText
                        }, cellIndex) => (
                            <>
                                <div
                                    style={{ gridRow: rowLabel ? '1 / span 2' : '1', gridColumn: `${cellIndex + 1}` }}
                                    className={classnames('hd-table__body__row__cell-bg', { selected: (selectedColumnIndex === cellIndex) })} />
                                <HDTableCell
                                    key={cellIndex}
                                    label={label}
                                    value={value}
                                    topDescription={topDescription}
                                    bottomDescription={bottomDescription}
                                    extraLines={extraLines}
                                    boldText={boldText}
                                    style={{ gridRow: rowLabel ? '2' : '1', gridColumn: `${cellIndex + 1}` }} />
                            </>
                        ))}
                    </div>
                ))}
                {!!moreDetailsPopups.length && (
                    <div className="hd-table__body__row" style={{ gridTemplateColumns }}>
                        {moreDetailsLabel && (
                            <div className="hd-table__body__row__label">
                                {moreDetailsLabel}
                            </div>
                        )}
                        {moreDetailsPopups.map((popup, cellIndex) => (
                            <>
                                <div
                                    style={{ gridRow: moreDetailsLabel ? '1 / span 2' : '1', gridColumn: `${cellIndex + 1}` }}
                                    className={classnames('hd-table__body__row__cell-bg', { selected: (selectedColumnIndex === cellIndex) })} />
                                <div
                                    key={cellIndex}
                                    className={classnames('hd-table__body__row__more-info', { 'hd-table__body__row__more-info--with-label': moreDetailsLabel })}
                                    style={{ gridRow: moreDetailsLabel ? '2' : '1', gridColumn: `${cellIndex + 1}` }}
                                >
                                    {popup}
                                </div>
                            </>
                        ))}
                    </div>
                )}
            </div>
            <div ref={bottomSentinelRef} className="hd-table__sticky-sentinel hd-table__sticky-sentinel--bottom" />
        </div>
    );
};

HDTable.propTypes = {
    name: PropTypes.string.isRequired,
    headerValues: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        image: PropTypes.node,
        headerLabelValue: PropTypes.string,
        secondaryLabel: PropTypes.string,
        stickyHeaderText: PropTypes.node,
    })).isRequired,
    selectedHeaderValue: PropTypes.string,
    topHeader: PropTypes.node,
    onSelect: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.shape({
        rowLabel: PropTypes.string,
        cells: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
            topDescription: PropTypes.string,
            bottomDescription: PropTypes.string,
            extraLines: PropTypes.arrayOf(PropTypes.string),
            boldText: PropTypes.string
        }))
    })),
    moreDetailsPopups: PropTypes.arrayOf(PropTypes.node),
    moreDetailsLabel: PropTypes.string,
    defaultIndex: PropTypes.number,
    className: PropTypes.string,
    onlineProduct: PropTypes.bool,
    hideBubbleOnHeaderSticky: PropTypes.bool
};

HDTable.defaultProps = {
    onSelect: null,
    data: [],
    moreDetailsPopups: [],
    moreDetailsLabel: null,
    selectedHeaderValue: null,
    topHeader: null,
    defaultIndex: -1,
    className: '',
    onlineProduct: false,
    hideBubbleOnHeaderSticky: false
};


export default HDTable;
