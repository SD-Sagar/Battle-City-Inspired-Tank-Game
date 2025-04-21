/**
 * Main game initialization function that runs when the DOM is fully loaded.
 * Sets up initial game screens and event listeners.
 * @function
 * @listens DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  // Show thank you screen first
  document.getElementById("thankYouScreen").classList.remove("hidden");
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameWrapper").style.display = "none";

  /**
   * Continue button click handler that transitions from thank you screen to start screen
   * @listens click
   * @returns {void}
   */
  document.getElementById("continueBtn").addEventListener("click", function() {
    document.getElementById("thankYouScreen").classList.add("hidden");
    document.getElementById("startScreen").classList.remove("hidden");
    playTitleMusic(); // This will now play when the start screen appears
  });

/**
 * Audio system configuration using HTML5 Audio elements.
 * Maps sound names to their corresponding audio elements.
 * @type {Object<string, HTMLAudioElement>}
 */
/**
 * Audio system configuration using HTML5 Audio elements.
 * Maps sound names to their corresponding audio elements.
 * @type {Object<string, HTMLAudioElement>}
 * @property {HTMLAudioElement} shoot - Shooting sound effect
 * @property {HTMLAudioElement} player_hit - Player hit sound
 * @property {HTMLAudioElement} player_explosion - Player explosion sound
 * @property {HTMLAudioElement} base_hit - Base hit sound
 * @property {HTMLAudioElement} base_explosion - Base explosion sound
 * @property {HTMLAudioElement} enemy_explosion - Enemy explosion sound
 * @property {HTMLAudioElement} bullet_impact - Bullet impact sound
 * @property {HTMLAudioElement} powerup_collect - Power-up collection sound
 * @property {HTMLAudioElement} level_start - Level start sound
 * @property {HTMLAudioElement} game_over - Game over sound
 * @property {HTMLAudioElement} high_score - High score sound
 * @property {HTMLAudioElement} button_click - Button click sound
 * @property {HTMLAudioElement} pause_toggle - Pause toggle sound
 * @property {HTMLAudioElement} bg_music - Background music
 * @property {HTMLAudioElement} title_music - Title screen music
 */
const sounds = {
  'shoot': document.getElementById('shootSound'),
  'player_hit': document.getElementById('playerHitSound'),
  'player_explosion': document.getElementById('playerExplosionSound'),
  'base_hit': document.getElementById('baseHitSound'),
  'base_explosion': document.getElementById('baseExplosionSound'),
  'enemy_explosion': document.getElementById('enemyExplosionSound'),
  'bullet_impact': document.getElementById('bulletImpactSound'),
  'powerup_collect': document.getElementById('powerupCollectSound'),
  'level_start': document.getElementById('levelStartSound'),
  'game_over': document.getElementById('gameOverSound'),
  'high_score': document.getElementById('highScoreSound'),
  'button_click': document.getElementById('buttonClickSound'),
  'pause_toggle': document.getElementById('pauseToggleSound'),
  'bg_music': document.getElementById('bgMusicSound'),
  'title_music': document.getElementById('titleMusicSound')
};

/**
 * Plays a sound effect or music track.
 * @param {string} name - The name of the sound to play (key from sounds object)
 * @param {number} [volume=1.0] - The volume level (0.0 to 1.0)
 */
/**
 * Plays a sound effect or music track.
 * @param {string} name - The name of the sound to play (key from sounds object)
 * @param {number} [volume=1.0] - The volume level (0.0 to 1.0)
 * @returns {void}
 */
function playSound(name, volume = 1.0) {
  const sound = sounds[name];
  if (!sound) return;
  
  sound.volume = volume;
  sound.currentTime = 0; // Rewind to start
  sound.play().catch(e => console.error(`Error playing sound ${name}:`, e));
}

// Expose playSound globally for button clicks
window.playSound = playSound;

/**
 * Currently playing background music track
 * @type {HTMLAudioElement|null}
 */
let bgMusic = null;

/**
 * Currently playing title screen music track
 * @type {HTMLAudioElement|null}
 */
let titleMusic = null;

/**
 * Plays the title screen music, stopping any currently playing title music first.
 * Handles errors gracefully by logging them to console.
 */
/**
 * Plays the title screen music, stopping any currently playing title music first.
 * Handles errors gracefully by logging them to console.
 * @returns {void}
 */
function playTitleMusic() {
  if (titleMusic) {
    titleMusic.pause();
    titleMusic.currentTime = 0;
  }
  titleMusic = sounds['title_music'];
  titleMusic.volume = 0.5;
  titleMusic.play().catch(e => console.error("Error playing title music:", e));
}

/**
 * Plays the in-game background music, stopping any currently playing game music first.
 * Handles errors gracefully by logging them to console.
 */
/**
 * Plays the in-game background music, stopping any currently playing game music first.
 * Handles errors gracefully by logging them to console.
 * @returns {void}
 */
function playGameMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
  bgMusic = sounds['bg_music'];
  bgMusic.volume = 0.5;
  bgMusic.play().catch(e => console.error("Error playing game music:", e));
}

/**
 * Stops all currently playing music tracks (both title and game music).
 */
/**
 * Stops all currently playing music tracks (both title and game music).
 * @returns {void}
 */
function stopAllMusic() {
  if (bgMusic) bgMusic.pause();
  if (titleMusic) titleMusic.pause();
}
  
  // Start playing title music when window loads
  window.addEventListener('load', function() {
    document.getElementById("thankYouScreen").classList.remove("hidden");
    playTitleMusic();
    document.getElementById("startScreen").classList.remove("hidden");
  });

  // Add this near the top with other variables
  let animationFrameId = null;
  
  /**
 * Updates the display of active power-up effects on the HUD.
 * Creates and manages visual indicators for player shield, base shield, and magic bullets.
 */
function updateActiveEffects() {
  const activeEffectsContainer = document.getElementById('activeEffects');
  //edit name at 887
  // Clear previous displays
  activeEffectsContainer.innerHTML = '';
  
  // Only show effects when not paused
  if (!isPaused) {
    // Add shield effect only when it's from power-up (not when hit)
    if (player.invincible >= 99 && player.invincible <= 600) { // 600 frames = 10 seconds at 60fps
      const shieldEffect = document.createElement('div');
      shieldEffect.className = 'power-up-name active shield-effect';
      shieldEffect.textContent = 'PLAYER SHIELD';
      // shieldEffect.textContent = 'PLAYER SHIELD: ' + Math.ceil(player.invincible/60) + 's';
      activeEffectsContainer.appendChild(shieldEffect);
    }
    
    // Add base shield effect if active
    if (base.invincible) {
      const baseShieldEffect = document.createElement('div');
      baseShieldEffect.className = 'power-up-name active base-shield-effect';
      baseShieldEffect.textContent = 'BASE SHIELD';
      activeEffectsContainer.appendChild(baseShieldEffect);
    }
    
    // Add magic bullets effect if active
    if (magicBulletsActive) {
      const magicEffect = document.createElement('div');
      magicEffect.className = 'power-up-name active magic-effect';
      magicEffect.textContent = 'MAGIC BULLETS';
      activeEffectsContainer.appendChild(magicEffect);
    }
  }
  
  // Remove the rapid fire effect display
  // if (player.cooldown === 5) {
  //   const rapidEffect = document.createElement('div');
  //   rapidEffect.className = 'power-up-name active rapid-effect';
  //   rapidEffect.textContent = 'RAPID FIRE';
  //   activeEffectsContainer.appendChild(rapidEffect);
  // }
}

  /**
 * Updates timers for active power-ups and their visual effects.
 * Handles base shield and magic bullet duration tracking.
 */
function updatePowerUpTimers() {
    if (isPaused || playerDeathAnimationStarted) return;
    
    const now = Date.now();
    
    // Base Shield Timer
    if (baseShieldActive) {
        const elapsed = now - baseShieldStartTime;
        baseShieldTimeRemaining = BASE_SHIELD_DURATION - elapsed;
        
        if (baseShieldTimeRemaining <= 0) {
            base.invincible = false;
            baseShieldActive = false;
        }
    }
    
    // Magic Bullet Timer
    if (magicBulletsActive) {
        const elapsed = now - magicBulletStartTime;
        magicBulletTimeRemaining = MAGIC_BULLET_DURATION - elapsed;
        
        if (magicBulletTimeRemaining <= 0) {
            magicBulletsActive = false;
        }
    }
    
    updateActiveEffects();
  }
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  /**
 * Game constants and configuration variables
 * @namespace
 * @property {number} TILE_SIZE - Size of each tile in pixels (32px)
 * @property {number} MAP_ROWS - Number of rows in the game map (20)
 * @property {number} MAP_COLS - Number of columns in the game map (26)
 * @property {number} speedPowerTime - Timer for speed power-up effect
 * @property {number} baseShieldTime - Timer for base shield effect
 * @property {boolean} baseShieldActive - Flag indicating if base shield is active
 * @property {number} baseShieldStartTime - Timestamp when base shield was activated
 * @property {number} baseShieldTimeRemaining - Remaining duration of base shield in ms
 * @property {number} BASE_SHIELD_DURATION - Total duration of base shield effect (10000ms)
 * @property {Timeout|null} baseShieldTimeout - Reference to base shield timeout
 * @property {boolean} isPaused - Flag indicating if game is paused
 * @property {number} rapidPowerTime - Timer for rapid fire power-up effect
 * @property {boolean} magicBulletsActive - Flag indicating if magic bullets are active
 * @property {number} magicBulletStartTime - Timestamp when magic bullets were activated
 * @property {number} magicBulletTimeRemaining - Remaining duration of magic bullets in ms
 * @property {number} MAGIC_BULLET_DURATION - Total duration of magic bullets effect (10000ms)
 * @property {Array} rgbLineParticles - Array of particles for RGB line effect
 * @property {number} rgbLineHue - Current hue value for RGB line effect
 * @property {number} highScore - Highest score achieved, stored in localStorage
 * @property {boolean} baseDeathAnimationStarted - Flag indicating if base death animation is playing
 */
  const TILE_SIZE = 32;
  const MAP_ROWS = 20;
  const MAP_COLS = 26;
  /**
   * Timer tracking duration of player speed power-up effect
   * @type {number}
   */
  let speedPowerTime = 0;
  
  /**
   * Timer tracking duration of base shield power-up effect
   * @type {number}
   */
  let baseShieldTime = 0;
  
  /**
   * Flag indicating if base shield power-up is currently active
   * @type {boolean}
   */
  let baseShieldActive = false;
  
  /**
   * Timestamp when base shield was activated (in milliseconds)
   * @type {number}
   */
  let baseShieldStartTime = 0;
  
  /**
   * Remaining duration of base shield effect (in milliseconds)
   * @type {number}
   */
  let baseShieldTimeRemaining = 0;
  
  /**
   * Total duration of base shield effect (10 seconds)
   * @type {number}
   * @constant
   */
  const BASE_SHIELD_DURATION = 10000;
  
  /**
   * Timeout reference for base shield expiration
   * @type {Timeout|null}
   */
  let baseShieldTimeout = null;
  
  /**
   * Flag indicating if game is currently paused
   * @type {boolean}
   */
  let isPaused = false;
  
  /**
   * Timer tracking duration of rapid fire power-up effect
   * @type {number}
   */
  let rapidPowerTime = 0;
  
  /**
   * Flag indicating if magic bullets power-up is active
   * @type {boolean}
   */
  let magicBulletsActive = false;
  
  /**
   * Timestamp when magic bullets were activated (in milliseconds)
   * @type {number}
   */
  let magicBulletStartTime = 0;
  
  /**
   * Remaining duration of magic bullets effect (in milliseconds)
   * @type {number}
   */
  let magicBulletTimeRemaining = 0;
  
  /**
   * Total duration of magic bullets effect (10 seconds)
   * @type {number}
   * @constant
   */
  const MAGIC_BULLET_DURATION = 10000;
  
  /**
   * Array of particles for RGB visual effect line
   * @type {Array<Object>}
   */
  let rgbLineParticles = [];
  
  /**
   * Current hue value for RGB line color cycling (0-360)
   * @type {number}
   */
  let rgbLineHue = 0;
  
  /**
   * Highest score achieved, persisted in localStorage
   * @type {number}
   */
  let highScore = localStorage.getItem('highScore') || 0;
  
  /**
   * Flag indicating if base destruction animation is playing
   * @type {boolean}
   */
  let baseDeathAnimationStarted = false;

