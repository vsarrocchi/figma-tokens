## Create Next.js and TypeScript project:

```
npx create-next-app --typescript
```

<!-- ## Install Material UI:

```
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

## Install Material UI date and time picker:

```
`npm install @date-io/date-fns` or `npm install date-fns @types/date-fns`
npm install @mui/x-date-pickers
``` -->

<!-- ## Install and run Storybook:

```
npx sb init
npm run storybook
``` -->

## Install Style Dictionary:

```
npm install -D style-dictionary
mkdir style-dictionary
cd style-dictionary
style-dictionary init basic (create starter code)
style-dictionary build
```

## Install Token Transformer:

```
npm install -D token-transformer
```

Add the following script commands to `package.json`.

```
"generate-tokens": "yarn run generate-tokens:transform-figma-tokens && yarn run generate-tokens:style-dictionary",
"generate-tokens:transform-figma-tokens": "yarn token-transformer ./style-dictionary/source/figma-tokens.json ./style-dictionary/build/sd-tokens.json --resolveReferences true --preserveRawValue true --expandTypography true --expandShadow true",
"generate-tokens:style-dictionary": "node ./style-dictionary/sd.build.js"
```

Remove the starter code from the `style-dictionary` folder and add the folowing files structure:

```
style-dictionary
  - build/sd-tokens.json
  - source/figma-tokens.json
  - sd.build.js
  - sd.config.json
```

In the `sd.build.js` file paste the following code:

```
const styleDictionary = require('../node_modules/style-dictionary').extend('./style-dictionary/sd.config.json');

// Do custome stuff here
// https://amzn.github.io/style-dictionary/#/api

// Add a group name to the attribute hierarchy one level above the category. This make a lot of Style dictionary's built-in functions and filters work out of the box as they assume the tokens follow the "cti" structure.
styleDictionary.registerTransform({
  name: 'attribute/gcti',
  type: 'attribute',
  transformer: function(token) {

    const attrNames = ['group', 'category', 'type', 'item', 'subitem', 'state'];
    const originalAttrs = token.attributes || {};
    const generatedAttrs =  {}

    for(let i=0; i<token.path.length && i<attrNames.length; i++) {
      generatedAttrs[attrNames[i]] = token.path[i];
    }

    return Object.assign(generatedAttrs, originalAttrs);
  }
});


// Convert unit less sizes to rem but NOT if they are defined as px. IF the value is in px we will keep them as px for better accessibility (https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/)
styleDictionary.registerTransform({
  name: 'sizeToRem',
  type: 'value',
  matcher: function(token) {
    return token.type === 'fontSize' || token.type === 'fontSizes' || token.type === 'borderRadius' || token.type === 'sizing' || token.type === 'spacing';
  },
  transformer: (token) => {
    if(!token.value.toString().includes('px')) {

      const baseFont = 16;
      const floatVal = parseFloat(token.value);

      if (isNaN(floatVal)) {
        throwSizeError(token.name, token.value, 'rem');
      }

      if (floatVal === 0) {
        return '0';
      }

      return `${floatVal / baseFont}rem`;
    }

    return token.value;
  }
});


// Convert line height in percents to decimal for better accessibility
styleDictionary.registerTransform({
  name: 'lineHeightToDecimal',
  type: 'value',
  matcher: function(token) {
    return token.type === 'lineHeight';
  },
  transformer: (token) => {
    if(token.value.toString().includes('%')) {
      const dec = parseInt(token.value.replace('%', '')) / 100;
      return dec;
    }

    return token.value;
  }
});


// Remove TextCase. from value TextCase.uppercase
styleDictionary.registerTransform({
  name: 'textCase',
  type: 'value',
  matcher: function(token) {
    return token.type === 'textCase';
  },
  transformer: (token) => {
    if(token.value.toString().includes('TextCase.')) {
      return token.value.replace('TextCase.', '');
    }

    return token.value;
  }
});


// Create custome token name
styleDictionary.registerTransform({
  name: 'name/gcti/snakeKebab',
  type: 'name',
  transformer: (token, options) => {
    const snakeCamel = [options.prefix].concat(token.path).join('_');
    const snakeKebab = snakeCamel.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    return snakeKebab;
  }
});

