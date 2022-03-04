/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState, useContext } from 'react';
import {
    HDInteractiveCardRefactor,
    HDForm,
    HDInfoCardRefactor,
    HDLabelRefactor
} from 'hastings-components';
import PropTypes from 'prop-types';
import { Row, Col, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as yup from 'hastings-components/yup';
import _ from 'lodash';
import { ViewModelServiceContext } from 'gw-portals-viewmodel-react';
import {
    AnalyticsHDToggleButtonGroup as HDToggleButtonGroup,
    AnalyticsHDDropdownList as HDDropdownList,
    AnalyticsHDModal as HDModal,
    AnalyticsHDButtonDashed as HDButtonDashed,
    AnalyticsHDOverlayPopup as HDOverlayPopup
} from '../../../web-analytics';
import { TranslatorContext } from '../../../integration/TranslatorContext';
import * as messages from './HDTracker.messages';
import { setNavigation as setNavigationAction } from '../../../redux-thunk/actions';
import infoCircleBlue from '../../../assets/images/icons/Darkicons_desktopinfo.svg';
import tipCirclePurple from '../../../assets/images/icons/tip_circle_purple.svg';
import editIcon from '../../../assets/images/icons/edit-icon.svg';
import trashIcon from '../../../assets/images/icons/trash-icon.svg';

const HastingsTracker = (props) => {
    const infoTipText = [messages.infoTip];
    const [typeList, setTypeList] = useState([]);
    const [modType, setModType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [screenUpdated, setScreenUpdated] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [modificationValid, setModificationValid] = useState(false);
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const [typeReset, setTypeReset] = useState(false);
    const [typeInvalid, setTypeInvalid] = useState(false);
    const [isModifiedNeutralised, setIsModifiedNeutralised] = useState(false);

    const vehicleModifications = 'vehicleModifications';
    const vehicleModificationPath = `${vehiclePath}.${vehicleModifications}`;

    const isCarModifiedPath = `${vehiclePath}.isCarModified`;
    const isCarModifiedName = 'isCarModified';

    const trackerPath = `${vehiclePath}.tracker`;
    const trackerName = 'tracker';

    const [modDelete, setModDelete] = useState('');
    const [modEditType, setModEditType] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [modEditCategory, setModEditCategory] = useState('');
    const { submissionVM, setNavigation, pageMetadata } = props;
    const translator = useContext(TranslatorContext);

    const [showModificationPopup, setShowModificationPopup] = useState(false);


    const vehicleWorth = 'vehicleWorth';
    const carWorthPath = `${vehiclePath}.${vehicleWorth}`;
    const carWorth = _.get(submissionVM, `${carWorthPath}.value`);

    const availableValues = [{
        value: 'true',
        name: messages.yes,
    }, {
        value: 'false',
        name: messages.no,
    }];
    const viewModelService = useContext(ViewModelServiceContext);
    const VehicleModificationsDTO = viewModelService && viewModelService.create(
        {},
        'pc',
        'com.hastings.edgev10.capabilities.policyjob.lob.privatecar.coverables.dto.VehicleModificationsDTO'
    );
    const dtoModifications = VehicleModificationsDTO ? _.get(VehicleModificationsDTO, 'modification')
        .aspects
        .availableValues
        .map((typeCode) => {
            return {
                value: typeCode.code,
                label: translator({
                    id: typeCode.name,
                    defaultMessage: typeCode.name
                })
            };
        }) : [];

    function getAvailableValuesForType() {
        const availableValuesForType = dtoModifications
            .map((element) => {
                return {
                    value: element.value,
                    label: element.label
                };
            });
        return availableValuesForType;
    }

    useEffect(() => {
        setTypeList(getAvailableValuesForType());

        if (carWorth < messages.minValueForTracker) {
            _.set(submissionVM, `${trackerPath}.value`, 'false');
        }

        const trackerValue = _.get(submissionVM, `${trackerPath}.value`).toString();
        const isModifiedValue = _.get(submissionVM, `${isCarModifiedPath}.value`).toString();
        if (trackerValue && isModifiedValue) {
            setModificationValid(true);
        }
    }, []);

    useEffect(() => {
        if (showModificationPopup) {
            setTypeList(getAvailableValuesForType());
        } else {
            setTypeList([]);
        }
    }, [showModificationPopup]);

    const resetModificationDropDowns = () => {
        setShowModificationPopup(false);
        setTypeInvalid(false);
        const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
        if (modifications.length === 0) {
            setIsModifiedNeutralised(true);
            _.set(submissionVM, `${isCarModifiedPath}.value`, '');
        }
    };

    const removeAll = () => {
        const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
        _.remove(modifications);
        setScreenUpdated(!screenUpdated);
    };

    const isCarModified = (modify) => {
        setIsModifiedNeutralised(false);
        if (modify.target.value === 'true') {
            setTypeReset(true);
            setShowModificationPopup(true);
            setModificationValid(false);
            setIsEdit(false);
        } else {
            removeAll();
            setModificationValid(true);
            setTypeReset(false);
        }
    };

    const onAddAnotherClick = () => {
        setModType(null);
        setTypeReset(true);
        setShowModificationPopup(true);
        setIsEdit(false);
    };


    const onModificationRemove = () => {
        const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
        _.remove(modifications, modDelete);
        setModDelete('');
        if (modifications.length === 0) {
            _.set(submissionVM, `${isCarModifiedPath}.value`, '');
            setIsModifiedNeutralised(true);
            setModificationValid(false);
        }
    };

    const deleteModification = (modDel) => {
        const deleteItem = {
            modification: modDel
        };
        setModDelete(deleteItem);
        setShowModal(true);
    };

    const beforeEdit = (modEdit) => {
        const matchByCode = _.filter(dtoModifications, (mod) => mod.value === modEdit);
        const firstElement = _.first(matchByCode);
        setModEditType(
            {
                value: modEdit,
                label: firstElement.label
            }
        );
        setModType(
            {
                value: modEdit,
                label: firstElement.label
            }
        );
        setTypeReset(false);
    };

    const openEditPopup = (modification) => {
        setIsEdit(true);
        beforeEdit(modification);
        setShowModificationPopup(true);
    };

    useEffect(() => {
        setNavigation({ canForward: false, showForward: true });
    }, []);

    const onTypeChange = (type) => {
        setTypeReset(false);
        const matchByCode = _.filter(dtoModifications, (mod) => mod.value === type.target.value.value);
        const firstElement = _.first(matchByCode);
        setModType({ value: type.target.value.value, label: firstElement ? firstElement.label : '' });
        setTypeInvalid(false);
    };


    const validateModification = () => {
        let isValid = true;
        if (modType === null) {
            isValid = false;
            setTypeInvalid(modType === null);
        } else {
            isValid = true;
            setTypeInvalid(false);
        }
        return isValid;
    };

    const addModification = () => {
        const isValid = validateModification();
        if (isValid) {
            const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
            if (modType.value !== '') {
                const modification = {
                    modification: modType.value
                };
                const modList = _.find(modifications, (data) => {
                    return data.modification === modification.modification;
                });

                if (!modList) {
                    modifications.push(modification);
                }

                setScreenUpdated(!screenUpdated);
                setModificationValid(true);
                setTypeReset(true);
                setModType(null);
                setModEditCategory(null);
                setModEditType(null);
            }
            setShowModificationPopup(false);
        }
    };

    const editModification = () => {
        const isValid = validateModification();
        if (isValid) {
            const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
            const modList = _.find(modifications, (data) => {
                return data.modification === modType.value;
            });

            if (!modList) {
                modifications.find((mod) => mod.modification === modEditType.value).modification = modType.value;
            }

            setScreenUpdated(!screenUpdated);
            setTypeReset(true);
            setModType(null);
            setModEditCategory(null);
            setModEditType(null);
            setShowModificationPopup(false);
        }
    };

    const isTrackerModified = () => {
        const isModifiedSelected = _.get(submissionVM, `${isCarModifiedPath}.value`).toString();
        if (isModifiedSelected) {
            setModificationValid(true);
        }
    };

    const validationSchema = yup.object({

        [trackerName]: (carWorth >= messages.minValueForTracker) && yup.string()
            .required(messages.fieldRequiredMsg)
            .VMValidation(trackerPath, null, submissionVM),
        [isCarModifiedName]: yup.string()
            .required(messages.fieldRequiredMsg)
            .VMValidation(isCarModifiedPath, null, submissionVM)
    });

    const handleValidation = (isValid) => {
        setNavigation({ canForward: isValid && modificationValid });
    };

    const showAddMore = () => {
        const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
        let addAnotherButton = '';
        if (modifications.length && modifications.length < 5) {
            addAnotherButton = (
                <HDButtonDashed
                    webAnalyticsEvent={{ event_action: messages.modifications }}
                    id="car-tracker-add-modification-button"
                    className="car-tracker__add-modification-button btn-block"
                    icon
                    label={messages.addModification}
                    onClick={onAddAnotherClick} />
            );
        }
        return addAnotherButton;
    };

    const showInteractiveCard = () => {
        const modifications = _.get(submissionVM, `${vehicleModificationPath}.value`);
        let hasModifications = false;
        // eslint-disable-next-line consistent-return
        const returnDiv = modifications.map((mod) => {
            const matchByCode = dtoModifications && _.filter(dtoModifications, (m) => m.value === mod.modification);
            const firstElement = matchByCode && _.first(matchByCode);
            if (firstElement !== undefined) {
                hasModifications = true;
                return (
                    <Row className="mb-2">
                        <Col>
                            <HDInteractiveCardRefactor icons={(
                                <Row id="car-tracker-interactive-card-icons">
                                    <Col className="pr-0">
                                        <div
                                            className="car-tracker__interactive-card__edit-button"
                                            onClick={() => openEditPopup(mod.modification)}
                                        >
                                            <img src={editIcon} slt="edit_icon" alt="Edit" />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className="car-tracker__interactive-card__delete-button"
                                            onClick={() => deleteModification(mod.modification)}
                                        >
                                            <img src={trashIcon} slt="trash_icon" alt="Delete" />
                                        </div>
                                    </Col>
                                </Row>
                            )}
                            >
                                <div>{firstElement.label}</div>
                            </HDInteractiveCardRefactor>
                        </Col>
                    </Row>
                );
            }
        });
        return hasModifications ? (
            <>
                <hr />
                {returnDiv}
            </>
        ) : returnDiv;
    };

    const trackerOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.tracker} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.tracker} Info` }}
            id="car-tracker-overlay-body"
            labelText={messages.trackerQuestion}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <HDLabelRefactor id="car-tracker-overlay-answer" Tag="p" text={messages.trackerAnswer} />
            <HDLabelRefactor id="car-tracker-overlay-check" Tag="p" text={messages.trackerCheckAnswer} />
        </HDOverlayPopup>
    );

    const modificationsOverlay = (
        <HDOverlayPopup
            webAnalyticsView={{ ...pageMetadata, page_section: `${messages.modification} Info` }}
            webAnalyticsEvent={{ event_action: `${messages.modification} Info` }}
            id="car-tracker-modal-body"
            labelText={messages.modifiedQuestion}
            overlayButtonIcon={<img src={infoCircleBlue} alt="info_circle" />}
        >
            <HDLabelRefactor id="car-tracker-modal-answer-1" Tag="p" text={messages.modifiedAnswerText1} />
            <HDLabelRefactor id="car-tracker-modal-answer-2" Tag="p" text={messages.modifiedAnswerText2} />
            <HDLabelRefactor id="car-tracker-modal-answer-3" Tag="p" text={messages.modifiedAnswerText3} />
        </HDOverlayPopup>
    );

    return (
        <Container className="car-tracker-wrapper">
            <HDForm
                className="car-tracker__tracker-form"
                submissionVM={submissionVM}
                validationSchema={validationSchema}
                onValidation={handleValidation}
            >
                {carWorth >= messages.minValueForTracker && (
                    <>
                        <Row>
                            <Col>
                                <HDToggleButtonGroup
                                    webAnalyticsEvent={{ event_action: messages.isTrackerPresent }}
                                    id="tracker-button-group"
                                    customClassName="car-tracker__tracker-buttons"
                                    availableValues={availableValues}
                                    label={{
                                        Tag: 'h2',
                                        text: messages.isTrackerPresent,
                                        icon: trackerOverlay,
                                        iconPosition: 'r'
                                    }}
                                    path={trackerPath}
                                    name={trackerName}
                                    onChange={isTrackerModified}
                                    btnGroupClassName="grid grid--col-2 grid--col-xl-3" />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-5 mt-5">
                                <div id="car-tracker-h-line" className="horizontal-line" />
                            </Col>
                        </Row>
                    </>
                )}

                <Row>
                    <Col>
                        <HDToggleButtonGroup
                            webAnalyticsEvent={{ event_action: messages.isModified }}
                            id="modification-button-group"
                            customClassName="car-tracker__modification-buttons"
                            availableValues={availableValues}
                            label={{
                                Tag: 'h2',
                                text: messages.isModified,
                                icon: modificationsOverlay,
                                iconPosition: 'r'
                            }}
                            path={isCarModifiedPath}
                            doReset={isModifiedNeutralised}
                            name={isCarModifiedName}
                            onChange={isCarModified}
                            btnGroupClassName="grid grid--col-2 grid--col-xl-3" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <HDInfoCardRefactor
                            id="car-tracker-info-card"
                            className="car-tracker__modification-info-card"
                            image={tipCirclePurple}
                            paragraphs={[infoTipText]} />
                    </Col>
                </Row>
                {showInteractiveCard()}
                <Row className="margin-top-md margin-bottom-md">
                    <Col xs={12} md={8}>
                        {showAddMore()}
                    </Col>
                </Row>

                <HDModal
                    webAnalyticsView={{ ...pageMetadata, page_section: `${isEdit ? messages.edit : messages.add} ${messages.modification}` }}
                    webAnalyticsEvent={{
                        event_action: `${messages.modification} - ${isEdit ? 'Edit modification' : 'Add  modification'}`
                    }}
                    id="modification-modal"
                    show={showModificationPopup}
                    confirmLabel={isEdit ? messages.update : messages.add}
                    customStyle={messages.wide}
                    headerText={messages.modification}
                    cancelLabel={messages.cancel}
                    onCancel={resetModificationDropDowns}
                    onClose={resetModificationDropDowns}
                    onConfirm={() => {
                        if (isEdit) {
                            editModification();
                        } else {
                            addModification();
                        }
                    }}
                >
                    <div className="modification-modal">
                        <div>
                            <HDDropdownList
                                webAnalyticsEvent={{ event_action: `${messages.modifications} - ${messages.typeQuest}` }}
                                id="modification-type-dropdown"
                                name={messages.type}
                                value={modType}
                                label={{ Tag: 'h5', text: messages.typeQuest }}
                                placeholder={messages.genericInputPlaceholder}
                                options={typeList}
                                reset={typeReset}
                                onChange={onTypeChange}
                                data={modType} />
                        </div>
                        <div className="error" hidden={!typeInvalid}>
                            <span>
                                *
                                {messages.fieldRequiredMsg}
                            </span>
                        </div>
                    </div>
                </HDModal>
            </HDForm>
            <HDModal
                webAnalyticsView={{ ...pageMetadata, page_section: `${messages.remove} ${messages.modification}` }}
                webAnalyticsEvent={{
                    event_action: `${messages.modification} - ${messages.remove} ${messages.modification}`
                }}
                id="delete-modification-modal"
                show={showModal}
                headerText={messages.areYouSure}
                confirmLabel={messages.yesRemove}
                cancelLabel={messages.goBack}
                hideClose
                onCancel={() => setShowModal(false)}
                onConfirm={() => {
                    onModificationRemove();
                    setShowModal(false);
                }}
            >
                <HDLabelRefactor Tag="p" text={messages.removeModification} />
            </HDModal>
        </Container>

    );
};
const mapStateToProps = (state) => {
    return {
        submissionVM: state.wizardState.data.submissionVM,
    };
};

const mapDispatchToProps = {
    setNavigation: setNavigationAction,
};

HastingsTracker.propTypes = {
    submissionVM: PropTypes.shape({ lobData: PropTypes.object.isRequired })
        .isRequired,
    setNavigation: PropTypes.func.isRequired,
    pageMetadata: PropTypes.shape({
        page_name: PropTypes.string.isRequired,
        page_type: PropTypes.string.isRequired,
        sales_journey_type: PropTypes.string.isRequired
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HastingsTracker);
