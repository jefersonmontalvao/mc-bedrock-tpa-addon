// API Modules
import { world, system } from "@minecraft/server";
import * as ui from "@minecraft/server-ui"

// Internal Modules
// Functions
import { PlayerHasTag, RunMCCommand, RunMCCommandEntity } from './utils.js'

// Custom Texts
import {
    ChooseTargetPlayerMessage,
    GoOrComeToggleButtom, UiTittle,
    BodyTittle, RequestToGoToTargetLocation,
    RequestToTakeYouToRequesterLocation,
    AcceptOrDenyButtom, CanceledRequestAdvice,
    NewRequestAdvice, TeleportDoneCorreclyAdvice
} from '../config/conf.ui_texts.js'
import {
    selector, cmdSelector,
    chatTag, separator,
    tpa_texts, tpaccept_texts,
    tpahelp_texts, tpahere_texts,
    tpcancel_texts,
    tpaui_texts
} from '../config/conf.command_line_texts.js'
import { CantExecuteInYourselfError, InexistentCommandError, NotRequestedError, PlayerOfflineError } from '../config/conf.debug.js'

import { WelcomeMessage } from '../config/config.welcome_msg.js'
import { CommandPrefix } from '../config/config.prefix.js'
import { CreditsMessage } from '../config/conf.credits.js'


// Tpa by user interface
function TpaUI(player) {
    // Do Advices to the chat about the TPUI
    const DoChatAdviceFromUI = function (player, message) {
        if (typeof player != typeof "string") {
            player = player.name
        }
        let formatedMessage = message.toString().replaceAll('\"', "''").replaceAll('\\', "/")
        world.getDimension('overworld').runCommandAsync(`tellraw "${player}" {"rawtext":[{"text":"${formatedMessage}"}]}`)
    }
    // Run a command at overworld
    const RunCommandAtOverworld = function (command) {
        return world.getDimension('overworld').runCommandAsync(command).statusMessage
    }

    let uiForm = new ui.ModalFormData() // Make a instance of Modal Form Data
    let onlinePlayers = world.getPlayers() // Get Players Online
    let listOfPlayerNames = [] // List of Player Names
    let listOfPlayerObjects = [] // List of Player Objects 

    // Operation to save data to {listOfPlayerNames,listOfPlayerObjects}
    for (let online_player of onlinePlayers) {
        if (player.name !== online_player.name) {
            listOfPlayerNames.push(online_player.name)
            listOfPlayerObjects.push(online_player)
        }
    }
    if (listOfPlayerNames.length === 0) {
        RunMCCommand(`tellraw "${player.name}" {"rawtext": [{"text": "??cSistema Offline"}]}`)
        throw "System Offline Error: You can't use, tpa in youself."
    }

    // UI Configuration
    uiForm.title(UiTittle) // UI Title
    uiForm.dropdown(`${ChooseTargetPlayerMessage}`, listOfPlayerNames) // UI Dropdown List Of Players
    uiForm.toggle(`${GoOrComeToggleButtom}`) // Toggle Buttom

    // Show Player Response UI
    uiForm.show(player).then(response => {
        let subUiForm = new ui.MessageFormData() // Sub Ui form to show the player response
        let target_player_object = listOfPlayerObjects[response.formValues[0]] // form dropdown value
        let isTpahere = response.formValues[1] // form toggle value

        // UI form texts
        if (isTpahere) {
            subUiForm.title(`${UiTittle}`)
            subUiForm.body(`${BodyTittle}??7${player.name}??r ${RequestToTakeYouToRequesterLocation}`)
        } else {
            subUiForm.title(`${UiTittle}`)
            subUiForm.body(`${BodyTittle}??7${player.name}??r ${RequestToGoToTargetLocation}`)
        }

        // Yes or No UI Buttom
        subUiForm.button1(AcceptOrDenyButtom.yes)
        subUiForm.button2(AcceptOrDenyButtom.no)

        // Advice about new tp request
        DoChatAdviceFromUI(player, `${NewRequestAdvice}${target_player_object.name}`)
        
        subUiForm.show(target_player_object).then(response => {
            if (response.selection != 1) {
                return DoChatAdviceFromUI(player, `${CanceledRequestAdvice}`)
            }
            DoChatAdviceFromUI(player, `${TeleportDoneCorreclyAdvice}`)

            // Do teleport
            if (isTpahere) {
                RunCommandAtOverworld(`tp "${target_player_object.name}" "${player.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${player.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${target_player_object.name}"`)
            } else {
                RunCommandAtOverworld(`tp "${player.name}" "${target_player_object.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${player.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${target_player_object.name}"`)
            }
        })
    })
}

