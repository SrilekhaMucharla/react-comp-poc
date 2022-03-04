import InsuranceSuiteMetadataServiceFactory from 'gw-portals-metadata-js';
import DateUtil from 'gw-portals-util-js/DateUtil';
import LocalDateUtil from 'gw-portals-util-js/LocalDateUtil';

import ViewModel from './ViewModel';

import Context from './aspects/Context';
import Requiredness from './aspects/Requiredness';
import Validity from './aspects/Validity';
import SubtreeValidity from './aspects/SubtreeValidity';
import InputCtrlType from './aspects/InputCtrlType';
import AvailableValues from './aspects/AvailableValues';
import SerializedForm from './aspects/SerializedForm';
import RebuildVMFromData from './aspects/RebuildVMFromData';
import DebugInvalidChildProperties from './aspects/DebugInvalidChildProperties';
import TypedValue from './aspects/TypedValue';
import _ValidationFunctions from './aspects/_ValidationFunctions';
import _AddressAutocompleteUtil from './aspects/_AddressAutocompleteUtil';

import { ExpressionLanguageServiceFactory } from './expression-language';
import _PhoneUtil from './util/PhoneUtil';
import DateFormatter from './util/DateFormatter';

function getViewModelService(metadata, translator) {
    const suiteMetadata = InsuranceSuiteMetadataServiceFactory.createSuiteMetadata(metadata);
    const ExpressionLanguageService = ExpressionLanguageServiceFactory.get(
        { insuranceSuiteMetadataService: suiteMetadata, translator }
    );
    // view model initiation which is done in the initial module in Portals (extracted)
    const ViewModelService = ViewModel.get(suiteMetadata);

    const typeValidationMessages = {};
    typeValidationMessages.notANumber = translator('platform.modelvalidation.DTOValidationService.Please enter numbers only');
    typeValidationMessages.notAnInteger = translator('platform.modelvalidation.DTOValidationService.Value entered must not contain decimal values');

    ViewModelService.addAspectFactory(Context.create(ExpressionLanguageService));
    ViewModelService.addAspectFactory(Requiredness.create(ExpressionLanguageService));
    ViewModelService.addAspectFactory(
        Validity.create(ExpressionLanguageService, typeValidationMessages)
    );
    ViewModelService.addAspectFactory(SubtreeValidity);
    ViewModelService.addAspectFactory(InputCtrlType);
    ViewModelService.addAspectFactory(AvailableValues.create(ExpressionLanguageService));
    ViewModelService.addAspectFactory(SerializedForm);
    ViewModelService.addAspectFactory(RebuildVMFromData);
    ViewModelService.addAspectFactory(DebugInvalidChildProperties);
    ViewModelService.addAspectFactory(TypedValue);

    ExpressionLanguageService.getCompilationContext().registerType('edgev10.aspects.validation.ValidationFunctions', _ValidationFunctions());
    ExpressionLanguageService.getCompilationContext().registerType('gw.api.contact.AddressAutocompleteUtil', _AddressAutocompleteUtil());
    ExpressionLanguageService.getCompilationContext().registerType('edgev10.capabilities.locale.util.DateFormatter', DateFormatter);
    ExpressionLanguageService.getCompilationContext().registerType('gw.api.util.DateUtil', DateUtil);
    ExpressionLanguageService.getCompilationContext().registerType('gw.api.util.PhoneUtil', _PhoneUtil());
    ExpressionLanguageService.getCompilationContext().registerType('edgev10.time.LocalDateUtil', LocalDateUtil);

    return {
        create: ViewModelService.create,
        changeContext: ViewModelService.changeContext,
        clone: ViewModelService.clone
    };
}

// EXPORT
export default {
    getViewModelService
};
