const fs = require('fs');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter')
const yaml = require('js-yaml');
const ejs = require('ejs');
const { spawn } = require("child_process");

const rootdir = path.dirname(__dirname);

module.exports = function(options) {
    console.log(`Working directory: ${options.tmpdir}`);

    if (fs.existsSync(options.tmpdir)) {
        fs.rmdirSync(options.tmpdir, {recursive: true});
    }
    fs.mkdirSync(options.tmpdir);

    // fs.symlinkSync(options.outdir, path.join(options.tmpdir, path.basename(options.outdir)));

    // link public
    fs.symlinkSync(
        path.join(rootdir, 'public'),
        path.join(options.tmpdir, 'public')
    );

    // src
    const srcdir = path.join(options.tmpdir, 'src');
    fs.mkdirSync(srcdir);
    fs.symlinkSync(
        path.join(rootdir, 'src', 'components'),
        path.join(srcdir, 'components')
    );
    // src/data
    const datadir = path.join(srcdir, 'data');
    fs.mkdirSync(datadir);
    fs.copyFileSync(options.m, path.join(datadir, 'pipeline.json'));
    fs.symlinkSync(
        path.join(rootdir, 'src', 'layouts'),
        path.join(srcdir, 'layouts')
    );
    fs.symlinkSync(
        path.join(rootdir, 'src', 'remark-media.js'),
        path.join(srcdir, 'remark-media.js')
    );

    fs.symlinkSync(
        path.join(rootdir, 'package.json'),
        path.join(options.tmpdir, 'package.json')
    );

    fs.symlinkSync(
        path.join(rootdir, 'postcss.config.js'),
        path.join(options.tmpdir, 'postcss.config.js')
    );

    fs.symlinkSync(
        path.join(rootdir, 'tailwind.config.js'),
        path.join(options.tmpdir, 'tailwind.config.js')
    );

    ejs.renderFile(
        path.join(rootdir, 'webpack.config.ejs'),
        {
            outdir: path.resolve(options.outdir),
            entries: JSON.stringify(Object.assign({}, ...options.reports.map(report => ({
                [path.parse(report).name]: report
            }))))
        },
        function(err, content) {
            const destWebpackConfig = path.join(options.tmpdir, 'webpack.config.js');
            fs.writeFileSync(destWebpackConfig, content);
        }
    );
    // pages
    const pagesdir = path.join(srcdir, 'pages');
    fs.mkdirSync(pagesdir);
    if (options.c) {
        fs.symlinkSync(
            path.join(rootdir, 'src', 'pages', 'index'),
            path.join(pagesdir, 'index')
        );
    }

    options.reports.forEach(report => {
        const slug = path.parse(report).name
        fs.mkdirSync(path.join(pagesdir, slug));
        fs.symlinkSync(
            path.join(rootdir, 'src', 'pages', 'index', 'main.js'),
            path.join(pagesdir, slug, 'main.js')
        );

        // replace the frontmatter with metadata
        const metadata = JSON.parse(fs.readFileSync(options.metadata));
        const { data, content, errors } = frontmatter(fs.readFileSync(report));
        data.__file__ = path.resolve(report);
        metadata.processes.forEach(process => {
            if (process.slug === slug) {
                data.layout = 'proc';
                data.proc_name = process.name;
                data.proc_slug = process.slug;
                data.proc_desc = process.desc;
                return;
            }
        });
        fs.writeFileSync(
            path.join(pagesdir, slug, 'App.svx'),
            `---
${yaml.dump(data)}
---
${content}
`
        );
    });

    const cmd = spawn('bash', ['-c', `cd ${options.tmpdir}; yarn; yarn build`]);
    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);
};
