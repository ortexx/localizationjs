import merge from 'lodash/merge';
import has from 'lodash/has';
import get from 'lodash/get';
import escapeRegExp from 'lodash/escapeRegExp';

/**
 * Class to create instances of locale
 */
export class Locale {
  /**
   * @param {Locate|object|string} locale
   */
  constructor(locale) {
    if (locale instanceof Locale) {
      return locale;
    }

    if (typeof locale == "string") {
      let info = locale.split(/[-_]+/g);
      this.language = info[0];
      info.length > 1 && (this.country = info[info.length - 1]);
    }
    else if (locale && typeof locale == "object") {
      this.language = locale.language;
      this.country = locale.country;
    }
    else {
      throw new Error('Wrong locale data');
    }

    if(!this.language) {
      throw new Error('Local instance must have at least language property');
    }

    this.language = this.language.toLowerCase();
    this.country && (this.country = this.country.toUpperCase());    
  }

  /**
   * Convert the object to string
   * 
   * @param {string} [sep="-"] - seporator for language and country
   * @returns {string}
   */
  toString(sep = '-') {
    if (this.country) {
      return this.language + sep + this.country;
    }

    return this.language;
  }

  /**
   * Check the locale is the same as the current
   * 
   * @param {Locate|object|string} locale
   * @param {boolean} [strict=false] - including the country or not
   * @returns {boolean}
   */
  is(locale, strict = false) {
    locale = new Locale(locale);

    if (strict) {
      return locale.toString() == this.toString();
    }
    else {
      return locale.language == this.language;
    }
  }
}

/**
 * Localization manager class
 */
export default class Localization {
  constructor(options = {}) {
    const defaults = {
      arraySign: "%%",
      objectPattern: { start: '{{', end: '}}' }
    };

    this.options = merge(defaults, options);
    this.dicts = {};    
    this.defaultLocale = new Locale(this.options.defaultLocale || { language: 'en', country: 'US' });
    this.currentLocale = new Locale(this.options.currentLocale || this.defaultLocale);
  }

  /**
   * Set a default locale
   * 
   * @param {Locate|object|string} locale 
   */
  setDefaultLocale(locale) {
    this.defaultLocale = new Locale(locale);
    this.__fullDict = this.createFullDict();
  }

  /**
   * Set a current locale
   * 
   * @param {Locate|object|string} locale 
   */
  setCurrentLocale(locale) {
    this.currentLocale = new Locale(locale);
    this.__fullDict = this.createFullDict();
  }

  /**
   * Get a default locale
   * 
   * @returns {Locate|object|string} locale 
   */
  getDefaultLocale() {
    return this.defaultLocale;
  }

  /**
   * Get a current locale
   * 
   * @returns {Locate|object|string} locale 
   */
  getCurrentLocale() {
    return this.currentLocale;
  }

  /**
   * Function is called on translate to change params if you need
   * 
   * @param {string} value 
   * @param {string} key
   * @param {object|array} [params]
   * @returns {string}
   */
  translateParamsHandler(value) {
    return value || '';
  } 

  /**
   * Function is called on translate to change the result value if you need
   * 
   * @param {string|object} value 
   * @param {string} key
   * @param {object|array} [params]
   * @returns {string|object}
   */
  translateValueHandler(value, key) {
    if (value === undefined) {
      return key;
    }

    return value;
  }

  /**
   * Check the locale is the same as the manager locale
   * 
   * @param {Locate|object|string} locale
   * @param {boolean} [strict=false] - including the country or not
   * @returns {boolean}
   */
  isLocale(locale, strict) {
    return this.currentLocale.is(locale, strict) || this.defaultLocale.is(locale, strict);
  }

  /**
   * Get all variants of writing a locale
   *  
   * @param {Locate|object|string} locale
   * @returns {string[]}
   */
  getLocaleVariants(locale) {
    locale = new Locale(locale);
    let dash = locale.toString();
    let underscore = locale.toString('_');

    return [
      dash,
      dash.toLowerCase(),
      dash.toUpperCase(),
      underscore,
      underscore.toLowerCase(),
      underscore.toUpperCase(),
      locale.language.toLowerCase(),
      locale.language.toUpperCase()
    ];
  }

