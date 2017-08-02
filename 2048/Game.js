class Game{
	constructor(board){
		this.board = board;
		this.execute = {};
		this.random();
		this.change = false;
		this.score = 0;
		this.empty = false;
		this.style = [
			['#EEE4DA','#776E65'],
			['#EDE0C8','#776E65'],
			['#F2B179','white'],
			['#F59563','white'],
			['#F67C5F','white'],
			['#F65E3B','white'],
			['#EDCF72','white'],
		];
		this.cekLocalStorage();
		this.draw();
	}
	cekLose(){
		this.empty = false;
		for(let x = 0; x <=3 ; x++){
			for(let y = 0 ; y <= 3; y++){
				if(this.board.area[x][y] == 0) this.empty = true;
				let array = [[0,1],[1,0],[-1,0],[0,-1]];
				array.forEach((arr)=>{
					let i = arr[0];
					let j = arr[1];
					if(x + i >=0 && x + i < 4 && y + j >=0 && y + j < 4 && this.board.area[x + i][y + j] == this.board.area[x][y]){
						this.empty = true;
					}
				})
			}
		}
		return this.empty;
	}
	cekLocalStorage(){
		if(localStorage.board!=undefined && localStorage.score!=undefined){
			this.board = JSON.parse(localStorage.board);
			this.score = parseInt(localStorage.score);
		}else{
			this.saveLocalStorage();
		}
	}

	saveLocalStorage(){
		localStorage.score = this.score;
		localStorage.board = JSON.stringify(this.board);
	}

	draw(){
		let container = $("#gameboard");
		container.innerHTML = '';

		this.board.area.forEach((row)=>{
			row.forEach((board)=>{
				let div = document.createElement('div');
				div.classList.add('piece');
				if(board != 0){
					let style = Math.log2(board) - 1;
					if(style > 6) style = 6;

					style = this.style[style];
					div.style.background = style[0];
					div.style.color = style[1];
					div.innerHTML = board;
				}
				div.style.width = (100 / size) + "%";
				div.style.height = (100 / size) + "%";
				container.appendChild(div);
			});
		});

		requestAnimationFrame(()=>{
			this.draw()
		});

		scores.innerHTML = this.score;
		if(localStorage.highscore === undefined){
			localStorage.highscore = 0;
		}
		highscores.innerHTML	= localStorage.highscore;
	}

	list(){
		let list = [];
		for(let i = 0; i < 4; i++){
			for(let j = 0 ; j < 4; j++){
				if(this.board.area[i][j] == 0){
					list.push([i,j]);
				}
			}
		}
		return list;
	}

	random(){
		let list = this.list();
		let select = list.splice(Math.floor(Math.random() * list.length),1)[0];
		this.board.area[select[0]][select[1]] = 2;
	}

	move(dir){
		this.change = false;
		this.execute = [];
		if(dir == 1){ //[0123][123]
			for(let i = 0; i < 4; i++){
				for(let j = 1 ; j < 4; j++){
					if(this.board.area[i][j] != 0){
						this.go(i,j,0,-1);
					}
				}
			}
		}
		else if(dir == 2){//[123][0123]
			for(let i = 1; i < 4; i++){
				for(let j = 0 ; j < 4; j++){
					if(this.board.area[i][j] != 0){
						this.go(i,j,-1,0);
					}
				}
			}
		}	
		else if(dir == 3){ //[0123][210]
			for(let i = 0; i < 4; i++){
				for(let j = 2 ; j >= 0; j--){
					if(this.board.area[i][j] != 0){
						this.go(i,j,0,1);
					}
				}
			}
		}
		else if(dir == 4){ //[012][0123]
			for(let i = 3; i >= 0; i--){
				for(let j = 0 ; j < 4; j++){
					if(this.board.area[i][j] != 0){
						this.go(i,j,1,0);
					}
				}
			}
		}
		if(this.change){
			this.random();
			this.saveLocalStorage();
		}

		if(!this.cekLose()){
			var divlose = document.getElementById('lose');
			divlose.classList.add('active');
		}
	}

	go(i,j,y,x){
		//2,3,0,-1
		let si = i; //si = 2;
		let sj = j; //si = 3;

		while(si + y >= 0 && si + y < 4 && sj + x >= 0 && sj + x < 4 && (this.board.area[si + y][sj + x] == 0 || this.board.area[si + y][sj + x] == this.board.area[i][j]) && !this.execute[(si + y)+"|"+(sj + x)]){
			si += y;
			sj += x;
			if(this.board.area[si][sj] == this.board.area[i][j]){
				break;
			}
		}

		if(this.board.area[si][sj] == 0){
			this.board.area[si][sj] = this.board.area[i][j];
			this.board.area[i][j] = 0;
			this.change = true;
		}
		else if(this.board.area[si][sj] == this.board.area[i][j] && (si != i || sj != j) && !this.execute[si+"|"+sj]){
			this.execute[si+"|"+sj] = [si,sj];
			this.board.area[si][sj] *= 2;
			this.score += this.board.area[si][sj];
			if(this.score > localStorage.highscore) localStorage.highscore = this.score;
			this.board.area[i][j] = 0;
			this.change = true;
		}

	}
}