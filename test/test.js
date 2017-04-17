"use strict";

const assert = require('chai').assert;
const Localization = require('../localization');
const _ = require('lodash');

describe('Localization:', function () {
  let en = {
    hello: 'hello',
    test: 'test',
    nested: {
      hello: 'nestedHello',
      level2: {
        hello: 'nestedLevel2Hello'
      }
    },
    array: [[ '1', '2'], '3'],
    withParamArray: 'param one %% two %%',
    withParamObject: 'param one {{ value1 }} two {{ value2 }}'
  };

  let ru = {
    hello: 'привет',
    test: 'тест',
    nested: {
      hello: 'вложенныйПривет'
    }
  };

  let localization;

  let variants = [
    'ru-RU', 'ru-ru', 'RU-RU', 'ru_RU', 'ru_ru', 'RU_RU', 'ru', 'RU',
    'en-US', 'en-us', 'EN-US', 'en_US', 'en_us', 'EN_US', 'en', 'EN'
  ];

  describe('Localization', function() {
    it('#constructor()', function() {
      localization = new Localization();
    });

    it('#dictionary()', function() {
      let dict = localization.dictionary('en', en);

      assert.equal(JSON.stringify(dict), JSON.stringify(en), 'adding dict');
      localization.dictionary('ru', ru);
      assert.equal(JSON.stringify(localization.dictionary('ru')), JSON.stringify(ru), 'adding new dict');
      localization.dictionary('en', { newValue: 'new'}, true);
      assert.equal(localization.dictionary('en').newValue, 'new', 'merging dict');
      delete en.newValue;
      localization.dictionary('en', en);
      assert.isUndefined(localization.dictionary('en').newValue, 'replacing old dict');
    });

    it('#hasTranslation()', function() {
      assert.isOk(localization.hasTranslation('nested.hello'));
      assert.isNotOk(localization.hasTranslation('undefined'));
    });

    it('#translate()', function() {
      assert.equal(localization.translate('hello'), 'hello', 'check simple');
      assert.equal(localization.translate('nested.level2.hello'), 'nestedLevel2Hello', 'check nested dot syntax');
      assert.equal(localization.translate('nested[level2][hello]'), 'nestedLevel2Hello', 'check nested brace syntax');
      assert.equal(localization.translate('array[0].1'), '2', 'check array');
      assert.equal(localization.translate('withParamArray', [1, 2]), 'param one 1 two 2', 'check with array params');
      assert.equal(localization.translate('withParamObject', { value1: 1, value2: 2 }), 'param one 1 two 2', 'check with object params');
      localization.currentLocale('ru-RU');
      assert.equal(localization.translate('hello'), 'привет', 'check changed language translation');
    });

    it('#bruteVariants()', function() {
      assert.equal(JSON.stringify(localization.bruteVariants()), JSON.stringify(variants), 'check all');
      assert.equal(JSON.stringify(localization.bruteVariants(true)), JSON.stringify(variants.slice(0, 8)), 'check only current');
    });

    it('#brute()', function() {
      let bruteVariants = [];

      localization.brute((lang, next) => {
        bruteVariants.push(lang);

        if(!next()) {
          assert.equal(JSON.stringify(bruteVariants), JSON.stringify(variants));
        }
      })
    });

    it('#supports()', function() {
      assert.isOk(localization.supports('en'), 'should support');
      assert.isNotOk(localization.supports('de'), 'should not support');
    });

    it('#has()', function() {
      assert.isOk(localization.has('en-US'), 'should have');
      assert.isNotOk(localization.has('de'), 'should not have');
      assert.isNotOk(localization.has('en-UK', true), 'should not have too');
    });
  });
});

