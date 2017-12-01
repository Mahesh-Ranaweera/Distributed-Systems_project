#! /bin/bash
printf "CPU,Memory\n"
end=$((SECONDS+3600))
while [ $SECONDS -lt $end ]; do
MEMORY=$(free -m | awk 'NR==2{printf "%.2f%%\n", $3*100/$2 }')
CPU=$(top -bn2 | awk '/^top -/ { p=!p } { if (!p) print }' | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{printf "%.1f%%,", 100 - $1}')
echo "$CPU$MEMORY"
done