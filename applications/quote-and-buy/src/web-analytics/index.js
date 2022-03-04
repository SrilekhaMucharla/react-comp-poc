import {
    HDModal,
    HDButtonRefactor,
    HDButtonDashed,
    HDToggleButtonGroupRefactor,
    HDDropdownList,
    HDTextInputRefactor,
    HDOverlayPopup,
    HDAsyncSelect,
    HDDatePickerRefactor,
    HDSwitch,
    HDTable,
    HDCheckbox,
    HDCompletedCardInfo,
    HDRadioButtonList,
    HDCheckboxButtonList,
    HDQuoteDownloadRefactor,
    HDLabelRefactor,
    HDPolicySelect
} from 'hastings-components';
import withEventTracking, { ACTION, COMPONENT_TYPE } from './withEventTracking';
import withViewTracking from './withViewTracking';


export const AnalyticsHDButton = withEventTracking(HDButtonRefactor, COMPONENT_TYPE.BUTTON, [ACTION.CLICK]);

export const AnalyticsHDButtonDashed = withEventTracking(HDButtonDashed, COMPONENT_TYPE.BUTTON, [ACTION.CLICK]);

export const AnalyticsHDToggleButtonGroup = withEventTracking(HDToggleButtonGroupRefactor, COMPONENT_TYPE.BUTTON_GROUP, [ACTION.CHANGE]);

export const AnalyticsHDDropdownList = withEventTracking(HDDropdownList, COMPONENT_TYPE.DROPDOWN, [ACTION.CHANGE]);

export const AnalyticsHDAsyncSelect = withEventTracking(HDAsyncSelect, COMPONENT_TYPE.ASYNC_DROPDOWN, [ACTION.CHANGE]);

export const AnalyticsHDTextInput = withEventTracking(HDTextInputRefactor, COMPONENT_TYPE.INPUT, [ACTION.FOCUS]);

export const AnalyticsHDDatePicker = withEventTracking(HDDatePickerRefactor, COMPONENT_TYPE.DATE_PICKER, [ACTION.CHANGE]);

export const AnalyticsHDSwitch = withEventTracking(HDSwitch, COMPONENT_TYPE.SWITCH, [ACTION.CHANGE]);

export const AnalyticsHDTable = withEventTracking(HDTable, COMPONENT_TYPE.TABLE, [ACTION.SELECT]);

export const AnalyticsHDCheckbox = withEventTracking(HDCheckbox, COMPONENT_TYPE.CHECKBOX, [ACTION.CHANGE]);

export const AnalyticsHDCompletedCardInfo = withEventTracking(HDCompletedCardInfo, COMPONENT_TYPE.CARD, [ACTION.EDIT, ACTION.DELETE]);

export const AnalyticsHDRadioButtonList = withEventTracking(HDRadioButtonList, COMPONENT_TYPE.RADIO_BUTTON_LIST, [ACTION.CHANGE]);

export const AnalyticsHDCheckboxButtonList = withEventTracking(HDCheckboxButtonList, COMPONENT_TYPE.CHECKBOX_BUTTON_LIST, [ACTION.CHANGE]);

export const AnalyticsHDQuoteDownload = withEventTracking(HDQuoteDownloadRefactor, COMPONENT_TYPE.BUTTON, [ACTION.CLICK]);

export const AnalyticsHDLabel = withEventTracking(HDLabelRefactor, COMPONENT_TYPE.LABEL, [ACTION.CLICK]);

export const AnalyticsHDModal = withViewTracking(
    withEventTracking(HDModal, COMPONENT_TYPE.MODAL, [ACTION.CONFIRM, ACTION.CANCEL, ACTION.OPEN]),
    COMPONENT_TYPE.MODAL
);

export const AnalyticsHDOverlayPopup = withViewTracking(
    withEventTracking(HDOverlayPopup, COMPONENT_TYPE.OVERLAY, [ACTION.CONFIRM, ACTION.CANCEL, ACTION.OPEN]),
    COMPONENT_TYPE.OVERLAY
);

export const AnalyticsHDPolicySelect = withViewTracking(
    withEventTracking(
        HDPolicySelect,
        COMPONENT_TYPE.BUTTON_GROUP,
        [ACTION.SELECT]
    )
);
