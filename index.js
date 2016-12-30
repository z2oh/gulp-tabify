'use strict';
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function (spacesPerTab, preserveAlignmentSpaces) {
    // Default to 4 spaces.
    spacesPerTab = spacesPerTab || 4;
    if (spacesPerTab <= 0) {
        spacesPerTab = 4;
    }

    if (preserveAlignmentSpaces === undefined) {
        preserveAlignmentSpaces = true;
    }

    var transform = function (file, encoding, callback) {
        if (file.isNull()) {
            // Null file, nothing to do here.
            callback(null, file);
        }
        if (file.isStream()) {
            // Streams are not supported.
            callback(new gutil.PluginError('gulp-tabify', 'Streaming is not supported'));
        }
        if (file.isBuffer()) {
            try {
                var fileStr = file.contents.toString();
                // Captures all whitespace at the start of the string.
                var whiteSpaceRegex = new RegExp('^([ \t])+', 'gm');
                if (preserveAlignmentSpaces) {
                    fileStr = fileStr.replace(whiteSpaceRegex, function (match) {
                        var numSpaces = (match.match(new RegExp(' ', 'g')) || []).length;
                        var numTabs = (match.match(new RegExp('\t', 'g')) || []).length;
                        numTabs += parseInt(numSpaces / spacesPerTab);
                        var numAlignmentSpaces = numSpaces % spacesPerTab;
                        var tabArray = Array(numTabs).fill('\t');
                        var spaceArray = Array(numAlignmentSpaces).fill(' ');
                        return tabArray.concat(spaceArray).join('');
                    });
                }
                else {
                    fileStr = fileStr.replace(whiteSpaceRegex, function (match) {
                        var numSpaces = (match.match(new RegExp(' ', 'g')) || []).length;
                        var numTabs = (match.match(new RegExp('\t', 'g')) || []).length;
                        numTabs += parseInt(numSpaces / spacesPerTab);
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