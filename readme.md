# Install 
`npm install localizationjs`

# About
Module for localization of applications, include two classes:
* Localization - main manager, include all functions

* Localization.Locale - class to create a special locale objects

Each locale value may be in the form: 'en', 'en-US', 'ru_RU', {language: 'en', country: 'US' } or instance of Localization.Locale

# Example
```js
const Localization = require("localiztionjs");

let options = {
    defaultLocale: "en", // equivalently new Localization.Locale("en")
    paramReplaceSign: "%%", // sign to insert text in the dictionary of dynamic values
}

let localeManager = new Localization(options);

localeManager.defaultLocale(); // output "en" locale, instance of Localization.Locale 
localeManager.currentLocale("ru-RU"); // set "ru-RU" locale as current
localeManager.currentLocale(); // output "ru-RU" locale, instance of Localization.Locale

// you can keep dictionaries how and where you like, but must be passed to the function as a js object
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
        clickWith: "click %% times, before %% pm"
    }
};

let dictonaryRU = {
    header: {
        title: "лучшие из лучших"
    }
};

// add dictionary to manager for english(default) language
localeManager.dictionary("en", dictonaryEN);

// add dictionary to manager for russian(current) language
localeManager.dictionary("ru", dictonaryRU);

localeManager.translate("header.title"); // output "лучшие из лучших", because of current locale more important
localeManager.translate("header.description"); // output "we can do everything", because of current locale has no such value for this key
localeManager.translate("buttons.clickWith", [5, "9:27"]); // output "click 5 times, before 9:27 pm"
localeManager.translate("header.skills.0"); // output "javascript"
localeManager.translate("header.skills[1]"); // output "nodejs"

localeManager.hasTranslation("header.skills.0") // get true

localeManager.date(new Date()); // output date in current locale format using "Intl" library
localeManager.currency(1000.50, "USD"); // output currency in current locale format using "Intl" library
localeManager.number(15.88); // output number in current locale format using "Intl" library

```

# Localization API
### .constructor(options)
return instance of Localization. Options:
* defaultLocale, default is { language: "en", country: "US"}

* paramReplaceSign, default is "%%" - sign to insert text in the dictionary of dynamic values

* translateParamsHandler - function-handler for translate function params. It allows you to change the final value of a parameter if it is required by any rules

* translateValueHandler - function-handler for translate function value. It allows you to change the final value if it is required by any rules

### .dictionary(locale, body, isMerge)
if body is empty then return dictionary for specified locale, else create dictionary  
if isMerge is true then body merged with old dictionary, if it exists else replace it

### .defaultLocale(locale)
if locale is empty then return default locale else set it

### .currentLocale(locale)
if locale is empty then return current locale else set it

### .translate(key, params, options) 
replace key to value using dictionaries 

### .has(locale, isStrict) 
checks locale is default or current  
if isStrict is true then it checks the complete coincidence of language and country else only language.   Default is false

### .supports(locale) 
verifies the existence of the dictionary for the locale

### .date(date, options) 
get date in current locale format using "Intl" library

### .number(num, options) 
get number in current locale format using "Intl" library

### .currency(num, currency, options) 
get currency in current locale format using "Intl" library  
currency is string of ISO currency code, for example "USD"

### .hasTranslation(key) 
get true if dictionary has key translation  

### .brute(fn, excludeDefault)
it allows you to sort out all spellings locale   
if excludeDefault is true then it includes default locale variants too. Example:

```js
localeManage.brute((val, next) => {
    console.log(val) // for "en-US" output is "en", "en-us", "en-US", "en_US" e.t.c
        
    if(!next()) {
        // end of shuffling 
    }
})

```
Or you can get all locale variants as array with localeManage.bruteVariants(excludeDefault)





