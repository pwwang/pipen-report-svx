const fs = require('fs');
// const fse = require('fs-extra');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter')
const yaml = require('js-yaml');
const ejs = require('ejs');
const hash = require('object-hash');
const { spawn } = require("child_process");

const rootdir = path.dirname(__dirname);

module.exports = function(options) {
    if (options.tmpdir.includes('<hash of reports>')) {
        options.tmpdir = options.tmpdir.replace('<hash of reports>', hash(options.reports))
    }
    console.log(`Working directory: ${options.tmpdir}`);

    if (fs.existsSync(options.tmpdir)) {
        fs.readdirSync(options.tmpdir)
            .filter(p => !['node_modules', 'yarn.lock'].includes(p))
            .forEach(p => {
                const pathToClean = path.join(options.tmpdir, p);
                fs.lstatSync(pathToClean).isDirectory()
                    ? fs.rmdirSync(pathToClean, {recursive: true})
                    : fs.unlinkSync(pathToClean);
            });
    } else {
        fs.mkdirSync(options.tmpdir);
    }

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
        path.join(rootdir, 'package-build.json'),
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

    const hasCover = (options.nocover === 'auto' && options.reports.length > 1) || options.nocover === 'false';

    ejs.renderFile(
        path.join(rootdir, 'webpack.config.ejs'),
        {
            outdir: path.resolve(options.outdir),
            entries: JSON.stringify(
                Object.assign(
                    hasCover
                        ? {index: path.join(options.tmpdir, 'src', 'pages', 'index', 'main.js')}
                        : {},
                    ...options.reports.map(report => ({
                        [path.parse(report).name]: path.join(
                            options.tmpdir, 'src', 'pages', path.parse(report).name, 'main.js'
                        )
                    }))
                ))
        },
        function(err, content) {
            const destWebpackConfig = path.join(options.tmpdir, 'webpack.config.js');
            fs.writeFileSync(destWebpackConfig, content);
        }
    );
    // pages
    const pagesdir = path.join(srcdir, 'pages');
    fs.mkdirSync(pagesdir);
    if (hasCover) {
        fs.symlinkSync(
            path.join(rootdir, 'src', 'pages', 'index'),
            path.join(pagesdir, 'index')
        );
    }

    options.reports.forEach(report => {
        const slug = path.parse(report).name
        fs.mkdirSync(path.join(pagesdir, slug));
        fs.copyFileSync(
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
