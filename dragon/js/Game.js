class Game{
	constructor(){
		let ready = document.querySelector('#ready');
		ready.classList.add('show');

		this.background = {
			backA:new Background('bg_back_A.png',speed-8),
			backB:new Background('bg_back_B.png',speed-8),

			frontA:new Background('bg_front_ground_A.png',speed),
			frontB:new Background('bg_front_ground_B.png',speed),

			middleA:new Background('bg_middle_A.png',speed-2),
			middleB:new Background('bg_middle_B.png',speed-2),
			
			superFrontA:new Background('bg_superfront_A.png',speed),
			superFrontB:new Background('bg_superfront_B.png',speed),
		}
		this.miliseconds = 0;
		this.obstacles = [];
		this.coins = [];
		this.score = 0;
		this.lives = 3;	
		this.dragon = new Dragon();
	}
	start(){
		ready.classList.remove('show');
	}

	update(){
		this.move();
		this.spawnCoins();
		this.spawnObstacles();

		this.coins.forEach(function(k,v){
			k.animate();
		});

		this.dragon.animate();
		this.removeCoins();
		this.removeObstacles();

		this.detectObstacles();
		this.detectCoins();

		this.detectLoses();
		this.detectDragon();
	}
	drawScore(){
		ctx.save();
		ctx.font = "20px Arial";
		ctx.fillStyle = 'white';
		ctx.fillText('Score : '+this.score+" Lives : "+this.lives, 20, 50);
		ctx.restore();
	}
	draw(){
		this.background.backA.draw();
		this.background.backB.draw();

		this.background.frontA.draw();
		this.background.frontB.draw();

		this.background.middleA.draw();
		this.background.middleB.draw();

		this.background.superFrontA.draw();
		this.background.superFrontB.draw();

		this.coins.forEach(function(k,v){
			k.draw();
		});

		this.obstacles.forEach(function(k,v){
			k.draw();
		});
		this.drawScore();
		this.dragon.draw();
	}
	move(){
		this.background.backA.move();
		this.background.backB.move();

		this.background.frontA.move();
		this.background.frontB.move();

		this.background.middleA.move();
		this.background.middleB.move();

		this.background.superFrontA.move();
		this.background.superFrontB.move();

		this.coins.forEach(function(k,v){
			k.move();
		});

		this.obstacles.forEach(function(k,v){
			k.move();
		})
	}

	spawnCoins(){
		if(this.miliseconds%5000 == 0){
			for(let i = 0; i < 3; i++){
				for(let j = 0 ; j <3 ;j++){
					this.coins.push(new Coin(i*24, j*24));
				}
			}
		}
	}

	spawnObstacles(){
		if(this.miliseconds%5000 == 0){
			this.obstacles.push(new Obstacle(900,0,'image/obstacle/obs_top_A.png'));
			this.obstacles.push(new Obstacle(1600,0,'image/obstacle/obs_top_B.png'));
			this.obstacles.push(new Obstacle(1400,480-150,'image/obstacle/obs_btm_A.png'));
			this.obstacles.push(new Obstacle(1800,480-75,'image/obstacle/obs_btm_B.png'));
		}
	}

	removeCoins(){
		this.coins.forEach((k,v)=>{
			if(k.x + k.size <= 0){
				this.coins.splice(v,1);
			}
		})
	}
	removeObstacles(){
		this.obstacles.forEach((k,v)=>{
			if(k.x + k.width <= 0){
				this.obstacles.splice(v,1);
			}
		})
	}

	detectCoins(){
		this.coins.forEach((k,v)=>{
			if(((this.dragon.x + this.dragon.width > k.x ) && (this.dragon.x < k.x + k.size))
				&& ((this.dragon.y + this.dragon.height > k.y)  && (this.dragon.y < k.y + k.size))){
				this.coins.splice(v,1);
				this.score ++ ;
			}
		})
	}
	detectObstacles(){
		this.obstacles.forEach((k,v)=>{
			if(((this.dragon.x + this.dragon.width > k.x ) && (this.dragon.x < k.x + k.width))
				&& ((this.dragon.y + this.dragon.height > k.y)  && (this.dragon.y < k.y + k.height))){
				if(!k.crash){
					this.lives-- ;
 				}
				k.crash = true;
			}
		})
	}
	detectLoses(){
		if(this.lives == 0){
			if(typeof(localStorage.highscore) != undefined){
				localStorage.highscore = localStorage.highscore > this.score ? localStorage.highscore : this.score;
				highscore.innerHTML = 'Highscore : '+localStorage.highscore;
			}else{
				localStorage.highscore = this.score;
			}
			over.classList.add('show');
		}
	}
	detectDragon(){
		if(this.dragon.y < 0 || this.dragon.y + this.dragon.height > ch){
			this.lives = 0;
		}
	}

}