from flask import Flask, render_template, jsonify, request, Blueprint, send_from_directory
from . import controller

bp = Blueprint('routes', __name__,template_folder='templates')

#@bp.route('/', methods=["GET"])
#def index():
#    """Serve the index HTML"""
#    return send_from_directory('static', 'index.html')#render_template('index.html')

@bp.route('/rooms' , methods=["GET"])
def rooms_rest():
    return jsonify(controller.get_rooms())

@bp.route('/players' , methods=["GET"])
def players():
    return jsonify(controller.get_players())

@bp.route('/room/<room_name>', methods=["GET"])
def room_rest(room_name):
    return jsonify(controller.get_room(room_name, serialize=True))

@bp.route('/create_room/<int:board_size>', defaults={'name': None}, methods=['POST'])
@bp.route('/create_room/<int:board_size>/<string:name>', methods=['POST'])
def create_room_rest(board_size, name):
    return jsonify(controller.create_room(board_size, name))

@bp.route('/delete_room/<name>', methods=['POST'])
def delete_room_rest(name):
    return jsonify(controller.delete_room(name))

@bp.route('/register_player/<room_name>/<player_name>', methods=['POST'])
def register_player_rest(room_name, player_name):
    return jsonify(controller.register_player(room_name, player_name))

@bp.route('/play_move/<player_name>/<int:location>', methods=['POST'])
def play_move_rest(player_name, location):
    return jsonify(controller.play_move(player_name, location))
