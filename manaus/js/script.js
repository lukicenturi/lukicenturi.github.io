document.getElementById('modal').onclick=function (){
	document.getElementById('modal').setAttribute('class','');
	location.reload();
	return false;
}

window.onload = function(){
	init();
}

function init(){
	game = new Game();
}

class Game{
	constructor(){
		this.done = false;
		this.dates = [
			{
				"date": "01/04/2015",
				"booked": 225
			},
			{
				"date": "01/05/2015",
				"booked": 160
			},
			{
				"date": "01/05/2015",
				"booked": 75
			}
		];

		this.coltemplate = $($(".col").clone())[0];
		this.audio = {};
		this.init();
		this.listener();
	}

	init(){
		this.audio = {
			background: new Audio('audio/background.mp3'),
			alligator: new Audio('audio/alligator.mp3'),
			classic_music: new Audio('audio/classic_music.mp3'),
			cruise_arrival: new Audio('audio/cruise_arrival.mp3'),
			cruise_departure: new Audio('audio/cruise_departure.mp3'),
		}

		this.audio.background.volume = 1;
		this.audio.background.autoplay = true;
		this.audio.background.loop = true;

		this.audio.cruise_departure.autoplay = true;
		this.audio.cruise_departure.volume = 1;

		this.audio.classic_music.volume = 0;
		this.audio.classic_music.autoplay = true;
		this.audio.classic_music.loop = true;

		this.audio.alligator.volume = 0;
		this.audio.alligator.autoplay = true;
		this.audio.alligator.loop = true;

		this.audio.cruise_arrival.volume = 1;

		$("#modal").removeClass('active');
		$('.cruise').css('margin-left','-40px');
		$("#cruise").css('z-index','99');
		$("html").css('overflow-y','hidden')
		$("svg").css('overflow','visible');
		this.st("#portOfManausStart svg > g > g",0,130,0,0,0.8);
		this.st("#portOfManausEnd svg > g > g",0,130,0,0,0.8);
		this.st("#meetingWaters .animation img:last-child",0,-51);
		this.so("#piranhas .animation > svg > g", 0);
		this.st("#piranhas .animation svg",200);
		this.st("#piranhas .info-box",-260);
		this.so("#classicMusic svg",0);
		this.st("#alligator .animation svg",200);
		this.so("#alligator .animation svg > g > g",0);
		this.st("#alligator .info-box", -100);
		this.so(".info-box",0);

		document.body.scrollTop = 0;

	}
	

	move(istrue){
		let margin = $("#cruise").css('margin-left').replace('px','');
		margin = parseInt(margin);
		let scroll = document.body.scrollLeft;

		if(istrue){
			margin -= 20;
		}else{
			margin += 20;
		}

		if(margin < 0){
			margin = 0;
		}
		if(margin < scroll){
			document.body.scrollLeft -= 20;
		}

		if(margin > scroll + window.innerWidth - 1000){
			document.body.scrollLeft += 20;
		}

		$("#cruise").css('margin-left',margin+"px");
		
		this.update(margin);

	}

	listener(){
		window.onbeforeunload = function(){
			window.scrollTo(0,0);
		}

		window.onmousewheel = (e)=>{
			if(this.done) return;
			if(e.wheelDelta > 0) this.move(true);
			if(e.wheelDelta < 0) this.move(false);
		}

		window.onscroll = (e)=>{
			if(this.done) return;

			let margin = $("#cruise").css('margin-left').replace('px','');
			margin = parseInt(margin);
			let scroll = document.body.scrollLeft;

			if(margin < scroll){
				margin = scroll;
			}
			if(margin > scroll + window.innerWidth - 1000){
				margin = scroll + window.innerWidth - 1000;
			}

			$("#cruise").css('margin-left',margin+"px");
			this.update(margin);
		}

		$("ul.bullets li").click(function(e){
			e.preventDefault();
			e.stopPropagation();
			let index = $(this).index();
			if(index == 0){	window.scrollTo(0,0); }
			else if(index == 1){ window.scrollTo(1161,0); }
			else if(index == 2){ window.scrollTo(2225,0); }
			else if(index == 3){ window.scrollTo(3349,0); }
			else if(index == 4){ window.scrollTo(4714,0); }
			
		})
	}

	so(elem,opa){
		$(elem).css({
			opacity:opa
		});	
	}

	countopa(left, bot, top){

		let opa = (left - bot) / (top - bot);
		opa *= 2;
		if(opa > 1) opa = 1;

		return opa;
	}

	volume(left, bot, top){
		let opa = (left - bot) / (top - bot);
		opa *= 2
		if(opa < 0) opa = 0;
		if(opa > 1) opa = 2 - opa;

		return opa;
	}

	st(elem,x,y=0,z=0,rotate=0,scale=1,skewX=0){
		$(elem).css({
			transform:'translate3d('+x+'px, '+y+'px, '+z+'px) rotate('+rotate+'deg) scale('+scale+') skewX(' + skewX + 'deg)'
		});
	}

