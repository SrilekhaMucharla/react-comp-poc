import { ViewModelServiceFactory } from 'gw-portals-viewmodel-js';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
// only first component for testing
import {
    HDButton,
    HDButtonRefactor, HDCheckboxButtonList, HDDataCard, HDDatePicker, HDDropdownList,
    HDForm,
    HDImageRadioButton,
    HDInfoCard,
    HDInfoCardRefactor,
    HDInteractiveCard,
    HDLabel,
    HDLabelRefactor,
    HDModal, HDOverlayPopup, HDPaymentBreakdown, HDPolicySelect, HDRadioButtonList, HDStepper, HDTable, HDTextInput, HDTextInputRefactor, HDToggleButtonGroup,
    HDWarningModal
} from 'hastings-components';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
// eslint-disable-next-line import/no-unresolved
import productMetadata from 'product-metadata';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import TipCirclePurple from '../assets/images/icons/tip_circle_purple.svg';
import iconDownload from '../assets/images/wizard-images/hastings-icons/icons/hd-download.svg';
import hdLogo from '../assets/images/wizard-images/hastings-icons/logos/hastings-direct.svg';
import heLogo from '../assets/images/wizard-images/hastings-icons/logos/hastings-essential.svg';
import hpLogo from '../assets/images/wizard-images/hastings-icons/logos/hastings-premier.svg';
import ydLogo from '../assets/images/wizard-images/hastings-icons/logos/hastings-youdrive.svg';
import '../assets/sass-refactor/main.scss';
import { TranslatorContext } from '../integration/TranslatorContext';
import BackNavigation from '../pages/Controls/BackNavigation/BackNavigation';
import './App.scss';

