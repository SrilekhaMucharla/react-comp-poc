import { combineReducers } from 'redux';
import wizardState from './wizard.reducer';
import monetateModel from './monetateApi.reducer';
import {
    globalData,
    vehicleDetails,
    rerateModal,
    getPriceNavigationFlag,
    getObjectBeforeEdit,
    epticaId,
    emailSaveProgress,
    noDDModal,
    setmilestoneEdit
} from './globalData.reducer';
import createQuoteModel from './createQuote.reducer';
import updateQuoteModel from './updateQuote.reducer';
import retrieveQuoteModel from './retrieveQuotereducer';
import retrievemulticarQuoteModel from './retrievemulticarQuote.reducer';
import offeredQuoteModel from './offeredQuotes.reducer';
import customQuoteModel from './CustomizeQuote/customUpdateQuote.reducer';
import updateQuoteCoveragesModel from './CustomizeQuote/updateQuoteCoverages.reducer';
import ancillaryJourneyModel from './CustomizeQuote/ancillaryJourney.reducer';
import customMultiQuoteModel from './MultiCustomizeQuote/multiCustomUpdateQuote.reducer';
import ipidMatchForAllModel from './CustomizeQuote/ipidMatchForAll.reducer';
import updateMarketingPreferencesModel from './CustomizeQuote/updateMarketingPreference.reducer';
// import mcStartDatePageIndex from './incrementMCStartDatePage.reducer';
import updateMultiQuoteModel from './updateMultiQuote.reducer';
import multiQuoteModel from './multiQuote.reducer';
import multiToSingleQuoteModel from './multiToSingle.reducer';
import errorStatusCodeReducer from './errorStatusCode.reducer';
import singleToMultiProductModel from './singleToMultiProduct.reducer';
import mcPaymentScheduleModel from './multiPaymentSchedule.reducer';
import customMultiQuoteCoveragesModel from './MultiCustomizeQuote/multiCustomUpdateQuoteCoverages.reducer';
import ipidMultiCarMatchForAllModel from './MultiCustomizeQuote/ipidMultiCarMatchForAllModel.reducer';
import mcancillaryJourneyModel from './MultiCustomizeQuote/mcAncillaryJourney.reducer';
import mcupdateMarketingPreferencesModel from './MultiCustomizeQuote/mcUpdateMarketingPreference.reducer';

export default combineReducers({
    wizardState: wizardState,
    globalData: globalData,
    vehicleDetails: vehicleDetails,
    getPriceNavigationFlag: getPriceNavigationFlag,
    rerateModal: rerateModal,
    epticaId: epticaId,
    emailSaveProgress: emailSaveProgress,
    createQuoteModel: createQuoteModel,
    updateQuoteModel: updateQuoteModel,
    retrieveQuoteModel: retrieveQuoteModel,
    retrievemulticarQuoteModel: retrievemulticarQuoteModel,
    offeredQuoteModel: offeredQuoteModel,
    customQuoteModel: customQuoteModel,
    updateQuoteCoveragesModel: updateQuoteCoveragesModel,
    ancillaryJourneyModel: ancillaryJourneyModel,
    customMultiQuoteModel: customMultiQuoteModel,
    noDDModal: noDDModal,
    ipidMatchForAllModel: ipidMatchForAllModel,
    updateMarketingPreferencesModel: updateMarketingPreferencesModel,
    // mcStartDatePageIndex: mcStartDatePageIndex,
    updateMultiQuoteModel: updateMultiQuoteModel,
    multiQuoteModel: multiQuoteModel,
    multiToSingleQuoteModel: multiToSingleQuoteModel,
    getObjectBeforeEdit: getObjectBeforeEdit,
    errorStatus: errorStatusCodeReducer,
    singleToMultiProductModel: singleToMultiProductModel,
    mcPaymentScheduleModel: mcPaymentScheduleModel,
    customMultiQuoteCoveragesModel: customMultiQuoteCoveragesModel,
    ipidMultiCarMatchForAllModel: ipidMultiCarMatchForAllModel,
    mcancillaryJourneyModel: mcancillaryJourneyModel,
    monetateModel: monetateModel,
    mcupdateMarketingPreferencesModel: mcupdateMarketingPreferencesModel,
    setmilestoneEdit: setmilestoneEdit
});
