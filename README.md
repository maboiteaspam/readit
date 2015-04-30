# READ it !

CLI tool to read your MD files into your browser.

## Install

``` npm i readit -g```

## Usage

```sh
 readit 
 readit some.md
```

## Under the hood

Under the hood, when you invoke the program, it will starts a detached webserver on port 64000.

If the server is already running, same process is re used.

Then it opens your browser with a specific url to read the MD file from your local file system.

The webserver will remain open until you restart your computer.

## TODO

Take advantage of ```github-markdown``` template injection 
to have configurable option to read MD files the way you ll prefer it.