import React from 'react';
import { shallow } from 'enzyme';
import {
    HDButtonRefactor,
    HDButtonDashed,
    HDToggleButtonGroupRefactor,
    HDDropdownList,
    HDTextInputRefactor,
    HDAsyncSelect,
    HDDatePickerRefactor,
    HDSwitch,
    HDTable,
    HDQuoteDownloadRefactor,
    HDLabelRefactor,
    HDCheckboxButtonList,
    HDRadioButtonList,
    HDCheckbox,
    HDCompletedCardInfo
} from 'hastings-components';
import {
    AnalyticsHDButton,
    AnalyticsHDToggleButtonGroup,
    AnalyticsHDDropdownList,
    AnalyticsHDTextInput,
    AnalyticsHDOverlayPopup,
    AnalyticsHDAsyncSelect,
    AnalyticsHDButtonDashed,
    AnalyticsHDModal,
    AnalyticsHDDatePicker,
    AnalyticsHDSwitch,
    AnalyticsHDTable,
    AnalyticsHDQuoteDownload,
    AnalyticsHDLabel,
    AnalyticsHDCheckboxButtonList,
    AnalyticsHDRadioButtonList,
    AnalyticsHDCheckbox,
    AnalyticsHDCompletedCardInfo
} from '../index';


describe('Elements with analytics', () => {
    // given
    const webAnalyticsEvent = {
        analytics_data: 'top secret'
    };
    const otherProps = {
        otherProp: 'some value'
    };
    const id = 'default-id';
    const arrayValues = [{
        value: 'value 1',
        name: 'name 1'
    }, {
        value: 'value 2',
        name: 'name 2'
    }];


    // helpers
    const shouldHaveFunctionsDefined = (wrapper, functions) => {
        const possibleFunctions = [
            'onChange', 'onClick', 'onFocus', 'onBlur', 'onConfirm', 'onCancel', 'onBeforeOpen', 'onSelect'
        ];

        possibleFunctions.forEach((funcName) => {
            if (functions.includes(funcName)) {
                expect(wrapper.props()[funcName]).toBeDefined();
            } else {
                expect(wrapper.props()[funcName] === undefined || wrapper.props()[funcName] === null).toBeTruthy();
            }
        });
    };

    const shouldPassOtherPropsUnchanged = (wrapper) => {
        expect(wrapper.props().otherProp).toBe(otherProps.otherProp);
    };

    describe('AnalyticsHDButtonDashed', () => {
        const getWrapper = () => shallow(<AnalyticsHDButtonDashed webAnalyticsEvent={webAnalyticsEvent} id={id} {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onClick']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDButtonDashed id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDButtonDashed);
            shouldHaveFunctionsDefined(wrapper, ['onClick']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDModal', () => {
        const getWrapper = () => shallow(
            <AnalyticsHDModal
                show
                onConfirm={() => {}}
                webAnalyticsEvent={webAnalyticsEvent}
                id={id}
                {...otherProps}
            >
                <div>Some children</div>
            </AnalyticsHDModal>
        );
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onConfirm', 'onCancel']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDModal show onConfirm={() => {}} id={id} {...otherProps}><div>Some children</div></AnalyticsHDModal>);
            // then
            shouldHaveFunctionsDefined(wrapper, ['onConfirm', 'onCancel']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });


    describe('AnalyticsHDButton', () => {
        const getWrapper = () => shallow(<AnalyticsHDButton webAnalyticsEvent={webAnalyticsEvent} id={id} {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onClick']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDButton id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDButtonRefactor);
            shouldHaveFunctionsDefined(wrapper, ['onClick']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDToggleButtonGroup', () => {
        const getWrapper = () => shallow(
            <AnalyticsHDToggleButtonGroup availableValues={arrayValues} webAnalyticsEvent={webAnalyticsEvent} id={id} {...otherProps} />
        );
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDToggleButtonGroup availableValues={arrayValues} id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDToggleButtonGroupRefactor);
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDDropdownList', () => {
        const getWrapper = () => shallow(<AnalyticsHDDropdownList options={arrayValues} webAnalyticsEvent={webAnalyticsEvent} id={id} {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDDropdownList options={arrayValues} id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDDropdownList);
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDTextInput', () => {
        const getWrapper = () => shallow(<AnalyticsHDTextInput webAnalyticsEvent={webAnalyticsEvent} id={id} {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur', 'onFocus']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDTextInput id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDTextInputRefactor);
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur', 'onFocus']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDOverlayPopup', () => {
        const getWrapper = () => shallow(
            <AnalyticsHDOverlayPopup
                webAnalyticsEvent={webAnalyticsEvent}
                id={id}
                {...otherProps}
            >
                <div>Some children</div>
            </AnalyticsHDOverlayPopup>
        );
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onConfirm', 'onCancel']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDOverlayPopup id={id} {...otherProps}><div>Some children</div></AnalyticsHDOverlayPopup>);
            // then
            shouldHaveFunctionsDefined(wrapper, ['onConfirm', 'onCancel']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDAsyncSelect', () => {
        const getWrapper = () => shallow(<AnalyticsHDAsyncSelect webAnalyticsEvent={webAnalyticsEvent} id={id} {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDAsyncSelect id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDAsyncSelect);
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDDatePicker', () => {
        const getWrapper = () => shallow(<AnalyticsHDDatePicker
            webAnalyticsEvent={webAnalyticsEvent}
            id={id}
            {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur', 'onConfirm', 'onSelect']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDDatePicker id={id} {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDDatePickerRefactor);
            shouldHaveFunctionsDefined(wrapper, ['onChange', 'onBlur', 'onConfirm', 'onSelect']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDSwitch', () => {
        const getWrapper = () => shallow(<AnalyticsHDSwitch
            values={arrayValues}
            value={arrayValues[0].name}
            path="path"
            name="name"
            webAnalyticsEvent={webAnalyticsEvent}
            id={id}
            {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDSwitch
                values={arrayValues}
                value={arrayValues[0].name}
                path="path"
                name="name"
                id={id}
                {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDSwitch);
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });


    describe('AnalyticsHDTable', () => {
        const getWrapper = () => shallow(<AnalyticsHDTable
            headerValues={[
                {
                    value: 'value',
                    image: <div>img</div>,
                    headerLabelValue: 'headerLabelValue',
                    secondaryLabel: 'secondaryLabel',
                    stickyHeaderText: 'stickyHeaderText'
                }
            ]}
            name="name"
            onSelect={() => {}}
            webAnalyticsEvent={webAnalyticsEvent}
            id={id}
            {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onSelect']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDTable
                headerValues={[
                    {
                        value: 'value',
                        image: <div>img</div>,
                        headerLabelValue: 'headerLabelValue',
                        secondaryLabel: 'secondaryLabel',
                        stickyHeaderText: 'stickyHeaderText'
                    }
                ]}
                name="name"
                onSelect={() => {}}
                id={id}
                {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDTable);
            shouldHaveFunctionsDefined(wrapper, ['onSelect']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });


    describe('AnalyticsHDQuoteDownload', () => {
        const getWrapper = () => shallow(<AnalyticsHDQuoteDownload
            linkText="Link"
            showIcon={false}
            onClick={() => {}}
            webAnalyticsEvent={webAnalyticsEvent}
            id={id}
            {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onClick']);
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDQuoteDownload
                linkText="Link"
                showIcon={false}
                onClick={() => {}}
                id={id}
                {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDQuoteDownloadRefactor);
            shouldHaveFunctionsDefined(wrapper, ['onClick']);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDLabel', () => {
        const getWrapper = () => shallow(<AnalyticsHDLabel
            Tag="r"
            text="Something"
            className="label-with-icon align-items-start"
            id={id}
            iconPosition="l"
            adjustImagePosition={false}
            href="https://www.hastingsdirect.com"
            target="SomeTarget"
            webAnalyticsEvent={webAnalyticsEvent}
            {...otherProps} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldPassOtherPropsUnchanged(wrapper);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDLabel
                Tag="r"
                text="Something"
                className="label-with-icon align-items-start"
                id={id}
                iconPosition="l"
                adjustImagePosition={false}
                href="https://www.hastingsdirect.com"
                target="SomeTarget"
                {...otherProps} />);
            // then
            expect(wrapper.type()).toBe(HDLabelRefactor);
            shouldPassOtherPropsUnchanged(wrapper);
        });
    });

    describe('AnalyticsHDCheckboxButtonList', () => {
        const getWrapper = () => shallow(<AnalyticsHDCheckboxButtonList
            className="Something"
            colProps={{ xs: 12, lg: 10, xl: 8 }}
            items={[]}
            selectedItems={[]}
            onChange={() => {}}
            webAnalyticsEvent={webAnalyticsEvent} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDCheckboxButtonList
                className="Something"
                colProps={{ xs: 12, lg: 10, xl: 8 }}
                items={[]}
                selectedItems={[]}
                onChange={() => {}} />);
            // then
            expect(wrapper.type()).toBe(HDCheckboxButtonList);
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
        });
    });

    describe('AnalyticsHDRadioButtonList', () => {
        const innerValue = {
            id: 'SomeID',
            label: 'Some Label',
            value: 'Required Value'
        };
        const getWrapper = () => shallow(<AnalyticsHDRadioButtonList
            className="Something"
            items={[]}
            value={innerValue}
            onChange={() => {}}
            webAnalyticsEvent={webAnalyticsEvent} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDRadioButtonList
                className="Something"
                items={[]}
                value={innerValue}
                onChange={() => {}} />);
            // then
            expect(wrapper.type()).toBe(HDRadioButtonList);
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
        });
    });

    describe('AnalyticsHDCheckbox', () => {
        const getWrapper = () => shallow(<AnalyticsHDCheckbox
            path="path.to.toggle-button"
            name="toggle-button-name"
            value="Some value"
            label="Some Label"
            className="some-class-name"
            doReset={false}
            data="String"
            type="checkbox"
            text="Sample text"
            onChange={() => {}}
            webAnalyticsEvent={webAnalyticsEvent} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDCheckbox
                path="path.to.toggle-button"
                name="toggle-button-name"
                value="Some value"
                label="Some Label"
                className="some-class-name"
                doReset={false}
                data="String"
                type="checkbox"
                text="sample text"
                onChange={() => {}} />);
            // then
            expect(wrapper.type()).toBe(HDCheckbox);
            shouldHaveFunctionsDefined(wrapper, ['onChange']);
        });
    });

    describe('AnalyticsHDCompletedCardInfo', () => {
        const getWrapper = () => shallow(<AnalyticsHDCompletedCardInfo
            text="Some sample text"
            additionalText="Some additional text"
            variant="driver"
            editTabIndex={0}
            deleteTabIndex={1}
            onEdit={() => {}}
            onDelete={() => {}}
            onEditKeyDown={() => {}}
            onDeleteKeyDown={() => {}}
            webAnalyticsEvent={webAnalyticsEvent} />);
        it('should render and match the snapshot', () => {
            // given
            const wrapper = getWrapper();
            // then
            expect(wrapper).toMatchSnapshot();
        });

        it('should pass functions to component when webAnalyticsEvent prop is provided', () => {
            // given
            const wrapper = getWrapper();
            // then
            shouldHaveFunctionsDefined(wrapper, ['onEdit']);
            shouldHaveFunctionsDefined(wrapper, ['onDelete']);
            shouldHaveFunctionsDefined(wrapper, ['onEditKeyDown']);
            shouldHaveFunctionsDefined(wrapper, ['onDeleteKeyDown']);
        });

        it('should return the same component if webAnalyticsEvent is not provided', () => {
            // given
            const wrapper = shallow(<AnalyticsHDCompletedCardInfo
                text="Some sample text"
                additionalText="Some additional text"
                variant="driver"
                editTabIndex={0}
                deleteTabIndex={1}
                onEdit={() => {}}
                onDelete={() => {}}
                onEditKeyDown={() => {}}
                onDeleteKeyDown={() => {}} />);
            // then
            expect(wrapper.type()).toBe(HDCompletedCardInfo);
            shouldHaveFunctionsDefined(wrapper, ['onEdit']);
            shouldHaveFunctionsDefined(wrapper, ['onDelete']);
            shouldHaveFunctionsDefined(wrapper, ['onEditKeyDown']);
            shouldHaveFunctionsDefined(wrapper, ['onDeleteKeyDown']);
        });
    });
});
