const fs = require('fs');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter')
const yaml = require('js-yaml');

const rootdir = path.dirname(__dirname);

module.exports = function(options) {
    console.log(`Working directory: ${options.tmpdir}`);

    if (fs.existsSync(options.tmpdir)) {
        fs.rmdirSync(options.tmpdir, {recursive: true});
    }
    fs.mkdirSync(options.tmpdir);

    // link public
    fs.symlinkSync(
        path.join(options.tmpdir, 'public'),
        path.join(rootdir, 'public')
    );

    // src
    const srcdir = path.join(options.tmpdir, 'src');
    fs.mkdirSync(srcdir);
    fs.symlinkSync(
        path.join(srcdir, 'components'),
        path.join(rootdir, 'src', 'components')
    );
    // src/data
    const datadir = path.join(srcdir, 'data');
    fs.mkdirSync(datadir);
    fs.copyFileSync(options.m, path.join(datadir, 'pipeline.json'));
    fs.symlinkSync(path.join(srcdir, 'layouts'), path.join(rootdir, 'src', 'layouts'));
    fs.symlinkSync(path.join(srcdir, 'remark-media.js'), path.join(rootdir, 'src', 'remark-media.js'));

    fs.mkdirSync(path.join(srcdir, 'pages'));

    // pages
    const pagesdir = path.join(srcdir, 'pages');
    fs.mkdirSync(pagesdir);
    if (options.c) {
        fs.symlinkSync(
            path.join(pagesdir, 'index'),
            path.join(rootdir, 'src', 'pages', 'index')
        );
    }

    options.reports.forEach(report => {
        const slug = path.parse(report).name
        fs.mkdirSync(path.join(pagesdir, slug));
        fs.symlinkSync(
            path.join(pagesdir, slug, 'main.js'),
            path.join(rootdir, 'src', 'pages', 'index', 'main.js')
        );

        // replace the frontmatter with metadata
        const metadata = require(options.metadata);
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

};
