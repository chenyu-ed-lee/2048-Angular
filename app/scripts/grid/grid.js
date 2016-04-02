'use strict';

angular.module('Grid', [])
	.factory('TileModel', function() {
	  var Tile = function(pos, val) {
	    this.x = pos.x;
	    this.y = pos.y;
	    this.value = val || 2;
	  };
	  
	  Tile.prototype.updatePosition = function(newPos) {
	  	this.x = newPos.x;
	  	this.y = newPos.y;
	  };

	  return Tile;
	})
	.service("GridService", function(TileModel) {
		this.startingTileNumber = 2;

		this.grid = [];
		this.tiles = [];
		this.tiles.push(new TileModel({x: 1, y: 1}, 2));
		this.tiles.push(new TileModel({x: 1, y: 2}, 2));
		var service = this;
		this.size = 4;
		this.buildEmptyGameBoard = function() {
		    var self = this;
		    // Initialize our grid
		    for (var x = 0; x < service.size * service.size; x++) {
		      this.grid[x] = null;
		    }
	 
	    // Initialize our tile array
	    // with a bunch of null objects
		    this.forEach(function(x,y) {
		      self.setCellAt({x:x,y:y}, null);
		    });
		};
		this.buildStartingPosition = function() {
			for (var x = 0; x < this.startingTileNumber; x++) {
				this.randomlyInsertNewTile();
			}
		};
		// run a method for each element in the tiles array
		this.forEach = function(cb) {
			var totalSize = this.size * this.size;
			for (var i = 0; i < totalSize; i++) {
				var pos = this._positionToCoordinates(i);
				cb(pos.x, pos.y, this.tiles[i]);
			}
		};
		//set a cell at a position
		this.setCellAt = function(pos, tile) {
			if(this.withinGrid(pos)) {
				var xPos = this._coordinatesToPosition(pos);
				this.tiles[xPos] = tile;
			}
		};
		//fetch a cell at given position
		this.getCellAt = function(pos) {
			if(this.withinGrid(pos)) {
				var x = this._coordinatesToPosition(pos);
				return this.tiles[x];
			} else {
				return null;
			}
		};
		//a helper function to determine if a position is within the boundaries of the grid
		this.withinGrid = function(cell) {
			return cell.x >= 0 && cell.x < this.size && cell.y >= 0 && cell.y < this.size;
		};
		//helper to convert x to x,y 
		this._positionToCoordinates = function(i) {
			var x = i % service.size,
			y = (i - x) / service.size;
			return {
				x: x,
				y: y
			};
		};
		//helper to convert coordinates to position
		this._coordinatesToPosition = function(pos) {
			return (pos.y * service.size) + pos.x;
		};
		//get all the available tiles
		this.availableCells = function() {
			var cells = [];
			var self = this;
			this.forEach(function(x,y) {
				var foundTile = self.getCellAt({x:x, y:y});
				if(!foundTile) {
					cells.push({x:x, y:y});
				}
			});
			return cells;
		};
		//
		this.randomAvailableCell = function() {
			var cells = this.availableCells();
			if(cells.length > 0) {
				return cells[Math.floor(Math.random() * cells.length)];
			}
		};
		//
		this.randomlyInsertNewTile = function() {
			var cell = this.randomAvailableCell(),
			tile = new TileModel(cell, 2);
			this.insertTile(tile);
		};
		//add a tile to the tiles array
		this.insertTile = function(tile) {
			var pos = this._coordinatesToPosition(tile);
			this.tiles[pos] = tile;
		};
		//remove a tile  from tiles array
		this.removeTile = function(tile) {
			var pos = this._coordinatesToPosition(tile);
			delete this.tiles[pos];
		};
		var vectors = {
		  'left': { x: -1, y: 0 },
		  'right': { x: 1, y: 0 },
		  'up': { x: 0, y: -1 },
		  'down': { x: 0, y: 1 }
		};
		this.traversalDirections = function(key) {
		    var vector = vectors[key];
		    var positions = {x: [], y: []};
		    for (var x = 0; x < this.size; x++) {
		      positions.x.push(x);
		      positions.y.push(x);
		    }
		    // Reorder if we're going right
		    if (vector.x > 0) {
		      positions.x = positions.x.reverse();
		    }
		    // Reorder the y positions if we're going down
		    if (vector.y > 0) {
		      positions.y = positions.y.reverse();
		    }
		    return positions;
		};
		this.calculateNextPosition = function(cell, key) {
			var vector = vectors[key];
			var previous;
			do {
				previous = cell;
				cell = {
					x: previous.x + vector.x,
					y: previous.y + vector.y
				};
			} while (this.withinGrid(cell) && this.cellAvailable(cell));
			return {
				newPosition: previous,
				next: this.getCellAt(cell)
			};
		};
		this.moveTile = function(tile, newPosition) {
			var oldPos = {
				x: tile.x, y: tile.y
			};
			//update array location
			this.setCellAt(oldPos, null);
			this.setCellAt(newPosition, tile);
			//upate tile model
			tile.updatePosition(newPosition);
		};
		this.newTile = function(pos, value) {
			return new TileModel(pos, value);
		};
		this.prepareTiles = function() {
			this.forEach(function(x,y,tile) {
				if(tile) {
					tile.reset();
				}
			});
		};
	});