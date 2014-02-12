var size;

var winCombos = [[1, 0, 0, 1, 0, 0, 1, 0], // Square-by-square win combo participation,
				 [0, 0, 1, 1, 0, 0, 0, 1],
				 [0, 1, 0, 1, 0, 0, 0, 0], // ordered by [H1, H2, H3, V1, V2, V3, D1, D2].
				 [1, 0, 0, 0, 1, 0, 0, 0], // Squares are ordered in the following matrix
				 [0, 1, 0, 0, 1, 0, 1, 1], // (as denoted by index in the winCombo array)
				 [0, 0, 1, 0, 1, 0, 0, 0],
				 [1, 0, 0, 0, 0, 1, 0, 1], //  [0, 1, 2,
				 [0, 1, 0, 0, 0, 1, 0, 0], //   3, 4, 5,
				 [0, 0, 1, 0, 0, 1, 1, 0]];//   6, 7, 8]

var gameState = {
	'currentPlayer': 0, // Use as index of players array
	'players': [],
	'sizeInCells': 0,
	'board': null
};

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
		gameState.board = new Board(1);
		gameState.players[0] = new Player('#f00', 1); // !!! in-params, fix in accordance with class
		gameState.players[1] = new Player('#0ff', -1);
		gameState.sizeInCells = 3;
		setSize();
		});
	$('#pve').click(function(){
		// Skapa board(depth 1), skapa spelare + AI, starta spelet
		$('#game').html('');
		gameState.board = new Board(1);
		gameState.players[0] = new Player('#f00', 1); // !!! in-params, fix in accordance with class
		gameState.players[1] = new AI('#0ff', -1);
		gameState.sizeInCells = 3;
		setSize();
	});
	$('#upvp').click(function(){
		// Skapa board(depth 2), skapa två spelare, starta spelet
		$('#game').html('');
		gameState.board = new Board(2);
		gameState.players[0] = new Player('#f00', 1); // !!! in-params, fix in accordance with class
		gameState.players[1] = new Player('#0ff', -1);
		gameState.sizeInCells = 9;
		setSize();
	});
});

function setSize(){
	if($(window).width() - $(window).height() >= 150){
		// Set sidebar layout
		size = Math.min($(window).height(),
							 $(window).width()-200);
		$('.controls').css({'width': '200px',
							'height': '100%'});
		$('.button').css('width', '100%');
		$('.main').css({'top': '0',
						'left': '200px'})
	}
	else{
		// Set banner layout
		size = Math.min($(window).height()-50,
							 $(window).width() );
		$('.controls').css({'width': '100%',
							'height': '50px'});
		$('.button').css('width', ($(window).width() - 200)/3);
		$('.main').css({'top': '50px',
						'left': '0'})
	}
	var markerSize = size * 0.6 / gameState.sizeInCells
	$('.marker').css({'width': markerSize,
					'height': markerSize,
					'margin': size * 0.01,
					'border': '1px solid #fff',
					'-webkit-border-radius': markerSize/2,
					'-moz-border-radius': markerSize/2,
					'border-radius': markerSize/2
				}); 
	$('table').css('margin', size * 0.025);
	//$('.cell').css('padding', size * 0.01);
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

		this.DOMel.click(function(){
			$(this).css('background-color', 
				gameState.players[gameState.currentPlayer].colour);
			this.owner = gameState.players[gameState.currentPlayer];
			console.log(gameState); //
			this.parent.markProgress(this.pos);
			
		});
	}
})

var Board = Object.createClass({
	_class: "Board",
	_extends: Marker,
	boardProgress: [0, 0, 0, 0, 0, 0, 0, 0],
	nodes: [],
	html: '<table/>',


	init: function (depth, pos, parent) {
		this.depth = depth;
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
				this.nodes.push(new Marker(i, this.DOMel) );
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
				console.log(this.nodes[i*3+j])
			};
			tr.appendTo(tb);
		};
		tb.appendTo(this.parentEl);

	},

	markProgress: function(pos){
		// To be called from nodes, when they become owned
		var me = this.boardProgress;
		for(var i = 0; i < me.length; i++){
			//Something here !!!
		};
	}
});

var Player = Object.createClass({
	_class: "Player",
	init: function(colour, value){
		this.colour = colour;
		this.value = value;
	},


});

var AI = Object.createClass({
	_class: "AI",
	_extends: Player,
	init: function(colour, value){
		this.colour = colour;
		this.value = value;
	}
	//
	//	$('.marker').index(8).click()
});

