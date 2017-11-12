<h1 align="center">Renderium Logger</h1>
<p align="center">
  <a href="https://github.com/feross/standard" target="_blank">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat" alt="js-standard-style"/>
  </a>
</p>

## Table of Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Development](#development)

## Features

- Designed with performance in mind
- Simple
- Lightweight

## Install

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

## API

## Development

Command | Description
--------| -----------
`npm run check` | Check standard code style by [snazzy](https://www.npmjs.com/package/snazzy)
`npm run build` | Wrap source code in [UMD](https://github.com/umdjs/umd) by [rollup](https://github.com/rollup/rollup)
`npm run min` | Minify code by [UglifyJS](https://github.com/mishoo/UglifyJS2)