export default () => {
    return {
        getStates(val) {
            let availableStates = [];
            if (val) {
                const stateTypekey = val.typelist.xCenter.types.typelists.find((typelist) => typelist.typeName === 'typekey.State');
                availableStates = stateTypekey.codes.filter((tk) => tk.belongsToCategory(val));
            }
            return availableStates;
        }
    };
};
