const mockServer = require('mockserver-node');
const { mockServerClient } = require('mockserver-client');
const prebuild = require('./prebuild');
const responses = require('./req-res');
const localeEnGB = require('./prebuild/locale_en_gb.json');
const localeEnUS = require('./prebuild/locale_en_us.json');

const mockServerHost = 'localhost';
const mockServerPort = 1080;

mockServer
    .start_mockserver({
        serverPort: mockServerPort,
        verbose: false,
        trace: false,
    })
    .then(
        () => {
            const mockResponse = (reqRes, expectationName) => {
                mockServerClient(mockServerHost, mockServerPort)
                    .mockAnyResponse(reqRes)
                    .then(
                        () => {
                            console.log(
                                `created ${expectationName} expectation`
                            );
                        },
                        (error) => {
                            console.log(error.body);
                        }
                    );
            };

            // mocked responses for api calls
            responses.forEach((reqRes) => {
                mockResponse(
                    {
                        httpRequest: {
                            method: reqRes.httpRequest.method,
                            path: reqRes.httpRequest.path,
                            body: {
                                type: 'JSON',
                                json: {
                                    method: reqRes.httpRequest.body.method,
                                },
                                matchType: 'ONLY_MATCHING_FIELDS',
                            }
                        },
                        httpResponse: {
                            statusCode: 200,
                            headers: {
                                'content-type': ['application/json; charset=utf-8']
                            },
                            body: JSON.stringify(reqRes.httpResponse.body),
                        },
                    },
                    reqRes.httpRequest.path
                );
            });

            // mocked responses for prebuild
            prebuild.forEach((reqRes) => {
                mockResponse(
                    {
                        httpRequest: {
                            method: reqRes.httpRequest.method,
                            path: reqRes.httpRequest.path,
                            body: {
                                type: 'JSON',
                                json: reqRes.httpRequest.body,
                                matchType: 'STRICT',
                            },
                        },
                        httpResponse: {
                            statusCode: 200,
                            headers: {
                                'content-type': ['application/json; charset=utf-8']
                            },
                            body: JSON.stringify(reqRes.httpResponse.body),
                        },
                    },
                    reqRes.httpRequest.path
                );
            });

            mockResponse(
                {
                    httpRequest: {
                        method: localeEnGB.httpRequest.method,
                        path: localeEnGB.httpRequest.path,
                        body: {
                            type: 'JSON',
                            json: {
                                params: ['en_GB'],
                            },
                            matchType: 'ONLY_MATCHING_FIELDS',
                        },
                    },
                    httpResponse: {
                        statusCode: 200,
                        headers: {
                            'content-type': ['application/json; charset=utf-8']
                        },
                        body: JSON.stringify(localeEnGB.httpResponse.body),
                    },
                },
                localeEnGB.httpRequest.path
            );

            mockResponse(
                {
                    httpRequest: {
                        method: localeEnUS.httpRequest.method,
                        path: localeEnUS.httpRequest.path,
                        body: {
                            type: 'JSON',
                            json: {
                                params: ['en_US'],
                            },
                            matchType: 'ONLY_MATCHING_FIELDS',
                        },
                    },
                    httpResponse: {
                        statusCode: 200,
                        headers: {
                            'content-type': ['application/json; charset=utf-8']
                        },
                        body: JSON.stringify(localeEnUS.httpResponse.body),
                    },
                },
                localeEnUS.httpRequest.path
            );
        },
        (error) => {
            console.log(JSON.stringify(error, null, '  '));
        }
    );
