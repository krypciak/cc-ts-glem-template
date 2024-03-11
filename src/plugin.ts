import { PluginClass } from 'ultimate-crosscode-typedefs/modloader/mod'
import { Mod1 } from './types'

import { test_function } from '@gleam/test_project.mjs'

export default class GleamTemplate implements PluginClass {
    static dir: string
    static mod: Mod1

    constructor(mod: Mod1) {
        GleamTemplate.dir = mod.baseDirectory
        GleamTemplate.mod = mod
        GleamTemplate.mod.isCCL3 = mod.findAllAssets ? true : false
        GleamTemplate.mod.isCCModPacked = mod.baseDirectory.endsWith('.ccmod/')
    }

    async prestart() {
        const res = test_function()
        console.log(res)
    }
}
