# READ it !

CLI tool to read MD files with your browser.

## Install

``` npm i readit-md -g```

## Examples

```sh

    # open README.md at cwd
    readit 
    
    # open some.md at cwd
    readit some.md
    
    # set a specific port
    readit some.md --port 64002
    
    # inject a specific css
    readit some.md --css /abs/path/to/css
    
    # inject a specific template
    readit some.md --template /abs/path/to/template
    
    # force a restart
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

When the program is invoked, 

it loads your preferences (css / template) from the user folder 
in a file named ```readit.json```

It will then starts an http server on port 64000,
and detach it s process.

If the server is already running, this process is re used.

Once the webserver is ready, the default system browser is started at a specific url.

This url is specifically forged to let you read to read the MD file from your local file system.

The server will remain open until you restart your computer,
or kill it, if you wish to.

## TODO

Take advantage of ```github-markdown``` template injection 
to have configurable option to read MD files the way you ll prefer it.
