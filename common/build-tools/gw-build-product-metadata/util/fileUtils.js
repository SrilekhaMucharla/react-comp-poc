const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

/**
 * Create file in the designated directory to store content
 *
 * @param {Object} content the content to be saved
 * @param {string} destinationPath path to save the content
 */
function writeFile(content, destinationPath) {
    const baseDir = path.dirname(destinationPath);
    fse.ensureDirSync(baseDir);
    fs.writeFileSync(destinationPath, JSON.stringify(content, null, 4));
}

module.exports = {
    writeFile
};
