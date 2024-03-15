#import serial.tools.list_ports
#ports = serial.tools.list_ports.comports()

#for port, desc, hwid in sorted(ports):
#    print("{}: {} [{}]".format(port,desc,hwid))

import serial
import time
import requests
import json

firebase_url = "https://learnfirebase-f2755-default-rtdb.asia-southeast1.firebasedatabase.app"

# Connect to Serial Port for communication
ser = serial.Serial('COM3', 9600, timeout=0)

# Setup a loop to send Temperature values at fixed intervals in seconds
fixed_interval = 10
while True:
    try:
        # temperature value obtained from Arduino + KY-013 Temp Sensor
        temperature_c = ser.readline().decode().rstrip()
        
        # current time and date
        #time_hhmmss = time.strftime('%H:%M:%S')
        #date_mmddyyyy = time.strftime('%d/%m/%Y')
        
        # current location name
        temperature_location = 'rakes'
        temperature_hier = 'RAKE 1'
        print(temperature_c + ',' + temperature_location + temperature_hier)
        
        # update record
        #data = {'date': date_mmddyyyy, 'time': time_hhmmss, 'value': temperature_c}
        data = {'rakeTemperature': temperature_c}
        result = requests.put(firebase_url + '/' + temperature_location + '/'+ temperature_hier + '/rakeTemperature.json', data=json.dumps(data))
        
        print('Record inserted. Result Code = ' + str(result.status_code) + ',' + result.text)
        time.sleep(fixed_interval)
    except IOError:
        print('Error! Something went wrong.')
    #time.sleep(fixed_interval)
    except KeyboardInterrupt:
        break
ser.close()