const gulp = require('gulp');
const rollup = require('rollup');
const del = require('del')
const rollupTypescript = require('rollup-plugin-typescript');
const pkg = require('./package.json');
var fs = require( 'fs' )

const devEnv = ['development','production'];
const distName = `${pkg.name}.${pkg.version}`
const cleanDistDir = mode => () => {
  return devEnv.includes(mode) ? del(['./dist']): undefined
}
const cleanUnitDir = () => {
  return del(['./tests/unit/front-end/build/*'])
}
const rollupBuild = (entry,outDir,moduleName)  => {
  return  rollup.rollup({
    input: entry,
    plugins: [
      rollupTypescript()
    ]
  }).then( bundle => {
    return bundle.write({
      file: outDir,
      format:'iife',
      name: moduleName,
      sourcemap: true
    })
  }).then(file =>{
    fs.copyFile(`./dist/${distName}.js`,`tests/unit/front-end/build/${distName}.js`,function(err){
      if(err) console.log('something wrong was happened')
      else console.log('copy file succeed');
    })
  })
}

const buildTs = done => {
  //这里配置多页面js配置打包就可以了，传入值改为数组拼接url可以实现多入口插件js打包
  rollupBuild('./src/index.ts', `./dist/cache.${pkg.version}.js`, 'Cache')
  rollupBuild('./src/serviceWorker/sw.ts', `./dist/${distName}.js`, `${pkg.name}`)
  done()
}

function unitTest()  {

}

gulp.task('default',gulp.series(cleanDistDir('development'), cleanUnitDir, buildTs))
