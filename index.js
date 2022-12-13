// Create the canvas
const canvas = document.querySelector("#canvas");
canvas.style.border = "5px solid pink"
const canvasDiv = document.querySelector("#game");
const ctx = canvas.getContext("2d");


let startScreen = document.querySelector("#splash-screen");
let startBtn = document.querySelector("#start-button");
let restartBtn = document.querySelector("#restart");
let winBtn = document.querySelector("#win-start");
let soundBtn = document.querySelector("#sound");
let muteBtn = document.querySelector("#mute");
let titleText = document.querySelector(".title-text")
let gameOverDiv = document.querySelector("#game-over");
let winGame = document.querySelector("#win-game");
let pauseBtn = document.querySelector("#pause");




//sounds
const splashSong = new Audio("./sounds/Start song One Summer's Day.mp3");
const gameSong = new Audio('./sounds/Soot balls Spirited Away - Joe Hisaishi.mp3');
gameSong.volume = 0.2;
const gameOverSong = new Audio ("./sounds/The Bottomless Pit - Joe Hisaishi.mp3");
gameOverSong.volume = 0.1;
const winGameSong = new Audio("./sounds/Joe Hisaishi - Always With Me (Spirited Away 2002).mp3");
const foodSound = new Audio ("./sounds/Slurp - Sound Effect (HD).mp3");
foodSound.volume = 0.1;
const yummy = new Audio ("./sounds/Yummy sound effect.mp3");
yummy.volume = 0.1;
// images used
const background = new Image()
background.src = "./images/game background copy .jpg"
const background2 = new Image()
background2.src = "./images/game background copy2.jpg"
const gameOverScreen = new Image()
gameOverScreen.src = "./images/game-over.jpg";
const winningScreen = new Image()
winningScreen.src = "./images/splash-picture.jpg";
const chihiroImage = new Image()
chihiroImage.src = "./images/chihiro-running.png"
const spiritImage = new Image()
spiritImage.src = "./images/spirit.png";
const radishSpiritImage = new Image()
radishSpiritImage.src = "./images/radish-spirit.png"
const foodImage = new Image()
foodImage.src = "./images/food.png";
const specialFoodImage = new Image()
specialFoodImage.src = "./images/special-food.png"

// Chihiro dimension and movement
let isMovingUp = false;
let isMovingDown = false;
let isMovingRight = false;
let isMovingLeft = false;
let chihiroX = 20;
let chihiroY = 530;
const chihiroWidth = 120;
const chihiroHeight = 145;

// Game variables 
let isGameOver = false;
let gameId = 0;
let invisibilityTimerLeft = 15;
let winningTime = ""
let winningTimer= 0;
let timeLeft = 60;
let bgx = 0
let bgx2 = canvas.width
let specialFrequency;
let intervalId = null;
let isGamePaused = false;
let intervalTimeElapsed = 0;
let intervalInvisibility = 0;
let intervalStartTimer = 0;


// Spirits dimension and speed
let spirits = [];
const spiritWidth = 90;
const spiritHeight = 160;
let spiritX = 1400;
let spiritY = 280


// Radish Spirits dimension and speed
let radishSpirits = [];
const radishSpiritWidth = 120;
const radishSpiritHeight = 160;
let radishSpiritX = 1400;
let radishSpiritY = 280


// Foods dimensions and speeds
let foods = [];
let foodWidth = 50;
let foodHeight = 60;
let foodX = 1400;
let foodY = 280



let specialFoods = [];
let specialWidth = 50;
let specialHeight = 60;
let specialX = 1400
let specialY = 280








// Create Functions for the game
const splashScreen = () => {
  canvas.style.display = "none"
  gameOverDiv.style.display = "none";
  winGame.style.display = "none";
  muteBtn.style.display = "none";
  pauseBtn.style.display = "none";
}


const drawChihiro = () => {
 // ctx.fillStyle = "red"
//ctx.fillRect(chihiroX, chihiroY, chihiroWidth,chihiroHeight )
ctx.drawImage(chihiroImage,chihiroX, chihiroY, chihiroWidth,chihiroHeight )
}


