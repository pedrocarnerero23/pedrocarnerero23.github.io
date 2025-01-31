class Card{
    constructor(number, suit){
        this.number = number;
        this.suit = suit;

        this.suits = ["hearts", "diamonds", "clubs", "spades"];
        
        this.value;
        switch (this.number){
            case 1:
                this.value = "A";
                break;
            case 11:
                this.value = "J";
                break;
            case 12:
                this.value = "Q";
                break;
            case 13:
                this.value = "K";
                break;
            default:
                this.value = this.number;
                break;
        }

        this.sprite = new Image();
        this.sprite.src = this.value == "A" || this.value == "J" || this.value == "Q" || this.value == "K" || this.value == "10" ?
        `Assets/kenney_playing-cards-pack/PNG/Cards (large)/card_${this.suits[suit]}_${this.value}.png`:
        `Assets/kenney_playing-cards-pack/PNG/Cards (large)/card_${this.suits[suit]}_0${this.value}.png`
    }

    show(){
        let suit = this.suits[this.suit];

        console.log(`${value} of ${suit}`);
    }

    draw(ctx, x, y, cw, ch){
        if(this.sprite.complete){
            ctx.drawImage(this.sprite,
                x-cw/2, y-ch/2, cw, ch);
        }
    }
}

class BackCard{
    constructor(){
        this.sprite = new Image();
        this.sprite.src = "Assets/kenney_playing-cards-pack/PNG/Cards (large)/card_back.png";
    }

    draw(ctx, x, y, cw, ch){
        if(this.sprite.complete){
            ctx.drawImage(this.sprite,
                x-cw/2, y-ch/2, cw, ch);
        }
    }
}