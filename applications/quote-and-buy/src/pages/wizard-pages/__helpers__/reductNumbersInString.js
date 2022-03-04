const containsNumbers = (word) => {
    let isNumber = false;
    word.split('').forEach((letter) => {
        if (!Number.isNaN(Number(letter))) isNumber = true;
    });
    return isNumber;
};

const replaceNumbers = (word) => {
    const hashedWord = word.replace(/[0-9]+/g, 'num_deleted');
    return hashedWord;
};

const reductNumbersInString = (text) => {
    if (!text || text.length === 0) return text;
    // split string to words and remove extra spaces
    const words = text.split(/\s+/);
    words.forEach((word, index) => {
        if (containsNumbers(word)) words[index] = replaceNumbers(word);
    });
    let newText;
    words.forEach((word, index) => {
        if (index === 0) newText = word;
        else newText = newText.concat(' ', word);
    });
    return newText;
};

export default (reductNumbersInString);
