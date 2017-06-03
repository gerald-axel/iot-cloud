import paho.mqtt.client as mqtt
from random import randint
import pymongo
import datetime
import time
import threading


class Intersection:
    'Common base class for all intersection'
    def __init__(self, max_cars):
        self.semaphore_times = []
        self.num_cars = []
        self.flags = []
        for i in range(4):
            self.semaphore_times.append(randint(1,8)*15)
            self.max_cars = randint(0, max_cars)
            self.num_cars.append(randint(0,self.max_cars))
            self.flags.append(0)

def publicador():
    while True:
        w, h = 5, 5;
        # set up the mqtt client
        mqttc = mqtt.Client("python_pub1")

        # the server to publish to, and corresponding port
        #mqttc.connect("test.mosquitto.org", 1883)
        mqttc.connect("broker", 1883)


        client = pymongo.MongoClient('mongo', 27017)
        db = client.umg
        collection = db.data_history
        hora = datetime.datetime.now() # + datetime.timedelta(hours=1)
        hora = hora.hour
        if collection.find().count() > 0:
            results = collection.aggregate(
                [
                    {
                        "$group": {
                            "_id": {#"dayOfWeek": {"$dayOfWeek": "$moment"},
                                    "hour": {"$hour": "$moment"},
                                  "x_location": "$x_location", "y_location": "$y_location"},
                            "upcars": {"$avg": {"$arrayElemAt": ["$num_cars", 0]}},
                            "rightcars": {"$avg": {"$arrayElemAt": ["$num_cars", 1]}},
                            "downcars": {"$avg": {"$arrayElemAt": ["$num_cars", 2]}},
                            "leftcars": {"$avg": {"$arrayElemAt": ["$num_cars", 3]}}
                        }
                    },
                    {"$match": {"_id.hour": hora}}
                ]
            )
            mongo_result = list(results)
            mqttc.loop_start()
            for mr in mongo_result:
                header = mr['_id']
                x_location = header['x_location']
                y_location = header['y_location']
                hour =  header['hour']
                up = int(round(mr['upcars'],0)*10)
                right = int(round(mr['rightcars'],0)*10)
                down = int(round(mr['downcars'],0)*10)
                left = int(round(mr['leftcars'],0)*10)
                message = str(up)+","+str(right)+","+str(down)+","+str(left)
                semaphore.acquire()
                temp_flags = flags
                semaphore.release()
                for i in temp_flags:
                    message += ","+str(i)
                channel = "semaforo/"+str(x_location)+str(y_location)
                mqttc.publish(channel, message)
                mqttc.loop()
            mqttc.loop_stop()
        else:
            hour = 0
            day = 1
            month = 6
            moment = datetime.datetime(2017, 1, 1, 0, 0)
            i = 0
            while moment < datetime.datetime.now():
                intersections = [[Intersection(moment.hour) for x in range(w)] for y in range(h)]
                data = {}
                for y in range(h):
                    for x in range(w):

                        data = {
                            "moment": moment,
                            "x_location":x,
                            "y_location":y,
                            "semaphore_times":intersections[x][y].semaphore_times,
                            "num_cars": intersections[x][y].num_cars,
                            "flags":intersections[x][y].flags,
                            "max_cars":intersections[x][y].max_cars
                        }
                        result = collection.insert_one(data)
                moment += datetime.timedelta(hours=1)

        intersections = [[Intersection(16) for x in range(w)] for y in range(h)]
        #time.sleep(3600)
        time.sleep(60)

def flag_modifier():
    sets = [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 2],
        [0, 0, 2, 0],
        [0, 2, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 3],
        [0, 0, 3, 0],
        [0, 3, 0, 0],
        [3, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
    while True:
        semaphore.acquire()
        global flags
        flags = sets[randint(0,len(sets)-1)]
        semaphore.release()

semaphore = threading.Semaphore()

global flags
flags = [0,0,0,0]
t = threading.Thread(target=publicador)
t2 = threading.Thread(target=flag_modifier)
t.start()
t2.start()


