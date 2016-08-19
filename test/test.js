'use strict';

var tabify = require('../');
var util = require('gulp-util');
var assert = require('assert');
var es = require('event-stream');

function getBuffer(content) {
    return new util.File({
        contents: new Buffer(content),
    });
}

function getStream(contents) {
    return new util.File({
        contents: es.readArray(contents),
    });
}

describe('gulp-tabify', function() {
    describe('stream mode', function() {
        it('should emit an error on a stream', function(done) {
            var fakeFile = getStream(['this', 'is', 'a', 'stream']);
            try {
                var tabifyStreamTest = tabify(4);
                tabifyStreamTest.write(fakeFile);
            } catch (error) {
               assert.equal(error.message, 'Streaming is not supported');
                done();
            }
        });
    });

    describe('defaults', function() {
        it('should replace 4 spaces by default', function(done) {
            var fakeFile = getBuffer('    console.log();');
            var stream = tabify();
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('should preserve alignment spaces by default', function(done) {
            var fakeFile = getBuffer('     console.log();');
            var stream = tabify(4);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\t console.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });
    });

    describe('preserveAlignmentSpaces parameters', function() {
        it('preserveAlignmentSpaces = true: should preserve alignment spaces', function(done) {
            var fakeFile = getBuffer('     console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\t console.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });
        it('preserveAlignmentSpaces = false: should not preserve alignment spaces', function(done) {
            var fakeFile = getBuffer('     console.log();');
            var stream = tabify(4, false);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });
    });

    describe('numSpaces parameters', function() {
        it('numSpaces = 4: should replace 4 spaces at beginning with a tab', function(done) {
            var fakeFile = getBuffer('    console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 4: should replace 8 spaces at beginning with two tabs', function(done) {
            var fakeFile = getBuffer('        console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\t\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 4: should replace 4 spaces at the beginning and with a tab and leave a space left over', function(done) {
            var fakeFile = getBuffer('     console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\t console.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 5: should replace 5 spaces at the beginning and with a tab', function(done) {
            var fakeFile = getBuffer('     console.log();');
            var stream = tabify(5, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 0: should replace 4 spaces at the beginning and with a tab', function(done) {
            var fakeFile = getBuffer('    console.log();');
            var stream = tabify(0, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = -1: should replace 4 spaces at the beginning and with a tab', function(done) {
            var fakeFile = getBuffer('    console.log();');
            var stream = tabify(0, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });
    });

    describe('numSpaces parameters, multiline', function() {
        it('numSpaces = 4: should replace 4 spaces at beginning of each line with a tab', function(done) {
            var fakeFile = getBuffer('    console.log();\n    console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();\n\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 4: should replace 8 spaces at beginning of each line with two tabs', function(done) {
            var fakeFile = getBuffer('        console.log();\n        console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\t\tconsole.log();\n\t\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 5: should replace 5 spaces at the beginning and with a tab', function(done) {
            var fakeFile = getBuffer('     console.log();\n     console.log();');
            var stream = tabify(5, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();\n\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 4: should replace 4 spaces at the beginning of first line with a tab and 8 spaces at beginning of second line with a tab', function(done) {
            var fakeFile = getBuffer('    console.log();\n        console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();\n\t\tconsole.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });

        it('numSpaces = 4: should replace 4 spaces at the beginning of first line with a tab and 8 spaces at beginning of second line with a tab and leave a space left over on the second line', function(done) {
            var fakeFile = getBuffer('    console.log();\n         console.log();');
            var stream = tabify(4, true);
            stream.once('data', function(file) {
                var data = file.contents.toString();
                assert.equal(data, '\tconsole.log();\n\t\t console.log();');
            });
            stream.once('end', done);
            stream.write(fakeFile);
            stream.end();
        });
    });

    // it('should remove spaces from the files and replace them with tabs', function(done) {
    //     gulp.src('__dirname/test_files/**/*.js')
    //     .pipe(tabify(4))
    //     .pipe()
    //     done();
    // });
});