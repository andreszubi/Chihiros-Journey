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

// Performance optimization variables
let lastTime = 0;
const settings = getOptimalSettings();
const targetFPS = settings.fps;
const frameTime = 1000 / targetFPS;
let spiritSpawnTimer = 0;
let radishSpiritSpawnTimer = 0;
let foodSpawnTimer = 0;
let specialSpawnTimer = 0;


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
  
  // Hide the side buttons container on splash screen
  const sideButtonsContainer = document.querySelector("#side-buttons");
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  const clickToStart = document.querySelector("#click-to-start");
  
  // Try to auto-play splash screen music
  splashSong.play().then(() => {
    // Music started successfully
    soundBtn.innerHTML = "Stop Music";
    if (clickToStart) clickToStart.style.display = "none";
  }).catch(error => {
    console.log("Autoplay blocked by browser, will start on user interaction");
    // Show click prompt
    if (clickToStart) clickToStart.style.display = "block";
    
    // Add one-time click listener to start music on first user interaction
    const startMusicOnInteraction = () => {
      splashSong.play();
      soundBtn.innerHTML = "Stop Music";
      if (clickToStart) clickToStart.style.display = "none";
      document.removeEventListener('click', startMusicOnInteraction);
      document.removeEventListener('keydown', startMusicOnInteraction);
      document.removeEventListener('touchstart', startMusicOnInteraction);
    };
    
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('keydown', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);
  });
}


const drawChihiro = () => {
  ctx.drawImage(chihiroImage, chihiroX, chihiroY, chihiroWidth, chihiroHeight);
}


const movePlayer = () => {
  const settings = getOptimalSettings();
  const moveSpeed = settings.moveSpeed;
  if (isMovingUp && chihiroY > 230) {
    chihiroY -= moveSpeed;
  }
  if (isMovingDown && chihiroY < 650) {
    chihiroY += moveSpeed;
  }
  if (isMovingRight && chihiroX < 1350) {
    chihiroX += moveSpeed;
  }
  if (isMovingLeft && chihiroX > 30) {
    chihiroX -= moveSpeed;
  }
}

// Object pools for better performance
const spiritPool = [];
const radishSpiritPool = [];
const foodPool = [];
const specialPool = [];

// Object pool helper functions
const getFromPool = (pool, ClassName) => {
  if (pool.length > 0) {
    return pool.pop();
  }
  return new ClassName();
}

const returnToPool = (pool, object) => {
  pool.push(object);
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
  const settings = getOptimalSettings();
  const bgSpeed = settings.bgSpeed;
  
  ctx.drawImage(background, bgx, 0, canvas.width, canvas.height);
  ctx.drawImage(background2, bgx2, 0, canvas.width, canvas.height);
  
  bgx -= bgSpeed;
  bgx2 -= bgSpeed;
  
  if (bgx <= -canvas.width) {
    bgx = canvas.width;
  } 
  if (bgx2 <= -canvas.width) {
    bgx2 = canvas.width;
  }
}


const drawTime = () => {
  ctx.fillStyle = "black";
  const fontSize = window.innerWidth < 768 ? "16px" : "30px";
  ctx.font = `${fontSize} sans-serif`;
  const text = window.innerWidth < 768 ? `Time: ${timeLeft}s` : `Time left to win: ${timeLeft}s`;
  const xPos = window.innerWidth < 768 ? 20 : 200;
  ctx.fillText(text, xPos, 50);
}

const timeElapsed = () => {
  intervalTimeElapsed = setInterval(() => {
    winningTimer += 1;
    console.log(winningTimer);
  }, 1000);
}

const startTimer = () => {
  intervalStartTimer = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 0) {
      winningGame();
    }
  }, 1000);
}

const invisibilityTimer = () => {
  intervalInvisibility = setInterval(() => {
    invisibilityTimerLeft -= 1;
    if (invisibilityTimerLeft === 0) {
      gameOver();
    }
  }, 1000);
}


const drawInvisibility = () => {
  ctx.fillStyle = "black";
  const fontSize = window.innerWidth < 768 ? "16px" : "30px";
  ctx.font = `${fontSize} sans-serif`;
  const text = window.innerWidth < 768 ? `Invisibility: ${invisibilityTimerLeft}s` : `Invisibility time left: ${invisibilityTimerLeft}s`;
  const xPos = window.innerWidth < 768 ? 20 : 700;
  const yPos = window.innerWidth < 768 ? 80 : 70;
  ctx.fillText(text, xPos, yPos);
}

