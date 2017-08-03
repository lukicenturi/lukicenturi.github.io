ctx = $("#canvas")[0].getContext('2d');

window.onload = function(){
	init();
}

function init(){
	game = new Game();
}

class Game{
	constructor(){
		this.image = new Image;
		this.image.src = 'assets/images/default.png';
		this.width = 100;
		this.size = 8;
		this.black = 1;
		this.white = 2;
		this.turn = this.black;
		this.board = [
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,this.black,this.white,0,0,0],
			[0,0,0,this.white,this.black,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
		];

		// this.board = [
		// 	[this.black,this.black,this.black,this.black,this.black,this.black,this.black,this.black],
		// 	[this.black,this.black,this.black,this.black,this.black,this.black,this.black,this.black],
		// 	[this.black,this.black,this.black,this.black,this.black,this.black,this.black,this.black],
		// 	[this.black,0,0,this.black,this.white,0,0,0],
		// 	[this.black,this.black,this.black,this.white,this.black,this.black,this.black,this.black],
		// 	[this.black,this.black,this.black,this.black,this.black,this.black,this.black,this.black],
		// 	[this.black,this.black,this.black,this.black,this.black,this.black,this.black,this.black],
		// 	[this.black,this.black,this.black,0,0,0,this.black,this.white],
		// ];

		this.start = false;
		this.over = false;

		this.sumblack = 0;
		this.sumwhite = 0;

		this.milisecond = 0;
		this.array = [];
		this.template = $("#template")[0];
		this.init();
		this.listener();
		this.setHighscore();
		this.cekLocal();
		this.listing();
	}

	cekLocal(){
		if(localStorage.luki){
			this.board = JSON.parse(localStorage.board);
			this.turn = JSON.parse(localStorage.turn);
			this.milisecond = JSON.parse(localStorage.milisecond);
			this.image.src = JSON.parse(localStorage.image);
			this.startClick();
			if(this.turn == this.white) this.bot();
		}
	}

	setHighscore(){
		let highscore = [];
		if(localStorage.luki_othello_highscore !== undefined) highscore = JSON.parse(localStorage.luki_othello_highscore);

		console.log(highscore);

		highscore.sort((a,b)=>{
			return a[2] < b[2];
		});
		let iter = 0;
		highscore.forEach((high)=>{
			iter ++;
			let template = $(this.template).clone()[0];
			$(template).children('div').children('img').attr('src',high[0]);
			$(template).children('div').children('.header-highscore').children('.nickname').html(iter +'. ' +high[1]);
			$(template).children('div').children('.header-highscore').children('.winner').html(high[2]);
			$(template).children('div').children('.header-highscore').children('.loser').html(high[3]);
			$(template).children('div').children('.detail-highscore').children('span:first-child').html(high[4]);
			$(template).children('div').children('.detail-highscore').children('span:last-child').html(high[5] + " sec");


			$('.list-toggle ul').append(template);
		})
	}

	save(){
		let nickname = $("#nickname").val();
		if(nickname == '') nickname = 'Anonymous';


		let highscore = [];
		if(localStorage.luki_othello_highscore !== undefined) highscore = JSON.parse(localStorage.luki_othello_highscore);

		let date = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear();

		let second = Math.floor(this.milisecond / 1000);
		let array = [this.image.src, nickname, this.sumblack, this.sumwhite, date, second];

		highscore.push(array);
		console.log(highscore);

		localStorage.luki_othello_highscore = JSON.stringify(highscore);
		$("#restart").click();
	}

	init(){
		$("#gameboard").hide();
		$("#over").hide();
	}

	listener(){
		$("#file").on('change', (e)=>{
			let files = e.target.files[0];
			this.prev(files);
		});
		$("#start").on('click', (e)=>{
			e.preventDefault();
			e.stopPropagation();
			this.startClick();
		});
		$("#save").on('click', (e)=>{
			e.preventDefault();
			e.stopPropagation();
			this.save();
		});

		$("#canvas").on('click', (e)=>{
			if(this.turn == this.white) return;
			let x = Math.floor(e.offsetX / this.width);
			let y = Math.floor(e.offsetY / this.width);
			this.click(y,x);
		});
		$("#restart").on('click', (e)=>{
			localStorage.removeItem('luki');
			location.reload();
		})
	}

	prev(files){
		if(files.type != 'image/jpge' && files.type != 'image/png' && files.size < 1024 * 1024){
			let reader = new FileReader();
			reader.onload = (e)=>{
				this.image.src = e.target.result;
			}
			reader.readAsDataURL(files);

		}else{
			alert("Your file is not image or the size is too big.");
			$("#file").val('');
		}
	}

