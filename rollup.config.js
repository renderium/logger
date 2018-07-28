import pkg from './package.json'
import svelte from 'rollup-plugin-svelte'
import buble from 'rollup-plugin-buble'

export default {
  input: 'src/logger.html',
  output: [
    { file: pkg.umd, format: 'umd', name: 'Logger' },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
  	svelte(),
    buble()
  ]
}