const drawGamePaused = () => {
  ctx.fillStyle = "red";
  const fontSize = window.innerWidth < 768 ? "60px" : "150px";
  ctx.font = `${fontSize} sans-serif`;
  const text = "Game Paused";
  const xPos = window.innerWidth < 768 ? 50 : 260;
  const yPos = window.innerWidth < 768 ? 200 : 400;
  ctx.fillText(text, xPos, yPos);
}

// Optimized collision detection helper function with collision margins
const checkCollision = (obj1, obj2, margin = 10) => {
  return obj1.x + margin < obj2.x + obj2.width - margin &&
         obj1.x + obj1.width - margin > obj2.x + margin &&
         obj1.y + margin < obj2.y + obj2.height - margin &&
         obj1.y + obj1.height - margin > obj2.y + margin;
}

const winningGame = () => {
  isGameOver = true;
  
  // Clear all timers immediately to stop counting
  clearInterval(intervalStartTimer);
  clearInterval(intervalInvisibility);
  clearInterval(intervalTimeElapsed);
  
  winGame.style.display = "flex"
  gameOverDiv.style.display = "none";
  canvasDiv.style.display = "none";
  restartBtn.style.display = "center"
  pauseBtn.style.display = "none"
  muteBtn.style.display = "none"
  
  // Hide the side buttons container
  const sideButtonsContainer = document.querySelector("#side-buttons");
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  gameSong.pause();
  winGameSong.play();
  let score = document.querySelector("#score")
  score.innerHTML = `Your winning time is : ${winningTimer} seconds!`
  cancelAnimationFrame(gameId)
}

const gameOver =  () => {
  isGameOver = true
  
  // Clear all timers immediately
  clearInterval(intervalStartTimer);
  clearInterval(intervalInvisibility);
  clearInterval(intervalTimeElapsed);
  
  gameOverDiv.style.display = "flex";
  canvasDiv.style.display = "none";
  restartBtn.style.display = "block"
  pauseBtn.style.display = "none"
  muteBtn.style.display = "none"
  
  // Hide the side buttons container
  const sideButtonsContainer = document.querySelector("#side-buttons");
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  gameSong.pause()
  gameOverSong.play()
  cancelAnimationFrame(gameId)
}

const addSpirits = () => {
  // Filter and return unused spirits to pool
  const activeSpirits = [];
  spirits.forEach(spirit => {
    if (spirit.x > -spiritWidth && spirit.y > 200 && spirit.y < 750) {
      activeSpirits.push(spirit);
    } else {
      returnToPool(spiritPool, spirit);
    }
  });

  spiritSpawnTimer++;
  const settings = getOptimalSettings();
  const spawnRate = settings.spiritSpawnRate;
  if (spiritSpawnTimer >= spawnRate) {
    const newSpirit = getFromPool(spiritPool, SpiritsClass);
    newSpirit.x = 1400;
    newSpirit.y = Math.random() * (canvas.height - spiritHeight);
    activeSpirits.push(newSpirit);
    spiritSpawnTimer = 0;
  }
  
  const chihiroRect = { x: chihiroX, y: chihiroY, width: chihiroWidth, height: chihiroHeight };
  
  activeSpirits.forEach(spirit => {
    drawSpirits(spirit.x, spirit.y);
    spirit.move();
    
    const spiritRect = { x: spirit.x, y: spirit.y, width: spiritWidth, height: spiritHeight };
    
    // Use larger margin for spirits to make collision less sensitive
    if (checkCollision(chihiroRect, spiritRect, 20)) {
      console.log("Game Over");
      isGameOver = true;
      gameOver();
      cancelAnimationFrame(gameId);
    }
  });
  
  spirits = activeSpirits;
}

const addRadishSpirits = () => {
  const nextRadishSpirits = radishSpirits.filter(radishSpirit => radishSpirit.x > -radishSpiritWidth && radishSpirit.y > 200 && radishSpirit.y < 750);

  radishSpiritSpawnTimer++;
  const settings = getOptimalSettings();
  const spawnRate = settings.radishSpawnRate;
  if (radishSpiritSpawnTimer >= spawnRate) {
    nextRadishSpirits.push(new RadishSpiritsClass());
    radishSpiritSpawnTimer = 0;
  }
  
  const chihiroRect = { x: chihiroX, y: chihiroY, width: chihiroWidth, height: chihiroHeight };
  
  nextRadishSpirits.forEach(radishSpirit => {
    drawRadishSpirits(radishSpirit.x, radishSpirit.y);
    radishSpirit.move();
    
    const radishSpiritRect = { x: radishSpirit.x, y: radishSpirit.y, width: radishSpiritWidth, height: radishSpiritHeight };
    
    // Use larger margin for radish spirits to make collision less sensitive
    if (checkCollision(chihiroRect, radishSpiritRect, 20)) {
      console.log("Game Over");
      isGameOver = true;
      gameOver();
      cancelAnimationFrame(gameId);
    }
  });
  
  radishSpirits = nextRadishSpirits;
}