	listing(){
		this.sumblack = 0;
		this.sumwhite = 0;
		this.array = [];
		for(let i  = 0 ; i < this.size ; i++){
			for(let j = 0 ; j < this.size ; j++){
				if(this.board[i][j] == this.black) this.sumblack ++;
				else if(this.board[i][j] == this.white) this.sumwhite ++;
				if(this.board[i][j] != 0) continue;
				let array = this.around(i,j);
				if(array.length > 0) this.array[i+"|"+j] = array;
			}
		}
		$("#black").html(this.sumblack);
		$("#white").html(this.sumwhite);

		console.log(Object.keys(this.array).length);
		if(this.sumblack + this.sumwhite == 64 || Object.keys(this.array).length == 0){
			this.done();
		}
	}

	done(){
		if(this.sumblack > this.sumwhite){
			this.over = true;
			$("#over").fadeIn();
		}else{
			alert("You can\'t win. Just Try Again");
			$('#restart').click();
		}
	}
	
	around(i,j){
		let sum = 0;
		let array = [];
		let enemy = (this.turn % 2) + 1;
		for(let y = -1 ; y < 2; y++){
			for(let x = -1 ; x < 2 ; x++){
				if(i + y < 0 || i + y >= this.size || j + x < 0 || j + x >= this.size || (y == 0 && x == 0) || this.board[i + y][j + x] != enemy) continue;
				sum = this.count(i,j,y,x);
				if(sum > 0) array.push([i,j,y,x,sum]);
			}
		}
		return array;
	}

	count(i,j,y,x){
		let sum = 0;
		i += y;
		j += x;
		while(i >= 0 && i < this.size && j >= 0 && j < this.size && this.board[i][j] != this.turn){
			if(this.board[i][j] == 0){
				sum = 0;
				break;
			}
			sum ++;
			i+=y;
			j+=x;
		}

		if(i < 0 || i >= this.size || j < 0 || j >= this.size){
			sum = 0;
		}

		return sum;
	}
	// click
	click(y,x){
		if(this.array[y+'|'+x]){
			this.array[y+'|'+x].forEach((array)=>{
				this.execute(array);
			})
			this.turn = (this.turn % 2) + 1;
			this.listing();
			if(this.turn == this.white) this.bot();
		}
	}
	// bot

	bot(){
		setTimeout(()=>{
			let curSum = 0;
			let curArray = [];
			for(let key in this.array){
				let sum = 0;
				this.array[key].forEach((arr)=>{
					sum += arr[4];
				});
				if(sum + Math.random() > curSum + Math.random()){
					curSum = sum;
					curArray = this.array[key];
				}
			}
			this.click(curArray[0][0], curArray[0][1]);
		},2000);
	}
	// execute point
	execute(array){
		let i = array[0];
		let j = array[1];
		let y = array[2];
		let x = array[3];
		let sum = array[4];
		this.board[i][j] = this.turn;
		for(let c = 0 ; c <= sum ; c++){
			this.board[i + y][j + x] = this.turn;
			i+=y;
			j+=x;
		}
	}

	startClick(){
		let image = this.image;
		image.width = 50;
		image.height = 50;
		$(".user-info img:first-child").remove();
		$(".user-info").prepend(image);
		this.started();
		localStorage.image = JSON.stringify(this.image.src);

	}

	started(){
		this.start = true;
		$("#ready").hide();
		$("#gameboard").show();
		this.draw();
	}
	// draw
	draw(){
		if(!this.start || this.over) return;
		this.saveLocal();
			// clear console
		// console.clear();
		for(let i = 0 ; i < this.size; i ++){
			for(let j = 0 ; j < this.size ; j++){
				ctx.beginPath();
				ctx.strokeStyle='black';
				ctx.rect(j * this.width , i* this.width, this.width, this.width);
				ctx.stroke();
				ctx.closePath();

				if(this.board[i][j] == 0) continue;
				if(this.board[i][j] == this.black) ctx.fillStyle = 'black';
				else if(this.board[i][j] == this.white) ctx.fillStyle = 'white';
				ctx.beginPath();
				ctx.arc(j * this.width + this.width / 2, i * this.width + this.width / 2, 0.4*this.width, 0 , Math.PI * 2);
				ctx.fill();
				ctx.closePath();
			}
		}

		this.milisecond += 50;

		if(this.milisecond % 1000 == 0){
			let time = Math.floor(this.milisecond / 1000);
			$("#time").html(time);
		}

		setTimeout(()=>{
			this.draw();
		},50)
	}

	saveLocal(){
		localStorage.setItem('luki',true);
		localStorage.board = JSON.stringify(this.board);
		localStorage.turn = JSON.stringify(this.turn);
		localStorage.milisecond = JSON.stringify(this.milisecond);
	}
}
