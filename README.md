## Installation

### Suported up to angular 5

First, install [Yeoman](http://yeoman.io) and generator-ng-itobuz using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-ng-itobuz
npm install -g @angular/cli
npm install -g yarn
```

### 
Update angular cli global config: `ng set --global packageManager=yarn`

Then generate your new project:

```bash
yo ng-itobuz
```


## Features
- Pick options from list for new project generate. Available options:
    - style: scss
    - routing
    - prefix: custom prefix
- home route generate
- interceptor generate 
- [jest](https://facebook.github.io/jest/) test setup with [puppeteer](https://github.com/GoogleChrome/puppeteer)