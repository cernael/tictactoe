$(function(){

	var size;

	var winCombos = [[1, 0, 0, 1, 0, 0, 1, 0], // Square-by-square win combo participation,
					 [0, 1, 0, 1, 0, 0, 0, 0], // ordered by [H1, H2, H3, V1, V2, V3, D1, D2].
					 [0, 0, 1, 1, 0, 0, 0, 1],
					 [1, 0, 0, 0, 1, 0, 0, 0],
					 [0, 1, 0, 0, 1, 0, 1, 1],
					 [0, 0, 1, 0, 1, 0, 0, 0],
					 [1, 0, 0, 0, 0, 1, 0, 1],
					 [0, 1, 0, 0, 0, 1, 0, 0],
					 [0, 0, 1, 0, 0, 1, 1, 0]];

	var gameState = {
		'currentPlayer': null,
		'players': [],
		'board': null
	};

	// Create board outline and game-type change buttons
	$('<div class="controls"/>').
		append('<div class="logo">&nbsp;</div>').
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
		alert('hej');
	});
	$('#pve').click(function(){
		// Skapa board(depth 1), skapa spelare + AI, starta spelet
		$('#game').html('');
	});
	$('#upvp').click(function(){
		// Skapa board(depth 2), skapa två spelare, starta spelet
		$('#game').html('');
	});

	function setSize(){
		if($(window).width() - $(window).height() >= 150){
			size = Math.min($(window).height(),
								 $(window).width()-200);
			$('.controls').css({'width': '200px',
								'height': '100%'});
			$('.controls > *').css({'display': 'block',
									'width': '100%'});
		}
		else{				
			size = Math.min($(window).height()-50,
								 $(window).width() );
			$('.controls').css({'width': '100%',
								'height': '50px'});
			$('.controls > *').css({'display': 'inline-block',
									'width': ($(window).width() - 200)/3});
		}
		$('.game').css({'width': size,
						'height': size});
	};

	var Marker = Object.createClass({
		_class: "Marker",
		owner: null,
		html: '<div class="marker"/>',

		init: function(pos, parent) {
			this.pos = pos;
			this.parent = parent;
			this.parentEl = this.parent.DOMel;
			this.addToDOM();
		},

		addToDOM: function(){
			this.DOMel = $(this.html).appendTo(this.parentEl);
		},

		css: function(x,y){
			this.DOMel.css(x,y);
  },
	})

	var Board = Object.createClass({
		_class: "Board",
		_extends: Marker,
		boardProgress: [0, 0, 0, 0, 0, 0, 0, 0],
		squares: [],

		init: function (depth, pos, parent) {
			this.depth = depth;
			this._super(pos, parent);

		}
	});

	var Player = Object.createClass({
		_class: "Player",
		init: function(colour, value){
			this.colour = colour;
			this.value = value;
		},

		move: 
	});

	var AI = Object.createClass({
		_class: "AI",
		_extends: Player,
		init: function(colour, value){
			this.colour = colour;
			this.value = value;
		},

	});

});