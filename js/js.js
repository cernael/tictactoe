$(function(){

	var size;

	var winCombos = [[1, 0, 0, 1, 0, 0, 1, 0], // Square-by-square win combo participation,
					 [0, 1, 0, 1, 0, 0, 0, 0], // ordered by [H1, H2, H3, V1, V2, V3, D1, D2].
					 [0, 0, 1, 1, 0, 0, 0, 1],
					 [1, 0, 0, 0, 1, 0, 0, 0], // Squares are ordered in the following matrix
					 [0, 1, 0, 0, 1, 0, 1, 1], // (as denoted by index in the winCombo array)
					 [0, 0, 1, 0, 1, 0, 0, 0],
					 [1, 0, 0, 0, 0, 1, 0, 1], //  [0, 1, 2,
					 [0, 1, 0, 0, 0, 1, 0, 0], //   3, 4, 5,
					 [0, 0, 1, 0, 0, 1, 1, 0]];//   6, 7, 8]

	var gameState = {
		'currentPlayer': 0, // Use as index of players array
		'players': [],
		'depth': 0,
		'board': null
	};

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
		gameState.board = new Board(1);
		gameState.players[0] = new Player(); // !!! in-params, fix in accordance with class
		gameState.players[1] = new Player();
		$('#game').html('');
	});
	$('#pve').click(function(){
		// Skapa board(depth 1), skapa spelare + AI, starta spelet
		gameState.board = new Board(1);
		gameState.players[0]( new Player() ); // !!! in-params, fix in accordance with class
		gameState.players[1]( new AI() );
		$('#game').html('');
	});
	$('#upvp').click(function(){
		// Skapa board(depth 2), skapa två spelare, starta spelet
		gameState.board = new Board(2);
		gameState.players[0]( new Player() ); // !!! in-params, fix in accordance with class
		gameState.players[1]( new Player() );
		$('#game').html('');
	});

	function setSize(){
		if($(window).width() - $(window).height() >= 150){
			// Set sidebar layout
			size = Math.min($(window).height(),
								 $(window).width()-200);
			$('.controls').css({'width': '200px',
								'height': '100%'});
			$('.button').css('width', '100%');
		}
		else{
			// Set banner layout
			size = Math.min($(window).height()-50,
								 $(window).width() );
			$('.controls').css({'width': '100%',
								'height': '50px'});
			$('.button').css('width', ($(window).width() - 200)/3);
		}
		$('.game').css({'width': size,
						'height': size}); // Is this really what I want?
	};

	var Marker = Object.createClass({
		_class: "Marker",
		owner: null,
		html: '<div class="marker"/>',

		init: function(pos, parent) {
			this.pos = pos;
			this.parent = parent;
			this.parentEl = this.parent.DOMel;
			this.claim();
			this.DOMel = $(this.html).appendTo(this.parentEl);

		},

		css: function(x,y){
			this.DOMel.css(x,y);
		},

		claim: function(){

			$(this).click(function(){
				$(this).css('background-color', 
					gameState.players[gameState.currentPlayer].colour);
				this.owner = currentPlayer;
				this.parent.markProgress(this.pos);
			});
		}
	})

	var Board = Object.createClass({
		_class: "Board",
		_extends: Marker,
		boardProgress: [0, 0, 0, 0, 0, 0, 0, 0],
		nodes: [],


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
			if(this.depth > 1){
				for (var i = 0; i < 9; i++) {
					this.nodes.push(new Board((this.depth-1), i, this) );
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

			var me = $('<table/>');
			for(var i = 0; i < 3; i++){
				var tr = $('<tr/>');
				for (var j = 0; j < 3; j++) {
					$('<td/>').append(this.nodes[i * 3 + j]).appendTo(tr);
				};
				tr.appendTo(me);
			};
			console.log(this.parentEl.children().length)
			console.log(me, 'hi', this.parentEl)
			
			me.appendTo(this.parentEl);
				console.log(this.parentEl.children().length)

			throw("Enough!") // Varihelvete tar jag bort allt från #game igen?!
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
		// Shit, behöver AI-funktionen att AI-klassen ärver en move-metod från Player?
		// I så fall måste jag nog ha dubbla click handlers ändå.
		//	$('.cell').index(8).click()
	});

});