const addFood = () => {
  let nextFoods = foods.filter(food => food.x > -foodWidth && food.y > 170 && food.y < 750);

  foodSpawnTimer++;
  if (foodSpawnTimer >= 100) {
    nextFoods.push(new FoodsClass());
    foodSpawnTimer = 0;
  }
  
  const chihiroRect = { x: chihiroX, y: chihiroY, width: chihiroWidth, height: chihiroHeight };
  
  nextFoods = nextFoods.filter(food => {
    drawFood(food.x, food.y);
    food.move();
    
    const foodRect = { x: food.x, y: food.y, width: foodWidth, height: foodHeight };
    
    // Use smaller margin for food to make it easier to collect
    if (checkCollision(chihiroRect, foodRect, 5)) {
      foodSound.play();
      invisibilityTimerLeft += 5;
      return false; // Remove food after consumption
    }
    return true; // Keep food if not consumed
  });
  
  foods = nextFoods;
}

const addSpecial = () => {
  let nextSpecials = specialFoods.filter(special => special.x > -specialWidth && special.y > 170 && special.y < 750);

  specialSpawnTimer++;
  if (specialSpawnTimer >= 100) {
    nextSpecials.push(new SpecialsClass());
    specialSpawnTimer = 0;
  }
  
  const chihiroRect = { x: chihiroX, y: chihiroY, width: chihiroWidth, height: chihiroHeight };
  
  nextSpecials = nextSpecials.filter(special => {
    drawSpecialFood(special.x, special.y);
    special.move();
    
    const specialRect = { x: special.x, y: special.y, width: specialWidth, height: specialHeight };
    
    // Use smaller margin for special food to make it easier to collect
    if (checkCollision(chihiroRect, specialRect, 5)) {
      yummy.play();
      timeLeft -= 5;
      return false; // Remove special food after consumption
    }
    return true; // Keep special food if not consumed
  });
  
  specialFoods = nextSpecials;
}

// Check if device is in landscape mode
const isLandscape = () => {
  return window.innerHeight < window.innerWidth;
}

// Adjust game performance based on orientation
const getOptimalSettings = () => {
  const isMobile = window.innerWidth < 768;
  const landscape = isLandscape();
  
  let fps = 60;
  let moveSpeed = 10;
  let bgSpeed = 2;
  let spiritSpawnRate = 80;
  let radishSpawnRate = 100;
  
  if (isMobile) {
    if (landscape) {
      fps = 25;
      moveSpeed = 6;
      bgSpeed = 0.5;
      spiritSpawnRate = 130;
      radishSpawnRate = 150;
    } else {
      fps = 30;
      moveSpeed = 8;
      bgSpeed = 1;
      spiritSpawnRate = 100;
      radishSpawnRate = 120;
    }
  }
  
  return {
    fps,
    moveSpeed,
    bgSpeed,
    spiritSpawnRate,
    radishSpawnRate
  };
}

const animate = (currentTime = 0) => {
  const deltaTime = currentTime - lastTime;
  
  if (deltaTime >= frameTime) {
    // Clear canvas for better performance
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    backgroundDraw();
    drawTime();
    drawInvisibility();
    drawChihiro();
    movePlayer();
    addSpirits();
    addRadishSpirits();
    addFood();
    addSpecial();

    if (isGamePaused) {
      drawGamePaused();
    }

    if (isGameOver) {
      console.log(winningTimer);
      clearInterval(intervalStartTimer);
      clearInterval(intervalInvisibility);
      clearInterval(intervalTimeElapsed);
    }

    if (timeLeft <= 0) {
      winningGame();
      cancelAnimationFrame(gameId);
    } else if (invisibilityTimerLeft === 0) {
      gameOver();
      cancelAnimationFrame(gameId);
    } else if (isGameOver) {
      cancelAnimationFrame(gameId);
    } else if (!isGamePaused) {
      lastTime = currentTime;
    }
  }
  
  if (!isGamePaused && !isGameOver) {
    gameId = requestAnimationFrame(animate);
  }
}


