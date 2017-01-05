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
  - [ca api \[api key\]](#ca-api-api-key)
  - [ca open](#ca-open)
- [Tasks](#tasks)
  - [ca task list](#ca-task-list-formatted-id)
  - [ca task update \[formatted ID\] \[status\] \[actuals\]](#ca-task-update-formatted-id-status-actuals)
  - [ca task new](#ca-task-new-formatted-storydefect-id-taskname-state-estimate-actuals)
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
    open          Opens the specified defect or story
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

Opens the Rally story/defect in the browser based on git branch name or user input.

## Tasks

### `ca task list`

Prints out list of tasks added to the Rally story/defect in the CLI

### `ca task update [formatted ID] [status] [actuals]`

Updates status and actuals of the task
Possible [status] options:

- d - defined
- p - In-Progress
- c - Completed

**Usage example**

```sh
$ ca task update TA95062 c 2
```

### `ca task new`

Adds a new task to a story/defect and prints the list of tasks after new one was created. Asks for task details (name, state, actuals, owner) in step-by-step process

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
