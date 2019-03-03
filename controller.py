import logging
from .gameboard import GameBoard
import random, string
LOG_FORMAT = '%(levelname)-10s %(asctime)s %(filename)-20s %(funcName)-25s %(lineno)-5d: %(message)s'
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)

ROOMS = {} # dict to track active rooms
PLAYERS = {}

def ret_helper(return_value=None, code=200, **kwargs):
    kwargs['code'] = code
    if return_value:
        kwargs['value'] = return_value
    return kwargs

def get_rooms():
    return ret_helper(list(ROOMS.keys()))

def get_room(room_name, serialize=False):
    if room_name in ROOMS:
        output = ROOMS[room_name]
        if serialize:
            output = output.__serialize__()
        return ret_helper(output)
    else:
        logging.info("Room: {} does not exist. 400".format(room_name))
        return ret_helper(code=400)
    
def get_players():
    return ret_helper(PLAYERS)

def player_to_room(player_name):
    if player_name in PLAYERS:
        room_name = PLAYERS[player_name]
        return ret_helper(room_name)
    else:
        logging.info("Player: {} does not exist. 400".format(player_name))
        return ret_helper(code=400)
    
def delete_room(room_name):
    if room_name in ROOMS:
        del ROOMS[room_name]
        return ret_helper()
    else:
        return ret_helper(code=400)

def create_room(board_size, name=None):
    """Create a game lobby
    Parameters:
        name - name of the room (must not be taken)
        board_size - optional 
    
    """
    #generate a random name if none is provided
    while name == None:
        test_name = ''.join(random.sample(string.ascii_lowercase, 10))
        response = get_room(test_name)
        if response['code'] == 400:
            name = test_name
        
    #check if the room already exists
    response = get_room(name)
    if response['code'] == 200:
        logging.info("Room: {} already exists. 400".format(name))
        return return_helper(code=400)
    else:
        logging.info("Creating Room: {}".format(name))
        board = GameBoard(board_size)
        ROOMS[name] = board
        return ret_helper(name=name)

def register_player(room_name, player_name, spectator=False):
    response = get_room(room_name)
    if response['code'] == 400:
        return ret_helper(code=400)
    room = response['value']
    
    role = room.register_player(player_name, spectator)
    logging.info("Registered Player: {}, to Room: {}, Role: {}".format(player_name, room_name, role))
    PLAYERS[player_name] = room_name
    return ret_helper(role)

def play_move(player_name, location):
    response = player_to_room(player_name)
    if response['code'] == 400:
        return ret_helper(code=400)
    
    room_name = response['value']
    
    response = get_room(room_name)
    if response == 400:
        return ret_helper(code=400)
    room = response['value']
    
    output = room.play_move(player_name, location)
    logging.info("Player: {} in Room: {}, Played: {}, Returned: {}".format(player_name, room_name, location, output))
    
    return ret_helper(name=room_name)