import loadViewModel from './loadViewModel';

/**
 * Validates the given `data` to see if it is valid by using a view model.
 * If the data is already a view model, simply use it for validation.
 * If it is raw data, then create a view model from it using the `dtoPath` and `dataPath` and
 * then validate it.
 *
 * @param {Object} viewModelService - The View Model Service used to validate the View Model
 * @param {Object} data - The data to validate
 * @param {string} dataPath - The data path used for creating a view model if necessary
 * @param {string} dtoPath - The DTO path used for creating a view model if necessary
 * @param {string} [xCenter=pc] - The xCenter value to use, defaults to 'pc'
 * @returns {boolean} - True if the data is valid based on the view model, false otherwise
 */
export default function validateViewModel(viewModelService, data, dataPath, dtoPath, xCenter = 'pc') {
    const viewModel = loadViewModel(viewModelService, data, dataPath, dtoPath, xCenter);
    return viewModel.aspects.subtreeValid;
}
