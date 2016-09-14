"use strict";

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

function merge(target, source) {
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                
                merge(target[key], source[key]);
            } 
            else {
                Object.assign(target, { [key]: source[key] });
            }
        });
    }
    
    return target;
}
    
class Locale {
    constructor(locale) {
        if(locale instanceof Locale) {
            return locale;
        }
        else if(typeof locale == "string") {
            let info = locale.split('-');
            
            this.language = info[0].toLowerCase();
            
            if(info.length > 1) {
                this.country = info[info.length - 1].toUpperCase();
            }
        }
        else if(locale && typeof locale == "object") {
            for(let k in locale) {
                if(locale.hasOwnProperty(k)) {
                    this[k] = locale[k];
                }
            }
        }
        else {
            throw new Error('Wrong locale data');
        }
    }
    
    toString(sep) {
        sep = sep || "-";
        
        if(this.country) {
            return this.language + sep + this.country;
        }
        
        return this.language;
    }
    
    is(locale, strict) {
        locale = new Locale(locale);
        
        if(strict) {
            return locale.toString() == this.toString();
        }
        else {
            return locale.language == this.language;
        }
    }
}

class Localization {
    constructor(options) {
        let defaults = {
            paramReplaceSign: "%%",
            translateParamsHandler: function(value, key, params) {
                return value || '';
            },
            translateValueHandler: function(value, key, params) {
                if(typeof value == "object" || value === undefined) {
                    return key;
                }
                
                return value;
            }
        }
        
        this.options = merge(defaults, options || {});
        
        this.paramReplaceSign = this.options.paramReplaceSign;
        this.dictionaries = {};
        
        this.defaultLocale(this.options.defaultLocale || { language: 'en', country: 'US'});
        this.currentLocale(this._defaultLocale);
    }
    
    has(locale, strict) {
        if(this._currentLocale.is(locale, strict) || this._defaultLocale.is(locale, strict)) {
            return true;
        }
        
        return false;
    }
    
    supports(locale) {
        locale = this.createLocale(locale);
        
        let LocaleString = locale.toString();            
        let dict = this.dictionaries[LocaleString];
        
        if(!dict) {
            dict = this.dictionaries[locale.language];
        }
        
        return !!dict;
    }
    
    bruteVariants(excludeDefault) {
        let currentString = this._currentLocale.toString();
        let currentStringDash = this._currentLocale.toString("_");
        let defaultString = this._defaultLocale.toString();
        let defaultStringDash = this._defaultLocale.toString("_");            
        let variants = [];
        
        let variantsCurrent = [
            currentString,
            currentString.toLowerCase(),
            currentString.toUpperCase(),
            currentStringDash,
            currentStringDash.toLowerCase(),
            currentStringDash.toUpperCase(),
            this._currentLocale.language.toLowerCase(),
            this._currentLocale.language.toUpperCase()              
        ];
        
        let variantsDefault = [];
        
        if(!excludeDefault) {
            variantsDefault = [
                defaultString,
                defaultString.toLowerCase(),
                defaultString.toUpperCase(),
                defaultStringDash,
                defaultStringDash.toLowerCase(),
                defaultStringDash.toUpperCase(),
                this._defaultLocale.language.toLowerCase(),
                this._defaultLocale.language.toUpperCase()                
            ];
        }
        
        variantsCurrent.concat(variantsDefault).map(function(variant) {
            if(variants.indexOf(variant) == -1) {
                variants.push(variant);
            }
        })
        
        return variants;
    }
    
    brute(fn, excludeDefault) {            
        let variants = this.bruteVariants();            
        let i = 0;
        
        function next() {
            let val = variants[i];
            
            i++;
            
            if(val) {
                fn(val, next);
                
                return true;
            }
            else {
                return false;
            }
        }
        
        next();
    }
    
    createLocale(locale) {
        return new Locale(locale);
    }
    
    dictionary(locale, body, isMerge) {
        locale = this.createLocale(locale);
        
        let LocaleString = locale.toString();            
        let dict = this.dictionaries[LocaleString];
        
        if(!dict) {
            dict = this.dictionaries[locale.language];
        }
        
        if(!body) {
            return dict || null;
        }  
        
        if(isMerge) {
            return this.dictionaries[LocaleString] = merge(dict || {}, body);
        }
        
        return this.dictionaries[LocaleString] = body;        
    }
    
    currentLocale(locale) {
        if(!locale) {
            return this._currentLocale;
        }
                
        return this._currentLocale = this.createLocale(locale);        
    }
    
    defaultLocale(locale) {
        if(!locale) {
            return this._defaultLocale;
        }
                
        return this._defaultLocale = this.createLocale(locale);        
    }
    
    valueByKey(obj, key) {
        key = key.replace(/\[([\d]+)\]/, '.$1');
        
        let levels = key.split(".");
        let mask = obj;
        let isUndefined = false;
        let value;
        let i = 0;
        
        while (i < levels.length - 1) {
            if(mask[levels[i]] === undefined) {
                isUndefined = true;
                
                break;
            }

            mask = mask[levels[i]];
            i++;
        }
        
        value = isUndefined? undefined: mask[levels[levels.length - 1]];
        
        return value;
    }
    
    translate(key, params, options) {
        let defaults = {
            translateValueHandler: this.options.translateValueHandler,
            translateParamsHandler: this.options.translateParamsHandler
        }
        
        options = merge(defaults, options || {});
        
        let dictDefault = this.dictionary(this._defaultLocale) || {};
        let dictCurrent = this.dictionary(this._currentLocale) || {};
        let dictionary = merge(dictDefault, dictCurrent);
        let value = this.valueByKey(dictionary, key);
        
        value = options.translateValueHandler(value, key, params);            
        
        let i = 0;
        
        if(params && params.length) {
            value = value.replace(new RegExp(this.paramReplaceSign, 'g'), () => {
                let val = options.translateParamsHandler(params[i], key, params); 
                    
                i++;
                
                return val;
            })
        }
        
        return value;
    }
    
    date(date, options) {
        let intl = new Intl.DateTimeFormat(this._currentLocale.toString(), options);
        
        return intl.format(date);
    }
    
    number(num, options) {
        let intl = new Intl.NumberFormat(this._currentLocale.toString(), options);
        
        return intl.format(num);
    }
    
    currency(num, currency, options) {
        options = Object.assign(options || {},  {
            style: "currency",
            currency: currency
        })
        
        let intl = new Intl.NumberFormat(this._currentLocale.toString(), options);
                
        return intl.format(num);
    }
}    

Localization.Locale = Locale;

if(module && typeof module === "object" && typeof module.exports === "object") {
    module.exports = Localization;
}