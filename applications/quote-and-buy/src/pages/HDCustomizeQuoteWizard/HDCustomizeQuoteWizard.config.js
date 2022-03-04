import * as eptica from '../../customer/directintegrations/faq/epticaMapping';

// ui config without you drive and direct debit page

export const customizeWizardConfig = [{
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        },
        footerxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        },
        footermd: {
            span: 8,
            offset: 6
        }
    }],
    epticaIds: [eptica.CUSTOMISE_QUOTE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PNCD]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [
        eptica.LEGAL,
        eptica.BREAKDOWN_LEVELS,
        eptica.PERSONAL_ACCIDENT,
        eptica.SUBSTITUTE_VEHICLE,
        eptica.KEY_REPLACEMENT
    ]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.AUTOMATIC_UPGRADE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.SUMMARY]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        }
    }],
    epticaIds: [eptica.EMAIL_AND_MARKETING_PREF]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.PAYMENT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PASSWORD_AND_MYACCOUNT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.THANK_YOU]
}];

// ui config with you drive and direct debit page
export const customizeWizardConfigYDWithDebit = [{
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        },
        footerxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        },
        footermd: {
            span: 8,
            offset: 6
        }
    }],
    epticaIds: [eptica.CUSTOMISE_QUOTE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 6,
            offset: 3
        }
    }],
    epticaIds: [eptica.CUSTOMISE_QUOTE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PNCD]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [
        eptica.LEGAL,
        eptica.BREAKDOWN_LEVELS,
        eptica.PERSONAL_ACCIDENT,
        eptica.SUBSTITUTE_VEHICLE,
        eptica.KEY_REPLACEMENT
    ]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.AUTOMATIC_UPGRADE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.SUMMARY]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        }
    }],
    epticaIds: [eptica.EMAIL_AND_MARKETING_PREF]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.DIRECT_DEBIT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.PAYMENT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PASSWORD_AND_MYACCOUNT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.THANK_YOU]
}];

// ui config with direct debit page
export const customizeWizardConfigDebit = [{
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        },
        footerxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        },
        footermd: {
            span: 8,
            offset: 6
        }
    }],
    epticaIds: [eptica.CUSTOMISE_QUOTE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PNCD]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [
        eptica.LEGAL,
        eptica.BREAKDOWN_LEVELS,
        eptica.PERSONAL_ACCIDENT,
        eptica.SUBSTITUTE_VEHICLE,
        eptica.KEY_REPLACEMENT
    ]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.AUTOMATIC_UPGRADE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.SUMMARY]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        }
    }],
    epticaIds: [eptica.EMAIL_AND_MARKETING_PREF]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.DIRECT_DEBIT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.PAYMENT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PASSWORD_AND_MYACCOUNT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.THANK_YOU]
}];

// ui config with you drive and without direct debit page
export const customizeWizardConfigYDWithoutDebit = [{
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        },
        footerxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        },
        footermd: {
            span: 8,
            offset: 6
        }
    }],
    epticaIds: [eptica.CUSTOMISE_QUOTE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 6,
            offset: 3
        }
    }],
    epticaIds: [eptica.CUSTOMISE_QUOTE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PNCD]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [
        eptica.LEGAL,
        eptica.BREAKDOWN_LEVELS,
        eptica.PERSONAL_ACCIDENT,
        eptica.SUBSTITUTE_VEHICLE,
        eptica.KEY_REPLACEMENT
    ]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.AUTOMATIC_UPGRADE]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.SUMMARY]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 12,
            offset: 0
        }
    }],
    epticaIds: [eptica.EMAIL_AND_MARKETING_PREF]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.PAYMENT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 8,
            offset: 2
        }
    }],
    epticaIds: [eptica.PASSWORD_AND_MYACCOUNT]
}, {
    measurement: [{
        header: {
            span: 12
        }
    }, {
        bodyxs: {
            span: 12,
            offset: 0
        }
    }, {
        bodymd: {
            span: 10,
            offset: 1
        }
    }],
    epticaIds: [eptica.THANK_YOU]
}];
