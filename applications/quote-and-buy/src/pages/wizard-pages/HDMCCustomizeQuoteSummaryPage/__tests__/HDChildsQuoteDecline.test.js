import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
import defaultTranslator from '../../__helpers__/testHelper';
import productMetadata from '../../../../generated/metadata/product-metadata.json';
import HDChildsQuoteDecline from '../HDChildsQuoteDecline';
import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
import * as multiCustomizeSubmission from '../mock/multiCustomizeSubmissionVM.json';
import * as messages from '../HDChildsQuoteDecline.messages';
import getCarName from '../../../../common/getCarName';
import {
    UW_ERROR_CODE, GREY_LIST_ERROR_CODE, CUE_ERROR_CODE
} from '../../../../constant/const';

const viewModelService = ViewModelServiceFactory.getViewModelService(
    productMetadata, defaultTranslator
);

const mcSubmissionVM = viewModelService.create(
    mcSubmission.result,
    'pc',
    'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
);

const multiCustomizeSubmissionVM = { value: { } };
_.set(multiCustomizeSubmissionVM, 'value', multiCustomizeSubmission);

const setHastingErrorCode = (hastingsErrors) => {
    _.set(multiCustomizeSubmissionVM, 'value.customQuotes[1].quote.hastingsErrors', hastingsErrors);
    _.set(multiCustomizeSubmissionVM, 'value.customQuotes[2].quote.hastingsErrors', hastingsErrors);
};

const getCarData = (submissionVM) => {
    const vehiclePath = 'lobData.privateCar.coverables.vehicles.children[0]';
    const regNum = _.get(submissionVM, `${vehiclePath}.value.registrationsNumber`) || '';
    const make = _.get(submissionVM, `${vehiclePath}.value.make`) || '';
    const model = _.get(submissionVM, `${vehiclePath}.value.model`) || '';
    const carName = getCarName(make, model);
    return { regNum, carName };
};

async function initializeWrapper(props) {
    let wrapper;
    await act(async () => {
        wrapper = mount(
            <HDChildsQuoteDecline {...props} />
        );
    });
    wrapper.update();
    return wrapper;
}

describe('<HDChildsQuoteDecline />', () => {
    test('render component', () => {
        const wrapper = initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper).toMatchSnapshot();
    });

    test('Should render UW_ERROR message when quote have UW_ERROR_CODE', async () => {
        const hastingsErrors = [{
            technicalErrorCode: UW_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-msg').props().text).toEqual(messages.uwAndGreyListErrorMsg(2));
    });

    test('Should render GREY_LIST_ERROR message when quote have GREY_LIST_ERROR_CODE', async () => {
        const hastingsErrors = [{
            technicalErrorCode: GREY_LIST_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-msg').props().text).toEqual(messages.uwAndGreyListErrorMsg(2));
    });

    test('Should render CUE_ERROR message when quote have CUE_ERROR_CODE', async () => {
        const hastingsErrors = [{
            technicalErrorCode: CUE_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-msg').props().text).toEqual(messages.cueErrorsMsg(50000000279, 2));
    });

    test('Should render VRN of second car when second quote have any hasting error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: UW_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const carVRNAndMakeAndModal = getCarData(mcSubmissionVM.quotes.children[1]);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-registration-number').at(0).props().text).toEqual(carVRNAndMakeAndModal.regNum);
    });

    test('Should render makeAndModal of second car when second quote have any hasting error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: UW_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const carVRNAndMakeAndModal = getCarData(mcSubmissionVM.quotes.children[1]);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-make-and-modal').at(0).props().text).toEqual(carVRNAndMakeAndModal.carName);
    });

    test('Should render VRN of 3rd car when second quote have any hasting error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: UW_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const carVRNAndMakeAndModal = getCarData(mcSubmissionVM.quotes.children[2]);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-registration-number').at(1).props().text).toEqual(carVRNAndMakeAndModal.regNum);
    });

    test('Should render makeAndModal of 3rd car when second quote have any hasting error', async () => {
        const hastingsErrors = [{
            technicalErrorCode: UW_ERROR_CODE
        }];
        setHastingErrorCode(hastingsErrors);
        const carVRNAndMakeAndModal = getCarData(mcSubmissionVM.quotes.children[2]);
        const wrapper = await initializeWrapper({ mcsubmissionVM: mcSubmissionVM, multiCustomizeSubmissionVM: multiCustomizeSubmissionVM, quoteCount: 2 });
        expect(wrapper.find('HDLabelRefactor#quote-decline-child-make-and-modal').at(1).props().text).toEqual(carVRNAndMakeAndModal.carName);
    });
});
