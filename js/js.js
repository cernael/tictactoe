$(function(){
	var Game = Object.createClass({
		_class: "Game",
		currentPlayer: null,

		init: function(){
			// Create board outline and game-type change buttons
			$('<div class="controls"/>').
				append('<div class="logo"/>').
				append('<button type="button" id="pvp">Normal game</button>').
				append('<button type="button" id="pve" disabled>AI game</button>').
				append('<button type="button" id="upvp" disabled>Ultimate game</button>').
				appendTo('body');

			$('<div class="main"/>').
				append('<div id="game"/>').
				appendTo('body');


			// Instigate click handlers to create relevant Board objects
			$('#pvp').click(function(){
				// Skapa board(depth 0), skapa två spelare, starta spelet
				$('#game').html('');
			});
			$('#pve').click(function(){
				// Skapa board(depth 0), skapa spelare + AI, starta spelet
				$('#game').html('');
			});
			$('#upvp').click(function(){
				// Skapa board(depth 1), skapa två spelare, starta spelet
				$('#game').html('');
			});
		}

	});

	var Board = Object.createClass({
		_class: "Board",
		init: function (depth) {
			this.depth = depth;
		}
	});

	var Player = Object.createClass({
		_class: "Player",
		init: function(colour){
			this.colour = colour;
		}
	});

	var AI = Object.createClass({
		_class: "AI",
		_extends: Player,
		init: function() {
			// body...
		}
	});

	var Marker = Object.createClass({
		_class: "Marker",
		owner: null,
		init: function() {
			// body...
		}
	})

	var game = new Game;
});