"use strict"

const assert = require('chai').assert;
const _ = require('lodash');
const Localization = require('../src/localization.node');
const Locale = Localization.Locale;

describe('localization.js', () => {
  describe('Locale', () => {
    describe('.constructor()', () => {
      it('should not create with empty locale', () => {
        assert.throws(() => new Locale());
      });
      
      it('should not create with wrong locale', () => {
        assert.throws(() => new Locale({ x: 4 }));
      }); 

      it('should create it from string with language', () => {
        const locale = new Locale('en');
        assert.equal(locale.language, 'en', 'check the language');
        assert.isNotOk(locale.country, 'check the country');
      });
      
      it('should create it from string with dash', () => {
        const locale = new Locale('en-us');
        assert.equal(locale.language, 'en', 'check the language');
        assert.equal(locale.country, 'US', 'check the country');
      });

      it('should create it from string with underscore', () => {
        const locale = new Locale('en_us');
        assert.equal(locale.language, 'en', 'check the language');
        assert.equal(locale.country, 'US', 'check the country');
      });

      it('should create it with an object', () => {
        const locale = new Locale({ language: 'en', country: 'US' });
        assert.equal(locale.language, 'en', 'check the language');
        assert.equal(locale.country, 'US', 'check the country');
      });

      it('should create it from another locale', () => {
        const locale = new Locale(new Locale('en-US'));
        assert.equal(locale.language, 'en', 'check the language');
        assert.equal(locale.country, 'US', 'check the country');
      });
    });

    describe('.toString()', () => {      
      it('should return only language', () => {
        const locale = new Locale('en');
        assert.equal(locale.toString(), 'en');
      });

      it('should return full string with dash', () => {
        const locale = new Locale('en_US');
        assert.equal(locale.toString(), 'en-US');
      });

      it('should return full string with undescore', () => {
        const locale = new Locale('en-US');
        assert.equal(locale.toString('_'), 'en_US');
      });
    });

    describe('.is()', () => {
      it('should be ok with language', () => {
        const locale = new Locale('en-US');
        assert.isTrue(locale.is('en'));
      });  
      
      it('should be ok with country', () => {
        const locale = new Locale('en-US');
        assert.isTrue(locale.is('en-us'));
      }); 

      it('should fail strict mode', () => {
        const locale = new Locale('en-US');
        assert.isFalse(locale.is('en', true));
      });
    });
  });

  describe('Localization', () => {
    const en = {
      hello: 'hello',
      nested: {
        hello: 'nestedHello',
        level2: {
          hello: 'nestedLevel2Hello'
        }
      },
      array: [[ '1', '2'], '3'],
      withArrayParams: 'param one %% two %%',
      withNewArrayParams: 'param one ?? two ??',
      withObjectParams: 'param one {{ value1 }} two {{ value2 }}',
      withNewObjectParams: 'param one ${ value1 } two ${ value2 }',
      en: 'ok'
    };

    const ru = {
      hello: 'привет',
      nested: {
        hello: 'вложенныйПривет'
      },
      ru: 'ok'
    };

    const variants = [
      "ru-RU", "ru-ru", "RU-RU", "ru_RU", "ru_ru", "RU_RU", "ru", "RU",
      "en-US", "en-us", "EN-US", "en_US", "en_us", "EN_US", "en", "EN"
    ];

    let localization;

    describe('.constructor()', () => {
      it('should set right options', () => {
        localization = new Localization({
          defaultLocale: 'en-US',
          currentLocale: 'ru-ru'
        });

        assert.equal(localization.defaultLocale.language, 'en', 'check the default locale');
        assert.equal(localization.currentLocale.language, 'ru', 'check the current locale');
      });    
    });

    describe('.getDefaultLocale()', () => {
      it('should get right default locale', () => {
        const locale = localization.getDefaultLocale();
        assert.equal(locale.language, 'en', 'check language');
        assert.equal(locale.country, 'US', 'check country');
      });    
    });

    describe('.getCurrentLocale()', () => {
      it('should get right current locale', () => {
        const locale = localization.getCurrentLocale();
        assert.equal(locale.language, 'ru', 'check language');
        assert.equal(locale.country, 'RU', 'check country');
      });    
    });

    describe('.setDefaultLocale()', () => {
      it('should set right default locale', () => {
        localization.setDefaultLocale('ES');
        assert.equal(localization.defaultLocale.language, 'es', 'check language');
        assert.isNotOk(localization.defaultLocale.country, 'check country');
      });    
    }); 

    describe('.setCurrentLocale()', () => {
      it('should set right current locale', () => {
        localization.setCurrentLocale('en_AU');
        assert.equal(localization.currentLocale.language, 'en', 'check language');
        assert.equal(localization.currentLocale.country, 'AU', 'check country');
      });    
    });

    describe('.isLocale()', () => {
      it('should be ok with language', () => {
        localization.setCurrentLocale('en_US');
        assert.isTrue(localization.isLocale('en'));
      });  
      
      it('should be ok with country', () => {
        localization.setCurrentLocale('en_US');
        assert.isTrue(localization.isLocale('en-us'));
      }); 

      it('should fail strict mode', () => {
        localization.setCurrentLocale('en_US');
        assert.isFalse(localization.isLocale('en', true));
      });
    });

    describe('.addDict()', () => {
      it('should add the dictionary', () => {
        localization.setDefaultLocale('en_US');
        localization.addDict('en', { bye: 'bye' });
        assert.equal(localization.dicts.en.bye, 'bye');
      });
      
      it('should replace the dictionary', () => {
        localization.addDict('en', en);
        assert.equal(localization.dicts.en.hello, 'hello');
        assert.isNotOk(localization.dicts.en.bye, 'hello');
      }); 
    });

    describe('.getDict()', () => {
      it('should get the dictionary', () => {      
        assert.equal(JSON.stringify(en), JSON.stringify(localization.getDict('en')));
      });

      it('should not get the dictionary', () => {      
        assert.isNotOk(localization.getDict('es'));
      });
    });

    describe('.getDict()', () => {
      it('should has the dictionary', () => {      
        assert.isTrue(localization.hasDict('en'));
      });

      it('should not has the dictionary', () => {      
        assert.isFalse(localization.hasDict('es'));
      });
    });

    describe('.mergeDict()', () => {
      it('should merge the dictionary', () => {  
        localization.mergeDict('en', { newValue: 'ok' });   
        assert.equal(localization.getDict('en').newValue, 'ok');
      });
    });

    describe('.removeDict()', () => {
      it('should not remove the dictionary', () => {  
        localization.addDict('fr-lu', { test: 'ok' });  
        assert.isNotOk(localization.getDict('fr', true), 'check getting method');       
        assert.isOk(localization.dicts['fr-LU'], 'ckeck the dictionary'); 
      });

      it('should remove the dictionary by strict', () => { 
        localization.removeDict('fr-lu',)  
        assert.isNotOk(localization.dicts['fr-lu']);
      });
    });

    describe('.getFullDict()', () => {
      it('should get the union dictionary', () => {  
        localization.addDict('ru-ru', ru);  
        localization.setCurrentLocale({language: 'ru', country: 'ru' });
        const full = _.merge({}, localization.getDict(localization.defaultLocale), localization.getDict(localization.currentLocale));
        assert.equal(JSON.stringify(localization.getFullDict()), JSON.stringify(full));
      });
    });

    describe('.hasTranslation()', () => {
      it('should not has the translation', () => {  
        assert.isFalse(localization.hasTranslation('nonexistent'));
      });

      it('should has the translation by the default locale', () => {  
        assert.isTrue(localization.hasTranslation('en'));
      });

      it('should has the translation by the current locale', () => { 
        assert.isTrue(localization.hasTranslation('ru'));
      });
    });

    describe('.translate()', () => {
      it('should return the key', () => {  
        assert.equal(localization.translate('nonexistent'), 'nonexistent');
      });

      it('should get right value', () => {  
        assert.equal(localization.translate('en'), 'ok');
      });

      it('should get right merged value', () => {  
        assert.equal(localization.translate('hello'), 'привет');
      });

      it('should get right nested value', () => {  
        assert.equal(localization.translate('nested.hello'), 'вложенныйПривет');
      });

      it('should get right deep nested value', () => {  
        assert.equal(localization.translate('nested.level2.hello'), 'nestedLevel2Hello');
      });

      it('should get an object', () => { 
        assert.equal(localization.translate('nested').hello, 'вложенныйПривет');
      });

      it('should get an array value', () => { 
        assert.equal(localization.translate('array[0][1]'), '2');
      });

      it('should not get the right value without array params', () => { 
        assert.equal(localization.translate('withArrayParams'), 'param one  two ');
      });

      it('should get the value with array params', () => { 
        assert.equal(localization.translate('withArrayParams', [1, 2]), 'param one 1 two 2');
      });

      it('should not get the right value object array params', () => { 
        assert.equal(localization.translate('withObjectParams'), 'param one  two ');
      });

      it('should get the value with object params', () => { 
        assert.equal(localization.translate('withObjectParams', { value1: 1, value2: 2 }), 'param one 1 two 2');
      });

      it('should get the value with array params by new sign', () => {
        localization.options.arraySign = '??'
        assert.equal(localization.translate('withNewArrayParams', [1, 2]), 'param one 1 two 2');
      });

      it('should get the value with array params by new pattern', () => {
        localization.options.objectPattern = { start: '${', end: '}' };
        assert.equal(localization.translate('withNewObjectParams', { value1: 1, value2: 2 }), 'param one 1 two 2');
      });

      it('should change a value receiving logic', () => {
        localization.translateValueHandler = (value) => {
          if(typeof value == 'object') {
            return;
          }
        };

        assert.isUndefined(localization.translate('nested'));
      });

      it('should change params receiving logic', () => {
        localization.translateParamsHandler = (value) => {
          if(!value) {
            return '*';
          }
        };

        assert.isUndefined(localization.translate('withNewArrayParams'), 'param one * two *');
      });
    });

    describe('.date()', () => {
      it('should get right date', () => {
        assert.equal(localization.date(new Date('1995-12-17T03:24:00')), '17.12.1995');
      });
    });

    describe('.number()', () => {
      it('should get right number', () => {
        assert.equal(localization.number(1250000.99).replace(/\s/g, ' '), '1 250 000,99');
      });
    });

    describe('.currency()', () => {
      it('should get right currency', () => {
        assert.equal(localization.currency(1250000.99, 'USD').replace(/\s/g, ' '), '1 250 000,99 $');
      });
    });

    describe('.getLocaleVariants()', () => {
      it('should get right variants', () => {
        const defaultVariants = localization.getLocaleVariants(localization.defaultLocale);
        const currentVariants = localization.getLocaleVariants(localization.currentLocale);
        assert.equal(JSON.stringify(currentVariants.concat(defaultVariants)), JSON.stringify(variants));
      });
    });
  });
});
