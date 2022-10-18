// Create the canvas
const canvas = document.querySelector("#canvas");
canvas.style.border = "5px solid pink"
const canvasDiv = document.querySelector("#game");
const ctx = canvas.getContext("2d");


let startScreen = document.querySelector("#splash-screen");
let startBtn = document.querySelector("#start-button");
let restartBtn = document.querySelector("#restart");
let soundBtn = document.querySelector("#sound");
let muteBtn = document.querySelector("#mute");
let titleText = document.querySelector(".title-text")
let gameOverDiv = document.querySelector("#game-over");
let winGame = document.querySelector("#win-game");



//sounds
const splashSong = new Audio("/sounds/Start song One Summer's Day.mp3");
const gameSong = new Audio('/sounds/Soot balls Spirited Away - Joe Hisaishi.mp3');
const gameOverSong = new Audio ("/sounds/The Bottomless Pit - Joe Hisaishi.mp3");
const winGameSong = new Audio("/sounds/Joe Hisaishi - Always With Me (Spirited Away 2002).mp3");

// images used
const background = new Image()
background.src = "/images/game background copy .jpg"
const background2 = new Image()
background2.src = "/images/game background copy2.jpg"
const gameOverScreen = new Image()
gameOverScreen.src = "/images/game-over.jpg";
const winningScreen = new Image()
winningScreen.src = "/images/splash-picture.jpg";
const chihiroImage = new Image()
chihiroImage.src = "/images/chihiro-running.png"
const spiritImage = new Image()
spiritImage.src = "/images/spirit.png";
const foodImage = new Image()
foodImage.src = "/images/food.png";
const specialFoodImage = new Image()
specialFoodImage.src = "/images/special-food.png"

// Chihiro dimension and movement
let isMovingUp = false;
let isMovingDown = false;
let isMovingRight = false;
let isMovingLeft = false;
let chihiroX = 20;
let chihiroY = 530;
const chihiroWidth = 180;
const chihiroHeight = 230;

// Game variables 
let isGameOver = false;
let gameId = 0;
let invisibilityTimerLeft = 10;
let winningTimer= 0;
let timeLeft = 2;
let bgx = 0
let bgx2 = canvas.width
let spiritFrequency;
let foodFrequency;
let specialFrequency;
let intervalId = null;


// Spirits dimension and speed
let spirits = [];
const spiritWidth = 80;
const spiritHeight = 190;
let spiritX = 1400;
let spiritY = 280



// Foods dimensions and speeds
let foods = [];
let foodWidth = 40;
let foodHeight = 50;
let foodX = 1400;
let foodY = 280
let foodInvisivility = 5


let specialFoods = [];
let specialWidth = 40;
let specialHeight = 50;
let specialX = 1400
let specialY = 280
let specialRemove = -5



splashSong.play();
canvas.style.display = "none"
gameOverDiv.style.display = "none";
  winGame.style.display = "none";



// Create Functions for the game
const drawChihiro = () => {
ctx.drawImage(chihiroImage,chihiroX, chihiroY, chihiroWidth,chihiroHeight )
}

const movePlayer = () => {
  if (isMovingUp === true && chihiroY > 170) {
    chihiroY -= 5;
  } else if (isMovingDown === true && chihiroY < 570) {
  chihiroY += 5;
  } else if (isMovingRight === true ) {
    chihiroX += 5
  } else if (isMovingLeft === true)  {
    chihiroX -= 7
  }
}

class SpiritsClass {
    constructor() {
        this.x = 1400
        this.y = Math.random() * (canvas.height - spiritHeight)
    }
    
    move() {
        this.x -= 5
    }
}

class FoodsClass {
  constructor() {
      this.x = 1400
      this.y = Math.random() * (canvas.height - foodHeight)
  }
  
  move() {
      this.x -= 5
  }
}

class SpecialsClass {
  constructor() {
      this.x = 1400
      this.y = Math.random() * (canvas.height - specialHeight)
  }
  
  move() {
      this.x -= 5
  }
}

const drawSpirits = (currentSpiritX, currentSpiritY) => {
ctx.drawImage(spiritImage,currentSpiritX,currentSpiritY,spiritWidth,spiritHeight)
} 

const drawFood = (currentFoodX, currentFoodY) => {
ctx.drawImage(foodImage, currentFoodX, currentFoodY, foodWidth, foodHeight);
}


const drawSpecialFood = (currentSpecialX, currentSpecialY) => {
  ctx.drawImage(specialFoodImage, currentSpecialX, currentSpecialY, specialWidth, specialHeight);
}


const backgroundDraw = () => {
    ctx.drawImage(background, bgx, 0, canvas.width, canvas.height);
    ctx.drawImage(background2, bgx2, 0, canvas.width, canvas.height);
    bgx -= 3
    bgx2 -= 3
if (bgx < -canvas.width) {
  bgx = canvas.width;
} 
if (bgx2 <  -canvas.width) {
  bgx2 = canvas.width;
}
  }


