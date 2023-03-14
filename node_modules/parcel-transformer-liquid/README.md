# parcel-transformer-liquid

![Build](https://github.com/meecrobe/parcel-transformer-liquid/actions/workflows/main.yml/badge.svg)
![Downloads](https://img.shields.io/npm/dw/parcel-transformer-liquid?color=%2334D058&label=Downloads)

[Parcel 2](https://parceljs.org/) transformer plugin for [LiquidJS](https://liquidjs.com/).

## Installation

```bash
$ yarn add -D parcel-transformer-liquid
```

## Usage

Add the transformer to Parcel config file:

`.parcelrc`
```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.liquid": [
      "parcel-transformer-liquid"
    ]
  }
}
```

To pass [options](https://liquidjs.com/tutorials/options.html) to the LiquidJS engine, create a configuration file named `.liquidrc`, `.liquidrc.js`, `.liquidrc.cjs`, `liquid.config.js`, or `liquid.config.cjs`:

`.liquidrc`
```json
{
  "root": ["src/partials/"],
  "extname": ".liquid",
  "globals": {
    "page_title": "Liquid transformer example",
    "today": "Wednesday"
  }
}
```

## License

MIT