const movePlayer = () => {
  if (isMovingUp === true && chihiroY > 230) {
    chihiroY -= 10
  } else if (isMovingDown === true && chihiroY < 650) {
  chihiroY += 10
  } else if (isMovingRight === true && chihiroX < 1350) {
    chihiroX += 10
  } else if (isMovingLeft === true && chihiroX > 30)  {
    chihiroX -= 10
  }
}

// Classes created in order to make random arrays of the spirits and the foods to constantly appear.

class SpiritsClass {
    constructor() {
        this.x = 1400
        this.y = Math.random() * (canvas.height - spiritHeight)
    }
    
    move() {
        this.x -= 5
        if (timeLeft  <= 30) {
          this.x -= 6
        }
    }
}

class RadishSpiritsClass {
  constructor() {
      this.x = 1400
      this.y = Math.random() * (canvas.height - radishSpiritHeight)
  }
  
  move() {
      this.x -= 4
      if (timeLeft  <= 30) {
        this.x -= 5
      }
  }
}

class FoodsClass {
  constructor() {
      this.x = 1400
      this.y = Math.random() * (canvas.height - foodHeight)
  }
  
  move() {
      this.x -= 8
  }
}

class SpecialsClass {
  constructor() {
      this.x = 1400
      this.y = Math.random() * (canvas.height - specialHeight)
  }
  
  move() {
      this.x -= 10
  }
}

const drawSpirits = (currentSpiritX, currentSpiritY) => {
  //ctx.fillRect(currentSpiritX,currentSpiritY,spiritWidth,spiritHeight )
  ctx.drawImage(spiritImage,currentSpiritX,currentSpiritY,spiritWidth,spiritHeight)
} 

const drawRadishSpirits = (currentRadishSpiritX, currentRadishSpiritY) => {
  ctx.drawImage(radishSpiritImage,currentRadishSpiritX,currentRadishSpiritY,radishSpiritWidth,radishSpiritHeight)
}

const drawFood = (currentFoodX, currentFoodY) => {
  //ctx.fillRect(currentFoodX, currentFoodY, foodWidth, foodHeight )
  ctx.drawImage(foodImage, currentFoodX, currentFoodY, foodWidth, foodHeight);

}


const drawSpecialFood = (currentSpecialX, currentSpecialY) => {
 // ctx.fillRect(currentSpecialX, currentSpecialY, specialWidth, specialHeight )
  ctx.drawImage(specialFoodImage, currentSpecialX, currentSpecialY, specialWidth, specialHeight);
 
}


const backgroundDraw = () => {
    ctx.drawImage(background, bgx, 0, canvas.width, canvas.height);
    ctx.drawImage(background2, bgx2, 0, canvas.width, canvas.height);
    bgx -= 2
    bgx2 -= 2
if (bgx < -canvas.width) {
  bgx = canvas.width;
} 
if (bgx2 <  -canvas.width) {
  bgx2 = canvas.width;
}
  }


let drawTime = () => {
  ctx.beginPath();
  ctx.fillStyle = "black"
  ctx.font = "30px sans-serif";
  ctx.fillText(`Time left to win: ${timeLeft}s `, 200, 70);
  ctx.closePath()
}

timeElapsed = () => {
  intervalTimeElapsed = setInterval(() => {
    winningTimer += 1;
    console.log(winningTimer)
  },1000)
  
  
  
}

startTimer = () => {
  intervalStartTimer = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
    }
  }, 1000)
}

  invisibilityTimer = () => {
   intervalInvisibility = setInterval(() => {
    invisibilityTimerLeft -= 1;
    if (invisibilityTimerLeft === 0) {
    }
   }, 1000)
    
  }


let drawInvisibility = () => {
  ctx.beginPath();
  ctx.fillStyle = "black"
  ctx.font = "30px sans-serif";
  ctx.fillText(`Invisibility time left: ${invisibilityTimerLeft}s `, 700, 70);
  ctx.closePath()
}

