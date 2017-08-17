class Game{
	constructor(){
		this.over = false;
		this.brick = [];
		this.ball = [];
		this.go = 0;
		this.score = 0;
		this.goPoint = 6;
		this.brickW = 180;
		this.brickH = 30;
		this.speed = 5;
		this.highscore = 0;
		this.init();
		this.listener();
	}
	init(){
		$("#ready").classList.add("active");
		$("#gameboard").classList.remove("active");
		$("#over").classList.remove("active");
		this.setHighscore();
	}
	setHighscore(){
		if(localStorage.duet_highscore === undefined) localStorage.duet_highscore = 0;
		this.highscore = localStorage.duet_highscore;
		$("#highscore").innerHTML = this.highscore;
	}
	listener(){
		$("#start").addEventListener('click',(e)=>{
			this.start();
		});
		$("#restart").addEventListener('click',(e)=>{
			location.reload();
		});
		document.addEventListener('keydown',(e)=>{
			let a = e.keyCode;
			if(a == 37 || a == 39){
				this.handleDown(a);
			}
		});
		document.addEventListener('keyup',(e)=>{
			let a = e.keyCode;
			if(a == 37 || a == 39){
				this.handleUp(a);
			}
		});
	}
	start(){
		$("#ready").classList.remove("active");
		$("#gameboard").classList.add("active");
		this.generate();
		this.update();
	}
	generate(){
		this.generateBall();
		this.generateBrick();
	}
	generateBall(){
		this.ball.push(new Ball("red", 270));
		this.ball.push(new Ball("blue", 90));
	}
	generateBrick(){
		let arrayX = [0, cw / 2 - (this.brickW - 80) / 2, cw - this.brickW];
		let arrayW = [this.brickW, this.brickW - 80, this.brickW];
		let index = Math.floor(Math.random() * arrayX.length);
		let x = arrayX.splice(index)[0];
		let y = -this.brickH;
		let w = arrayW.splice(index)[0];
		this.brick.push(new Brick(x,y,w, this.brickH));
	}
	update(){
		if(this.over) return;
		this.animate();
		this.detectCollision();
		this.draw();
		this.removeBrick();
		this.score ++;

		if(this.brick[this.brick.length - 1].y == 150) this.generateBrick();
		setTimeout(()=>{
			this.update();
		},20);
	}
	draw(){
		ctx.clearRect(0,0,cw,ch);
		ctx.save();
		this.boundary();
		this.drawScore();
		this.ball.forEach((ball)=>{
			ball.draw();
		});
		this.brick.forEach((brick)=>{
			brick.draw();
		});
		ctx.restore();
	}
	drawScore(){
		ctx.save();
		ctx.font = '20px Arial';
		ctx.fillStyle = 'white';
		ctx.fillText("Score : " + this.score, 20, 30);
		ctx.restore();
	}
	boundary(){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'none';
		ctx.strokeStyle = '#333';
		ctx.arc(this.ball[0].pivot.x, this.ball[0].pivot.y, this.ball[0].distance, 0, 360 * Math.PI / 180);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
	handleDown(a){
		if(a == 37){
			this.go = -this.goPoint;
		}else{
			this.go = this.goPoint;
		}
	}
	handleUp(a){
		this.go = 0;
	}
	animate(){
		this.ball.forEach((ball)=>{
			ball.deg += this.go;
		})
		this.brick.forEach((brick)=>{
			brick.y += this.speed;
		})
	}
	removeBrick(){
		this.brick = this.brick.filter((brick)=>{
			return brick.y < ch;
		});
	}
	end(){
		this.over = true;
		if(this.score > localStorage.duet_highscore) localStorage.duet_highscore = this.score;

		setTimeout(()=>{
			$("#score").innerHTML = this.score;
			$("#gameboard").classList.remove('active');
			$("#over").classList.add('active');
		},1000);
	}
	detectCollision(){
		this.brick.forEach((brick)=>{
			let corner = [
				[brick.x, brick.y],
				[brick.x + brick.w, brick.y],
				[brick.x, brick.y + brick.h],
				[brick.x + brick.w, brick.y + brick.h],
			];
			let x1 = brick.x;
			let y1 = brick.y;
			let w1 = brick.w;
			let h1 = brick.h;

			this.ball.forEach((ball)=>{
				let deg = ball.deg * Math.PI / 180;
				let x2 = ball.distance * Math.cos(deg) + ball.pivot.x;
				let y2 = ball.distance * Math.sin(deg) + ball.pivot.y;
				let radius = ball.rad;
				let distance = {
					x:0,
					y:0
				}

				if(x1 > x2) distance.x = Math.abs(x1 - x2);
				else if(x1 + w1 < x2) distance.x = Math.abs((x1 + w1) - x2);

				if(y1 > y2) distance.y = Math.abs(y1 - y2);
				else if(y1 + h1 < y2) distance.y = Math.abs((y1 + h1) - y2);

				let between = Math.pow(distance.x, 2) + Math.pow(distance.y, 2);
				if(between < Math.pow(radius, 2)){
					this.end();
				}
			});
		});
	}
}