const resetGame = () => {
  // Reset all game variables
  isGameOver = false;
  gameId = 0;
  invisibilityTimerLeft = 15;
  winningTimer = 0;
  timeLeft = 60;
  bgx = 0;
  bgx2 = canvas.width;
  isGamePaused = false;
  lastTime = 0;
  
  // Reset spawn timers
  spiritSpawnTimer = 0;
  radishSpiritSpawnTimer = 0;
  foodSpawnTimer = 0;
  specialSpawnTimer = 0;
  
  // Reset player position
  chihiroX = 20;
  chihiroY = 530;
  
  // Reset movement flags
  isMovingUp = false;
  isMovingDown = false;
  isMovingRight = false;
  isMovingLeft = false;
  
  // Clear all arrays
  spirits = [];
  radishSpirits = [];
  foods = [];
  specialFoods = [];
  
  // Clear all intervals
  clearInterval(intervalStartTimer);
  clearInterval(intervalInvisibility);
  clearInterval(intervalTimeElapsed);
}

function startGame() {
  resetGame();
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
  pauseBtn.style.display = "block";
  titleText.style.display = "none";
  winGame.style.display = "none";
  
  // Show the side buttons container
  const sideButtonsContainer = document.querySelector("#side-buttons");
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "flex";
  }
  
  timeElapsed();
  startTimer();
  invisibilityTimer();
  lastTime = performance.now();
  animate();

 



  // Optimized keyboard input handlers
  document.addEventListener('keydown', event => {
    if (isGamePaused || isGameOver) return;
    
    switch(event.code) {
      case 'ArrowUp':
        event.preventDefault(); // Prevent page scrolling
        if (!isMovingUp) isMovingUp = true;
        break;
      case 'ArrowDown':
        event.preventDefault(); // Prevent page scrolling
        if (!isMovingDown) isMovingDown = true;
        break;
      case 'ArrowRight':
        event.preventDefault(); // Prevent page scrolling
        if (!isMovingRight) isMovingRight = true;
        break;
      case 'ArrowLeft':
        event.preventDefault(); // Prevent page scrolling
        if (!isMovingLeft) isMovingLeft = true;
        break;
    }
  });
  
  document.addEventListener('keyup', event => {
    switch(event.code) {
      case 'ArrowUp':
        event.preventDefault(); // Prevent page scrolling
        isMovingUp = false;
        break;
      case 'ArrowDown':
        event.preventDefault(); // Prevent page scrolling
        isMovingDown = false;
        break;
      case 'ArrowRight':
        event.preventDefault(); // Prevent page scrolling
        isMovingRight = false;
        break;
      case 'ArrowLeft':
        event.preventDefault(); // Prevent page scrolling
        isMovingLeft = false;
        break;
    }
  });
  
  // Touch controls for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (isGamePaused || isGameOver) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isGamePaused || isGameOver) return;
    
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Reset movement flags
    isMovingUp = false;
    isMovingDown = false;
    isMovingLeft = false;
    isMovingRight = false;
    
    // Determine direction based on touch movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal movement
      if (deltaX > 10) {
        isMovingRight = true;
      } else if (deltaX < -10) {
        isMovingLeft = true;
      }
    } else if (deltaY > 10) {
      // Vertical movement - down
      isMovingDown = true;
    } else if (deltaY < -10) {
      // Vertical movement - up
      isMovingUp = true;
    }
  });
  
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    
    // Stop all movement when touch ends
    isMovingUp = false;
    isMovingDown = false;
    isMovingLeft = false;
    isMovingRight = false;
  });

}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Simple refresh without reload to avoid breaking functionality
    const newSettings = getOptimalSettings();
    // Just log the change for now
    console.log('Orientation changed, new settings:', newSettings);
  }, 100);
});

// Also handle resize events for better responsiveness
window.addEventListener('resize', () => {
  const newSettings = getOptimalSettings();
  // Update settings when window size changes
  console.log('Window resized, new settings:', newSettings);
});

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
      if (isGamePaused) {
        pauseBtn.innerHTML = "Pause";
        isGamePaused = false;
        splashSong.pause();
        gameSong.play();
        timeElapsed();
        startTimer();
        invisibilityTimer();
        lastTime = performance.now(); // Reset timing for smooth resume
        animate();
      } else {
        pauseBtn.innerHTML = "Resume";
        isGamePaused = true;
        gameSong.pause();
        splashSong.play();
        clearInterval(intervalStartTimer);
        clearInterval(intervalInvisibility);
        clearInterval(intervalTimeElapsed);
      }
    });
    
    // Update sound button text to reflect that music is already playing
    setTimeout(() => {
      if (!splashSong.paused) {
        soundBtn.innerHTML = "Stop Music";
      } else {
        soundBtn.innerHTML = "Play Music";
      }
    }, 500);
});


