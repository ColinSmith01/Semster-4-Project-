# a sample generic publish would look like
# mosquitto_pub -t /companyname/topicF1/topicF2/topicF3/  -m "msgF1,msgF2,msgF3,msgF4"
                   #CCP_Alarms/postcode/sensor_number/house_status/ -m "Window now open"  
                   # CCP_Alarms/Postcode/PIR1/housetrigger

# the while will stay in the subscribe loop and act on any messages rxed

mosquitto_sub -v -h localhost -t /CCP_Alarms/# | while read line
do
        # first all we do is echo the line (topic + message) to the screen
        echo "--------------------------------------------------------"
        echo "line: $line"

        # Printing tab format 
        echo "" #line break

        echo "" #line break
        topicF1=`echo $line|cut -f3 -d/`
        echo "Postcode: $topicF1"

        topicF2=`echo $line|cut -f4 -d/`

        echo ""
        echo "Sensor Number: $topicF2"

        #house status spliced from /3
        echo ""
        topicF3=`echo $line|cut -f5 -d/`
        echo "Alarm status: $topicF3"

        # Incoming message
        msg=`echo "$line"|cut -f2- -d ' '`
        #echo -e "msg: $msg
        echo ""
        msgF1=`echo "$msg"|cut -f1 -d,`
        echo "Incoming Message: $msgF1"

        #time occured
        echo ""
        todaysdate="$(date)"
        echo "Time occured: $todaysdate"

        #msgF2=`echo "$msg"|cut -f2 -d,`
        #echo "msgF2: $msgF2"
        #msgF3=`echo "$msg"|cut -f3 -d,`
        #echo "msgF3: $msgF3"
        #msgF4=`echo "$msg"|cut -f4 -d,`
        #echo "msgF4: $msgF4"
        echo ""
        echo "This system is brought to you by CCP Alarms"
        echo "----------------------------------------------------"
        echo ""
        #
done