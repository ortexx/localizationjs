# localizationjs
Localization module allows you to translate words via dictionaries, localize numbers, currencies, dates.

You can use this library on both the client and server sides.

## Installation 

Via npm

```npm install localizationjs```

As a script

```<script src="localization.min.js"></script>```

## Examples

```javascript
const Localization = require("localizationjs");

// create a locale manager
const locale = new Localization({ defaultLocale: "en" });

// get the default locale
locale.getDefaultLocale() // >> { language: 'en' }

// set the current locale
locale.setCurrentLocale("ru-RU");

// get the current locale
locale.getCurrentLocale() // >> { language: 'ru', country: 'RU }

// rewrite the default locale
locale.setDefaultLocale("en-US"); 

// check the locale has right format
locale.getCurrentLocale() instanceof Localization.Locale // >> true

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
    event: "click",
    status: "ok",
    checkArrayParams: "click %% times before %% pm",
    checkObjectParams: "{{ hours }}:{{ minutes }} pm"
  }
};

const dictonaryRU = {
  header: {
    title: "Привет!"
  }
};

// add the dictionary for english language
locale.addDict("en", dictonaryEN);

// add the dictionary for russian language
locale.addDict("ru", dictonaryRU);

// check the current locale has priority
locale.translate("header.title"); // >> Привет!

// current locale has not this translation, so take it from the default
locale.translate("header.description"); // >> you can do everything

// pass the params as array
locale.translate("buttons.checkArrayParams", [5, "9:27"]); // >> click 5 times before 9:27 pm

// pass the params as object
locale.translate("buttons.checkObjectParams", { hours: "9", minutes: "27" }); // >> "9:27 pm" 

// get the value from an array
locale.translate("header.skills[1]"); // >> nodejs

// check the necessary translation exists
locale.hasTranslation("header.skills[0]"); // >> true
locale.hasTranslation("header.nonExistent"); // >> false

// date in the current locale format
locale.date(new Date()); 

// currency in the current locale format
locale.currency(279.99, "USD"); 

// number in the current locale format
locale.number(27.99);

// check the dicionary exists
locale.hasDict('en'); // >> true

// remove the dicionary
locale.removeDict('en');

// check the manager has locale
locale.isLocale('es') // >> false
locale.isLocale('en') // >> true
locale.isLocale('ru') // >> true
```

### Change signs of translation parameters 

```javascript
  const Localization = require("localizationjs");

  const locale = new Localization({ 
    defaultLocale: 'en_US',
    currentLocale: { language: "ru", country: "RU" },
    arraySign: '???',
    objectPattern: { start: "${", end: "}" }
  });

  locale.addDict("en", {
    testNewArraySign: "Hello ???",
    testNewObjectPattern: "Hello ${ name }"
  });

  locale.translate('testNewArraySign', ['world']); // >> Hello world
  locale.translate('testNewArraySign', { name: 'world' }); // >> Hello world

  // get non-existent translation by default (if undefined, it returns the key)
  locale.translate('nonExistent'); // >> nonExistent

  // get non-existent params by default
  locale.translate('testNewArraySign'); // >> "Hello "
  
  // change the value getting logic
  locale.translateValueHandler = function (value) {
    return value;
  }

  locale.translateParamsHandler = function (value) {
    if(!value) {
      return "*";
    }

    return value;
  }

  // get non-existent translation with the manual handling
  locale.translate('nonExistent'); // >> Hello undefined

  // get non-existent params with the manual handling
  locale.translate('testNewArraySign'); // >> Hello *
```

### Add all dictionaries from files we have to the locale manager

```javascript
  const fs = require("fs");
  const Localization = require("localizationjs");

  const locale = new Localization({ 
    defaultLocale: 'en_us',
    currentLocale: 'ru-ru'
  });
 
  const currentVariants = locale.getLocaleVariants(locale.getCurrentLocale());
  const defaultVariants = locale.getLocaleVariants(locale.getDefaultLocale());
  const variants = currentVariants.concat(defaultVariants);

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const filePath = "/dicts/" + variant + ".json";

    if(fs.existsSync(filePath))) {
      locale.addDict(variant, require(filePath));      
    }
  }
```




