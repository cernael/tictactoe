/*$(function(){
*/
	// Five-In-A-Row, Thomas Frank 2013

	var rows = 15, cols = 15, bot = "O", botMeetsBot = false;
	var turn, winCombos, board, boardMem, blinkColor;

	function main(){
		turn = "X";
		!board ? createBoard() : clearBoard();
		AI.blocksInput = false;
		bot == turn && AI();
	}

	function bye(){
		board.remove();
		alert("Thanks for playing!");
	};

	function createBoard(){
		var row, i, j;
		board = $('<table/>');
		for(i=0;i<rows;i++){
			row = $('<tr>').appendTo(board);
			for(j=0;j<cols;j++){
				$('<td/>').appendTo(row);
			}
		}
		var size = Math.min($(window).height()/(rows),
			$(window).width()/(cols));
		size = size * .8;
		board.find('td').css({
			border:"2px solid #000",width:size,
			height:size,fontSize:size/2,textAlign:"center",
			verticalAlign:"middle", cursor:"pointer"
		});
		$('body').append(board).css({margin:size/2});
		board.find('td').click(move);
		markWinningCombos();
	}

	function markWinningCombos(){
		var wco = 0, i, j;
		boardMem = [], winCombos = [];
		for(var i = 0; i < rows*cols; i++){
			boardMem[i] = [];
		}	
		for(i = 0; i < rows*cols; i++){
			// horizontal
			if(cols-i%cols > 4){
				winCombos[wco] = {pos:[],co:0};
				for(j = 0; j < 5; j++){
					boardMem[i+j].push(winCombos[wco]);
					winCombos[wco].pos.push(i+j);
				}
				wco++;
			}
			// vertical
			if(rows-Math.floor(i/cols) > 4){
				winCombos[wco] = {pos:[],co:0};
				for(j = 0; j < 5; j++){
					boardMem[i+j*cols].push(winCombos[wco]);
					winCombos[wco].pos.push(i+j*cols);
				}
				wco++;
			}
			// diagonal right
			if(cols-i%cols > 4 && rows-Math.floor(i/cols) > 4){
				winCombos[wco] = {pos:[],co:0};
				for(j = 0; j < 5; j++){
					boardMem[i+j+j*cols].push(winCombos[wco]);
					winCombos[wco].pos.push(i+j+j*cols);
				}
				wco++;
			}
			// diagonal left
			if(i%cols >= 4 && rows-Math.floor(i/cols) > 4){
				winCombos[wco] = {pos:[],co:0};
				for(j = 0; j < 5; j++){
					boardMem[i-j+j*cols].push(winCombos[wco]);
					winCombos[wco].pos.push(i-j+j*cols);
				}
				wco++;
			}
		}
	};

	function clearBoard(){
		markWinningCombos();
		board.find('td').text('').css({background:''}).removeClass('playerX playerO');
	}

	function move(){
		if(AI.blocksInput){return;}
		blinkColor = "#aaf";
		var me = $(this);
		if(me.text()){return;}
		me.text(turn).addClass("player" + turn);
		var pos = board.find('td').index(this);
		boardMem[pos].taken = true;
		for(var i=0;i<boardMem[pos].length;i++){
			boardMem[pos][i].co += turn == "X" ? 1 : -1;
		};
		var won = checkForWin();
		won ? (blinkColor = "#fff")
			: (bot == turn && blink(pos)) || (turn = turn == "X" ? "O" : "X");
		botMeetsBot && (bot = turn);
		bot == turn && !won && AI();
	}

	function checkForWin(){
		var toConfirm;
		for(var i = 0; i < winCombos.length; i++){
			if(winCombos[i].co > 4 || winCombos[i].co<-4){
				for(var j = 0; j < 5; j++){
					board.find('td').eq(winCombos[i].pos[j]).css({background:"#0A0"});
				}
				toConfirm = (winCombos[i].co > 0 ? "X" : "O") + " wins!\n\nPlay again?";
			}
		}
		if(board.find('.playerX, .playerO').length >= boardMem.length){
			toConfirm = "It's a draw!\n\nPlay again?";
		}
		if(toConfirm){
			AI.blocksInput = false;
			setTimeout(function(){confirm(toConfirm) ? main() : bye()},1000);
			return true;
		}
	}

	function AI(){
		AI.blocksInput = true;
		setTimeout(AI2,50);
	}

	function AI2(){
		var bestMove = false, bestMoveVal = -1, v;
		for(var i=0;i<boardMem.length;i++){
			v = AI.valueMove(i);
			if (v > bestMoveVal && v !== false){
				bestMoveVal = v;
				bestMove = i;
			}
		};
		AI.blocksInput = false;
		board.find('td').eq(bestMove).click();
	}

	AI.winValues = function(){
		var co = [];
		for(var i=0;i<winCombos.length;i++){
			co[i] = winCombos[i].co;
		}
		return co;
	};

	AI.valueMove = function(pos){
		if(boardMem[pos].taken){return false;}
		var add = bot == "X" ? 1 : -1, i, now, future;
		for(i=0;i<boardMem[pos].length;i++){
			boardMem[pos][i].co += add;
		};
		future = AI.winValues();
		for(i=0;i<boardMem[pos].length;i++){
			boardMem[pos][i].co -= add;
		};
		now = AI.winValues();
		var co = {};
		for(i=-5; i <= 5; i++){
			co[i] = (i < 0 ? -1 : 1) * (future.count(add*i) - now.count(add*i));
		};
		var ladder = [
			5, -4,
			co[-3] > 0 ? -3 : 4, co[-2] > 1 ? -2 : 3, co[-1] > 2 ? -1 : 2,
			co[-3] > 0 ? 4 : -3, co[-2] > 1 ? 3 : -2, co[-1] > 2 ? 2 : -1,
			1, 0, -5
		].reverse(), score = 0;

		for(i=0;i < ladder.length; i++){
			score += Math.pow(winCombos.length,i*5+1) * co[ladder[i]];
		}
		return score;
	}

	function blink(pos){
		var td = board.find('td').eq(pos);
		for(var i = 0; i < 4; i+=2){
			setTimeout(function(){td.css({background:blinkColor})},i*150);
			setTimeout(function(){td.css({background:"#fff"})},(i+1)*150);
		}
	}

	Array.prototype.count = function(value){
		var co = 0, i;
		for(i = 0; i < this.length; i++){
			co += this[i] == value;
		};
		return co;
	}

/*	main();
});*/ 