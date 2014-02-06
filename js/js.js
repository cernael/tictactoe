$(function(){
	var Game = Object.createClass({
		_class: "Game",
		init: function(){
			// Create board outline and game-type change buttons
			$('<div class="controls"/>').
				append('<div class="logo"/>').
				append('<button type="button" id="pvp">Normal 2-player game</button>').
				append('<button type="button" id="pve" disabled>Normal 1-player game</button>').
				append('<button type="button" id="upvp" disabled>Ultimate 2-player game</button>').
				appendTo('body');

			//instigate click handlers to create relevant Board objects
			$('pvp').click();
			$('pve').click();
			$('upvp').click();
		}

	});

	var Board = Object.createClass({
		_class: "Board",
		init: function (depth) {
			this.depth = depth;
		}
	})
	new Game;
});