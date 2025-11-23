// Game Configuration
const CONFIG = {
    canvas: {
        width: 1280,
        height: 720
    },
    gravity: 0.8,
    friction: 0.85,
    jumpForce: -18,
    moveSpeed: 6,
    groundLevel: 580,

    difficulty: {
        easy: { aiReactionTime: 800, aiAggressiveness: 0.3, aiBlockChance: 0.2, aiComboChance: 0.3 },
        medium: { aiReactionTime: 500, aiAggressiveness: 0.5, aiBlockChance: 0.4, aiComboChance: 0.5 },
        hard: { aiReactionTime: 300, aiAggressiveness: 0.7, aiBlockChance: 0.6, aiComboChance: 0.7 },
        extreme: { aiReactionTime: 150, aiAggressiveness: 0.9, aiBlockChance: 0.8, aiComboChance: 0.9 }
    },

    characters: {
        naruto: {
            name: 'Naruto',
            health: 100,
            chakra: 100,
            speed: 6,
            jumpForce: -18,
            attackDamage: 8,
            specialDamage: 15,
            ultimateDamage: 30,
            primaryColor: '#ff6b35',
            secondaryColor: '#f7931e',
            chakraColor: '#00bfff',
            headbandColor: '#ff6b35',
            bodyColor: '#f7931e',
            skinColor: '#ffdbac'
        },
        sasuke: {
            name: 'Sasuke',
            health: 85,
            chakra: 110,
            speed: 8,
            jumpForce: -20,
            attackDamage: 10,
            specialDamage: 18,
            ultimateDamage: 35,
            primaryColor: '#3b4371',
            secondaryColor: '#5b6a9e',
            chakraColor: '#9c27b0',
            headbandColor: '#3b4371',
            bodyColor: '#1a1a2e',
            skinColor: '#ffe0bd'
        },
        sakura: {
            name: 'Sakura',
            health: 110,
            chakra: 95,
            speed: 6,
            jumpForce: -17,
            attackDamage: 12,
            specialDamage: 20,
            ultimateDamage: 40,
            primaryColor: '#ff6b9d',
            secondaryColor: '#ffa8c5',
            chakraColor: '#e91e63',
            headbandColor: '#ff6b9d',
            bodyColor: '#ff1744',
            skinColor: '#ffe0d0'
        },
        kakashi: {
            name: 'Kakashi',
            health: 95,
            chakra: 105,
            speed: 7,
            jumpForce: -19,
            attackDamage: 10,
            specialDamage: 17,
            ultimateDamage: 33,
            primaryColor: '#757575',
            secondaryColor: '#9e9e9e',
            chakraColor: '#00e5ff',
            headbandColor: '#424242',
            bodyColor: '#616161',
            skinColor: '#f5deb3'
        },
        'rock-lee': {
            name: 'Rock Lee',
            health: 90,
            chakra: 80,
            speed: 9,
            jumpForce: -22,
            attackDamage: 7,
            specialDamage: 14,
            ultimateDamage: 28,
            primaryColor: '#2e7d32',
            secondaryColor: '#4caf50',
            chakraColor: '#76ff03',
            headbandColor: '#1b5e20',
            bodyColor: '#ff6f00',
            skinColor: '#d4a574'
        },
        gaara: {
            name: 'Gaara',
            health: 120,
            chakra: 100,
            speed: 4.5,
            jumpForce: -15,
            attackDamage: 9,
            specialDamage: 16,
            ultimateDamage: 32,
            primaryColor: '#c62828',
            secondaryColor: '#e53935',
            chakraColor: '#ff6d00',
            headbandColor: '#8b0000',
            bodyColor: '#b71c1c',
            skinColor: '#f0e6d2'
        }
    }
};

// Particle System for Visual Effects
class Particle {
    constructor(x, y, color, velocity, lifetime = 60, type = 'circle') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.size = Math.random() * 4 + 2;
        this.type = type;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
        this.lifetime--;
        this.vx *= 0.98;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        const alpha = this.lifetime / this.maxLifetime;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;

        if (this.type === 'star') {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
        } else if (this.type === 'spark') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    isDead() {
        return this.lifetime <= 0;
    }
}

// Visual Effect System
class EffectSystem {
    constructor() {
        this.particles = [];
        this.impacts = [];
        this.jutsus = [];
        this.screenShake = { x: 0, y: 0, intensity: 0 };
        this.slowMotion = 1;
        this.flashEffect = { active: false, alpha: 0, color: '#fff' };
        this.trails = [];
    }

