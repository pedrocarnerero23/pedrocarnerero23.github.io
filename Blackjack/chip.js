class Chip{
    constructor(value){
        this.value = value;
        this.sprite = new Image();
        this.sprite.src = `Assets/SBS - 2D Poker Pack/Top-Down/Chips/chip_${value}.png`;
    }

    draw(ctx, x, y, size){
        ctx.font = `${size*0.5}px 'Square out'`;        
        ctx.fillStyle = "black";          
        ctx.textAlign = "center";         
        ctx.textBaseline = "middle"; 
        ctx.drawImage(this.sprite, x - this.sprite.width * 0.5, y - this.sprite.height * 0.5, size, size);
        //ctx.fillText(this.value.toString(),x,y);
    }
}