// TODO: create demo storybook
export default function Storybook() {
    const [viewModelService, setViewModelService] = useState(undefined);

    const [selectedListItem, setSelectedListItem] = useState('');

    const [regNumber, setRegNumber] = useState('');
    const [drivingLicence, setDrivingLicence] = useState('');
    const [action, setAction] = useState('');
    const [coverLevel, setCoverLevel] = useState('HE');
    const [showModal, setShowModal] = useState(false);
    const [policySelected, setPolicySelected] = useState('standard');
    const [dropdownDataValue, setDropdownDataValue] = useState('');
    const [testValue, setTestValue] = useState({ value: 'hhh', label: 'rrrr' });


    const exampleDivContent = <div style={{ marginBottom: '20px' }}>Example optional content</div>;

    const listItems = [
        {
            label: 'item 01', id: 1, value: 'value 1', content: exampleDivContent
        },
        {
            label: 'item 02', id: 2, value: 'value 2', content: exampleDivContent
        },
        {
            label: 'item 03', id: 3, value: 'value 3', content: exampleDivContent
        },
        {
            label: 'item 04', id: 4, value: 'value 4', content: exampleDivContent
        },
        {
            label: 'item 05', id: 5, value: 'value 5', content: exampleDivContent
        },
    ];
    const [selectedListItems, setSelectedListItems] = useState([listItems[2], listItems[4]]);

    const onRadioButtonListSelect = (event, item) => {
        setSelectedListItem(item);
    };
    const onCheckboxButtonListSelect = (event, item) => {
        if (selectedListItems.some((elem) => elem.id === item.id)) {
            setSelectedListItems(selectedListItems.filter((elem) => elem.id !== item.id));
        } else {
            setSelectedListItems([...selectedListItems, item]);
        }
    };

    const translator = useContext(TranslatorContext);

    useEffect(() => {
        setViewModelService(ViewModelServiceFactory.getViewModelService(productMetadata, translator));
    }, [translator]);

    const availableValues = [
        {
            value: true,
            name: 'Yes',
            icon: 'check'
        },
        {
            value: false,
            name: 'No',
            icon: 'times'
        }
    ];

    if (!viewModelService) {
        return '';
    }

    const paymentBreakdownProps = {
        title: 'What you\'ll pay and when',
        steps: [{
            id: 1,
            circle: {
                type: 'green',
                date: { day: '12', shortMonth: 'Dec' }
            },
            description: {
                label: ['RFI2 SJI'],
                name: ['Initial payment today'],
                quote: { single: '£58.49' },
                tooltip: 'Why today?'
            }
        }, {
            id: 2,
            circle: {
                date: { day: '14', shortMonth: 'Dec' }
            },
            description: {
                label: ['RF12 SJI'],
                name: ['Cover starts'],
            }
        }, {
            id: 3,
            circle: {
                type: 'dot'
            },
            description: {
                name: ['2 monthly payments', '(starting on your chosen date)'],
                quote: { single: '£42.21' }
            }
        }, {
            id: 4,
            circle: {
                date: { day: '08', shortMonth: 'Feb' },
            },
            description: {
                label: ['SH70 CHU'],
                name: ['Initial payment due'],
                quote: { single: '£56.44' },
            }
        }, {
            id: 5,
            circle: {
                date: { day: '14', shortMonth: 'Feb' },
            },
            description: {
                label: ['SH70 CHU'],
                name: ['Cover starts'],
            },
        }, {
            id: 6,
            circle: {
                type: 'dot'
            },
            description: {
                name: ['7 monthly payments for two cars'],
                quote: { single: '£95.50', instalments: ['£35.50', '£65.00'], }
            }
        },
        {
            id: 7,
            circle: {
                date: { day: '12', shortMonth: 'Dec' }
            },
            description: {
                tooltip: (
                    <HDOverlayPopup
                        id="example"
                        overlayButtonIcon={
                            (
                                <>
                                    <span className="fas fa-refresh" />
                                    {' '}
                                    <span>Policy renews</span>
                                </>

                            )}
                    >
                        <h2>Policy renews</h2>
                        <p>This is HDOverlayPopup integration example that will require props adjustment.</p>
                        <p>We can pass tooltip directly or obscure it with PaymentBreakdown and pass icon and label as props</p>
                    </HDOverlayPopup>
                )
            }
        }]
    };

    // TODO: VM initialization, to be removed after Wizard is ready
    const submission = {
        baseData: {
            periodStatus: 'Draft',
            producerCode: 'GoCompare',
            termType: 'Annual',
            isPostalDocument: false,
            marketingContacts: {
                allowSMS: false,
                allowPost: false,
                allowEmail: false,
                allowTelephone: false
            },
            isExistingCustomer: false,
            jobType: 'Submission',
            productCode: 'PrivateCar_Ext',
            policyAddress: {},
            productName: 'Private Car'
        },
        lobData: {
            privateCar: {
                preQualQuestionSets: [],
                coverables: {
                    drivers: [
                        {
                            residingInUKSince: {},
                            licenceObtainedDate: {}
                        }
                    ],
                    vehicleDrivers: [],
                    addInterestTypeCategory: 'PAVhcleAddlInterest',
                    vehicles: [
                        {
                            costNew: {
                                amount: '',
                                currency: 'gbp'
                            },
                            vehicleModifications: [{}]
                        }
                    ]
                }
            }
        }
    };

    const submissionVM = viewModelService.create(submission, 'pc', 'edgev10.capabilities.quote.submission.dto.QuoteDataDTO');

    // TODO: end VM initialization

    // TODO: start of vm validation example
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';

    const costPath = `${vehiclePath}.costNew`;
    const costAmountFieldname = 'amount';
    const costAmountPath = `${costPath}.${costAmountFieldname}`;

    const isCarModifiedFieldname = 'isCarModified';
    const isCarModifiedPath = `${vehiclePath}.${isCarModifiedFieldname}`;

    const isRegisteredKeeperAndLegalOwnerFieldname = 'isRegisteredKeeperAndLegalOwner';
    const isRegisteredKeeperAndLegalOwnerPath = `${vehiclePath}.${isRegisteredKeeperAndLegalOwnerFieldname}`;

    const registeredKeeperFieldname = 'registeredKeeper';
    const registeredKeeperPath = `${vehiclePath}.${registeredKeeperFieldname}`;

    const policyStartDateFieldName = 'periodStartDate';
    const policyStartDatePath = `baseData.${policyStartDateFieldName}`;
    // _.set(submissionVM, policyStartDatePath, new Date());

    const registeredKeeperAvailableValues = _.get(submissionVM, registeredKeeperPath).aspects.availableValues.map((typeCode) => {
        return {
            value: typeCode.code,
            label: translator({
                id: typeCode.name,
                defaultMessage: typeCode.name
            })
        };
    });

    const todayAtMidnight = new Date(new Date().setHours(0, 0, 0, 0));
    const validationSchema = yup.object({
        [costAmountFieldname]: yup.number().required('This filed is required, custom message').VMValidation(costPath, null, submissionVM),
        [isCarModifiedFieldname]: yup.bool().VMValidation(isCarModifiedPath, 'This field is required', submissionVM),
        [isRegisteredKeeperAndLegalOwnerFieldname]: yup
            .bool()
            .required()
            .VMValidation(isRegisteredKeeperAndLegalOwnerPath, 'This field is required', submissionVM),
        [registeredKeeperFieldname]: yup.string().required().VMValidation(registeredKeeperPath, 'This field is required', submissionVM),
        [policyStartDateFieldName]: yup
            .date()
            .required('Sorry, we don\'t recognise that date. Please try again.')
            .min(todayAtMidnight, 'Sorry, you can\'t use a date in the past. Please try again.')
            // .max(todayAtMidnight, 'Sorry, you can\'t use a date in the future. Please try again.')
            .VMValidation(policyStartDatePath, 'VM Validation error', submissionVM)
    });
    // TODO: example of vm validation

    const modalBody = <span>This will remove the modification.</span>;
    const createPolicySelect = (event) => {
        setPolicySelected(event.target.value);
    };

    const dropdownDataTemp = [
        { value: 'aaaa', label: 'bbbbb' },
        { value: 'aaaa1', label: 'bbbbb1' },
        { value: 'aaaa3', label: 'bbbbb3' },
        { value: 'aaaa4', label: 'bbbbb4' }
    ];


    const selectOwnerTwo = (owner) => {
        setDropdownDataValue({
            value: owner.target.value.value,
            label: owner.target.value.label
        });

        setTestValue(owner.target.value);
    };

    return (
        <ViewModelServiceContext.Provider value={viewModelService}>
            <div className="page-content-wrapper background-body">
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12} md={6} className="p-4">
                            <HDDropdownList
                                theme="blue"
                                options={dropdownDataTemp}
                                data={dropdownDataValue}
                                onChange={selectOwnerTwo}
                                placeholder="Banana"
                                isSearchable={false}
                                value={testValue}
                                enableNative />
                            <h4>Test Value: </h4>
                            <p>Label: {testValue.label}</p>
                            <p>Value: {testValue.value}</p>
                            <h4>Data: </h4>
                            <p>Label: {dropdownDataValue.label}</p>
                            <p>Value: {dropdownDataValue.value}</p>
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12} md={6} className="p-4">
                            {/* use 'back-button' className to position absolutely on a page */}
                            <BackNavigation
                                className="mb-0"
                                onClick={() => { }}
                                onKeyPress={() => { }} />
                            <BackNavigation
                                className="mb-0"
                                onClick={() => { }}
                                onKeyPress={() => { }}
                                disabled />
                        </Col>
                        <Col xs={12} md={6} className="background-mono theme-white p-4">
                            <BackNavigation
                                className="mb-0"
                                onClick={() => { }}
                                onKeyPress={() => { }} />
                            <BackNavigation
                                className="mb-0"
                                onClick={() => { }}
                                onKeyPress={() => { }}
                                disabled />
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12} md={6}>
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" icon={<img src={iconDownload} alt="download icon" />} iconPosition="l" />
                            <br />
                            <HDLabelRefactor
                                Tag="a"
                                text="Anchor Sample"
                                href="#"
                                icon={<img src={iconDownload} alt="download icon" />}
                                iconPosition="l"
                                className="is-disabled" />
                        </Col>
                        <Col xs={12} md={6} className="background-mono theme-white p-4 text-left">
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" icon={<img src={iconDownload} alt="download icon" />} iconPosition="l" />
                            <br />
                            <HDLabelRefactor
                                Tag="a"
                                text="Anchor Sample"
                                href="#"
                                icon={<img src={iconDownload} alt="download icon" />}
                                iconPosition="l"
                                className="is-disabled" />
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12} md={6}>
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" className="secondary-style" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" className="secondary-style is-disabled" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" className="secondary-style" />
                        </Col>
                        <Col xs={12} md={6} className="background-mono theme-white p-4 text-left">
                            <HDLabelRefactor Tag="a" text="Anchor Sample" className="secondary-style" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" className="secondary-style is-disabled" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" className="secondary-style" />
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12} md={6}>
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" className="is-disabled" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" />
                        </Col>
                        <Col xs={12} md={6} className="background-mono theme-white p-4 text-left">
                            <HDLabelRefactor Tag="a" text="Anchor Sample" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" href="#" className="is-disabled" />
                            <br />
                            <HDLabelRefactor Tag="a" text="Anchor Sample" />
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12}>
                            <HDTextInputRefactor
                                id="random-ID"
                                className=""
                                placeholder="Sample text"
                                type="currency"
                                icon="pound-sign"
                                maxLength="11" />
                            <HDTextInputRefactor
                                id="random-ID2"
                                className=""
                                path=""
                                name="Sample text"
                                maxLength="8"
                                preText="GB"
                                reset=""
                                type="alphanum"
                                onChange=""
                                placeholder="Sample text" />
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={12} md={6}>
                            <HDLabelRefactor Tag="h1" text="H1 Font Sample" />
                            <HDLabelRefactor Tag="h2" text="H2 Font Sample" />
                            <HDLabelRefactor Tag="h3" text="H3 Font Sample" />
                            <HDLabelRefactor Tag="h4" text="H4 Font Sample" />
                            <HDLabelRefactor Tag="p" text="Paraghaph text. Lorem ipsum dot minor est." />
                            <HDLabelRefactor className="font-bold" Tag="p" text="Paraghaph text. Lorem ipsum dot minor est." />
                        </Col>
                        <Col xs={12} md={6}>
                            <HDLabelRefactor Tag="h1" text="H1 Font Sample" />
                            <HDLabelRefactor Tag="h2" text="H2 Font Sample" />
                            <HDLabelRefactor Tag="h3" text="H3 Font Sample" />
                            <HDLabelRefactor Tag="h4" text="H4 Font Sample" />
                            <HDLabelRefactor Tag="p" text="Paraghaph text. Lorem ipsum dot minor est." />
                            <HDLabelRefactor className="font-bold" Tag="p" text="Paraghaph text. Lorem ipsum dot minor est." />
                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl">
                    <Row>
                        <Col xs={6} className="p-4">
                            <HDTextInputRefactor
                                className="mt-2"
                                type="number"
                                maxLength="7"
                                path="{distancePathame}"
                                name="{distanceFieldname}"
                                value=""
                                placeholder="Placeholder text"
                                id="car-mileage-inputsss"
                                onChange="{(event) => handleEventChange(event, hdProps)}"
                                appendLabel="Miles"
                                thousandSeprator />

                            <HDButtonRefactor variant="primary" label="Test button label" className="mt-2" />
                            <HDButtonRefactor variant="secondary" label="Test button label" className="mt-2" />
                            <HDButtonRefactor variant="tertiary" label="Test button label" className="mt-2" />
                            <HDButtonRefactor variant="default" label="Test button label" className="mt-2" />
                            <HDButtonRefactor variant="primary" className="hd-btn-card mt-2" label="Test button label" />

                        </Col>

                        <Col xs={6} className="background-mono theme-white p-4">
                            <HDTextInputRefactor
                                className="mt-2"
                                type="number"
                                maxLength="7"
                                path="{distancePathame}"
                                name="{distanceFieldname}"
                                value=""
                                placeholder="Placeholder text"
                                id="car-mileage-inputsss"
                                onChange="{(event) => handleEventChange(event, hdProps)}"
                                appendLabel="Miles"
                                thousandSeprator />

                            <HDButtonRefactor variant="primary" className="theme-white mt-2" label="Test button label" />
                            <HDButtonRefactor variant="secondary" className="theme-white mt-2" label="Test button label" />
                            <HDButtonRefactor variant="tertiary" className="theme-white mt-2" label="Test button label" />
                            <HDButtonRefactor variant="primary" className="hd-btn-card theme-white mt-2" label="Test button label" />

                        </Col>
                    </Row>
                </Container>
                <Container className="margin-top-xxl margin-bottom-xxl">
                    <Row>
                        <Col xs={12}>
                            <HDInfoCardRefactor image={TipCirclePurple} paragraphs={['Paraghaph text. Lorem ipsum dot minor est.']} />
                        </Col>
                    </Row>
                    <hr />
                    <HDLabelRefactor Tag="h2" text="HDRadioButtonList" />
                    <HDLabelRefactor
                        Tag="h5"
                        text={`Selected item id: "${selectedListItem.id}" with label: "${selectedListItem.label}" with value: "${selectedListItem.value}"`} />
                    <Row>
                        <Col>
                            <HDRadioButtonList items={listItems} onChange={onRadioButtonListSelect} value={selectedListItem} />
                        </Col>
                    </Row>
                    <hr />
                    <HDLabelRefactor Tag="h2" text="HDCheckboxButtonList" />
                    <HDLabelRefactor
                        Tag="h5"
                        text={`Selected items' ids: ${_.map(selectedListItems, 'id').toString()}`} />
                    <Row>
                        <Col>
                            <HDCheckboxButtonList items={listItems} selectedItems={selectedListItems} onChange={onCheckboxButtonListSelect} />
                        </Col>
                    </Row>
                </Container>

                <div className="qnbMain qnbMainContent">
                    <div>
                        <Button
                            onClick={() => {
                                setShowModal(true);
                            }}
                        >
                            <i className="fa fa-trash" aria-hidden="true" />
                        </Button>
                        <p>
                            Clicking on this icon will open modal as react portal rendered in dom element
                            &quote;portal-root&quote;. it is reponsibility of the modal user to change
                            the state of showModal prop passed as HDModal attribute.
                            Please checkout sample implementation.
                        </p>
                    </div>

                    <div>
                        <HDPaymentBreakdown title={paymentBreakdownProps.title} steps={paymentBreakdownProps.steps} />
                    </div>
                    <div id="portal-modal">
                        <HDModal
                            show={showModal}
                            headerText="Are you Sure?"
                            cancelLabel="GoBack"
                            confirmLabel="Yes, remove"
                            onCancel={() => {
                                setShowModal(false);
                            }}
                            onConfirm={() => {
                                setShowModal(false);
                            }}
                            onClose={() => {
                                setShowModal(false);
                            }}
                        >
                            {modalBody}
                        </HDModal>
                    </div>
                    <div>
                        <HDButton label="Primary Button" />
                    </div>
                    <div>
                        <HDButton label="confirm" variant="btnsecondary" onClick={() => console.log('Secondatd Button clicked')} />
                    </div>
                    <div>
                        <HDButton label="Disabled Primary Button" disabled onClick={() => console.log('Primary Button clicked')} />
                    </div>
                    <div>
                        <HDButton
                            variant="btnsecondary"
                            label="Disabled Secondart Button"
                            disabled
                            onClick={() => console.log('Primary Button clicked')} />
                    </div>

                    <hr />

                    <HDToggleButtonGroup id="id" name="name" label={{ text: 'Ask question' }} availableValues={availableValues} />
                    <hr />

                    <HDLabel text="Example" size="lg" icon="envelope-open" iconPosition="l" />
                    <hr />

                    <HDInfoCard title="Important">
                        <p>You will be the policyholder, which means you&alpos;re responsible for managing and paying for the policy.</p>
                    </HDInfoCard>

                    <hr />

                    <HDInfoCard
                        title="Important"
                        paragraphs={[
                            'You will be the policyholder, which means you\'re responsible for managing and paying for the policy.',
                            'You will be the policyholder, which means you\'re responsible for managing and paying for the policy.'
                        ]} />

                    <hr />

                    <HDStepper
                        iconIndicator={<i className="fas fa-car-side" />}
                        finalIcon={<i className="fas fa-flag" />}
                        steps={['car', 'driver', 'quote']}
                        currentStep="driver" />
                    <hr />

                    <HDTextInput
                        className="mt-3 mb-3"
                        id="alpha"
                        name="alpha"
                        type="alpha"
                        icon="car"
                        value={_.get(regNumber, 'target.value')}
                        onChange={setRegNumber} />
                    <HDTextInput
                        className="mb-3"
                        id="currency"
                        name="currency"
                        type="currency"
                        icon="pound-sign"
                        value={_.get(regNumber, 'target.value')}
                        onChange={setRegNumber} />
                    <HDTextInput
                        className="mb-3"
                        id="number"
                        name="number"
                        type="number"
                        value={_.get(regNumber, 'target.value')}
                        onChange={setRegNumber}
                        appendLabel="kilometers" />
                    <HDTextInput
                        className="mb-3"
                        id="mask"
                        name="mask"
                        type="mask"
                        mask="MORGA75311*****"
                        value={drivingLicence}
                        onChange={(e) => setDrivingLicence(e.target.value)} />
                    <p>{`Driver license number: ${drivingLicence}`}</p>

                    <HDInteractiveCard onDelete={() => setAction('delete')} onEdit={() => setAction('edit')}>
                        <p>Line 1</p>
                        <p>Line 2</p>
                    </HDInteractiveCard>
                    <p>{`Action: ${action}`}</p>
                    <hr />
                    <HDDataCard
                        title="Test"
                        description="Some description"
                        icon="car"
                        data={{
                            year: 2010,
                            engine: '2.0L',
                            transmission: 'Manual',
                            doors: 5,
                            colour: 'Fuel',
                            fuel: 'Petrol'
                        }}
                        linkText="No, that's the wrong car" />
                    <hr />
                    <HDForm submissionVM={submissionVM} validationSchema={validationSchema}>
                        <HDTextInput className="mb-3" type="currency" icon="pound-sign" path={costAmountPath} name={costAmountFieldname} />
                        <HDToggleButtonGroup
                            path={isCarModifiedPath}
                            name={isCarModifiedFieldname}
                            label={{ text: 'Is your car modified' }}
                            availableValues={availableValues} />
                        <HDImageRadioButton
                            path={isRegisteredKeeperAndLegalOwnerPath}
                            name={isRegisteredKeeperAndLegalOwnerFieldname}
                            currentValue="true"
                            image={heLogo} />
                        <HDImageRadioButton
                            path={isRegisteredKeeperAndLegalOwnerPath}
                            name={isRegisteredKeeperAndLegalOwnerFieldname}
                            currentValue="false"
                            image={hdLogo} />
                        <HDDropdownList
                            path={registeredKeeperPath}
                            name={registeredKeeperFieldname}
                            options={registeredKeeperAvailableValues}
                            label={{ text: 'Registered Keeper' }}
                            selectSize="lg" />
                        {(hdProps) => {
                            return (
                                <div>
                                    <div>
                                        Selected date:
                                        {String(hdProps.values[policyStartDateFieldName])}
                                    </div>
                                    <HDDatePicker
                                        path={policyStartDatePath}
                                        name={policyStartDateFieldName}
                                        minDate={0}
                                        maxDate={365}
                                        label={{
                                            text: 'Label',
                                            size: 'lg',
                                            iconPosition: 'r'
                                        }}
                                        subLabel={{
                                            text: 'Sublabel',
                                            size: 'xs'
                                        }} />
                                </div>
                            );
                        }}
                        <HDButton type="submit" label="Submit" />
                    </HDForm>
                    <hr />
                    <Container className="margin-top-xxl">
                        <HDPolicySelect onChange={createPolicySelect} selectedOption={policySelected} saveValue={99.99} />
                        <Row>
                            <Col>
                                <HDLabelRefactor className="text-dark" Tag="h5" text={policySelected} />
                            </Col>
                        </Row>
                        <hr />
                    </Container>
                    <HDTable
                        onlineProduct={!(policySelected === 'standard')}
                        name="brandCode"
                        selectedHeaderValue={coverLevel}
                        onSelect={(event) => setCoverLevel(event.target.value)}
                        headerValues={[
                            { value: 'HE', image: heLogo },
                            { value: 'YD', image: ydLogo },
                            { value: 'HD', image: hdLogo },
                            { value: 'HP', image: hpLogo }
                        ]}
                        data={[
                            {
                                rowLabel: 'First payment',
                                cells: [{
                                    value: '{£17.92}',
                                    extraLines: ['11 monthly payment', '{£17.88}'],
                                    boldText: 'Total {£214.60}'
                                },
                                {
                                    value: '{£19.91}',
                                    extraLines: ['11 monthly payment', '{£19.97}'],
                                    boldText: 'Total {£239.58}'
                                },
                                {
                                    value: '{£19.91}',
                                    extraLines: ['11 monthly payment', '{£19.97}'],
                                    boldText: 'Total {£239.58}'
                                },
                                {
                                    value: '{£23.83}',
                                    extraLines: ['11 monthly payment', '{£28.84}'],
                                    boldText: 'Total {£286.07}'
                                }]
                            },
                            {
                                rowLabel: 'Total excess',
                                cells: [{
                                    value: '£495.00',
                                    bottomDescription: 'Including voluntary'
                                },
                                {
                                    value: '£395.00',
                                    bottomDescription: 'Including voluntary'
                                },
                                {
                                    value: '£395.00',
                                    bottomDescription: 'Including voluntary'
                                },
                                {
                                    value: '£350.00',
                                    bottomDescription: 'Including voluntary'
                                }]
                            },
                            {
                                rowLabel: 'Courtesy car',
                                cells: [{
                                    value: true
                                },
                                {
                                    value: false
                                },
                                {
                                    value: false
                                },
                                {
                                    value: true
                                }]
                            },
                            {
                                rowLabel: 'Uninsured driver',
                                cells: [{
                                    value: false
                                },
                                {
                                    value: true
                                },
                                {
                                    value: true
                                },
                                {
                                    value: false
                                }]
                            },
                            {
                                rowLabel: 'Legal cover',
                                cells: [{
                                    value: '12 x £1.67',
                                    topDescription: 'monthly',
                                    bottomDescription: '(excluding interest)',
                                    extraLines: ['Annually', '£19.99']
                                },
                                {
                                    value: '12 x £1.67',
                                    topDescription: 'montly',
                                    bottomDescription: '(excluding interest)',
                                    extraLines: ['Annually', '£19.99']
                                },
                                {
                                    value: '12 x £1.67',
                                    topDescription: 'montly',
                                    bottomDescription: '(excluding interest)',
                                    extraLines: ['Annually', '£19.99']
                                },
                                {
                                    value: true
                                }]
                            }
                        ]}
                        moreDetailsPopups={[
                            <HDOverlayPopup id="popup-he" overlayButtonIcon={<span>More details</span>}>
                                Hastings Essential
                            </HDOverlayPopup>,
                            <HDOverlayPopup id="popup-yd" overlayButtonIcon={<span>More details</span>}>
                                You Drive
                            </HDOverlayPopup>,
                            <HDOverlayPopup id="popup-hd" overlayButtonIcon={<span>More details</span>}>
                                Hastings Direct
                            </HDOverlayPopup>,
                            <HDOverlayPopup id="popup-hp" overlayButtonIcon={<span>More details</span>}>
                                Hastings Premier
                            </HDOverlayPopup>
                        ]} />
                    <hr />
                    <div>
                        <p>
                            <span>
                                click button to see default warning window(backdrop: static, position: top)
                                <HDWarningModal
                                    onBack={() => console.log('OnBack Action')}
                                    onLeave={() => console.log('OnLeave Action')}
                                    backBtnLabel="Back" />
                            </span>
                        </p>
                        <p>
                            <span>
                                click button to see warning window at center
                                <HDWarningModal
                                    onBack={() => console.log('OnBack Action')}
                                    onLeave={() => console.log('OnLeave Action')}
                                    centered
                                    backBtnLabel="ok"
                                    leaveBtnLabel="confirm" />
                            </span>
                        </p>
                        <p>
                            <span>
                                click button to see warning window with a false backdrop
                                <HDWarningModal
                                    centered
                                    backdrop
                                    onBack={() => console.log('OnBack Action')}
                                    onLeave={() => console.log('OnLeave Action')}
                                    leaveBtnLabel="Leave" />
                            </span>
                        </p>
                    </div>
                    <hr />
                    <HDDropdownList options={registeredKeeperAvailableValues} label={{ text: 'Dropdown' }} selectSize="lg" />
                </div>
            </div>
        </ViewModelServiceContext.Provider>
    );
}
