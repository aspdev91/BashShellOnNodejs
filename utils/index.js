'use strict';

const chalk = require('chalk');

module.exports = {
  handleErr: function (err) {
    process.stderr.write(chalk.red('err: ') + err + '\n');
  }
};
