import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import buble from 'rollup-plugin-buble'

export default {
  input: 'src/index.svelte',
  output: [
    { file: pkg.umd, format: 'umd', name: 'Logger' },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
    resolve(),
    commonjs(),
  	svelte({
      accessors: true
    }),
    buble()
  ]
}