let drawTime = () => {
  ctx.beginPath();
  ctx.font = "30px sans-serif";
  ctx.fillText(`Time left to win: ${timeLeft}s `, 200, 70);
}


startTimer = () => {
  intervalId = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
    }
  }, 1000)
}

  invisivilityTimer = () => {
   intervalId = setInterval(() => {
    invisibilityTimerLeft -= 1;
    if (invisibilityTimerLeft === 0) {
    }
   }, 1000)
    
  }


let drawInvisivility = () => {
  ctx.beginPath();
  ctx.font = "30px sans-serif";
  ctx.fillText(`Invisibility time left: ${invisibilityTimerLeft}s `, 700, 70);
}


const winningGame = () => {
  winGame.style.display = "flex"
  gameOverDiv.style.display = "none";
  canvasDiv.style.display = "none";
  restartBtn.style.display = "center"
  gameSong.pause();
  winGameSong.play();
  cancelAnimationFrame(gameId)
}

const gameOver =  () => {
  gameOverDiv.style.display = "flex";
  canvasDiv.style.display = "none";
  restartBtn.style.display = "center"
  gameSong.pause()
  gameOverSong.play()
  cancelAnimationFrame(gameId)
  

}

const addSpirits = () => {
  const nextSpirits = spirits.filter( spirit => spirit.x < canvas.width)


  if (gameId % 100 === 0) {
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
     gameOver();
     
  }
      
  }) 
  
  spirits = nextSpirits;
}

const addFood = () => {
  const nextFoods = foods.filter( food => food.x < canvas.width)


  if (gameId % 300 === 0) {
      nextFoods.push(new FoodsClass())
  }
  
  nextFoods.forEach(food => {
     drawFood(food.x, food.y)
      food.move()
  
      if (
        food.x + 10 <= chihiroX + chihiroWidth  &&
        food.x  - 20 + foodWidth >= chihiroX &&
        food.y + 150 <= chihiroY + chihiroHeight &&
        food.y - 30 + foodHeight  > chihiroY
      ) {
       invisibilityTimerLeft += 5;
    }
      
  }) 
  
  foods = nextFoods;
}

const addSpecial = () => {
  const nextSpecials = specialFoods.filter( special => special.x < canvas.width)


  if (gameId % 500 === 0) {
      nextSpecials.push(new SpecialsClass());
  }
  
  nextSpecials.forEach(special => {
     drawSpecialFood(special.x, special.y)
      special.move()
  
      /* if (
        special.x + 10 <= chihiroX + chihiroWidth  &&
        speccial.x  - 20 + specialWidth >= chihiroX &&
        special.y + 150 <= chihiroY + chihiroHeight &&
        special.y - 30 + specialHeight  > chihiroY
      ) {
        requestAnimationFrame(animate)
      } */
      
  }) 
  
  specialFoods = nextSpecials;
}

const animate = () => {
backgroundDraw()
drawTime()
drawInvisivility();
drawChihiro();
movePlayer();
addSpirits()
addFood()
addSpecial()




if (timeLeft === 0) {
    winningGame()
    cancelAnimationFrame(gameId)
  } else if (invisibilityTimerLeft === 0) {
    gameOver()
    cancelAnimationFrame(gameId)
  } else {
    gameId = requestAnimationFrame(animate)

}
}

window.onload = () => {
    document.getElementById("start-button").onclick = () => {
        startGame();
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
titleText.style.display = "none";
winGame.style.display = "none";
 animate();
 startTimer();
 invisivilityTimer();

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp') {
      console.log('We are going up!')
      isMovingUp = true;
    } else if (event.code === 'ArrowDown') {
      console.log('We are going down!')
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
    startBtn.addEventListener("click", () => {
      startGame();
     // audio.play();
    });
  
    restartBtn.addEventListener("click", () => {
      startGame();
      //winSound.pause();
      //loseSoung.pause();
      startScreen.style.display = "none";
      canvasDiv.style.display = "flex";
      canvas.style.display = "block";
      startBtn.style.display = "none";
      restartBtn.style.display = "none";
      soundBtn.style.display = "none";
      muteBtn.style.display = "block";
      titleText.style.display = "none";
    });
    soundBtn.addEventListener("click", () => {
      if (soundBtn.innerHTML == "Sound") {
        soundBtn.innerHTML = "Mute";
        audio.play();
      } else {
        soundBtn.innerHTML = "Sound";
       // audio.pause();
      }
    });
    muteBtn.addEventListener("click", () => {
      if (muteBtn.innerHTML == "Mute") {
        muteBtn.innerHTML = "Sound";
        //audio.pause();
      } else {
        muteBtn.innerHTML = "Mute";
       // audio.play();
      }
    })
});
}