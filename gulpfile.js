/*
  前面的步骤都是定义一些路径的变量

*/

//dist是生成版本的目标文件夹,就是最终要部署到线上的文件夹
var dist = "./dist/";
//src目录是我们的源代码
var src = "./src/";
var static = "Public/";
var paths = {
    tpl:"Portal/**/*.html",
    css:"css/**/*.css",
    images:"images/**.*",
    js:"js/**/*.js",
    lib:{
        boostrap:"simpleboot/**/*.*"
    }
};

/*
  引入要使用的插件
*/
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var uglify = require('gulp-uglify');
var del = require('del');
var s = src + static,
    d = dist + static;
//不用编译的文件复制到生成环境中
gulp.task("copy",function (cb) {
    gulp.src(src+"*.html")
        .pipe(gulp.dest(dist));
    gulp.src(s+paths.images)
        .pipe(gulp.dest(d+"images"));
    gulp.src(s+paths.lib.boostrap)
        .pipe(gulp.dest(d+"simpleboot/"));
});

//压缩css
gulp.task("compressCss",function(){
    return gulp.src(s+paths.css)
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest(d+"css"));
});
//压缩js
gulp.task('compressJs',function () {
    return gulp.src(s+paths.js)
            .pipe(uglify())
            .pipe(gulp.dest(d+"js"));

});
//我们最后要运行的命令就是`gulp default`;
gulp.task('default', ['copy','compressJs','compressHtml']);