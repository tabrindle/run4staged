#!/usr/bin/env node

var exec = require('child_process').exec;
var minimatch = require('minimatch');
var sgf = require('staged-git-files');
var args = require('minimist')(process.argv.slice(2));

var command = args._[0] || args.command;
var glob = args.glob || '*';

var run = cmd =>
  exec(cmd, (error, stdout) => {
    if (args.verbose) {
      if (error) console.log('Error:', error);
      else console.log(`Success: ${cmd}`);
    }
    if (!args.quiet) {
      console.log(stdout);
    }
  });

if (command) {
  sgf('ACM', (err, results) => {
    if (err) {
      if (args.verbose) console.error('No staged files.');
      return;
    }
    var files = results
      .map(file => {
        if (args.verbose) console.log('Staged:', file.filename);
        return file.filename;
      })
      .filter(minimatch.filter(glob));

    if (args.serial) {
      if (files.length > 0) files.map(file => `${command} ${file}`).map(job => run(job));
    } else {
      if (files.length > 0) run(`${command} ${files.join(' ')}`);
    }
  });
} else {
  if (args.verbose) console.error('No command.');
}
