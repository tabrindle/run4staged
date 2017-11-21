# run4staged

Simple task runner for staged git files

## Install

`npm install run4staged --save-dev` || `yarn add run4staged --dev`

## Usage

- run4staged runs on each staged file - convenient for linting, reformatting or any precommit checks

`run4staged 'echo'`

- run4staged does not resolve npm bin binaries - either give it a full path, use `npm run` or `yarn`

`run4staged --command 'npm run eslint --fix'`

- verbose will give additional logging

`run4staged --command 'yarn eslint --fix' --verbose`

- run each file by itself

`run4staged 'echo' --serial`

- show no output from commands

`run4staged 'yarn prettier' --quiet`

## Contributing

PRs for additional features are welcome!

## License

MIT

Copyright (c) 2017 Trevor Brindle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
