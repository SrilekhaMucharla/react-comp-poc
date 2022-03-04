const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

const containsEmail = (word) => {
    return word.match(EMAIL_REGEX);
};

const replaceEmail = (word) => {
    const reductedWord = word.replace(EMAIL_REGEX, 'email_deleted');
    return reductedWord;
};

const reductEmailInString = (text) => {
    if (!text || text.length === 0) return text;
    // split string to words and remove extra spaces
    const words = text.split(/\s+/);
    words.forEach((word, index) => {
        if (containsEmail(word)) words[index] = replaceEmail(word);
    });
    let newText;
    words.forEach((word, index) => {
        if (index === 0) newText = word;
        else newText = newText.concat(' ', word);
    });
    return newText;
};

export default (reductEmailInString);
