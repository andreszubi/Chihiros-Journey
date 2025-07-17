// Create the canvas
const canvas = document.querySelector("#canvas");
canvas.style.border = "5px solid pink"
const canvasDiv = document.querySelector("#game");
const ctx = canvas.getContext("2d");

// Enhanced rendering quality without scaling issues
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';


let startScreen = document.querySelector("#splash-screen");
let startBtn = document.querySelector("#start-button");
let restartBtn = document.querySelector("#restart");
let winBtn = document.querySelector("#win-start");
let mainScreenBtn = document.querySelector("#main-screen");
let gameOverMainBtn = document.querySelector("#game-over-main");
let clearScoresBtn = document.querySelector("#clear-scores");
let soundBtn = document.querySelector("#sound");
let muteBtn = document.querySelector("#mute");
let titleText = document.querySelector(".title-text")
let gameOverDiv = document.querySelector("#game-over");
let winGame = document.querySelector("#win-game");
let pauseBtn = document.querySelector("#pause");
let pauseScreen = document.querySelector("#pause-screen");
let resumeGameBtn = document.querySelector("#resume-game");
let pauseMainScreenBtn = document.querySelector("#pause-main-screen");
let pauseScoreboardDiv = document.querySelector("#pause-scoreboard");
let sideButtonsContainer = document.querySelector("#side-buttons");

// Debug: Check if buttons are found
console.log("Button elements found:", {
  startBtn: !!startBtn,
  soundBtn: !!soundBtn,
  muteBtn: !!muteBtn,
  pauseBtn: !!pauseBtn
});



//sounds
const splashSong = new Audio("./sounds/Start song One Summer's Day.mp3");
splashSong.loop = true;
splashSong.volume = 0.5;
const gameSong = new Audio('./sounds/Soot balls Spirited Away - Joe Hisaishi.mp3');
gameSong.loop = true;
gameSong.volume = 0.2;
const gameOverSong = new Audio ("./sounds/The Bottomless Pit - Joe Hisaishi.mp3");
gameOverSong.loop = true;
gameOverSong.volume = 0.1;
const winGameSong = new Audio("./sounds/Joe Hisaishi - Always With Me (Spirited Away 2002).mp3");
winGameSong.loop = true;
winGameSong.volume = 0.3;
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
let scoreboard = JSON.parse(localStorage.getItem('chihiroScoreboard')) || [];
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
let targetFPS = 120;
let frameTime = 1000 / targetFPS;
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
  // Stop all audio first
  splashSong.pause();
  gameSong.pause();
  gameOverSong.pause();
  winGameSong.pause();
  
  // Reset display states
  canvas.style.display = "none";
  gameOverDiv.style.display = "none";
  winGame.style.display = "none";
  startScreen.style.display = "flex";
  canvasDiv.style.display = "none";
  titleText.style.display = "block";
  
  // Show splash screen buttons
  startBtn.style.display = "block";
  soundBtn.style.display = "block";
  
  // Hide game-only buttons
  muteBtn.style.display = "none";
  pauseBtn.style.display = "none";
  restartBtn.style.display = "none";
  winBtn.style.display = "none";
  
  // Hide the side buttons container on splash screen
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  const clickToStart = document.querySelector("#click-to-start");
  
  // Reset sound button text
  soundBtn.innerHTML = "Play Music";
  
  // Try to auto-play splash screen music
  splashSong.currentTime = 0; // Reset to beginning
  const playPromise = splashSong.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Music started successfully
      soundBtn.innerHTML = "Stop Music";
      if (clickToStart) clickToStart.style.display = "none";
    }).catch(error => {
      console.log("Autoplay blocked by browser, will start on user interaction");
      // Show click prompt
      if (clickToStart) clickToStart.style.display = "block";
      
      // Add one-time click listener to start music on first user interaction
      const startMusicOnInteraction = () => {
        splashSong.currentTime = 0;
        splashSong.play().then(() => {
          soundBtn.innerHTML = "Stop Music";
          if (clickToStart) clickToStart.style.display = "none";
        });
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('keydown', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
      };
      
      document.addEventListener('click', startMusicOnInteraction);
      document.addEventListener('keydown', startMusicOnInteraction);
      document.addEventListener('touchstart', startMusicOnInteraction);
    });
  }
}