let drawGamePaused = () => {
  ctx.beginPath()
  ctx.fillStyle = "red"
  ctx.font = "150px sans-serif";
  ctx.fillText("Game Paused", 260,400)
  ctx.closePath()
}

const winningGame = () => {
  isGameOver = true;
  winGame.style.display = "flex"
  gameOverDiv.style.display = "none";
  canvasDiv.style.display = "none";
  restartBtn.style.display = "center"
  pauseBtn.style.display = "none"
  muteBtn.style.display = "none"
  gameSong.pause();
  winGameSong.play();
  let score = document.querySelector("#score")
 score.innerHTML = `Your winning time is : ${winningTimer} seconds!`
  cancelAnimationFrame(gameId)
}

const gameOver =  () => {
  isGameOver = true
  gameOverDiv.style.display = "flex";
  canvasDiv.style.display = "none";
  restartBtn.style.display = "block"
  pauseBtn.style.display = "none"
  muteBtn.style.display = "none"
  gameSong.pause()
  gameOverSong.play()
  cancelAnimationFrame(gameId)
  
}

const addSpirits = () => {
  const nextSpirits = spirits.filter( spirit => spirit.x < canvas.width && spirit.y > 200 && spirit.y < 750)


  if (gameId % 80 === 0) {
      nextSpirits.push(new SpiritsClass())
  }
  
  nextSpirits.forEach(spirit => {
     drawSpirits(spirit.x, spirit.y)
      spirit.move()
  
  if (
    spirit.x + 10 <= chihiroX + chihiroWidth  &&
    spirit.x  - 20 + spiritWidth >= chihiroX &&
    spirit.y + 150 <= chihiroY + chihiroHeight &&
    spirit.y - 30 + spiritHeight  > chihiroY
  ) {console.log("Game Over");
    isGameOver = true
     gameOver();
     cancelAnimationFrame(gameId);
  }
      
  }) 
  
  spirits = nextSpirits;
}

const addRadishSpirits = () => {
  const nextRadishSpirits = radishSpirits.filter( radishSpirit => radishSpirit.x < canvas.width && radishSpirit.y > 200 && radishSpirit.y < 750)


  if (gameId % 100 === 0) {
      nextRadishSpirits.push(new RadishSpiritsClass())
  }
  
  nextRadishSpirits.forEach(radishSpirit => {
     drawRadishSpirits(radishSpirit.x, radishSpirit.y)
      radishSpirit.move()
  
  if (
    radishSpirit.x + 10 <= chihiroX + chihiroWidth  &&
    radishSpirit.x  - 20 + spiritWidth >= chihiroX &&
    radishSpirit.y + 150 <= chihiroY + chihiroHeight &&
    radishSpirit.y - 30 + spiritHeight  > chihiroY
  ) {console.log("Game Over");
    isGameOver = true
     gameOver();
     cancelAnimationFrame(gameId);
  }
      
  }) 
  
  radishSpirits = nextRadishSpirits;
}

const addFood = () => {
  let nextFoods = foods.filter( food => food.x < canvas.width && food.y > 170 && food.y < 750)


  if (gameId % 100 === 0) {
      nextFoods.push(new FoodsClass())
  }
  
  nextFoods = nextFoods.map(food => {
     drawFood(food.x, food.y)
      food.move()
  
      if (
        food.x  <= chihiroX + chihiroWidth  &&
        food.x  + foodWidth >= chihiroX &&
        food.y  <= chihiroY + chihiroHeight &&
        food.y + foodHeight  > chihiroY
      ) {
        foodSound.play();
       invisibilityTimerLeft += 5;
       
    } else {
      return food }
  }).filter(element => element )  // gets rid of food after consuming it
  foods = nextFoods;
}

