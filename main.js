const canvas = document.getElementById("myCanvas");
// Dimensiones
canvas.width = window.innerWidth-4;
canvas.height = window.innerHeight-4;
///canvas fondo estatico
const backgroundCanvas=document.createElement("canvas")
const backgroundCtx=backgroundCanvas.getContext("2d")
backgroundCanvas.width = canvas.width
backgroundCanvas.height= canvas.height
document.body.appendChild(backgroundCanvas)

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;



// variables


var globalTime = 0; //Variable para acceder al tiempo de la animacion desde fuera de la funcion animate

const w = canvas.width;
const h = canvas.height;

const cw = w*0.12;
const ch = cw*1.428;

money = 100;

playerPositions = [{x: w*0.5, y: h*0.8}];
deckPosition = {x: w*0.15, y: h*0.5};
crupierPosition = {x: w*0.5, y: h*0.2};

player = new Player(money);
game = new Game(canvas,backgroundCanvas, [player], w, h);
game.start();

animate();

function animate(time = 0){
    time /= 1000; // para que esté en segundos
    globalTime = time;
    
    

    ctx.clearRect(0,0,w,h);
    ctx.drawImage(game.backgroundCanvas,0,0)
    
    if(!game.isBeting){

    //Mostrar las cartas del jugador
    game.drawCardsPlayer(0); 

    // Mostrar las cartas del crupier
    game.drawCardsCrupier();

    game.run(time);
      
    // HUD
    game.drawHUD();
    }else{
        game.menu();
        
    }
    requestAnimationFrame(animate);
}

