var size;

var winCombos = [[1, 0, 0, 1, 0, 0, 1, 0], // Square-by-square win combo participation,
				 [1, 0, 0, 0, 1, 0, 0, 0], // ordered by [H1, H2, H3, V1, V2, V3, D1, D2].
				 [1, 0, 0, 0, 0, 1, 0, 1],
				 [0, 1, 0, 1, 0, 0, 0, 0], // Squares are ordered in the following matrix
				 [0, 1, 0, 0, 1, 0, 1, 1], // (as denoted by index in the winCombo array)
				 [0, 1, 0, 0, 0, 1, 0, 0],
				 [0, 0, 1, 1, 0, 0, 0, 1], // [[0, 1, 2],
				 [0, 0, 1, 0, 1, 0, 0, 0], //  [3, 4, 5],
				 [0, 0, 1, 0, 0, 1, 1, 0] //  [6, 7, 8]]
];

var gameState = {
	'currentPlayer': 0, // Use as index of players array
	'nestDepth': 0,
	'board': [],
	'gameType': ''
};

var players = [];

var board;

$(function(){
	// Create board outline and game-type change buttons
	$('<div class="controls"/>').
		append('<div class="logo">PRETEND LOGO</div>').
		append('<div class="button" id="pvp">Normal game</div>').
		append('<div class="button" id="pve">AI game</div>').
		append('<div class="button" id="upvp">Ultimate game</div>').
		appendTo('body');

	$('<div class="main"/>').
		append('<div id="game"/>').
		appendTo('body');

	setSize();

	$(window).resize(setSize);

	// Instigate click handlers to create relevant Board objects
	$('#pvp').click(function(){
		// Skapa board(depth 1), skapa två spelare, starta spelet
		$('#game').html('');
		gameState.currentPlayer = 0;
		gameState.nestDepth = 1;
		gameState.board = new Array(9);
		gameState.gameType = 'pvp';
		board = new Board();
		setupPlayers(false);
		setSize();
		});
	$('#pve').click(function(){
		// Skapa board(depth 1), skapa spelare + AI, starta spelet
		$('#game').html('');
		gameState.currentPlayer = 0;
		gameState.nestDepth = 1;
		gameState.board = new Array(9);
		gameState.gameType = 'pve'
		board = new Board();
		setupPlayers(true);
		setSize();
	});
	$('#upvp').click(function(){
		// Skapa board(depth 2), skapa två spelare, starta spelet
		$('#game').html('');
		gameState.nestDepth = 2;
		gameState.currentPlayer = 0;
		gameState.board = new Array(9);
		for(var i=0; i < 9; i++){
			gameState.board[i] = new Array(9);
		};
		gameState.gameType = 'upvp';
		board = new Board();
		setupPlayers(false);
		setSize();
	});
});

function setupPlayers(aiGame){
	if(aiGame){
		players[0] = new Player('#f00', 1, 'Player'); 
		players[1] = new AI('#00f', -1, 'The computer');
	}
	else{
		players[0] = new Player('#f00', 1, 'Player 1'); 
		players[1] = new Player('#00f', -1, 'Player 2');
	}
}

function setSize(){
	if($(window).width() - $(window).height() >= 150){
		// Find size
		size = Math.min($(window).height(),
							 $(window).width()-200);
		// Set sidebar layout
		$('.controls').css({'width': '200px',
							'height': '100%'});
		$('.button').css('width', '100%');
		$('.main').css({'top': '0',
						'left': '200px'})
	}
	else{
		// Find size
		size = Math.min($(window).height()-50,
							 $(window).width() );
		// Set banner layout
		$('.controls').css({'width': '100%',
							'height': '50px'});
		$('.button').css('width', ($(window).width() - 200)/3);
		$('.main').css({'top': '50px',
						'left': '0'})
	}

	// Old way, bad way, bottom-up from markers
	var markerSize = size * 0.6 / (Math.pow(3, gameState.nestDepth));
	$('.marker').css({'width': markerSize,
					'height': markerSize,
					'margin': size * 0.01,
					'border': '1px solid #fff',
					'-webkit-border-radius': markerSize/2,
					'-moz-border-radius': markerSize/2,
					'border-radius': markerSize/2
					}); 
	$('table').css('margin', size * 0.025);

	// New way, better way?, top-down from #game
	if(board){
		board.setSize(size);
	}
};

