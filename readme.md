# Install 
`npm install localizationjs`

# About
Module for localization, includes two classes:

* Localization - main manager, includes all functions

* Localization.Locale - class to create a special locale objects

Any locale value might be passed as: 'en', 'en-US', 'ru_RU', {language: 'en', country: 'US' } or instance of Localization.Locale

# Example
```js
const Localization = require("localiztionjs");

let options = {
    defaultLocale: "en", // "en" is equivalent to new Localization.Locale("en")
}

let locale = new Localization(options);

localeManager.defaultLocale(); returns default value is instance of Localization.Locale 
localeManager.currentLocale("ru-RU"); // sets "ru-RU" locale as current
localeManager.currentLocale(); // returns current value is instance of Localization.Locale

let dictonaryEN = {
    header: {
        title: "the best of the best =)",
        description: "we can do everything",
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

let dictonaryRU = {
    header: {
        title: "лучшие из лучших"
    }
};

// add dictionary for english(default) language
locale.dictionary("en", dictonaryEN);

// add dictionary for russian(current) language
locale.dictionary("ru", dictonaryRU);

locale.translate("header.title"); // output is "лучшие из лучших", because current locale is more important
locale.translate("header.description"); // output is "we can do everything", because current locale has not a value for this key
locale.translate("buttons.clickWith", [5, "9:27"]); // output is "click 5 times before 9:27 pm"
locale.translate("buttons.clickOn", { hours: "9", minutes: "27"}); // output is "9:27 pm"
locale.translate("header.skills.0"); // output is "javascript"
locale.translate("header.skills[1]"); // output is "nodejs"

locale.hasTranslation("header.skills.0") // get true
locale.hasTranslation("header.nonExistent") // get false

locale.date(new Date()); // output date in current locale format using "Intl" library
locale.currency(1000.50, "USD"); // output currency in current locale format using "Intl" library
locale.number(15.88); // output number in current locale format using "Intl" library

```

# Localization API
### .constructor(options)
returns instance of Localization. Options:

* defaultLocale, default is { language: "en", country: "US"}

* paramReplaceSign, default is "%%" - sign for array to replace text during a translation

* paramObjectReplacePattern, default is { start: '{{', end: '}}' } - sign for object to replace text during a translation

* translateParamsHandler [function] - will be called before every param replacement.

* translateValueHandler [function] -  will be called before value replacement.

### .dictionary(locale, body, isMerge)
if a body is empty then it returns a dictionary for a given locale else it creates a dictionary  
if isMerge is true then a body will be merged with old dictionary

### .defaultLocale(locale)
you can set default locale if  you will pass it or get if not

### .currentLocale(locale)
you can set current locale if  you will pass it or get if not

### .translate(key, params, options) 
gets translation of the key replacing all params

### .has(locale, isStrict = false) 
checks locale is default or current  
if isStrict is true then it checks the complete coincidence of language and country else only language.

### .supports(locale) 
checks locale has dictionary

### .date(date, options) 
gets date in the current locale format using "Intl" library

### .number(num, options) 
gets number in the current locale format using "Intl" library

### .currency(num, currency, options) 
gets currency in the current locale format using "Intl" library  
currency is string of ISO currency code, for example "USD"

### .hasTranslation(key) 
gets true if dictionary has key translation  

### .brute(fn, excludeDefault)
it allows you to sort out all spellings locale   
if excludeDefault is true then it includes default locale variants too. Example:

```js
localeManage.brute((val, next) => {
    console.log(val) // for "en-US" output will be "en", "en-us", "en-US", "en_US" e.t.c
        
    if(!next()) {
        // end of shuffling 
    }
})

```
Or you can get all locale variants as array with locale.bruteVariants(excludeDefault)





