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

### `ca --help`

Ouputs description for each command

**Usage example**

```sh
$ ca --help

  Usage: ca [options] [command]


  Commands:

    task          do something with tasks
    api [apiKey]  Sets the CA API key
    open [id]     Opens the specified defect or story
    help [cmd]    display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

### `ca task --help`

Ouputs description for each task-related command

**Usage example**

```sh
$ ca task --help

  Usage: ca-task [options] [command]


  Commands:

    list|ls [formattedId]                                     Prints the list of tasks of the story/defect
    new [artifactId] [taskName] [state] [estimate] [actuals]  Adds a new task to a story/defect
    new-merge [taskPrefix]                                    Adds a new merge task to a story/defect
    update [formattedId] [status] [actuals]                   Updates status and actuals of the task

  Options:

    -h, --help  output usage information
```

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

## Tasks

### `ca task list [formatted ID]`

Prints out list of tasks added to the specified Rally story/defect in the CLI

**Usage example**

```sh
$ ca task list US53439
┌─────────┬─────────────┬─────────┬───────────┬─────────┬─────────────┐
│(index)  │ FormattedID │ Name    │ State     │ Actuals │ Owner       │
├─────────┼─────────────┼─────────┼───────────┼─────────┼─────────────┤
│ 0       │ TA95062     │ Dev     │ Completed │ 2       │ John Doe    │
├─────────┼─────────────┼─────────┼───────────┼─────────┼─────────────┤
│ 1       │ TA95147     │ merge   │ Completed │ 0.1     │ John Doe    │
├─────────┼─────────────┼─────────┼───────────┼─────────┼─────────────┤
│ 2       │ TA95180     │ QA      │ Completed │ 6       │ Jane Doe    │
├─────────┼─────────────┼─────────┼───────────┼─────────┼─────────────┤
│ 3       │ TA95232     │ CR      │ Completed │ 0.1     │ Richard Roe │
└─────────┴─────────────┴─────────┴───────────┴─────────┴─────────────┘
```

or

```sh
$ ca task ls US53439
```

### `ca task update [formatted ID] [status] [actuals]`

Updates status and actuals of the task
Possible [status] options:
* d - defined
* p - In-Progress
* c - Completed

**Usage example**

```sh
$ ca task update TA95062 c 2
```

### `ca task new [formatted story/defect ID] [taskName] [state] [estimate] [actuals]`

Adds a new task to a story/defect

**Usage example**

```sh
$ ca task new US53439 "development" c 20 4
```


## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
