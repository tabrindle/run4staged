#!/usr/bin/env node

var execSync = require('child_process').execSync;
var minimatch = require('minimatch');
var sgf = require('staged-git-files');
var args = require('minimist')(process.argv.slice(2));

var command = args._[0] || args.command;
var glob = args.glob || '**/*';

var run = function run(cmd) {
  var result;
  try {
    result = (execSync(cmd).toString() || '').trim();
    if (args.verbose) console.log(`Success: ${cmd}`);
  } catch (error) {
    result = error.stdout;
    if (args.verbose) console.log('Error:', error.stdout);
  }
  if (!args.quiet) console.log(result);
  return result;
};

if (command) {
  sgf('ACM', (err, results) => {
    if (err) {
      if (args.verbose) console.log(err);
      return;
    }
    if (results.length === 0) if (args.verbose) console.log('No staged files.');
    var files = results
      .slice()
      .sort()
      .map(file => {
        if (args.verbose) console.log('Staged:', file.filename);
        return file.filename;
      })
      .filter(minimatch.filter(glob));

    if (args.serial) {
      if (files.length > 0) files.map(file => `${command} ${file}`).map(run);
    } else {
      if (files.length > 0) run(`${command} ${files.join(' ')}`);
    }
  });
} else {
  if (args.verbose) console.log('No command.');
}
