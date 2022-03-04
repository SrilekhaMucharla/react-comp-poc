const sherlockHasher = require('../src/sherlock-hasher'),
     expander = require('../src/expander'),
     fs = require('fs'),
     path = require('path'),
     glob = require('glob'),
     debug = require('debug')('js-pseudolizer'),
     yaml = require('js-yaml');


const DEFAULT_OUTPUT_FILENAME = '<filename>_yy.<extension>';
const DEFAULT_TYPE = "BOTH";

pseudolizer = function() {

  pseudolizerOut = {

    pseudoType : Object.freeze({"EXPANSION":"EXPANSION", "SHERLOCK":"SHERLOCK", "BOTH":"BOTH"}),
    selectedType : DEFAULT_TYPE,
    outputFileName: DEFAULT_OUTPUT_FILENAME,
    filePathPatterns: [],

    loadByConfig: function(configFilePath) {
      let obj = yaml.load(fs.readFileSync(configFilePath, {encoding: 'utf-8'}));
      if (obj.pseudoType) {
        this.setPseudoType(obj.pseudoType);
      }

      if (obj.outputFileName) {
        this.setOutputFileName(obj.outputFileName);
      }

      if (obj.patterns) {
        this.setFilePathPatterns(obj.patterns);
      }
    },

    pseudolizeFiles: function () {
      if (!this.filePathPatterns || !Array.isArray(this.filePathPatterns) || !this.filePathPatterns.length) {
        throw new Error("No valid filePathPatterns provided!");
      }

      if (!isValidPseudoType(this.selectedType)) {
        throw new Error("PseudoType is empty or not supported!");
      }

      if (!this.outputFileName) {
        throw new Error("No valid outputFileName provided!");
      }

      let allPromises = [];
      this.filePathPatterns.forEach(pattern => {
        let onePatternPromise =
            getMatchingFiles(pattern).then((files) => {
              return pseudolizeSpecificFiles(files,this.selectedType,this.outputFileName);
            })
            .catch(e => {
              console.error(e);
              return Promise.reject(e);
            });
        allPromises.push(onePatternPromise);
      });
      let overallPromise = Promise.all(allPromises).then(flattenArr).then((outputFilePaths) => {
        if (outputFilePaths.length == 0) {
          let errMessage = "No matching files for the patterns";
          console.error(errMessage);
          return Promise.reject(new Error(errMessage));
        }
        return Promise.resolve(outputFilePaths);
      });

      return overallPromise;
    },

    pseudolizeKeySource: function (key, source) {
      return pseudolizeKeySourceInternal(key, source, this.selectedType);
    },

    setPseudoType: function(pseudoType) {
      if (!isValidPseudoType(pseudoType)) {
        throw new Error("PseudoType is empty or not supported!");
      }
      this.selectedType = pseudoType.toUpperCase();
    },

    setOutputFileName: function(outputFileName) {
      this.outputFileName = outputFileName;
    },

    setFilePathPatterns: function(filePathPatterns) {
      if (!filePathPatterns || !Array.isArray(filePathPatterns) || !filePathPatterns.length) {
        throw new Error("filePathPatterns need to be an array");
      }
      this.filePathPatterns = filePathPatterns;
    },

    reset: function (resetFilePatterns) {
      this.setPseudoType(DEFAULT_TYPE);
      this.setOutputFileName(DEFAULT_OUTPUT_FILENAME);
      if (resetFilePatterns) {
        this.filePathPatterns = [];
      }
    }
  };

  function pseudolizeSpecificFiles(files, pseudoType, outputFileName) {
    let allPromises = [];
    files.forEach(filePath => {
      let oneFilePromise = readFile(filePath)
                  .then(JSON.parse)
                  .then(resourceObj => {
                    convertToPseudoSherlock(resourceObj, pseudoType);
                    return JSON.stringify(resourceObj, null, 2);
                  })
                  .then((outputText) => {
                    let outputFilePath = getOutputFilePath(filePath,outputFileName);
                    return writeFile(outputFilePath, outputText);
                  });
      allPromises.push(oneFilePromise);
    });
    return Promise.all(allPromises);
  }

  function isValidPseudoType(type){
    if(!type || !pseudolizerOut.pseudoType.hasOwnProperty(type.toUpperCase())){
      return false;
    }
    return true;
  }

  function pseudolizeKeySourceInternal(key, source, type) {
    let paddedSource = source;
    let sherlock = "";
    if (type == pseudolizerOut.pseudoType.SHERLOCK || type == pseudolizerOut.pseudoType.BOTH) {
      sherlock = sherlockHasher.generateSherlock(key, source) + "_";
    }
    if (type == pseudolizerOut.pseudoType.EXPANSION || type == pseudolizerOut.pseudoType.BOTH) {
      paddedSource = expander.addPadding(source);
    }
    return `[${sherlock}${paddedSource}]`;
  }

  function convertToPseudoSherlock(jsonObj,type) {
    for (let key in jsonObj) {
      const source = jsonObj[key];
      switch (typeof source) {
        case "string":
          jsonObj[key] = pseudolizeKeySourceInternal(key, source,type);
          break;

        case "object":
          convertToPseudoSherlock(source,type);
          break;
      }
    }
    return jsonObj;
  }

  function readFile(file) {
    debug(`Reading from file [${file}]`);
    return new Promise((resolve, reject) => {
      fs.readFile(file, {encoding: 'utf8'}, function (err, data) {
        if (err) {
          const newErr = new Error(`Unable to read file [${file}].\n${err}`);
          reject(newErr);
        } else {
          resolve(data);
        }
      });
    });
  }

  function getOutputFilePath(originalFilePath, outputFileName) {
    const dir = path.dirname(originalFilePath),
        ext = path.extname(originalFilePath),
        base = path.basename(originalFilePath, ext);
    let outputFilePath = outputFileName.replace(/<filename>/,base);
    outputFilePath = outputFilePath.replace(/.<extension>/,ext);
    return path.join(dir, outputFilePath);
  }

  function writeFile(outputFilePath, outputText) {
    debug(`Writing to file [${outputFilePath}]`);
    return new Promise((resolve, reject) => {
      fs.writeFile(outputFilePath, outputText, {encoding: 'utf8'}, function(err) {
        if(err) {
          const newErr = new Error(`Unable to write file [${outputFilePath}].\n${err}`);
          reject(newErr);
        } else {
          resolve(outputFilePath);
        }
      });
    });
  }

  function getMatchingFiles(globPattern) {
    return new Promise((resolve, reject) => {
      glob(globPattern, null, (err, files) => {
        if (err) {
          const newErr = new Error(`Error matching pattern [${globPattern}].\n${err}`);
          reject(newErr);
        } else {
          if (!files.length) {
            debug(`No files found matching pattern [${globPattern}]`);
          }
          resolve(files);
        }
      })
    })
  }

  /**
   * Recursively flatten array (cannot use Array.prototype.flat()
   * due to no support under nodeJS v10
   * @param arr
   * @returns arr flattened
   */
  function flattenArr(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten);
    }, []);
  }

  return pseudolizerOut;
}();

module.exports = pseudolizer;