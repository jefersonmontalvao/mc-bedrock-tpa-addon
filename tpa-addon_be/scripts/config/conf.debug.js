import { cmdSelector, selector } from './conf.command_line_texts.js'

const InexistentCommandError = `§cComando desconhecido. Veja todos os comandos disponíveis em ${cmdSelector.tpahelp}`
const NotRequestedError = `§cNão há solicitações de teleporte`
const PlayerOfflineError = `§cO jogador(a) \\"${selector.target}\\" não está online`
const CantExecuteInYourselfError = `§cVocê não pode se teleportar para sua própria localização`

export { InexistentCommandError, NotRequestedError, PlayerOfflineError, CantExecuteInYourselfError }