const styleDictionary = require("../node_modules/style-dictionary").extend(
  "./style-dictionary/sd.config.json"
);

// Do custome stuff here
// https://amzn.github.io/style-dictionary/#/api

// Add a group name to the attribute hierarchy one level above the category. This make a lot of Style dictionary's built-in functions and filters work out of the box as they assume the tokens follow the "cti" structure.
styleDictionary.registerTransform({
  name: "attribute/gcti",
  type: "attribute",
  transformer: function (token) {
    const attrNames = ["group", "category", "type", "item", "subitem", "state"];
    const originalAttrs = token.attributes || {};
    const generatedAttrs = {};

    for (let i = 0; i < token.path.length && i < attrNames.length; i++) {
      generatedAttrs[attrNames[i]] = token.path[i];
    }

    return Object.assign(generatedAttrs, originalAttrs);
  },
});

// Convert unit less sizes to rem but NOT if they are defined as px. IF the value is in px we will keep them as px for better accessibility (https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/)
styleDictionary.registerTransform({
  name: "sizeToRem",
  type: "value",
  matcher: function (token) {
    return (
      token.type === "fontSize" ||
      token.type === "fontSizes" ||
      token.type === "borderRadius" ||
      token.type === "sizing" ||
      token.type === "spacing"
    );
  },
  transformer: (token) => {
    if (!token.value.toString().includes("px")) {
      const baseFont = 16;
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.name, token.value, "rem");
      }

      if (floatVal === 0) {
        return "0";
      }

      return `${floatVal / baseFont}rem`;
    }

    return token.value;
  },
});

// Convert line height in percents to decimal for better accessibility
styleDictionary.registerTransform({
  name: "lineHeightToDecimal",
  type: "value",
  matcher: function (token) {
    return token.type === "lineHeight";
  },
  transformer: (token) => {
    if (token.value.toString().includes("%")) {
      const dec = parseInt(token.value.replace("%", "")) / 100;
      return dec;
    }

    return token.value;
  },
});

// Remove TextCase. from value TextCase.uppercase
styleDictionary.registerTransform({
  name: "textCase",
  type: "value",
  matcher: function (token) {
    return token.type === "textCase";
  },
  transformer: (token) => {
    if (token.value.toString().includes("TextCase.")) {
      return token.value.replace("TextCase.", "");
    }

    return token.value;
  },
});

// Create custome token name
styleDictionary.registerTransform({
  name: "name/gcti/snakeKebab",
  type: "name",
  transformer: (token, options) => {
    const snakeCamel = [options.prefix].concat(token.path).join("_");
    const snakeKebab = snakeCamel
      .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
      .toLowerCase();
    return snakeKebab;
  },
});

styleDictionary.buildAllPlatforms();
