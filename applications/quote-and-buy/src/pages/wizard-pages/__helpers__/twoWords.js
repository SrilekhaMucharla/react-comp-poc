const twoWords = (sentence) => {
    let two = null;
    if (typeof sentence === 'string') {
        const words = sentence.split(' ');
        if (words.length > 0) two = words['0'];
        if (words.length > 1) two = `${words['0']} ${words['1']}`;
    }
    return two;
};

export default (twoWords);
