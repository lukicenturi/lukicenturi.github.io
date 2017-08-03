var $ = document.querySelector.bind(document),
	canvas = $("#canvas"),
	ctx = canvas.getContext('2d');
	image = new Image();
	image.src = 'image/sprite.png';

window.onload = function(){
	init();
}

function init(){
	size = 10;
	width = 80;
	cs = 800;
	game = new Game();
}

class Game{
	constructor(){
		this.candy = [
			[],[],[],[],[],[],[],[],[],[],
		];
		this.down = [];
		this.score = 0;
		this.back = 0;
		this.run = false;
		this.list = {};
		this.bg = new Audio('music/candycrush.mp3');
		this.bg.volume = 0.2;
		this.bg.autoplay = true;

		this.break = new Audio('music/break.mp3');
		this.break.volume = 0.5;
		this.animateDone = false;
		this.highscore = 0;
		this.over = false;

		this.miliseconds = 120000;

		this.bg.loop = true;
		this.init();
		this.generateCandy();
		this.listener();
	}

	init(){
		if(localStorage.luki_candycrush_highscore === undefined) localStorage.luki_candycrush_highscore = 0;
		this.highscore = localStorage.luki_candycrush_highscore;
		$("#highscore").innerHTML = this.highscore;
		$("#ready").classList.add('active');
	}

	generateCandy(){
		for(let i = size - 1 ; i >= 0; i--){
			for(let j = size ; j >= 0; j--){
				this.candy[i][j] = new Candy({
					x:j * width,
					y:i * width,
					sx:Math.floor(Math.random()*6),
				})
			}
		}
		this.noSame();
	}

	noSame(){
		for(let i = 0 ; i < size ; i++){
			for(let j = 0 ; j < size ; j++){
				this.around(i,j);
			}
		}
	}

	around(i,j){
		let array = [];

		let dir = [
			[-1,0],[0,1],[1,0],[0,-1]
		];

		dir.forEach((v,g)=>{
			let y = v[0],
				x = v[1];

			if(i + y >= 0 && i + y < size && j + x >= 0 && j + x < size && i + y + y >= 0 && i + y + y < size && j + x + x >= 0 && j + x + x < size && this.candy[i][j].sx == this.candy[i + y][j + x].sx && this.candy[i][j].sx == this.candy[i + y + y][j + x + x].sx){
				let rand = Math.floor(Math.random() * 6);
				let current = this.candy[i + y][j + x].sx;
				let array = [0,1,2,3,4,5];
				dir.forEach((a,b)=>{
					let c = a[0],
						d = a[1];

					if(i + y + c >= 0 && i + y + c < size && j + x + d >= 0 && j + x + d < size){
						let rep = this.candy[i + y + c][j + x + d].sx;
						let index = array.indexOf(rep);
						if(index != -1) array.splice(index, 1);
					}
				});

				let change = array[Math.floor(Math.random() * array.length)];
				this.candy[i + y][j + x].sx = change;
			}	
		});
	}

	draw(){
		if(this.over) return;
		ctx.clearRect(0,0,cs,cs);
		ctx.save();
		this.candy.forEach((list)=>{
			list.forEach((candy)=>{
				candy.draw();			
			});
		});
		$("#score").innerHTML = this.score;
		$("#scores").innerHTML = this.score;
		ctx.restore();

		this.miliseconds -= 10;
		if(this.miliseconds % 1000 == 0) $("#timer").innerHTML = this.miliseconds / 1000;

		if(this.miliseconds <= 0){
			this.over = true;
			this.done();
		} 

		setTimeout(()=>{
			this.draw();
		},10);
	}
	
	done(){
		$("#gameboard").classList.remove("active");
		$("#over").classList.add('active');
		if(this.score > this.highscore) localStorage.luki_candycrush_highscore = this.score;
	}

	start(){
		$("#ready").classList.remove('active');
		$("#gameboard").classList.add('active');
		this.draw();
	}

	listener(){

		$("#restart").addEventListener('click',(e)=>{
			location.reload();
		})
		$("#start").addEventListener('click',(e)=>{
			this.start();			
		});
		canvas.addEventListener('mousedown',(e)=>{
			let y = Math.floor(e.offsetY / width);
			let x = Math.floor(e.offsetX / width);
			this.down = [y,x];
		});
		canvas.addEventListener('mouseup',(e)=>{
			if(this.run){
				this.down = [];
				return false;	
			}
			let y = Math.floor(e.offsetY / width);
			let x = Math.floor(e.offsetX / width);
			if(this.down.length > 0){
				let y1 = this.down[0];
				let x1 = this.down[1];
				if(Math.abs(y - y1) <= 1 && Math.abs(x - x1) <= 1 && Math.abs(y - y1) != Math.abs(x - x1)){
					this.change(y,x,y1,x1);
				}
			}
			this.down = [];
		});
	}

	change(y,x,y1,x1){
		this.candy[y][x].targetX = this.candy[y1][x1].x;
		this.candy[y][x].targetY = this.candy[y1][x1].y;

		this.candy[y1][x1].targetX = this.candy[y][x].x;
		this.candy[y1][x1].targetY = this.candy[y][x].y;

		this.swap(y,x,y1,x1);
	}

