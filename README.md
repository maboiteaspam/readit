# READ it !

CLI tool to read your MD files into your browser.

## Install

``` npm i readit-md -g```

## Examples

```sh

    # open README.md at cwd
    readit 
    # open some.md at cwd
    readit some.md
    readit some.md --port 64002
    readit some.md --css /abs/path/to/css
    readit some.md --template /abs/path/to/template
    readit some.md --restart
    
    # starts the server only
    readit --server --port 64000
    
```

## Usage

```sh

  Usage: readit-md [mdFile]

  Opens README file in your browser

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    --restart          Restart background server if any
    --server           Starts http server
    --port <port>      Port to listen on
    --template <port>  jade template file to use
    --css <port>       File path to your specific css

```

## Under the hood

Under the hood, when you invoke the program, 

it will starts an http server on port 64000,
and detach it s process.

If the server is already running, this process is re used.

Then it opens your browser with a specific url 
to read the MD file from your local file system.

The server will remain open until you restart your computer,
or kill it, if you wish to.

The server listens on 127.0.0.1:64000.

## TODO

Take advantage of ```github-markdown``` template injection 
to have configurable option to read MD files the way you ll prefer it.
