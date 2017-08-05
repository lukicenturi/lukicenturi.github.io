class Game{
	constructor(){
		this.plane = null;
		this.bird = [];
		this.cloud = [];
		this.parachute = [];
		this.star = [];
		this.sound = true;
		this.started = false;
		this.font = 1;
		this.miliseconds = 0;
		this.fuel = 10;
		this.point = 0;
		this.over = false;
		this.pause = false;
		this.audio = {
			background: new Audio('sound/background.mp3'),
			finish: new Audio('sound/finish.mp3'),
			hit: new Audio('sound/hit.mp3'),
			star: new Audio('sound/star.mp3'),
		}
		this.init();
		this.listener();
	}

	init(){
		this.audio.background.volume = 1;
		this.audio.finish.volume = 1;
		this.audio.hit.volume = 1;
		this.audio.star.volume = 1;

		this.audio.background.loop = 1;
		
		$("#ready").addClass('active');
		$("#gameboard").removeClass('active');
		$("#over").removeClass('active');
	}

	listener(){
		$("#start").on('click',()=>{
			this.start();			
		});

		$(window).on('keydown',(e)=>{
			if(!this.started || this.pause) return;
			let a = e.keyCode;
			this.plane.move(a);
		});

		$("#sound").on("click",(e)=>{
			this.sound = (this.sound + 1) % 2;
			let arr = ["ON","OFF"];
			$("#sound").html('TURN ' + arr[this.sound] + ' SOUND');
			if(this.sound && !this.pause){
				for(let key in this.audio){
					this.audio[key].volume = 1;
				}
			}else{
				for(let key in this.audio){
					this.audio[key].volume = 0;
				}
			}
		})

		$(".fonts").on('click',(e)=>{
			let stats = e.currentTarget.dataset.sound;
			switch(stats){
				case '+':
					this.font += 0.2;
					if(this.font > 2) this.font = 2;
					break;
				case '-' :
					this.font -= 0.2;
					if(this.font < 0.6) this.font = 0.6;
					break;
			}
			this.font = Math.round(this.font * 10) / 10;
			$("#fuel,#stars").css({
				'font-size':this.font +'em'
			});
		})

		$("#pause").on('click',()=>{
			this.pause = (this.pause + 1) % 2;
			let arr = ["PAUSE","PLAY"];
			$("#pause").html(arr[this.pause]);
			if(this.sound && !this.pause){
				for(let key in this.audio){
					this.audio[key].volume = 1;
				}
			}else{
				for(let key in this.audio){
					this.audio[key].volume = 0;
				}
			}
		})

		$("#submit").on('click',(e)=>{
			location.reload();
		})
	}

	start(){
		this.started = true;
		this.generate();
		this.update();
		this.audio.background.play();
		$("#ready").removeClass('active');
		$('#gameboard').addClass('active');

	}

	generate(){
		this.generatePlane();
		this.generateCloud();
		this.generateBird();
		this.generateParachute();
		this.generateStar();
	}

	generatePlane(){
		this.plane = new Plane();
	}

	generateCloud(){
		if(!this.over && !this.pause){
			for(let i = 0 ; i < 5 ; i++){
				let x = Math.floor(Math.random() * 800) + 800;
				let y = Math.floor(Math.random() * 480);
				let rand = Math.floor(Math.random() * 7);
				let s = Math.floor(Math.random () * 10) - 5 + speed;
				let alpha = Math.random();
				this.cloud.push(new Cloud(x,y,rand,s,alpha));
			}
		}
		setTimeout(()=>{
			this.generateCloud();
		},10000);
	}

	generateBird(){
		if(!this.over && !this.pause){

		}
		for(let i = 0 ; i < 2 ; i++){
			let x = Math.floor(Math.random() * 800) + 800;
			let y = Math.floor(Math.random() * 450);
			let s = Math.floor(Math.random() * 10) - 5 + speed;
			this.bird.push(new Bird(x,y,s))
		}

		setTimeout(()=>{
			this.generateBird();
		},10000);
	}

	generateParachute(){
		if(!this.over && !this.pause){
			for(let i = 0 ; i < Math.ceil(Math.random() * 2) ; i ++){
				let x = Math.floor(Math.random() * 500) + 200;
				let y = Math.floor(Math.random() * 480) - 480;
				this.parachute.push(new Parachute(x,y));
			}
		}
		setTimeout(()=>{
			this.generateParachute();
		}, 18000);
	}

	generateStar(){
		if(!this.over && !this.pause){
			for(let i = 0 ; i < Math.ceil(Math.random() * 3) ; i ++){
				let x = Math.floor(Math.random() * 500) + 200;
				let y = Math.floor(Math.random() * 480) - 480;
				this.star.push(new Star(x,y));
			}
		}
		setTimeout(()=>{
			this.generateStar();
		}, 8000);
	}

	update(){
		if(this.over || !this.fuel){
			this.done();
		}
		if(!this.over && !this.pause){

			this.change();
			this.draw();
			this.miliseconds += 20;
			if(this.miliseconds % 1000 == 0) this.fuel --;
			
		}
		setTimeout(()=>{
			this.update();
		},20);
	}

	done(){
		this.audio.background.pause();
		this.over = true;
		if(!this.fuel){
			console.log('fuel habis');
			this.audio.finish.play();
		}
		this.audio.star.pause();

		$("#gameboard").removeClass('active');
		$("#over").addClass('active');
	}

	change(){
		this.removeX(this.cloud);
		this.removeX(this.bird);
		this.removeY(this.parachute);
		this.removeY(this.star);

		this.detect(this.parachute,'fuel',10);
		this.detect(this.star,'point',1);
		this.detect(this.bird,'over',1);

		

		$("#fuel").html(this.fuel);
		$("#stars").html(this.point);
	}

	detect(object,add,value){
		let plane = this.plane;
		object.forEach((obj, index)=>{
			if(plane.x + plane.w > obj.x && plane.x < obj.x + obj.w && plane.y + plane.h > obj.y && plane.y < obj.y + obj.h){
				game[add] += value;
				if(add == 'point'){
					this.audio.star.play();
				}
				if(add == 'over'){
					console.log('ketabrak');
					this.audio.hit.play();
				}
				delete object[index];
			}
		})
	}

	removeX(object){
		object.forEach((cloud,index)=>{
			if(cloud.x + cloud.w < 0) delete this.cloud[index];
		})
	}

	removeY(object){
		object.forEach((bird,index)=>{
			if(bird.x + bird.w < 0) delete this.bird[index];
		})
	}

	draw(){
		ctx.clearRect(0,0,cw,ch);
		ctx.save();

		this.cloud.forEach((cloud)=>{
			cloud.animate();
			cloud.draw();
		})

		this.bird.forEach((bird)=>{
			bird.animate();
			bird.draw();
		})

		this.parachute.forEach((parachute)=>{
			parachute.animate();
			parachute.draw();
		})

		this.star.forEach((star)=>{
			star.animate();
			star.draw();
		})

		this.plane.draw();

		ctx.restore();
	}
}