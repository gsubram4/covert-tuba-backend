import numpy as np
import pandas as pd
from json import dumps

class GameBoard:
    player_one = 1
    player_two = -1
    player_spectator = 0
    repr_dict = {0: "", player_one: "x", player_two: "o" }
    
    def __init__(self, board_size):
        self.board_size = board_size
        self.active_player = GameBoard.player_one
        self.winner = 0
        self.board = np.zeros((self.board_size, self.board_size)).astype(int)
        
        self.player_one = None
        self.player_two = None
        self.players = {}
        
    def register_player(self, player_name, spectator=False):
        if player_name in self.players:
            #Player is already in the room 
            return self.players[player_name]
        
        role = None
        if spectator is False:
            if self.player_one is None:
                role = GameBoard.player_one
                self.player_one = player_name
            elif self.player_two is None:
                role = GameBoard.player_two
                self.player_two = player_name
                
        if role is None:
            role = GameBoard.player_spectator
                
        self.players[player_name] = role
        return role
        
    def flip_active_player(self):
        if self.active_player == GameBoard.player_one:
            self.active_player = GameBoard.player_two
        elif self.active_player == GameBoard.player_two:
            self.active_player = GameBoard.player_one
        
    def play_move(self, player_name, location, location_2=None):
        if player_name not in self.players:
            return False 
        
        if self.winner is not 0:
            return False
        
        token = self.players[player_name]
        if location_2 is None:
            _loc = np.unravel_index(location, self.board.shape)
        else:
            _loc = (location, location_2)
        
        if self.players[player_name] == self.active_player and self.board[_loc] == 0:
            self.board[_loc] = token
            self.check_win_conditions(_loc, token)
            self.flip_active_player()
            return True
        else:
            return False
        
    def check_win_conditions(self, location, token):
        row, column = location
        
        #check horizontally
        if np.abs(np.sum(self.board[row, :])) == 3:
            self.winner = token
        
        #check vertically
        if np.abs(np.sum(self.board[:, column])) == 3:
            self.winner=token
        
        #check main diagonally
        if row==column and self.board[0,0] == self.board[1,1] == self.board[2,2]:
            self.winner=token
        
        #check second diagonal
        if row+column == 2 and self.board[0,2] == self.board[1,1] == self.board[2,0]:
            self.winner=token
        
        return False if self.winner==0 else True


    def __serialize__(self):
        return dumps({"board": [GameBoard.repr_dict[k] for k in self.board.flatten().tolist()], 
                "active_player": self.active_player, 
                "players": self.players,
                "winner": GameBoard.repr_dict[self.winner] })
        