// Check if the player has the specified tag
function PlayerHasTag(player, tag) {
    return player.hasTag(tag)
}

// Run a minecraft command
function RunMCCommand(cmd, dim = 'overworld') {
    return world.getDimension(dim ?? 'overworld').runCommandAsync(cmd)
}

// Run a minecraft command at a entity
function RunMCCommandEntity(cmd, entity) {
    return entity.runCommandAsync(cmd)
}

export { PlayerHasTag, RunMCCommand, RunMCCommandEntity }