class Deck extends Array{
    constructor(){
        super();
        for(let i = 0 ; i < 4 ; i++){
            for(let j = 1 ; j < 14 ; j++){
                this.push(new Card(j,i));
            }
        }
    }

    swap(i, j){
        const aux = this[i];
        this[i] = this[j];
        this[j] = aux;
    }

    shuffle(amount = 5){
        for(let i = 0 ; i < amount ; i++){
            for(let index = 0 ; index < this.length ; index++){
                const newPosition = Math.floor(Math.random() * this.length);
                this.swap(index,newPosition);
            }
        }
    }

    deal(){
        return this.pop();
    }
    
}