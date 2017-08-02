window.onload = function(){
	init();
}

function init(){
	game = new Game();
}

class Game{
	constructor(){
		this.dir = 1;
		this.speed = 5;
		this.length = 1;
		this.init = 20;
		this.score = -this.init;
		this.over = false;	
		this.listener();
		this.start();
	}
	listener(){
		window.addEventListener('keydown',(e)=>{
			if(this.over) return;
			let a = e.keyCode;
			if(a == 32){
				this.next();
			}
		});

		$("#restart").click(function(){
			location.reload();
		});

		$("body").click((e)=>{
			this.next();
		})
	}
	next(){
		// this.over = true;return;	
		let firstV = this.gw('.block:last-child');
		let secondV = this.gw('.block:nth-child('+(this.length - 1)+')');
		let firstT = this.gt('.block:last-child');
		let secondT = this.gt('.block:nth-child('+(this.length - 1)+')');
		if(this.dir == 1){
			if(firstT[0] + firstV[0] > secondT[0] && firstT[0] <= secondT[0] + secondV[0]){
				let x = Math.max(firstT[0], secondT[0]);
				let end = Math.min(firstT[0] + firstV[0], secondT[0] + secondV[0]);
				let w = end - x;

				this.sw(".block:last-child",w,firstV[1]);
				this.st(".block:last-child",x,firstT[1],firstT[2]);

				let perfect = 0;
				if(firstV[0] == w){
					w += 20;
					perfect = 1;
				}
				this.generate(w,firstV[1],x,firstT[1], perfect);				
				this.dir = (this.dir % 2) + 1;
			}else{
				this.lose();
			}
		}else{
			if(firstT[1] + firstV[1] > secondT[1] && firstT[1] <= secondT[1] + secondV[1]){
				let y = Math.max(firstT[1], secondT[1]);
				let end = Math.min(firstT[1] + firstV[1], secondT[1] + secondV[1]);
				let h = end - y;

				this.sw(".block:last-child",firstV[0],h);
				this.st(".block:last-child",firstT[0],y,firstT[2]);

				let perfect = 0;
				if(firstV[1] == h){
					h += 20;
					perfect = 1;
				}
				
				this.generate(firstV[0],h,firstT[0],y,perfect);				
				this.dir = (this.dir % 2) + 1;
			}else{
				this.lose();
			}
		}
	}
	lose(){
		this.over = true;
		$('.over').addClass('active');
	}
	start(){
		this.sw('.block:nth-child(1)',300,300);
		this.st('.block:nth-child(1)',0,0,0);
		for(let x = 0; x < this.init; x++){
			this.generate(300,300,0,0);
		}
		this.move();

		if(localStorage.highscore == undefined){
			localStorage.highscore = 0;
		}

	}
	color(){
		let length = this.length;
		let state = (length * 20) % (255 * 6);
		let r = 0;
		let g = 0;
		let b = 0;

		if(state >= 0 && state < (256 * 1)){
			r = (256 * 1 - 1);
			g = state - 0;
			b = 0;
		}else if(state >= (256 * 1) && state < (256 * 2)){
			r = (256 * 2 - 1) - state;
			g = 255;
			b = 0;
		}else if(state >= (256 * 2) && state < (256 * 3)){
			r = 0;
			g = 255;
			b = state - (256 * 2);
		}else if(state >= (256 * 3) && state < (256 * 4)){
			r = 0;
			g =	(256 * 4 - 1) - state;
			b = 255;
		}else if(state >= (256 * 4) && state < (256 * 5)){
			r = state - (256 * 4);
			g = 0;
			b = 256;
		}else if(state >= (256 * 5) && state < (256 * 6)){
			r = 255;
			g = 0;
			b = (256 * 6 - 1) - state;
		}

		return [r,g,b];
	}
	generate(w,h,x,y,perfect = false){
		this.score ++;
		this.length += 1;
		let color = this.color();
		let block = document.createElement('div');
		let after = document.createElement('div');
		let before = document.createElement('div');

		$(block).addClass('block').css('background','rgb('+color[0] + ',' + color[1] + ',' + color[2] +')');
		$(before).addClass('before').css('background','rgb('+Math.round(color[0]/255*144) + ',' + Math.round(color[1]/255*144) + ',' + Math.round(color[2]/255*144) +')');
		$(after).addClass('after').css('background','rgb('+Math.round(color[0]/255*199) + ',' + Math.round(color[1]/255*199) + ',' + Math.round(color[2]/255*199) +')');

		if(perfect){
			$('.block:last-child').addClass('perfect');
		}

		$('body').css({
			background:'linear-gradient(to bottom, rgb('+color[1] + ',' + color[2] + ',' + color[0] +'), rgb('+Math.round(color[1]/255*100) + ',' + Math.round(color[2]/255*100) + ',' + Math.round(color[0]/255*100) +')'
		})

		$(block).append(before);
		$(block).append(after);

		let z = (this.length - 1) * 30;
		this.sw(block,w,h);
		this.st(block,x,y,z);
		$(".container").append(block);
	}
	move(){
		if(this.over) return;
		let elem = '.block:last-child';
		let v = this.gt(elem);
		let s = this.gw(elem);
		if(this.dir == 1){
			let x = v[0];
			let w = s[0];
			x += this.speed;
			this.st(".block:last-child",x,v[1],v[2]);
			if((x + w >= 700  && this.speed > 0) || (x <= -400 && this.speed < 0)){
				this.speed = -this.speed;
			}
		}else{
			let y = v[1];
			let h = s[1];
			y += this.speed;
			this.st(".block:last-child",v[0],y,v[2]);
			if((y + h >= 700  && this.speed > 0) || (y <= -400 && this.speed < 0)){
				this.speed = -this.speed;
			}
		}

		$('.score').html(this.score);
		let len = this.length - 6;
		if(len < 0) len = 0;
		$('.container').css('margin-top',(len * 25) + "px");

		if(localStorage.highscore < this.score) localStorage.highscore = this.score;
		$('.highscore span').html(localStorage.highscore);

		setTimeout(()=>{
			this.move();
		},10);
	}
	gw(elem){
		var v = [parseInt($(elem).width()), parseInt($(elem).height())];
		return v;
	}

	sw(elem,w,h){
		$(elem).css({
			width: w+"px",
			height: h+"px"
		});
	}
	gt(elem){
		var v = [parseInt($(elem).attr('x')), parseInt($(elem).attr('y')) , parseInt($(elem).attr('z'))];
		return v;
	}
	st(elem,x,y,z){
		$(elem).css({
			transform : 'rotateX(45deg) rotateZ(45deg) translateZ('+z+'px) translateX('+x+'px) translateY('+y+'px)'
		}).attr({
			x: x,
			y: y,
			z: z
		})
	}
}