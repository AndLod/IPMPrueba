from flask import Flask
from flask import request
from pymongo import MongoClient
from bson.json_util import dumps
from flask import jsonify
import json
from flask_cors import CORS, cross_origin


client = MongoClient('localhost:27017')
db = client.b

app = Flask(__name__)
CORS(app)

#FLASK_APP=server.py flask run

@app.route("/")
def hello():
    return "Hello Irene!"


@app.route("/post_workout", methods = ['POST'])
def add_workout():
    try:
        data = json.loads(request.data)
        wk_name = data['name']
        wk_description = data['description']
        wk_image = data['image']
        wk_exercises = data['exercises']
        if wk_name and wk_description:
            status = db.workouts.insert_one({
                "name" : wk_name,
                "description" : wk_description,
                "image" : wk_image,
                "exercises" : wk_exercises
            })
        return dumps(status)
    # except Exception, e:
    except Exception as e:
        return dumps({'error' : str(e)})

@app.route('/get_exercises', methods=['GET'])
def get():
    exercises = db.exercises
    output = []
    for s in   exercises.find():
      output.append({'exerciseName' : s['name']})
    return dumps(output)

@app.route('/get_exercises_image', methods=['GET'])
def get_exercises_image():
    exercises = db.exercises
    output = []
    for s in   exercises.find():
      aux = []
      aux.append({'exerciseName' : s['name']})
      aux.append({'exerciseImage' : s['image']})
      output.append(aux)
    return dumps(output)

@app.route('/get_workouts_name', methods=['GET'])
def get_workouts_name():
    workouts = db.workouts
    output = []
    for s in workouts.find():
      output.append({'workoutName' : s['name']})    
    return dumps(output)


@app.route('/get_workouts_description', methods=['GET'])
def get_workouts_description():
    workouts = db.workouts
    output = []
    for s in workouts.find():    
      output.append( {'workoutDescription' : s['description']});
    return dumps(output)

@app.route('/get_workouts_image', methods=['GET'])
def get_workouts_image():
    workouts = db.workouts
    output = []
    for s in workouts.find():    
      output.append( {'workoutImage' : s['image']});
    return dumps(output)


  if __name__ == "__main__":
    app.run(host='0.0.0.0')
