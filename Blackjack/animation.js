class AnimationProperty{
    constructor(startTime, duration, from, to, easing = "linear"){
        this.startTime = startTime;
        this.duration = duration;
        this.from = from;
        this.to = to;
        this.finished = false;
        this.easing = getEasing(easing);
    }

    updateFinished(time){
        if(Math.abs(time-this.startTime) >= this.duration){
            this.finished = true;
        }
    }

    animate(time){
        const percent = this.easing((time-this.startTime) / this.duration) //con las comprobaciones que hemos hecho es un numero entre 0,1
        return(lerp(percent, this.from, this.to));
    }
}

class MoveAnimation{
    constructor(sprite, spriteWidth, spriteHeight, startTime, duration, from, to, easing, callBack){
        this.sprite = sprite;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;

        this.animationX = new AnimationProperty(startTime, duration, from.x, to.x, easing);
        this.animationY = new AnimationProperty(startTime, duration, from.y, to.y, easing);
        this.finished = false;
        this.callBack = callBack;
    }

    updateFinished(time){
        this.animationX.updateFinished(time);
        this.animationY.updateFinished(time);

        if(this.animationX.finished || this.animationY.finished){
            this.finished = true;
            this.callBack();
        }
    }

    animate(time){
        return {x: this.animationX.animate(time), y: this.animationY.animate(time)}
    }
}

class AnimationManager{
    constructor(ctx){
        this.ctx = ctx;
        this.animations = [];
    }

    addAnimation(animation){
        this.animations.push(animation);
    }

    // Quitamos las animaciones que hayan acabado
    filterAnimations(time){
        // Primero actualizamos para ver si alguna ha acabado ya
        this.animations.forEach(animation => animation.updateFinished(time));

        // Luego quitamos las que hayan acabado
        for (let i = 0; i < this.animations.length ; i++) {
            if (this.animations[i].finished) {
                this.animations.splice(i, 1);
            }
        }
    }

    runAnimations(time){
        // Primero eliminamos aquellas que hayan acabado
        this.filterAnimations(time);
        // Ahora calculamos las animaciones y las dibujamos
        for(const animation of this.animations){
            const newPosition = animation.animate(time);
            
            this.ctx.drawImage(animation.sprite,
                newPosition.x - animation.spriteWidth * 0.5,
                newPosition.y - animation.spriteHeight * 0.5,
                animation.spriteWidth,
                animation.spriteHeight);
        }
    }
}

function lerp(t, A, B){
    return A + t*(B-A);
}

function getEasing(easing){
    switch(easing){
        case 'linear':
            return linear;
        case 'easeIn':
            return easeIn;
        case 'easeOut':
            return easeOut;
        case 'easeInOut':
            return easeInOut;
        case 'bounce':
            return bounce;
        default:
            return linear;
    }
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

