JavaScript Pseudo Localization / Sherlock Generator
=============================================== 

##Usage
```
js-pseudolizer
      -V, --version                    output the version number
      -t, --targetType [TargetType]    TargetType can be one of ["FILES","SINGLE_KEY"]
      -p, --pseudoType [PseudoType]    PseudoType can be one of ["EXPANSION","SHERLOCK","BOTH"]
      -k, --key [String]               key string
      -s, --source [String]            source string
      -c, --configFile [path]          path of the configuration file.
      -o, --outputFileName             outputted file name template (e.g.: <filename>_yy.<extension>)      
      -h, --help                       output usage information
```
`js-pseudolizer --help` for full documentation

##Development
```
//download dependencies
npm install
//run test
npm test
```
##How to use the library
####Specify dependency in package.json

#####Use .npmrc file to get dependencies

.npmrc should look something like

```
@gwre-g11n:registry=https://artifactory.guidewire.com/api/npm/globalization-npm-release/
_auth = <your auth token>
email = <your email>
always-auth = true
```
To get the configuration set, go to https://artifactory.guidewire.com/webapp/#/home and from Set Me Up select "globalization-npm-dev"

#####add andependency in your package.json
```
  "dependencies": {
    "commander": "^2.19.0",
    "commonjs": "0.0.1",
    ...
    "@gwre-g11n/js-pseudolizer": "1.0.0-SNAPSHOT"
  },
```

####Command Line
#####Pseudo localize a single key/source
```
js-pseudolizer --targetType "SINGLE_KEY" --key "key1" --source "a testing string" --pseudoType "both"
> [1tKQ2H_a testing string:::க்ਹੈ]
```
#####Pseudo localize files matching the patterns
```
js-pseudolizer --targetType "FILES" --pseudoType "BOTH" --outputFileName "<fileName>_yy.<extension>" "examples/example.json"
> examples/example_yy.json
> The number of created files: 1
```
#####Pseudo localize files based on the configuration file
example-config.yml
```
pseudoType: BOTH
outputFileName : yy.<extension>
patterns:
  - examples/example.json
```
Run pseudo localization
```
js-pseudolizer --targetType "FILES" --configFile "examples/example-config.yml"
> examples/yy.json
> The number of created files: 1
```

####Use library APIs

#####1. Import the class
```
const pseudolizer = require('@gwre-g11n/js-pseudolizer');
```
#####2. Configure the options based on your need
```
// set output pseudo type
pseudolizer.setPseudoType(pseudolizeFiles.pseudoType.BOTH);

// set output file pattern
pseudolizer.setOutputFileName("yy.<extension>");
```
#####3. Call APIs
Pseudo localize texts (key and source)
```
pseudolizer.pseudolizeTexts("key1","a testing string");
```
Pseudo localize files based on patterns
```
let patterns = ["src/modules/*/lang/en.json" "src/modules/main/en.json"];
pseudolizer.setFilePatterns(patterns);
//returns a promise with a list of file paths for created files 
//a reject promise will be returned if no files are matched
pseudolizer.pseudolizeFiles();
```
Pseudo localize files based on the configuration file
```
pseudolizer.loadByConfig("examples/example-config.yml");
//returns a promise with a list of file paths for created files 
//a reject promise will be returned if no files are matched
pseudolizer.pseudolizeFiles();
```