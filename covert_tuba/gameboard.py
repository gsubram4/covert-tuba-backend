import numpy as np
import pandas as pd
from json import dumps

class GameBoard:
    player_one = 1
    player_two = -1
    player_spectator = 10
    repr_dict = {0: "", player_one: "x", player_two: "o" , 10: "Spectator"}
    
    def __init__(self, name, board_size):
        self.name = name
        self.board_size = board_size
        self.active_player = GameBoard.player_one
        self.winner = 0
        self.board = np.zeros((self.board_size, self.board_size)).astype(int)
        
        self.player_one = None
        self.player_two = None
        self.win_positions = []
        self.players = {}
        
    def get_name(self):
        return self.name
        
    def get_players(self):
        return list(self.players.keys())
    
    def restart_board(self):
        self.active_player = GameBoard.player_one
        self.winner = 0
        self.board = np.zeros((self.board_size, self.board_size)).astype(int)
        
        old_p1 = self.player_one
        old_p2 = self.player_two
        self.player_one = old_p2
        self.player_two = old_p1
        self.win_positions = []
        if self.player_one in self.players:
            self.players[self.player_one] = GameBoard.player_one
        if self.player_two in self.players:
            self.players[self.player_two] = GameBoard.player_two
        return {player:GameBoard.repr_dict[role] for player, role in self.players.items()}
        
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
        return GameBoard.repr_dict[role]
    
    def unregister_player(self, player_name):
        if player_name in self.players:
            role = self.players[player_name]
            if player_name == self.player_one:
                self.player_one = None
            if player_name == self.player_two:
                self.player_two = None
            del self.players[player_name]
            return GameBoard.repr_dict[role]
        return None
        
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
            self.win_positions = [int(np.ravel_multi_index([row, idx], self.board.shape)) for idx in range(self.board.shape[1])]
        
        #check vertically
        if np.abs(np.sum(self.board[:, column])) == 3:
            self.winner=token
            self.win_positions = [int(np.ravel_multi_index([idx, column], self.board.shape)) for idx in range(self.board.shape[0])]
        
        #check main diagonally
        if row==column and self.board[0,0] == self.board[1,1] == self.board[2,2]:
            self.winner=token
            self.win_positions = [0, 4, 8]
        
        #check second diagonal
        if row+column == 2 and self.board[0,2] == self.board[1,1] == self.board[2,0]:
            self.winner=token
            self.win_positions = [2, 4, 6]
        
        return False if self.winner==0 else True


    def __serialize__(self):
        return dumps({"board": [GameBoard.repr_dict[k] for k in self.board.flatten().tolist()],
                      "size": self.board.shape,
                "active_player": GameBoard.repr_dict[self.active_player], 
                "players": self.players,
                "win_positions": self.win_positions,
                "winner": GameBoard.repr_dict[self.winner] })
        