// API Modules
import { world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui"

// Internal Modules
import { firstCase, secondCase, thirdCase, fourthCase, fifthCase, sixthCase, seventhCase } from '../config/conf.cases.js'
import { CreditsMessage } from '../config/conf.credits.js'
import { InexistentCommand } from '../config/conf.debug.js'
import { ChooseTargetPlayerMessage, GoOrComeToggleButtom, UiTittle, BodyTittle, RequestToGoToTargetLocation, RequestToTakeYouToRequesterLocation, AcceptOrDenyButtom, CanceledRequestAdvice, NewRequestAdvice, TeleportDoneCorreclyAdvice } from '../config/conf.ui_texts.js'
import { CommandPrefix } from '../config/config.prefix.js'
import { WelcomeMessage } from '../config/config.welcome_msg.js'


function TpaUI(player) {
    // Do Advices to the chat about the TPUI
    const DoUiChatAdvice = function(player, message) { 
        if (typeof player != typeof "string") {
            player = player.name
        }
        let formatedMessage = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
        world.getDimension('overworld').runCommandAsync(`tellraw "${player}" {"rawtext":[{"text":"${formatedMessage}"}]}`)
    }
    // Run a command at overworld
    const Cmd = function(command) {
        return world.getDimension('overworld').runCommandAsync(command).statusMessage
    }

    let uiForm = new ui.ModalFormData() // Make a instance of Modal Form Data
    let onlinePlayers = world.getPlayers() // Get Players Online
    let listOfPlayerNames = [] // List of Player Names
    let listOfPlayerObjects = [] // List of Player Objects 

    // Operation to save data to {listOfPlayerNames,listOfPlayerObjects}
    for (let player of onlinePlayers) {
        listOfPlayerNames.push(player.name)
        listOfPlayerObjects.push(player)
    }

    // UI Configuration
    uiForm.title(UiTittle) // UI Title
    uiForm.dropdown(`${ChooseTargetPlayerMessage}`, listOfPlayerNames) // UI Dropdown List Of Players
    uiForm.toggle(`${GoOrComeToggleButtom}`) // Toggle Buttom

    // Show Player Response UI
    uiForm.show(player).then(response => {
        let subUiForm = new ui.MessageFormData() // Sub Ui form to show the player response
        let targetResponseObject = listOfPlayerObjects[response.formValues[0]] // Target Player Name
        let targetResponseValue = response.formValues[1] // Target Player Response Value

        // Advices depending of target response
        if (targetResponseValue) {
            subUiForm.title(`${UiTittle}`)
            subUiForm.body(`${BodyTittle}${player.name}${RequestToTakeYouToRequesterLocation}`)
        } else {
            subUiForm.title(`${UiTittle}`)
            subUiForm.body(`${BodyTittle}${player.name}${RequestToGoToTargetLocation}`)
        }
        // Yes or No UI Buttom
        subUiForm.buttonOpt1(AcceptOrDenyButtom[0]["yes"])
        subUiForm.buttonOpt2(AcceptOrDenyButtom[0]["no"])

        // Advice about new tp request
        DoUiChatAdvice(player, `${NewRequestAdvice}${targetResponseObject.name}`)

        //
        subUiForm.show(targetResponseObject).then(response => {
            if (response.selection != 1) return DoUiChatAdvice(player, `${CanceledRequestAdvice}`)
            DoUiChatAdvice(player, `${TeleportDoneCorreclyAdvice}`)

            // Do teleport
            if (targetResponseValue) {
                Cmd(`tp "${targetResponseObject.name}" "${player.name}"`)
                Cmd(`playsound mob.endermen.portal "${player.name}"`)
                Cmd(`playsound mob.endermen.portal "${targetResponseObject.name}"`)
            } else {
                Cmd(`tp "${player.name}" "${targetResponseObject.name}"`)
                Cmd(`playsound mob.endermen.portal "${player.name}"`)
                Cmd(`playsound mob.endermen.portal "${targetResponseObject.name}"`)
            }
        })
    })
}

export { TpaUI }