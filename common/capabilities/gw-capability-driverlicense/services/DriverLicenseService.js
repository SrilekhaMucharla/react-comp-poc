import { getProxiedServiceUrl } from 'gw-portals-url-js';
import { DocumentUploadService } from 'gw-portals-document-js';

export default class DriverLicenseService {
    /**
     * Upload Barcode image.
     *
     * @param {File} file
     * @returns {Promise}
     * @memberof LoadSaveService
     */
    static uploadBarcode(file) {
        const documentMetadata = {
            name: file.name,
            mimeType: file.type,
            sessionID: 'dl',
        };
        return DocumentUploadService.send(getProxiedServiceUrl('driversLicenseUpload'), file, documentMetadata);
    }
}
