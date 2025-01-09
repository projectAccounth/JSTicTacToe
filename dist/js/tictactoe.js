"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToe = exports.MIN_BOARD_SIZE = void 0;
exports.fillBoard = fillBoard;
exports.MIN_BOARD_SIZE = 3;
function fillBoard(boardSize, symbol) {
    var output = new Array(boardSize);
    for (var i = 0; i < boardSize; i++) {
        output[i] = new Array(boardSize);
        for (var j = 0; j < boardSize; j++) {
            output[i][j] = symbol;
        }
    }
    return output;
}
function checkLines(board, symbol, matchLen) {
    var boardSize = board.length;
    for (var i = 0; i < boardSize; ++i) {
        var rowMatch = 0;
        var colMatch = 0;
        for (var j = 0; j < boardSize; ++j) {
            rowMatch = (board[i][j] == symbol) ? rowMatch + 1 : 0;
            if (rowMatch == matchLen)
                return true;
            colMatch = (board[j][i] == symbol) ? colMatch + 1 : 0;
            if (colMatch == matchLen)
                return true;
        }
    }
    return false;
}
function checkDiagonals(board, symbol, matchLen) {
    var boardSize = board.length;
    for (var i = 0; i <= boardSize - matchLen; ++i) {
        for (var j = 0; j <= boardSize - matchLen; ++j) {
            var mainDiagMatch = true;
            var antiDiagMatch = true;
            for (var k = 0; k < matchLen; ++k) {
                if (board[i + k][j + k] != symbol) {
                    mainDiagMatch = false;
                }
                if (board[i + k][j + matchLen - k - 1] != symbol) {
                    antiDiagMatch = false;
                }
                if (!mainDiagMatch && !antiDiagMatch)
                    break;
            }
            if (mainDiagMatch || antiDiagMatch)
                return true;
        }
    }
    return false;
}
function countEmpty(board) {
    var zeroCount = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) {
                zeroCount++;
            }
        }
    }
    return zeroCount;
}
function checkDraw(board, symbol) {
    return countEmpty(board) == Math.pow(board.length, 2);
}
var TicTacToe = /** @class */ (function () {
    function TicTacToe(_a) {
        var _b = _a.boardSize, boardSize = _b === void 0 ? exports.MIN_BOARD_SIZE : _b, _c = _a.matchLength, matchLength = _c === void 0 ? exports.MIN_BOARD_SIZE : _c;
        this._emptySymbol = 0;
        this._xSymbol = 1;
        this._oSymbol = -1;
        if (boardSize < exports.MIN_BOARD_SIZE || matchLength < exports.MIN_BOARD_SIZE || boardSize < matchLength) {
            throw new Error("Invalid board size/match length");
        }
        this._board = fillBoard(boardSize, this._emptySymbol);
        this._boardSize = boardSize;
        this._matchLength = matchLength;
        this._turn = 'X';
    }
    ;
    TicTacToe.prototype._makeMove = function (_a) {
        var x = _a.x, y = _a.y;
        this._board[y][x] = this._turn == 'X' ? this._xSymbol : this._oSymbol;
        this._turn = this._turn == 'X' ? 'O' : 'X';
    };
    TicTacToe.prototype._undoMove = function (_a) {
        var x = _a.x, y = _a.y;
        this._board[y][x] = 0;
        this._turn = this._turn == 'X' ? 'O' : 'X';
    };
    TicTacToe.prototype._checkMatch = function (side) {
        var symbol = side == 'X' ? this._xSymbol : this._oSymbol;
        return checkLines(this._board, symbol, this._matchLength) ||
            checkDiagonals(this._board, symbol, this._matchLength);
    };
    TicTacToe.prototype._checkDraw = function () {
        return checkDraw(this._board, this._emptySymbol) && !(this._checkMatch(this._turn));
    };
    TicTacToe.prototype._moves = function (_a) {
        var _b = _a.legal, legal = _b === void 0 ? true : _b;
        var opponent = this._turn == 'X' ? 'O' : 'X';
        var moves = new Array();
        for (var i = 0; i < this._board.length; i++) {
            for (var j = 0; j < this._board[i].length; j++) {
                if (this._board[i][j] === 0)
                    moves.push({ x: j, y: i });
            }
        }
        if (!legal)
            return moves;
        var legalMoves = new Array();
        for (var i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._checkMatch(opponent))
                legalMoves.push(moves[i]);
            this._undoMove(moves[i]);
        }
        return legalMoves;
    };
    TicTacToe.prototype.perft = function (depth) {
        if (depth > Math.pow(this._boardSize, 2))
            depth = Math.pow(this._boardSize, 2);
        if (depth == 0)
            return 1;
        var opponent = this._turn == 'X' ? 'O' : 'X';
        var moves = this._moves({ legal: false });
        var nodes = 0;
        for (var i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._checkMatch(opponent))
                nodes += this.perft(depth - 1);
            this._undoMove(moves[i]);
        }
        return nodes;
    };
    TicTacToe.prototype.isGameOver = function () {
        return this._checkDraw() || this._checkMatch(this._turn);
    };
    TicTacToe.prototype.isDraw = function () {
        return this._checkDraw();
    };
    TicTacToe.prototype.winner = function () {
        if (this._checkMatch('X'))
            return "X";
        if (this._checkMatch('O'))
            return "O";
        return undefined;
    };
    TicTacToe.prototype.move = function (_a) {
        var x = _a.x, y = _a.y;
        var opponent = this._turn == 'X' ? 'O' : 'X';
        if (!this._checkMatch(opponent))
            this._makeMove({ x: x, y: y });
        else
            throw new Error("Invalid move");
    };
    TicTacToe.prototype.turn = function () {
        return this._turn;
    };
    TicTacToe.prototype.board = function () {
        return this._board;
    };
    return TicTacToe;
}());
exports.TicTacToe = TicTacToe;
;
