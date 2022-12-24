import { cmdSelector, selector } from './conf.command_line_texts.js'

const InexistentCommandError = `§cComando desconhecido. Veja todos os comandos disponíveis em ${cmdSelector.tpahelp}`
const NotRequestedError = `§cNão há solicitações`
const PlayerOfflineError = `§cO jogador(a) \\"${selector.target}\\" não está online.`

export { InexistentCommandError, NotRequestedError, PlayerOfflineError }