// API Modules
import { world, system } from '@minecraft/server'

// Internal Modules
import { TpaUiFunctionInit, TpaCommandLineFunctionInit, doWelcomeMessage, doAddonCredits } from './components/handler.js'

TpaCommandLineFunctionInit()
TpaUiFunctionInit()

system.events.beforeWatchdogTerminate.subscribe(data => {
    data.cancel = true
  })

doWelcomeMessage()
doAddonCredits()
