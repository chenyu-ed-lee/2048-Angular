'use strict';

angular.module("Game", ['Grid', 'ngCookies'])
	.service('GameManager', function(GridService) {
		// makes a new game
		this.newGame = function() {
			GridService.buildEmptyGameBoard();
			GridService.buildStartingPosition();
			this.reinit();
		};	
		this.reinit = function() {
			this.gameOver = false;
			this.win = false;
			this.currentScore = 0;
			this.highScore = 0; 
		};
		this.move = function(key) {
			var self = this;
			if(self.win) {return false;}
			var positions = GridService.traversalDirections(key);

			GridService.prepareTiles();

			positions.x.forEach(function(x) {
				positions.y.forEach(function(y) {
					var originalPosition = {x:x,y:y};
					var tile = GridService.getCellAt(originalPosition);
					if (tile) {
						var cell = GridService.calculateNextPosition(tile, key);
						next = cell.next;
						if (next && next.value === tile.value && !next.merged) {
							// handle merge
							var newValue = tile.value * 2;
							// create a new tile
							var mergedTile =  GridService.newTile(tile, newValue);
							mergedTile.merged = [tile, cell.next];
							//insert the new tile
							GridService.insertTile(mergedTile);
							// Remove the old tile
							GridService.removeTile(tile);
							// Move the location of the mergedTile into the next position
							GridService.moveTile(merged, next);
							// Update the score of the game
							self.updateScore(self.currentScore + newValue);
							// Check for the winning value
							if (merged.value >= self.winningValue) {
							  hasWon = true;
							}
							hasMoved = true;
						} else {
							//handle moving tile
							GridService.moveTile(tile, cell.newPosition);
						}
						if(!GridService.samePositions(originalPos, cell.newPosition)) {
							hasMoved = true;
						}
						if(hasMoved) {
							GridService.randomlyInsertNewTile();
							if(self.win || !self.movesAvailable()) {
								self.gameOver = true;
							}
						}
					}
				});
			});
		};
		// handles the move action
		this.move = function() {};
		// updates the score
		this.updateScore = function(newScore) {
			this.currentScore = newScore;
			if(this.currentScore > this.getHighScore()) {
				this.highScore = newScore;
				$cookieStore.put('highScore', newScore);
			}
		};
		// are there moves left?
		this.movesAvailable = function() {
			return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
		};
		this.getHighScore = function() {
			return parseInt($cookieStore.get('highScore')) || 0;
		}
	});