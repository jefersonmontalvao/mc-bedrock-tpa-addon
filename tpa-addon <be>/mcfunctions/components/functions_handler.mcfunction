# Initial Config 
gamerule commandblockoutput false
gamerule sendcommandfeedback true

# Create Timer Objective
scoreboard objectives add time_counter dummy "§9<TPA> Time Counter"

# Timer Tick
scoreboard players add @a[tag=pt1] time_counter 1
scoreboard players add @a[tag=pt2] time_counter 1

# Functions Runner
execute as @a[scores={time_counter=1800}] run function components/timec1
execute as @a[scores={time_counter=10}] run function components/advc1