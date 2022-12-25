# Time of response is gone advice
tellraw @a[tag=pt1,scores={time_counter=801}] {"rawtext":[{"text":"§f[§8Tpa System§f] : §rO tempo de resposta expirou, solicite novamente"}]}
# Sound
playsound mob.witch.death @a[tag=pt1,scores={time_counter=801}] 

# Time of response is gone advice
tellraw @a[tag=pt2,scores={time_counter=801}] {"rawtext":[{"text":"§f[§8Tpa System§f] : §rO tempo de resposta expirou, peça a "},{"selector":"@a[tag=pt1, scores={time_counter=801}]"}, {"text":"§r que solicite novamente"}]}
# Sound
playsound mob.witch.death @a[tag=pt2,scores={time_counter=801}]

scoreboard players set @a[tag=pt1,scores={time_counter=801}] time_counter 0
scoreboard players set @a[tag=pt2,scores={time_counter=801}] time_counter 0

execute as @a[tag=pt2,scores={time_counter=0}] run tag @s remove tpa
execute as @a[tag=pt2,scores={time_counter=0}] run tag @s remove tpahere
execute as @a[tag=pt2,scores={time_counter=0}] run tag @s remove pt2

execute as @a[tag=pt1,scores={time_counter=0}] run tag @s remove tpahere
execute as @a[tag=pt1,scores={time_counter=0}] run tag @s remove tpa
execute as @a[tag=pt1,scores={time_counter=0}] run tag @s remove pt1