#!/usr/bin/env node

const os = require('os');
const path = require('path');
const yargs = require("yargs");

const options = yargs
    .usage(`Usage: $0 -r REPORT-1.svx [REPORT-2.svx ...] \\
           -o ./dist
       $0 dev`)
    .command('$0', 'Build HTML reports for input files.', function (yargs) {
        return yargs
            .option('r', { alias: 'reports', type: 'array', demand: true, describe: 'The report files' })
            .option('o', { alias: 'outdir', type: 'path', demand: true, describe: 'The output directory' })
            .option('n', {
                alias: 'nocover',
                type: 'string',
                describe: 'Do not generate a cover page for all reports? true|false|auto. Default is auto (generate for multiple pages, but not for a single page.',
                default: 'auto'
            })
            .option('m', {
                alias: 'metadata', type: 'path', demand: true, describe: 'A json file containing the metadata of the pipeline.'
            })
            .option('t', {
                alias: 'tmpdir',
                type: 'path',
                desc: 'Template working directory for building.',
                default: path.join(os.tmpdir(), 'pipen-report-svx-<hash of reports>')
            })
    })
    .command('dev', 'Make it ready for dev environment.')
    .help()
    .argv;

if (options._.includes('dev')) {
    require('../src/dev');
} else {
    require('../src/build')(options);
}

