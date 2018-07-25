#!/usr/bin/env node

const execSync = require('child_process').execSync;
const minimatch = require('minimatch');
const sgf = require('staged-git-files');
const args = require('minimist')(process.argv.slice(2));

const command = args._[0] || args.command;
const glob = args.glob || '**/*';

const run = cmd => {
  let status = 0;
  try {
    execSync(cmd, { stdio: 'inherit' });
    if (args.verbose) console.log(`Success: ${cmd}`);
  } catch (err) {
    if (args.verbose) console.log(`Error: ${cmd} failed with ${err}`);
    status = err.status || 1;
  }
  return status;
};

if (command) {
  sgf('ACM', (err, results) => {
    if (err) {
      if (args.verbose) console.log(err);
      process.exit(1);
    }
    if (results.length === 0) {
      if (args.verbose) console.log('No staged files.');
      process.exit(1);
    }
    const files = results
      .slice()
      .sort()
      .map(file => {
        if (args.verbose) console.log('Staged:', file.filename);
        return file.filename;
      })
      .filter(minimatch.filter(glob));
    if (files.length > 0) {
      if (args.serial) {
        const status = files.map(file => run(`${command} ${file}`)).some(code => code > 0) ? 1 : 0;
        process.exit(status);
      } else {
        const status = run(`${command} ${files.join(' ')}`);
        process.exit(status);
      }
    } else {
      if (args.verbose) console.log('No files matching filter.');
      process.exit(1);
    }
  });
} else {
  if (args.verbose) console.log('No command.');
  process.exit(1);
}
