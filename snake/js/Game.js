class Game{
	constructor(){
		this.started = false;
		this.snake = [];
		this.direction = 2;
		this.miliseconds = 0;
		this.food = [];
		this.score = 0;
		// this.speed = 80;
	}
	start(){
		this.started = true;
		$(".container-flex").removeClass('active');
		$('#gamearea').addClass('active');
		this.setSnake();
		this.randomFood();
	}
	randomFood(){
		let done = false
		while(!done){
			let x = Math.floor(Math.random()*70);
			let y = Math.floor(Math.random()*50);
			if(this.snake[x+"|"+y] || this.food[x+"|"+y]){
				continue;
			}else{
				this.food[x+"|"+y] = new Brick(x,y,'red');
				done = true;
			}
		}
	}
	setSnake(){
		for(let x = 1; x <= 3 ; x++){
			this.snake[x+"|"+25] = new Brick(x,25,'#2980b9');
		}
	}
	draw(){
		showscore.innerHTML = this.score;
		// console.log(this.snake);
		for(var key in this.snake){
			this.snake[key].draw();
		}
		for(var key in this.food){
			this.food[key].draw();
		}

	}
	update(){
		this.updateSnake();
	}
	updateSnake(){
		if(this.miliseconds % 50 == 0){
			let x = 0;
			let y = 0;
			if(this.direction==1){
				x = 0;
				y = -1;
			}else if(this.direction == 2){
				x = 1;
				y = 0;
			}else if(this.direction == 3){
				x = 0;
				y = 1;
			}else{
				x = -1;
				y = 0;
			}


			let brick = this.snake[Object.keys(this.snake)[Object.keys(this.snake).length-1]];
			// console.log(brick);

			let curX = brick.x;
			let curY = brick.y;
			let lateX = curX + x;
			let	lateY = curY + y;
			if(lateX<0 || lateY<0 || lateX >=70|| lateY >=50) this.lose();
			// console.log(lateX+"|"+lateY);

			if(this.snake[lateX+"|"+lateY]){
				this.lose();
			}else if(this.food[lateX+"|"+lateY]){
				this.score++;
				delete this.food[lateX+"|"+lateY];
				this.snake[lateX+"|"+lateY] = new Brick(lateX,lateY,'#2980b9');				
 				this.randomFood();
			}else{
				delete this.snake[Object.keys(this.snake)[0]];
				this.snake[lateX+"|"+lateY] = new Brick(lateX,lateY,'#2980b9');				
			}
		}
	}
	lose(){
		game.started = false;
		if(localStorage.highscore < this.score) localStorage.highscore = this.score;
		$(".container-flex").removeClass('active');
		$("#over").addClass('active');
		score1.innerHTML = this.score;
	}

}