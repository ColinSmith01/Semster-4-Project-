mosquitto_sub -v -h localhost -t /# | while read line
do
        echo "--------------------------------------------------------"
        echo "line: $line"

        # Printing tab format 
        echo "" #line break
        ID=`echo $line|cut -f2 -d/` #ID 
        echo "ID: $ID"

        echo "" #line break
        postcode=`echo $line|cut -f3 -d/`
        echo "Postcode: $postcode" 

        echo ""
        Sensor_Number=`echo $line|cut -f4 -d/`
        echo "Sensor Number: $Sensor_Number" # Sensor number

        echo ""
        Sensor_Status=`echo $line|cut -f5 -d/`
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
        echo ""




#Update - Sensors - Sensor Status,Decsription, Time Updating    
curl -X PATCH 'https://tvyuknfeekidwvwnkulv.supabase.co/rest/v1/sensors?id=eq.'"$ID"'' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{ "sensor_status": "'"$Sensor_Status"'",
        "description": "'"$msgF1"'",
      "timestamp": "'"$todaysdate"'"
}'


done

