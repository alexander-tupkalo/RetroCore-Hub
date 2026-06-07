import { audio } from './audio.js';

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.speed = 2;
    this.type = type;

    switch (type) {
      case 'EXTRA_LIFE':
        this.color = '#39ff14';
        this.text = '+';
        break;
      case 'SHIELD':
        this.color = '#00f0ff';
        this.text = 'S';
        break;
      case 'ATTACK_SPEED':
      default:
        this.color = '#ffaa00';
        this.text = 'P';
        break;
    }
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    const time = Date.now() / 150;
    const scale = 0.6 + Math.abs(Math.sin(time)) * 0.4;
    
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(time);
    ctx.scale(scale, scale);

    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.shadowBlur = 0;
    ctx.fillStyle = this.color;
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, 0, 1);

    ctx.restore();
  }
}

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.width = canvas.width;
    this.height = canvas.height;

    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('arcade_highscore')) || 0;
    this.gameLevel = 1;
    this.isGameOver = false;
    
    this.lives = 3;
    this.maxLives = 5;
    this.isInvincible = false;
    this.invincibilityEndTime = 0;

    this.weaponTier = 1;
    this.baseShootCooldown = 250;
    this.shootCooldown = this.baseShootCooldown;

    this.shieldActive = false;
    this.shieldEndTime = 0;

    this.isMobile = this.width < 500;
    this.enemySpeed = this.isMobile ? 0.75 : 1;
    this.dropStep = this.isMobile ? 6 : 15;
    
    this.enemyDirection = 1;
    this.enemyShootInterval = 1500;
    this.lastEnemyShotTime = Date.now();

    this.lastShotTime = 0;

    this.player = {
      x: this.width / 2 - 20,
      y: this.height - 40, 
      width: 40,
      height: 20,
      speed: 5,
      color: '#00f0ff'
    };

    this.lasers = [];
    this.enemyLasers = [];
    this.enemies = [];
    this.powerUps = [];
    this.boss = null;

    // Dynamic Space Environment State
    this.currentBgZone = -1;
    this.planets = [];
    this.asteroids = [];
    this.stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      speed: Math.random() * 1.5 + 0.5,
      size: Math.random() * 2 + 1
    }));

    this.#initEnemyGrid();
  }

  // --- DYNAMIC BACKGROUND GENERATION ---
  #getBgZone() {
    return Math.floor(((this.gameLevel - 1) % 9) / 3); // 0: Stars, 1: Planets, 2: Asteroids
  }

  #initPlanets() {
    this.planets = [];
    const count = Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const radius = 40 + Math.random() * 30;
      this.planets.push({
        x: Math.random() * this.width,
        y: -150 + (i * (this.height * 0.6)),
        radius: radius,
        ringRadius: radius * 1.6 + Math.random() * 20,
        speed: 0.2 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.002 + Math.random() * 0.003,
        color1: ['#4400ff', '#ff00aa', '#0088ff'][Math.floor(Math.random() * 3)],
        color2: ['#000000', '#110022', '#001122'][Math.floor(Math.random() * 3)]
      });
    }
  }

  #initAsteroids() {
    this.asteroids = [];
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 25;
      const vertices = [];
      const numVerts = 7 + Math.floor(Math.random() * 5);
      for (let j = 0; j < numVerts; j++) {
        const angle = (j / numVerts) * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * radius * 0.8;
        vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
      }
      this.asteroids.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 1.5 - this.height * 0.5,
        vertices: vertices,
        speed: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  #drawBackground(ctx) {
    const zone = this.#getBgZone();
    
    if (zone !== this.currentBgZone) {
      this.currentBgZone = zone;
      if (zone === 1) this.#initPlanets();
      if (zone === 2) this.#initAsteroids();
    }

    // LAYER 1: STARS (Always visible)
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    this.stars.forEach(star => {
      star.y += star.speed;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // LAYER 2: PLANET ORBIT ZONE
    if (zone === 1) {
      this.planets.forEach(p => {
        p.y += p.speed;
        p.rotation += p.rotSpeed;
        
        if (p.y - p.ringRadius > this.height) {
          p.y = -p.ringRadius * 2;
          p.x = Math.random() * this.width;
        }
        
        ctx.save();
        ctx.translate(p.x, p.y);
        
        const grad = ctx.createRadialGradient(-p.radius * 0.3, -p.radius * 0.3, p.radius * 0.1, 0, 0, p.radius);
        grad.addColorStop(0, p.color1);
        grad.addColorStop(1, p.color2);
        
        ctx.fillStyle = grad;
        ctx.shadowColor = p.color1;
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0.1, p.radius), 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = p.color1;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(0.1, p.ringRadius), Math.max(0.1, p.ringRadius * 0.3), p.rotation, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        
        ctx.restore();
      });
    }

    // LAYER 3: ASTEROID FIELD ZONE
    if (zone === 2) {
      ctx.shadowColor = '#666666';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#888888';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#111111';
      
      this.asteroids.forEach(a => {
        a.y += a.speed;
        a.rotation += a.rotSpeed;
        
        if (a.y - 60 > this.height) {
          a.y = -60;
          a.x = Math.random() * this.width;
        }
        
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);
        
        ctx.beginPath();
        ctx.moveTo(a.vertices[0].x, a.vertices[0].y);
        for (let i = 1; i < a.vertices.length; i++) {
          ctx.lineTo(a.vertices[i].x, a.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
      });
      
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }
  }

  // --- ENEMY FACTORY & FORMATIONS ---
  #createEnemy(x, y, w, h, row) {
    let health = 1;
    let color = '#39ff14';
    let points = 10;
    
    if (this.gameLevel >= 6 && row < 2) {
      health = 3;
      color = '#bf40bf'; 
      points = 30;
    }
    
    return { x, y, width: w, height: h, alive: true, color, health, maxHealth: health, points };
  }

  #getFormationCoords() {
    const spacingX = 42;
    const spacingY = 30;
    const w = 30;
    const h = 20;
    const baseY = 65;
    const level = this.gameLevel;
    
    if (level === 1 || level === 4) return this.#getRectangle(spacingX, spacingY, w, h, baseY);
    if (level === 2) return this.#getTriangle(spacingX, spacingY, w, h, baseY);
    if (level === 3) return this.#getDiamond(spacingX, spacingY, w, h, baseY);
    
    const types = ['rectangle', 'triangle', 'diamond', 'vshape'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    if (type === 'rectangle') return this.#getRectangle(spacingX, spacingY, w, h, baseY);
    if (type === 'triangle') return this.#getTriangle(spacingX, spacingY, w, h, baseY);
    if (type === 'diamond') return this.#getDiamond(spacingX, spacingY, w, h, baseY);
    return this.#getVShape(spacingX, spacingY, w, h, baseY);
  }

  #getRectangle(spacingX, spacingY, w, h, baseY) {
    const coords = [];
    const rows = 4, cols = 8;
    const totalW = (cols - 1) * spacingX;
    const startX = (this.width - totalW) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        coords.push(this.#createEnemy(startX + c * spacingX, baseY + r * spacingY, w, h, r));
      }
    }
    return coords;
  }

  #getTriangle(spacingX, spacingY, w, h, baseY) {
    const coords = [];
    const cols = [8, 6, 4, 2];
    for (let r = 0; r < cols.length; r++) {
      const totalW = (cols[r] - 1) * spacingX;
      const startX = (this.width - totalW) / 2;
      for (let c = 0; c < cols[r]; c++) {
        coords.push(this.#createEnemy(startX + c * spacingX, baseY + r * spacingY, w, h, r));
      }
    }
    return coords;
  }

  #getDiamond(spacingX, spacingY, w, h, baseY) {
    const coords = [];
    const cols = [2, 4, 6, 4, 2];
    for (let r = 0; r < cols.length; r++) {
      const totalW = (cols[r] - 1) * spacingX;
      const startX = (this.width - totalW) / 2;
      for (let c = 0; c < cols[r]; c++) {
        coords.push(this.#createEnemy(startX + c * spacingX, baseY + r * spacingY, w, h, r));
      }
    }
    return coords;
  }

  #getVShape(spacingX, spacingY, w, h, baseY) {
    const coords = [];
    const maxCols = 8;
    const rows = 5;
    const totalW = (maxCols - 1) * spacingX;
    const startX = (this.width - totalW) / 2;

    for (let r = 0; r < rows - 1; r++) {
      const leftIdx = r;
      const rightIdx = maxCols - 1 - r;
      coords.push(this.#createEnemy(startX + leftIdx * spacingX, baseY + r * spacingY, w, h, r));
      coords.push(this.#createEnemy(startX + rightIdx * spacingX, baseY + r * spacingY, w, h, r));
    }
    for (let c = 0; c < maxCols; c++) {
      coords.push(this.#createEnemy(startX + c * spacingX, baseY + (rows - 1) * spacingY, w, h, rows - 1));
    }
    return coords;
  }

  #initEnemyGrid() {
    if (this.gameLevel > 0 && this.gameLevel % 5 === 0) {
      this.#initBoss();
      return;
    }
    this.enemies = this.#getFormationCoords();
  }

  #initBoss() {
    this.boss = {
      x: this.width / 2 - 60,
      y: 60, 
      width: 120,
      height: 60,
      hp: this.gameLevel * 20,
      maxHp: this.gameLevel * 20,
      speed: 2,
      direction: 1,
      shootTimer: Date.now(),
      shootInterval: 400
    };
  }

  #checkAABB(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  restart() {
    this.score = 0;
    this.gameLevel = 1;
    this.lives = 3;
    this.isInvincible = false;
    this.weaponTier = 1; 
    this.shieldActive = false;
    this.enemySpeed = this.isMobile ? 0.75 : 1;
    this.enemyDirection = 1;
    this.isGameOver = false;
    this.currentBgZone = -1; // Reset background zone
    
    this.lastEnemyShotTime = Date.now();
    this.player.x = this.width / 2 - this.player.width / 2;
    this.player.y = this.height - 40; 
    
    this.lasers = [];
    this.enemyLasers = [];
    this.enemies = [];
    this.powerUps = [];
    this.boss = null;
    this.#initEnemyGrid();
  }

  render(controls) {
    const ctx = this.ctx;
    const now = Date.now();

    ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw Dynamic Background
    this.#drawBackground(ctx);

    if (this.isGameOver) {
      this.#drawEntities(ctx);
      this.#drawHUD(ctx);
      this.#drawGameOver(ctx);
      return;
    }

    if (this.isInvincible && now > this.invincibilityEndTime) this.isInvincible = false;
    if (this.shieldActive && now > this.shieldEndTime) this.shieldActive = false;

    this.shootCooldown = this.baseShootCooldown;

    if (controls.left && this.player.x > 0) this.player.x -= this.player.speed;
    if (controls.right && this.player.x + this.player.width < this.width) this.player.x += this.player.speed;

    // --- WEAPON TIER FIRING LOGIC ---
    const laserColor = '#ff007f';
    if (controls.fire && now - this.lastShotTime > this.shootCooldown) {
      const px = this.player.x;
      const py = this.player.y;

      if (this.weaponTier === 1) {
        this.lasers.push({ x: px + 18, y: py - 5, width: 4, height: 10, vx: 0, vy: -7, color: laserColor });
      } else if (this.weaponTier === 2) {
        this.lasers.push({ x: px + 1, y: py + 12, width: 4, height: 10, vx: 0, vy: -7, color: laserColor });
        this.lasers.push({ x: px + 35, y: py + 12, width: 4, height: 10, vx: 0, vy: -7, color: laserColor });
      } else if (this.weaponTier >= 3) {
        this.lasers.push({ x: px + 5, y: py + 10, width: 4, height: 10, vx: -2, vy: -6, color: laserColor });
        this.lasers.push({ x: px + 18, y: py - 5, width: 4, height: 10, vx: 0, vy: -7, color: laserColor });
        this.lasers.push({ x: px + 31, y: py + 10, width: 4, height: 10, vx: 2, vy: -6, color: laserColor });
      }
      
      this.lastShotTime = now;
      audio.playLaser();
    }

    this.lasers.forEach(laser => {
      laser.x += laser.vx;
      laser.y += laser.vy;
    });
    this.lasers = this.lasers.filter(laser => laser.y + laser.height > 0 && laser.x > -20 && laser.x < this.width + 20);

    // --- BOSS LOGIC ---
    if (this.boss) {
      const b = this.boss;
      b.x += b.speed * b.direction;
      if (b.x <= 0 || b.x + b.width >= this.width) b.direction *= -1;

      if (now - b.shootTimer > b.shootInterval) {
        for (let i = 0; i < 3; i++) {
          this.enemyLasers.push({ x: b.x + 15 + (i * 35), y: b.y + b.height, width: 4, height: 10, speed: 6, color: '#ff0040' });
        }
        b.shootTimer = now;
      }

      this.lasers.forEach(laser => {
        if (laser.y > 0 && this.#checkAABB(laser, b)) {
          laser.y = -100; 
          b.hp -= 10;
          this.score += 5;
          if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('arcade_highscore', this.highScore);
          }
          audio.playExplosion();

          if (b.hp <= 0) {
            const types = ['ATTACK_SPEED', 'EXTRA_LIFE', 'SHIELD'];
            for (let i = 0; i < 4; i++) {
              const type = types[Math.floor(Math.random() * types.length)];
              this.powerUps.push(new PowerUp(b.x + Math.random() * b.width, b.y + b.height, type));
            }
            this.boss = null; 
            audio.playExplosion();
          }
        }
      });

      if (b && b.y + b.height >= this.player.y) {
        this.isGameOver = true;
      }
    }

    // --- ENEMY LOGIC ---
    if (this.enemies.length > 0) {
      let currentFireInterval = this.enemyShootInterval;
      let currentEnemyLaserSpeed = 5;
      
      if (this.weaponTier === 2) {
        currentFireInterval *= 0.7;
        currentEnemyLaserSpeed = 6;
      } else if (this.weaponTier >= 3) {
        currentFireInterval *= 0.5;
        currentEnemyLaserSpeed = 7;
      }

      if (now - this.lastEnemyShotTime > currentFireInterval) {
        const randomIndex = Math.floor(Math.random() * this.enemies.length);
        const shooter = this.enemies[randomIndex];
        this.enemyLasers.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4, height: 10, speed: currentEnemyLaserSpeed, color: '#ffff00'
        });
        this.lastEnemyShotTime = now;
      }

      let hitEdge = false;
      this.enemies.forEach(enemy => {
        enemy.x += this.enemySpeed * this.enemyDirection;
        if (enemy.x <= 0 || enemy.x + enemy.width >= this.width) hitEdge = true;
      });

      if (hitEdge) {
        this.enemyDirection *= -1;
        this.enemies.forEach(enemy => {
          enemy.x += this.enemySpeed * this.enemyDirection;
          enemy.y += this.dropStep;
        });
      }

      this.lasers.forEach(laser => {
        this.enemies.forEach(enemy => {
          if (enemy.alive && laser.y > 0 && this.#checkAABB(laser, enemy)) {
            enemy.health--;
            laser.y = -100; 
            
            if (enemy.health <= 0) {
              enemy.alive = false;
              this.score += enemy.points; 
              if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('arcade_highscore', this.highScore);
              }
              if (Math.random() < 0.15) {
                const types = ['ATTACK_SPEED', 'EXTRA_LIFE', 'SHIELD'];
                const type = types[Math.floor(Math.random() * types.length)];
                this.powerUps.push(new PowerUp(enemy.x + enemy.width/2 - 10, enemy.y, type));
              }
              audio.playExplosion();
            }
          }
        });
      });

      for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].y + this.enemies[i].height >= this.player.y) {
          this.isGameOver = true;
          break;
        }
      }
    }

    this.enemyLasers.forEach(laser => laser.y += laser.speed);
    this.enemyLasers = this.enemyLasers.filter(laser => laser.y < this.height);

    this.powerUps.forEach(pu => pu.update());
    this.powerUps = this.powerUps.filter(pu => pu.y < this.height + 20);

    if (!this.isInvincible) {
      for (let i = this.enemyLasers.length - 1; i >= 0; i--) {
        if (this.#checkAABB(this.enemyLasers[i], this.player)) {
          if (this.shieldActive) {
            this.enemyLasers.splice(i, 1);
          } else {
            this.lives--;
            this.enemyLasers = []; 
            this.weaponTier = 1; 
            
            if (this.lives <= 0) {
              this.isGameOver = true;
            } else {
              this.isInvincible = true;
              this.invincibilityEndTime = now + 1000;
            }
            audio.playExplosion();
            break;
          }
        }
      }
    }

    for (let i = 0; i < this.powerUps.length; i++) {
      if (this.#checkAABB(this.powerUps[i], this.player)) {
        const puType = this.powerUps[i].type;
        if (puType === 'ATTACK_SPEED') {
          if (this.weaponTier < 3) this.weaponTier++;
        } else if (puType === 'EXTRA_LIFE') {
          if (this.lives < this.maxLives) this.lives++;
        } else if (puType === 'SHIELD') {
          this.shieldActive = true;
          this.shieldEndTime = now + 7000;
        }
        this.powerUps.splice(i, 1);
        audio.playLaser();
        break;
      }
    }

    this.enemies = this.enemies.filter(enemy => enemy.alive);
    this.lasers = this.lasers.filter(laser => laser.y > 0);

    if (this.enemies.length === 0 && !this.boss) {
      this.gameLevel++;
      this.enemySpeed = Math.min(this.enemySpeed + 0.5, this.isMobile ? 2.5 : 3); 
      this.enemyDirection = 1;
      this.enemyShootInterval = Math.max(400, this.enemyShootInterval - 100);
      this.#initEnemyGrid();
    }

    this.#drawEntities(ctx);
    this.#drawHUD(ctx);
  }

  #drawEntities(ctx) {
    // --- DRAW BIO-MECHANICAL ENEMIES ---
    this.enemies.forEach(enemy => {
      const ex = enemy.x, ey = enemy.y, ew = enemy.width, eh = enemy.height;
      const cx = ex + ew / 2;
      
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = enemy.color;
      ctx.fillStyle = enemy.color === '#bf40bf' ? '#1a001a' : '#0a2e0a'; 
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(cx, ey);
      ctx.quadraticCurveTo(ex + ew + 2, ey + eh * 0.6, ex + ew * 0.7, ey + eh);
      ctx.lineTo(ex + ew * 0.3, ey + eh);
      ctx.quadraticCurveTo(ex - 2, ey + eh * 0.6, cx, ey);
      ctx.fill();
      ctx.stroke();

      if (enemy.maxHealth > 1) {
        ctx.beginPath();
        ctx.moveTo(cx, ey + 3);
        ctx.quadraticCurveTo(ex + ew - 4, ey + eh * 0.6, ex + ew * 0.7 - 3, ey + eh - 2);
        ctx.lineTo(ex + ew * 0.3 + 3, ey + eh - 2);
        ctx.quadraticCurveTo(ex + 4, ey + eh * 0.6, cx, ey + 3);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(ex + 5, ey + 5);
      ctx.lineTo(cx, ey + eh * 0.8);
      ctx.lineTo(cx + 2, ey + eh * 0.8);
      ctx.lineTo(ex + ew - 5, ey + 5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ex + ew * 0.3, ey + eh);
      ctx.quadraticCurveTo(ex + ew * 0.2, ey + eh + 6, ex + ew * 0.4, ey + eh + 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex + ew * 0.7, ey + eh);
      ctx.quadraticCurveTo(ex + ew * 0.8, ey + eh + 6, ex + ew * 0.6, ey + eh + 2);
      ctx.stroke();

      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cx - 5, ey + eh * 0.4, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 5, ey + eh * 0.4, 2, 0, Math.PI * 2); ctx.fill();
    });

    // --- DRAW INTIMIDATING BOSS DREADNOUGHT ---
    if (this.boss) {
      const b = this.boss;
      const bx = b.x, by = b.y, bw = b.width, bh = b.height;
      const bcx = bx + bw / 2;

      ctx.shadowColor = '#ff0040';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#1a0008';
      ctx.strokeStyle = '#ff0040';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(bcx, by - 10);
      ctx.lineTo(bx + bw * 0.8, by + bh * 0.3);
      ctx.lineTo(bx + bw, by + bh * 0.6);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx, by + bh * 0.6);
      ctx.lineTo(bx + bw * 0.2, by + bh * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bx + bw * 0.2, by + bh * 0.4);
      ctx.lineTo(bx - 25, by + bh * 0.7);
      ctx.lineTo(bx - 25, by + bh * 0.9);
      ctx.lineTo(bx + bw * 0.2, by + bh * 0.7);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bx + bw * 0.8, by + bh * 0.4);
      ctx.lineTo(bx + bw + 25, by + bh * 0.7);
      ctx.lineTo(bx + bw + 25, by + bh * 0.9);
      ctx.lineTo(bx + bw * 0.8, by + bh * 0.7);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.shadowColor = '#ff0040';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#330010';
      ctx.beginPath(); ctx.arc(bx + bw * 0.25, by + bh * 0.8, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx + bw * 0.75, by + bh * 0.8, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath(); ctx.arc(bcx, by + bh * 0.5, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(bcx, by + bh * 0.5, 3, 0, Math.PI * 2); ctx.fill();
    }

    // --- DRAW POWERUPS ---
    this.powerUps.forEach(pu => pu.draw(ctx));

    // --- DRAW LASERS ---
    this.enemyLasers.forEach(laser => {
      ctx.shadowColor = laser.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = laser.color;
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });

    this.lasers.forEach(laser => {
      ctx.shadowColor = laser.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = laser.color;
      ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });

    // --- DRAW STREAMLINED PLAYER STARFIGHTER ---
    const drawPlayer = !this.isInvincible || Math.floor(Date.now() / 80) % 2 === 0;
    if (drawPlayer) {
      const px = this.player.x;
      const py = this.player.y;
      const shipColor = this.player.color;
      
      ctx.shadowColor = shipColor;
      ctx.shadowBlur = 25;
      ctx.strokeStyle = shipColor;
      ctx.fillStyle = '#050a14';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(px + 20, py - 6);
      ctx.lineTo(px + 26, py + 6);
      ctx.lineTo(px + 40, py + 16);
      ctx.lineTo(px + 30, py + 18);
      ctx.lineTo(px + 24, py + 12);
      ctx.lineTo(px + 16, py + 12);
      ctx.lineTo(px + 10, py + 18);
      ctx.lineTo(px, py + 16);
      ctx.lineTo(px + 14, py + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = shipColor;
      ctx.fillRect(px + 1, py + 12, 4, 6);
      ctx.fillRect(px + 35, py + 12, 4, 6);

      const flameLength = 4 + Math.random() * 6;
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.moveTo(px + 14, py + 12);
      ctx.lineTo(px + 20, py + 12 + flameLength);
      ctx.lineTo(px + 26, py + 12);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(px + 17, py + 12);
      ctx.lineTo(px + 20, py + 12 + (flameLength * 0.5));
      ctx.lineTo(px + 23, py + 12);
      ctx.closePath();
      ctx.fill();
    }

    // --- DRAW SHIELD BUBBLE ---
    if (this.shieldActive) {
      const centerX = this.player.x + this.player.width / 2;
      const centerY = this.player.y + this.player.height / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.closePath();
    }
    
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  #drawHUD(ctx) {
    const now = Date.now();
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Courier New", Courier, monospace';
    
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${this.score}`, 15, 15);
    
    ctx.textAlign = 'center';
    ctx.fillText(`HI-SCORE: ${this.highScore}`, this.width / 2, 15);
    
    ctx.textAlign = 'right';
    ctx.fillText(`LEVEL: ${this.gameLevel}`, this.width - 15, 15);

    ctx.textAlign = 'left';
    ctx.font = '12px "Courier New", Courier, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.fillText('LIVES:', 15, 32);

    const heartMap = [
      [0,1,0,1,0],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0]
    ];
    
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ff007f';
    for (let h = 0; h < this.lives; h++) {
      const startX = 75 + (h * 20);
      const startY = 22;
      const pxSize = 2.5;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (heartMap[r][c]) {
            ctx.fillRect(startX + c * pxSize, startY + r * pxSize, pxSize, pxSize);
          }
        }
      }
    }

    if (this.boss) {
      const b = this.boss;
      const barWidth = 300;
      const barHeight = 12;
      const barX = (this.width - barWidth) / 2;
      const barY = 45;

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      ctx.shadowColor = '#ff0040';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ff0040';
      ctx.fillRect(barX, barY, barWidth * (b.hp / b.maxHp), barHeight);
      
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "Courier New", Courier, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BOSS', this.width / 2, barY + 10);
    }

    ctx.font = '14px "Courier New", Courier, monospace';
    ctx.textAlign = 'right';
    let activeBuffY = this.boss ? 70 : 32;

    if (this.weaponTier > 1) {
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffff00';
      ctx.fillText(`WEAPON: T${this.weaponTier}`, this.width - 15, activeBuffY);
      activeBuffY += 18;
    }

    if (this.shieldActive) {
      const timeLeft = Math.max(0, Math.ceil((this.shieldEndTime - now) / 1000));
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`SHIELD: ${timeLeft}s`, this.width - 15, activeBuffY);
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  #drawGameOver(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#ff007f';
    ctx.font = 'bold 48px "Courier New", Courier, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 20);

    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00f0ff';
    ctx.font = '20px "Courier New", Courier, monospace';
    ctx.fillText('Press Enter to Restart', this.width / 2, this.height / 2 + 30);

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }
}