const drawChihiro = () => {
  ctx.drawImage(chihiroImage, chihiroX, chihiroY, chihiroWidth, chihiroHeight);
}


const movePlayer = () => {
  const settings = getOptimalSettings();
  let moveSpeed = settings.moveSpeed;
  
  // Boost movement speed for touch controls on mobile
  const isMobile = window.innerWidth < 768;
  const isTouchDevice = 'ontouchstart' in window;
  
  if (isMobile && isTouchDevice && isDragging) {
    moveSpeed = moveSpeed * touchSpeedMultiplier; // 1.5x faster for touch
  }
  
  // Enhanced movement with touch optimization
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
  ctx.font = `bold ${fontSize} 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`;
  const text = window.innerWidth < 768 ? `Time: ${timeLeft}s` : `Time left to win: ${timeLeft}s`;
  const xPos = window.innerWidth < 768 ? 20 : 200;
  
  // HD text with white outline for better readability
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeText(text, xPos, 50);
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
  ctx.font = `bold ${fontSize} 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`;
  const text = window.innerWidth < 768 ? `Invisibility: ${invisibilityTimerLeft}s` : `Invisibility time left: ${invisibilityTimerLeft}s`;
  const xPos = window.innerWidth < 768 ? 20 : 700;
  const yPos = window.innerWidth < 768 ? 80 : 70;
  
  // HD text with white outline for better readability
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeText(text, xPos, yPos);
  ctx.fillText(text, xPos, yPos);
}

const drawGamePaused = () => {
  ctx.fillStyle = "red";
  const fontSize = window.innerWidth < 768 ? "60px" : "150px";
  ctx.font = `bold ${fontSize} 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`;
  const text = "Game Paused";
  const xPos = window.innerWidth < 768 ? 50 : 260;
  const yPos = window.innerWidth < 768 ? 200 : 400;
  
  // HD text with white outline for better readability
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.strokeText(text, xPos, yPos);
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
  
  // Hide other screens
  startScreen.style.display = "none";
  gameOverDiv.style.display = "none";
  canvasDiv.style.display = "none";
  titleText.style.display = "none";
  
  // Hide side buttons
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  // Show win screen
  winGame.style.display = "flex";
  
  // Show win screen button
  winBtn.style.display = "block";
  
  // Hide game buttons
  startBtn.style.display = "none";
  soundBtn.style.display = "none";
  restartBtn.style.display = "none";
  pauseBtn.style.display = "none";
  muteBtn.style.display = "none";
  
  // Hide the side buttons container
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  gameSong.pause();
  winGameSong.currentTime = 0; // Reset to beginning
  winGameSong.play().catch(error => {
    console.log("Win game music autoplay failed, trying again:", error);
    setTimeout(() => winGameSong.play().catch(() => {}), 100);
  });
  
  // Add winning time to scoreboard
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  scoreboard.push({
    time: winningTimer,
    date: currentDate,
    timestamp: currentTime
  });
  
  // Sort scoreboard by best time (ascending)
  scoreboard.sort((a, b) => a.time - b.time);
  
  // Keep only top 10 scores
  if (scoreboard.length > 10) {
    scoreboard = scoreboard.slice(0, 10);
  }
  
  // Save to localStorage
  localStorage.setItem('chihiroScoreboard', JSON.stringify(scoreboard));
  
  let score = document.querySelector("#score")
  score.innerHTML = `Your winning time is : ${winningTimer} seconds!<br><br>` + generateScoreboardHTML();
  cancelAnimationFrame(gameId)
}

const gameOver =  () => {
  isGameOver = true
  
  // Clear all timers immediately
  clearInterval(intervalStartTimer);
  clearInterval(intervalInvisibility);
  clearInterval(intervalTimeElapsed);
  
  // Hide other screens
  startScreen.style.display = "none";
  winGame.style.display = "none";
  canvasDiv.style.display = "none";
  titleText.style.display = "none";
  
  // Hide side buttons
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  // Show game over screen
  gameOverDiv.style.display = "flex";
  
  // Show restart button
  restartBtn.style.display = "block";
  
  // Hide other buttons
  startBtn.style.display = "none";
  soundBtn.style.display = "none";
  winBtn.style.display = "none";
  pauseBtn.style.display = "none";
  muteBtn.style.display = "none";
  
  // Hide the side buttons container
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "none";
  }
  
  // Stop game music and play game over music
  gameSong.pause();
  gameOverSong.currentTime = 0; // Reset to beginning
  
  // Play game over music with fallback for mobile
  gameOverSong.play().catch(error => {
    console.log("Game over music autoplay failed, trying again:", error);
    setTimeout(() => gameOverSong.play().catch(() => {}), 100);
  });
  
  cancelAnimationFrame(gameId);
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

