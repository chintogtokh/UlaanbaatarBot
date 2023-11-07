import * as googlesheets from "./googlesheets"
import { ConfigType } from "./googlesheets/config"

/**
 * Runs a script 
 */
const runScript = async () => {
    const args = process.argv.slice(2)
    const scriptType = args[0]
    if (scriptType in googlesheets.Config) {
        console.log(`Running ${scriptType}`)
        const item = googlesheets.Config[scriptType as keyof ConfigType]
        await item.script()
    } else {
        new Error("Wrong script")
    }
}

runScript();