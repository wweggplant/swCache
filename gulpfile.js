/*
  前面的步骤都是定义一些路径的变量

*/

//dist是生成版本的目标文件夹,就是最终要部署到线上的文件夹
var dist = "./dist/";
//src目录是我们的源代码
var src = "./src/";
/*
  引入要使用的插件
*/
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var uglify = require('gulp-uglify');
var del = require('del');
//压缩js
gulp.task('compressJs',function () {
    gulp.src(src+"localStorage.js")
            .pipe(gulp.dest(dist));
    gulp.src(src+"localStorage.js")
            .pipe(uglify())
            .pipe(gulp.dest(dist));
});
//我们最后要运行的命令就是`gulp default`;
gulp.task('default', ['compressJs']);