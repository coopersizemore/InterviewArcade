import React, { useRef, useEffect } from 'react';

// You can add this font to your main index.html for the retro feel
{/* <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"> */}

const BreakoutLoadingScreen = () => {
    const canvasRef = useRef(null);

    // --- Component Styles ---
    const containerStyle = {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
    };

    const canvasStyle = {
        backgroundColor: '#000',
        display: 'block', // Prevents extra space below the canvas
    };

    const textStyle = {
        fontFamily: '"Press Start 2P", cursive',
        color: '#fff',
        marginTop: '20px',
        fontSize: '1.5rem',
        textShadow: '2px 2px #ff0000', // Red shadow for retro effect
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // --- Game Setup ---
        // Set canvas size (using a common retro resolution)
        canvas.width = 480;
        canvas.height = 320;

        // Ball properties
        let ball = {
            x: canvas.width / 2,
            y: canvas.height - 30,
            dx: 3, // speed on x-axis
            dy: -3, // speed on y-axis
            radius: 7,
        };

        // Paddle properties
        let paddle = {
            height: 10,
            width: 75,
            x: (canvas.width - 75) / 2,
        };

        // Brick properties
        const brick = {
            rowCount: 5,
            columnCount: 8,
            width: 50,
            height: 15,
            padding: 5,
            offsetTop: 30,
            offsetLeft: 30,
        };

        // Create bricks
        let bricks = [];
        for (let c = 0; c < brick.columnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brick.rowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 = intact
            }
        }
        
        // Brick colors for different rows
        const rowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF"];


        // --- Drawing Functions ---
        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.closePath();
        }

        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
        }
        
        function drawBricks() {
            for (let c = 0; c < brick.columnCount; c++) {
                for (let r = 0; r < brick.rowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        const brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
                        const brickY = r * (brick.height + brick.padding) + brick.offsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brick.width, brick.height);
                        ctx.fillStyle = rowColors[r];
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }
        
        // --- Game Logic ---
        function collisionDetection() {
            for (let c = 0; c < brick.columnCount; c++) {
                for (let r = 0; r < brick.rowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        if (
                            ball.x > b.x &&
                            ball.x < b.x + brick.width &&
                            ball.y > b.y &&
                            ball.y < b.y + brick.height
                        ) {
                            ball.dy = -ball.dy;
                            b.status = 0; // Brick is hit
                        }
                    }
                }
            }
        }
        
        // The main animation loop
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();

            // Ball wall collision logic
            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
                ball.dx = -ball.dx;
            }
            if (ball.y + ball.dy < ball.radius) {
                ball.dy = -ball.dy;
            } else if (ball.y + ball.dy > canvas.height - ball.radius) {
                // Check if it hits the paddle
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    ball.dy = -ball.dy;
                } else {
                    // If it misses the paddle, "reset" the ball to the paddle's location
                    ball.x = paddle.x + paddle.width / 2;
                    ball.y = canvas.height - 30;
                    ball.dx = 3;
                    ball.dy = -3;
                }
            }

            // Paddle "AI" - makes the paddle follow the ball
            paddle.x = ball.x - paddle.width / 2;
            
            // Clamp paddle position to stay within canvas bounds
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;


            ball.x += ball.dx;
            ball.y += ball.dy;

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        // Cleanup function to cancel the animation when the component unmounts
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div style={containerStyle}>
            <canvas ref={canvasRef} style={canvasStyle} />
            <div style={textStyle}>LOADING...</div>
        </div>
    );
};

export default BreakoutLoadingScreen;