// Tpa by chat
function TpaCommandLine(player_data) {
    const players_list = []

    for (let player of world.getPlayers()) {
        players_list.push(player.name)
    }

    let sender_name = player_data.sender.name ?? player_data.sender.nameTag
    let target = undefined

    // Returns true if player is online else, false
    function isPlayerOnline(player) {
        function isInList(p) {
            return p.toLowerCase() === player.toLowerCase()
        }

        let result = players_list.find(isInList)

        if (result === undefined) {
            return false
        } else {
            return true
        }
    }

    // Returns the command target
    function getTarget() {
        let msg = player_data.message
        let cmd = player_data.command
        let target = msg.slice(CommandPrefix.length).replace(cmd, '').trim().replaceAll('"', '')
        return target
    }

    // returns a formated text for advices
    function formatConfText(text, show_chatTag=true) {
        let formated_text = `${text}`

        // Selectors Format
        formated_text = text.replaceAll(selector.requester, sender_name)
        try {
            formated_text = formated_text.replaceAll(selector.target, getTarget())
        } catch (err) {
            console.log(err)
        }
        formated_text = formated_text.replaceAll(cmdSelector.tpa, `${CommandPrefix}tpa`)
        formated_text = formated_text.replaceAll(cmdSelector.tpaccept, `${CommandPrefix}tpaccept`)
        formated_text = formated_text.replaceAll(cmdSelector.tpcancel, `${CommandPrefix}tpcancel`)
        formated_text = formated_text.replaceAll(cmdSelector.tpahere, `${CommandPrefix}tpahere`)
        formated_text = formated_text.replaceAll(cmdSelector.tpaui, `${CommandPrefix}tpaui`)
        formated_text = formated_text.replaceAll(cmdSelector.typedcmd, `${CommandPrefix}${player_data.command}`)
        if (show_chatTag) {
            return `${chatTag}${separator}${formated_text}`
        } else if (!show_chatTag) {
            return formated_text
        }
        else {
            throw 'formated text error'
        }
    }

    switch (player_data.command) {
        case 'tpa':
            target = getTarget()
            if (isPlayerOnline(target)) {
                if (target.toLowerCase() !== sender_name.toLowerCase()) {
                    // Sounds
                    RunMCCommandEntity(`playsound random.levelup "${target}`, player_data.sender)
                    RunMCCommand(`playsound random.levelup "${sender_name}"`)
    
                    // Mark Tags to players
                    RunMCCommand(`tag "${sender_name}" add pt1`)
                    RunMCCommand(`tag "${sender_name}" add tpa`)
    
                    RunMCCommand(`tag "${target}" add pt2`)
                    RunMCCommand(`tag "${target}" add tpa`)
    
    
                    // Do Advices
                    RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(tpa_texts.request_send)}"}]}`)
                    RunMCCommand(`tellraw "${target}" {"rawtext":[{"text":"${formatConfText(tpa_texts.request_receive)}"}]}`)
                } else {
                    // exception block
                    RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(CantExecuteInYourselfError, false)}"}]}`)
                }
            } else {
                // exception block
                RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(PlayerOfflineError, false)}"}]}`)
            }
            break
        case 'tpahere':
            target = getTarget()

            if (isPlayerOnline(target)) {
                if (target !== sender_name) {
                    // Sounds
                    RunMCCommandEntity(`playsound random.levelup "${target}`, player_data.sender)
                    RunMCCommand(`playsound random.levelup "${sender_name}"`)

                    // Mark Tags to players
                    RunMCCommand(`tag "${sender_name}" add pt1`)
                    RunMCCommand(`tag "${sender_name}" add tpahere`)

                    RunMCCommand(`tag "${target}" add pt2`)
                    RunMCCommand(`tag "${target}" add tpahere`)


                    // Do Advices
                    RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(tpahere_texts.request_send)}"}]}`)
                    RunMCCommand(`tellraw "${target}" {"rawtext":[{"text":"${formatConfText(tpahere_texts.request_receive)}"}]}`)
                } else {
                    // exception block
                    RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(CantExecuteInYourselfError, false)}"}]}`)
                    RunMCCommand(`playsound note.bass "${sender_name}"`)
                }
                
            } else {
                // Exception Block
                RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(PlayerOfflineError, false)}"}]}`)
                RunMCCommand(`playsound note.bass "${sender_name}"`)
            }
            break
        case 'tpaccept':
            if (PlayerHasTag(player_data.sender, "pt2") && PlayerHasTag(player_data.sender, "tpa")) {
                // When just usual tpa. Block
                // Accept Advice
                RunMCCommandEntity(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(tpaccept_texts.accept_advice)}"}]}`, player_data.sender)

                RunMCCommand(`playsound random.levelup "${sender_name}"`)
                RunMCCommand(`tp @a[tag=pt1] "${sender_name}"`)

                // Clear tags
                RunMCCommand('tag @a remove pt2')
                RunMCCommand('tag @a remove pt1')
                RunMCCommand('tag @a remove tpa')

            } else if (PlayerHasTag(player_data.sender, "pt2") && PlayerHasTag(player_data.sender, "tpahere")) {
                // When tpahere. Block
                RunMCCommandEntity(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(tpaccept_texts.accept_advice)}"}]}`, player_data.sender)

                RunMCCommand(`playsound random.levelup "${sender_name}"`)

                // Do teleport
                RunMCCommand(`tp "${sender_name}" @a[tag=pt1]`)

                RunMCCommand('tag @a remove pt2')
                RunMCCommand('tag @a remove pt1')
                RunMCCommand('tag @a remove tpahere')
            } else {
                // exception block
                RunMCCommandEntity(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(NotRequestedError, false)}"}]}`, player_data.sender)
                RunMCCommand(`playsound note.bass "${sender_name}"`)
            }
            break
        case 'tpcancel':
            if (PlayerHasTag(player_data.sender, "pt1") || PlayerHasTag(player_data.sender, "pt2")) {
                if (PlayerHasTag(player_data.sender, "pt1") && PlayerHasTag(player_data.sender, "tpa")) {
                    // Case usual tpa
                    RunMCCommand(`tellraw @a[tag=tpa] {"rawtext":[{"text":"${formatConfText(tpcancel_texts.canceled_advice_torequester)}"}]}`)

                    RunMCCommand(`playsound random.levelup @a[tag=pt1, tag=tpa]`)
                    RunMCCommand(`playsound random.levelup @a[tag=pt2, tag=tpa]`)

                    RunMCCommand('tag @a[tag=tpa] remove pt1')
                    RunMCCommand('tag @a[tag=tpa] remove pt2')
                    RunMCCommand('tag @a remove tpa')
                } else if (PlayerHasTag(player_data.sender, "pt2") && PlayerHasTag(player_data.sender, "tpahere")) {
                    // Case tpahere
                    RunMCCommand(`tellraw @a[tag=tpahere] {"rawtext":[{"text":"${formatConfText(tpcancel_texts.canceled_advice_torequester)}"}]}`)

                    RunMCCommand(`playsound random.levelup @a[tag=pt1, tag=tpahere]`)
                    RunMCCommand(`playsound random.levelup @a[tag=pt2, tag=tpahere]`)

                    RunMCCommand('tag @a[tag=tpahere] remove pt1')
                    RunMCCommand('tag @a[tag=tpahere] remove pt2')
                    RunMCCommand('tag @a remove tpahere')
                }
            } else {
                // Exception block
                RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(NotRequestedError, false)}"}]}`)
                RunMCCommand(`playsound note.bass "${sender_name}"`)
            }

            break
        case 'tpaui':
            RunMCCommandEntity(`give @s[hasitem={item=clock, quantity=0}] clock`, player_data.sender)
            RunMCCommandEntity(`tellraw @s[hasitem={item=clock}] { "rawtext": [ { "text": "${formatConfText(tpaui_texts.clock_usage)}" } ] }`, player_data.sender)
            RunMCCommandEntity('playsound random.orb @s', player_data.sender)
            break
        case 'tpahelp':
        case 'help':
        case 'h':
            // Tellraw help texts
            let formated_help_text = formatConfText(tpahelp_texts.title)
            for (let text of tpahelp_texts.help_texts) {
                formated_help_text += `\n${tpahelp_texts.content_before_help_texts}${formatConfText(text, false)}`
            }
            // Additional Information
            for (let a_text of tpahelp_texts.addittional_texts) {
                formated_help_text += `\n${formatConfText(a_text, false)}`
            } 

            RunMCCommandEntity(`tellraw @s { "rawtext": [ { "text": "${formated_help_text}" } ] }`, player_data.sender)

            RunMCCommand(`playsound random.orb ${sender_name}`)
            break
        default:
            // exception block
            RunMCCommandEntity(`tellraw "${sender_name}" { "rawtext": [ { "text": "${formatConfText(InexistentCommandError, false)}" } ] }`, player_data.sender)
            RunMCCommand(`playsound note.bass "${sender_name}"`)
    }

}