// Adjust game performance based on orientation and touch controls
const getOptimalSettings = () => {
  const isMobile = window.innerWidth < 768;
  const isTouchDevice = 'ontouchstart' in window;
  const isLandscapeMode = window.innerWidth > window.innerHeight;
  
  // More reasonable base speeds for better control
  let baseMovespeed = isMobile ? 8 : 10; // Back to more controlled speed
  
  // Moderate speed boost for landscape mode on mobile
  if (isMobile && isLandscapeMode) {
    baseMovespeed = 9; // Less aggressive boost
  }
  
  return {
    moveSpeed: baseMovespeed,
    bgSpeed: isMobile ? 2 : 3,
    spiritSpawnRate: isMobile ? 100 : 80,
    radishSpawnRate: isMobile ? 120 : 100,
    foodSpawnRate: isMobile ? 140 : 120,
    specialSpawnRate: isMobile ? 220 : 200,
    fps: 120 // Set to 120 FPS for all devices
  };
}

const animate = (currentTime = 0) => {
  const deltaTime = currentTime - lastTime;
  
  if (deltaTime >= frameTime) {
    // Clear canvas for better performance
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Only draw if game is not paused
    if (!isGamePaused) {
      backgroundDraw();
      drawTime();
      drawInvisibility();
      drawChihiro();
      movePlayer();
      addSpirits();
      addRadishSpirits();
      addFood();
      addSpecial();
    } else {
      // Draw minimal content when paused
      backgroundDraw();
      drawTime();
      drawInvisibility();
      drawChihiro();
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
  
  // Stop all audio to prevent music overlap
  splashSong.pause();
  gameSong.pause();
  gameOverSong.pause();
  winGameSong.pause();
}

// Add user interaction flag for audio
let userHasInteracted = false;

// Function to enable audio after user interaction
const enableAudio = () => {
  if (!userHasInteracted) {
    userHasInteracted = true;
    console.log("User interaction detected, audio enabled");
    
    // Try to play a silent sound to unlock audio context
    const silentAudio = new Audio();
    silentAudio.volume = 0;
    silentAudio.play().catch(() => {});
  }
};

// Add interaction listeners
document.addEventListener('click', enableAudio);
document.addEventListener('keydown', enableAudio);
document.addEventListener('touchstart', enableAudio);

function startGame() {
  console.log("Start game function called");
  resetGame();
  
  // Hide all screens except game
  startScreen.style.display = "none";
  gameOverDiv.style.display = "none";
  winGame.style.display = "none";
  titleText.style.display = "none";
  
  // Show game canvas
  canvasDiv.style.display = "flex";
  canvas.style.display = "block";
  
  // Show game buttons
  if (sideButtonsContainer) {
    sideButtonsContainer.style.display = "flex";
  }
  
  // Hide splash screen buttons
  startBtn.style.display = "none";
  soundBtn.style.display = "none";
  
  // Show game control buttons
  muteBtn.style.display = "block";
  pauseBtn.style.display = "block";
  
  // Ensure all other music is stopped before starting game music
  splashSong.pause();
  gameOverSong.pause();
  winGameSong.pause();
  
  // Start game music
  gameSong.currentTime = 0;
  gameSong.play().catch(error => {
    console.log("Game music autoplay failed:", error);
  });
  
  // Start game timers
  startTimer();
  timeElapsed();
  invisibilityTimer();
  
  // Start game loop
  gameId = requestAnimationFrame(animate);
}

// Button event listeners
startBtn.addEventListener("click", () => {
  console.log("Start button clicked");
  startGame();
});
restartBtn.addEventListener("click", () => {
  console.log("Restart button clicked");
  resetGame();
  startGame();
});
winBtn.addEventListener("click", () => {
  console.log("Win button clicked");
  resetGame();
  startGame();
});

mainScreenBtn.addEventListener("click", () => {
  resetGame();
  splashScreen();
});

clearScoresBtn.addEventListener("click", () => {
  clearScoreboard();
  let score = document.querySelector("#score");
  score.innerHTML = `Your winning time is : ${winningTimer} seconds!<br><br>` + generateScoreboardHTML();
});

// Pause screen button event listeners
resumeGameBtn.addEventListener("click", () => {
  hidePauseScreen();
});

pauseMainScreenBtn.addEventListener("click", () => {
  // Reset game state and return to main screen
  isGamePaused = false;
  pauseScreen.style.display = "none";
  resetGame();
  splashScreen();
});

gameOverMainBtn.addEventListener("click", () => {
  resetGame();
  splashScreen();
});

soundBtn.addEventListener("click", () => {
  console.log("Sound button clicked");
  if (splashSong.paused) {
    splashSong.play().then(() => {
      soundBtn.innerHTML = "Stop Music";
    }).catch(error => {
      console.log("Error playing splash song:", error);
    });
  } else {
    splashSong.pause();
    soundBtn.innerHTML = "Play Music";
  }
});

muteBtn.addEventListener("click", () => {
  if (gameSong.paused) {
    gameSong.play();
    muteBtn.innerHTML = "Mute";
  } else {
    gameSong.pause();
    muteBtn.innerHTML = "Unmute";
  }
});

function showPauseScreen() {
  isGamePaused = true;
  gameSong.pause();
  pauseBtn.innerHTML = "Resume";
  
  // Show pause screen as overlay without hiding canvas
  pauseScreen.style.display = "flex";
  pauseScreen.style.position = "fixed";
  pauseScreen.style.top = "0";
  pauseScreen.style.left = "0";
  pauseScreen.style.zIndex = "2000";
  
  // Show scoreboard only if there are scores
  if (scoreboard.length > 0) {
    pauseScoreboardDiv.innerHTML = `
      <h3>Best Times</h3>
      ${generateScoreboardHTML()}
    `;
  } else {
    pauseScoreboardDiv.innerHTML = `
      <h3>Best Times</h3>
      <p>No scores yet! Complete a game to see your times here.</p>
    `;
  }
}

function hidePauseScreen() {
  isGamePaused = false;
  gameSong.play();
  pauseBtn.innerHTML = "Pause";
  
  // Hide pause screen overlay
  pauseScreen.style.display = "none";
  
  gameId = requestAnimationFrame(animate);
}

pauseBtn.addEventListener("click", () => {
  if (isGamePaused) {
    hidePauseScreen();
  } else {
    showPauseScreen();
  }
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      isMovingUp = true;
      break;
    case "ArrowDown":
      isMovingDown = true;
      break;
    case "ArrowLeft":
      isMovingLeft = true;
      break;
    case " ": // Spacebar
    case "Space":
      e.preventDefault(); // Prevent page scrolling
      // Toggle pause only during gameplay
      if (startScreen.style.display === "none" && gameOverDiv.style.display === "none" && winGame.style.display === "none") {
        if (isGamePaused) {
          hidePauseScreen();
        } else {
          showPauseScreen();
        }
      }
      break;
    case "ArrowRight":
      isMovingRight = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      isMovingUp = false;
      break;
    case "ArrowDown":
      isMovingDown = false;
      break;
    case "ArrowLeft":
      isMovingLeft = false;
      break;
    case "ArrowRight":
      isMovingRight = false;
      break;
  }
});

// Enhanced touch controls for mobile (iPhone optimized)
let touchStartX = 0;
let touchStartY = 0;
let currentTouchX = 0;
let currentTouchY = 0;
let isDragging = false;
let touchMoveThreshold = 15; // More reasonable threshold to prevent over-sensitivity
let touchSpeedMultiplier = 1.1; // Slightly faster but controlled movement for touch
let lastTouchTime = 0;

// Adaptive touch settings based on device - more balanced
const isIPhone = /iPhone|iPod/.test(navigator.userAgent);
const isIPad = /iPad/.test(navigator.userAgent);
const isIOS = isIPhone || isIPad;

// More balanced settings for different devices
if (isIPhone) {
  touchMoveThreshold = 12; // Less sensitive for better control
  touchSpeedMultiplier = 1.15; // Moderate speed boost
} else if (isIPad) {
  touchMoveThreshold = 15;
  touchSpeedMultiplier = 1.1;
} else if (isIOS) {
  touchMoveThreshold = 14;
  touchSpeedMultiplier = 1.12;
}

// Improved touch start with better iPhone support
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  touchStartX = touch.clientX - rect.left;
  touchStartY = touch.clientY - rect.top;
  currentTouchX = touchStartX;
  currentTouchY = touchStartY;
  isDragging = true;
  lastTouchTime = performance.now();
}, { passive: false });

