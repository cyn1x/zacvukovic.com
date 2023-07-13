# zacvukovic.com

This is my personal website and blog. I created this using my own custom static site generator [JotunPy](https://github.com/cyn1x/jotunpy). The purpose of this README is to document its usage so I am able to update it in future without hassle.

## Installation

This site contains some development dependencies which need to be installed.

### Windows

Install the required dependencies from `package.json` for development.

```commandline
npm install
```

## Usage

The usage mode can be either set to development or production.

### Development

Development mode can be activated by using the JotunPy live development server.

```commandline
> path\to\jotunpy\venv\Scripts\activate
> python path\to\jotunpy\ main.py dev
```

### Production

Production mode can be instantiated by using JotunPy to package a site build, and using [SWA CLI](https://github.com/Azure/static-web-apps-cli) to emulate the site's functionality on Azure Static Web Apps.

```commandline
> path\to\jotunpy\venv\Scripts\activate
> python path\to\jotunpy\ main.py build
> npx swa start
```
