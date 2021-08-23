class Game{
    constructor(){
        // state in game
        this.started = false;
        this.paused = false;
        this.over = false;
        this.submitted = false;
        this.invisible = false;

        this.onPause = false;
        this.onShoot = false;
        this.onInvisible = false;

        // numeric state
        this.fuel = 20;
        this.decreaseFuel = 0;
        this.score = 0;
        this.timer = 0;
        this.fontSize = 1.5;
        this.volume = 1;

        // object list
        this.object = [];
        this.player = {};
        this.temp = [];

        // audio
        this.audio = {
            bg: new Audio('sound/bg.mp3'),
            destroy: new Audio('sound/destroy.mp3'),
            shoot: new Audio('sound/shoot.mp3'),
            blast: new Audio('sound/boom.mp3'),
            invisible: new Audio('sound/invisible.mp3')
        };

        this.audio.bg.loop = true;
        this.audio.invisible.loop = true;
        $("#submit").prop('disabled', true);
        this.listener();
    }

    // check animation available
    isCan(state = 0){
        return this.started && (!this.paused || state) && !this.over;
    }

    // set animation state
    setState(state){
        $('.animation').css('animation-play-state', state ? 'running' : 'paused');

        if(state){
            $("#player").removeClass('stop');
        }else{
            $("#player").addClass('stop');
        }
    }

    // set volume
    setVolume(volume){
        for(let key in this.audio){
            this.audio[key].volume = volume;
        }
    }

    // bindMute and Pause
    bindMute(muted, paused, isChange = 0){
        if(muted && !paused){
            this.setVolume(this.volume);
        }else{
            this.setVolume(0);
        }

        if(isChange){
            this.muted = !muted;
        }
    }

    bindPause(paused){
        this.paused = !paused;
        this.bindMute(!this.muted, this.paused);
    }

    // listen event
    listener(){
        $(window).on('keydown', (e) => {
            let a = e.keyCode;
            if(e.ctrlKey && a === 83){ //s
                this.fontSize -= 0.1;
                this.updateFont();
                e.preventDefault();
            }

            else if(e.ctrlKey && a === 65){ //a
                this.fontSize += 0.1;
                this.updateFont();
                e.preventDefault();
            }

            else if(e.ctrlKey && a === 189){ //-
                this.volume -= 0.1;
                this.volume = Math.max(0, Math.min(1, this.volume));
                this.setVolume(this.muted || this.paused ? 0 : this.volume);
                e.preventDefault();
            }

            else if(e.ctrlKey && a === 187){ //+
                this.volume += 0.1;
                this.volume = Math.max(0, Math.min(1, this.volume));
                this.setVolume(this.muted || this.paused ? 0 : this.volume);
                e.preventDefault();
            }

            else if(e.ctrlKey && a === 77){ //m
                this.bindMute(this.muted, this.paused, 1);
                e.preventDefault();
            }

            if(this.isCan()){
                if(e.ctrlKey && a === 66){ //b
                    this.blast();
                    e.preventDefault();
                }

                else if(e.ctrlKey && a === 73 && !this.onInvisible){ //i
                    this.invisible = !this.invisible;
                    this.updateInvisible();
                    e.preventDefault();
                }

                else if(a === 32 && !this.onShoot){
                    this.playSound('shoot');
                    this.player.shoot();
                    this.onShoot = true;
                    e.preventDefault();
                }
            }

            if(this.isCan(1) && e.ctrlKey && a === 80 && !this.onPause){
                this.bindPause(this.paused);
                this.onPause = false;
                e.preventDefault();
            }
        }).on('keyup', (e) => {
            let a = e.keyCode;
            if(a === 32){
                this.onShoot = false;
                e.preventDefault();
            }else if(a === 80){
                this.onPause = false;
                e.preventDefault();
            }else if(a === 73){
                this.onInvisible = false;
            }
        });
        
        $("#start").on('click', () => {
            this.start();
        });

        $("#restart").on('click', () => {
            location.reload();
        });

        $("#name").on('input', () => {
            if($("#name").val() !== '') $("#submit").prop('disabled', false);
            else $("#submit").prop('disabled', true);
        }).on('keypress', (e) => {
            if(e.keyCode === 13 && $("#name").val() !== '') this.submit();
        });

        $("#gameboard").on('mousemove', (e) => {
            let container = $(".container")[0];
            this.player.move(e.pageX - container.offsetLeft, e.pageY - container.offsetTop);
        });

        $("#submit").on('click', ()=>{
            if($("#name").val() !== '') this.submit();
        })
    }

    // play sound
    playSound(sound){
        if(navigator.userAgent.indexOf('Chrome') !== -1){
            this.audio[sound].currentTime = 0;
        }else{
            this.audio[sound].currentTime = 0.1;
        }
        this.audio[sound].play();
    }

    // start game
    start(){
        if(this.started) return;
        this.audio.bg.play();
        this.generate();
        this.started = true;
        $("#ready").removeClass('active');
        this.update();
    }

    // generate objects
    generate(){
        this.generatePlayer();
        this.generateEnemy();

        setTimeout(()=>{
            this.generateAsteroid();
        }, 500);

        setTimeout(()=>{
            this.generateFriend();
        }, 1000);

        setTimeout(()=>{
            this.generateFuel();
            this.generateComet();
        }, 4000);
    }

    generatePlayer(){
        this.player = new Player();
    }

    generateEnemy(){
        if(this.isCan()){
            this.object.push(new Enemy());
        }

        setTimeout(()=>{
            this.generateEnemy();
        }, 1500);
    }

    generateAsteroid(){
        if(this.isCan()){
            this.object.push(new Asteroid());
        }

        setTimeout(()=>{
            this.generateAsteroid();
        }, 2000);
    }

    generateFriend(){
        if(this.isCan()){
            this.object.push(new Friend());
        }

        setTimeout(()=>{
            this.generateFriend();
        }, 2500);
    }

    generateFuel(){
        if(this.isCan()){
            this.object.push(new Fuel());
        }

        setTimeout(()=>{
            this.generateFuel();
        }, 4000);
    }

    generateComet(){
        if(this.isCan()){
            this.object.push(new Comet());
        }

        setTimeout(()=>{
            this.generateComet();
        }, 6000);
    }

    // filter element outside gameboard
    filterElement(){
        this.object.forEach((object, i) => {
            if(object.x < -150 || object.x > 1650
            || object.y < -150 || object.y > 950){
                this.temp.push(i);
            }
        });
    }

    // detect object collision
    detectCollision(){
        let object = [...this.object, this.player];
        let detected = false;

        object.forEach((first, i) => {
            detected = false;
            object.forEach((second, j) => {
                if(first.x < second.x + second.w && first.x + first.w > second.x
                && first.y < second.y + second.h && first.y + first.h > second.y
                && i !== j){
                    let firstName = first.constructor.name;
                    let secondName = second.constructor.name;

                    if(firstName === 'Bullet' && first.sx > 0 && !detected){
                        if(secondName === 'Enemy' || secondName === 'Friend' || (secondName === 'Asteroid' && second.life === 1)){
                            this.playSound('destroy');
                            this.temp.push(i, j);
                            this.score += second.score;
                            this.explode(second.x, second.y, second.w, second.h);
                            this.flyScore(second.x, second.y, second.w, second.h, second.score);
                            detected = true;
                        }
                        else if(secondName === 'Asteroid' && second.life === 2){
                            this.temp.push(i);
                            this.object[j].object.attr('data-life', 1);
                            this.object[j].life = 1;
                            detected = true;
                        }
                    }

                    else if(firstName === 'Player'){
                        if(!this.invisible && (secondName === 'Enemy' || secondName === 'Friend' || secondName === 'Asteroid' || (secondName === 'Bullet' && second.sx < 0))){
                            this.playSound('destroy');
                            this.temp.push(j);
                            this.fuel -= 10;
                            this.explode(second.x, second.y, second.w, second.h);
                            this.animateRedLayer();
                        }

                        else if(secondName === 'Fuel'){
                            this.fuel += 20;
                            this.temp.push(j);
                        }
                    }

                    else if(firstName === 'Blast'){
                        if(secondName === 'Friend' || secondName === 'Bullet' || secondName === 'Enemy' || secondName === 'Asteroid' || secondName === 'Fuel'){
                            this.temp.push(j);
                            this.explode(second.x, second.y, second.w, second.h);
                        }
                    }
                }
            })
        })
    }

    // remove unwanted element
    removeElement(){
        for(let i = this.object.length - 1; i >= 0; i--){
            let index = this.temp.indexOf(i);
            if(index !== -1){
                this.object[i].object.remove();
                if(this.object[i].interval) clearInterval(this.object[i].interval);
                this.object.splice(i, 1);
            }
        }

        this.temp = [];
    }

    // blast
    blast(){
        if(this.fuel >= 20){
            this.playSound('blast');
            this.object.push(new Blast());
            this.fuel -= 20;
        }
    }

    // explode particle
    explode(x, y, w, h){
        let sx = x + (w / 2);
        let sy = y + (h / 2);

        for(let i = 0; i < 8 ; i++){
            let rad = Math.floor(Math.random() * 360);
            let speed = Math.floor(Math.random() * 3) + 3;
            let x = Math.cos(rad * Math.PI / 180) * speed;
            let y = Math.sin(rad * Math.PI / 180) * speed;

            this.object.push(new Particle(sx, sy, x, y))
        }
    }

    // flying score
    flyScore(x, y, w, h, score){
        let sx = x + (w / 2) - 40;
        let sy = y + (h / 2) - 40;

        this.object.push(new Score(sx, sy, score));
    }

    // animate red layer
    animateRedLayer(){
        let elem = $('.red-layer');
        if(elem.hasClass('animate-1')){
            elem.removeClass('animate-1').addClass('animate-2');
        }else{
            elem.removeClass('animate-2').addClass('animate-1');
        }
    }

    // update every refresh rate
    update(){
        if(this.isCan()){
            this.filterElement();
            this.detectCollision();
            this.removeElement();
            this.object.forEach((object) => {
                object.update();
            });

            this.player.update();
            this.updateScore();
            this.updateTimer();
            this.updateFuel();
            this.checkLose();
        }

        this.setState(this.isCan());
        requestAnimationFrame(this.update.bind(this));
    }

    updateInvisible(){
        if(this.invisible){
            this.playSound('invisible');
            $("#player").addClass('invisible');
        }else{
            this.audio['invisible'].pause();
            $("#player").removeClass('invisible');
        }
    }

    updateFont(){
        $(".font-control").css({
            fontSize: this.fontSize + "em"
        });
    }

    updateScore(){
        $("#score").html(this.score);
    }

    updateTimer(){
        this.timer += (1 / 60);

        $("#timer").html(Math.floor(this.timer));
    }

    updateFuel(){
        this.decreaseFuel += (1 + this.invisible) / 60;

        if (!this.invisible && this.decreaseFuel >= 1) {
            this.fuel -= 1;
            this.decreaseFuel -= 1;
        } else if (this.invisible && this.decreaseFuel >= 2) {
            this.fuel -= 2;
            this.decreaseFuel -= 2;
        }

        this.fuel = Math.max(0, Math.min(40, this.fuel));

        $("#fuel").html(Math.ceil(this.fuel));

        $(".bar .fill").css({
            width: Math.floor(this.fuel * 100 / 40 * 5) / 5 + "%"
        });
    }

    // check whether the fuel empty
    checkLose(){
        if(this.fuel <= 0){
            this.over = true;
            $("#modal").addClass('active');
            this.bindMute(false, false);
            $("#modal input").focus();
        }
    }

    // submit score to local Storage
    submit(){
        if(this.submitted) return;
        this.submitted = true;

        let data = {
            name: $("#name").val(),
            time: Math.floor(this.timer),
            score: this.score
        };

        let score = JSON.parse(localStorage.getItem('02_client_side_03_highscore')) || [];

        score.push(data);

        localStorage.setItem('02_client_side_03_highscore', JSON.stringify(score));
        
        score.sort((a, b) => {
            if(+b.score !== +a.score){
                return +b.score - +a.score;
            }
            return +b.time - +a.time;
        });

        let html = '';
        let position = 1;

        for(let i = 0; i < score.length; i++){
            if(i && (score[i].score !== score[i - 1].score || score[i].time !== score[i - 1].time)) position++;

            html += `
                <tr>
                    <td>${position}</td>  
                    <td>${score[i].name}</td>  
                    <td>${score[i].score}</td>  
                    <td>${score[i].time}</td>  
                </tr>
            `;
        }


        $("#modal").removeClass('active');
        $("#over table tbody").html(html);
        $("#over").addClass('active');
    }

}