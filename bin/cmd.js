#!/usr/bin/env node

var StandardCodeclimateTransform = require('../')
var cp = require('child_process')
var minimist = require('minimist')
var path = require('path')

var STANDARD_CMD = path.join(require.resolve('standard'), '../../.bin/standard')
if (/^win/.test(process.platform)) STANDARD_CMD += '.cmd'

var argv = minimist(process.argv.slice(2), {
  boolean: [
    'stdin',
    'null-delimited'
  ]
})

var standardCodeclimate = new StandardCodeclimateTransform({
  nullDelimited: argv['null-delimited']
})

process.on('exit', function (code) {
  if (code === 0 && standardCodeclimate.exitCode !== 0) {
    process.exit(standardCodeclimate.exitCode)
  }
})
process.stdout.on('error', function () {})

if (!process.stdin.isTTY || argv._[0] === '-' || argv.stdin) {
  process.stdin.pipe(standardCodeclimate).pipe(process.stdout)
} else {
  var args = process.argv.slice(2)
  args.push('-v')
  var standard = cp.spawn(STANDARD_CMD, args)
  // standard.stderr.pipe(process.stderr)
  standard.stdout.pipe(standardCodeclimate).pipe(process.stdout)

  var standardCode
  standard.on('exit', function (code) { standardCode = code })
  process.on('exit', function (code) {
    if (code === 0 && standardCode !== 0) {
      console.error('non-zero exit from the `standard` command')
      process.exit(standardCode)
    }
  })
}
