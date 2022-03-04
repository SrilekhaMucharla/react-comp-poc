const productTypeIcons = {
    BOPQuickQuote: 'fa fa-bolt',
    BusinessAuto: 'fa fa-car',
    BusinessOwners: 'fa fa-universal-access',
    BP7BusinessOwners: 'fa fa-universal-access',
    Guidance: 'fa fa-universal-access',
    Homeowners: 'fa fa-home',
    PersonalAuto: 'fa fa-car',
    QuickQuote: 'fa fa-car',
    WorkersComp: 'fa fa-cubes'
};

const lobIcons = {
    BOPQuickQuote: 'fa fa-bolt',
    BusinessAuto: 'fa fa-truck',
    BusinessOwners: 'fa fa-universal-access',
    BP7BusinessOwners: 'fa fa-universal-access',
    CommercialPackage: 'fa fa-archive',
    CommercialProperty: 'fa fa-industry',
    GeneralLiability: 'fa fa-legal',
    Homeowners: 'fa fa-home',
    HOPHomeowners: 'fa fa-home',
    InlandMarine: 'fa fa-ship',
    PersonalAuto: 'fa fa-car',
    WorkersComp: 'fa fa-cubes'
};

const productCodeImages = {
    BOPQuickQuote: 'product_bopquickquote',
    BusinessAuto: 'product_commauto',
    BusinessOwners: 'product_businessowner',
    BP7BusinessOwners: 'product_bp7businessowner',
    Guidance: 'product_guidance',
    Homeowners: 'product_homeowners',
    HomeQuickQuote: 'product_homequickquote',
    PersonalAuto: 'product_personalauto',
    QuickQuote: 'product_quickquote',
    WorkersComp: 'product_workerscomp'
};

const policyTypeIcons = {
    BusinessOwnersLine: 'fa-briefcase',
    HomeownersLine: 'fa-home',
    HomeownersLine_HOE: 'fa-home',
    HOPLine: 'fa-home',
    PersonalAutoLine: 'fa-car'
};

const STOCK_PHOTO_URI = 'lob-images';

export default {
    getProductCodeIcon(productCode) {
        return productTypeIcons[productCode];
    },
    getLOBIcon(lobCode) {
        return lobIcons[lobCode];
    },
    getPolicyTypeIcons(lobCode) {
        return policyTypeIcons[lobCode];
    },
    getProductCodeImage(productCode) {
        const image = productCodeImages[productCode];
        return `${STOCK_PHOTO_URI}/${image}.svg`;
    }
};
