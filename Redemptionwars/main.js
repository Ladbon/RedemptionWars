var DIR_LEFT  = 0;
var DIR_RIGHT = 1;
var DIR_UP    = 2;
var DIR_DOWN  = 3;

/*
TO-DO:
Add score and score counter.
Loosing conditions.
Score screen.
Collisions.
Score.
*/

enchant();
window.onload = function() {
   
    var game = new Core(320, 320);
    game.fps = 35;
    game.preload(
		'characters.gif','maptiles.gif','background.gif','bullet.png','font0.png');
		
	var map = new Map(16, 16);
	
	game.score = 0;
	ScoreSafeTimer = 200;
	
	scoreLabel = new Label("Score: ");
	scoreLabel.color = '#FFF';
	
	scoreLabelActual = new Label(game.score);
	scoreLabelActual.color = '#FFF';
	scoreLabelActual.x = 16,scoreLabelActual.y = 16;;
	//scoreLabel.font = "8px font0";
	/*
	scoreLabel = new ScoreLabel(8,8);
	game.rootScene.addChild(scoreLabel);*/
	
	
	EnemyAngel = Class.create(Sprite,{
		initialize:function(x,y,p_direction,p_map){
			Sprite.call(this,32,32);
			this.x=x;
			this.y=y;
			this.frame = 16;
			this.alive = true;
			this.falling = false;
			this.fallspeed = 1;
			this.direction = p_direction;
			/*if(enemies.length>0){
				for(i=0;i<enemies.length;i++){
					if(enemies[i].alive==false)
					{
						enemies[i]=this;
						break;
					}
					else{enemies[enemies.length]=this;}
				}
			}
			else{enemies[0]=this;}*/
			//EnemyAngel.collection;
			this.image = game.assets['characters.gif'];
			game.rootScene.addChild(this);
		},
		onenterframe:function(){
			if(this.direction==DIR_RIGHT)
			{
				this.x++;
				this.frame = 20;
                if (map.hitTest(this.x + 16, this.y + 32)) this.x--;
			}
			else
			{
				this.x--;
				this.frame = 16;
                if (map.hitTest(this.x + 16, this.y + 32)) this.x++;
			}
			
			if(this.falling==true){
				this.fallspeed += 0.2;
				if(this.fallspeed>8){this.fallspeed=8;}
			}
			
			this.y += this.fallspeed;
			this.falling=true;
			if (map.hitTest(this.x + 16, this.y + 32)){
				this.y -= this.fallspeed;
				this.fallspeed = 1;
				this.falling=false;
			}
			
			if(this.x>15*16&&this.y>40)
			{
				game.rootScene.removeChild(this);
				delete this;
				game.score -= 10;
			}
			else if(this.x<3*16&&this.y>40)
			{
				game.rootScene.removeChild(this);
				delete this;
				game.score -= 10;
			}
		}
	});
		
	EnemyDevil = Class.create(Sprite,{
		initialize:function(x,y,p_direction,p_map){
			Sprite.call(this,32,32);
			this.x=x;
			this.y=y;
			this.frame = 24;
			this.alive = true;
			this.falling = false;
			this.fallspeed = 1;
			this.direction = p_direction;
			this.image = game.assets['characters.gif'];
			game.rootScene.addChild(this);
		},
		onenterframe:function(){
			if(this.direction==DIR_RIGHT)
			{
				this.x++;
				this.frame = 28;
                if (map.hitTest(this.x + 16, this.y + 32)) this.x--;
			}
			else
			{
				this.x--;
				this.frame = 24;
                if (map.hitTest(this.x + 16, this.y + 32)) this.x++;
			}
			
			if(this.falling==true){
				this.fallspeed += 0.2;
				if(this.fallspeed>8){this.fallspeed=8;}
			}
			
			this.y += this.fallspeed;
			this.falling=true;
			if (map.hitTest(this.x + 16, this.y + 32)){
				this.y -= this.fallspeed;
				this.fallspeed = 1;
				this.falling=false;
			}
			
			if(this.x>280)
			{
				this.direction = DIR_LEFT;
			}
			else if(this.x<20)
			{
				this.direction = DIR_RIGHT;
			}
			
			//förstör när fienden är exakt vid nedre kapitalet
			if(this.y>260&&this.x>120&&this.x<140)
			{
				game.rootScene.removeChild(this);
				delete this;
				game.score -= 10;
			}
			//förstör när fienden är exakt vid nedre kapitalet
			if(this.y>260&&this.x>140&&this.x<170)
			{
				game.rootScene.removeChild(this);
				delete this;
				game.score -= 10;
			}
		}
	});
	
	bullets = [];
	Bullet = Class.create(Sprite,{
		initialize:function(x,y,playerdirection){
			Sprite.call(this,10,6);
			this.frame=0;
			this.x=x+8;
			this.y=y+16;
			this.direction = playerdirection;
			bullets[bullets.length]=this;
			this.image = game.assets['bullet.png'];
			game.rootScene.addChild(this);
		},
		onenterframe:function(){
			if(this.direction==DIR_RIGHT){this.x += 4;}
			else{this.x -= 4;this.frame=1;}
			for(i=0;i<EnemyDevil.collection.length;i++)
			{
				var enemy = EnemyDevil.collection[i];
/*				if(this.x<320)
					console.log(this.x+","+this.y+"   "+enemy.x+","+enemy.y);
*/				if(this.within(enemy,32))
						this.intersect(enemy);
				if(this.intersect(enemy)==true&&enemy.alive==true){
					enemy.alive=false;
					game.rootScene.removeChild(enemy);
//					delete enemies[i];
					if(enemy==false){enemy.x = 16}
					game.rootScene.removeChild(this);
					delete this;
					game.score += 10;
				}
			}
			for(i=0;i<EnemyAngel.collection.length;i++)
			{
				var enemy = EnemyAngel.collection[i];
				if(this.intersect(enemy)==true&&enemy.alive==true){
					enemy.alive=false;
					game.rootScene.removeChild(enemy);
//					delete enemies[i];
					if(enemy==false){enemy.x = 16}
					game.rootScene.removeChild(this);
					delete this;
					game.score += 10;
				}
			}
				console.log(EnemyDevil.collection.length);
			
			if(this.x<0){game.rootScene.removeChild(this);delete this;}
			else if(this.y<0){game.rootScene.removeChild(this);delete this;}
			else if(this.y>320){game.rootScene.removeChild(this);delete this;}
			else if(this.y>320){game.rootScene.removeChild(this);delete this;}
		}
	});
	
    game.onload = function() {
		/*
		scoreLabel = new ScoreLabel(8,8);
		game.rootScene.addChild(scoreLabel);*/
		
        map.image = game.assets['maptiles.gif'];
		
    	map.loadData([
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
			[ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7,14,15,27,27,27,27,27,27,17,18,27,27,27,27,27,27,14,15, 7],
            [ 7,21,22,27,27,27,27,27,27,24,25,27,27,27,27,27,27,21,22, 7],
            [ 7, 8, 9, 9,10,27,27,16,23,23,23,23,26,27,27, 8, 9, 9,10, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7,27,27,27, 8,28,29,26,27,27,27,27,16,19,20,10,27,27,27, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7, 8, 9, 9,10,27,27,16,23,23,23,23,26,27,27, 8, 9, 9,10, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7, 4, 5,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 4, 5, 7],
            [ 7,11,12,27,27,27,27,27,27,27,27,27,27,27,27,27,27,11,12, 7],
            [ 7, 3,13,13,13,13,13,13, 6,27,27, 3,13,13,13,13,13,13, 6, 7],
            [ 7,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27, 7],
            [ 7,27,27,27,27,27,27,27,27, 4, 5,27,27,27,27,27,27,27,27, 7],
            [ 7,27,27,27,27,27,27,27,27,11,12,27,27,27,27,27,27,27,27, 7],
            [ 3,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13, 6]
        ]);
        map.collisionData = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1],
            [1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1],
            [1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
            [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,1],
            [1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
		
		var backgroundsprite = new Sprite(320, 320);
        backgroundsprite.image = game.assets['background.gif'];
		
        var player = new Sprite(32, 32);
        player.image = game.assets['characters.gif'];
        player.x = 5 * 16-1;
        player.y = 6 * 16-1;
		player.movespeed = 3;
		player.fallspeed = 1;
		player.BaseJumpPower = 7.5;
		player.JumpPower = player.BaseJumpPower;
		player.CanJump = false;
		player.Jumping = false;
		player.Falling = true;
		player.Alive = true;
        player.dir = DIR_RIGHT;
		player.CanShoot = false;
		player.ShootCountDown = 120;
        
		var player2 = new Sprite(32, 32);
        player2.image = game.assets['characters.gif'];
        player2.x = 13 * 16-1;
        player2.y = 6 * 16-1;
		player2.movespeed = 3;
		player2.fallspeed = 1;
		player2.BaseJumpPower = 7.5;
		player2.JumpPower = player2.BaseJumpPower;
		player2.CanJump = false;
		player2.Jumping = false;
		player2.Falling = true;
		player2.Alive = true;
        player2.dir = DIR_LEFT;
		player2.CanShoot = false;
		player2.ShootCountDown = 120;
		
		//controls player1
		game.keybind(65, 'left'); //player1 left
		game.keybind(68, 'right'); //player1 right
		game.keybind(87, 'up'); //player1 jump
		//controls player2
		game.keybind(74, 'a'); //player2 left
		game.keybind(76, 'b'); //player2 right
		game.keybind(73, 'down'); //player2 jump
		
		//animation player1
        player.anim = [
            0, 1, 2, 3,  //Left
            4, 5, 6, 7,  //Right
            0, 0, 0, 0,  //Up
            0, 0, 0, 0]; //Down
		//animation player2
        player2.anim = [
            8, 9, 10, 11,  //Left
            12,13,14,15,  //Right
            0, 0, 0, 0,  //Up
            0, 0, 0, 0]; //Down
        
		//enemy spawn timers
		EnemyAngelSpawntimerBase = 250;
		EnemyAngelSpawntimerCurrent = EnemyAngelSpawntimerBase;
		EnemyAngel2SpawntimerBase = 260;
		EnemyAngel2SpawntimerCurrent = EnemyAngelSpawntimerBase+60;
		DevilSpawntimerBase = 240;
		DevilSpawntimerCurrent = DevilSpawntimerBase-30;
		Devil2SpawntimerBase = 245;
		Devil2SpawntimerCurrent = Devil2SpawntimerBase+30;
		
		EnemyAngelSpawntimerBase = 120;
		
        game.addEventListener(Event.ENTER_FRAME, function() {
			//gravity
			if(player.Falling==true){
				player.fallspeed += 0.2;
				if(player.fallspeed>8){player.fallspeed=8;}
			}
			
			player.y += player.fallspeed;
			player.Falling=true;
			if (map.hitTest(player.x + 16, player.y + 32)){
				player.y -= player.fallspeed;
				player.fallspeed = 1;
				player.CanJump=true;
				player.Falling=false;
			}
			
			if(player2.Falling==true){
				player2.fallspeed += 0.2;
				if(player2.fallspeed>8){player2.fallspeed=8;}
			}
			
			player2.y += player2.fallspeed;
			player2.Falling=true;
			if (map.hitTest(player2.x + 16, player2.y + 32)){
				player2.y -= player2.fallspeed;
				player2.fallspeed = 1;
				player2.CanJump=true;
				player2.Falling=false;
			}
			
			// Player1 shoots
			player.ShootCountDown--;
			if(player.ShootCountDown<0&&player.Alive==true){
					var bullet = new Bullet(player.x,player.y,player.dir);
				player.ShootCountDown=30;
			}
			// Player2 shoots	
			player2.ShootCountDown--;
			if(player2.ShootCountDown<0&&player2.Alive==true){
					var bullet = new Bullet(player2.x,player2.y,player2.dir);
				player2.ShootCountDown=30;
			}
			
            //Player1 move left
            if (game.input.left) {
                player.dir = DIR_LEFT;
                player.x -= player.movespeed;
                if (map.hitTest(player.x + 16, player.y + 32)) player.x += player.movespeed;
            }
            //Player1 move right
            else if (game.input.right) {
                player.dir = DIR_RIGHT;
                player.x += player.movespeed;
                if (map.hitTest(player.x + 16, player.y + 32)) player.x -= player.movespeed;
            } 
            //Player1 JUMP
			if(player.Jumping==true){
				player.y -= player.jumpPower;
				player.jumpPower -= 0.1;
                if (map.hitTest(player.x + 16, player.y + 32)){
					player.y += player.jumpPower;
					player.Jumping = false;
				}
			}
            if (game.input.up&&player.CanJump==true&&player.Falling==false){
				player.Jumping = true;
				player.CanJump = false;
				player.jumpPower = player.BaseJumpPower;
            }
			
            //Player2 move left
            if (game.input.a) {
                player2.dir = DIR_LEFT;
                player2.x -= player2.movespeed;
                if (map.hitTest(player2.x + 16, player2.y + 32)) player2.x += player2.movespeed;
            }
			//Player2 move right
            else if (game.input.b) {
                player2.dir = DIR_RIGHT;
                player2.x += player2.movespeed;
                if (map.hitTest(player2.x + 16, player2.y + 32)) player2.x -= player2.movespeed;
            }
            //Player2 JUMP
			if(player2.Jumping==true){
				player2.y -= player2.jumpPower;
				player2.jumpPower -= 0.1;
                if (map.hitTest(player2.x + 16, player2.y + 32)){
					player2.y += player2.jumpPower;
					player2.Jumping = false;
				}
			}
            if (game.input.down&&player2.CanJump==true&&player2.Falling==false){
				player2.Jumping = true;
				player2.CanJump = false;
				player2.jumpPower = player2.BaseJumpPower;
            }
			
            //Frame setting player1
            if (!game.input.left && !game.input.right) player.age = 1;//Standing Still
            player.frame = player.anim[player.dir * 4 + (player.age % 4)];
			//Frame setting player2
            if (!game.input.a && !game.input.b) player2.age = 1;//Standing Still
            player2.frame = player2.anim[player2.dir * 4 + (player2.age % 4)];
			
			//Spawn enemy angel from left
			EnemyAngelSpawntimerCurrent--;
			if(EnemyAngelSpawntimerCurrent<0)
			{
				var enemyangel = new EnemyAngel(16*2,16*2-1,DIR_RIGHT,map);
				EnemyAngelSpawntimerCurrent=EnemyAngelSpawntimerBase+Math.random()*10;
			}
			//Spawn enemy angel from right
			EnemyAngel2SpawntimerCurrent--;
			if(EnemyAngel2SpawntimerCurrent<0)
			{
				var enemyangel = new EnemyAngel(16*16-1,16*2-1,DIR_LEFT,map);
				EnemyAngel2SpawntimerCurrent=EnemyAngel2SpawntimerBase+Math.random()*10;
			}
			/*
			DevilSpawntimerBase = 120;
			DevilSpawntimerCurrent = DevilSpawntimerBase-30;
			Devil2SpawntimerBase = 120;
			Devil2SpawntimerCurrent = Devil2SpawntimerBase+30;*/
			//Spawn enemy devil from right
			DevilSpawntimerCurrent--;
			if(DevilSpawntimerCurrent<0)
			{
				var enemyangel = new EnemyDevil(16*10-1,16*2-1,DIR_RIGHT,map);
				DevilSpawntimerCurrent=DevilSpawntimerBase+Math.random()*10;
			}
			//Spawn enemy devil from left
			Devil2SpawntimerCurrent--;
			if(Devil2SpawntimerCurrent<0)
			{
				var enemyangel = new EnemyDevil(16*8-1,16*2-1,DIR_LEFT,map);
				Devil2SpawntimerCurrent=Devil2SpawntimerBase+Math.random()*10;
			}
			/*EnemyAngel2SpawntimerCurrent*/
			
			//player dies, collision with enemy
			for(i=0;i<EnemyAngel.collection.length;i++)
			{
				var enemy = EnemyAngel.collection[i];
				if(player.intersect(enemy)==true&&enemy.alive==true){
					player.Alive = false;
					stage.removeChild(player);
					delete player;
					game.score += 10;
				}
			}
			for(i=0;i<EnemyDevil.collection.length;i++)
			{
				var enemy = EnemyDevil.collection[i];
				if(player.intersect(enemy)==true&&enemy.alive==true){
					player.Alive = false;
					stage.removeChild(player);
					delete player;
					game.score += 10;
				}
			}
			//player2 dies, collision with enemy
			for(i=0;i<EnemyAngel.collection.length;i++)
			{
				var enemy = EnemyAngel.collection[i];
				if(player2.intersect(enemy)==true&&enemy.alive==true){
					player2.Alive = false;
					stage.removeChild(player2);
					delete player2;
					game.score += 10;
				}
			}
			for(i=0;i<EnemyDevil.collection.length;i++)
			{
				var enemy = EnemyDevil.collection[i];
				if(player2.intersect(enemy)==true&&enemy.alive==true){
					player2.Alive = false;
					stage.removeChild(player2);
					delete player2;
					game.score += 10;
				}
			}
			//Game over
			if(player.Alive == false && player2.Alive == false){game.stop();}
			//game.end(game.score, "SCORE: " + game.score);
			ScoreSafeTimer--;
			if(ScoreSafeTimer<0){ScoreSafeTimer=0;}
			if(ScoreSafeTimer==0&&game.score<0){game.stop();}
        });
		
        //Group creation
		var stage = new Group();
		stage.addChild(backgroundsprite);
		stage.addChild(map);
		stage.addChild(player);
		stage.addChild(player2);
		stage.addChild(scoreLabel);
		game.rootScene.addChild(stage);
//		game.addChild(bullet);

        //Periodic processing of the scene
		/*
        game.rootScene.addEventListener(Event.ENTER_FRAME, function(e) {
            //Set stage XY coordinates
            var x = Math.min((game.width  - 16) / 2 - player.x, 0);
            var y = Math.min((game.height - 16) / 2 - player.y, 0);
            x = Math.max(game.width,  x + map.width)  - map.width;
            y = Math.max(game.height, y + map.height) - map.height;
            stage.x = x;
            stage.y = y;
        });
		*/

    };
    game.start();
};


function calcLen(x0, y0, x1, y1) {
    return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}