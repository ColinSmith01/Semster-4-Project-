mosquitto_sub -v -h localhost -t /# | while read line
do
        echo "----------------------------------------------------------"
        echo "line: $line"

        # Printing tab format 
        echo "" #line break
        HouseID=`echo $line|cut -f2 -d/` #House ID 
        echo "House ID: $HouseID"

        echo "" #line break
        postcode=`echo $line|cut -f3 -d/`
        echo "Postcode: $postcode" 

        echo "" #line break
        ID=`echo $line|cut -f4 -d/` #ID
        echo "ID: $ID"

        echo "" #line break
        floor_level=`echo $line|cut -f5 -d/`
        echo "Floor Level: $floor_level"

        echo ""
        HAS=`echo $line|cut -f6 -d/`
        echo "House Alarm Status: $HAS" #house house status

        echo ""
        Sensor_Number=`echo $line|cut -f7 -d/`
        echo "Sensor Number: $Sensor_Number" # Sensor number

        echo ""
        Sensor_Status=`echo $line|cut -f8 -d/`
        echo "Sesnor Status: $Sensor_Status" # Sensor status

        # Incoming message/ description
        echo ""
        msg=`echo "$line"|cut -f2- -d ' '`
        msgF1=`echo "$msg"|cut -f1 -d,`
        echo "Incoming Message: $msgF1"

        #time occured
        echo ""
        todaysdate="$(date)"
        echo "Time occured: $todaysdate"
        echo ""

#House - ID,postcode,floor_level,house_status     
curl -X POST 'https://tvyuknfeekidwvwnkulv.supabase.co/rest/v1/house' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d  '{
    "id": "'"$ID"'",
    "postcode": "'"$postcode"'",
    "floor_level": "'"$floor_level"'",
    "alarm_status": "'"$HAS"'"
}'

#sesnors - Description, house_id, timestamp,sensor_num, sensor_status
curl -X POST 'https://tvyuknfeekidwvwnkulv.supabase.co/rest/v1/sensors' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{ 
    "id": "'"$ID"'",
    "description": "'"$msgF1"'",
    "house_id": "'"$HouseID"'",
    "sensor_status": "'"$Sensor_Status"'",
    "sensor_num": "'"$Sensor_Number"'",
    "timestamp": "'"$todaysdate"'"
}'



done

