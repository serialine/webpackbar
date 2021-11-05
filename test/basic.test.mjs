import assert from 'assert'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
import Webpack from 'webpack'
import WebpackBar from '../index.cjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('webpackbar', () => {
  it('compile', async () => {
    let _doneCtr = 0
    const done = () => { _doneCtr++ }

    const webpackbar = new WebpackBar({
      reporter: { done }
    })

    const compiler = Webpack({
      mode: 'production',
      context: __dirname,
      devtool: 'source-map',
      entry: './fixture/index.js',
      output: {
        filename: 'output.js',
        path: resolve(__dirname, 'dist')
      },
      plugins: [
        webpackbar
      ]
    })

    const run = promisify(compiler.run)
    const stats = await run.call(compiler)

    assert.equal(stats.hasErrors(), false)
    assert.equal(stats.hasWarnings(), false)
    assert.equal(_doneCtr, 1)
  })
})