	show(){
		setTimeout(()=>{
			$('.col').remove();
			this.dates.forEach((date)=>{
				let percentage = date.booked / 2.5;
				let template = $(this.coltemplate).clone();
				$(template).children('h4').html(date.date);
				$(template).children('.progress').children('span.complete').css('width','0%').attr('to',percentage);
				$(template).children('span.percent').html(percentage + '% Booked');
				$(".box").append(template);
			});

			$("#modal").addClass('active').hide().fadeIn();

			$(".complete").each(function(i,g){
				$(this).delay(i*300).animate({
					width : $(this).attr('to') + "%"
				},1000);
			})
		},3500);
	}

	update(left){
		console.clear();
		this.cruise(left);
		this.reset();
		// console.log(left);
		if(left >= 0 && left < 800){
			this.setBullet(1);
			let opa = this.countopa(left, 0, 800);
			this.so("#portOfManausStart .info-box", opa);
			$("#portOfManausStart svg > g > g").each((i,g)=>{
				let val = 1;
				if(i % 3 == 0) val = 2;
				let x = (left) / (800 - 0) * val * 100;
				let rotate = (left / 800) * val *-10;
				if(i > 2 && i < 6) rotate = -rotate;
				this.st(g,x,130,0,rotate,0.8);

				$(g).children("g").each((k,j)=>{
					let skew = x / 5;
					if(k % 2 == 0) skew = -skew;
					this.st(j,0,0,0,0,1,skew);
				})
			});

		}else if(left >= 800 && left < 1660){
			this.setBullet(2);
			let opa = this.countopa(left, 800, 1660);
			let y = (left / (1650 - 800)) * -80;
			this.so("#meetingWaters .info-box",opa);
			this.st("#meetingWaters .animation",0,y);

		}else if(left >= 1660 && left < 3060){
			this.setBullet(3);
			let opa = this.countopa(left, 1660, 3060);
			let y = opa * -50;
			let volume = this.volume(left, 1660, 3060);

			let range = Math.floor((left - 1660) / 200);
			let pos = ((left - 1660) % 200) * 2;
			if(pos > 200) pos = 400 - pos;


			this.st("#classicMusic svg > g > polygon",pos/5 - 10);
			this.st("#classicMusic svg > g > polygon:nth-child(7)",pos/5 - 30, -pos/10 + 20);
			this.st("#classicMusic svg > g > polygon:nth-child(9)",pos/5 - 20, -pos/15 + 10);
			this.st("#classicMusic svg > g > polygon:nth-child(10)",pos/5 - 20, -pos/15 + 10);
			this.audio.classic_music.volume = volume;
			this.so("#classicMusic svg",opa);
			this.st('#classicMusic .top img',0,y);

		}else if(left >= 3060 && left < 3900){
			this.setBullet(4);
			let opa = this.countopa(left, 3060, 3900);

			let range = Math.floor((3900 - 3060) / 3);
			let state = Math.floor((left - 3060) / range);

			let opac = ((left - 3060) % range) / range;
			opac*=2;
			if(opac > 1) opac = 2 - opac;

			state = (state + 1) % 3

			this.so("#piranhas .animation > svg > g", 0);
			this.so("#piranhas .animation > svg > g:nth-child(3n+"+state+")", opac);
			this.st("#piranhas .animation > svg > g:nth-child(3n+"+state+")",0, opac * -20);
			this.so('#piranhas .info-box',opa);
		}else if(left >= 3900 && left < 5250){
			this.setBullet(5);
			let opa = this.countopa(left, 3900, 5250);

			let range = Math.floor((5250 - 3900) / 6);
			let state = Math.ceil((left - 3900) / range);

			let opac = ((left - 3900) % range) / range;

			let volume = this.volume(left, 3900, 5250);

			opac*=2;
			if(opac > 1) opac = 2 - opac;

			this.so("#alligator .animation svg > g > g",0);
			this.so("#alligator .animation svg > g > g:nth-child("+state+")",opac);
			this.st("#alligator .animation svg > g > g:nth-child("+state+")",(left - 3900) / 10);
			
			this.so('#alligator .info-box',opa);

			this.audio.alligator.volume = volume;
		}else if(left >= 5250 && left < 6107){
			let opa = this.countopa(left, 5250, 6507);
			$("#portOfManausEnd svg > g > g").each((i,g)=>{
				let val = 1;
				if(i % 3 == 0) val = 2;

				let x = (left - 5250) / (6107 - 5250) * val * 100;
				let rotate = (left - 5250) / (6507 - 5250) * val *-20;
				if(i > 2 && i < 6) rotate = -rotate;
				this.st(g,x,130,0,rotate,0.8);

				$(g).children("g").each((k,j)=>{
					let skew = x / 5;
					if(k % 2 == 0) skew = -skew;
					this.st(j,0,0,0,0,1,skew);
				})
			});
		}else if( left >= 6107){
			this.done = true;
			this.show();
			this.audio.cruise_arrival.play();
		}
	}

	reset(){
		this.so("#piranhas .animation svg > g", 0);
		this.audio.classic_music.volume = 0;
		this.audio.alligator.volume = 0;
		this.so('#alligator .animation svg > g > g',0);
	}

	cruise(left){
		$("#cruise").css('margin-left',left+"px");
		let second = left / 18 - 40;
		if(second > 250) second = 250;
		$('.cruise').css('margin-left',second);
	}

	setBullet(index){
		$('ul.bullets li').removeClass('active');
		$("ul.bullets li:nth-child("+index+")").addClass('active');
	}
}
