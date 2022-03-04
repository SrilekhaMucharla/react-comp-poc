const quoteFlow = {
    PersonalAuto: '/quote-pa',
    Homeowners: '/quote-ho',
    HOPHomeowners: '/quote-ho',
    CommercialProperty: '/quote-cp',
    BusinessOwners: '/quote-bop',
    WC7WorkersComp: '/quote-wc7'
};

const endorsementFlow = {
    PersonalAuto: '/endorsement-pa',
    Homeowners: '/endorsement-ho',
    CommercialProperty: '/endorsement-cp',
    BusinessOwners: '/endorsement-bop',
};

const renewalFlow = {
    CPLine: '/renewal-cp',
    BOPLine: '/renewal-bop',
};

export default {
    getQuoteFlowLinkFromProductName(productName) {
        return quoteFlow[productName];
    },
    getEndorsementFlowLinkFromProductName(productName) {
        return endorsementFlow[productName];
    },
    getRenewalFlowLinkFromProductName(productName) {
        return renewalFlow[productName];
    }
};
