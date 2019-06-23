<script>
  export const POSITION_TOP_LEFT = 'top-left'
  export const POSITION_TOP_RIGHT = 'top-right'
  export const POSITION_BOTTOM_LEFT = 'bottom-left'
  export const POSITION_BOTTOM_RIGHT = 'bottom-right'

  let logs = []
  let cache = {}

  export let position = POSITION_BOTTOM_LEFT

  export function clear () {
    logs = []
    cache = {}
  }

  export function log (name, value) {
    let log
    if (log = cache[name]) {
      log.value = value
      logs = logs
    } else {
      log = { name, value }
      cache[name] = log
      logs = logs.concat(log)
    }
  }
</script>

<div class="container {position}">
  <table>
    <tbody>
      {#each logs as log}
        <tr>
          <td>{log.name}:</td><td class="value">{log.value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    position: absolute;
    opacity: 0.9;
    background-color: #020;
    color: lime;
    font-family: monospace;
    font-size: 12px;
    backface-visibility: hidden;
  }
  .top-left {
    top: 0;
    left: 0;
  }
  .top-right {
    top: 0;
    right: 0;
  }
  .bottom-left {
    bottom: 0;
    left: 0;
  }
  .bottom-right {
    bottom: 0;
    right: 0;
  }
  .value {
    will-change: content;
  }
</style>
