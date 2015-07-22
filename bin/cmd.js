#!/usr/bin/env node

var CompactToStylishStream = require('../')
var cp = require('child_process')
var minimist = require('minimist')

var STANDARD_CMD = require.resolve('standard/bin/cmd')

var argv = minimist(process.argv.slice(2), {
  boolean: [
    'stdin'
  ]
})
var snazzy = new CompactToStylishStream()

process.on('exit', function (code) {
  if (code === 0 && snazzy.exitCode !== 0) {
    process.exit(snazzy.exitCode)
  }
})
process.stdout.on('error', function () {})

if (!process.stdin.isTTY || argv._[0] === '-' || argv.stdin) {
  process.stdin.pipe(snazzy).pipe(process.stdout)
} else {
  var args = process.argv.slice(2)
  var standard = cp.spawn(STANDARD_CMD, args)
  standard.stderr.pipe(process.stderr)
  standard.stdout.pipe(snazzy).pipe(process.stdout)

  var standardCode
  standard.on('exit', function (code) { standardCode = code })
  process.on('exit', function (code) {
    if (code === 0 && standardCode !== 0) {
      console.error('non-zero exit from the `standard` command')
      process.exit(standardCode)
    }
  })
}