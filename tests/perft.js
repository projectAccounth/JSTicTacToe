const { TicTacToe } = require("@not_thefirst/jstictactoe");

let game = new TicTacToe({boardSize: 5, matchLength: 5});

for (let i = 0; i <= 5; i++) {
	let startTime = new Date();
	let nds = game.perft(i);
	let endTime = new Date();
    let timeDiff = endTime - startTime;
	console.log(`depth ${i} time ${timeDiff} nodes ${nds} nps ${Math.floor(nds / (timeDiff) * 1000)}`);
}