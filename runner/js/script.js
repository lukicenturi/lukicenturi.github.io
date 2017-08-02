var app = {
	lost:false,
	miliseconds:0,
	player:{
		x:0,
		y:0,
		stepY:-40,
		lane:1,
		scale:[0.8,1,1.2],
		index:[39,40,41]
	},
	init:function(){
		app.button();
		app.generateObstacles();
		app.st(0);
	},	
	button:function(){
		$("#startButton").click(function(e){
			e.preventDefault();
			$("#start").addClass('hide');
			app.startClick();
		});

		$("#restartButton").click(function(e){
			e.preventDefault();
			location.reload();
		});

		$(window).keydown(function(e){
			if(!app.lost){
				a = e.keyCode;
				if(a == 38 || a == 40){
					e.preventDefault();
					lane = app.player.lane;
					if(a == 38){
						lane -= 1;
					}else{
						lane += 1;
					}
					if(lane < 0 ) lane = 0;
					else if(lane > 2) lane = 2;

					app.player.lane = lane;
				}else if(a == 32){
					e.preventDefault();
					app.jump();
				}
			}
		})
	},
	startClick:function(){
		app.start();
	},
	start:function(){
		if(!app.lost){
			app.update();
			app.detectCollide();
			app.updateView();
			app.draw();
			app.miliseconds += 15;
		}
		setTimeout(function(){
			app.start();
		},15)
	},
	update:function(){
		keyPoints = runner_motion.getAttribute('keyPoints');
		x = keyPoints.split(';')[0];
		x = parseFloat(x);
		// if( x>= 0.15) app.lost = true;
		if(x >= 1){
			x = 1;
			app.endGame(true);
		}else{
			x += 0.0016;

			app.player.stepY -= 2;
			if(app.player.stepY < -40) app.player.stepY = -40;
			app.player.y += app.player.stepY;
			if(app.player.y < 0) app.player.y = 0;
		}
		app.player.x = x;
	},
	updateView:function(){
		x = app.player.x;
		if(x >= 0.002){
			$("#points").children().eq(0).addClass('active');
		}
		if(x >= 0.2){
			$("#points").children().eq(1).addClass('active');
			$("#panels").children().eq(1-1).addClass('active');
		}
		if(x >= 0.36){
			$("#points").children().eq(2).addClass('active');
			$("#panels").children().eq(2-1).addClass('active');
		}
		if(x >= 0.52){
			$("#points").children().eq(3).addClass('active');
			$("#panels").children().eq(3-1).addClass('active');
		}
		if(x >= 0.68){
			$("#points").children().eq(4).addClass('active');
			$("#panels").children().eq(4-1).addClass('active');
		}
		if(x >= 0.84){
			$("#points").children().eq(5).addClass('active');
			$("#panels").children().eq(5-1).addClass('active');
		}if(x >= 1){
			$(".panel").addClass('active');
		}
	},
	draw:function(){
		x = app.player.x;
		runner_motion.setAttribute('keyPoints',x+";1");
		window.scrollTo(x* 5300 - 300 ,0);

		app.st(-app.player.y);

		mod = app.miliseconds % 1000;
		state = mod / 1000 * 2;
		if(state > 1) state = 2 - state;
		rotate = state * 90;

		$("#armleft").css('transform','rotate('+rotate/2+'deg)');
		$("#armright").css('transform','rotate('+rotate*-2+'deg)');
		$("#leftleg").css('transform','rotate('+rotate*1.7+'deg)');
		$("#rightleg").css('transform','rotate('+rotate*-1.1+'deg)');
	},
	detectCollide:function(){
		r = $("#runner")[0].getBoundingClientRect();
		r1 = r.left;
		r2 = r.left + r.width;
		r3 = r.top;
		r4 = r.top + r.height;
		lane = app.player.lane;
		$(".obstacle").each(function(k,v){
			o = $(this)[0].getBoundingClientRect();
			o1 = o.left;
			o2 = o.left + o.width;
			o3 = o.top;
			o4 = o.top + o.height;
			lane1 = $(this).attr('lane');
			if( r1 < o2 && 
				r2 > o1 &&
				r3 < o4 && 
				r4 > o3 &&
				lane == lane1){
				app.endGame(false);
			}
		});
	},	
	jump:function(){
		if(app.player.y == 0){
			app.player.stepY = 40;
		}
	},
	st:function(y){
		$("#runner").css({
			'transform':'rotate(-5deg) translate(-50%, -100%) scale('+app.player.scale[app.player.lane]+') translateY(' +y+ 'px)',
		});
		$("#gamecontent").css({
			'z-index':app.player.index[app.player.lane]
		})
	},
	generateObstacles:function(){
		for(let i = 0 ; i < 5; i++){
			if(i < 3) lane = i;
			else lane = Math.floor(Math.random() * 3); 

			rand = Math.random();
			if(rand < 0.2) rand=  0.2;
			else if(rand > 0.8) rand = 0.8;

			x = rand * 5000;
			var obstacle = document.createElement('span');
			$(obstacle)
			.addClass('obstacle')
			.css('margin-left',x+"px")
			.attr('lane',lane)
			.appendTo('#runway'+lane);
		}
	},
	endGame:function(iswin){
		app.lost = true;
		if(iswin){
			$("#pyre").addClass('active');
			setTimeout(function(){
				$("#end").removeClass('hide');
				$("#end .error").addClass("hide");
			},1000);
		}else{
			$("#end").removeClass('hide');
			$("#end .success").addClass("hide");
		}
	}
}

window.onload = function(){
	app.init();
}