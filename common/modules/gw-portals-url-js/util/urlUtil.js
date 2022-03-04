export function encodeFormData(data) {
    return Object.entries(data)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

export function generateURL(endpoint, params) {
    let url = endpoint;
    const { urlParam, ...otherParams } = params;
    const urlSearchParams = encodeFormData(otherParams);

    if (urlParam) {
        url = `${endpoint}/${urlParam}`;
    }
    return `${url}?${urlSearchParams}`;
}
