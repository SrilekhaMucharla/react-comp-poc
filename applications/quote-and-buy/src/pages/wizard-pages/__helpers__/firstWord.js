const firstWord = (sentence) => {
    let first = null;
    if (typeof sentence === 'string') {
        const words = sentence.split(' ');
        if (words.length > 0) first = words['0'];
    }
    return first;
};

export default (firstWord);
