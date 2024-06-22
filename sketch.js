var PLAY = 1;
var END = 0;
var ANIMATION = 2;
var gameState = PLAY;

var ground, invisibleGround, groundImg;

var girl, girlImg;
var vampi, vampiImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score = 0;

var jumpSound, collidedSound;

var gameOver, gameOverImg, restart, restartImg;

var backgroundImg;

function preload(){
    backgroundImg = loadImage("cielo.png")

    groundImg = loadImage("fondo.png");

    girlImg = loadImage("girl.png");
    vampiImg = loadImage("vampi.png");

    obstacle1 = loadImage("obs 1.png");
    obstacle2 = loadImage("obs 2.png");
    obstacle3 = loadImage("obs 3.png");
    obstacle4 = loadImage("obs 4.png");

    jumpSound = loadSound("jump.wav");
    collidedSound = loadSound("collided.wav");

    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

function setup() {
    createCanvas(600, 400);

    girl = createSprite(200, 320, 50, 50);
    girl.setCollider('circle',0, 0, 50);
    girl.addImage(girlImg);
    girl.scale = 0.6;
    girl.debug = false;

    vampi = createSprite(70, 300, 20, 50);
    vampi.addImage(vampiImg);
    vampi.setCollider('circle',0, 0, 100);
    vampi.scale = 0.3;
    vampi.debug = false;

    
    invisibleGround = createSprite(300, 390, 600, 100);  
    invisibleGround.shapeColor = "#f4cbaa";
    invisibleGround.visible = false;
  
    ground = createSprite(415, 365, 600, 400);
    ground.addImage(groundImg);
    ground.scale = 2;
  
    gameOver = createSprite(300, 180);
    gameOver.addImage(gameOverImg);
  
    restart = createSprite(300, 220);
    restart.addImage(restartImg);
  
    gameOver.scale = 0.5;
    restart.scale = 0.1;

    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup = new Group();

    score = 0;

}

function draw() {
    background(backgroundImg);
    textSize(20);
    fill("white")
    text("Puntuación: "+ score,30,50);

    girl.depth = 2;
    vampi.depth = 2;
    ground.depth = girl.depth - 1;

    if (gameState===PLAY){
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(6 + 3*score/100);
        
        if(keyDown("SPACE") && girl.y  >= 280) {
          jumpSound.play( )
          girl.velocityY = -10;
        }
        
        girl.velocityY = girl.velocityY + 0.8;
      
        if (ground.x < 40){
          ground.x = 500;
        }
      
        girl.collide(invisibleGround);
        spawnObstacles();
      
        if(obstaclesGroup.isTouching(girl)){
          collidedSound.play();
          gameState = ANIMATION;
        } 

        if(obstaclesGroup.isTouching(vampi)){
            collidedSound.play();
            obstaclesGroup.setLifetimeEach(0);  
        } 

    } else if(gameState === ANIMATION){
        //establecer la velocidad de cada objeto del juego como 0
        ground.velocityX = 0;
        girl.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        
        
        //establecer lifetime de los objetos del juego para que no sean destruidos nunca
        obstaclesGroup.setLifetimeEach(-1);

        vampi.velocityX = 2;

        if(vampi.isTouching(girl)){
            gameState = END;
        }
        
    }else if (gameState === END) {
        gameOver.visible = true;
        restart.visible = true;

        vampi.velocityX = 0;

        gvampi();
        
        if(keyDown("SPACE")) {      
          reset();
        }
    }
      
      
    
    drawSprites();
}

function spawnObstacles() {
    if(frameCount % 60 === 0) {
      var obstacle = createSprite(600,305,20,30);
      obstacle.setCollider('circle',0,0, 20)
    
      obstacle.velocityX = -(6 + 3*score/100);
      
      //generar obstáculos al azar
      var rand = Math.round(random(1,4));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
                break;
        case 2: obstacle.addImage(obstacle2);
                break;
        case 3: obstacle.addImage(obstacle3);
                break;
        case 4: obstacle.addImage(obstacle4);
                break;
        default: break;
      }
      
      //asignar escala y lifetime al obstáculo           
      obstacle.scale = 1 ;
      obstacle.lifetime = 300;
      obstacle.depth = girl.depth;
      girl.depth +=1;
      //agregar cada obstáculo al grupo
      obstaclesGroup.add(obstacle);
    }
}
  
function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    
    score = 0;
    
}

function gvampi() {
    girl.addImage(vampiImg);
    girl.setCollider('circle',0, 0, 100);
    girl.scale = 0.3;
    girl.y = 300;
}