/**
 * Updates and displays the high score when a new record is achieved.
 * Plays celebration sound and creates visual effects for the new high score.
 */
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    playSound('high_score', 1.0);
    document.getElementById('highScoreDisplay').textContent = highScore;
    
    // Add celebration effect when new high score is achieved
    const display = document.getElementById('highScoreDisplay');
    display.style.animation = 'none';
    void display.offsetWidth; // Trigger reflow
    display.style.animation = 'pulse-gold 0.5s infinite';
    
    // Create a small particle effect
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'highScoreParticle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      document.getElementById('highScoreContainer').appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }
  
  // Always update display in case it's showing old value
  document.getElementById('highScoreDisplay').textContent = highScore;
}

/**
 * Updates the RGB particle effects along the speaker lines.
 * Manages particle lifecycle and creates new particles with random properties.
 */
function updateRGBLineParticles() {
  // Update existing particles
  for (let i = rgbLineParticles.length - 1; i >= 0; i--) {
    const p = rgbLineParticles[i];
    p.y += p.speed;
    p.life--;
    
    if (p.life <= 0 || p.y > canvas.height) {
      rgbLineParticles.splice(i, 1);
    }
  }
  
  // Add new particles along the line (less frequently for performance)
  if (Math.random() < 0.3) { // 30% chance per frame to add a particle
    // Middle speaker particles
    const middleLineY = MAP_ROWS * TILE_SIZE + 45 + 80 + 10; // Below D-pad with 10px gap
    const middleX = Math.random() * canvas.width;
    
    rgbLineParticles.push({
      x: middleX,
      y: middleLineY,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 3 + 1,
      hue: (rgbLineHue + Math.random() * 60) % 360,
      life: 100,
      alpha: 0.7 + Math.random() * 0.3
    });
    
    // Left speaker particles
    const leftLineY = MAP_ROWS * TILE_SIZE + 22; // Speaker hole Y position
    const leftX = 40 + Math.random() * 250; // Speaker grill area (40 to 290)
    
    rgbLineParticles.push({
      x: leftX,
      y: leftLineY,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 3 + 1,
      hue: (rgbLineHue + Math.random() * 60) % 360,
      life: 100,
      alpha: 0.7 + Math.random() * 0.3
    });
  }
  
  rgbLineHue = (rgbLineHue + 1) % 360;
}

/**
 * Draws the RGB line and particles on the canvas.
 * Uses HSL color cycling for visual effect.
 */
