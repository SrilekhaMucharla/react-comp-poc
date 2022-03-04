const mockServer = require('mockserver-node');
const { mockServerClient } = require('mockserver-client');

const mockServerHost = 'localhost';
const mockServerPort = 1080;
const remoteHost = 'bx2-dev-dtpc03.test.hastings.local';
const remotePort = 9080;

mockServer
    .start_mockserver({
        serverPort: mockServerPort,
        verbose: true,
        trace: true,
        proxyRemotePort: remotePort,
        proxyRemoteHost: remoteHost,
    })
    .then(
        () => {
            mockServerClient(mockServerHost, mockServerPort)
                .retrieveRecordedRequestsAndResponses({})
                .then(
                    (recordedRequestsAndResponses) => {
                        console.log(
                            JSON.stringify(recordedRequestsAndResponses)
                        );
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        },
        (error) => {
            console.log(error);
        }
    );
