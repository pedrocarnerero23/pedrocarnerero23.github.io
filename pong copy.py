import pygame
from player import Player
from ball import Ball

# Inicializar Pygame
pygame.init()

# Definir colores
BLANCO = (255, 255, 255)
NEGRO = (0, 0, 0)

# Configurar la pantalla
ANCHO = 800
ALTO = 600
pantalla = pygame.display.set_mode((ANCHO, ALTO))
pygame.display.set_caption("PONG AI")

pantalla_con_alpha = pygame.Surface((ANCHO, ALTO), pygame.SRCALPHA)

# Definir las palas
PALA_ANCHO = 15
PALA_ALTO = 100

pala_izquierda = Player(50, ALTO // 2, PALA_ANCHO, PALA_ALTO, 1,("PLAYER", "LEFT"))
pala_derecha = Player(ANCHO - 50, ALTO // 2, PALA_ANCHO, PALA_ALTO, 1, ("PLAYER", "RIGHT"))

# Paredes:
player_collisions = {
    pygame.Rect(0, -PALA_ANCHO, ANCHO, PALA_ANCHO): "TOP",
    pygame.Rect(0, ALTO, ANCHO, PALA_ANCHO): "BOTTOM"
}

# Definir la pelota
PELOTA_RADIO = 10
pelota = Ball(ANCHO // 2, ALTO // 2, 5, 0, PELOTA_RADIO)

# Objetos con los que la pelota interactua:
ball_collisions = {
    pygame.Rect(0, -PALA_ANCHO, ANCHO, PALA_ANCHO): "TOP",
    pygame.Rect(0, ALTO, ANCHO, PALA_ANCHO): "BOTTOM",
    pala_izquierda.rect: "LEFT_PLAYER",
    pala_derecha.rect: "RIGHT_PLAYER",
    pygame.Rect(-PALA_ANCHO, 0, PALA_ANCHO, ALTO): "GOAL_LEFT",
    pygame.Rect(ANCHO, 0, PALA_ANCHO, ALTO): "GOAL_RIGHT"
}

# Variables de puntuación
puntos_izquierda = 0
puntos_derecha = 0

TAMAÑO_ESTELA = 15

# Fuente para mostrar los puntos
fuente = pygame.font.Font(None, 36)

# Función para mostrar los puntos
def mostrar_puntos():
    texto = fuente.render(f"{puntos_izquierda} - {puntos_derecha}", True, BLANCO)
    pantalla.blit(texto, (ANCHO // 2 - texto.get_width() // 2, 20))


# Lista para almacenar posiciones de la pelota (para la estela)
estela_pelota = []

# Bucle principal del juego
reloj = pygame.time.Clock()
running = True
fps = 60
dt = 1/fps

while running:

    # -------------------------------- LÓGICA --------------------------------------------
    # Manejar eventos
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            running = False

    # Movimiento de las palas
    keys = pygame.key.get_pressed()
    pala_izquierda.handle_input(keys)
    pala_derecha.handle_input(keys)

    # Movimiento de la pelota
    pelota.update(dt)
    pala_derecha.update(dt)
    pala_izquierda.update(dt)

    # Comprobar colisiones
    pala_izquierda.handle_collision(player_collisions)
    pala_derecha.handle_collision(player_collisions)

    pelota.handle_collision(ball_collisions)

    # Añadir la posición actual de la pelota a la estela
    estela_pelota.append(pelota.center)

    # Limitar el número de puntos en la estela para no acumular demasiados
    if len(estela_pelota) > TAMAÑO_ESTELA:
        estela_pelota.pop(0)

    # Verificar si es gol:
    if pelota.is_goal == "GOAL_LEFT":  # Puntos para la pala derecha
        puntos_derecha += 1
        pelota = Ball(ANCHO // 2, ALTO // 2, -5, 0, PELOTA_RADIO)
        
    elif pelota.is_goal == "GOAL_RIGHT":  # Puntos para la pala izquierda
        puntos_izquierda += 1
        pelota = Ball(ANCHO // 2, ALTO // 2, 5, 0, PELOTA_RADIO)

    

    # ------------------- LIMPIAR PANTALLA ---------------------------------
    pantalla.fill(NEGRO)
    pantalla_con_alpha.fill(NEGRO)



    # ------------------------- DIBUJAR ------------------------------------
    for i, pos in enumerate(estela_pelota):
        alpha = max(0, pygame.math.lerp(0, 255, i/(TAMAÑO_ESTELA-1)))  
        pygame.draw.circle(pantalla_con_alpha, pygame.Color(255,255,255,int(alpha)), pos, PELOTA_RADIO)

    
    pantalla.blit(pantalla_con_alpha, (0, 0))

    # Dibujar las palas y la pelota
    pygame.draw.rect(pantalla, BLANCO, pala_izquierda)
    pygame.draw.rect(pantalla, BLANCO, pala_derecha)
    pygame.draw.ellipse(pantalla, BLANCO, pelota)
    pygame.draw.circle(pantalla, BLANCO, (ANCHO // 2, ALTO // 2), 70, 1)  # Círculo central

    # Mostrar los puntos
    mostrar_puntos()

    # Actualizar la pantalla
    pygame.display.flip()

    # Establecer la velocidad del juego (FPS)
    reloj.tick(60)

# Finalizar Pygame
pygame.quit()
