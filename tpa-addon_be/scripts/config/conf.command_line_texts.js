const selector = {requester: "@r", target: "@t"}
const cmdSelector = {tpa: "$tpa", tpaccept: "$tpaccept", tpcancel: "$tpcancel", tpahere: "$tpahere", tpahelp: "$tpahelp", tpaui: "$tpaui", typedcmd: "$typedcmd"}

const chatTag = "[§8Tpa System§r]"
const separator = ' : '

const tpa_texts = {
    request_send: `Você enviou uma solicitação de teleporte para §7${selector.target}§r`,
    request_receive: `Você recebeu uma solicitação de teleporte de §7${selector.requester}§r. Use ${cmdSelector.tpaccept} para aceitar, ou ${cmdSelector.tpcancel} para recusar`
}

const tpahere_texts = {
    request_send: `Você enviou uma solicitação de teleporte para sua localização para §7${selector.target}§r`,
    request_receive: `§7${selector.requester}§r te enviou uma solicitação de teleporte para a sua própria localização. Use ${cmdSelector.tpaccept} para aceitar, ou ${cmdSelector.tpcancel} para recusar`
}

const tpaccept_texts = {
    accept_advice: `Teleporte aceito`
}

const tpcancel_texts = {
    canceled_advice_torequester: `Sua solicitação de teleporte foi recusada`,
    canceled_advice_totarget: `Você cancelou a solicitação de teleporte`
}

const tpaui_texts = {
    clock_usage: "Segure e pressione utizando o relógio para ativar a interface de usuário do tpa"
}

const tpahelp_texts = {
    title: `Comandos de Ajuda (${cmdSelector.tpahelp})`,
    content_before_help_texts: " >> ",
    help_texts: [
        `§e${cmdSelector.tpa}§r -> Teleporta você até um jogador (Exemplo: §7!tpa <§8player§7>§r)`,
        `§e${cmdSelector.tpahere}§r -> Teleporta um jogador até você (Exemplo: §7!tpa <§8player§7>§r)`,
        `§e${cmdSelector.tpaccept}§r -> Aceita um pedido de teleporte (Exemplo: §7!tpaccept§r)`,
        `§e${cmdSelector.tpcancel}§r -> Recusa um pedido de teleporte (Exemplo: §7!tpcancel§r)`,
        `§e${cmdSelector.tpaui}§r -> Você recebe um relógio que é utilizado para acessar a interface gráfica (Exemplo: §7!tpaui§r)`,
    ],
    addittional_texts: [
        'Nota: Se o nome do usuário alvo conter espaços, é necessário digitar o nome entre aspas (Exemplo: §7!tpa \\"MN TEN\\")'
    ]
}

export { selector, cmdSelector, chatTag, separator, tpa_texts, tpahere_texts, tpaccept_texts, tpcancel_texts,tpahelp_texts, tpaui_texts}
        