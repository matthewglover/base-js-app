'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const template = require('gulp-template');
const inquirer = require('inquirer');
const R = require('ramda');
const Rx = require('rx');

gulp.task('default', () => {
  console.log('testing...');
});

gulp.task('file', (done) => {
  return inquirer.prompt(promptFileName)
          .process
          .subscribe(writeFiles(done));
});


const promptFileName = Rx.Observable.create((observable) => {

  observable.onNext({
      type: 'input'
    , name: 'file'
    , message: `What do you want to call your file (include path to src root):`
    , validate: input => R.is(String, input) && input.length > 3
    , filter: R.compose(
          input => ({
              path: R.compose(R.join('/'), R.take(R.length(input) - 1))(input)
            , name: R.compose(R.head, R.match(/[\w-_]+/), R.last)(input)
            , ext: R.compose(R.head, R.match(/\.[\w\.\d]+/), R.last)(input)
          })
        , R.split('/')
      )
  });

  observable.onCompleted();
});


// writeFiles -> Function -> Object -> Promise
const writeFiles = R.curry((done, res) =>
  Promise.all([writeSourceFile(res.answer), writeTestFile(res.answer)])
    .then(done)
);

// writeSourceFile :: Object -> Promise
const writeSourceFile = (file) =>
  new Promise((resolve, reject) => {
    gulp.src('./templates/simple.js', {base: process.cwd()})
      .pipe(rename(`${file.path}/${file.name}${file.ext}`))
      .pipe(template({fileName: file.name}))
      .pipe(gulp.dest('./src'))
      .on('error', reject)
      .on('end', resolve);
  });

// writeTestFile :: Object -> Promise
const writeTestFile = (file) =>
  new Promise((resolve, reject) => {
    gulp.src('./templates/simple-test.js', {base: process.cwd()})
      .pipe(rename(`${file.path}/${file.name}${file.ext}`))
      .pipe(template({
          fileName: file.name
        , filePath: buildFilePath(file.path)
        , rootPath: buildRoot(file.path)
      }))
      .pipe(gulp.dest('./test'));
  });

// buildRoot :: String -> String
const buildRoot = (path) =>
  R.length(path) > 0 ?
    R.replace(/\w+/g, '..', path) + '/' :
    '';

// buildFilePath :: String -> String
const buildFilePath = (path) =>
  R.length(path) > 0 ?
    path + '/' :
    '';
