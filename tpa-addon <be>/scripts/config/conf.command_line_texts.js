const selector = {requester: "@r", target: "@t"}
const cmdSelector = {tpa: "$tpa", tpaccept: "$tpaccept", tpcancel: "$tpcancel", tpahere: "$tpahere", tpahelp: "$tpahelp", tpaui: "$tpaui",typedcmd: "$typedcmd"}

const chatTag = "[§dTpa System§r]"
const separator = ' : '

const tpa_texts = {
    request_send: `Você acabou de enviar uma solicitação de teleporte para ${selector.target}`,
    request_receive: `Você, acaba de receber uma solicitação de teleporte de ${selector.requester}. Use ${cmdSelector.tpaccept} para aceitar, ou ${cmdSelector.tpcancel} para recusar`
}

const tpahere_texts = {
    request_send: `Você enviou uma solicitação de teleporte para sua localização para ${selector.target}`,
    request_receive: `${selector.requester}§r quer teleportar você para sua localização. Use ${cmdSelector.tpaccept} para aceitar, ou ${cmdSelector.tpcancel} para recusar`
}

const tpaccept_texts = {
    accept_advice: `Tu Aceitou`,
    teleport_advice: `tu vai ser teleportado`,
}

const tpcancel_texts = {
    canceled_advice_torequester: `sua solicitação foi cancelada cara`,
    canceled_advice_totarget: `você cancelou a bag`
}

const tpahelp_texts = {
    title: `§f[§dTPA System§f] : §rComandos de Ajuda (${cmdSelector.tpahelp})`,
    help_texts: [
        `teste`,
        `test2`
    ]
}

export { selector, cmdSelector, chatTag, separator, tpa_texts, tpahere_texts, tpaccept_texts, tpcancel_texts,tpahelp_texts}
        