// TpaCommandLine is executed by this function
function TpaCommandLineFunctionInit() {
    world.events.beforeChat.subscribe(chatMessage => {
        if (chatMessage.message.startsWith(CommandPrefix)) {
            let sender = chatMessage.sender
            let message = chatMessage.message
            let command = message.slice(CommandPrefix.length).trim().split(' ').shift().toLowerCase()

            chatMessage.cancel = true // Do not broadcast the message

            TpaCommandLine({ "sender": sender, "message": message, "command": command })
        }
    })
}

// TpaUI is executed by this function
function TpaUiFunctionInit() {
    world.events.beforeItemUse.subscribe(eventData => {
        let item = eventData.item
        let player = eventData.source
        if (item.typeId == "minecraft:clock") {
            TpaUI(player)
        }
    })
}

// Say Welcome Message
function doWelcomeMessage() {
    system.run(function tick() {
        world.getDimension("overworld").runCommandAsync(`tellraw @a[tag=!__welcome__] {"rawtext":[{"text":"${WelcomeMessage}"}]}`)
        world.getDimension("overworld").runCommandAsync(`tag @a[tag=!__welcome__] add __welcome__`)
        system.run(tick)
    })
}

// Say addon credits
function doAddonCredits() {
    system.run(function tick() {
        world.getDimension("overworld").runCommandAsync(`tellraw @a[tag=!__credits__] {"rawtext":[{"text":"${CreditsMessage}"}]}`)
        world.getDimension("overworld").runCommandAsync(`tag @a[tag=!__credits__] add __credits__`)
        system.run(tick)
    })
}

export { TpaUiFunctionInit, TpaCommandLineFunctionInit, doWelcomeMessage, doAddonCredits }