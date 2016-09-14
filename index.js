"use strict";

const IntlPolyfill = require('intl');

if(Intl) {
    Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
}
else {
    global.Intl = IntlPolyfill;
}

const Localization = require('./localization');

module.exports = Localization;