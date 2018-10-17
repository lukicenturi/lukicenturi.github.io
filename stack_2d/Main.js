window.onload = function(){
	app.init();
}

var app = {
	dir:5,
	lose:false,
	score: 0,
	init:function(){
		app.config(),
		app.listener();
		app.move();
	},
	move:function(){
		if(app.lose) return;
		if(app.dir > 0){
			margin = app.getMargin('play');
			width = app.getWidth('play');
			if(margin + width < 1500){
				app.setMargin('play', margin += app.dir);
			}else{
				app.dir = -app.dir;
			}
		}else{
			margin = app.getMargin('play');
			// alert(margin);
			if(margin > 0){
				app.setMargin('play', margin += app.dir);
			}else{
				app.dir = -app.dir;
			}
		}

		wrapper = document.getElementsByClassName('wrapper')[0];
		gameplay = document.getElementsByClassName('gameplay')[0];
		length = document.getElementsByClassName('block').length;

		limit = 15;
		until = length - limit;

		if(until < 0) until = 0;

		height = gameplay.getBoundingClientRect().height + (30 * until);

		wrapper.style.height = height += 'px';

		setTimeout(app.move,10);

		scores.innerHTML = app.score;
	},
	getMargin:function(elem){
		var margin = document.getElementById(elem).style.marginLeft.replace('px','');
		margin = parseInt(margin);
		if(isNaN(margin)) margin = 0;
		return margin;
	},
	getWidth:function(elem){
		var width = document.getElementById(elem).getBoundingClientRect().width;
		return parseInt(width);
	},
	setMargin(elem,margin){
		document.getElementById(elem).style.marginLeft = margin + "px";
	},
	config:function(){
		
	},
	listener:function(){
		window.onkeydown = function(e){
			if(app.lose) return;
			a = e.keyCode;
			if(a == 32){
				app.next();
			}
		}

		restart.onclick = function(){
			location.reload();
		}
	},
	randomColor:function(){
		let color = '';
		for(let i = 0; i < 3; i++){
			a = Math.floor(Math.random() * 256);
			color += a + ', ';
		}
		color = color.substring(0, color.length - 2);
		return color;
	},
	next:function(){
		var play = document.getElementById('play');
		var wrapper = document.getElementsByClassName('wrapper')[0];
		var last = document.getElementById('last');
		var cur = play.getBoundingClientRect();
		var pos = last.getBoundingClientRect();
		var wrap = wrapper.getBoundingClientRect();

		console.log(cur,pos);
		var left = Math.max(cur.left, pos.left);
		var right = Math.min(cur.right, pos.right);

		if(cur.left <= pos.left + pos.width && cur.left + cur.width >= pos.left  && (cur.left != pos.left + pos.width && cur.left + cur.width != pos.left)){
			play.style.animationName = 'none';
			play.style.marginLeft = left - wrap.left + "px";
			play.style.width = right - left + "px";

			var added = document.createElement('div');
			added.classList.add('block');
			added.style.width = play.style.width;
			color = app.randomColor();
			console.log(color);
			added.style.background = 'rgb('+ color +')';
			last.id = '';
			play.id = 'last';
			added.id = 'play';

			app.score ++;
			wrapper.appendChild(added);
		}else{
			play.outerHTML = '';
			delete play;
			app.lose = true;
			document.getElementById('lose').classList.add('active');
		}
	}
}