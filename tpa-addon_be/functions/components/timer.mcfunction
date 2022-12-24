# Xtaring
tellraw @a[tag=pt1,scores={time_counter=1801}] {"rawtext":[{"text":"§f[§8Tpa System§f] : §rO tempo de TPA expirou, solicite novamente"}]}

playsound mob.witch.death @a[tag=pt1,scores={time_counter=1801}] 

tellraw @a[tag=pt2,scores={time_counter=1801}] {"rawtext":[{"text":"§f[§8Tpa System§f] : §rO tempo de TPA expirou, peça a "},{"selector":"@a[tag=pt1"},{"text":"§r que solicite novamente"}]}

playsound mob.witch.death @a[tag=pt2,scores={time_counter=1801}]

scoreboard players set @a[tag=pt1,scores={time_counter=1801}] time_counter 0
scoreboard players set @a[tag=pt2,scores={time_counter=1801}] time_counter 0

execute as @a[tag=pt2,scores={time_counter=0}] run tag @s remove tpa
execute as @a[tag=pt2,scores={time_counter=0}] run tag @s remove tpahere
execute as @a[tag=pt2,scores={time_counter=0}] run tag @s remove pt2

execute as @a[tag=pt1,scores={time_counter=0}] run tag @s remove tpahere
execute as @a[tag=pt1,scores={time_counter=0}] run tag @s remove tpa
execute as @a[tag=pt1,scores={time_counter=0}] run tag @s remove pt1