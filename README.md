# [gulp](http://gulpjs.com)-tabify

[![Build Status](https://travis-ci.org/z2oh/gulp-tabify.svg?branch=master)](https://travis-ci.org/z2oh/gulp-tabify)
[![David](https://david-dm.org/z2oh/gulp-tabify.svg)](https://david-dm.org/z2oh/gulp-tabify.svg)


## Features

* Changes spaces to be tabs
* Number of spaces to change is configurable

## Install

```sh
$ npm install --save-dev gulp-tabify
```

## Usage

```js
var gulp = require('gulp');
var tabify = require('gulp-tabify');

gulp.task('default', function () {
  return gulp.src('./app/**.*.js')
    .pipe(tabify(4, true))
    .pipe(gulp.dest('./app'));
});
```

## API

```
tabfiy(numSpaces, preserveAlignmentSpaces)
```

`numSpaces` is the number of spaces to convert to a tab at the beginning of each line. The default is 4.

`preserveAlignmentSpaces` is a boolean. When set to true, alignment spaces are preserved; false ignores them. Default is true. Example when set to true:

Before

![Before](http://i.imgur.com/9auXOlJ.png)

After

![After](http://i.imgur.com/xL2bQmg.png)

-------


[![licence](https://img.shields.io/npm/l/gulp-strip-comments.svg)](https://opensource.org/licenses/MIT)