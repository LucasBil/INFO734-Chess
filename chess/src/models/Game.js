import Model from './Model.js';
import { Chess } from 'chess.js';

export default class Game extends Model {
    /**
     * 
     * @param {*} id : uuid of the room
     * @param {*} players : list of object [{ white:Profile, black:Profile }]
     * @param {Chess} board : board
     */
    constructor(id, players, board=null) {
        this.id = id;
        this.players = players;
        this.board = board;
    }
}