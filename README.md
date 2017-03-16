# caca

> A CLI tool for CA

<!--@shields('travis', 'npm')-->
[![Build Status](https://img.shields.io/travis/zkochan/caca/master.svg)](https://travis-ci.org/zkochan/caca) [![npm version](https://img.shields.io/npm/v/caca.svg)](https://www.npmjs.com/package/caca)
<!--/@-->

## Table of Contents

- [Installation](#installation)
- [Available commands](#available-commands)
  - [ca --help](#ca---help)
  - [ca task --help](#ca-task---help)
  - [ca settings](#ca-settings)
  - [ca open](#ca-open)
  - [ca grab](#ca-grab)
  - [ca skype](#ca-skype)
- [Tasks](#tasks)
  - [ca task list](#ca-task-list)
  - [ca task update](#ca-task-update)
  - [ca task new](#ca-task-new)
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

    task        do something with tasks
    settings    Sets the CA API key and current project
    open        Opens the specified defect or story
    help [cmd]  display help for [cmd]

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

    list|ls Prints the list of tasks of the story/defect
    new     Adds a new task to a story/defect
    update  Updates status and actuals of the task

  Options:

    -h, --help  output usage information
```

### `ca settings`

Sets the API key that will be used to communicate with Rally. Other commands won't work without an API key.
Sets the current project that is used in some other commands (e.g. `ca iteration`)

**Usage example**

```sh
$ ca api _023djief03fh34ASjfwe0f2jASojsasf0
```

### `ca open`

Opens the Rally story/defect in the browser based on git branch name or user input.

**Usage example**

```sh
$ ca open --help

  Usage: open [options]

  Opens the specified defect or story

  Options:

    -h, --help         output usage information
    -i, --interactive  Enables UI to enter custom item ID
```

### `ca grab`

Puts the backlog item into the current iteration

**Usage example**

```sh
$ ca grab --help

  Usage: grab [options]

  Puts the story into the current iteration

  Options:

    -h, --help         output usage information
    -i, --interactive  Enables UI to enter custom item ID
```

### `ca skype`

Prepares skype message for you

**Usage example**

```sh
$ ca skype --help

  Usage: skype [options]

  Prepares skype message for you

  Options:

    -h, --help         output usage information
    -i, --interactive  Enables UI to enter custom item ID
```

## Tasks

### `ca task list`

Prints out list of tasks added to the Rally story/defect in the CLI

**Usage example**

```sh
$ ca task list --help

  Usage: list|ls [options]

  Prints the list of tasks of the story/defect

  Options:

    -h, --help         output usage information
    -i, --interactive  Enables UI to enter custom item ID
```

### `ca task update`

Updates task info

**Usage example**

```sh
$ ca task update --help

  Usage: update [options]

  Updates status and actuals of the task

  Options:

    -h, --help         output usage information
    -i, --interactive  Enables UI to enter custom item ID
```

### `ca task new`

Adds a new task to a story/defect and prints the list of tasks after new one was created. Asks for task details (name, state, actuals, owner) in step-by-step process

**Usage example**

```sh
$ ca task new --help

  Usage: new [options]

  Adds a new task to a story/defect

  Options:

    -h, --help         output usage information
    -i, --interactive  Enables UI to enter custom item ID
```

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
