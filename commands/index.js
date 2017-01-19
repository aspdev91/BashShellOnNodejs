'use strict';

const _ = require('lodash');

// lo_dash combines functions from all three sub-modules
_.assign(module.exports,
  require('./no-stdin'),
  require('./optional-stdin'),
  require('./required-stdin')
);
