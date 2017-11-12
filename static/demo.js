var logger = new Logger({
  target: document.body
})

var start = Date.now()
requestAnimationFrame(function loop (t) {
  var dt = t - start
  var memory = performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0
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
