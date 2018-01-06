# Weather Service UI

## Prerequisites

For Linux or OS X, it's nice to have npm install packages under your user account, put these to .bashrc or similar:
```
export npm_config_prefix="$HOME/.local" # Install global node packages under users home
export PATH="$HOME/.local/bin:$PATH" # Add global package binaries to PATH
```

Installing project dependancies
```
npm install -g bower grunt-cli
cd /path/to/project/ui
npm install && bower install
```

## Server
``grunt server``

This starts a development server on port 3333.
which listens for changes in ui code. Whenever a file changes grunt will tell the browser to reload
the file.

Development server also contains Swagger-UI rest api browser under /docs url.

Calls to /api are proxied to Scala backend on port 8080 by development server.

## Build
``grunt build``