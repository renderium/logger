<h1 align="center">Renderium Logger</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/@renderium/logger" target="_blank">
    <img src="https://img.shields.io/npm/v/@renderium/logger.svg" alt="NPM version" target="_blank"></img>
  </a>
  <a href="https://github.com/feross/standard" target="_blank">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat" alt="js-standard-style"/>
  </a>
</p>

## Table of Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Development](#development)

## Features

- Designed with performance in mind
- Simple - [88 LOC](https://github.com/renderium/logger/blob/master/src/logger.html#L88)
- Lightweight - [4 Kb](https://github.com/renderium/logger/blob/master/dist/logger.min.js)

## Install

```
npm install --save @renderium/logger
```

or download [dev](https://unpkg.com/@renderium/logger/dist/logger.umd.js) or [prod](https://unpkg.com/@renderium/logger/dist/logger.min.js) version

## Usage

```js
var logger = new Logger({
  target: document.body
})

var start = Date.now()
requestAnimationFrame(function loop (t) {
  var dt = t - start
  var memory = performance.memory.usedJSHeapSize / 1048576
  start = t

  logger.log('dt', dt.toFixed(2))
  logger.log('fps', Math.round(1000 / dt))
  logger.log('memory', memory.toFixed(2))

  requestAnimationFrame(loop)
})

navigator.getBattery().then(battery => {
  logger.log('battery', `${battery.level * 100}%`)

  battery.addEventListener('levelchange', () => {
    logger.log('battery', `${battery.level * 100}%`)
  })
})
```

## Development

Command | Description
--------| -----------
`npm run build` | Wrap source code in [UMD](https://github.com/umdjs/umd) by [rollup](https://github.com/rollup/rollup)
`npm run min` | Minify code by [UglifyJS](https://github.com/mishoo/UglifyJS2)
