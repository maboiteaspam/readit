#!/usr/bin/env node

var pkg = require('./package.json');

var program = require('commander');
var path = require('path');
var opener = require('opener');
var express = require('express');
var portscan = require('portscan');
var spawn = require('child_process').spawn;
var MD = require('github-markdown');


program.version(pkg.version);

program
  .usage('[mdFile]')
  .option('--port <port>', 'Starts server on port')
  .description('Opens README file in your browser')
  ._name = pkg.name;
program.parse(process.argv);

var port = program.port || 64000;
var rFile = path.join(process.cwd(), (program.mdFile||'README.md'));
var assetsPath = __dirname+'/assets/';

if(program.port){

  var app = express();
  app.use(express.static( assetsPath ) );
  app.get('/readit', function(req, res){
    var file = req.query.f;
    var config = {
      title: path.basename(file, '.md'),
      file: file,
      template: null
    };
    new MD(config).render(function (html) {
      res.send(html);
    });
  });
  app.listen(program.port);

}else{

  var isOpen = function(then){
    var opts = {};
    opts.findOne = true;
    opts.findActive = false;
    opts.host = '127.0.0.1';
    opts.complete = function(res){
      then(res.successes===1);
    };
    opts.maxPort = port+1;
    portscan(port, opts);
  };

  isOpen(function(open){
    if(open){ // port is open
      var cmdLine = [];
      process.argv.forEach(function(v){
        cmdLine.push(v);
      });
      cmdLine.push('--port' );
      cmdLine.push(port );
      spawn(cmdLine.shift(), cmdLine, { detached:true, stdio:'ignore' }).unref();
    }
    setTimeout(function(){
      var browser = opener('http://localhost:'+port+'/readit?f='+rFile);
      browser.unref();
      browser.stdin.unref();
      browser.stdout.unref();
      browser.stderr.unref();
    },open?200:2000);

  });

}