var Marker = Object.createClass({
	_class: "Marker",
	owner: null,
	html: '<div class="marker"/>',

	init: function(pos, parent) {
		this.pos = pos;
		this.parent = parent;
		this.parentEl = this.parent.DOMel;
		this.DOMel = $(this.html);
		this.claim();
	},

	css: function(x,y){
		this.DOMel.css(x,y);
	},

	claim: function(){
		var me = this;
		me.DOMel.bind('click', function(){
			if(me.owner){return};
			$(this).css('background-color', 
				players[gameState.currentPlayer].colour);
			me.owner = players[gameState.currentPlayer];
			console.log(gameState); // Prins JSON to console, as per instructions
			me.parent.markProgress(me.pos);
			console.log(gameState.board);
			gameState.currentPlayer = gameState.currentPlayer ? 0 : 1;
			players[gameState.currentPlayer].startTurn();
		});
	},

	setSize: function(size){
		jgjgjgjg
	}
})

var Board = Object.createClass({
	_class: "Board",
	_extends: Marker,
	boardProgress: [0, 0, 0, 0, 0, 0, 0, 0],
	nodes: [],
	html: '<table/>',


	init: function (depth, pos, parent) {
		this.depth = depth || gameState.nestDepth;
		this.pos = pos;

		if(parent){
			this.parent = parent;
			this.parentEl = this.parent.DOMel;
		}
		else{
			this.parentEl = $('#game');
		}
		this.DOMel = $(this.html);
		if(this.depth > 1){
			for (var i = 0; i < 9; i++) {
				this.nodes.push(new Board((this.depth-1), i, this.DOMel) );
			};
		}
		else{
			for (var i = 0; i < 9; i++) {
				this.nodes.push(new Marker(i, this) );
			};
		}
		this.addToDOM();

	},

	addToDOM: function(){

		var tb = this.DOMel;
		for(var i = 0; i < 3; i++){
			var tr = $('<tr/>');
			for (var j = 0; j < 3; j++) {
				var div = $('<div class="cell"/>').append(this.nodes[i * 3 + j].DOMel);
				$('<td/>').append(div).appendTo(tr);
			};
			tr.appendTo(tb);
		};
		tb.appendTo(this.parentEl);

	},

	setSize: function(size){
		var nodeSize = size/3; // subtract for padding and margin and stuff too
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].setSize(nodeSize)
;		};
	},

	markProgress: function(pos){
		// To be called from nodes, when they become owned
		var me = this.boardProgress;
		for(var i = 0; i < me.length; i++){
			me[i] += winCombos[pos][i] * players[gameState.currentPlayer].value;
		};
		if(this.checkForWin()){
			
			alert(players[gameState.currentPlayer].name + ' wins!');
			for(var i = 0; i < this.nodes.length; i++){
				this.nodes[i].DOMel.unbind('click');
			};
		};
		
	},
	checkForWin: function() {
		var winValue = 3 * players[gameState.currentPlayer].value;
		return this.boardProgress.indexOf(winValue) >= 0;
	}
});

var Player = Object.createClass({
	_class: "Player",
	init: function(colour, value, name){
		this.colour = colour;
		this.value = value;
		this.name = name;
	},
	startTurn: function(){
		
	}
});

var AI = Object.createClass({
	_class: "AI",
	_extends: Player,
	init: function(colour, value, name){
		this.colour = colour;
		this.value = value;
		this.name = name;
	},
	startTurn: function(){
		$('.marker')[8].click();
	}
});

function restoreGameState (json){
	gameState = json;
	// something or other
};

/*
// Vi skulle kunna uttrycka ett tic-tac-toe
// bräde som en tom array med 9 element
// (från början tomma men efterhand placerar
// vi ett "X" eller ett "O" i dem)
var board = new Array(9);
 
// Det finns åtta olika vinstmöjligheter
var winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // horisontella
  [0,3,6], [1,4,7], [2,5,8], // vertikala
  [0,4,8], [2,4,6] // diagonala
];
 
// Kolla efter en vinst
function checkForWin(){
  for(var i = 0; i < winningCombos.length;i++){
    var c = winningCombos[i];
    if(
      board[c[0]] &&
      board[c[0]] == board[c[1]] && 
      board[c[1]] == board[c[2]]
    ){
      return board[c[0]];
    }
  }
  return false;
}
 
// Kolla om brädet är fullt
function checkIfBoardFull(){
  for(var i = 0; i < board.length; i++){
    if(!board[i]){return false;}
  }
  return true;
}
 
// Kolla om det är oavgjort
function isDraw(){
  return checkIfBoardFull() && !checkForWin();
}
*/

/*	TODO:
	Bygg restoreGameState()
	Bygg AI-metod
	Ev. fixa upvp
	Fixa halvtransparents div'ar för att blockera bräden vid vinst eller delbrädeserövring
	Ev. göra setSize() till Board- och Marker-metod som anropas rekursivt
	Starta nytt spel och restoreGameState är ganska liknande funktioner. Faktorisera.
	Player.startTurn() ?
*/