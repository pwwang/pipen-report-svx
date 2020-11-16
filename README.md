# pipen-report-svx

Compile svx files (mdx for svelte) into multipe SPAs that can run without a server.

## Install

```shell
npm install -g pipen-report-svx
```

## Use

```shell
pipen-report-svx

Build HTML reports for input files.

Options:
      --version   Show version number                                  [boolean]
      --help      Show help                                            [boolean]
  -r, --reports   The report files                            [array] [required]
  -o, --outdir    The output directory                                [required]
  -n, --nocover   Do not generate a cover page for all reports? true|false|auto.
                  Default is auto (generate for multiple pages, but not for a
                  single page.                        [string] [default: "auto"]
  -m, --metadata  A json file containing the metadata of the pipeline.[required]
  -t, --tmpdir    Template working directory for building.
                            [default: "/tmp/pipen-report-svx-<hash of reports>"]
```
