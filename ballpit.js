class Ball {
    constructor(x, y, radius, color, darkColor, gravity, friction, wallBounce) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
        this.radius = radius;
        this.color = color;
        this.darkColor = darkColor;
        this.gravity = gravity;
        this.friction = friction;
        this.wallBounce = wallBounce;
        this.mass = radius * radius;
    }

    update(width, height) {
        // Apply gravity
        this.vy += this.gravity;

        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update positions
        this.x += this.vx;
        this.y += this.vy;

        // Wall collisions
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = -this.vx * this.wallBounce;
        } else if (this.x + this.radius > width) {
            this.x = width - this.radius;
            this.vx = -this.vx * this.wallBounce;
        }

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = -this.vy * this.wallBounce;
        } else if (this.y + this.radius > height) {
            this.y = height - this.radius;
            this.vy = -this.vy * this.wallBounce;
            // Floor friction to settle the ball
            this.vx *= 0.98;
        }
    }

    draw(ctx) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.05,
            this.x,
            this.y,
            this.radius
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, this.darkColor);

        // Shadow effect for 3D depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 6;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

class BallpitSimulation {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.count = options.count || 100;
        this.gravity = options.gravity !== undefined ? options.gravity : 0.01;
        this.friction = options.friction !== undefined ? options.friction : 0.9975;
        this.wallBounce = options.wallBounce !== undefined ? options.wallBounce : 0.95;

        this.balls = [];
        this.mouse = { x: null, y: null, active: false };

        this.palette = [
            { color: '#f5a623', dark: '#4a2e05' }, // Amber (signature accent)
            { color: '#f6c453', dark: '#5c4109' }, // Light Amber
            { color: '#6ee7c9', dark: '#0f3d31' }, // Mint
            { color: '#7dd3fc', dark: '#0c3450' }, // Blue
            { color: '#9a9da6', dark: '#1a1d23' }, // Grey
            { color: '#343841', dark: '#0a0b0d' }  // Graphite
        ];

        this.resize();
        this.initBalls();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        // Keep balls inside boundaries on resize
        this.balls.forEach(ball => {
            if (ball.x + ball.radius > this.canvas.width) {
                ball.x = this.canvas.width - ball.radius;
            }
            if (ball.y + ball.radius > this.canvas.height) {
                ball.y = this.canvas.height - ball.radius;
            }
        });
    }

    initBalls() {
        this.balls = [];
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
        const baseRadius = isMobile ? 10 : (isTablet ? 14 : 18);
        const randomAdd = isMobile ? 8 : (isTablet ? 12 : 16);

        for (let i = 0; i < this.count; i++) {
            const radius = baseRadius + Math.random() * randomAdd;
            const x = radius + Math.random() * (this.canvas.width - radius * 2);
            // Spawn them dispersed vertically to fall down nicely
            const y = -radius - Math.random() * this.canvas.height;
            const p = this.palette[Math.floor(Math.random() * this.palette.length)];

            this.balls.push(new Ball(
                x, y, radius, p.color, p.dark,
                this.gravity, this.friction, this.wallBounce
            ));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        const setMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            this.mouse.x = clientX - rect.left;
            this.mouse.y = clientY - rect.top;
            this.mouse.active = true;
        };

        const clearMousePos = () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.mouse.active = false;
        };

        const container = this.canvas.parentElement;
        container.addEventListener('mousemove', setMousePos);
        container.addEventListener('mouseleave', clearMousePos);

        container.addEventListener('touchstart', setMousePos, { passive: true });
        container.addEventListener('touchmove', setMousePos, { passive: true });
        container.addEventListener('touchend', clearMousePos);
    }

    resolveCollisions() {
        const len = this.balls.length;
        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                const ballA = this.balls[i];
                const ballB = this.balls[j];

                const dx = ballB.x - ballA.x;
                const dy = ballB.y - ballA.y;
                const distance = Math.hypot(dx, dy);
                const minDistance = ballA.radius + ballB.radius;

                if (distance < minDistance) {
                    const normalX = distance === 0 ? 1 : dx / distance;
                    const normalY = distance === 0 ? 0 : dy / distance;

                    // Resolve overlap
                    const overlap = minDistance - distance;
                    ballA.x -= normalX * overlap * 0.5;
                    ballA.y -= normalY * overlap * 0.5;
                    ballB.x += normalX * overlap * 0.5;
                    ballB.y += normalY * overlap * 0.5;

                    // Tangent vector
                    const tangentX = -normalY;
                    const tangentY = normalX;

                    // Project velocities
                    const v1n = ballA.vx * normalX + ballA.vy * normalY;
                    const v1t = ballA.vx * tangentX + ballA.vy * tangentY;
                    const v2n = ballB.vx * normalX + ballB.vy * normalY;
                    const v2t = ballB.vx * tangentX + ballB.vy * tangentY;

                    // 1D elastic collision
                    const m1 = ballA.mass;
                    const m2 = ballB.mass;
                    const totalMass = m1 + m2;

                    const v1nPrime = (v1n * (m1 - m2) + 2 * m2 * v2n) / totalMass;
                    const v2nPrime = (v2n * (m2 - m1) + 2 * m1 * v1n) / totalMass;

                    const restitution = Math.min(ballA.wallBounce, ballB.wallBounce);
                    ballA.vx = (v1nPrime * restitution) * normalX + v1t * tangentX;
                    ballA.vy = (v1nPrime * restitution) * normalY + v1t * tangentY;
                    ballB.vx = (v2nPrime * restitution) * normalX + v2t * tangentX;
                    ballB.vy = (v2nPrime * restitution) * normalY + v2t * tangentY;
                }
            }
        }
    }

    applyCursorForce() {
        if (!this.mouse.active || this.mouse.x === null || this.mouse.y === null) return;

        const interactionRadius = window.innerWidth < 768 ? 80 : 130;
        const pushStrength = window.innerWidth < 768 ? 0.3 : 0.6;

        this.balls.forEach(ball => {
            const dx = ball.x - this.mouse.x;
            const dy = ball.y - this.mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < interactionRadius && dist > 0) {
                const force = (interactionRadius - dist) / interactionRadius;
                ball.vx += (dx / dist) * force * pushStrength;
                ball.vy += (dy / dist) * force * pushStrength;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update physics and resolve collisions
        this.applyCursorForce();
        this.resolveCollisions();

        this.balls.forEach(ball => {
            ball.update(this.canvas.width, this.canvas.height);
            ball.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Auto-initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new BallpitSimulation('ballpit-canvas', {
        count: 100,
        gravity: 0.01,
        friction: 0.9975,
        wallBounce: 0.95
    });
});