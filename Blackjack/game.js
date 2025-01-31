class Game{
    constructor(canvas,backgroundCanvas, players, screenWidth, screenHeight){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.backgroundCanvas=backgroundCanvas;
        this.backgroundCtx=this.backgroundCanvas.getContext("2d");
        this.backgroundCtx.imageSmoothingEnabled=false;
        this.players = players;
        this.deck = new Deck();
        this.crupier = new Player(100);

        this.time = 0;

        // Event listeners
        this.canvas.addEventListener('mousemove', (event) => {
            const x = event.offsetX;
            const y = event.offsetY;

            // Comprobamos si está sobre el mazo
            if(Math.abs(x-(this.deckPosition.x - 4 * 0.25 * this.deck.length)) < cw/2
            && Math.abs(y-(this.deckPosition.y - 5 * 0.25 * this.deck.length)) < ch/2){
                this.isMouseOnDeck = true;
            } else {
                this.isMouseOnDeck = false;
            }

            // Comprobamos si está sobre alguna ficha
        });

        this.canvas.addEventListener('click', () => { 
            if(this.isTurnPlayers && !this.isDealingPlayer && this.isMouseOnDeck && this.deck.length > 0){
                this.givePlayerCard(0);

                this.isDealingPlayer = true;
                const amountCards = this.players[0].hand.length;

                this.animationManager.addAnimation(new MoveAnimation(
                    this.cardBackImg, this.cw, this.ch,
                    this.time, 1,
                    {
                        x: this.deckPosition.x - 4 * 0.25 * this.deck.length,
                        y: this.deckPosition.y - 5 * 0.25 * this.deck.length
                    },
                    {
                        x: this.playersPositions[0].x + (amountCards - (amountCards-1)/2) * this.cw * 0.5,
                        y: this.playersPositions[0].y
                    },
                    "easeInOut",
                    () => { // callBack
                        this.isPlayerDealt = true;
                        this.isDealingPlayer = false;
                        // Sumamos las cartas del jugador para mostrarlo
                        this.players.forEach((player) => player.sumCards());
                    }
                    )
                );           
            }
        });

        canvas.addEventListener('contextmenu', (event) => {
            if(this.isTurnPlayers && !this.isDealingPlayer && this.isMouseOnDeck){
                event.preventDefault();
                this.isTurnPlayers = false;
            }
        });

        // Constantes de dibujado
        this.w = screenWidth;
        this.h = screenHeight;
        this.cw = w*0.12;
        this.ch = cw*1.428;

        // Posiciones
        this.playersPositions = [{x: this.w*0.5, y: this.h*0.8}];
        this.crupierPosition = {x: this.w*0.5, y: this.h*0.2};
        this.deckPosition = {x: this.w*0.15, y: this.h*0.5};

        // Variables de estado
        this.isMouseOnDeck;
        this.startDealingTime;
        this.durationDealingTime;

        this.isDealingPlayer = true;
        this.isPlayerDealt = false;

        this.isDealingCrupier = true;
        this.isCrupierDealt = false;

        this.isTurnPlayers = true;
        this.isBeting= false;

        

        // Imagenes para cargar
        this.cardBackImg = new Image();
        this.cardBackImg.src = "Assets/kenney_playing-cards-pack/PNG/Cards (large)/card_back.png";
        this.cardBackImg.onload = () =>{
            this.drawbackGround();
        };

        this.cardBlankImg = new Image();
        this.cardBlankImg.src = "Assets/kenney_playing-cards-pack/PNG/Cards (large)/card_empty.png";

        this.dieUpImg = new Image();
        this.dieUpImg.src = "Assets/kenney_playing-cards-pack/PNG/die_up.png";

        this.dieDownImg = new Image();
        this.dieDownImg.src = "Assets/kenney_playing-cards-pack/PNG/die_down.png";

        this.chip1Img = new Image();
        this.chip1Img.src = "Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_1.png";

        this.chip5Img = new Image();
        this.chip5Img.src = "Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_5.png";

        this.chip10Img = new Image();
        this.chip10Img.src = "Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_10.png";

        this.chip25Img = new Image();
        this.chip25Img.src = "Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_25.png";

        this.chip50Img = new Image();
        this.chip50Img.src = "Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_50.png";

        this.chip100Img = new Image();
        this.chip100Img.src = "Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_100.png";

        this.chipsSprites = [this.chip1Img, this.chip5Img, this.chip10Img, this.chip25Img, this.chip50Img, this.chip100Img];
        this.chipsValues = ["1", "5", "10", "25", "50", "100"];

        //Este objeto se encarga de correr las animaciones
        this.animationManager = new AnimationManager(this.ctx);

        if (!this.oscillationLUT) {
            this.oscillationLUT = [];
            const numSamples = 100; // Ajusta el número de muestras
            for (let i = 0; i < numSamples; i++) {
                this.oscillationLUT.push(Math.sin((i / numSamples) * Math.PI * 2));
            }
        }
    }

    start(){
       
        this.deck.shuffle();
        for(let i = 0 ; i < this.players.length ; i++){
            // añadir las dos cartas a los jugadores
            this.givePlayerCard(i);
            this.givePlayerCard(i);
        }

        // Le damos dos cartas al crupier
        this.crupier.hand.push(this.deck.deal());
        this.crupier.hand.push(this.deck.deal());

        // Añadimos las animaciones de entregar carta al jugador al animation manager
        const amountCards = this.players[0].hand.length;
        this.animationManager.addAnimation(
            new MoveAnimation(this.cardBackImg, this.cw, this.ch,
                0, 1,
                {
                    x: this.deckPosition.x - 4 * 0.25 * this.deck.length,
                    y: this.deckPosition.y - 5 * 0.25 * this.deck.length
                },
                {
                    x: this.playersPositions[0].x + this.cw * 0.25,
                    y: this.playersPositions[0].y
                },
                "easeInOut",
                () => {
                    this.isPlayerDealt = true;
                    this.isDealingPlayer = false;
                    this.players.forEach((player) => player.sumCards());
                }
            )
        );

        this.animationManager.addAnimation(
            new MoveAnimation(this.cardBackImg, this.cw, this.ch,
                0, 1,
                {
                    x: this.deckPosition.x - 4 * 0.25 * this.deck.length,
                    y: this.deckPosition.y - 5 * 0.25 * this.deck.length
                },
                {
                    x: this.playersPositions[0].x - this.cw * 0.25,
                    y: this.playersPositions[0].y
                },
                "easeInOut",
                () => {
                    this.isPlayerDealt = true;
                    this.isDealingPlayer = false;
                    this.players.forEach((player) => player.sumCards());
                }
            )
        ); 

        // y estas son las animaciones para el crupier
        this.animationManager.addAnimation(
            new MoveAnimation(this.cardBackImg, this.cw, this.ch,
                0, 1,
                {
                    x: this.deckPosition.x - 4 * 0.25 * this.deck.length,
                    y: this.deckPosition.y - 5 * 0.25 * this.deck.length
                },
                {
                    x: this.crupierPosition.x + this.cw * 0.25,
                    y: this.crupierPosition.y
                },
                "easeInOut",
                () => {
                    this.isCrupierDealt = true;
                    this.isDealingCrupier = false;
                }
            )
        );

        this.animationManager.addAnimation(
            new MoveAnimation(this.cardBackImg, this.cw, this.ch,
                0, 1,
                {
                    x: this.deckPosition.x - 4 * 0.25 * this.deck.length,
                    y: this.deckPosition.y - 5 * 0.25 * this.deck.length
                },
                {
                    x: this.crupierPosition.x - this.cw * 0.25,
                    y: this.crupierPosition.y
                },
                "easeInOut",
                () => {
                    this.iscrupierDealt = true;
                    this.isDealingCrupier = false;
                    this.crupier.sumCardsCrupier();
                }
            )
        );
    }

    run(time){
        this.time = time;
        this.animationManager.runAnimations(time);
        

        if(!this.isTurnPlayers && !this.isDealingCrupier){ // Lógica del crupier
            this.crupier.sumCards();
            if(this.crupier.sum[1] <= 16||(this.crupier.sum[1]>21&&this.crupier.sum[0]<=16)){ // Si la suma mayor es menor o igual que 16 el crupier pide carta
                this.giveCrupierCard();
                
                this.isDealingCrupier = true;

                const amountCards = this.crupier.hand.length;

                this.animationManager.addAnimation((new MoveAnimation(
                    this.cardBackImg, this.cw, this.ch,
                    this.time, 1,
                    {
                        x: this.deckPosition.x - 4 * 0.25 * this.deck.length,
                        y: this.deckPosition.y - 5 * 0.25 * this.deck.length
                    },
                    {
                        x: this.crupierPosition.x + (amountCards - (amountCards-1)/2) * this.cw * 0.5,
                        y: this.crupierPosition.y
                    },
                    "easeInOut",
                    () => {
                        this.isCrupierDealt = true;
                        this.isDealingCrupier = false;
                        this.crupier.sumCards();
                        this.crupier.sum[0] -= this.crupier.hand[1];
                    }
                )));
            } else {
                console.log(`Crupier se planta con ${this.crupier.sum[0]}/${this.crupier.sum[1]}`);
            }
        }
    }

    drawPlayMat(){
        this.backgroundCtx.lineWidth = 5;
        this.backgroundCtx.strokeStyle = "white";
        this.backgroundCtx.lineCap = "round";
        this.backgroundCtx.setLineDash([10,15]);

        this.backgroundCtx.strokeRect(this.w*0.5-this.cw*0.5,this.h*0.2-this.ch*0.5,this.cw,this.ch);

        this.backgroundCtx.strokeRect(this.w*0.5-this.cw*0.5,this.h*0.8-this.ch*0.5,this.cw,this.ch);

        this.backgroundCtx.setLineDash([]);
        this.backgroundCtx.moveTo(this.w*0.20, this.h*0.2);
        this.backgroundCtx.bezierCurveTo(this.w*0.33, this.h*0.5,
            this.w*0.66, this.h*0.5,
            this.w*0.80, this.h*0.2);
        this.backgroundCtx.stroke();
    }

    drawDeck(){
        for(let i = 0; i < this.deck.length * 0.25 ; i++){
            this.backgroundCtx.drawImage(this.cardBackImg,
                this.deckPosition.x - this.cw/2 - 4*i, this.deckPosition.y-this.ch/2 - 5*i, this.cw, this.ch);
        }
    }

    drawbackGround(){
        
        this.backgroundCtx.clearRect(0,0,this.backgroundCanvas.width,this.backgroundCanvas.height);
        this.drawPlayMat();
        
        this.drawDeck();
    }

    drawCardsPlayer(id){
        if(this.players[id].hand.length > 0 && this.isPlayerDealt){
            const amountCards = this.players[id].hand.length;
            if(this.isDealingPlayer){
                for(let i = 0 ; i < amountCards-1 ; i++){
                    const card = this.players[id].hand[i];
                    const j = i-(amountCards-1)/2;
                    card.draw(this.ctx, this.playersPositions[id].x + j*this.cw/2, this.playersPositions[id].y, this.cw, this.ch);
    
                }
            } else {
                for(let i = 0 ; i < amountCards ; i++){
                    const card = this.players[id].hand[i];
                    const j = i-(amountCards-1)/2;
                    card.draw(this.ctx, this.playersPositions[id].x + j*this.cw/2, this.playersPositions[id].y, this.cw, this.ch);
                }
            }
        } 
    }

    drawCardsCrupier(){
        if(this.crupier.hand.length > 0 && this.isCrupierDealt){
            if(this.isTurnPlayers){
                // Mostramos una carta boca arriba y otra boca abajo
                this.#drawBackCard(this.crupierPosition.x + this.cw*0.25, this.crupierPosition.y, this.cw, this.ch);
                this.crupier.hand[0].draw(this.ctx, this.crupierPosition.x - this.cw*0.25, this.crupierPosition.y, this.cw, this.ch);
            } else {
                const amountCards = this.crupier.hand.length;
                if(this.isDealingCrupier){
                    for(let i = 0 ; i < amountCards-1 ; i++){
                        const card = this.crupier.hand[i];
                        const j = i-(amountCards-1)/2;
                        card.draw(this.ctx,
                            this.crupierPosition.x + j*this.cw/2,
                            this.crupierPosition.y, 
                            this.cw, this.ch);
        
                    }
                } else {
                    for(let i = 0 ; i < amountCards ; i++){
                        const card = this.crupier.hand[i];
                        const j = i-(amountCards-1)/2;
                        card.draw(this.ctx,
                            this.crupierPosition.x + j*this.cw/2,
                            this.crupierPosition.y, this.cw, this.ch);
                    }
                }
            }
        }
    }

    drawHUD(){
        if(this.isMouseOnDeck){
            if(this.isTurnPlayers){
                this.ctx.save();
                //ctx.strokeStyle = `rgba(255,255,255,${Math.cos(time)**2})`;
    
                this.ctx.lineCap = "round";
                this.ctx.lineDashOffset = -this.time*10;
                this.ctx.setLineDash([this.cw*0.1,this.cw*0.1]);
    
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 5;
                this.ctx.strokeRect(
                    this.deckPosition.x - 4 * 0.25 * this.deck.length - this.cw/2,
                    this.deckPosition.y - 5 * 0.25 * this.deck.length - this.ch/2,
                    this.cw, this.ch
                );
    
                this.ctx.strokeStyle = "white";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    this.deckPosition.x - 4 * 0.25 * this.deck.length - this.cw/2,
                    this.deckPosition.y - 5 * 0.25 * this.deck.length - this.ch/2,
                    this.cw, this.ch
                ); 
    
                this.ctx.font = "40px 'Square'";        
                this.ctx.fillStyle = "green";          
                this.ctx.textAlign = "center";         
                this.ctx.textBaseline = "middle"; 
                
                this.ctx.fillText("HIT!",
                    this.deckPosition.x - 4 * 0.25 * this.deck.length,
                    this.deckPosition.y - 5 * 0.25 * this.deck.length);
                
                this.ctx.font = "40px 'Square out'";  
                this.ctx.fillStyle = "black";      
                this.ctx.fillText("HIT!",
                    this.deckPosition.x - 4 * 0.25 * this.deck.length,
                    this.deckPosition.y - 5 * 0.25 * this.deck.length);
    
                this.ctx.restore();
    
            } else {
                this.ctx.save();
                this.ctx.lineCap = "round";
                //this.ctx.globalAlpha = Math.cos(this.time)**2;
                const colors = ["#ff0000", "#660000"];
                const strokeWidths = [8,5];
                for(let i = 0 ; i<2 ; i++){
                    this.ctx.strokeStyle = colors[i];
                    this.ctx.lineWidth = strokeWidths[i];
                    //Hacemos el marco
                    this.ctx.strokeRect(
                        this.deckPosition.x - 4 * 0.25 * this.deck.length - this.cw/2,
                        this.deckPosition.y - 5 * 0.25 * this.deck.length - this.ch/2,
                        this.cw, this.ch
                    ); 
                    //Hacemos la cruz
                    this.ctx.beginPath();
                    this.ctx.moveTo(
                        this.deckPosition.x - 4 * 0.25 * this.deck.length - this.cw/2,
                        this.deckPosition.y - 5 * 0.25 * this.deck.length - this.ch/2
                    );
                    this.ctx.lineTo(
                        this.deckPosition.x - 4 * 0.25 * this.deck.length + this.cw/2,
                        this.deckPosition.y - 5 * 0.25 * this.deck.length + this.ch/2
                    );
                    this.ctx.moveTo(
                        this.deckPosition.x - 4 * 0.25 * this.deck.length - this.cw/2,
                        this.deckPosition.y - 5 * 0.25 * this.deck.length + this.ch/2
                    );
                    this.ctx.lineTo(
                        this.deckPosition.x - 4 * 0.25 * this.deck.length + this.cw/2,
                        this.deckPosition.y - 5 * 0.25 * this.deck.length - this.ch/2
                    );
                    this.ctx.stroke(); 
                }
                this.ctx.restore();
            }
        }

        // Escribimos cuanto da la suma
        
        const amountCardsPlayer = this.players[0].hand.length;
        const PlayerScoreXPosition = this.playersPositions[0].x + 
            (amountCardsPlayer + 2 - (amountCardsPlayer+1)/2) * this.cw * 0.5;
        this.ctx.save();
        this.ctx.translate(PlayerScoreXPosition, this.h*0.8);
        this.ctx.rotate(Math.PI/2);
        this.ctx.scale(0.67,0.67);
        this.#drawBlankCard(0,0);
        this.ctx.restore();

        this.ctx.font = "40px 'Square'";        
        this.ctx.fillStyle = "black";          
        this.ctx.textAlign = "center";         
        this.ctx.textBaseline = "middle"; 
        
        this.ctx.fillText(`${this.players[0].sum[0]}/${this.players[0].sum[1]}`,
            Math.round(PlayerScoreXPosition), Math.round(this.h*0.8)); 

        const amountCardsCrupier = this.crupier.hand.length;
        const crupierScoreXPosition = this.crupierPosition.x + 
            (amountCardsCrupier + 2 - (amountCardsCrupier+1)/2) * this.cw * 0.5;
        this.ctx.save();
        this.ctx.translate(crupierScoreXPosition, this.h*0.2);
        this.ctx.rotate(Math.PI/2);
        this.ctx.scale(0.67,0.67);
        this.#drawBlankCard(0,0);
        this.ctx.restore();

        this.ctx.font = "40px 'Square'";        
        this.ctx.fillStyle = "black";          
        this.ctx.textAlign = "center";         
        this.ctx.textBaseline = "middle"; 
        
        this.ctx.fillText(`${this.crupier.sum[0]}/${this.crupier.sum[1]}`,
            Math.round(crupierScoreXPosition), Math.round(this.h*0.2)); 
        
        
        // DADOS PARA INDICAR DE QUIEN ES EL TURNO
        /*const diceSize = this.cw*0.4;

        const relativeTime = this.time % (2 * Math.PI); // O el período que necesites
        const oscillation = Math.sin(relativeTime);
        const displacement = lerp((oscillation + 1) * 0.5, -diceSize * 0.33, diceSize * 0.33);

        
        

        const spriteDie = this.isTurnPlayers ? this.dieDownImg : this.dieUpImg;
    
        this.ctx.drawImage(spriteDie,
        this.w*0.4 - diceSize*0.5, this.h*0.5 - diceSize*0.5 + displacement,
        diceSize, diceSize);
        this.ctx.drawImage(spriteDie,
        this.w*0.6 - diceSize*0.5, this.h*0.5 - diceSize*0.5 + displacement,
        diceSize, diceSize); */
      

        // Pintamos las fichas para apostar
        const sizeChip = this.w * 0.35 / this.chipsSprites.length;
        this.ctx.font = `${sizeChip*0.5}px 'Square out'`;        
        this.ctx.fillStyle = "black";          
        this.ctx.textAlign = "center";         
        this.ctx.textBaseline = "middle";
        for(let i = 0 ; i < this.chipsSprites.length ; i++){
            const xPosition = lerp(i/(this.chipsSprites.length - 1), this.w*0.05, this.w*0.35)
            for(let j = 0 ; j < this.players[0].wallet[i] ; j++){
                this.ctx.drawImage(this.chipsSprites[i],
                    xPosition - sizeChip * 0.5,
                    this.h * 0.9 - j * sizeChip * 0.15 - sizeChip * 0.5,
                    sizeChip,
                    sizeChip
                );
            }
            this.ctx.fillText(this.chipsValues[i],
                xPosition,
                this.h * 0.9 - (this.players[0].wallet[i] - 1)* sizeChip * 0.15);
        }
    }

    #drawBackCard(x,y){
        this.ctx.drawImage(this.cardBackImg,
            x-this.cw/2, y-this.ch/2, this.cw, this.ch);
    }

    #drawBlankCard(x,y){
        this.ctx.drawImage(this.cardBlankImg,
            x-this.cw/2, y-this.ch/2, this.cw, this.ch);
    }

    givePlayerCard(id){
        this.players[id].hand.push(this.deck.deal());
    }

    giveCrupierCard(){
        this.crupier.hand.push(this.deck.deal());
    }

    countCards(id){
        let sum1 = 0;
        let sum2 = 0;

        this.players[id].hand.forEach((card) => {
            if(card.number == 1){
                sum1 += 1;
                sum2 += 11;
            } else if(card.number == 11 || card.number == 12 || card.number == 13){
                sum1 += 10;
                sum2 += 10;
            } else {
                sum1 += card.number;
                sum2 += card.number;
            }
        });

        return [sum1, sum2];
    }
    menu(){
        this.ctx.fillStyle="rgba(50,50,50,0.9)";
        this.ctx.fillRect(0,0,this.w,this.h);
        this.ctx.font = `60px 'Square'`;        
        this.ctx.fillStyle = "white";          
        this.ctx.textAlign = "center";         
        this.ctx.textBaseline = "middle";
        this.ctx.fillText('BET!',this.w/2,this.h/2);
        
        // Pintamos las fichas para apostar
        const sizeChip = this.w * 0.35 / this.chipsSprites.length;
        this.ctx.font = `${sizeChip*0.5}px 'Square out'`;        
        this.ctx.fillStyle = "black";          
        this.ctx.textAlign = "center";         
        this.ctx.textBaseline = "middle";
        for(let i = 0 ; i < this.chipsSprites.length ; i++){
            const xPosition = lerp(i/(this.chipsSprites.length - 1), this.w*0.33, this.w*0.66)
            for(let j = 0 ; j < this.players[0].wallet[i] ; j++){
                this.ctx.drawImage(this.chipsSprites[i],
                    xPosition - sizeChip * 0.5,
                    this.h * 0.9 - j * sizeChip * 0.15 - sizeChip * 0.5,
                    sizeChip,
                    sizeChip
                );
            }
            this.ctx.fillText(this.chipsValues[i],
                xPosition,
                this.h * 0.9 - (this.players[0].wallet[i] - 1)* sizeChip * 0.15);
        }
    
    }
}

function lerp(t, A, B){
    return A + t*(B-A);
}

function linear(t) {
    return t;
}

function easeIn(t) {
    return t * t;
}

function easeOut(t) {
    return 1 - Math.pow(1 - t, 2);
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function bounce(t) {
    if (t < (1 / 2.75)) {
        return 7.5625 * t * t;
    } else if (t < (2 / 2.75)) {
        return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
    } else if (t < (2.5 / 2.75)) {
        return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
    } else {
        return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
    }
}

