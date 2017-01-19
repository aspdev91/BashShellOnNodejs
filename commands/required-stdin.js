'use strict';
const chalk = require('chalk');

function grep (stdin, matchString, done) {
  const matcher = new RegExp(matchString, 'g');
  const matches = stdin
  .split('\n')
  .filter(line => matcher.test(line)) // only include lines with matches
  .map(line => { // map each line to the line with colorized matches
    return line.replace(matcher, match => chalk.green(match));
  })
  .join('\n');
  done(matches);
}

module.exports = {
  grep: grep
};
