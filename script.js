let snake=[{x:150,y:150},{x:140,y:150},{x:130,y:150},{x:120,y:150},{x:110,y:150}];

var gameCanvas=document.getElementById('game');
var ctx=gameCanvas.getContext('2d');

function clearCanvas(){
    ctx.fillStyle = 'white';
    ctx.strokestyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
let score=0;
let dx=10;
let dy=0;
main();
createFood();
document.addEventListener('keydown',changeDirection);

function drawSnakePart(snakePart){
    ctx.fillStyle='lightgreen';
    ctx.strokestyle='darkgreen';
    ctx.fillRect(snakePart.x,snakePart.y,10,10);
    ctx.strokeRect(snakePart.x,snakePart.y,10,10);
}

function drawSnake(){
    snake.forEach(drawSnakePart);
}

function changeDirection(event){
    const left_key=37;
    const right_key=39;
    const up_key=38;
    const down_key=40;
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed=event.keyCode;
    const goingUp = dy===-10; //is y already getting reduced->snake going up
    const goingDown = dy===10;
    const goingRight = dx===10;
    const goingLeft = dx===-10;
    //use the above 4 constants to prevent reversing.
    //if the snake is going right, and if left key is pressed, nothing should happen
    //if snake is made to move to left, the snake is effectively reversed
    if (keyPressed===left_key &&!goingRight){
        dx=-10;
        dy=0;
    }
    if (keyPressed===right_key && !goingLeft){
        dx=10;
        dy=0;
    }
    if (keyPressed===up_key && !goingDown){
        dx=0;
        dy=-10;
    }
    if (keyPressed===down_key && !goingUp){
        dx=0;
        dy=10;
    }
}
function advanceSnake(){ //move snake dx to move l/r, dy to move u/d
    //also check if head meets current food location. if yes, dont pop last element
    const head={x:snake[0].x+ dx, y:snake[0].y+dy};
    snake.unshift(head);//add head to front of array
    const didEatFood=snake[0].x==foodX && snake[0].y==foodY
    if (!didEatFood) snake.pop(); //remove last element if food not eaten
    else {
        createFood()
        score+=10;
        document.getElementById('score').innerHTML=score;
      }  //if eaten create new
}
//using advanceSnake()5 times will make snake jump 50px front. use delay-setTimeout
//drawSnake everytime advanceSnake is called, to show movement
//setTimeout calls a function after some number of millisec

//use recursion to call setTimeout to ensure multiple setTimeOut does not occur simultaneously(causing jump)
function main(){
    if (didGameEnd()){
        document.getElementById('score').innerHTML='Game Over!';
        return;
    } 
    setTimeout(function onTick(){
        changingDirection=false;
        clearCanvas(); //to remove previous drawing
        drawFood();
        advanceSnake(); //update location
        drawSnake(); //draw snake in current position
        main();
    },100);
}
//recursive main, for every 100 ms, the 3 functions are called and main is called recursively
//infinite recursive call

function randomTen(min,max){
    return Math.round((Math.random()*(max-min)+min)/10)*10;
    //random gives number between 0 and 1 (1 excluded)
    //round to get integer location
}

function createFood(){
    foodX=randomTen(0,gameCanvas.width-10);
    foodY=randomTen(0,gameCanvas.height-10);
    snake.forEach(function isFoodOnSnake(part){ //see if the generated food location is on the snaks's current position
        const foodIsOnSnake= part.x== foodX && part.y ==foodY; 
        if (foodIsOnSnake) createFood(); //if yes, gen new location
    });
}

function drawFood(){
    ctx.fillStyle='red';
    ctx.strokestyle='darkred'
    ctx.fillRect(foodX,foodY,10,10);
    ctx.strokeRect(foodX,foodY,10,10);
}

function didGameEnd(){
    for (let i=4; i<snake.length; i++){ //head cannot touch first 3 parts
        if (snake[0].x==snake[i].x && snake[0].y==snake[i].y) return true;
    }
    
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}