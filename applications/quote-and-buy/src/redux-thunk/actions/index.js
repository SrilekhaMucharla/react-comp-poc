import { createQuote, clearLWRQuoteData } from './createQuote.action';
import { updateQuote, clearUpdateQuoteData } from './updateQuote.action';
import { retrievemulticarQuote } from './retrievemulticarQuote.action';
import { retrieveQuote, retrieveSubmission } from './retrieveQuote.action';
import { setOfferedQuotesDetails, setMultiOfferedQuotesDetails } from './offeredQuotes.action';
import { updateCustomQuote } from './CustomizeQuote/customUpdateQuote.action';
import { updateQuoteCoverages } from './CustomizeQuote/updateQuoteCoverages.action';
import { updateAncillaryJourney } from './CustomizeQuote/ancillaryJourney.action';
import { updateMcAncillaryJourney } from './MultiCustomizeQuote/mcAncillaryJourney.action';
import { getIpidMatchForAll, getIpidDocumnet } from './CustomizeQuote/ipidMatchForAll.action';
import { updateMarketingPreference, clearMarketingPreference } from './CustomizeQuote/updateMarketingPreference.action';
import { setErrorStatusCode } from './errorStatusCode.action';
import { updateMultiCustomQuote, updateMultiCustomQuoteCoverages, resetMultiCustomUpdateQuote } from './MultiCustomizeQuote/multiCustomUpdateQuote.action';
// import { incrementMCStartDatePageIndex, decrementMCStartDatePageIndex } from './incrementMCStartDatePage.action';
import { updateMultiQuote, clearUpdateMultiQuoteData } from './updateMultiQuote.action';
import { multiQuote, multiToSingleQuote, createParam, clearmultiQuoteData, clearmultiToSingleQuoteData, resetMultiToSingleObject } from './multiQuote.action';
import { singleToMultiProduct } from './singleToMultiProduct.action';
import { mcGetPaymentSchedule } from './multiPaymentSchedule.action';
import { getMCIpidMatchForAll, getMCIpidDocument } from './MultiCustomizeQuote/mcIpidMatchForAll.action';
import { monetateApi } from './monetateApi.action';
import { mcUpdateMarketingPreference, mcClearMarketingPreference } from './MultiCustomizeQuote/mcUpdateMarketingPreference.action';

import {
    setNavigation,
    setWizardPagesState,
    changeRegNumber,
    setSubmissionVM,
    createSubmission,
    setCustomizeSubmissionVM,
    setUpdateDDIVM,
    setAddressDisplay,
    setMultiCarSubmissionVM,
    setMultiCustomizeSubmissionVM,
    incrementCurrentPageIndex,
    decrementCurrentPageIndex,
    resetCurrentPageIndex,
    clearCreatedSubmission
} from './wizard.actions';
import {
    setVehicleDetails,
    sendPageData,
    sendEventData,
    markRerateModalAsDisplayed,
    setBackNavigationFlag,
    setObjectBeforeEdit,
    updateEpticaId,
    updateEmailSaveProgress,
    markNoDDModalAsDisplayed,
    mcMilestoneEdit
} from './globalData.actions';


export {
    setNavigation,
    setWizardPagesState,
    changeRegNumber,
    setSubmissionVM,
    createSubmission,
    setVehicleDetails,
    createQuote,
    sendPageData,
    sendEventData,
    updateQuote,
    setOfferedQuotesDetails,
    setMultiOfferedQuotesDetails,
    setCustomizeSubmissionVM,
    setUpdateDDIVM,
    retrieveQuote,
    retrievemulticarQuote,
    updateCustomQuote,
    markRerateModalAsDisplayed,
    updateQuoteCoverages,
    updateAncillaryJourney,
    updateMcAncillaryJourney,
    retrieveSubmission,
    getIpidMatchForAll,
    getIpidDocumnet,
    updateMarketingPreference,
    clearMarketingPreference,
    setBackNavigationFlag,
    setObjectBeforeEdit,
    updateEpticaId,
    setErrorStatusCode,
    updateEmailSaveProgress,
    setAddressDisplay,
    clearLWRQuoteData,
    clearUpdateQuoteData,
    setMultiCarSubmissionVM,
    setMultiCustomizeSubmissionVM,
    updateMultiCustomQuote,
    updateMultiCustomQuoteCoverages,
    markNoDDModalAsDisplayed,
    incrementCurrentPageIndex,
    decrementCurrentPageIndex,
    resetCurrentPageIndex,
    updateMultiQuote,
    multiQuote,
    multiToSingleQuote,
    createParam,
    singleToMultiProduct,
    clearUpdateMultiQuoteData,
    clearCreatedSubmission,
    mcGetPaymentSchedule,
    getMCIpidMatchForAll,
    getMCIpidDocument,
    monetateApi,
    mcUpdateMarketingPreference,
    mcClearMarketingPreference,
    mcMilestoneEdit,
    resetMultiCustomUpdateQuote,
    clearmultiQuoteData,
    clearmultiToSingleQuoteData,
    resetMultiToSingleObject
};
