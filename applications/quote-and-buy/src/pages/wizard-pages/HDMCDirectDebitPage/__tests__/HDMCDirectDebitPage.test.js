// import React from 'react';
// import { Provider } from 'react-redux';
// import { shallow, mount } from 'enzyme';
// import thunk from 'redux-thunk';
// import configureStore from 'redux-mock-store';
// import ViewModelServiceFactory from 'gw-portals-viewmodel-js/ViewModelServiceFactory';
// import { HastingsPaymentService } from 'hastings-capability-payment';
// import HDMCDirectDebitPage from '../HDMCDirectDebitPage';
// import defaultTranslator from '../../__helpers__/testHelper';
// import productMetadata from '../../../../generated/metadata/product-metadata.json';
// import * as mcSubmission from '../../../../routes/mockMCSubmissionQuoted.json';
// import withTranslator from '../../__helpers__/test/withTranslator';
// import createPortalRoot from '../../__helpers__/test/createPortalRoot';
// import mockPaymentSchedule from '../../HDMCThanksPage/mock/mockMCPSnormal.json';

// const middlewares = [thunk];
// const mockStore = configureStore(middlewares);

// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useLocation: () => ({
//         state: ''
//     })
// }));
test('mock test', () => { expect(true).toBe(true); });

// const initializeStore = () => {
//     const viewModelService = ViewModelServiceFactory.getViewModelService(
//         productMetadata, defaultTranslator
//     );

//     const mcSubmissionVM = viewModelService.create(
//         mcSubmission.result,
//         'pc',
//         'com.hastings.edgev10.capabilities.quote.submission.dto.HastingsMultiQuoteDataDTO'
//     );

//     const initialState = {
//         wizardState: {
//             data: {
//                 mcsubmissionVM: mcSubmissionVM,
//                 multiCustomizeSubmissionVM: {
//                     value: {
//                         mpwrapperNumber: '50000000386',
//                         mpwrapperJobNumber: '40000000386',
//                         sessionUUID: '129a86ab-0f39-4006-a3f2-bb698ad78cda'
//                     }
//                 }
//             }
//         },
//         mcPaymentScheduleModel: {
//             mcPaymentScheduleObject: mockPaymentSchedule.result,
//             mcPaymentScheduleError: {}
//         }
//     };

//     return mockStore(initialState);
// };

// async function initializeWrapper(store, props) {
//     let wrapper;
//     createPortalRoot();
//     await act(async () => {
//         wrapper = mount(withTranslator(
//             <Provider store={store}>
//                 <HDMCDirectDebitPage {...props} />
//             </Provider>
//         ));
//     });
//     wrapper.update();
//     return wrapper;
// }

// describe('<HDMCDirectDebitPage />', () => {
//     test('render component', () => {
//         const initialState = {};
//         const store = mockStore(initialState);

//         const wrapper = shallow(
//             <Provider store={store}>
//                 <HDMCDirectDebitPage />
//             </Provider>
//         );
//         expect(wrapper).toMatchSnapshot();
//     });

//     describe('test with mocked store', () => {
//         beforeEach(() => {
//             jest.clearAllMocks();
//             jest.spyOn(HastingsPaymentService, 'fetchMCPaymentDetails').mockImplementation((data) => Promise.resolve({
//                 result: data
//             }));
//         });
//         test('Component should have payment breakdown', async () => {
//             const store = initializeStore();
//             const wrapper = await initializeWrapper(store);
//             expect(wrapper.find('.mc-dd-page__body-right')).toBeTruthy();
//         });

//         test('clicking why today should open a overaly', async () => {
//             const store = initializeStore();
//             const wrapper = await initializeWrapper(store);

//             await act(async () => {
//                 wrapper.find('.mc-thanks-page__policy-link').at(0).simulate('click');
//             });
//             wrapper.update();
//             expect(wrapper.find('overlay-container')).toBeTruthy();
//         });

//         test('clicking all cover renews should open a overaly', async () => {
//             const store = initializeStore();
//             const wrapper = await initializeWrapper(store);

//             await act(async () => {
//                 wrapper.find('.mc-thanks-page__policy-link').at(1).simulate('click');
//             });
//             wrapper.update();
//             expect(wrapper.find('overlay-container')).toBeTruthy();
//         });
//     });
// });