    createImpact(x, y, color = '#ff6b35', intensity = 1) {
        const particleCount = Math.floor(15 * intensity);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = (Math.random() * 5 + 3) * intensity;
            const type = Math.random() > 0.7 ? 'spark' : 'circle';
            this.particles.push(new Particle(
                x, y, color,
                { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
                30 + Math.random() * 20,
                type
            ));
        }

        // Add star particles for critical hits
        if (intensity > 1.5) {
            for (let i = 0; i < 5; i++) {
                this.particles.push(new Particle(
                    x + (Math.random() - 0.5) * 40,
                    y + (Math.random() - 0.5) * 40,
                    '#ffd700',
                    { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
                    40,
                    'star'
                ));
            }
        }

        this.impacts.push({ x, y, radius: 5, maxRadius: 50 * intensity, alpha: 1, color });

        // Screen shake based on intensity
        this.addScreenShake(intensity * 5);
    }

    addScreenShake(intensity) {
        this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
    }

    createFlash(color = '#fff', intensity = 0.3) {
        this.flashEffect.active = true;
        this.flashEffect.alpha = intensity;
        this.flashEffect.color = color;
    }

    addTrail(x, y, color, size = 10) {
        this.trails.push({
            x, y, color, size,
            alpha: 0.5,
            lifetime: 10
        });
    }

    createJutsuEffect(x, y, width, height, color) {
        this.jutsus.push({
            x, y, width, height, color,
            alpha: 1,
            lifetime: 30,
            particles: []
        });

        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(
                x + Math.random() * width,
                y + Math.random() * height,
                color,
                { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 },
                40
            ));
        }
    }

    createComboText(x, y, combo) {
        this.impacts.push({
            x, y,
            text: combo + ' HIT!',
            alpha: 1,
            lifetime: 60,
            vy: -2
        });
    }

    update() {
        // Update particles
        this.particles = this.particles.filter(p => {
            p.update();
            return !p.isDead();
        });

        // Update impacts
        this.impacts = this.impacts.filter(impact => {
            if (impact.text) {
                impact.y += impact.vy;
                impact.lifetime--;
                impact.alpha = impact.lifetime / 60;
                return impact.lifetime > 0;
            } else {
                impact.radius += 3;
                impact.alpha -= 0.04;
                return impact.alpha > 0;
            }
        });

        // Update jutsus
        this.jutsus = this.jutsus.filter(jutsu => {
            jutsu.lifetime--;
            jutsu.alpha = jutsu.lifetime / 30;
            return jutsu.lifetime > 0;
        });

        // Update trails
        this.trails = this.trails.filter(trail => {
            trail.lifetime--;
            trail.alpha = trail.lifetime / 10;
            return trail.lifetime > 0;
        });

        // Update screen shake
        if (this.screenShake.intensity > 0) {
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.intensity *= 0.9;
            if (this.screenShake.intensity < 0.1) {
                this.screenShake.intensity = 0;
                this.screenShake.x = 0;
                this.screenShake.y = 0;
            }
        }

        // Update slow motion
        if (this.slowMotion < 1) {
            this.slowMotion += 0.02;
            if (this.slowMotion > 1) this.slowMotion = 1;
        }

        // Update flash effect
        if (this.flashEffect.active) {
            this.flashEffect.alpha -= 0.05;
            if (this.flashEffect.alpha <= 0) {
                this.flashEffect.active = false;
            }
        }
    }

    draw(ctx) {
        // Draw trails first (behind everything)
        this.trails.forEach(trail => {
            ctx.save();
            ctx.globalAlpha = trail.alpha;
            ctx.fillStyle = trail.color;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw particles
        this.particles.forEach(p => p.draw(ctx));

        // Draw impacts
        this.impacts.forEach(impact => {
            ctx.save();
            ctx.globalAlpha = impact.alpha;

            if (impact.text) {
                ctx.font = 'bold 30px Arial';
                ctx.fillStyle = '#ffd700';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.strokeText(impact.text, impact.x - 50, impact.y);
                ctx.fillText(impact.text, impact.x - 50, impact.y);
            } else {
                // Draw expanding circle with gradient
                const gradient = ctx.createRadialGradient(
                    impact.x, impact.y, impact.radius * 0.5,
                    impact.x, impact.y, impact.radius
                );
                gradient.addColorStop(0, impact.color || '#ff6b35');
                gradient.addColorStop(1, 'transparent');

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(impact.x, impact.y, impact.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        });

        // Draw jutsus with glow effect
        this.jutsus.forEach(jutsu => {
            ctx.save();
            ctx.globalAlpha = jutsu.alpha;

            // Glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = jutsu.color;
            ctx.fillStyle = jutsu.color;
            ctx.fillRect(jutsu.x, jutsu.y, jutsu.width, jutsu.height);

            ctx.restore();
        });

        // Draw flash effect
        if (this.flashEffect.active && this.flashEffect.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.flashEffect.alpha;
            ctx.fillStyle = this.flashEffect.color;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
        }
    }

    getScreenShake() {
        return { x: this.screenShake.x, y: this.screenShake.y };
    }

    getSlowMotion() {
        return this.slowMotion;
    }

    setSlowMotion(value) {
        this.slowMotion = value;
    }
}

// Character Class
class Character {
    constructor(x, y, isPlayer = true, characterType = 'naruto') {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 100;
        this.isPlayer = isPlayer;
        this.characterType = characterType;

        // Get character profile
        const profile = CONFIG.characters[characterType];

        // Movement
        this.vx = 0;
        this.vy = 0;
        this.facingRight = isPlayer;
        this.isJumping = false;
        this.speed = profile.speed;
        this.jumpForce = profile.jumpForce;

        // Combat Stats
        this.maxHealth = profile.health;
        this.health = profile.health;
        this.maxChakra = profile.chakra;
        this.chakra = profile.chakra;
        this.chakraRegenRate = 0.15;
        this.attackDamage = profile.attackDamage;
        this.specialDamage = profile.specialDamage;
        this.ultimateDamage = profile.ultimateDamage;

        // Combat State
        this.isAttacking = false;
        this.isBlocking = false;
        this.attackCooldown = 0;
        this.blockCooldown = 0;
        this.stunned = false;
        this.stunnedTime = 0;

        // Combo System
        this.combo = 0;
        this.comboTimer = 0;
        this.lastAttackTime = 0;
        this.consecutiveHits = 0;

        // Animation
        this.animationState = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;

        // Jutsu
        this.jutsuCooldown = 0;
        this.ultimateCooldown = 0;

        // Colors from character profile
        this.name = profile.name;
        this.primaryColor = profile.primaryColor;
        this.secondaryColor = profile.secondaryColor;
        this.chakraColor = profile.chakraColor;
        this.headbandColor = profile.headbandColor;
        this.bodyColor = profile.bodyColor;
        this.skinColor = profile.skinColor;

        // Visual effects
        this.hitFlash = 0;
        this.rotation = 0;
        this.scale = 1;
    }

    update(effects = null) {
        // Store previous jump state for landing detection
        const wasJumping = this.isJumping;

        // Apply gravity
        if (this.y < CONFIG.groundLevel) {
            this.vy += CONFIG.gravity;
            this.isJumping = true;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision with landing effect
        if (this.y >= CONFIG.groundLevel) {
            this.y = CONFIG.groundLevel;

            // Create dust particles on landing
            if (wasJumping && effects && Math.abs(this.vy) > 5) {
                for (let i = 0; i < 8; i++) {
                    effects.particles.push(new Particle(
                        this.x + this.width / 2 + (Math.random() - 0.5) * this.width,
                        this.y + this.height,
                        '#8b7355',
                        { x: (Math.random() - 0.5) * 4, y: -Math.random() * 3 },
                        20 + Math.random() * 10,
                        'circle'
                    ));
                }
            }

            this.vy = 0;
            this.isJumping = false;
        }

        // Apply friction
        this.vx *= CONFIG.friction;

        // Boundary check
        if (this.x < 0) this.x = 0;
        if (this.x > CONFIG.canvas.width - this.width) {
            this.x = CONFIG.canvas.width - this.width;
        }

        // Update timers
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.blockCooldown > 0) this.blockCooldown--;
        if (this.jutsuCooldown > 0) this.jutsuCooldown--;
        if (this.ultimateCooldown > 0) this.ultimateCooldown--;
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) this.combo = 0;
        }
        if (this.stunnedTime > 0) {
            this.stunnedTime--;
            this.stunned = this.stunnedTime > 0;
        }

        // Regenerate chakra
        if (this.chakra < this.maxChakra && !this.isAttacking) {
            this.chakra = Math.min(this.maxChakra, this.chakra + this.chakraRegenRate);
        }

        // Update visual effects
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.rotation !== 0) {
            this.rotation *= 0.9;
            if (Math.abs(this.rotation) < 0.01) this.rotation = 0;
        }
        if (this.scale !== 1) {
            this.scale += (1 - this.scale) * 0.1;
            if (Math.abs(this.scale - 1) < 0.01) this.scale = 1;
        }

        // Update animation
        this.updateAnimation();
    }

    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer > 8) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }

        // Set animation state
        if (this.stunned) {
            this.animationState = 'stunned';
        } else if (this.isAttacking) {
            this.animationState = 'attack';
        } else if (this.isBlocking) {
            this.animationState = 'block';
        } else if (this.isJumping) {
            this.animationState = 'jump';
        } else if (Math.abs(this.vx) > 0.5) {
            this.animationState = 'run';
        } else {
            this.animationState = 'idle';
        }
    }

    draw(ctx) {
        ctx.save();

        // Flip character based on facing direction
        if (!this.facingRight) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x, this.y);
        }

        // Apply rotation and scale for hit effects
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.width / 2, -this.height / 2);

        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.width / 2, this.height + 5, this.width / 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Low health glow effect
        if (this.health / this.maxHealth < 0.3) {
            ctx.save();
            const pulseAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.2;
            ctx.globalAlpha = pulseAlpha;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff0000';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
            ctx.fillRect(-5, -5, this.width + 10, this.height + 10);
            ctx.restore();
        }

        // Hit flash effect
        if (this.hitFlash > 0) {
            ctx.save();
            ctx.globalAlpha = this.hitFlash / 10;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }

        // Draw character body (simplified sprite)
        this.drawCharacter(ctx);

        // Draw blocking effect
        if (this.isBlocking) {
            ctx.strokeStyle = this.chakraColor;
            ctx.lineWidth = 3;
            ctx.strokeRect(-5, -5, this.width + 10, this.height + 10);
        }

        ctx.restore();

        // Draw health bar above character
        this.drawFloatingHealthBar(ctx);
    }

    drawCharacter(ctx) {
        const bounce = this.animationState === 'idle' ? Math.sin(this.animationFrame) * 2 : 0;

        // Head
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.arc(this.width / 2, 20 + bounce, 15, 0, Math.PI * 2);
        ctx.fill();

        // Headband
        ctx.fillStyle = this.headbandColor;
        ctx.fillRect(this.width / 2 - 15, 12 + bounce, 30, 8);

        // Body
        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(this.width / 2 - 12, 35 + bounce, 24, 30);

        // Arms
        const armSwing = this.animationState === 'run' ? Math.sin(this.animationFrame) * 10 : 0;
        ctx.fillStyle = this.skinColor;

        // Left arm
        ctx.fillRect(this.width / 2 - 20, 40 + bounce + armSwing, 8, 25);

        // Right arm (attack animation)
        if (this.isAttacking) {
            ctx.fillRect(this.width / 2 + 12, 35 + bounce, 15, 8);
        } else {
            ctx.fillRect(this.width / 2 + 12, 40 + bounce - armSwing, 8, 25);
        }

        // Legs
        ctx.fillStyle = this.primaryColor;
        const legOffset = this.animationState === 'run' ? Math.sin(this.animationFrame) * 8 : 0;

        ctx.fillRect(this.width / 2 - 10, 65 + bounce, 8, 30 + legOffset);
        ctx.fillRect(this.width / 2 + 2, 65 + bounce, 8, 30 - legOffset);

        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(this.width / 2 - 8, 18 + bounce, 4, 4);
        ctx.fillRect(this.width / 2 + 4, 18 + bounce, 4, 4);

        // Attack effect
        if (this.isAttacking) {
            ctx.fillStyle = this.chakraColor;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(this.width + 10, 45, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    drawFloatingHealthBar(ctx) {
        if (this.health < this.maxHealth) {
            const barWidth = 60;
            const barHeight = 5;
            const barX = this.x;
            const barY = this.y - 15;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = healthPercent > 0.3 ? '#00ff00' : '#ff0000';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
    }

    move(direction) {
        if (!this.stunned) {
            this.vx = direction * this.speed;
            if (direction !== 0) {
                this.facingRight = direction > 0;
            }
        }
    }

    jump() {
        if (!this.isJumping && !this.stunned) {
            this.vy = this.jumpForce;
            this.isJumping = true;
        }
    }

    attack() {
        if (this.attackCooldown === 0 && !this.stunned && !this.isBlocking) {
            this.isAttacking = true;
            this.attackCooldown = 25;

            setTimeout(() => {
                this.isAttacking = false;
            }, 200);

            return {
                x: this.facingRight ? this.x + this.width : this.x - 40,
                y: this.y + 30,
                width: 40,
                height: 40,
                damage: this.attackDamage,
                knockback: this.facingRight ? 8 : -8
            };
        }
        return null;
    }

    specialJutsu() {
        const chakraCost = 25;
        if (this.jutsuCooldown === 0 && this.chakra >= chakraCost && !this.stunned) {
            this.chakra -= chakraCost;
            this.jutsuCooldown = 120;

            return {
                x: this.facingRight ? this.x + this.width : this.x - 80,
                y: this.y + 20,
                width: 80,
                height: 60,
                damage: this.specialDamage,
                knockback: this.facingRight ? 15 : -15,
                type: 'special'
            };
        }
        return null;
    }

    ultimateJutsu() {
        const chakraCost = 50;
        if (this.ultimateCooldown === 0 && this.chakra >= chakraCost && !this.stunned) {
            this.chakra -= chakraCost;
            this.ultimateCooldown = 300;

            return {
                x: this.facingRight ? this.x + this.width : this.x - 150,
                y: this.y - 20,
                width: 150,
                height: 120,
                damage: this.ultimateDamage,
                knockback: this.facingRight ? 25 : -25,
                type: 'ultimate'
            };
        }
        return null;
    }

    block() {
        if (!this.isAttacking && !this.stunned) {
            this.isBlocking = true;
        }
    }

    stopBlock() {
        this.isBlocking = false;
    }

    takeDamage(damage, knockback) {
        if (this.isBlocking) {
            damage *= 0.3;
            knockback *= 0.5;
        }

        this.health -= damage;
        this.vx = knockback;

        // Visual effects
        this.hitFlash = 10;
        this.rotation = (Math.random() - 0.5) * 0.3;
        this.scale = 0.9;

        if (!this.isBlocking) {
            this.stunned = true;
            this.stunnedTime = 15;
        }

        if (this.health < 0) this.health = 0;
    }

    resetCombo() {
        this.combo = 0;
        this.comboTimer = 0;
    }

    addCombo() {
        this.combo++;
        this.comboTimer = 120;
    }

    getAttackRange() {
        return {
            x: this.facingRight ? this.x + this.width : this.x - 40,
            y: this.y,
            width: 40,
            height: this.height
        };
    }
}

// AI Controller
class AIController {
    constructor(character, player, difficulty) {
        this.character = character;
        this.player = player;
        this.difficulty = CONFIG.difficulty[difficulty];

        this.state = 'idle';
        this.lastActionTime = 0;
        this.targetDistance = 100;
        this.aggressionTimer = 0;
        this.retreatTimer = 0;

        // Adaptive learning
        this.playerAttackPattern = [];
        this.dodgeSuccessRate = 0;
        this.attackSuccessRate = 0;
    }

    update(game) {
        const distance = Math.abs(this.player.x - this.character.x);
        const healthPercent = this.character.health / this.character.maxHealth;

        // Adaptive behavior based on health
        const adaptiveAggression = this.difficulty.aiAggressiveness *
            (healthPercent < 0.3 ? 1.5 : 1);

        // Decision making
        const now = Date.now();
        if (now - this.lastActionTime < this.difficulty.aiReactionTime) {
            return;
        }

        // Analyze player pattern
        if (this.player.isAttacking) {
            this.playerAttackPattern.push(now);
            if (this.playerAttackPattern.length > 5) {
                this.playerAttackPattern.shift();
            }
        }

        // State machine
        if (this.character.stunned) {
            this.state = 'stunned';
        } else if (healthPercent < 0.3 && Math.random() < 0.3) {
            this.state = 'defensive';
        } else if (distance < 80 && this.player.isAttacking &&
                   Math.random() < this.difficulty.aiBlockChance) {
            this.state = 'blocking';
        } else if (distance > 300) {
            this.state = 'approach';
        } else if (distance < 100 && Math.random() < adaptiveAggression) {
            this.state = 'attacking';
        } else if (distance < 60) {
            this.state = 'special';
        } else {
            this.state = 'positioning';
        }

        // Execute state
        this.executeState(game, distance);
        this.lastActionTime = now;
    }

    executeState(game, distance) {
        switch (this.state) {
            case 'approach':
                const direction = this.player.x > this.character.x ? 1 : -1;
                this.character.move(direction);

                if (Math.random() < 0.1 && !this.character.isJumping) {
                    this.character.jump();
                }
                break;

            case 'attacking':
                if (Math.random() < this.difficulty.aiComboChance) {
                    const attack = this.character.attack();
                    if (attack) {
                        game.handleAttack(this.character, attack);
                    }
                }
                break;

            case 'special':
                const rand = Math.random();
                if (rand < 0.3 && this.character.chakra > 50) {
                    const ultimate = this.character.ultimateJutsu();
                    if (ultimate) {
                        game.handleJutsu(this.character, ultimate);
                    }
                } else if (rand < 0.6 && this.character.chakra > 25) {
                    const jutsu = this.character.specialJutsu();
                    if (jutsu) {
                        game.handleJutsu(this.character, jutsu);
                    }
                }
                break;

            case 'blocking':
                this.character.block();
                setTimeout(() => {
                    this.character.stopBlock();
                }, 500);
                break;

            case 'defensive':
                const escapeDir = this.player.x > this.character.x ? -1 : 1;
                this.character.move(escapeDir);
                this.character.block();
                break;

            case 'positioning':
                if (distance < 80) {
                    const backDir = this.player.x > this.character.x ? -1 : 1;
                    this.character.move(backDir * 0.5);
                } else if (distance > 150) {
                    const fwdDir = this.player.x > this.character.x ? 1 : -1;
                    this.character.move(fwdDir * 0.5);
                }
                break;
        }
    }
}

// Arena System
class Arena {
    constructor(type) {
        this.type = type;
        this.config = this.getArenaConfig(type);
    }

    getArenaConfig(type) {
        const arenas = {
            forest: {
                name: 'Hidden Leaf Forest',
                background: ['#1a4d2e', '#2e7d32', '#4caf50'],
                foreground: '#0d2818',
                platforms: []
            },
            mountains: {
                name: 'Mountain Valley',
                background: ['#263238', '#455a64', '#607d8b'],
                foreground: '#1a252b',
                platforms: []
            },
            village: {
                name: 'Training Grounds',
                background: ['#3e2723', '#5d4037', '#795548'],
                foreground: '#2c1810',
                platforms: []
            },
            waterfall: {
                name: 'Waterfall Arena',
                background: ['#006064', '#0097a7', '#00bcd4'],
                foreground: '#004d54',
                platforms: []
            }
        };
        return arenas[type] || arenas.forest;
    }

    draw(ctx) {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CONFIG.canvas.height);
        this.config.background.forEach((color, index) => {
            gradient.addColorStop(index / (this.config.background.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Ground
        ctx.fillStyle = this.config.foreground;
        ctx.fillRect(0, CONFIG.groundLevel + 100, CONFIG.canvas.width, CONFIG.canvas.height);

        // Arena decorations
        this.drawDecorations(ctx);
    }

    drawDecorations(ctx) {
        if (this.type === 'forest') {
            // Trees
            for (let i = 0; i < 5; i++) {
                const x = i * 300 + 50;
                ctx.fillStyle = '#3e2723';
                ctx.fillRect(x, 400, 30, 200);
                ctx.fillStyle = '#2e7d32';
                ctx.beginPath();
                ctx.arc(x + 15, 380, 50, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.type === 'mountains') {
            // Mountains
            ctx.fillStyle = '#37474f';
            ctx.beginPath();
            ctx.moveTo(0, 600);
            ctx.lineTo(200, 300);
            ctx.lineTo(400, 600);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(300, 600);
            ctx.lineTo(500, 250);
            ctx.lineTo(700, 600);
            ctx.fill();
        } else if (this.type === 'waterfall') {
            // Waterfall effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 10; i++) {
                ctx.fillRect(1000 + i * 5, 0, 3, 700);
            }
        }
    }
}

// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Base game dimensions (internal resolution)
        this.baseWidth = CONFIG.canvas.width;
        this.baseHeight = CONFIG.canvas.height;

        // Scale factors for responsive design
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        // Set initial canvas size
        this.resizeCanvas();

        // Game state
        this.state = 'menu';
        this.difficulty = 'medium';
        this.arenaType = 'forest';
        this.selectedCharacter = 'naruto';

        // Game objects
        this.player = null;
        this.enemy = null;
        this.ai = null;
        this.arena = null;
        this.effects = new EffectSystem();

        // Input
        this.keys = {};
        this.jumpKeyHeld = false;

        // Game timer
        this.timeRemaining = 99;
        this.timeCounter = 0;

        // UI Elements
        this.initUI();
        this.setupEventListeners();
        this.setupResizeHandler();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate aspect ratio
        const gameAspect = this.baseWidth / this.baseHeight;
        const containerAspect = containerWidth / containerHeight;

        let canvasWidth, canvasHeight;

        // Fit canvas to container while maintaining aspect ratio
        if (containerAspect > gameAspect) {
            // Container is wider - fit to height
            canvasHeight = containerHeight;
            canvasWidth = canvasHeight * gameAspect;
        } else {
            // Container is taller - fit to width
            canvasWidth = containerWidth;
            canvasHeight = canvasWidth / gameAspect;
        }

        // Set canvas display size (CSS)
        this.canvas.style.width = canvasWidth + 'px';
        this.canvas.style.height = canvasHeight + 'px';

        // Set canvas internal resolution
        this.canvas.width = this.baseWidth;
        this.canvas.height = this.baseHeight;

        // Calculate scale for coordinate conversion
        this.scale = canvasWidth / this.baseWidth;
        this.offsetX = (containerWidth - canvasWidth) / 2;
        this.offsetY = (containerHeight - canvasHeight) / 2;
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        });

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        });
    }

    initUI() {
        this.screens = {
            title: document.getElementById('titleScreen'),
            game: document.getElementById('gameScreen'),
            gameOver: document.getElementById('gameOverScreen')
        };

        this.hudElements = {
            playerHealth: document.getElementById('playerHealth'),
            playerChakra: document.getElementById('playerChakra'),
            playerCombo: document.getElementById('playerCombo'),
            enemyHealth: document.getElementById('enemyHealth'),
            enemyChakra: document.getElementById('enemyChakra'),
            enemyCombo: document.getElementById('enemyCombo'),
            timer: document.getElementById('timer')
        };
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.startGame());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.showMenu());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('quitBtn').addEventListener('click', () => this.showMenu());

        // Difficulty selection
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });

        // Arena selection
        document.getElementById('arenaSelect').addEventListener('change', (e) => {
            this.arenaType = e.target.value;
        });

        // Character selection
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                characterCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedCharacter = card.dataset.character;
            });
        });

        // Keyboard input
        window.addEventListener('keydown', (e) => {
            // Prevent default browser behavior for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key) ||
                ['w', 'a', 's', 'd', 'j', 'k', 'l'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            this.keys[e.key.toLowerCase()] = true;

            if (e.key === 'Escape' && this.state === 'playing') {
                this.pauseGame();
            }
        });

        window.addEventListener('keyup', (e) => {
            // Prevent default browser behavior for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key) ||
                ['w', 'a', 's', 'd', 'j', 'k', 'l'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            this.keys[e.key.toLowerCase()] = false;
        });

        // Mobile touch controls
        const controlButtons = document.querySelectorAll('.control-btn');
        controlButtons.forEach(btn => {
            // Touch start - activate key
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = true;
                }
            });

            // Touch end - deactivate key
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = false;
                    // Reset jump key held flag when releasing jump button
                    if (key === 'w') {
                        this.jumpKeyHeld = false;
                    }
                }
            });

            // Touch cancel - also deactivate key (when touch is interrupted)
            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = false;
                    if (key === 'w') {
                        this.jumpKeyHeld = false;
                    }
                }
            });

            // Mouse events for testing on desktop
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = true;
                }
            });

            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = false;
                    if (key === 'w') {
                        this.jumpKeyHeld = false;
                    }
                }
            });

            btn.addEventListener('mouseleave', () => {
                const key = btn.dataset.key;
                if (key) {
                    this.keys[key] = false;
                    if (key === 'w') {
                        this.jumpKeyHeld = false;
                    }
                }
            });
        });
    }

    startGame() {
        this.state = 'playing';
        this.showScreen('game');

        // Pick random character for AI opponent
        const characterList = Object.keys(CONFIG.characters);
        const randomChar = characterList[Math.floor(Math.random() * characterList.length)];

        // Initialize game objects
        this.player = new Character(200, CONFIG.groundLevel, true, this.selectedCharacter);
        this.enemy = new Character(1000, CONFIG.groundLevel, false, randomChar);
        this.ai = new AIController(this.enemy, this.player, this.difficulty);
        this.arena = new Arena(this.arenaType);
        this.effects = new EffectSystem();

        // Update HUD with character names
        document.querySelector('.player-hud.left .character-name').textContent = this.player.name.toUpperCase();
        document.querySelector('.player-hud.right .character-name').textContent = this.enemy.name.toUpperCase();

        // Reset timer
        this.timeRemaining = 99;
        this.timeCounter = 0;

        // Reset input state
        this.keys = {};
        this.jumpKeyHeld = false;

        // Start game loop
        this.gameLoop();
    }

    pauseGame() {
        this.state = 'paused';
        document.getElementById('pauseMenu').classList.remove('hidden');
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('pauseMenu').classList.add('hidden');
        this.gameLoop();
    }

    showMenu() {
        this.state = 'menu';
        this.showScreen('title');
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    gameLoop() {
        if (this.state !== 'playing') return;

        this.update();
        this.draw();
        this.updateHUD();

        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Handle player input
        this.handleInput();

        // Update characters with effects system
        this.player.update(this.effects);
        this.enemy.update(this.effects);

        // Update AI
        this.ai.update(this);

        // Update effects
        this.effects.update();

        // Update timer
        this.timeCounter++;
        if (this.timeCounter >= 60) {
            this.timeCounter = 0;
            this.timeRemaining--;

            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }

        // Check for game over
        if (this.player.health <= 0 || this.enemy.health <= 0) {
            this.endGame();
        }
    }

    handleInput() {
        // Movement
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.move(-1);
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.player.move(1);
        } else {
            this.player.move(0);
        }

        // Jump (only on key press, not hold)
        if ((this.keys['w'] || this.keys['arrowup']) && !this.jumpKeyHeld) {
            this.player.jump();
            this.jumpKeyHeld = true;
        }

        if (!this.keys['w'] && !this.keys['arrowup']) {
            this.jumpKeyHeld = false;
        }

        // Attack
        if (this.keys['j'] || this.keys[' ']) {
            const attack = this.player.attack();
            if (attack) {
                this.handleAttack(this.player, attack);
            }
        }

        // Special jutsu
        if (this.keys['k'] || this.keys['shift']) {
            const jutsu = this.player.specialJutsu();
            if (jutsu) {
                this.handleJutsu(this.player, jutsu);
            }
        }

        // Ultimate jutsu
        if (this.keys['l'] || this.keys['enter']) {
            const ultimate = this.player.ultimateJutsu();
            if (ultimate) {
                this.handleJutsu(this.player, ultimate);
            }
        }

        // Block
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.player.block();
        } else {
            this.player.stopBlock();
        }
    }

    handleAttack(attacker, attack) {
        const target = attacker === this.player ? this.enemy : this.player;

        // Add motion trail for attacker
        this.effects.addTrail(
            attacker.x + attacker.width / 2,
            attacker.y + attacker.height / 2,
            attacker.primaryColor,
            15
        );

        if (this.checkCollision(attack, target)) {
            target.takeDamage(attack.damage, attack.knockback);
            attacker.addCombo();

            // Calculate intensity based on combo
            const intensity = 1 + (attacker.combo * 0.2);

            this.effects.createImpact(
                target.x + target.width / 2,
                target.y + target.height / 2,
                attacker.primaryColor,
                intensity
            );

            // Flash effect on hit
            this.effects.createFlash(attacker.chakraColor, 0.1);

            if (attacker.combo > 2) {
                this.effects.createComboText(
                    target.x,
                    target.y - 30,
                    attacker.combo
                );
            }
        }
    }

    handleJutsu(attacker, jutsu) {
        const target = attacker === this.player ? this.enemy : this.player;

        const color = jutsu.type === 'ultimate' ? '#ffd700' : attacker.chakraColor;
        this.effects.createJutsuEffect(jutsu.x, jutsu.y, jutsu.width, jutsu.height, color);

        // Ultimate jutsu triggers slow motion
        if (jutsu.type === 'ultimate') {
            this.effects.setSlowMotion(0.5);
            this.effects.createFlash(color, 0.3);
        }

        if (this.checkCollision(jutsu, target)) {
            target.takeDamage(jutsu.damage, jutsu.knockback);
            attacker.addCombo();

            // Higher intensity for jutsu attacks
            const intensity = jutsu.type === 'ultimate' ? 3 : 2;

            this.effects.createImpact(
                target.x + target.width / 2,
                target.y + target.height / 2,
                color,
                intensity
            );

            // Additional screen shake for powerful attacks
            if (jutsu.type === 'ultimate') {
                this.effects.addScreenShake(15);
            }
        }
    }

    checkCollision(attack, target) {
        return attack.x < target.x + target.width &&
               attack.x + attack.width > target.x &&
               attack.y < target.y + target.height &&
               attack.y + attack.height > target.y;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

        // Apply screen shake
        this.ctx.save();
        const shake = this.effects.getScreenShake();
        this.ctx.translate(shake.x, shake.y);

        // Draw arena
        this.arena.draw(this.ctx);

        // Draw effects behind characters
        this.effects.draw(this.ctx);

        // Draw characters
        this.player.draw(this.ctx);
        this.enemy.draw(this.ctx);

        this.ctx.restore();
    }

    updateHUD() {
        // Player stats
        const playerHealthPercent = (this.player.health / this.player.maxHealth) * 100;
        const playerChakraPercent = (this.player.chakra / this.player.maxChakra) * 100;

        this.hudElements.playerHealth.style.width = playerHealthPercent + '%';
        this.hudElements.playerChakra.style.width = playerChakraPercent + '%';
        this.hudElements.playerCombo.textContent =
            this.player.combo > 0 ? this.player.combo + ' HIT COMBO!' : '0 HIT COMBO';

        if (playerHealthPercent < 30) {
            this.hudElements.playerHealth.classList.add('low');
        } else {
            this.hudElements.playerHealth.classList.remove('low');
        }

        // Enemy stats
        const enemyHealthPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
        const enemyChakraPercent = (this.enemy.chakra / this.enemy.maxChakra) * 100;

        this.hudElements.enemyHealth.style.width = enemyHealthPercent + '%';
        this.hudElements.enemyChakra.style.width = enemyChakraPercent + '%';
        this.hudElements.enemyCombo.textContent =
            this.enemy.combo > 0 ? this.enemy.combo + ' HIT COMBO!' : '0 HIT COMBO';

        if (enemyHealthPercent < 30) {
            this.hudElements.enemyHealth.classList.add('low');
        } else {
            this.hudElements.enemyHealth.classList.remove('low');
        }

        // Timer
        this.hudElements.timer.textContent = this.timeRemaining;
        if (this.timeRemaining < 10) {
            this.hudElements.timer.style.color = '#ff0000';
        }
    }

    endGame() {
        this.state = 'gameOver';

        const playerWon = this.player.health > this.enemy.health;
        const resultText = document.getElementById('resultText');

        if (playerWon) {
            resultText.textContent = 'VICTORY!';
            resultText.className = 'result-text victory';
        } else {
            resultText.textContent = 'DEFEAT';
            resultText.className = 'result-text defeat';
        }

        // Display stats
        const statsDisplay = document.getElementById('statsDisplay');
        statsDisplay.innerHTML = `
            <p>Max Combo: ${Math.max(this.player.combo, this.player.consecutiveHits)}</p>
            <p>Remaining Health: ${Math.floor(this.player.health)}%</p>
            <p>Remaining Chakra: ${Math.floor(this.player.chakra)}%</p>
            <p>Time Remaining: ${this.timeRemaining}s</p>
        `;

        this.showScreen('gameOver');
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new Game();
});
