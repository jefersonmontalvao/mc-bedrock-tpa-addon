// API Modules
import { world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui"

// Internal Modules
import { PlayerHasTag, RunMCCommand, RunMCCommandEntity } from './utils.js'
import { CreditsMessage } from '../config/conf.credits.js'
import { InexistentCommand } from '../config/conf.debug.js'
import { ChooseTargetPlayerMessage, GoOrComeToggleButtom, UiTittle, BodyTittle, RequestToGoToTargetLocation, RequestToTakeYouToRequesterLocation, AcceptOrDenyButtom, CanceledRequestAdvice, NewRequestAdvice, TeleportDoneCorreclyAdvice } from '../config/conf.ui_texts.js'
import { selector, cmdSelector, chatTag, separator, tpa_texts, tpaccept_texts, tpahelp_texts, tpahere_texts, tpcancel_texts } from '../config/conf.command_line_texts.js'

import { CommandPrefix } from '../config/config.prefix.js'
import { WelcomeMessage } from '../config/config.welcome_msg.js'


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
        subUiForm.buttonOpt1(AcceptOrDenyButtom["yes"])
        subUiForm.buttonOpt2(AcceptOrDenyButtom["no"])

        // Advice about new tp request
        DoChatAdviceFromUI(player, `${NewRequestAdvice}${targetResponseObject.name}`)

        //
        subUiForm.show(targetResponseObject).then(response => {
            if (response.selection != 1) return DoChatAdviceFromUI(player, `${CanceledRequestAdvice}`)
            DoChatAdviceFromUI(player, `${TeleportDoneCorreclyAdvice}`)

            // Do teleport
            if (targetResponseValue) {
                RunCommandAtOverworld(`tp "${targetResponseObject.name}" "${player.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${player.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${targetResponseObject.name}"`)
            } else {
                RunCommandAtOverworld(`tp "${player.name}" "${targetResponseObject.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${player.name}"`)
                RunCommandAtOverworld(`playsound mob.endermen.portal "${targetResponseObject.name}"`)
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
    function checkOnlinePlayer(player) {
        function isInList(p) {
            return p === player
        }

        let result = players_list.find(isInList)

        if (result === undefined) {
            return false
        } else {
            return true
        }
    }

    // Returns the command target
    function getCommandTargetByCommandLine() {
        let msg = player_data.message
        let cmd = player_data.command
        let target = msg.slice(CommandPrefix.length).replace(cmd, '').trim().replaceAll('"', '')
        return target
    }

    // returns a formated text for advices
    function formatConfText(text) {
        let formated_text = `${text}`

        // Selectors Format
        formated_text = text.replaceAll(selector.requester, sender_name)
        try {
            formated_text = formated_text.replaceAll(selector.target, getCommandTargetByCommandLine())
        } catch (err) {
            console.log(err)
        }
        formated_text = formated_text.replaceAll(cmdSelector.tpa, `${CommandPrefix}tpa`)
        formated_text = formated_text.replaceAll(cmdSelector.tpaccept, `${CommandPrefix}tpaccept`)
        formated_text = formated_text.replaceAll(cmdSelector.tpcancel, `${CommandPrefix}cancel`)
        formated_text = formated_text.replaceAll(cmdSelector.tpahere, `${CommandPrefix}tpahere`)
        formated_text = formated_text.replaceAll(cmdSelector.tpaui, `${CommandPrefix}tpaui`)
        formated_text = formated_text.replaceAll(cmdSelector.typedcmd, `${CommandPrefix}${player_data.command}`)
        return `${chatTag}${separator}${formated_text}`
    }

    switch (player_data.command) {
        case 'tpa':
            target = getCommandTargetByCommandLine()

            if (checkOnlinePlayer(target)) {
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
                // TODO Set exception message later
                RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"§cJogadores Online ${players_list}"}]}`)
            }
            break
        case 'tpahere':
            target = getCommandTargetByCommandLine()

            if (checkOnlinePlayer(target)) {
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
                // TODO Set exception message later
                RunMCCommand(`tellraw "${sender_name}" {"rawtext":[{"text":"§cJogadores Online ${players_list}"}]}`)
            }
            break
        case 'tpaccept':
            if (PlayerHasTag(player_data.sender, "pt2") && PlayerHasTag(player_data.sender, "tpa")) {
                // When just usual tpa. Block
                // Accept Advice
                RunMCCommandEntity(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(tpaccept_texts.accept_advice)}"}]}`, player_data.sender)

                // Sound
                RunMCCommand(`playsound random.levelup "${sender_name}"`)

                // Do teleport
                RunMCCommand(`tp @a[tag=pt1] "${sender_name}"`)

                // Clear tags
                RunMCCommand('tag @a remove pt2')
                RunMCCommand('tag @a remove pt1')
                RunMCCommand('tag @a remove tpa')

            } else if (PlayerHasTag(player_data.sender, "pt2") && PlayerHasTag(player_data.sender, "tpahere")) {
                // When tpahere. Block
                RunMCCommandEntity(`tellraw "${sender_name}" {"rawtext":[{"text":"${formatConfText(tpaccept_texts.accept_advice)}"}]}`, player_data.sender)

                // Sound
                RunMCCommand(`playsound random.levelup "${sender_name}"`)

                // Do teleport
                RunMCCommand(`tp "${sender_name}" @a[tag=pt1]`)

                // Clear tags
                RunMCCommand('tag @a remove pt2')
                RunMCCommand('tag @a remove pt1')
                RunMCCommand('tag @a remove tpahere')
            } else {
                // exception block
                // TODO Change text
                RunMCCommandEntity(`tellraw "${sender_name}" {"rawtext":[{"text":"TU Solicitou nada parceiro"}]}`, player_data.sender)
            }
            break
        case 'tpacancel':
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
                // exception block
                console.log('fds')
            }

            break
        case 'tpaui':
            break
        case 'tpahelp':
        case 'help':
        case 'h':
            break
        default:

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


export { TpaUI, TpaCommandLineFunctionInit }