// 用来解析命令行参数的库
const { build } = require("esbuild");
const minimist = require("minimist");
const {resolve} = require('path')
// 参数
const args = minimist(process.argv.slice(2));

const target = args._[0]

const format = args.f || 'global'

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outputFile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile: outputFile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error) {
        console.log(`${target} rebuilded`);
      }
    }
  }

}).then(() => {
  console.log(`${target} builded`);
})