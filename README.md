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

### ca open

Opens the current Rally story/defect in the browser. The story ID is taken from the current branch name.

**Usage example**

```
# when on branch john-ja123
$ ca open
# opens story JA123 in the browser
```


### ca open <formattedId>

Opens the specified Rally story/defect in the browser.

**Usage example**

```
$ ca open JA53439
# opens the story JA53439 in the browser

ca open DE92342
# opens the defect DE92342 in the browser
```


## License

MIT © [Zoltan Kochan](https://www.kochan.io)
