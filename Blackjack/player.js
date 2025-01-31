class Player{
    constructor(money){
        this.money = money;
        this.hand = [];
        this.sum = [0,0];

        this.chipsValues = ["1", "5", "10", "25", "50", "100"];
        this.wallet = [10,5,3,2,2,2]; // Cantidad de fichas de cada tipo que tiene
    }



    sumCards(){
        let sum1 = 0;
        let sum2 = 0;

        this.hand.forEach((card) => {
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

        this.sum = [sum1, sum2];
    }

    // cuando el jugador es el crupier no quieres que se sumen todas las cartas al principio porque sabrias cuanto tiene
    // entonces solo sumamos la primera carta
    sumCardsCrupier(){ 
        let sum1 = 0;
        let sum2 = 0;

        const card = this.hand[0];

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
        this.sum = [sum1, sum2];
    }
}