  /**
   * Get a dictionary
   * 
   * @param {Locate|object|string} locale
   * @return {object|null} 
   * @param {boolean} [strict=false] - if true then check full match including a country
   */
  getDict(locale, strict = false) {
    locale = new Locale(locale);
    let dict = this.dicts[locale.toString()];

    if (!dict && !strict) {
      dict = this.dicts[locale.language];
    }

    return dict;
  }

   /**
   * Check the manager has the locale dictionary
   * 
   * @param {Locate|object|string} locale
   * @param {boolean} [strict=false] - if true then check full match including a country
   * @returns {boolean}
   */
  hasDict(locale, strict = false) {
    locale = new Locale(locale);
    let dict = this.dicts[locale.toString()];

    if (!dict && !strict) {
      dict = this.dicts[locale.language];
    }

    return !!dict;
  }

  /**
   * Add a dictionary
   * 
   * @param {Locate|object|string} locale 
   * @param {object} dict
   */
  addDict(locale, dict) {
    locale = new Locale(locale);
    this.dicts[locale.toString()] = merge({}, dict);
    this.isLocale(locale) && (this.__fullDict = this.createFullDict());
  }

  /**
   * Merge a dict with the existent
   * 
   * @param {Locate|object|string} locale 
   * @param {object} dict 
   */
  mergeDict(locale, dict) {
    locale = new Locale(locale);
    let localName = locale.toString();
    let current = this.dicts[localName] || {};
    this.dicts[localName] = merge({}, current, dict);
    this.isLocale(locale) && (this.__fullDict = this.createFullDict());
  }

  /**
   * Remove a dictionary
   * 
   * @param {Locate|object|string} locale 
   */
  removeDict(locale) {
    locale = new Locale(locale);
    delete this.dicts[locale.toString()];
    this.isLocale(locale) && (this.__fullDict = this.createFullDict());
  }

  /**
   * Get a union dictionary drom dafault and current locale
   * 
   * @returns {object}
   */
  getFullDict() {
    return this.__fullDict;
  }

  /**
   * Create a union dictionary drom dafault and current locale
   * 
   * @returns {object}
   */
  createFullDict() {
    return merge({}, this.getDict(this.defaultLocale), this.getDict(this.currentLocale));
  }

  /**
   * Check the translation existence by key
   * 
   * @param {string} key
   * @returns {boolean}
   */
  hasTranslation(key) {
    return has(this.getFullDict(), key);
  }

  /**
   * Translate a key value
   * 
   * @param {string} key 
   * @param {object|array} [params] 
   */
  translate(key, params = null) {
    let value = get(this.getFullDict(), key);
    
    if (typeof value == 'string') {
      if(!params || Array.isArray(params)) {
        let i = 0;  
        value = value.replace(new RegExp(escapeRegExp(this.options.arraySign), 'g'), () => {
          return this.translateParamsHandler(params? params[i++]: undefined, key, params);
        });
      }

      if(!params || typeof params == 'object') {
        const pattern = this.options.objectPattern;
        const start = escapeRegExp(pattern.start);
        const end = escapeRegExp(pattern.end);
        value = value.replace(new RegExp(start + '\\s*([\\w]+)\\s*' + end, 'g'), (m, v) => {
          return this.translateParamsHandler(params? params[v]: undefined, key, params);
        });
      }
    }
      
    return this.translateValueHandler(value, key, params);
  }

  /**
   * Localize a data
   * 
   * @param {Date} date 
   * @param {object} options 
   */
  date(date, options = {}) {
    const intl = new Intl.DateTimeFormat(this.currentLocale.toString(), options);
    return intl.format(date);
  }

  /**
   * Localize a number
   * 
   * @param {number} num 
   * @param {object} options 
   */
  number(num, options = {}) {
    const intl = new Intl.NumberFormat(this.currentLocale.toString(), options);
    return intl.format(num);
  }

  /**
   * Localize a currency
   * 
   * @param {number} num 
   * @param {string} currency 
   * @param {object} options 
   */
  currency(num, currency, options = {}) {
    options = merge({}, options, {
      style: "currency",
      currency: currency
    });

    const intl = new Intl.NumberFormat(this.currentLocale.toString(), options);
    return intl.format(num);
  }
}

Localization.Locale = Locale;
typeof window == 'object' && (window.Localization = Localization);
