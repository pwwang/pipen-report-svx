#!/usr/bin/env node

const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const yargs = require("yargs");

const options = yargs
    .usage(`Usage: $0 -r REPORT-1.svx [REPORT-2.svx ...] \\
           -o ./dist --cover-page
       $0 dev`)
    .command('$0', 'Build HTML reports for input files.', function(yargs) {
        return yargs
            .option('r', {alias: 'reports', type: 'array', demand: true, describe: 'The report files'})
            .option('o', {alias: 'outdir', type: 'path', demand: true, describe: 'The output directory'})
            .option('c', {
                alias: 'cover-page',
                type: 'boolean',
                describe: 'Whether generate a cover page for all reports? Default is auto (generate for multiple pages, but not for a single page.',
                default: null
            })
            .option('t', {
                alias: 'tmpdir',
                type: 'path',
                desc: 'Template working directory for building.',
                default: path.join(os.tmpdir(), `pipen-report-svx-${uuidv4().split('-')[0]}`)
            })
    })
    .command('dev', 'Make it ready for dev environment.')
    .help()
    .argv;

if ('dev' in options._) {

} else {
    require('../src/dev');
}

