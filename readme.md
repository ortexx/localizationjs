# Install 
`npm install localizationjs`

# About
Localization module includes two classes:

* Localization - main class

* Localization.Locale - class to create a special locale object

Any locale value might be passed as: 'en', 'en-US', 'ru_RU', {language: 'en', country: 'US' } or an instance of Localization.Locale

# Example

```js
const Localization = require("localizationjs");


const options = {
  defaultLocale: "en", // "en" is equivalent to new Localization.Locale("en")
}

const locale = new Localization(options);

locale.defaultLocale(); // returns default value 
locale.currentLocale("ru-RU"); // sets "ru-RU" locale as current
locale.currentLocale(); // returns current value 

const dictonaryEN = {
  header: {
    title: "Hello!",
    description: "you can do everything",
    skills: [
      "javascript",
      "nodejs",
      "html"
    ]
  },
  buttons: {
    click: "click",
    ok: "ok",
    clickWith: "click %% times before %% pm",
    clickOn: "{{ hours }}:{{ minutes }} pm"
  }
};

const dictonaryRU = {
  header: {
    title: "Привет!"
  }
};

// add dictionary for english(default) language
locale.dictionary("en", dictonaryEN);

// add dictionary for russian(current) language
locale.dictionary("ru", dictonaryRU);

locale.translate("header.title"); 
// => "Привет!", because current locale is more important
locale.translate("header.description"); 
// => "you can do everything", because the current locale has not a value for that key
locale.translate("buttons.clickWith", [5, "9:27"]); 
// => "click 5 times before 9:27 pm"
locale.translate("buttons.clickOn", { hours: "9", minutes: "27"}); 
// => "9:27 pm"
locale.translate("header.skills.0"); 
// => "javascript"
locale.translate("header.skills[1]"); 
// => "nodejs"

locale.hasTranslation("header.skills.0") // true
locale.hasTranslation("header.nonExistent") // false

locale.date(new Date()); // date in the current locale format using "Intl" library
locale.currency(1000.50, "USD"); // currency in the current locale format using "Intl" library
locale.number(15.88); // number in the current locale format using "Intl" library
```

# Localization API
### .constructor(options)
returns instance of Localization. Options:

* defaultLocale, default is { language: "en", country: "US"}

* paramReplaceSign, default is "%%" - sign for an array to replace the text during a translation

* paramObjectReplacePattern, default is { start: '{{', end: '}}' } - sign for an object to replace the text during a translation

* translateParamsHandler [function] - called before every param replacement.

* translateValueHandler [function] - called before value replacement.

### .dictionary(locale, body, isMerge)
if __body__ is empty, then it returns a dictionary for the passed locale, otherwise it creates a dictionary  
if __isMerge__ is true, then the body will be merged with the old dictionary

### .defaultLocale([locale])
to set the default locale or to get it.

### .currentLocale([locale])
to set the current locale or to get it.

### .translate(key, params, options) 
to get a translation of the key replacing all params

### .has(locale, isStrict = false) 
checks locale is default or current  
if __isStrict__ is true, it checks the complete coincidence of language and country, otherwise it is only language.

### .supports(locale) 
to check the passed locale has a dictionary.

### .date(date, options) 
to get date in the current locale format using "Intl" library

### .number(num, options) 
to get number in the current locale format using "Intl" library

### .currency(num, currency, options) 
to get the currency in the current locale format using "Intl" library  
__currency__ is string of ISO currency code, for example "USD"

### .hasTranslation(key) 
check the dictionary has a translation for this key 

### .brute(fn, excludeDefault)
it allows you to sort out all spellings locale   
if __excludeDefault__ is true, then it includes the default locale variants too. Example:

```js
locale.brute((val, next) => {
  console.log(val) // for "en-US" output will be "en", "en-us", "en-US", "en_US" e.t.c
      
  if(!next()) {
      // end of the shuffling 
  }
})

```
Or you can get all locale variants as array with locale.bruteVariants(excludeDefault)