function drawRGBLine() {
  const lineY = MAP_ROWS * TILE_SIZE + 45 + 80 + -23; // Same as in update function
  
  // Draw the RGB line
  ctx.strokeStyle = `hsl(${rgbLineHue}, 100%, 50%)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, lineY);
  ctx.lineTo(canvas.width, lineY);
  ctx.stroke();
  
  // Draw particles
  rgbLineParticles.forEach(p => {
    ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
}

  /**
   * Game state variables
   * @namespace
   * @property {number} lives - Player lives remaining (default: 3)
   * @property {number} score - Current game score
   * @property {number} level - Current game level
   * @property {number} enemiesLeft - Number of enemies remaining in current wave
   * @property {boolean} gameRunning - Flag indicating if game loop is active
   * @property {number} lastTime - Timestamp of last frame for delta time calculation
   * @property {boolean} playerDeathAnimationStarted - Flag indicating if player death animation is playing
   */
  let lives = 3;
  let score = 0;
  let level = 1;
  let enemiesLeft = 0;
  let gameRunning = false;
  let lastTime = 0;
  let playerDeathAnimationStarted = false;

  /**
   * Game map array (2D array of tile types)
   * @type {Array<Array<number>>}
   * @property {number} 0 - Empty space
   * @property {number} 1 - Wall (indestructible)
   * @property {number} 2 - Power-up spawn point
   * @property {number} 3 - Player base
   * @property {number} 4 - Breakable wall
   */
  const map = generateProceduralMap();

  /**
   * Player object containing all player properties
   * @type {Object}
   * @property {number} x - X position in pixels
   * @property {number} y - Y position in pixels
   * @property {number} size - Size in pixels (matches TILE_SIZE)
   * @property {number} speed - Movement speed in pixels per frame
   * @property {string} direction - Current facing direction ('up', 'down', 'left', 'right')
   * @property {number} cooldown - Firing cooldown timer
   * @property {number} invincible - Invincibility frames remaining (0 = vulnerable)
   * @property {number} dx - Current horizontal velocity
   * @property {number} dy - Current vertical velocity
   */
  const player = {
    x: TILE_SIZE * 12,
    y: TILE_SIZE * 16,
    size: TILE_SIZE,
    speed: 3,
    direction: 'up',
    cooldown: 0,
    invincible: 0,
    dx: 0,
    dy: 0
  };

  /**
   * Base object containing all base properties
   * @type {Object}
   * @property {number} x - X position in pixels
   * @property {number} y - Y position in pixels
   * @property {number} size - Size in pixels (2 tiles wide)
   * @property {number} health - Current health points (default: 5)
   * @property {boolean} invincible - Flag indicating if base is invincible
   */
  const base = {
    x: TILE_SIZE * 10,
    y: TILE_SIZE * 10,
    size: TILE_SIZE * 2,
    health: 5
  };

  /**
   * Game object arrays
   * @namespace
   * @property {Array} bullets - Array of active player bullets
   * @property {Array} enemyBullets - Array of active enemy bullets
   * @property {Array} enemies - Array of active enemies
   * @property {Array} powerUps - Array of active power-ups
   * @property {Array} particles - Array of active visual effect particles
   */
  const bullets = [];
  const enemyBullets = [];
  const enemies = [];
  const powerUps = [];
  const particles = [];

  // Generate procedural map with varied terrain
  function generateProceduralMap() {
    const newMap = Array(MAP_ROWS).fill().map(() => Array(MAP_COLS).fill(0));
    
    // Border walls
    for (let i = 0; i < MAP_ROWS; i++) {
      newMap[i][0] = 1;
      newMap[i][MAP_COLS-1] = 1;
    }
    for (let j = 0; j < MAP_COLS; j++) {
      newMap[0][j] = 1;
      newMap[MAP_ROWS-1][j] = 1;
    }

    // Add base area - modified to have only the base (3) and breakable walls (4)
    for (let i = 8; i < 14; i++) {
      for (let j = 8; j < 14; j++) {
        if ((i === 10 || i === 11) && (j === 10 || j === 11)) {
          newMap[i][j] = 3; // Base
        } else if (i === 8 || i === 13 || j === 8 || j === 13) {
          newMap[i][j] = 4; // Breakable wall - only on the outer ring
        }
      }
    }

    // Procedural terrain generation
    const terrainTypes = [
      {type: 1, count: 40},  // Solid walls
      {type: 4, count: 60}   // Breakable walls
    ];

    terrainTypes.forEach(terrain => {
      for (let i = 0; i < terrain.count; i++) {
        const x = Math.floor(Math.random() * (MAP_COLS - 4)) + 2;
        const y = Math.floor(Math.random() * (MAP_ROWS - 4)) + 2;
        
        // Ensure we don't overwrite important areas
        if (newMap[y][x] === 0 && 
            !(x >= 8 && x <= 13 && y >= 8 && y <= 13) &&
            !(x === 4 && y === 4) &&
            !(x === 21 && y === 4) &&
            !(x === 4 && y === 15) &&
            !(x === 21 && y === 15)) {
          newMap[y][x] = terrain.type;
        }
      }
    });

    // Add power-up spawn points
    newMap[4][4] = 2;
    newMap[4][21] = 2;
    newMap[15][4] = 2;
    newMap[15][21] = 2;

    return newMap;
  }

  // Initialize game
  function initGame() {
    // Regenerate the map completely
    map.length = 0;
    map.push(...generateProceduralMap());

    // Clear all game objects
    bullets.length = 0;
    enemyBullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;
    particles.length = 0;

    // Reset player position with safe spawn
    player.x = TILE_SIZE * 12;
    player.y = TILE_SIZE * 16;
    ensureSafeSpawn();
    player.direction = 'up';
    player.cooldown = 0;
    player.invincible = 60; // Brief invincibility on game start
    player.speed = 3;
    player.dx = 0;
    player.dy = 0;

    // Reset base
    base.health = 5;
    base.invincible = false;
    if (baseShieldTimeout) {
      clearTimeout(baseShieldTimeout);
      baseShieldTimeout = null;
    }

    // Reset game state
    lives = 3;
    score = 0;
    level = 1;
    updateHUD();
  
  // Initialize high score display
  updateHighScore();
    
    // Reset power-up states and timers
    speedPowerTime = 0;
    rapidPowerTime = 0;
    
    // Base shield reset
    baseShieldActive = false;
    baseShieldStartTime = 0;
    baseShieldTimeRemaining = 0;
    if (baseShieldTimeout) {
      clearTimeout(baseShieldTimeout);
      baseShieldTimeout = null;
    }
    
    // Magic bullets reset
    magicBulletsActive = false;
    magicBulletStartTime = 0;
    magicBulletTimeRemaining = 0;
    
    isPaused = false;
    playerDeathAnimationStarted = false;
    baseDeathAnimationStarted = false; // Reset base death animation flag
    
    // Initial spawns
    spawnEnemies(3);
    spawnPowerUps(2);
  }

  // Update all HUD elements
  function updateHUD() {
    document.getElementById("lives").textContent = lives;
    document.getElementById("score").textContent = score;
    document.getElementById("enemyCount").textContent = enemiesLeft;
    document.getElementById("level").textContent = level;
    document.getElementById("baseHealth").textContent = base.health;
    updateHighScore();
  }

  // Spawn enemies with improved AI
  function spawnEnemies(count) {
    const enemyCount = count + Math.floor(level / 2);
    const spawnPoints = [
        { x: 2, y: 2 },    // Top-left
        { x: 23, y: 2 },   // Top-right
        { x: 2, y: 17 },   // Bottom-left
        { x: 23, y: 17 },  // Bottom-right
        { x: 12, y: 2 },   // Top-center
        { x: 2, y: 9 }     // Left-center
    ];

    for (let i = 0; i < enemyCount; i++) {
        const spawn = spawnPoints[i % spawnPoints.length];
        
        // Ensure spawn position is valid
        let spawnX = spawn.x;
        let spawnY = spawn.y;
        let attempts = 0;
        
        // Try to find a valid spawn position
        while (attempts < 5 && !canMoveTo(spawnX * TILE_SIZE, spawnY * TILE_SIZE, TILE_SIZE, TILE_SIZE)) {
            spawnX += Math.random() > 0.5 ? 1 : -1;
            spawnY += Math.random() > 0.5 ? 1 : -1;
            attempts++;
        }
        
        const enemyType = Math.random() > 0.7 ? 2 : 1;
        const speed = 1.5 + (level * 0.1) + (enemyType === 2 ? 0.5 : 0);
        const health = enemyType + Math.floor(level / 3);
        
        enemies.push({
            x: spawnX * TILE_SIZE,
            y: spawnY * TILE_SIZE,
            size: TILE_SIZE,
            speed: speed,
            dir: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)],
            cooldown: Math.floor(Math.random() * 100),
            health: health,
            type: enemyType,
            moveTimer: 0,
            targetChangeCooldown: 0,
            dx: 0,
            dy: 0,
            fireRate: 30 + Math.floor(Math.random() * 20) - (level * 2)
        });
    }
    enemiesLeft = enemies.length;
    updateHUD();
  
  // Initialize high score display
  updateHighScore();
  }

  // Spawn power-ups
  function spawnPowerUps(count) {
    const powerUpSpots = [
      { x: 4, y: 4 },
      { x: 21, y: 4 },
      { x: 4, y: 15 },
      { x: 21, y: 15 }
    ];

    for (let i = 0; i < count; i++) {
      const spot = powerUpSpots[i % powerUpSpots.length];
      const types = ['life', 'shield', 'baseShield', 'magicBullet'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      if (map[spot.y][spot.x] === 2) {
        powerUps.push({
          x: spot.x * TILE_SIZE,
          y: spot.y * TILE_SIZE,
          size: TILE_SIZE,
          active: true,
          type: type,
          animationFrame: 0
        });
      }
    }
  }

  // Create explosion particles
  function createExplosion(x, y, color, count = 15) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + Math.random() * 16 - 8,
        y: y + Math.random() * 16 - 8,
        size: Math.random() * 4 + 2,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        color: color,
        life: 30 + Math.random() * 30
      });
    }
  }

  // Create bullet impact effect
  function createImpact(x, y) {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x,
        y: y,
        size: Math.random() * 3 + 1,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        color: '#FFD700',
        life: 10 + Math.random() * 10
      });
    }
  }

  function createPlayerDeathExplosion(x, y) {
    // Create a more dramatic explosion for player death with blue colors
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: x + Math.random() * player.size - player.size/2,
        y: y + Math.random() * player.size - player.size/2,
        size: Math.random() * 8 + 4,
        dx: Math.random() * 6 - 3,
        dy: Math.random() * 6 - 3,
        color: i % 2 === 0 ? '#0099FF' : '#00BFFF', // Light blue and deep sky blue
        life: 60 + Math.random() * 60
      });
    }
  }

  function createBaseDeathExplosion(x, y) {
    playSound('base_explosion', 1.0);
    // Create a dramatic explosion for base death
    for (let i = 0; i < 100; i++) { // More particles than player death
      particles.push({
        x: x + Math.random() * base.size - base.size/2,
        y: y + Math.random() * base.size - base.size/2,
        size: Math.random() * 10 + 5, // Larger particles
        dx: Math.random() * 8 - 4,
        dy: Math.random() * 8 - 4,
        color: i % 2 === 0 ? '#FF0000' : '#FFD700', // Red and gold particles
        life: 80 + Math.random() * 80 // Longer life
      });
    }
  }

  // Add this function to consolidate death handling
  function triggerPlayerDeath() {
  playSound('player_explosion', 1.0);
    if (!playerDeathAnimationStarted) {
      playerDeathAnimationStarted = true;
      createPlayerDeathExplosion(player.x + player.size/2, player.y + player.size/2);
      playSound('player_explosion', 1.0);
      
      // Wait for explosion to complete before showing game over
      setTimeout(() => {
        gameOver("You were destroyed!");
        playerDeathAnimationStarted = false;
      }, 2000); // Increased from 1500ms to 2000ms
    }
  }

  // Shooting function with impact effects
  function shoot(x, y, dir, isEnemy = false) {
    if (!isEnemy && player.cooldown > 0) return;
    
    // Only play shoot sound for player bullets
    if (!isEnemy) {
        playSound('shoot', 0.7);
    }
    
    const speed = isEnemy ? 4 : 5;
    let dx = 0, dy = 0;
    switch(dir) {
      case 'up': dy = -1; break;
      case 'down': dy = 1; break;
      case 'left': dx = -1; break;
      case 'right': dx = 1; break;
    }
    
    const bullet = {
      x: x + TILE_SIZE/2 - 4,
      y: y + TILE_SIZE/2 - 4,
      dx: dx * speed,
      dy: dy * speed,
      size: 8,
      isEnemy: isEnemy,
      isMagic: magicBulletsActive && !isEnemy
    };
    
    if (isEnemy) {
      enemyBullets.push(bullet);
    } else {
      bullets.push(bullet);
      player.cooldown = rapidPowerTime > 0 ? 5 : 15;
    }
  }

  // Improved player movement with strict grid-based collision
  function movePlayer(dx, dy, direction) {
    player.dx = dx * player.speed;
    player.dy = dy * player.speed;
    player.direction = direction;
  }

  // Strict collision checking with padding for gaps
  function canMoveTo(x, y, width, height) {
    // Check boundaries
    if (x < 0 || x + width > canvas.width || y < 0 || y + height > canvas.height) {
        return false;
    }
    
    // Add small buffer for smoother movement through gaps
    const buffer = 2;
    
    // Convert to grid coordinates with adjusted hitbox
    const left = Math.floor((x + buffer) / TILE_SIZE);
    const right = Math.floor((x + width - buffer) / TILE_SIZE);
    const top = Math.floor((y + buffer) / TILE_SIZE);
    const bottom = Math.floor((y + height - buffer) / TILE_SIZE);
    
    // Check all covered tiles
    for (let row = top; row <= bottom; row++) {
        for (let col = left; col <= right; col++) {
            if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) {
                return false;
            }
            if (map[row][col] === 1 || map[row][col] === 3 || map[row][col] === 4) {
                return false;
            }
        }
    }
    
    return true;
  }

  // Function for enemy movement that allows passing through other enemies but not the player
  function canEnemyMoveTo(x, y, width, height) {
    // First check collision with map
    if (!canMoveTo(x, y, width, height)) {
      return false;
    }
    
    // Then check collision with player
    if (player.x < x + width && 
        player.x + player.size > x && 
        player.y < y + height && 
        player.y + player.size > y) {
      return false;
    }
    
    // Don't check collision with other enemies
    return true;
  }

  // Function for player movement that checks for collisions with enemies
  function canPlayerMoveTo(x, y, width, height) {
    // First check collision with map
    if (!canMoveTo(x, y, width, height)) {
      return false;
    }
    
    // Check collision with each enemy
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (x < enemy.x + enemy.size && 
          x + width > enemy.x && 
          y < enemy.y + enemy.size && 
          y + height > enemy.y) {
        return false;
      }
    }
    
    return true;
  }

  // Smooth player position update with strict collision
  function ensureSafeSpawn() {
  let attempts = 0;
  const spawnX = TILE_SIZE * 12;
  const spawnY = TILE_SIZE * 16;
  
  // If spawn position is blocked, find nearest safe spot
  while (attempts < 5 && !canPlayerMoveTo(spawnX, spawnY, player.size, player.size)) {
    player.x += TILE_SIZE * (attempts % 2 === 0 ? 1 : -1);
    player.y += TILE_SIZE * (attempts < 2 ? 1 : -1);
    attempts++;
  }
  
  // If still not safe, do a more thorough search
  if (attempts >= 5 && !canPlayerMoveTo(player.x, player.y, player.size, player.size)) {
    for (let y = 16; y < MAP_ROWS; y++) {
      for (let x = 12; x < MAP_COLS; x++) {
        if (canPlayerMoveTo(x * TILE_SIZE, y * TILE_SIZE, player.size, player.size)) {
          player.x = x * TILE_SIZE;
          player.y = y * TILE_SIZE;
          return;
        }
      }
    }
  }
}

// Update snapToGrid function to use canPlayerMoveTo
function snapToGrid() {
  // Only snap if completely stopped and near grid line
  if (player.dx !== 0 || player.dy !== 0) return;
  
  // Calculate grid positions
  const tileX = Math.round(player.x / TILE_SIZE) * TILE_SIZE;
  const tileY = Math.round(player.y / TILE_SIZE) * TILE_SIZE;
  
  // Increased threshold from 2 to 4 pixels
  const snapThreshold = 4;
  
  // Only snap if within threshold of grid line
  if (Math.abs(player.x - tileX) <= snapThreshold || 
      Math.abs(player.y - tileY) <= snapThreshold) {
    // Only snap if the target position is valid
    if (canPlayerMoveTo(tileX, tileY, player.size, player.size)) {
      player.x = tileX;
      player.y = tileY;
    }
  }
}

// Update updatePlayerPosition function to use canPlayerMoveTo and speed factor
function updatePlayerPosition(speedFactor = 1) {
    if (player.dx === 0 && player.dy === 0) {
      snapToGrid();
      return;
    }
    
    // Apply speed factor for consistent movement regardless of frame rate
    const adjustedDx = player.dx * speedFactor;
    const adjustedDy = player.dy * speedFactor;
    
    const newX = player.x + adjustedDx;
    const newY = player.y + adjustedDy;
    
    if (canPlayerMoveTo(newX, newY, player.size, player.size)) {
      player.x = newX;
      player.y = newY;
    } else {
      // When hitting a wall, add small correction to "push" player away
      const correction = 2; // Small correction value
      if (!canPlayerMoveTo(newX, player.y, player.size, player.size)) {
        player.x += (player.dx > 0 ? -correction : correction);
      }
      if (!canPlayerMoveTo(player.x, newY, player.size, player.size)) {
        player.y += (player.dy > 0 ? -correction : correction);
      }
      
      player.dx = 0;
      player.dy = 0;
      snapToGrid();
    }
  }

  // Handle keyboard input with pause functionality
  const keys = {};
  let spaceKeyPressed = false; // Track space key state for continuous shooting
  
  document.addEventListener("keydown", (e) => {
    if (!gameRunning) return;
    
    if (e.key === "p" || e.key === "P") {
      togglePause();
      return;
    }
    
    if (isPaused) return;
    
    keys[e.key] = true;
    
    // Handle shooting on key press (instantly) independent of direction changes
    if (e.key === " ") {
      spaceKeyPressed = true;
      shoot(player.x, player.y, player.direction);
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
    
    // Stop continuous shooting when space is released
    if (e.key === " ") {
      spaceKeyPressed = false;
    }
  });

  // Toggle pause state
  function togglePause() {
  playSound('pause_toggle', 1.0);
    isPaused = !isPaused;
    playSound('pause_toggle', 1.0);
    document.getElementById("pauseIndicator").classList.toggle("hidden");
    
    if (isPaused) {
        // When pausing, store remaining time
        if (baseShieldActive) {
            baseShieldTimeRemaining = BASE_SHIELD_DURATION - (Date.now() - baseShieldStartTime);
        }
        if (magicBulletsActive) {
            magicBulletTimeRemaining = MAGIC_BULLET_DURATION - (Date.now() - magicBulletStartTime);
        }
    } else {
        // When unpausing, reset start time with remaining duration
        if (baseShieldActive) {
            baseShieldStartTime = Date.now() - (BASE_SHIELD_DURATION - baseShieldTimeRemaining);
        }
        if (magicBulletsActive) {
            magicBulletStartTime = Date.now() - (MAGIC_BULLET_DURATION - magicBulletTimeRemaining);
        }
    }
}

  function handleContinuousInput() {
    if (!gameRunning || isPaused) return;
    
    // Handle direction changes
    let dx = 0, dy = 0;
    let directionChanged = false;
    let previousDirection = player.direction;
    
    if (keys["ArrowUp"]) { dy = -1; player.direction = 'up'; }
    if (keys["ArrowDown"]) { dy = 1; player.direction = 'down'; }
    if (keys["ArrowLeft"]) { dx = -1; player.direction = 'left'; }
    if (keys["ArrowRight"]) { dx = 1; player.direction = 'right'; }
    
    // Check if direction changed this frame
    if (previousDirection !== player.direction) {
      directionChanged = true;
    }
    
    // If changing direction, snap to grid first for smoother movement
    if ((dx !== 0 && player.dy !== 0) || (dy !== 0 && player.dx !== 0)) {
      snapToGrid();
    }
    
    movePlayer(dx, dy, player.direction);
    
    // Handle continuous shooting when space is held
    if (spaceKeyPressed && player.cooldown <= 0) {
      shoot(player.x, player.y, player.direction);
    }
    
    // If direction changed and space is held, shoot immediately in the new direction
    if (directionChanged && spaceKeyPressed && player.cooldown <= 0) {
      shoot(player.x, player.y, player.direction);
    }
  }

  // Update bullets with impact effects and speed factor
  function updateBullets(speedFactor = 1) {
    if (isPaused || playerDeathAnimationStarted) return;
    
    // Check for bullet-bullet collisions first
    for (let i = bullets.length - 1; i >= 0; i--) {
      const playerBullet = bullets[i];
      
      for (let j = enemyBullets.length - 1; j >= 0; j--) {
        const enemyBullet = enemyBullets[j];
        
        // Check if player bullet and enemy bullet collide
        if (playerBullet.x < enemyBullet.x + enemyBullet.size && 
            playerBullet.x + playerBullet.size > enemyBullet.x && 
            playerBullet.y < enemyBullet.y + enemyBullet.size && 
            playerBullet.y + playerBullet.size > enemyBullet.y) {
          
          // Create bullet collision effect - a mix of blue and red
          createImpact((playerBullet.x + enemyBullet.x) / 2, (playerBullet.y + enemyBullet.y) / 2);
          
          // Remove both bullets
          bullets.splice(i, 1);
          enemyBullets.splice(j, 1);
          
          // Add some score for shooting down an enemy bullet
          score += 10;
          updateHUD();
          updateHighScore();
          
          // We've handled this player bullet, so break out of the enemy bullet loop
          break;
        }
      }
    }
    
    // Player bullets with speed factor
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.dx * speedFactor;
      b.y += b.dy * speedFactor;
      
      // Magic bullets should pass through walls
      if (!b.isMagic) {
        // Regular collision checks with walls
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
          createImpact(b.x, b.y);
          bullets.splice(i, 1);
          playSound('bullet_impact', 0.7);
          continue;
        }
        
        const gridX = Math.floor(b.x / TILE_SIZE);
        const gridY = Math.floor(b.y / TILE_SIZE);
        
        if (gridX < 0 || gridX >= MAP_COLS || gridY < 0 || gridY >= MAP_ROWS || 
            (map[gridY] && map[gridY][gridX] === 1)) {
          createImpact(b.x, b.y);
          bullets.splice(i, 1);
          
            playSound('bullet_impact', 0.7);
          continue;
        } else if (map[gridY] && map[gridY][gridX] === 4) {
          map[gridY][gridX] = 0; // Destroy breakable wall
          createExplosion(b.x, b.y, '#8D6E63');
          bullets.splice(i, 1);
          score += 20;
          updateHUD();
          
          // Play sound only for player bullets
          if (!b.isEnemy) {
            playSound('bullet_impact', 0.7);
          }

          // Initialize high score display
          updateHighScore();
          continue;
        }
      }
      
      // Check base collision
      if (b.x < base.x + base.size && b.x + b.size > base.x && 
          b.y < base.y + base.size && b.y + b.size > base.y) {
        createExplosion(b.x, b.y, '#FFD700');
        bullets.splice(i, 1);
        if (!base.invincible && !baseDeathAnimationStarted) {
          base.health--;
          playSound('base_hit', 1.0);
          updateHUD();

          // Initialize high score display
          updateHighScore();
          if (base.health <= 0) {
            baseDeathAnimationStarted = true;
            createBaseDeathExplosion(base.x + base.size/2, base.y + base.size/2);
            setTimeout(() => {
              gameOver("You destroyed your own base!");
              baseDeathAnimationStarted = false;
            }, 2000);
          }
        }
        continue;
      }
      
      // Check enemy collision
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (b.x < e.x + e.size && b.x + b.size > e.x && 
            b.y < e.y + e.size && b.y + b.size > e.y) {
          e.health--;
          if (e.health <= 0) {
            createExplosion(e.x + e.size/2, e.y + e.size/2, '#F44336', 25);
            enemies.splice(j, 1);
            enemiesLeft--;
            playSound('enemy_explosion', 1.0);
            score += e.type === 2 ? 150 : 100;
            // Give +1 life every 1000 points
            const previousBonusLife = Math.floor((score - 20) / 1000);
            const currentBonusLife = Math.floor(score / 1000);
            if (currentBonusLife > previousBonusLife) {
              lives++;
              // Play a sound when gaining a life
              playSound('powerup_collect', 0.5);
              updateHUD();
              // Initialize high score display
              updateHighScore();
            }
          } else {
            createImpact(b.x, b.y);
          }
          bullets.splice(i, 1);
          break;
        }
      }
    }
    
    // Enemy bullets with speed factor
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];
      b.x += b.dx * speedFactor;
      b.y += b.dy * speedFactor;
      
      if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
        createImpact(b.x, b.y);
        enemyBullets.splice(i, 1);
        // playSound('bullet_impact', 0.7); not good
        continue;
      }
      
      const gridX = Math.floor(b.x / TILE_SIZE);
      const gridY = Math.floor(b.y / TILE_SIZE);
      
      if (map[gridY] && map[gridY][gridX] === 1) {
        createImpact(b.x, b.y);
        enemyBullets.splice(i, 1);
        // playSound('bullet_impact', 0.7);
        continue;
      } else if (map[gridY] && map[gridY][gridX] === 4) {
        map[gridY][gridX] = 0; // Destroy breakable wall
        createExplosion(b.x, b.y, '#8D6E63');
        enemyBullets.splice(i, 1);
        continue;
      }
      
      // Check player collision - always check collision but only deduct lives if shield is not active
      if (b.x < player.x + player.size && b.x + b.size > player.x && 
          b.y < player.y + player.size && b.y + b.size > player.y) {
        // Use yellow explosion if shield is active, blue if not
        const explosionColor = player.invincible > 0 ? "#FFFF00" : "#2196F3";
        createExplosion(b.x, b.y, explosionColor);
        enemyBullets.splice(i, 1);
        
        // Only deduct lives if shield is not active
        if (player.invincible <= 0) {
          lives--;
          player.invincible = 60;
          playSound('player_hit', 1.0);
          updateHUD();

          // Initialize high score display
          updateHighScore();
          if (lives <= 0) {
            triggerPlayerDeath();
            return;
          }
        }
        continue;
      }
      
      // Check base collision - modified to match player bullet behavior
      if (b.x < base.x + base.size && b.x + b.size > base.x && 
          b.y < base.y + base.size && b.y + b.size > base.y) {
        createExplosion(b.x, b.y, '#FFD700');
        enemyBullets.splice(i, 1);
        if (!base.invincible && !baseDeathAnimationStarted) {
          base.health--;
          playSound('base_hit', 1.0);
          updateHUD();
          updateHighScore();
          if (base.health <= 0) {
            baseDeathAnimationStarted = true;
            createBaseDeathExplosion(base.x + base.size/2, base.y + base.size/2);
            setTimeout(() => {
              gameOver("Your base was destroyed!");
              baseDeathAnimationStarted = false;
            }, 2000);
          }
        }
        continue;
      }
    }
  }

  // Update enemies with improved AI and speed factor
  function updateEnemies(speedFactor = 1) {
    if (playerDeathAnimationStarted) return;
    
    enemiesLeft = enemies.length;
    updateHUD();
    
    // Initialize high score display
    updateHighScore();
    
    if (!isPaused && !playerDeathAnimationStarted && player.invincible <= 0) {
      enemies.forEach(enemy => {
        if (player.x < enemy.x + enemy.size && 
            player.x + player.size > enemy.x && 
            player.y < enemy.y + enemy.size && 
            player.y + player.size > enemy.y && player.invincible <=0)  {
          lives--;
          player.invincible = 60;
          createExplosion(player.x, player.y, '#0099FF'); // Changed from '#2196F3' to match player color
          playSound('player_hit', 1.0);
          updateHUD();
    
    // Initialize high score display
    updateHighScore();
          if (lives <= 0) {
            if (!playerDeathAnimationStarted) {
              playerDeathAnimationStarted = true;
              // isPaused = true;
              createPlayerDeathExplosion(player.x + player.size/2, player.y + player.size/2);
              setTimeout(() => {
                gameOver("You were destroyed!");
                playerDeathAnimationStarted = false;
              }, 1500);
            }
            return;
          }
        }
      });
    }

    enemies.forEach(enemy => {
      // Dynamic difficulty scaling based on level and enemy type
      const baseAggression = enemy.type === 2 ? 0.4 : 0.3;
      const aggressiveness = Math.min(baseAggression + (level * 0.05), 0.9);
      
      // Smart target selection
      let target = base;
      const distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
      const distToBase = Math.hypot(base.x - enemy.x, base.y - enemy.y);
      
      // Elite enemies have better targeting
      if (enemy.type === 2) {
          if (distToPlayer < 250 || (distToBase < 350 && base.health <= 2)) {
              target = distToPlayer < distToBase ? player : base;
          }
      } else {
          // Regular enemies become more aggressive at close range
          if (distToPlayer < 150 && Math.random() < aggressiveness) {
              target = player;
          }
      }
            
            const dx = target.x - enemy.x;
            const dy = target.y - enemy.y;
            
            // More frequent direction updates for elite enemies
            const minCooldown = enemy.type === 2 ? 10 : 15;
            enemy.targetChangeCooldown--;
            
            if (enemy.targetChangeCooldown <= 0 || 
                (enemy.dir === 'left' && enemy.x <= 0) || 
                (enemy.dir === 'right' && enemy.x >= canvas.width - enemy.size) ||
                (enemy.dir === 'up' && enemy.y <= 0) ||
                (enemy.dir === 'down' && enemy.y >= canvas.height - enemy.size)) {
                
                // Improved pathfinding
                const possibleDirs = ['up', 'down', 'left', 'right'];
                const validDirs = possibleDirs.filter(dir => {
                    let testX = enemy.x;
                    let testY = enemy.y;
                    const testDist = enemy.size + (enemy.type === 2 ? 16 : 8);
                    
                    switch(dir) {
                        case 'up': testY -= testDist; break;
                        case 'down': testY += testDist; break;
                        case 'left': testX -= testDist; break;
                        case 'right': testX += testDist; break;
                    }
                    return canEnemyMoveTo(testX, testY, enemy.size, enemy.size);
                });
                
                if (validDirs.length > 0) {
                    // Weighted direction selection based on target position
                    const weights = validDirs.map(dir => {
                        let score = 1;
                        switch(dir) {
                            case 'right': score += dx > 0 ? 2 : 0; break;
                            case 'left': score += dx < 0 ? 2 : 0; break;
                            case 'down': score += dy > 0 ? 2 : 0; break;
                            case 'up': score += dy < 0 ? 2 : 0; break;
                        }
                        return score;
                    });
                    
                    // Choose direction based on weights
                    const totalWeight = weights.reduce((a, b) => a + b, 0);
                    let random = Math.random() * totalWeight;
                    let chosenIndex = 0;
                    
                    for (let i = 0; i < weights.length; i++) {
                        random -= weights[i];
                        if (random <= 0) {
                            chosenIndex = i;
                            break;
                        }
                    }
                    
                    enemy.dir = validDirs[chosenIndex];
                }
                
                enemy.moveTimer = 0;
                enemy.targetChangeCooldown = minCooldown + Math.floor(Math.random() * 20);
            }

            // Smooth enemy movement
            switch(enemy.dir) {
              case 'up': enemy.dy = -enemy.speed; enemy.dx = 0; break;
              case 'down': enemy.dy = enemy.speed; enemy.dx = 0; break;
              case 'left': enemy.dx = -enemy.speed; enemy.dy = 0; break;
              case 'right': enemy.dx = enemy.speed; enemy.dy = 0; break;
            }
            
            // Apply speed factor to enemy movement
            const adjustedDx = enemy.dx * speedFactor;
            const adjustedDy = enemy.dy * speedFactor;
            
            const newX = enemy.x + adjustedDx;
            const newY = enemy.y + adjustedDy;
            
            if (canEnemyMoveTo(newX, newY, enemy.size, enemy.size)) {
              enemy.x = newX;
              enemy.y = newY;
              enemy.moveTimer = 0;
            } else {
              enemy.moveTimer++;
              if (enemy.moveTimer > 30) {
                enemy.dir = ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)];
                enemy.moveTimer = 0;
              }
            }
            
            // Increase fire rate
            if (enemy.cooldown-- <= 0) {
              shoot(enemy.x, enemy.y, enemy.dir, true);
              enemy.cooldown = 30 + Math.floor(Math.random() * 20) - (level * 2); // More frequent shooting
            }
          });
    }

  // Update power-ups with animation
  function updatePowerUps() {
    if (isPaused || playerDeathAnimationStarted) return;
    
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const p = powerUps[i];
      if (!p.active) continue;
      
      // Animate power-up
      p.animationFrame = (p.animationFrame + 0.1) % (Math.PI * 2);
      
      if (player.x < p.x + p.size && player.x + player.size > p.x && 
          player.y < p.y + p.size && player.y + player.size > p.y) {
        p.active = false;
        createExplosion(p.x + p.size/2, p.y + p.size/2, '#9C27B0', 20);
        playSound('powerup_collect', 1.0);
        
        switch(p.type) {
          case 'life':
            lives++;
            break;
          case 'shield':
            player.invincible = 600;
            break;
          case 'baseShield':
            base.invincible = true;
            baseShieldActive = true;
            baseShieldStartTime = Date.now();

            if (baseShieldTimeout) {
              clearTimeout(baseShieldTimeout);
              baseShieldTimeout = null;
            }
            break;
          case 'magicBullet':
            magicBulletsActive = true;
            magicBulletStartTime = Date.now();
            break;
        }
        
        score += 75;
        updateHUD();
  
  // Initialize high score display
  updateHighScore();
      }
    }
  }
  
  

  // Update particles with speed factor
  function updateParticles(speedFactor = 1) {
    if (isPaused) return;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.dx * speedFactor;
      p.y += p.dy * speedFactor;
      p.life--;
      
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  // Helper function to create a brick pattern canvas once
  function createBrickPattern() {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = TILE_SIZE;
    patternCanvas.height = TILE_SIZE;
    const patternCtx = patternCanvas.getContext('2d');
    
    // Brick pattern
    patternCtx.fillStyle = "#4B0000";
    const brickWidth = TILE_SIZE / 2;
    const brickHeight = TILE_SIZE / 3;
    
    // Draw brick pattern
    for (let y = 0; y < TILE_SIZE; y += brickHeight) {
        const offset = (y / brickHeight % 2) * brickWidth / 2;
        for (let x = -offset; x < TILE_SIZE; x += brickWidth) {
            if (x + brickWidth > 0) { // Only draw visible bricks
                patternCtx.fillRect(
                    Math.max(0, x) + 2, 
                    y + 2, 
                    Math.min(brickWidth, TILE_SIZE - x) - 4, 
                    brickHeight - 4
                );
            }
        }
    }
    
    return patternCanvas;
  }

  // Helper function to create a crack pattern canvas once
  function createCrackPattern() {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = TILE_SIZE;
    patternCanvas.height = TILE_SIZE;
    const patternCtx = patternCanvas.getContext('2d');
    
    // Clear any existing content
    patternCtx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    
    // Set style for cracks - make them more visible since there are fewer
    patternCtx.strokeStyle = "rgba(0,0,0,0.6)";
    patternCtx.lineWidth = 1.5;
    
    // Create just 3 curved cracks from center
    const centerX = TILE_SIZE / 2;
    const centerY = TILE_SIZE / 2;
    
    // Define the 3 crack directions (in radians)
    const crackAngles = [0.8, 2.5, 4.2]; // Spaced out asymmetrically
    
    // Draw each of the 3 cracks
    for (const angle of crackAngles) {
        // Calculate end point at the edge of the tile
        // Use different distances to make cracks reach different edges
        const distToEdge = angle < 3 ? TILE_SIZE/2 : TILE_SIZE/2 - 2;
        const endX = centerX + Math.cos(angle) * distToEdge;
        const endY = centerY + Math.sin(angle) * distToEdge;
        
        patternCtx.beginPath();
        patternCtx.moveTo(centerX, centerY);
        
        // Control points for curved cracks
        const ctrl1X = centerX + Math.cos(angle + 0.2) * (distToEdge * 0.3);
        const ctrl1Y = centerY + Math.sin(angle + 0.2) * (distToEdge * 0.3);
        
        const ctrl2X = centerX + Math.cos(angle - 0.1) * (distToEdge * 0.7);
        const ctrl2Y = centerY + Math.sin(angle - 0.1) * (distToEdge * 0.7);
        
        patternCtx.bezierCurveTo(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, endX, endY);
        patternCtx.stroke();
    }
    
    return patternCanvas;
}

  function drawMap() {
    // First fill the entire console area with midnight blue to ensure no artifacts
    const consoleHeight = 100;
    const consoleY = MAP_ROWS * TILE_SIZE;
    ctx.fillStyle = '#0a1a2a';
    ctx.fillRect(0, consoleY, canvas.width, consoleHeight);
    
    // Pre-calculate brick patterns and cracks to reduce calculations in loops
    const brickPattern = createBrickPattern();
    const crackPattern = createCrackPattern();
    
    // Draw walls and breakable walls
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tileX = col * TILE_SIZE;
            const tileY = row * TILE_SIZE;
            
            if (map[row][col] === 1) {
                // Unbreakable wall (brick pattern)
                ctx.save();
                // Remove shadow effect
                ctx.shadowBlur = 0;
                
                // Draw base brick color
                ctx.fillStyle = "#8B0000";
                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                
                // Draw brick pattern from pre-rendered pattern
                ctx.drawImage(brickPattern, tileX, tileY);
                ctx.restore();
                
            } else if (map[row][col] === 4) {
                // Breakable wall with cracks
                ctx.save();
                // Remove shadow effect
                ctx.shadowBlur = 0;
                
                // Draw base wall color
                ctx.fillStyle = "#32CD32";
                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                
                // Draw inner fill
                ctx.fillStyle = "#228B22";
                ctx.fillRect(tileX + 2, tileY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                
                // Draw cracks from pre-rendered pattern
                ctx.drawImage(crackPattern, tileX, tileY);
                ctx.restore();
            }
        }
    }
    
    // Draw the RGB line before drawing console elements
    drawRGBLine();
    
    // Reset shadow effects before drawing console
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Enhanced console frame at bottom with midnight blue theme
    const frameHeight = 100;
    const frameY = MAP_ROWS * TILE_SIZE;
    const frameWidth = canvas.width;
    
    // First fill the entire console area with midnight blue to ensure no artifacts
    ctx.fillStyle = '#072b4a';
    ctx.fillRect(0, frameY, frameWidth, frameHeight);
    
    // Now draw the console body with midnight blue gradient
    const consoleGradient = ctx.createLinearGradient(0, frameY, 0, frameY + frameHeight);
    consoleGradient.addColorStop(0, '#0a1a2a');
    consoleGradient.addColorStop(0.5, '#072b4a');
    consoleGradient.addColorStop(1, '#072b4a');
    ctx.fillStyle = consoleGradient;
    ctx.fillRect(0, frameY, frameWidth, frameHeight);
    
    // Beveled edges with metallic accents
    ctx.strokeStyle = '#2a3b4a';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, frameY, frameWidth, frameHeight);
    
    ctx.strokeStyle = '#3a4b5a';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, frameY + 2, frameWidth - 4, frameHeight - 4);
    
    // Screen area (where the game is displayed)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(10, frameY + 10, frameWidth - 20, MAP_ROWS * TILE_SIZE - 20);
    
    // Enhanced speaker grill with RGB effects
    const speakerWidth = 250;
    const speakerX = (frameWidth - speakerWidth) / 2;

    // Left speaker (new addition)
    ctx.fillStyle = '#1a2634';
    ctx.fillRect(speakerX - speakerWidth - 30, frameY + 15, speakerWidth, 15);

    // Middle speaker (existing)
    ctx.fillStyle = '#1a2634';
    ctx.fillRect(speakerX, frameY + 15, speakerWidth, 15);

    // Right speaker (existing)
    ctx.fillStyle = '#1a2634';
    ctx.fillRect(speakerX + speakerWidth + 30, frameY + 15, speakerWidth, 15);

    // Speaker holes with RGB effect
    const holeCount = 15;
    for (let i = 0; i < holeCount; i++) {
      const holeX = speakerX + 5 + i * 16;
      const holeY = frameY + 22;
      const hue = (rgbLineHue + i * 24) % 360;
      
      // Left speaker holes (new addition)
      const leftHoleX = speakerX - speakerWidth - 30 + 5 + i * 16;
      ctx.fillStyle = `hsla(${360 - hue}, 100%, 50%, 0.7)`;
      ctx.beginPath();
      ctx.ellipse(leftHoleX, holeY, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Middle speaker holes (existing)
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.7)`;
      ctx.beginPath();
      ctx.ellipse(holeX, holeY, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Right speaker holes (existing)
      const rightHoleX = speakerX + speakerWidth + 30 + 5 + i * 16;
      ctx.fillStyle = `hsla(${360 - hue}, 100%, 50%, 0.7)`;
      ctx.beginPath();
      ctx.ellipse(rightHoleX, holeY, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add small moving particles above some holes
      if (Math.random() < 0.2) {
        // Left speaker particles (new addition)
        rgbLineParticles.push({
          x: leftHoleX + (Math.random() * 10 - 5),
          y: holeY - 5 - Math.random() * 5,
          size: Math.random() * 2 + 1,
          speed: - (Math.random() * 1 + 0.5),
          hue: 360 - hue,
          life: 30 + Math.random() * 30,
          alpha: 0.5 + Math.random() * 0.5
        });
        
        // Middle speaker particles (existing)
        rgbLineParticles.push({
          x: holeX + (Math.random() * 10 - 5),
          y: holeY - 5 - Math.random() * 5,
          size: Math.random() * 2 + 1,
          speed: - (Math.random() * 1 + 0.5),
          hue: hue,
          life: 30 + Math.random() * 30,
          alpha: 0.5 + Math.random() * 0.5
        });
        
        // Right speaker particles (existing)
        rgbLineParticles.push({
          x: rightHoleX + (Math.random() * 10 - 5),
          y: holeY - 5 - Math.random() * 5,
          size: Math.random() * 2 + 1,
          speed: - (Math.random() * 1 + 0.5),
          hue: 360 - hue,
          life: 30 + Math.random() * 30,
          alpha: 0.5 + Math.random() * 0.5
        });
      }
    }
    
    // Enhanced D-Pad
    const dpadSize = 110;
    const dpadX = 40;
    const dpadY = frameY + 45;
    
    // D-Pad base shadow
    ctx.fillStyle = '#0a121a';
    ctx.beginPath();
    ctx.roundRect(dpadX + 3, dpadY + 3, dpadSize, dpadSize, 8);
    ctx.fill();
    
    // D-Pad main
    const dpadGradient = ctx.createLinearGradient(dpadX, dpadY, dpadX + dpadSize, dpadY + dpadSize);
    dpadGradient.addColorStop(0, '#2a3b4a');
    dpadGradient.addColorStop(1, '#1a2b3a');
    ctx.fillStyle = dpadGradient;
    ctx.beginPath();
    ctx.roundRect(dpadX, dpadY, dpadSize, dpadSize, 8);
    ctx.fill();
    
    // D-Pad border
    ctx.strokeStyle = '#3a4b5a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(dpadX, dpadY, dpadSize, dpadSize, 8);
    ctx.stroke();
    
    // D-Pad center
    const centerX = dpadX + dpadSize/2 - 6;
    const centerY = dpadY + dpadSize/2 - 6;
    ctx.fillStyle = '#3a4b5a';
    ctx.beginPath();
    ctx.roundRect(centerX, centerY, 12, 12, 4);
    ctx.fill();
    
    // D-Pad directions with 3D effect
    ctx.fillStyle = '#4a5b6a';
    // Up
    ctx.beginPath();
    ctx.roundRect(centerX, dpadY + 5, 12, 15, 3);
    ctx.fill();
    // Down
    ctx.beginPath();
    ctx.roundRect(centerX, dpadY + dpadSize - 20, 12, 15, 3);
    ctx.fill();
    // Left
    ctx.beginPath();
    ctx.roundRect(dpadX + 5, centerY, 15, 12, 3);
    ctx.fill();
    // Right
    ctx.beginPath();
    ctx.roundRect(dpadX + dpadSize - 20, centerY, 15, 12, 3);
    ctx.fill();
    
    // Action buttons (A/B) with enhanced appearance
    // B button (left) - red - moved down to frameY + 65
    const bGradient = ctx.createRadialGradient(
      frameWidth - 120, frameY + 65, 0,
      frameWidth - 120, frameY + 65, 18
    );
    bGradient.addColorStop(0, '#ff5555');
    bGradient.addColorStop(0.7, '#cc0000');
    bGradient.addColorStop(1, '#990000');
    ctx.fillStyle = bGradient;
    ctx.beginPath();
    ctx.arc(frameWidth - 120, frameY + 65, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // B button highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(frameWidth - 120 - 5, frameY + 55 - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // B button border
    ctx.strokeStyle = '#ff8888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(frameWidth - 120, frameY + 65, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // A button (right) - green - moved down to frameY + 50
    const aGradient = ctx.createRadialGradient(
      frameWidth - 80, frameY + 50, 0,
      frameWidth - 80, frameY + 50, 18
    );
    aGradient.addColorStop(0, '#55ff55');
    aGradient.addColorStop(0.7, '#00cc00');
    aGradient.addColorStop(1, '#009900');
    ctx.fillStyle = aGradient;
    ctx.beginPath();
    ctx.arc(frameWidth - 80, frameY + 50, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // A button highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(frameWidth - 80 - 5, frameY + 50 - 5, 5, 0, Math.PI * 2); // Added -5 to x position
    ctx.fill();
    
    // A button border
    ctx.strokeStyle = '#88ff88';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(frameWidth - 80, frameY + 50, 18, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add power indicator to the right of the POWER text
    const powerY = frameY + 78; // Keep the same vertical position
    const powerText = 'POWER';
    const powerTextWidth = ctx.measureText(powerText).width;

    // Draw POWER text first - moved 5px right from original position
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#bdc3c7';
    ctx.textAlign = 'left';
    ctx.fillText(powerText, frameWidth - 110 + 30, powerY + 5); // Added +5 to x position

    // Then draw power indicator to the right of the text - moved 5px left from original position
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(frameWidth - 110 + powerTextWidth + 10 - 13, powerY, 6, 0, Math.PI * 2); // Added -5 to x position
    ctx.fill();

    // Power light glow
    ctx.fillStyle = 'rgba(46, 204, 113, 0.4)';
    ctx.beginPath();
    ctx.arc(frameWidth - 110 + powerTextWidth + 10 - 13, powerY, 10, 0, Math.PI * 2); // Added -5 to x position
    ctx.fill();
    
    // Enhanced Start/Select buttons - doubled in size with button-like appearance
    const buttonY = frameY + 120; // Adjusted position
    const buttonWidth = 70; // Doubled from original 35
    const buttonHeight = 24; // Doubled from original 12
    
    // Button gradient with metallic look
    const buttonGradient = ctx.createLinearGradient(
      frameWidth / 2 - 70, buttonY, 
      frameWidth / 2 - 70, buttonY + buttonHeight
    );
    buttonGradient.addColorStop(0, '#3a4b5a');
    buttonGradient.addColorStop(0.5, '#2a3b4a');
    buttonGradient.addColorStop(1, '#1a2b3a');
    
    // Button shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 - 75, buttonY + 3, buttonWidth, buttonHeight, 8);
    ctx.fill();
    
    // Select button
    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 - 75, buttonY, buttonWidth, buttonHeight, 8);
    ctx.fill();
    
    // Select button border with 3D effect
    ctx.strokeStyle = '#4a5b6a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 - 75, buttonY, buttonWidth, buttonHeight, 8);
    ctx.stroke();
    
    // Select button highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 - 74, buttonY + 1, buttonWidth - 2, buttonHeight / 2, 6);
    ctx.stroke();
    
    // Start button
    ctx.fillStyle = buttonGradient;
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 + 5, buttonY, buttonWidth, buttonHeight, 8);
    ctx.fill();
    
    // Start button border with 3D effect
    ctx.strokeStyle = '#4a5b6a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 + 5, buttonY, buttonWidth, buttonHeight, 8);
    ctx.stroke();
    
    // Start button highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(frameWidth / 2 + 6, buttonY + 1, buttonWidth - 2, buttonHeight / 2, 6);
    ctx.stroke();
    
    // Button labels with better typography
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SELECT', frameWidth / 2 - 40, buttonY + buttonHeight/2);
    ctx.fillText('START', frameWidth / 2 + 40, buttonY + buttonHeight/2);
    
    // Button labels for A/B
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', frameWidth - 120, frameY + 65);
    ctx.fillText('A', frameWidth - 80, frameY + 50);
    

    
    // Brand name with smooth color transition
    const brandY = frameY + 65;
    const brandText = 'dev sAgar';
    const hueStep = 30;
    
    for (let i = 0; i < brandText.length; i++) {
        const hue = ((Date.now() / 50) + (i * hueStep)) % 360;
        ctx.font = 'bold 18px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillText(brandText[i], frameWidth / 2 - (brandText.length * 9) + (i * 18), brandY);
    }
    
    // Copyright text
    ctx.font = '8px Arial';
    ctx.fillStyle = '#7f8c8d';
    ctx.textAlign = 'right';
    ctx.fillText('©devsAgar', frameWidth - 10, frameY + 95);
}

  let baseGlowTime = 0;
  function drawBase() {
    if (baseDeathAnimationStarted) return; // Don't draw base during death animation
    
    baseGlowTime += 0.03;
    const pulseIntensity = Math.sin(baseGlowTime) * 0.5 + 1.5;
    
    // Create outer glow (without pulsing)
    const gradient = ctx.createRadialGradient(
      base.x + base.size/2, base.y + base.size/2, 0,
      base.x + base.size/2, base.y + base.size/2, base.size + 20
    );
    
    const baseColor = base.health > 1 ? "#FFD700" : base.health === 1 ? "#FF5252" : "#B71C1C";
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.6, `${baseColor}88`);
    gradient.addColorStop(1, `${baseColor}00`);
    
    // Draw outer glow (static)
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = gradient;
    ctx.fillRect(base.x - 20, base.y - 20, 
                base.size + 40, base.size + 40);
    ctx.restore();
    
    // Draw base structure with pulsing effect on the yellow part
    ctx.fillStyle = "#00ffff"; // Keep original blue color
    ctx.shadowColor = "#00ffff"; // Keep original blue color
    ctx.shadowBlur = 15 * pulseIntensity;
    
    // Draw outer frame with pulsing effect (blue)
    for (let i = -1; i <= 2; i++) {
      for (let j = -1; j <= 2; j++) {
        if ((i === 0 || i === 1) && (j === 0 || j === 1)) continue;
        const x = base.x + (i * TILE_SIZE);
        const y = base.y + (j * TILE_SIZE);
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
    
    // Draw enhanced main base body with health-based colors
    if (base.health > 0) {
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 20 * pulseIntensity;
    }
    
    // Enhanced metallic gold gradient for base
    const metalGradient = ctx.createLinearGradient(
      base.x, base.y, 
      base.x + base.size, base.y + base.size
    );
    
    if (base.health > 1) {
      // Gold/yellow metallic appearance for healthy base
      metalGradient.addColorStop(0, "#FFF2B2");  // Light gold
      metalGradient.addColorStop(0.35, "#FFD700"); // Regular gold
      metalGradient.addColorStop(0.65, "#FFD700"); // Regular gold
      metalGradient.addColorStop(1, "#B8860B");  // Dark gold
      ctx.fillStyle = metalGradient;
    } else {
      // Red for damaged base (keep original behavior)
      ctx.fillStyle = baseColor;
    }
    
    // Draw rounded rectangle instead of square
    const cornerRadius = 8; // Adjust the radius as needed for roundness
    
    ctx.beginPath();
    // Top-left corner
    ctx.moveTo(base.x + cornerRadius, base.y);
    // Top-right corner
    ctx.lineTo(base.x + base.size - cornerRadius, base.y);
    ctx.arcTo(base.x + base.size, base.y, base.x + base.size, base.y + cornerRadius, cornerRadius);
    // Bottom-right corner
    ctx.lineTo(base.x + base.size, base.y + base.size - cornerRadius);
    ctx.arcTo(base.x + base.size, base.y + base.size, base.x + base.size - cornerRadius, base.y + base.size, cornerRadius);
    // Bottom-left corner
    ctx.lineTo(base.x + cornerRadius, base.y + base.size);
    ctx.arcTo(base.x, base.y + base.size, base.x, base.y + base.size - cornerRadius, cornerRadius);
    // Back to top-left
    ctx.lineTo(base.x, base.y + cornerRadius);
    ctx.arcTo(base.x, base.y, base.x + cornerRadius, base.y, cornerRadius);
    ctx.closePath();
    
    ctx.fill();
    
    // Add golden embossed border just inside the main rounded square
    if (base.health > 1) {
      ctx.strokeStyle = "#FFF2B2"; // Light gold
      ctx.lineWidth = 2;
      
      // Draw rounded rectangle for the border
      ctx.beginPath();
      const innerCornerRadius = cornerRadius - 2;
      // Top-left corner
      ctx.moveTo(base.x + 3 + innerCornerRadius, base.y + 3);
      // Top-right corner
      ctx.lineTo(base.x + base.size - 3 - innerCornerRadius, base.y + 3);
      ctx.arcTo(base.x + base.size - 3, base.y + 3, base.x + base.size - 3, base.y + 3 + innerCornerRadius, innerCornerRadius);
      // Bottom-right corner
      ctx.lineTo(base.x + base.size - 3, base.y + base.size - 3 - innerCornerRadius);
      ctx.arcTo(base.x + base.size - 3, base.y + base.size - 3, base.x + base.size - 3 - innerCornerRadius, base.y + base.size - 3, innerCornerRadius);
      // Bottom-left corner
      ctx.lineTo(base.x + 3 + innerCornerRadius, base.y + base.size - 3);
      ctx.arcTo(base.x + 3, base.y + base.size - 3, base.x + 3, base.y + base.size - 3 - innerCornerRadius, innerCornerRadius);
      // Back to top-left
      ctx.lineTo(base.x + 3, base.y + 3 + innerCornerRadius);
      ctx.arcTo(base.x + 3, base.y + 3, base.x + 3 + innerCornerRadius, base.y + 3, innerCornerRadius);
      ctx.closePath();
      
      ctx.stroke();
    }
    
    // Draw detailed pattern on the yellow base
    if (base.health > 1) {
      // Gold accents and decoration
      ctx.fillStyle = "#B8860B"; // Darker gold
      
      // Draw golden corner accents - adjusted for rounded corners
      const cornerSize = 10; // Slightly smaller for rounded corners
      ctx.fillStyle = "#FFF2B2"; // Light gold
      
      // Top-left corner accent (adjusted for rounded corners)
      ctx.beginPath();
      ctx.moveTo(base.x + cornerRadius, base.y + 4);
      ctx.lineTo(base.x + cornerRadius + cornerSize, base.y + 4);
      ctx.lineTo(base.x + cornerRadius, base.y + 4 + cornerSize);
      ctx.fill();
      
      // Top-right corner accent (adjusted for rounded corners)
      ctx.beginPath();
      ctx.moveTo(base.x + base.size - cornerRadius, base.y + 4);
      ctx.lineTo(base.x + base.size - cornerRadius - cornerSize, base.y + 4);
      ctx.lineTo(base.x + base.size - cornerRadius, base.y + 4 + cornerSize);
      ctx.fill();
      
      // Bottom-left corner accent (adjusted for rounded corners)
      ctx.beginPath();
      ctx.moveTo(base.x + cornerRadius, base.y + base.size - 4);
      ctx.lineTo(base.x + cornerRadius + cornerSize, base.y + base.size - 4);
      ctx.lineTo(base.x + cornerRadius, base.y + base.size - 4 - cornerSize);
      ctx.fill();
      
      // Bottom-right corner accent (adjusted for rounded corners)
      ctx.beginPath();
      ctx.moveTo(base.x + base.size - cornerRadius, base.y + base.size - 4);
      ctx.lineTo(base.x + base.size - cornerRadius - cornerSize, base.y + base.size - 4);
      ctx.lineTo(base.x + base.size - cornerRadius, base.y + base.size - 4 - cornerSize);
      ctx.fill();
    }
    
    // Draw enhanced inner core with improved pulsing effect - adjusted for rounded corners
    if (base.health > 0) {
      const innerCornerRadius = cornerRadius - 3;
      
      // Draw rounded inner rectangle
      ctx.save();
      ctx.beginPath();
      // Top-left corner
      ctx.moveTo(base.x + 8 + innerCornerRadius, base.y + 8);
      // Top-right corner
      ctx.lineTo(base.x + base.size - 8 - innerCornerRadius, base.y + 8);
      ctx.arcTo(base.x + base.size - 8, base.y + 8, base.x + base.size - 8, base.y + 8 + innerCornerRadius, innerCornerRadius);
      // Bottom-right corner
      ctx.lineTo(base.x + base.size - 8, base.y + base.size - 8 - innerCornerRadius);
      ctx.arcTo(base.x + base.size - 8, base.y + base.size - 8, base.x + base.size - 8 - innerCornerRadius, base.y + base.size - 8, innerCornerRadius);
      // Bottom-left corner
      ctx.lineTo(base.x + 8 + innerCornerRadius, base.y + base.size - 8);
      ctx.arcTo(base.x + 8, base.y + base.size - 8, base.x + 8, base.y + base.size - 8 - innerCornerRadius, innerCornerRadius);
      // Back to top-left
      ctx.lineTo(base.x + 8, base.y + 8 + innerCornerRadius);
      ctx.arcTo(base.x + 8, base.y + 8, base.x + 8 + innerCornerRadius, base.y + 8, innerCornerRadius);
      ctx.closePath();
      
      const innerGlow = ctx.createRadialGradient(
        base.x + base.size/2, base.y + base.size/2, 0,
        base.x + base.size/2, base.y + base.size/2, base.size/2
      );
      
      if (base.health > 1) {
        // Enhanced yellow/gold core
        innerGlow.addColorStop(0, "#FFFFFF");
        innerGlow.addColorStop(0.2, "#FFFACD"); // Light yellow
        innerGlow.addColorStop(0.6, "#FFC107");
        innerGlow.addColorStop(1, "#B8860B"); // Dark gold
      } else {
        // Keep original behavior for damaged state
        innerGlow.addColorStop(0, "#FFF");
        innerGlow.addColorStop(0.5, "#FFC107");
        innerGlow.addColorStop(1, baseColor);
      }
      
      ctx.fillStyle = innerGlow;
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 15 * pulseIntensity;
      ctx.fill();
      ctx.restore();
      
      // Add central golden medallion/emblem
      if (base.health > 1) {
        // Central circle
        ctx.beginPath();
        ctx.arc(base.x + base.size/2, base.y + base.size/2, 10, 0, Math.PI * 2);
        const emblemGradient = ctx.createRadialGradient(
          base.x + base.size/2 - 3, base.y + base.size/2 - 3, 0, 
          base.x + base.size/2, base.y + base.size/2, 10
        );
        emblemGradient.addColorStop(0, "#FFFFFF");
        emblemGradient.addColorStop(0.3, "#FFF2B2");
        emblemGradient.addColorStop(1, "#B8860B");
        ctx.fillStyle = emblemGradient;
        ctx.fill();
        
        // Add rotating star in the center
        const starPoints = 5;
        const outerRadius = 8;
        const innerRadius = 3;
        
        ctx.save();
        ctx.translate(base.x + base.size/2, base.y + base.size/2);
        ctx.rotate(baseGlowTime * 0.2);
        
        ctx.beginPath();
        for (let i = 0; i < starPoints * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / starPoints;
          if (i === 0) {
            ctx.moveTo(radius * Math.cos(angle), radius * Math.sin(angle));
          } else {
            ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
          }
        }
        
        ctx.closePath();
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowBlur = 5;
        ctx.fill();
        
        // Add subtle light rays emanating from the center
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const rayLength = 15 + Math.sin(baseGlowTime * 2) * 3;
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle) * rayLength,
            Math.sin(angle) * rayLength
          );
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  function drawPlayer() {
    ctx.save();
    ctx.shadowColor = "#0099ff";
    ctx.shadowBlur = 15;
    
    // Tank body base color
    if (player.invincible > 0 && Math.floor(player.invincible / 5) % 2 === 0) {
      ctx.fillStyle = "#00ffff";  // Neon cyan when invincible
    } else {
      ctx.fillStyle = "#0099ff";  // Bright blue normally
    }
    
    // Draw tank base/body
    ctx.fillRect(player.x, player.y, player.size, player.size);
    
    // Draw tank treads/tracks on sides
    ctx.fillStyle = "#072a54";  // Dark blue treads
    
    // Left tread
    ctx.fillRect(player.x, player.y + 4, 4, player.size - 8);
    // Right tread
    ctx.fillRect(player.x + player.size - 4, player.y + 4, 4, player.size - 8);
    
    // Draw tread details (little lines on the treads)
    ctx.fillStyle = "#0d3b76";  // Slightly lighter blue for tread details
    for (let i = 0; i < 5; i++) {
      // Left tread details
      ctx.fillRect(player.x, player.y + 6 + i * 5, 4, 2);
      // Right tread details
      ctx.fillRect(player.x + player.size - 4, player.y + 6 + i * 5, 4, 2);
    }
    
    // Draw tank hull/turret
    ctx.fillStyle = "#0D47A1";  // Darker blue for turret
    ctx.fillRect(player.x + 6, player.y + 6, player.size - 12, player.size - 12);
    
    // Add a circle in the center for the turret rotation point
    ctx.beginPath();
    ctx.arc(player.x + player.size/2, player.y + player.size/2, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#B3E5FC";
    ctx.fill();
    
    // Draw the cannon/barrel
    ctx.fillStyle = "#BBDEFB";
    switch(player.direction) {
      case 'up':
        // Cannon
        ctx.fillRect(player.x + (player.size/2) - 3, player.y - 8, 6, 12);
        break;
      case 'down':
        // Cannon
        ctx.fillRect(player.x + (player.size/2) - 3, player.y + player.size - 4, 6, 12);
        break;
      case 'left':
        // Cannon
        ctx.fillRect(player.x - 8, player.y + (player.size/2) - 3, 12, 6);
        break;
      case 'right':
        // Cannon
        ctx.fillRect(player.x + player.size - 4, player.y + (player.size/2) - 3, 12, 6);
        break;
    }
    
    ctx.restore();
  }

  function drawEnemies() {
    enemies.forEach(e => {
      ctx.save();
      
      // Set the shadow effect for the entire tank
      ctx.shadowColor = e.type === 2 ? "#852654" : "#995d0f";  // Updated shadow colors
      ctx.shadowBlur = 15;
      
      // Tank base color
      ctx.fillStyle = e.type === 2 ? "#852654" : "#995d0f";  // Updated base colors
      
      // Draw tank body/base
      ctx.fillRect(e.x, e.y, e.size, e.size);
      
      // Draw tank treads/tracks with darker shades
      ctx.fillStyle = e.type === 2 ? "#5e1b3b" : "#6b420a";  // Darker versions of the base colors
      
      // Left tread
      ctx.fillRect(e.x, e.y + 4, 4, e.size - 8);
      // Right tread
      ctx.fillRect(e.x + e.size - 4, e.y + 4, 4, e.size - 8);
      
      // Draw tread details
      ctx.fillStyle = e.type === 2 ? "#a13065" : "#b87213";  // Slightly lighter for tread details
      for (let i = 0; i < 5; i++) {
        // Left tread details
        ctx.fillRect(e.x, e.y + 6 + i * 5, 4, 2);
        // Right tread details
        ctx.fillRect(e.x + e.size - 4, e.y + 6 + i * 5, 4, 2);
      }
      
      // Draw tank hull/turret
      ctx.fillStyle = e.type === 2 ? "#691e42" : "#7a4a0c";  // Darker version of base color for turret
      ctx.fillRect(e.x + 6, e.y + 6, e.size - 12, e.size - 12);
      
      // Add turret rotation point
      ctx.beginPath();
      ctx.arc(e.x + e.size/2, e.y + e.size/2, 3, 0, Math.PI * 2);
      ctx.fillStyle = e.type === 2 ? "#e799b7" : "#e0b878";  // Lighter version of base color
      ctx.fill();
      
      // Draw the cannon/barrel
      ctx.fillStyle = e.type === 2 ? "#e799b7" : "#e0b878";  // Same light color for cannon
      switch(e.dir) {
        case 'up':
          // Cannon
          ctx.fillRect(e.x + (e.size/2) - 3, e.y - 8, 6, 12);
          break;
        case 'down':
          // Cannon
          ctx.fillRect(e.x + (e.size/2) - 3, e.y + e.size - 4, 6, 12);
          break;
        case 'left':
          // Cannon
          ctx.fillRect(e.x - 8, e.y + (e.size/2) - 3, 12, 6);
          break;
        case 'right':
          // Cannon
          ctx.fillRect(e.x + e.size - 4, e.y + (e.size/2) - 3, 12, 6);
          break;
      }
      
      // For elite enemies, add a small star on top
      if (e.type === 2) {
        const centerX = e.x + e.size/2;
        const centerY = e.y + e.size/2;
        ctx.fillStyle = "#FFD700"; // Keep the gold star
        
        // Draw a simple star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i / 5) - Math.PI / 2;
          const x = centerX + Math.cos(angle) * 4;
          const y = centerY + Math.sin(angle) * 4;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.fill();
      }
      
      ctx.restore();
    });
  }

  function drawBullets() {
    ctx.fillStyle = "#BBDEFB";
    bullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.size, b.size);
      ctx.fillStyle = "#2196F3";
      ctx.fillRect(b.x + 1, b.y + 1, b.size - 2, b.size - 2);
      ctx.fillStyle = "#BBDEFB";
    });
    
    ctx.fillStyle = "#FF8A80";
    enemyBullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.size, b.size);
      ctx.fillStyle = "#F44336";
      ctx.fillRect(b.x + 1, b.y + 1, b.size - 2, b.size - 2);
      ctx.fillStyle = "#FF8A80";
    });
  }

  function drawPowerUps() {
    powerUps.forEach(p => {
      if (!p.active) return;
      
      const centerX = p.x + p.size/2;
      const centerY = p.y + p.size/2;
      const radius = p.size/2;
      
      // Outer glow
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 15;
      
      // Different symbols and colors for each power-up type
      let symbol, color, bgColor;
      if (p.type === 'life') {
          symbol = "💚";
          color = "#00ff00";  // Green
          bgColor = "rgba(0, 255, 0, 0.2)";
      } else if (p.type === 'shield') {
          symbol = "🛡️";
          color = "#ffff00";  // Yellow
          bgColor = "rgba(255, 255, 0, 0.2)";
      } else if (p.type === 'baseShield') {
          symbol = "🌀";
          color = "#00ffff";  // Cyan
          bgColor = "rgba(0, 255, 255, 0.2)";
      } else if (p.type === 'magicBullet') {
          symbol = "🔫";
          color = "#ff00ff";  // Pink
          bgColor = "rgba(255, 0, 255, 0.2)";
      }
      
      // Draw background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = bgColor;
      ctx.fill();
      
      // Draw symbol
      ctx.font = `${radius * 1.5}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.fillText(symbol, centerX, centerY);
      
      // Pulsing animation
      const pulseSize = radius * (0.9 + 0.1 * Math.sin(p.animationFrame));
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
  });
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = p.life / 60;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;
  }

  // Enhanced HUD with power-up timers //useless trash
  function drawHUD() {
    // ctx.font = '12px "Press Start 2P"';
    // ctx.fillStyle = "#FFFFFF";
    // ctx.textAlign = "left";
    
    // // Power-up indicators
    // if (player.speed > 3) {
    //   const timeLeft = Math.max(0, Math.ceil((10000 - (Date.now() - speedPowerTime))) / 1000);
    //   ctx.fillText(`SPEED: ${timeLeft}s`, 10, 30);
    // }
    
    // if (player.cooldown === 5) {
    //   const timeLeft = Math.max(0, Math.ceil((10000 - (Date.now() - rapidPowerTime))) / 1000);
    //   ctx.fillText(`RAPID: ${timeLeft}s`, 10, 50);
    // }
  }

  // Game state functions
  function gameOver(reason) {
  playSound('game_over', 1.0);
    gameRunning = false;
    stopAllMusic();
    playSound('game_over', 1.0);
    document.getElementById("gameOverReason").textContent = reason;
    document.getElementById("finalScore").textContent = score;
    document.getElementById("finalLevel").textContent = level;
    updateHighScore();
    updateHighScore();
    
    document.getElementById("gameOverReason").setAttribute('data-text', reason);
    
    const gameOverScreen = document.getElementById("gameOverScreen");
    gameOverScreen.classList.remove("hidden");
    
    // Create sword slash effect
    const slash = document.createElement('div');
    slash.className = 'sword-slash';
    gameOverScreen.appendChild(slash);
    
    // Create dramatic blood particle effects (increased from 30 to 100)
    for (let i = 0; i < 100; i++) {
      const blood = document.createElement('div');
      blood.className = 'blood-particle';
      
      // Position particles in a more dynamic pattern
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 20;
      const xPos = 50 + Math.cos(angle) * distance;
      const yPos = 50 + Math.sin(angle) * distance;
      
      blood.style.left = `${xPos}%`;
      blood.style.top = `${yPos}%`;
      
      // More varied animation timing
      blood.style.animationDelay = `${Math.random() * 2}s`;
      
      // Wider size variation with some larger particles
      const size = 3 + Math.random() * 8;
      blood.style.width = `${size}px`;
      blood.style.height = `${size}px`;
      
      // Add slight rotation for more natural look
      blood.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      gameOverScreen.appendChild(blood);
      
      // Remove element after animation with varied durations
      setTimeout(() => {
        if (blood.parentNode) {
          blood.parentNode.removeChild(blood);
        }
      }, 2000 + Math.random() * 2000);
    }
    
    // Remove slash after animation
    setTimeout(() => {
      if (slash.parentNode) {
        slash.parentNode.removeChild(slash);
      }
    }, 2500);
  }

  function startGame() {
  playGameMusic();
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("gameWrapper").style.display = "block"; // Show the game
    
    stopAllMusic();
    playGameMusic();
    
    // Reset game state
    gameRunning = true;
    
    // Cancel any existing animation frame to prevent double loops
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    // Initialize the game
    initGame();
    
    // Reset timers
    lastTime = performance.now();
    
    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  // Check for level completion
  function checkLevelCompletion() {
    if (enemies.length === 0 && !isPaused) {
        // Pause the game
        isPaused = true;
        
        // Create and show level complete message
        const message = document.createElement('div');
        message.className = 'level-message';
        message.textContent = `LEVEL ${level} CLEARED!`;
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.fontSize = '32px';
        message.style.color = '#FFD700';
        message.style.textShadow = '2px 2px 4px #000';
        message.style.zIndex = '100';
        message.style.width = '100%';
        message.style.textAlign = 'center';
        document.getElementById('gameContainer').appendChild(message);
        playSound('level_start', 1.0);
        // Remove message after animation completes and resume game
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);  
            }
            
            
            
            // Increment level first
            level++;
            updateHUD();
  
  // Initialize high score display
  updateHighScore();
            
            // Save current game state that should persist
            const currentLives = lives;
            const currentScore = score;
            const currentLevel = level;
            
            // Regenerate the map completely (this will keep power-up spawn points)
            map.length = 0;
            map.push(...generateProceduralMap());
            
            // Reset base health
            base.health = 5;
            base.invincible = false;
            if (baseShieldTimeout) {
                clearTimeout(baseShieldTimeout);
                baseShieldTimeout = null;
            }
            
            // Clear all game objects except player stats
            bullets.length = 0;
            enemyBullets.length = 0;
            powerUps.length = 0;
            particles.length = 0;
            
            // Reset player position with safe spawn
            player.x = TILE_SIZE * 12;
            player.y = TILE_SIZE * 16;
            ensureSafeSpawn();
            player.direction = 'up';
            player.cooldown = 0;
            player.invincible = 60; // Brief invincibility on level start
            player.dx = 0;
            player.dy = 0;
            
            // Restore persistent game state
            lives = currentLives;
            score = currentScore;
            level = currentLevel;
            
            // Spawn new enemies and power-ups based on current level
            spawnEnemies(3 + Math.floor(level / 2));
            spawnPowerUps(1 + Math.floor(level / 3));
            
            // Update HUD again to reflect changes
            updateHUD();
  
  // Initialize high score display
  updateHighScore();
            updateActiveEffects();
            
            // Force immediate HUD update
            document.getElementById("baseHealth").textContent = base.health;
            document.getElementById("level").textContent = level;
            
            // Resume the game
            isPaused = false;
    playerDeathAnimationStarted = false;
        }, 2000);
    }
}

  // Main game loop
  function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    // Calculate delta time with a maximum value to prevent speed issues
    const deltaTime = Math.min(timestamp - lastTime, 33); // Cap at ~30fps
    lastTime = timestamp;
    
    // Apply a fixed time step for consistent game speed
    const timeStep = 1000 / 60; // Target 60fps
    const speedFactor = deltaTime / timeStep;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isPaused) {
      updatePowerUpTimers();
      if (player.cooldown > 0) player.cooldown--;
      if (player.invincible > 0) player.invincible--;
      
      handleContinuousInput();
      
      // Apply speed factor to movement updates
      player.speed = 3; // Reset to base speed
      updatePlayerPosition(speedFactor);
      updateBullets(speedFactor);
      updateEnemies(speedFactor);
      updatePowerUps();
      updateParticles(speedFactor);
      checkLevelCompletion();
      
      // Check for enemy-player collision
      if (player.invincible <= 0) {
        enemies.forEach(enemy => {
          if (player.x < enemy.x + enemy.size && 
              player.x + player.size > enemy.x && 
              player.y < enemy.y + enemy.size && 
              player.y + player.size > enemy.y) {
            lives--;
            player.invincible = 60;
            createExplosion(player.x, player.y, '#2196F3');
            updateHUD();
  
  // Initialize high score display
  updateHighScore();
            if (lives <= 0) {
              triggerPlayerDeath();
              return;
            }
          }
        });
      }
    }
    
    drawMap();
    drawBase();
    if (!playerDeathAnimationStarted) drawPlayer();
    drawEnemies();
    drawBullets();
    drawPowerUps();
    drawParticles();
    drawHUD();
    updateActiveEffects();
    
    updateRGBLineParticles();
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  // Start the game when the window loads
  window.addEventListener('load', function() {
    document.getElementById("startScreen").classList.remove("hidden");
  });

  // Expose these functions globally
  window.startGame = startGame;
  window.initGame = initGame;
  window.gameRunning = gameRunning;  // Expose gameRunning variable
});


// Update shield timer display
function updateShieldTimer() {
    if (player.invincible > 0) {
        document.querySelector('.shield-timer').classList.add('active');
        document.getElementById('shieldTimer').textContent = Math.ceil(player.invincible / 60) + 's';
    } else {
        document.querySelector('.shield-timer').classList.remove('active');
    }
}

// Main power-up timer update function
/**
 * Updates timers for active power-ups and their visual effects.
 * Handles base shield and magic bullet duration tracking.
 */
function updatePowerUpTimers() {
  updateActiveEffects();
}
    