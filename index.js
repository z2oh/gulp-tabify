'use strict';
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function(numSpaces, preserveAlignmentSpaces) {
    // Default to 4 spaces.
    numSpaces = numSpaces || 4;
    if(numSpaces <= 0) {
        numSpaces = 4;
    }

    if(preserveAlignmentSpaces === undefined) {
        preserveAlignmentSpaces = true;
    }

    var transform = function(file, encoding, callback) {
        if(file.isNull()) {
            // Null file, nothing to do here.
            callback(null, file);
        }
        if(file.isStream()) {
            // Streams are not supported.
            callback(new gutil.PluginError('gulp-tabify', 'Streaming is not supported'));
        }
        if(file.isBuffer()) {
            try {
                var fileStr = file.contents.toString();
                // Captures one or more spaces at the start of the string.
                var spaceRegex = new RegExp('^( )+', 'gm');
                if(preserveAlignmentSpaces) {
                    fileStr = fileStr.replace(spaceRegex, function(match) {
                        var numTabs = parseInt(match.length / numSpaces);
                        var numAlignmentSpaces = match.length - (numTabs * numSpaces);
                        var tabArray = Array(numTabs).fill('\t');
                        var spaceArray = Array(numAlignmentSpaces).fill(' ');
                        return tabArray.concat(spaceArray).join('');
                    });
                }
                else {
                    fileStr = fileStr.replace(spaceRegex, function(match) {
                        var numTabs = parseInt(match.length / numSpaces);
                        // Easy way to create a string of 'numTabs' tab characters.
                        return Array(numTabs).fill('\t').join('');
                    });
                }
                file.contents = new Buffer(fileStr);
                this.push(file);
            }
            catch (err) {
                this.emit('error', new gutil.PluginError('gulp-tabify', err, { fileName: file.path }));
            }
        }

        callback();
    };

    return through.obj(transform);
};