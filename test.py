from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, emit

# initialize Flask
app = Flask(__name__)
socketio = SocketIO(app)
ROOMS = {} # dict to track active rooms

@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')

@socketio.on('create')
def on_create(data):
    """Create a game lobby"""
    gm = {
        'size':data['size'],
        'teams':data['teams'],
        'dictionary':data['dictionary']
    }
    print(gm)
    room = 1
    ROOMS[room] = gm
    join_room(room)
    emit('join_room', {'room': room})

if __name__ == '__main__':
    socketio.run(app, debug=True)