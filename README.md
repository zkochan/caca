# caca

> A CLI tool for CA

<!--@shields('travis', 'npm')-->
[![Build Status](https://img.shields.io/travis/zkochan/caca/master.svg)](https://travis-ci.org/zkochan/caca) [![npm version](https://img.shields.io/npm/v/caca.svg)](https://www.npmjs.com/package/caca)
<!--/@-->

## Table of Contents

- [Installation](#installation)
- [Available commands](#available-commands)
  - [ca api \[api key\]](#ca-api-api-key)
  - [ca open](#ca-open)
  - [ca open \[formatted ID\]](#ca-open-formatted-id)
- [License](#license)

## Installation

```sh
npm install --global caca
```

## Available commands

### `ca api [api key]`

Sets the API key that will be used to communicate with Rally. Other commands won't work without an API key.

**Usage example**

```sh
$ ca api _023djief03fh34ASjfwe0f2jASojsasf0
```

### `ca open`

Opens the current Rally story/defect in the browser. The story ID is taken from the current branch name.

**Usage example**

```sh
# when on branch john-US123
$ ca open
# opens story US123 in the browser
```

### `ca open [formatted ID]`

Opens the specified Rally story/defect in the browser.

**Usage example**

```sh
$ ca open US53439
# opens the story US53439 in the browser

ca open DE92342
# opens the defect DE92342 in the browser
```

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
