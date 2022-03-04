
import ViewModelUtil from './ViewModelUtil';

/**
 * Verify if data is a ViewModelNode and returns otherwise create a viewModel and returns
 * @param {Object} viewModelService - The View Model Service used to load the viewModel
 * @param {Object} data - The data to validate
 * @param {string} dataPath - The data path used for creating a view model if necessary
 * @param {string} dtoPath - The DTO path used for creating a view model if necessary
 * @param {string} [xCenter=pc] - The xCenter value to use, defaults to 'pc'
 * @returns {VMNode}
 */
export default function loadViewModel(viewModelService, data, dataPath, dtoPath, xCenter = 'pc') {
    let viewModel;
    if (ViewModelUtil.isViewModelNode(data)) {
        viewModel = data;
    } else {
        viewModel = viewModelService.create(data, xCenter, dtoPath);
    }
    return viewModel;
}
