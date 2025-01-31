


function soundCoins() {
    // Crear el objeto de audio
    var audio = new Audio('sounds/sound_coins.mp3');
    
   
    audio.play().catch(function(error) {
        console.log("Error al intentar reproducir el audio: ", error);
    });
}