const addSpecial = () => {
  let nextSpecials = specialFoods.filter( special => special.x < canvas.width && special.y > 170 && special.y < 750)


  if (gameId % 100 === 0) {
      nextSpecials.push(new SpecialsClass());
  }
  
  nextSpecials = nextSpecials.map(special => {
     drawSpecialFood(special.x, special.y)
      special.move()
  
     if (
        special.x <= chihiroX + chihiroWidth  &&
        special.x + specialWidth >= chihiroX &&
        special.y <= chihiroY + chihiroHeight &&
        special.y  + specialHeight  > chihiroY
      ) {
        yummy.play()
        timeLeft -= 5;
      }  else {
        return special }
      
  }).filter(element => element) // gets rid of special food after consuming it.
  
  specialFoods = nextSpecials;
}

const animate = () => {
backgroundDraw()
drawTime()
drawInvisibility();
drawChihiro();
movePlayer();
addSpirits()
addRadishSpirits()
addFood()
addSpecial()

if (isGamePaused) {
drawGamePaused()
}

 if (isGameOver) {
  console.log(winningTimer);
  clearInterval(intervalId)
  }




if (timeLeft <= 0) {
    winningGame()
    cancelAnimationFrame(gameId)
    
  } else if (invisibilityTimerLeft === 0) {
    gameOver()
    cancelAnimationFrame(gameId)
   
  } else if (isGameOver) {
    cancelAnimationFrame(gameId)
  }
  else if (!isGamePaused) {
    gameId = requestAnimationFrame(animate)
}
}


function startGame() {
splashSong.pause();
gameSong.play();
startScreen.style.display = "none";
canvasDiv.style.display = "flex";
canvas.style.display = "block";
startBtn.style.display = "none";
restartBtn.style.display = "none";
gameOverDiv.style.display = "none";
soundBtn.style.display = "none";
muteBtn.style.display = "block";
pauseBtn.style.display ="block"
titleText.style.display = "none";
winGame.style.display = "none";
timeElapsed(); 
animate();
startTimer();
invisibilityTimer();

 




document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp') {
      isMovingUp = true;
    } else if (event.code === 'ArrowDown') {
      isMovingDown = true;
    } else if (event.code === 'ArrowRight') {
      isMovingRight = true;
    } else if (event.code === 'ArrowLeft') {
      isMovingLeft = true;
    }
  })
  document.addEventListener('keyup', () => {
    isMovingUp = false;
    isMovingDown = false;
    isMovingRight = false;
    isMovingLeft = false;
  })

}




window.addEventListener("load", () => {
 splashScreen()
    startBtn.addEventListener("click", () => {
      startGame()
    });
  
    winBtn.addEventListener("click", () => {
      gameOverSong.pause()
      winGameSong.pause()
      location.reload()
    });

    restartBtn.addEventListener("click", () => {
      gameOverSong.pause()
      winGameSong.pause()
      location.reload()
    });
    soundBtn.addEventListener("click", () => {
      if (soundBtn.innerHTML === "Play Music") {
        soundBtn.innerHTML = "Stop Music";
      splashSong.play()
      } else {
        soundBtn.innerHTML = "Play Music";
      splashSong.pause()
      } 
    }); 
    muteBtn.addEventListener("click", () => {
      if (muteBtn.innerHTML === "Mute") {
        muteBtn.innerHTML = "Sound";
        gameSong.pause();
      } else {
        muteBtn.innerHTML = "Mute";
        gameSong.play();
      }
    })
    pauseBtn.addEventListener("click", () => {
    if (isGamePaused ) {
      pauseBtn.innerHTML = "Pause"
      isGamePaused = false;
      splashSong.pause()
      gameSong.play()
      timeElapsed(); // to make the timers resume from they were at.
      startTimer();  // to make the timers resume from they were at.
      invisibilityTimer(); // to make the timers resume from they were at.
      animate()
    } else {
      pauseBtn.innerHTML = "Resume"
      isGamePaused = true;
      gameSong.pause()
      splashSong.play()
      drawGamePaused();
      clearInterval(intervalStartTimer);  // to make the timers to stop counting the time.
      clearInterval(intervalInvisibility); // // to make the timers to stop counting the time.
      clearInterval(intervalTimeElapsed); // // to make the timers to stop counting the time.
    }
    })
});
