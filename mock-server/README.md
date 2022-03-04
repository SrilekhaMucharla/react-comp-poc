# MOCK SERVER FOR POLICY CENTER

### PREREQUIREMENTS

You need to have Java 8 instlled.
If you don't want to install another version of Java on your machine - download [Zulu](https://jp.azul.com/downloads/zulu-community/?package=jdk) in version Java 8 (LTS) as .zip and extract it to the directory of your choice.

After installing the dependencies (next step), in mock-server directory open node-modules/mockserver-node/index.js file and in line 281 change
`mockServer = spawn('java', ...`
for
`mockServer = spawn('{path_to_java8}', ...`
and point to the java/bin file of the zulu.

### INSTALLING

1. go to the mock-server directory in the terminal
2. type `npm install`

### RUNNING

1. in the terminal (main directory) type `npm run pc:mock-server start`

Server will run on port **1080** by default, but you can change this in server.js file (`mockServerPort` variable).

> If you want to see inner logs of mock-server in the console, set `verbose` and `trace` to true. For further informations check [Mockserver documentation](https://www.mock-server.com/)

### CONNECING WITH QUOTE AND BUY APPLICATION

To reach mock server instead of PolicyCenter instance change following values in your .env.local file:

` GW_RUN_TIME_HOST=http://localhost:1080/{{SUITE_APPLICATION}}/service/unauthenticated/edgev10`
and
`GW_BUILD_TIME_HOST=http://localhost:1080/{{SUITE_APPLICATION}}/service/edgev10`

If you changed the port in the server.js, don't forget to update it accordingly in both variables.

### DASHBOARD

The UI can be opened in any browser using the URL

`http(s)://localhost:1080/mockserver/dashboard`
See `mockServerHost` and `mockServerPort` variables in file server.js

> More information can be found [here](https://www.mock-server.com/mock_server/mockserver_ui.html).

### REQUESTS AND RESPONSES (EXPECTATIONS)

There following endpoints available in the mock server.

| RUNTIME  | METHOD / NAME                 | REQ METHOD | REQ BODY                                                           | REQ PATH                                               | RES BODY                                                |
| -------- | -------------------- | ---------- | ------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| App | create | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/quote | `./responses/create.json` |
| App | fetchHostedPaymentUrl| POST | will match anything | /pc/service/unauthenticated/edgev10/payment/payment | `./responses/fetchHostedPaymentUrl.json` |
| App | fetchOrderCode | POST | will match anything | /pc/service/unauthenticated/edgev10/payment/payment | `./responses/fetchOrderCode.json` |
| App | lookupAddressByPostCode | POST | will match anything | /pc/service/unauthenticated/edgev10/address/lookup | `./responses/lookupAddressByPostCode.json` |
| App | lwrSaveAndQuote | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/quote | `./responses/lwrSaveAndQuote.json` |
| App | matchForAll | POST | will match anything | /pc/service/unauthenticated/edgev10/ipid/matcher | `./responses/matchForAll.json` |
| App | retrieve | POST | will match anything | /pc/service/unauthenticated/edgev10/docretrieve/document | `./responses/retrieve.json` |
| App | retrieveManufacturers | POST | will match anything | /pc/service/unauthenticated/edgev10/vehicleinfo/lookup | `./responses/retrieveManufacturers.json` |
| App | retrieveModels | POST | will match anything | /pc/service/unauthenticated/edgev10/vehicleinfo/lookup | `./responses/retrieveModels.json` |
| App | retrieveVehicleDataBasedOnVRN | POST | will match anything | /pc/service/unauthenticated/edgev10/vehicleinfo/lookup | `./responses/retrieveVehicleDataBasedOnVRN.json` |
| App | sendEmailNotification | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/quote | `./responses/sendEmailNotification.json` |
| App | updateDraftSubmission | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/quote | `./responses/updateDraftSubmission.json` |
| App | updateMarketingPreferences | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/quote | `./responses/updateMarketingPreferences.json` |
| App | updateQuote | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/customquote | `./responses/updateQuote.json` |
| App | updateQuoteCoverages | POST | will match anything | /pc/service/unauthenticated/edgev10/quote/customquote | `./responses/updateQuoteCoverages.json` |
| App | validateBankAccount | POST | will match anything | /pc/service/unauthenticated/edgev10/validation/validate | `./responses/validateBankAccount.json` |
| Prebuild | Address lookup       | POST       | will match the body in `./prebuild/address_lookup.json`            | /pc/service/edgev10/address/lookup                     | `./prebuild/address_lookup.json`            |
| Prebuild | Coverage             | POST       | will match the body in `./prebuild/coverage_coverage.json`         | /pc/service/edgev10/coverage/coverage                  | `./prebuild/coverage_coverage.json`         |
| Prebuild | Locale (en_GB)       | POST       | will match the body in `./prebuild/locale_en_gb.json`              | /pc/service/edgev10/locale/locale                      | `./prebuild/locale_en_gb.json`              |
| Prebuild | Locale (en_US)       | POST       | will match the body in `./prebuild/locale_en_us.json`              | /pc/service/edgev10/locale/locale                      | `./prebuild/locale_en_us.json`              |
| Prebuild | Locale (get config)  | POST       | will match the body in `./prebuild/locale_getConfig.json`          | /pc/service/edgev10/locale/locale                      | `./prebuild/locale_getConfig.json`          |
| Prebuild | Propertycode         | POST       | will match the body in `./prebuild/propertycode_propertycode.json` | /pc/service/edgev10/propertycode/propertycode          | `./prebuild/propertycode_propertycode.json` |
| Prebuild | Quote (availability) | POST       | will match the body in `./prebuild/quote_availability.json`        | /pc/service/edgev10/quote/availability                 | `./prebuild/quote_availability.json`        |
| Prebuild | Quote (custom quote) | POST       | will match the body in `./prebuild/quote_customquote.json`         | /pc/service/edgev10/quote/customquote                  | `./prebuild/quote_customquote.json`         |
| Prebuild | Quote (quote)        | POST       | will match the body in `./prebuild/quote_quote.json`               | /pc/service/edgev10/quote/quote                        | `./prebuild/quote_quote.json`               |
| Prebuild | Quote (slquote)      | POST       | will match the body in `./prebuild/quote_slquote.json`             | /pc/service/edgev10/quote/slquote                      | `./prebuild/quote_slquote.json`             |
| Prebuild | Segmentation         | POST       | will match the body in `./prebuild/segmentation_abexperiment.json` | /pc/service/edgev10/segmentation/abexperiment          | `./prebuild/segmentation_abexperiment.json` |
| Prebuild | Validation           | POST       | will match the body in `./prebuild/validation_validate.json`       | /pc/service/edgev10/validation/validate                | `./prebuild/validation_validate.json`       |
| Prebuild | Payment              | POST       | will match the body in `./prebuild/payment_payment.json`           | /pc/service/edgev10/payment/payment                    | `./prebuild/payment_payment.json`           |


### RECORDING REAL POLICY CENTER REQUESTS AND RESPONSES

Mock server can work as a proxy between appliation and Policy Center by  forwarding the requests and resposnses. To run mock server in the record mode open the terminal and type 
```npm run pc:mock-server record```

Mock server will run on the 1080 port. The configuration of the .env.local file for the application should be the same as described before. The configuration of the Policy Center endpoint can be found in record.js file.

After running the application every single request and response will be recorded by the mock server. You can access recorded data in the dashboard. 

### ADDING NEW EXPECTATION

You can add another response for given requests in server.js file.

> See [Creating expectations](https://www.mock-server.com/mock_server/creating_expectations.html) for more complex scenarios.

If you want to add expectation for recorded requests and response - follow the examples of already added expectations. Recorded body of a response can be copied directly from the dashboard of the mock server. Any new expectations need to be documented in  "REQUESTS AND RESPONSES (EXPECTATIONS)" section.
