class MainGameScene extends Phaser.Scene {
    
    constructor() 
    {
        super({key: "MainGameScene"}); 
    }
    
    preload()
    {
        this.load.image('space-back', 'assets/images/space-back.jpg');
        this.load.image('player-ship', 'assets/images/player-ship.png');
        this.load.image('asteroid-medium', 'assets/images/asteroid-medium-01.png');
        this.load.image('mushroom', 'assets/images/mushroom.png');
        this.load.image('yosy', 'assets/images/yosy.png');
        this.load.image('bullet', 'assets/images/bullet-simple.png');
        this.load.image('bullet-fire', 'assets/images/bullet-fire.png');
        this.load.audio('main-game', 'assets/music/maingame.mp3');

    }

    create()
    {
        this.add.image(0, 0, 'space-back');
        
        this.music = this.sound.add('main-game');
        this.music.volume = 0.3;
        this.music.loop = true;
        this.music.play();
        
        this.asteroidTimer = 3000;
        
//keep track of whenever the player is using the cursor keys on the keyboard
        this.cursors = this.input.keyboard.createCursorKeys();            
        this.asteroidGroup = this.add.group();
        this.bulletGroup = this.add.group();

        this.createPlayerShip();
        this.createAsteroid(); 
        this.createBullet();
    }
    
    update(time, delta)
    {
        
        this.asteroidTimer -= delta;

        if ( this.asteroidTimer < 0 ) {
        this.createAsteroid();
        this.asteroidTimer = 3000;
    }
        
        let asteroids = this.asteroidGroup.getChildren();

        asteroids.forEach((asteroid) => {
        if ( asteroid.y > 1000 ) {
            asteroid.destroy();
        }
    });
        
        if (this.cursors.space.isDown) {
            this.createBullet();
        }
        
        if ( this.cursors.left.isDown ) {
            this.playerShip.setVelocityX(-100);
        }
            
        else if (this.cursors.right.isDown) {
            this.playerShip.setVelocityX(100);
        }
        
       else {
            this.playerShip.setVelocityX(0);
        }
     
        this.physics.overlap(this.bulletGroup, this.asteroidGroup, this.onAsteroidBulletCollision, null, this);
        
        
        
    }

    
    
    
    
    createPlayerShip()
    {
        let startX = game.config.width / 2;
        let startY = game.config.height - 50;
        
        this.playerShip = this.physics.add.image(startX, startY, 'player-ship');   
        this.playerShip.setImmovable();
    }
    
    createAsteroid() 
    {
        let images = ['asteroid-medium', 'mushroom', 'yosy']
        let randomImage = Phaser.Math.RND.between(0, 2);
        
        let x = Phaser.Math.RND.between(50, 550);
        let y = 50;
        
        let asteroid = this.physics.add.image(x, y, images[randomImage])
        asteroid.setVelocity(0, 50);
        
        this.asteroidGroup.add(asteroid);
        
        asteroid.setAngularVelocity(45.0);
        
    }   
    
    createBullet() 
    {
        let images = ['bullet', 'bullet-fire']
        let randomImage = Phaser.Math.RND.between(0, 1);
        
        let startX = this.playerShip.x;
        let startY = game.config.height - 50;
        
        let bullet = this.physics.add.image(startX, startY, images[randomImage])
        bullet.setVelocity(0, -150);
        
        this.bulletGroup.add(bullet);
        
    }  
    
    
    onAsteroidBulletCollision(asteroid, bullet) 
    {
	   asteroid.destroy();
	   bullet.destroy();
    }   
}