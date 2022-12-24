# Initial Config 
gamerule commandblockoutput false
gamerule sendcommandfeedback true

# Create Timer Objective
scoreboard objectives add time_counter dummy "§9Timer for Tpa System§r"

# Timer Tick
scoreboard players add @a[tag=pt1, scores={time_counter=..1801}] time_counter 1
scoreboard players add @a[tag=pt2, scores={time_counter=..1801}] time_counter 1

# Functions Runner
execute as @a[scores={time_counter=1801}] run function components/timer
execute as @a[scores={time_counter=10}] run function components/advice