// Enhanced touch move with continuous movement and better sensitivity
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!isDragging) return;
  
  // Support multi-touch for more responsive controls
  const touch = e.touches[0]; // Primary touch
  const rect = canvas.getBoundingClientRect();
  currentTouchX = touch.clientX - rect.left;
  currentTouchY = touch.clientY - rect.top;
  
  const deltaX = currentTouchX - touchStartX;
  const deltaY = currentTouchY - touchStartY;
  const currentTime = performance.now();
  const timeDelta = currentTime - lastTouchTime;
  
  // Calculate touch velocity for smoother movement
  const velocityX = Math.abs(deltaX) / Math.max(timeDelta, 1);
  const velocityY = Math.abs(deltaY) / Math.max(timeDelta, 1);
  
  // More conservative dynamic threshold to prevent over-sensitivity
  const dynamicThreshold = Math.max(touchMoveThreshold - (velocityX + velocityY) * 0.02, touchMoveThreshold * 0.7);
  
  // Reset all movement flags
  isMovingUp = false;
  isMovingDown = false;
  isMovingLeft = false;
  isMovingRight = false;
  
  // Enhanced movement detection with velocity consideration
  if (Math.abs(deltaX) > dynamicThreshold) {
    if (deltaX > dynamicThreshold) {
      isMovingRight = true;
    } else if (deltaX < -dynamicThreshold) {
      isMovingLeft = true;
    }
  }
  
  // Vertical movement (can be simultaneous with horizontal)
  if (Math.abs(deltaY) > dynamicThreshold) {
    if (deltaY > dynamicThreshold) {
      isMovingDown = true;
    } else if (deltaY < -dynamicThreshold) {
      isMovingUp = true;
    }
  }
  
  // Less frequent reference point updates for better control
  const updateThreshold = isIPhone ? 40 : 50;
  if (Math.abs(deltaX) > updateThreshold || Math.abs(deltaY) > updateThreshold) {
    touchStartX = currentTouchX;
    touchStartY = currentTouchY;
  }
  
  lastTouchTime = currentTime;
}, { passive: false });