styleDictionary.buildAllPlatforms();
```

In the `sd.config.json` file paste the following code:

```
{
  "source": ["./style-dictionary/build/sd-tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "transforms": [
        "attribute/gcti",
        "name/gcti/snakeKebab",
        "sizeToRem",
        "lineHeightToDecimal",
        "textCase"
      ],
      "prefix": "token",
      "buildPath": "./styles/",
      "files": [
        {
          "destination": "design-tokens.css",
          "format": "css/variables",
          "options": {
            "outputReferences": true
          }
        }
      ]
    },
    "js": {
      "transformGroup": "js",
      "transforms": [
        "attribute/gcti",
        "name/cti/camel",
        "sizeToRem",
        "lineHeightToDecimal",
        "textCase"
      ],
      "prefix": "token",
      "buildPath": "./styles/",
      "files": [
        {
          "destination": "design-tokens.js",
          "format": "javascript/es6",
          "options": {
            "outputReferences": true
          }
        }
      ]
    }
  }
}

```

<!-- ## Install and run Chromatic:

- Setup a new project in chromatic and copy the `chromatic_project_token`.

- Install Chromatic.

```
npm install --save-dev chromatic
npx chromatic --project-token= chromatic_project_token
npx chromatic --project-token= chromatic_project_token --force-rebuild
``` -->

## Connect Figma tokens plugin with a GitHub repo:

- Create GitHub token

<!-- <div align="center">
  <img width="900" alt="Screenshot 2022-06-20 at 16 33 32" src="https://user-images.githubusercontent.com/43675670/174627098-40e22779-4d22-41fe-8dbd-c2934f9a6439.png">
</div> -->

<div align="center">
  <img width="1213" alt="Screenshot 2022-12-16 at 15 14 55" src="https://user-images.githubusercontent.com/43675670/208118419-9f9f481a-40c7-40de-90d9-1caf3b751ce0.png">
</div>

<hr />

- Add the new created GitHub token to Figma tokens plugin

<div align="center">
  <img width="400" alt="Screenshot 2022-06-20 at 16 51 11" src="https://user-images.githubusercontent.com/43675670/174629173-474117de-7a4d-4d26-b13a-189b6894823b.png">
</div>

<div align="center" >
  <img width="400" alt="Screenshot 2022-06-20 at 16 53 42" src="https://user-images.githubusercontent.com/43675670/174629189-04d1f0f3-06eb-4d6d-9e5e-22ff7c2b632c.png">
</div>

- Change or create a token in Figma and push to your GitHub repo

<div align="center">
  <img width="400" alt="Screenshot 2022-06-20 at 16 59 43" src="https://user-images.githubusercontent.com/43675670/174630374-d76d2553-2449-424c-8b0b-ce078265ad67.png">
</div>

<div align="center">
  <img width="400" alt="Screenshot 2022-06-20 at 17 01 57" src="https://user-images.githubusercontent.com/43675670/174630918-78a35fe9-7f55-4ec3-8858-a73924a23fde.png">
</div>

## Automate the transformation of Figma tokens with GitHub Actions

- Create a `.github/workflows` folder in the root of the project.

- Create a `transform-tokens.yml` file and add the following code:

```
//.github/workflows/transform-tokens.yml

name: Transform Figma Tokens

on:
  push:
    paths:
      - "style-dictionary/source/figma-tokens.json"

jobs:
  transform_figma_tokens:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "12"
      - name: Install Node Dependencies
        run: npm install
      - name: Build Style Dictionary
        run: yarn run generate-tokens
      - name: Commit Generated Platform Deliverables
        id: "auto-commit-action"
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: Update platform deliverables

```

<!-- ## Automate Chromatic with GitHub Actions

- Create a new repository secret

<div align="center">
  <img width="700" alt="Screenshot 2022-06-21 at 14 18 07" src="https://user-images.githubusercontent.com/43675670/174797317-8b99403b-6ccb-427a-81d3-678547bdd1b4.png">
</div>

- In the `.github/workflows` folder create a `chromatic.yml` file and add the following code:

```
//.github/workflows/chromatic.yml

name: Chromatic deploy

on:
  workflow_run:
    workflows: [Transform Figma Tokens]
    types:
      - completed

jobs:
  chromatic-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v1
      - name: Install dependencies
        run: yarn
      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
``` -->

## Deploy in Vercel

[https://vercel.com/vsarrocchi/figma-tokens](https://vercel.com/vsarrocchi/figma-tokens)
