const normalisedLobIcons = {
    PA: {
        image: 'personal-auto',
        font: 'fa-car'
    },
    HO: {
        image: 'home-owners',
        font: 'fa-home'
    },
    GL: {
        image: 'general-liability',
        font: 'fa-legal'
    },
    BO: {
        image: 'business-owners',
        font: 'fa-briefcase'
    },
    IM: {
        image: 'inland-marine',
        font: 'fa-ship'
    },
    CP: {
        image: 'commercial-property',
        font: 'fa-industry'
    },
    CA: {
        image: 'commercial-auto',
        font: 'fa-truck'
    },
    WC: {
        image: 'workers-comp',
        font: 'fa-cubes'
    },
    CPKG: {
        image: 'commercial-package',
        font: '<unknown>'
    },
    TRVL: {
        image: 'travel',
        font: 'fa-plane'
    },
    PUL: {
        image: 'no-icon',
        font: 'fa-umbrella'
    },
    default: {
        image: 'no-icon', // Using an existing empty image as default to avoid 404s
        font: 'fa-bell'
    }
};

const materialLobIcons = {
    PA: {
        image: 'personal-auto',
        font: 'mi-directions_car'
    },
    HO: {
        image: 'home-owners',
        font: 'mi-home'
    },
    GL: {
        image: 'general-liability',
        font: 'mi-healing'
    },
    BO: {
        image: 'business-owners',
        font: 'mi-store'
    },
    IM: {
        image: 'inland-marine',
        font: 'mi-directions_boat'
    },
    CP: {
        image: 'commercial-property',
        font: 'fa-industry'
    },
    CPKG: {
        image: 'commercial-package',
        font: 'mdi-garage'
    },
    CA: {
        image: 'commercial-auto',
        font: 'fa-truck'
    },
    WC: {
        image: 'workers-comp',
        font: 'fa-cubes'
    },
    TRVL: {
        image: 'travel',
        font: 'fa-plane'
    },
    PUL: {
        image: 'no-icon',
        font: 'fa-umbrella'
    },
    default: {
        image: 'no-icon', // Using an existing empty image as default to avoid 404s
        font: 'fa-bell'
    }
};

const lobKeys = {
    PersonalAuto: 'PA',
    PersonalAutoLine: 'PA',
    auto_per: 'PA',
    Homeowners: 'HO',
    homeowners: 'HO',
    HomeOwners: 'HO',
    HomeownersLine_HOE: 'HO',
    HomeownersLine: 'HO',
    HOPLine: 'HO',
    HOLine: 'HO',
    HOPHomeowners: 'HO',
    GeneralLiability: 'GL',
    GeneralLiabilityLine: 'GL',
    GLLine: 'GL',
    BusinessOwners: 'BO',
    BusinessOwnersLine: 'BO',
    BOPLine: 'BO',
    InlandMarine: 'IM',
    InlandMarineLine: 'IM',
    IMLine: 'IM',
    CommercialProperty: 'CP',
    CommercialPropertyLine: 'CP',
    CPLine: 'CP',
    CommercialAuto: 'CA',
    BusinessAuto: 'CA',
    BusinessAutoLine: 'CA',
    WorkersComp: 'WC',
    WorkersCompLine: 'WC',
    WC7WorkersComp: 'WC',
    CommercialPackage: 'CPKG',
    CommercialPackageLine: 'CPKG',
    travel_perLine: 'TRVL',
    PersonalUmbrellaLine: 'PUL'
};

const getNormalisedObject = (lobCode) => {
    const normalisedKey = lobKeys[lobCode] || 'default';
    return normalisedLobIcons[normalisedKey];
};

const getMaterialObject = (lobCode) => {
    const normalisedKey = lobKeys[lobCode] || 'default';
    return materialLobIcons[normalisedKey];
};

const getImageIcon = (lobCode) => {
    return getNormalisedObject(lobCode).image;
};

const getFontIcon = (lobCode) => {
    return getNormalisedObject(lobCode).font;
};

const getMaterialIcon = (lobCode) => {
    return getMaterialObject(lobCode).font;
};

export default {
    getImageIcon: getImageIcon, getFontIcon: getFontIcon, getMaterialIcon: getMaterialIcon
};
