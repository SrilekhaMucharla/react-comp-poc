# Initial Setup
## Required software for Deployment
1. Node.js 12.14.1
2. NPM version 6.13.4

Verify your Node version running: **node -v**

## Install the Digital Frontend
1. Install the necessary dependencies: **npm run bootstrap**
    1. The external dependency es6-promise-pool might be missing during install, if bootstrap fails run the following command and then bootstrap again.
        1. **npm install es6-promise-pool**
2. If you need to reset the dependencies: **npm run reset**
    1. Reset might not work properly in Windows, if it fails run the three following commands on GitBash from your QuoteAndBuy folder:
        1. **find ./ -name 'package-lock.json' -type f -exec rm -fr {} \;**
        2. **find ./ -name 'node_modules' -type d -exec rm -fr {} \;**
        3. **npm cache verify;**
3. Create an .env.local file (copy and past .env)
4. Set **GW_BUILD_TIME_HOST** to your destination server (ensure that the URL points at **edgev10** and not **edge**)
5. Set **GW_BUILD_TIME_HOST_USERNAME=su** and **GW_BUILD_TIME_HOST_PASSWORD=gw**
6. Set **GW_RUN_TIME_HOST** to your destination server (ensure that the URL points at **edgev10** and not **edge**)
7. Set **GW_IS_VERSION=emerald**
8. Build the application (There has to be a working PolicyCenter set on **GW_BUILD_TIME_HOST**): **npm run quote-and-buy -- prebuild**
9. Start the application: **npm run quote-and-buy -- start**

## Unit testing & ESlint
* Run all tests, coverage with ESLint **`ROOT>npm run test`**
* Run all tests, coverage for Application **`ROOT>npm run quote-and-buy test`**
* Run one test, coverage for one particular page **`ROOT>npm run quote-and-buy test:oneFile HDDriverEmailPage`**
    * Argument must match file name eg. `HDDriverEmailPage` matches `HDDriverEmailPage.jsx` anb `HDDriverEmailPage.test.js`. This will run test with coverage against one page.
    * **`ROOT>npm run quote-and-buy test:oneFile HD`** will run all test starting with `HD` with coverage against all files starting with `HD`
    * **`ROOT>npm run hastings-components test:oneFile HDForm`** will run all test starting with `HD` with coverage against all files starting with `HD`

## ESLint
To run report for given file use this command:

`eslint -c ./.eslintrc.js -o ./eslint-report.html -f html **/HDDriverLicenceLengthPage.test.js **/OTHER_FILE`

Sometimes more specific PATHs are needed:

`eslint -c ./.eslintrc.js -o ./eslint-report.html -f html common/**/HDDatePicker.jsx ./applications/**/HDDriverDOBPage*`



## Documentation
The GW documentation can be found at S:\Digital\Digital 11

CustomerEngage_QuoteAndBuy1110_Docs has a PDF folder with all the documentation (*InstallGuide, DevelopersGuide and AppGuide*)

## Developer's Guide
Reading this document is strongly recommended to understand how Quote&Buy works. For front end only developers, the most important sections to start with are:
1. Frontend Capabilities and Custom Components
2. Digital Services Processing
3. Frontend Framework

## Configuring the GitHub branch for Jenkins builds
The QuoteAndBuy build needs a running instance of GW to fetch information on. Depending on the changes that you are making you may want the Jenkins build to
point to a specific environment. You can control this by altering the `jenkinsBuild.propertes` file. Specifically you will need to amend the `build.environment.pc`
parameter to point to the intended environment, for example `build.environment.pc=CSDT2`. You can find the environment names on [RM Dashboard](https://rmdashboard.network.uk.ad).

## Microblink

You can configure Driver License scan by adding Microblink license in `.env` file:

`MICROBLINK_LICENCE=sRwAAAYJbG9jYWxob3N0r/lOPig/w35CpJlWKFU/ZAQJ65bCOvcTTgSZ2sl/rAR+mz1yQTaObJI+FP6I/H4sG87OysH5rgzN4XaWz61p8ZecGUlq9AiindNQeI/ZDL0YHdrC22sUSoK1ri3i9JZiS/Xuu/OAH41se3oIp6hF9qYnExR5cNk5dCPfGMdXozseUiDh6siiDiX5X4zM8+s0Ms7/IcZWBNbMHxuHzEryJyiDlH8rO5QR2IPwqz34uivkQxuc39aJEiHlO64eSL1aon8gn1I=`
