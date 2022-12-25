# PT 1 Advice
tellraw @a[tag=pt1,scores={time_counter=10}] {"rawtext":[{"text":"§f[§8Tpa System§f] : §rTempo de resposta expira em 30 segundos"}]}
playsound mob.witch.death @a[tag=pt1,scores={time_counter=10}]
scoreboard players add @a[tag=pt1, scores={time_counter=10}] time_counter 1

# PT 2 Advice
tellraw @a[tag=pt2,scores={time_counter=10}] {"rawtext":[{"text":"§f[§8Tpa System§f] : §rTempo de resposta expira em 30 segundos"}]}
playsound mob.witch.death @a[tag=pt2,scores={time_counter=10}]
scoreboard players add @a[tag=pt2, scores={time_counter=10}] time_counter 1
