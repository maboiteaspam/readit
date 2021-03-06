#!/usr/bin/env node

var pkg = require('./package.json');

var program = require('commander');
var fs = require('fs');
var path = require('path-extra');
var opener = require('opener');
var express = require('express');
var portscan = require('portscan');
var spawn = require('child_process').spawn;
var MD = require('github-markdown');
var kill = require('tree-kill');
var tmp = require('temporary-directory')
var osTmpdir = require('os-tmpdir');

program.version(pkg.version);

program
  .usage('[mdFile]')
  .option('--restart', 'Restart background server if any')
  .option('--server', 'Starts http server')
  .option('--port <port>', 'Port to listen on')
  .option('--template <port>', 'jade template file to use')
  .option('--css <port>', 'File path to your specific css')
  .description('Opens README file in your browser')
  ._name = pkg.name;

program.parse(process.argv);

if (program.h) {
  program.help();
}

var pref = {
  pid: null,
  port: 64000,
  css: null,
  template: null
};

var prefFile = path.join(path.homedir(), 'readit.json');

if (fs.existsSync(prefFile)) {
  pref = JSON.parse(fs.readFileSync(prefFile));
}

program.restart = program.restart || (program.port && pref.port !== program.port);

if (program.port) {
  pref.port = program.port;
}

if (program.css) {
  pref.css = path.resolve(program.css);
}

if (program.template) {
  pref.template = program.template;
}

if (program.server) {
  var port = pref.port;

  var assetsPath = path.join(__dirname, '/assets/');
  if (pref.template) {
    assetsPath = path.dirname(pref.template);
  }

  var app = express();
  app.use(express.static(assetsPath));

  if (pref.css) {
    app.get(path.basename(pref.css), function (req, res) {
      res.send(fs.readFileSync(pref.css));
    });
  }

  app.get('/readit', function (req, res) {
    var token = req.query.f;
    var tPath = path.join(osTmpdir(), token, 'mdFile');
    if (!fs.existsSync(tPath)){
      return res.send(404);
    }
    var file = fs.readFileSync(tPath).toString();
    var config = {
      file: file,
      template: assetsPath + '/template.jade'
    };
    new MD(config).render(function (html) {
      if (pref.css) {
        html = html.replace(/<\/head>/,
          '<link href="/' + path.basename(pref.css) + '" rel="stylesheet"></head>');
      }
      res.send(html);
    });
  });
  app.listen(port, '127.0.0.1');
} else {
  var findMdFile = function (suggested) {
    if (!suggested) {
      suggested = 'README.md';
    }
    suggested = path.resolve(suggested);
    return suggested;
  };
  var isPortOpen = function (port, then) {
    var opts = {};
    opts.findOne = true;
    opts.findActive = false;
    opts.host = '127.0.0.1';
    opts.complete = function (res) {
      then(res.successes === 1);
    };
    opts.maxPort = port + 1;
    portscan(port, opts);
  };
  var startServer = function () {
    var cmdLine = [];
    process.argv.forEach(function (v) {
      cmdLine.push(v);
    });
    cmdLine.push('--server');
    var sProcess = spawn(cmdLine.shift(), cmdLine, {detached: true, stdio: 'ignore'});
    sProcess.unref();
    pref.pid = sProcess.pid;
    fs.writeFileSync(prefFile, JSON.stringify(pref, null, 4));
  };
  var openBrowser = function (port, rFile) {
    var browser = opener('http://localhost:' + port + '/readit?f=' + rFile);
    browser.unref();
    browser.stdin.unref();
    browser.stdout.unref();
    browser.stderr.unref();
  };

  if (program.restart) {
    if (pref.pid) {
      kill(parseInt(pref.pid, 10), 'SIGKILL');
      pref.pid = null;
    }
  }
  fs.writeFileSync(prefFile, JSON.stringify(pref, null, 4));
  isPortOpen(pref.port, function portStated(notOpen) {
    if (notOpen) startServer();
    setTimeout(function () {
      tmp(pkg.name, function created (err, dir, cleanup) {
        if (err) console.error('Error creating tmpdir!', err);
        var mdFile = findMdFile(program.args[0]);
        fs.writeFileSync(dir + '/mdFile', mdFile);
        // do cool stuff with dir here...
        openBrowser(pref.port, path.basename(dir));
      });
    }, notOpen ? 2000 : 200);
  });
}