// Improved touch end
canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging = false;
  isMovingUp = false;
  isMovingDown = false;
  isMovingLeft = false;
  isMovingRight = false;
}, { passive: false });

// Handle touch cancel (when user touches outside canvas)
canvas.addEventListener("touchcancel", (e) => {
  e.preventDefault();
  isDragging = false;
  isMovingUp = false;
  isMovingDown = false;
  isMovingLeft = false;
  isMovingRight = false;
}, { passive: false });

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    // Always use 120 FPS regardless of device
    targetFPS = 120;
    frameTime = 1000 / targetFPS;
  }, 100);
});

// Also handle resize events for better responsiveness
window.addEventListener('resize', () => {
  // Always use 120 FPS regardless of device
  targetFPS = 120;
  frameTime = 1000 / targetFPS;
});

const generateScoreboardHTML = () => {
  if (scoreboard.length === 0) {
    return '<div style="text-align: center; margin-top: 20px;"><h3>🏆 Best Times</h3><p>No scores yet!</p></div>';
  }
  
  let html = '<div style="text-align: center; margin-top: 20px;"><h3>🏆 Best Times</h3><ol style="text-align: left; display: inline-block;">';
  
  scoreboard.forEach((entry, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
    html += `<li>${medal} ${entry.time}s - ${entry.date} ${entry.timestamp}</li>`;
  });
  
  html += '</ol></div>';
  return html;
};

const clearScoreboard = () => {
  scoreboard = [];
  localStorage.removeItem('chihiroScoreboard');
};

window.addEventListener("load", () => {
  splashScreen();
});


