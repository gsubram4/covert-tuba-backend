from flask import Flask
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app(host="0.0.0.0", port=5000): 
    # initialize Flask
    app = Flask(__name__, static_url_path='', static_folder='static')
    app.host = host
    app.port = port
    app.config['SECRET_KEY'] = 'gjr39dkjn344_!68#'
    socketio.init_app(app)
    
    from . import routes, events
    app.register_blueprint(routes.bp)
    
    return app
    