class Board{
	constructor(){
		this.before = [];
		this.current = [];
		this.toFill = [];
		// this.temp = [];?
	}
	initialize(){
		this.before = [
			[1,2,3,4,5,6,7,8,9],
			[4,5,6,7,8,9,1,2,3],
			[7,8,9,1,2,3,4,5,6],
			[2,3,4,5,6,7,8,9,1],
			[5,6,7,8,9,1,2,3,4],
			[8,9,1,2,3,4,5,6,7],
			[3,4,5,6,7,8,9,1,2],
			[6,7,8,9,1,2,3,4,5],
			[9,1,2,3,4,5,6,7,8]
		];
		this.current = [
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0]
		];

		for(let i = 0; i < 9; i++){
			for( let j = 0; j < 9; j++){
				this.toFill[i+"|"+j] = {x:j,y:i};
			}
		}
	}
	generateBoard(){
		this.initialize();
		this.swapNumber(Math.ceil(Math.random()*3));
		this.swapColumn(Math.ceil(Math.random()*3),false);
		this.swapGroupColumn(Math.floor(Math.random()*4),false );
		this.rotate(Math.floor(Math.random()*4));
		this.generateNumber(30);
	}

	swapNumber(count){
		for( let i  = 0; i < count; i++){

			let list = [1,2,3,4,5,6,7,8,9];
			let first = parseInt(list.splice(Math.floor(Math.random()*list.length),1)[0]);
			let second = parseInt(list.splice(Math.floor(Math.random()*list.length),1)[0]);
			for( let y = 0; y < 9; y++){
				for( let x = 0; x < 9; x++){
					if(this.before[y][x] == first) this.before[y][x] = second;
					else if(this.before[y][x] == second) this.before[y][x] = first;
				}
			}
		}
	}

	swapColumn(count,isrow){
		let list = [];
		let group = 0;
		let temp = 0;
		for( let i = 0; i < count ; i++){
			list = [0,1,2];
			group = Math.floor(Math.random()*3);
			let first = group * 3 + parseInt(list.splice(Math.floor(Math.random()*list.length),1)[0]);
			let second = group * 3 + parseInt(list.splice(Math.floor(Math.random()*list.length),1)[0]);
			for( let y = 0; y < 9; y++){
				if(isrow){
					temp = this.before[y][first];
					this.before[y][first] = this.before[y][second];
					this.before[y][second] = temp;
				}else{
					temp = this.before[first][y];
					this.before[first][y] = this.before[second][y];
					this.before[second][y] = temp;
				}
			}
		}
	}

	swapGroupColumn(count,isrow){
		let list = [];
		let group = 0;
		let temp = 0;
		for(let i = 0; i < count ; i++){
			list = [0,1,2];
			let first = 3 * parseInt(list.splice(Math.floor(Math.random()*list.length),1)[0]);			
			let second = 3 * parseInt(list.splice(Math.floor(Math.random()*list.length),1)[0]);			
			for(let y = 0; y < 9; y ++){
				if(isrow){
					for( let a = 0; a < 3 ; a++){
						temp = this.before[y][first+a];
						this.before[y][first+a] = this.before[y][second+a];
						this.before[y][second+a] = temp;
					}
				}else{	
					for( let a = 0; a < 3 ; a++){
						temp = this.before[first+a][y];
						this.before[first+a][y] = this.before[second+a][y];
						this.before[second+a][y] = temp;
					}
				}
			}
		}
	}

	rotate(count){
		for(let i = 0; i < count; i++){
			this.temp = [
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0]
			];

			for(let y = 0; y < 9; y++){
				for(let x = 0; x < 9 ; x++){
					this.temp[y][x] = this.before[8-x][y];
				}
			}		

			this.before = this.temp;
		}
	}

	generateNumber(number){
		for(let i = 0; i < number; i++){
			let pos = Object.keys(this.toFill)[Math.floor(Math.random()*Object.keys(this.toFill).length)];
			let arr = this.toFill[pos];
			this.current[arr.y][arr.x] = this.before[arr.y][arr.x];	
			delete this.toFill[pos];
		}
	}
}