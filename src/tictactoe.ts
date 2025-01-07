export const MIN_BOARD_SIZE = 3;

export type Side = 'X' | 'O';

export function fillBoard(boardSize: number, symbol: number): number[][] {
    let output: number[][] = new Array(boardSize);
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            output[i][j] = symbol;
        }
    }
    return output;
}

function checkLines(board: number[][], symbol: number, matchLen: number): boolean {
    const boardSize = board.length;
    for (let i = 0; i < boardSize; ++i) {
        let rowMatch = 0;
        let colMatch = 0;
        for (let j = 0; j < boardSize; ++j) {
            rowMatch = (board[i][j] == symbol) ? rowMatch + 1 : 0;
            if (rowMatch == matchLen) return true;

            colMatch = (board[j][i] == symbol) ? colMatch + 1 : 0;
            if (colMatch == matchLen) return true;
        }
    }
    return false;
}
function checkDiagonals(board: number[][], symbol: number, matchLen: number): boolean {
    const boardSize = board.length;
    for (let i = 0; i <= boardSize - matchLen; ++i) {
        for (let j = 0; j <= boardSize - matchLen; ++j) {
            let mainDiagMatch = true;
            let antiDiagMatch = true;

            for (let k = 0; k < matchLen; ++k) {
                if (board[i + k][j + k] != symbol) {
                    mainDiagMatch = false;
                }

                if (board[i + k][j + matchLen - k - 1] != symbol) {
                    antiDiagMatch = false;
                }
                if (!mainDiagMatch && !antiDiagMatch) break;
            }

            if (mainDiagMatch || antiDiagMatch) return true;
        }
    }
    return false;
}

function countEmpty(board: number[][]): number {
    let zeroCount = 0;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) {
                zeroCount++;
            }
        }
    }

    return zeroCount;
}

function checkDraw(board: number[][], symbol: number): boolean {
    return countEmpty(board) == board.length ** 2;
}

export class TicTacToe {
    private _board: number[][];
    private _boardSize: number;
    private _matchLength: number;
    private _emptySymbol: number = 0;
    private _xSymbol = 1;
    private _oSymbol = -1;
    private _turn: Side;

    constructor(
        {boardSize = MIN_BOARD_SIZE, matchLength = MIN_BOARD_SIZE}
        : {boardSize: number, matchLength: number}) {
        
        if (boardSize < MIN_BOARD_SIZE || matchLength < MIN_BOARD_SIZE || boardSize < matchLength) {
            throw new Error("Invalid board size/match length");
        }
        
        this._board = fillBoard(boardSize, this._emptySymbol);
        this._boardSize = boardSize;
        this._matchLength = matchLength;
        this._turn = 'X';
    };

    private _makeMove({x, y}: {x: number, y: number}) {
        this._board[y][x] = this._turn == 'X' ? this._xSymbol : this._oSymbol;
        this._turn = this._turn == 'X' ? 'O' : 'X';
    }

    private _undoMove({x, y}: {x: number, y: number}) {
        this._board[y][x] = 0;
        this._turn = this._turn == 'X' ? 'O' : 'X';
    }

    private _checkMatch(side: Side) {
        let symbol = side == 'X' ? this._xSymbol : this._oSymbol;
        return checkLines(this._board, symbol, this._matchLength) ||
               checkDiagonals(this._board, symbol, this._matchLength)
    }

    private _checkDraw() {
        return checkDraw(this._board, this._emptySymbol) && !(this._checkMatch(this._turn));
    }

    private _moves({legal = true}: {legal: boolean}) {
        let opponent: Side = this._turn == 'X' ? 'O' : 'X';
        let moves = new Array();
        
        for (let i = 0; i < this._board.length; i++) {
            for (let j = 0; j < this._board[i].length; j++) {
                if (this._board[i][j] === 0) moves.push({x: j, y: i});
            }
        }
        if (!legal) return moves;
        let legalMoves = new Array();

        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._checkMatch(opponent)) legalMoves.push(moves[i]);
            this._undoMove(moves[i]);
        }
        return legalMoves;
    }

    perft(depth: number): number {
        if (depth > this._boardSize ** 2)
            depth = this._boardSize ** 2;
        if (depth == 0) return 1;
        let opponent: Side = this._turn == 'X' ? 'O' : 'X';
        let moves = this._moves({legal: false});
        let nodes = 0;

        for (let i = 0, len = moves.length; i < len; i++) {
            this._makeMove(moves[i]);
            if (!this._checkMatch(opponent)) nodes += this.perft(depth - 1);
            this._undoMove(moves[i]);
        }
        return nodes;
    }

    isGameOver() {
        return this._checkDraw() || this._checkMatch(this._turn);
    }

    move({x, y}: {x: number, y: number}) {
        this._makeMove({x: x, y: y});
    }

    turn() {
        return this._turn;
    }

    board() {
        return this._board;
    }
};