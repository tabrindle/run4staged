#!/usr/bin/env node

var execSync = require('child_process').execSync;
var minimatch = require('minimatch');
var sgf = require('staged-git-files');
var args = require('minimist')(process.argv.slice(2));

var command = args._[0] || args.command;
var glob = args.glob || '**/*';

var run = function run(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    if (args.verbose) console.log(`Error: ${cmd} failed with status ${error.status}`);
  }
  if (args.verbose) console.log(`Success: ${cmd}`);
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