	swap(y,x,y1,x1){
		this.run = true;
		if(this.candy[y][x].targetX != this.candy[y][x].x || this.candy[y1][x1].targetX != this.candy[y1][x1].x ||
			this.candy[y][x].targetY != this.candy[y][x].y || this.candy[y1][x1].targetY != this.candy[y1][x1].y ){
			if(this.candy[y][x].x > this.candy[y][x].targetX) this.candy[y][x].x -= 5;
			else if(this.candy[y][x].x < this.candy[y][x].targetX) this.candy[y][x].x += 5;

			if(this.candy[y][x].y > this.candy[y][x].targetY) this.candy[y][x].y -= 5;
			else if(this.candy[y][x].y < this.candy[y][x].targetY) this.candy[y][x].y += 5;

			if(this.candy[y1][x1].x > this.candy[y1][x1].targetX) this.candy[y1][x1].x -= 5;
			else if(this.candy[y1][x1].x < this.candy[y1][x1].targetX) this.candy[y1][x1].x += 5;

			if(this.candy[y1][x1].y > this.candy[y1][x1].targetY) this.candy[y1][x1].y -= 5;
			else if(this.candy[y1][x1].y < this.candy[y1][x1].targetY) this.candy[y1][x1].y += 5;

			setTimeout(()=>{
				this.swap(y,x,y1,x1);
			},10)
		}else{
			let temp = this.candy[y][x];
			this.candy[y][x] = this.candy[y1][x1];
			this.candy[y1][x1] = temp;

			if(this.back == 0){
				if(!this.check()){
					this.back = 1;
					this.change(y,x,y1,x1);
				}else{
					this.back = 0;
				}
			}else{
				this.run = false;
				this.back = 0;
			}
		}
	}

	next(){
		setTimeout(()=>{
			if(this.check()){
				this.check();
			}
		},200);
	}

	makeNew(){
		for(let i = size - 1 ; i >= 0 ; i --){
			for(let j = 0 ; j < size ; j++){
				if(this.candy[i][j].sx == -1){
					let sum = this.count(i,j);
					this.goDown(i,j,sum);
				}
			}
		}
	}

	goDown(i,j,sum){ //7,0,3
		for(let b = i - sum; b >= 0 ; b--){ //4,3,2,1,0
			this.candy[b + sum][j] = this.candy[b][j];
			this.candy[b + sum][j].targetY += (sum * width);
		}
		for(let c = sum - 1; c >= 0; c--){ //2,1,0
			let target = c * width;
			let rand = Math.floor(Math.random() * 6);
			// let rand = this.candy[sum][j].sx;
			this.candy[c][j] = new Candy({
				x:j * width,
				y:(c - sum) * width, 
				sx:rand,
				targetY: target
			});
		}
		for(let a = 0 ; a <= i; a++){//0,1,2,3,4,5,6,7
			this.animate(a,j);
		}
	}

	animate(a,j){
		if(this.candy[a][j].y < this.candy[a][j].targetY){
			this.animateDone = false;
			this.candy[a][j].y += 10;
			setTimeout(()=>{
				this.animate(a,j);
			},10);
		}else{
			this.animateDone = true;
			setTimeout(()=>{
				if(this.animateDone) this.next();	
			},50);
		}
	}

	count(i,j){
		let sum = 0 ;
		while(i >= 0 && i < size && this.candy[i][j].sx == -1){
			sum++;
			i-=1;
		}
		return sum;
	}

	check(){
		this.run = true;
		let sum = 0;
		for(let i = 0 ; i < size ; i++){
			for(let j = 0 ; j < size ; j++){
				if(this.clear(i,j)) sum++;
			}
		}

		if(Object.keys(this.list).length > 0) this.break.play();
		
		for(var key in this.list){
			let y = this.list[key][0];
			let x = this.list[key][1];
			this.score ++;
			this.candy[y][x].temp = this.candy[y][x].sx;
			this.candy[y][x].sx = -1;
			delete this.list[key];
		}

		setTimeout(()=>{
			this.makeNew();
			this.run = false;
		},500);
		
		return (sum > 0);
	}

	clear(i,j){
		let sum = false;
		let dir = [
			[-1,0],[0,1],[1,0],[0,-1]
		];
		dir.forEach((v,g)=>{
			let y = v[0],
				x = v[1];

			if(i + y >= 0 && i + y < size && j + x >= 0 && j + x < size && i + y + y >= 0 && i + y + y < size && j + x + x >= 0 && j + x + x < size && this.candy[i][j].sx == this.candy[i + y][j + x].sx && this.candy[i][j].sx == this.candy[i + y + y][j + x + x].sx && this.candy[i][j].sx != -1){
				let si = i;
				let sj = j;
				let now = this.candy[i][j].sx;
				while(si >= 0 && si < size && sj >= 0 && sj < size && this.candy[si][sj].sx == now){
					if(!this.list[si+"|"+sj]){
						this.list[si+"|"+sj] = [si,sj];
					}
					si += y;
					sj += x;
				}
				if(this.candy[i][j].sx == 1){
					this.miliseconds += 2000;
					if(y == 0){
						for(let a = 0 ; a < size; a++){
							if(!this.list[i+"|"+a]) this.list[i+"|"+a] = [i,a];
						}
					}
					if(x == 0){
						for(let a = 0 ; a < size; a++){
							if(!this.list[a+"|"+j]) this.list[a+"|"+j] = [a,j];
						}
					}
				}
				sum = true;
			}	
		});
		return sum;
	}


}