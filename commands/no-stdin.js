'use strict';

const fs = require('fs');
const handleErr = require('../utils').handleErr;
var history_list = require('../bash').history_list


function quit () {
  process.exit(0); // terminate gracefully
}

function pwd (stdin, args, done) {
  done(process.cwd());
}

function date (stdin, args, done) {
  done(Date()); 
}

function ls (stdin, args, done) {
  fs.readdir('.', function (err, filenames) {
    if (err) handleErr(err);
    if (args !== '-la') { 
      filenames = filenames.filter(filename => (filename[0] !== '.'));
    }
    done(filenames.join('\n'));
  });
}

function printenv(stdin,args,done) {
  done(JSON.stringify(process.env));
}

function history(stdin,args,done){
  fs.readFile('history.txt', 'utf8', function(err, data) {
    if (err) console.error("Cannot retrieve history");
    done(data)
  });
}

function echo (stdin, args, done) {
  const output = args
  .split(' ')
  .map(arg => { // convert each $ENVIRONMENT_VAR to its value
    return (arg[0] === '$') ? process.env[arg.slice(1)] : arg;
  })
  .join(' ');
  done(output);
}

module.exports = {
  quit,
  pwd,
  date,
  ls,
  echo,   
  printenv,  
  history  
};
