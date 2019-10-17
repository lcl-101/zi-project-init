var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    plugins = require('gulp-load-plugins')(),
    hash = require('gulp-hash'),
    useref = require('gulp-useref');  //它可以把html里零碎的这些引入合并成一个文件，但是它不负责代码压缩。

//拷贝 favicon.ico
gulp.task('move:favicon.ico',function(){
    var stream = gulp.src('./src/common/images/*')
        .pipe(gulp.dest('./dist/common/images'));
    return stream;
})

//拷贝css
gulp.task('move:css',function(){
    var stream = gulp.src('./src/common/css/other/*')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/common/css'))
})

//拷贝admin
gulp.task('move:admin',function(){
    var stream = gulp.src('./admin/dist/*.*')
        .pipe(gulp.dest('./dist/admin/'));
    var statics = gulp.src('./admin/dist/static/**')
        .pipe(gulp.dest('./dist/static/'));
})

//默认生成环境任务
gulp.task('default', function(callback) {
    // 将你的默认的任务代码放在这
    plugins.sequence(
      'move:favicon.ico',
      'move:css',
      'move:admin'
    )(callback);
});
