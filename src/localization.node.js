const IntlPolyfill = require('intl');
const Localization = require('../dist/localization').default;

if (global.Intl) {
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
}
else {
  global.Intl = IntlPolyfill;
}

module.exports = Localization;