const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const rootdir = path.dirname(__dirname);
const outdir = path.join(rootdir, 'dist');
const globby = require('globby');

// Get ready for the webpack.config.js
const webpackConfigTpl = path.join(rootdir, 'webpack.config.ejs');

function getEntries() {
    const entries = {};
    const allEntry = globby.sync(`${rootdir}/src/pages/**/main.js`);
    allEntry.forEach(entry => {
        const res = entry.match(/src\/pages\/([\w-]+)\/main\.js/);
        if (res.length) {
            entries[res[1]] = entry;
        }
    });
    return entries;
}

ejs.renderFile(
    webpackConfigTpl,
    {
        outdir,
        entries: JSON.stringify(getEntries())
    },
    function(err, content) {
        const destWebpackConfig = path.join(rootdir, 'webpack.config.js');
        fs.writeFileSync(destWebpackConfig, content);
    }
);
