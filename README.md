# caca

A cli tool for CA.

[![Dependency Status](https://david-dm.org/zkochan/caca/status.svg?style=flat)](https://david-dm.org/zkochan/caca)
[![Build Status](https://travis-ci.org/zkochan/caca.svg?branch=master)](https://travis-ci.org/zkochan/caca)
[![npm version](https://badge.fury.io/js/caca.svg)](http://badge.fury.io/js/caca)


## Installation

```
npm install -g caca
```


## Available commands


### ca api <api key>

Sets the API key that will be used to communicate with Rally. Other commands won't work without an API key.

**Usage example**

```
$ ca api _023djief03fh34ASjfwe0f2jASojsasf0
```


### ca open

Opens the current Rally story/defect in the browser. The story ID is taken from the current branch name.

**Usage example**

```
# when on branch john-US123
$ ca open
# opens story US123 in the browser
```


### ca open <formattedId>

Opens the specified Rally story/defect in the browser.

**Usage example**

```
$ ca open US53439
# opens the story US53439 in the browser

ca open DE92342
# opens the defect DE92342 in the browser
```


## License

MIT © [Zoltan Kochan](https://www.kochan.io)
