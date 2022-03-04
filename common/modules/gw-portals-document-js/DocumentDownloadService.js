import { generateURL } from 'gw-portals-url-js';

export default class DocumentDownloadService {
    static getDocumentLink(serviceEndpoint, params = {}) {
        const { documentID, ...rest } = params;
        const newParams = {
            urlParam: documentID,
            ...rest
        };
        return generateURL(serviceEndpoint, newParams);
    }

    static getDocument(templateDownloadEndpointURL, params, errorCallback) {
        fetch(templateDownloadEndpointURL, params).then((response) => {
            if (response.ok) {
                response.blob().then((blob) => {
                    const filename = response.headers.get('Content-Disposition').replace('attachment; filename=', '');
                    if (window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(blob, filename);
                    } else {
                        const downloadLink = document.createElement('a');
                        downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
                        downloadLink.setAttribute('download', filename);
                        downloadLink.style.display = 'none';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        downloadLink.remove();
                    }
                });
            } else {
                errorCallback();
            }
        });
    }
}
