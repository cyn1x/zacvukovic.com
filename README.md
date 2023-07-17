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

The `apiUrl` in the `router.js` file uses the `/search` API for JotunPy in development mode, and just the URI in production mode. Cloudflare seems to handle this gracefully without the need for the developer to create a search API, where other platforms like Azure do not handle non-existent URIs gracefully.
```javascript
const apiUrl = (typeof process !== 'undefined') ? uri : `/search${uri}`
```

### Development

Development mode can be activated by using the JotunPy live development server.

```commandline
> path\to\jotunpy\venv\Scripts\activate
> python path\to\jotunpy\ main.py dev
```

### Production

Production mode can be instantiated by using JotunPy to package a site build.

```commandline
> path\to\jotunpy\venv\Scripts\activate
> python path\to\jotunpy\ main.py build
```
