const getCarName = (make, model) => {
    const modelStrArray = model.split(' ');
    let tempModel = modelStrArray[0];
    if (modelStrArray.length >= 2) {
        tempModel = `${modelStrArray[0]} ${modelStrArray[1]}`;
    }
    return `${make} ${tempModel}`;
};

export default getCarName;
