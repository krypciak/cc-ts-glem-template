import * as esbuild from 'esbuild'
import * as child_process from 'child_process'
import * as path from 'path'
import { bold } from 'colors/safe'
import 'colors'
import * as fs from 'fs'
import * as chokidar from 'chokidar'

let isWatch = false
const outFile = 'plugin.js'
const args: esbuild.BuildOptions = {
    target: 'es2018',
    format: 'esm',
    platform: 'node',
    bundle: true,
    sourcemap: 'inline',
    outfile: outFile,
    entryPoints: ['./src/plugin.ts'],
    plugins: [
        {
            name: 'build gleam',
            setup(build) {
                build.onStart(() => {
                    return new Promise(resolve => {
                        console.log(bold('Building...'.yellow))
                        isWatch && console.clear()
                        console.log(bold('Running gleam build'.magenta))
                        const child = child_process.spawn('gleam', ['build'], {
                            cwd: path.join(process.cwd(), 'gleam'),
                            detached: true,
                            stdio: 'inherit',
                        })
                        child.on('message', msg => console.log(` ${msg}`))
                        child.on('close', () => {
                            console.log(bold('Running esbuild'.magenta))
                            resolve()
                        })
                    })
                })
                build.onEnd(result => {
                    if (result.errors.length == 0) {
                        console.log(bold('Build compleate'.yellow))
                        const { size } = fs.statSync(outFile)
                        const kb = size / 1024
                        const mb = kb / 1024
                        const sizeStr = mb >= 1 ? `${mb.toFixed(2)} MiB` : `${kb.toFixed(1)} KiB`
                        console.log(bold(`⚡${outFile}`.white) + ` ${sizeStr}`.green)
                    }
                })
            },
        },
    ],
}
const type = process.argv[2]
try {
    if (type == 'start') {
        esbuild.build(args)
    } else if (type == 'build') {
        args.sourcemap = undefined
        esbuild.build(args)
    } else if (type == 'watch') {
        isWatch = true
        esbuild.build(args).catch(_ => {})
        chokidar.watch(['./src', './gleam/src', './gleam/test']).on('change', () => {
            esbuild.build(args).catch(_ => {})
        })
    }
} catch (e) {
    console.log(e)
}
