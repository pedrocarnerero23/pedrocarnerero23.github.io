import pygame

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

pala_izquierda = pygame.Rect(50, ALTO // 2 - PALA_ALTO // 2, PALA_ANCHO, PALA_ALTO)
pala_derecha = pygame.Rect(ANCHO - 50 - PALA_ANCHO, ALTO // 2 - PALA_ALTO // 2, PALA_ANCHO, PALA_ALTO)

# Definir la pelota
PELOTA_RADIO = 10
pelota = pygame.Rect(ANCHO // 2 - PELOTA_RADIO, ALTO // 2 - PELOTA_RADIO, PELOTA_RADIO * 2, PELOTA_RADIO * 2)
pelota_dx = 5
pelota_dy = 0
spin = 0
spin_max = 0

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
juego_activado = True

izq_vel = 5
der_vel = 5

# Función lerp (interpolación lineal) en caso de que pygame.math.lerp no esté disponible
def lerp(a, b, t):
    return a + (b - a) * t

while juego_activado:
    # Manejar eventos
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            juego_activado = False

    # Guardar posición anterior para calcular velocidad de la pala
    pala_izq_anterior = pala_izquierda.y
    pala_der_anterior = pala_derecha.y

    # Movimiento de las palas
    teclas = pygame.key.get_pressed()
    if teclas[pygame.K_w] and pala_izquierda.top > 0:
        pala_izquierda.y -= izq_vel  # Mover hacia arriba
    if teclas[pygame.K_s] and pala_izquierda.bottom < ALTO:
        pala_izquierda.y += izq_vel  # Mover hacia abajo

    if teclas[pygame.K_UP] and pala_derecha.top > 0:
        pala_derecha.y -= der_vel  # Mover hacia arriba
    if teclas[pygame.K_DOWN] and pala_derecha.bottom < ALTO:
        pala_derecha.y += der_vel  # Mover hacia abajo

    # Calcular velocidad de las palas (diferencia de posición)
    velocidad_pala_izq = pala_izquierda.y - pala_izq_anterior
    velocidad_pala_der = pala_derecha.y - pala_der_anterior

    # **Aceleración de la bola**
    # Incrementamos gradualmente la velocidad de la pelota
    aceleracion_factor = 1.0005
    pelota_dx *= aceleracion_factor
    pelota_dy *= aceleracion_factor

    # Movimiento de la pelota
    pelota.x += pelota_dx
    pelota.y += pelota_dy - spin

    # Actualizar spin usando interpolación lineal
    # Si pygame.math.lerp no funciona, puedes usar la función 'lerp' definida arriba:
    spin = pygame.math.lerp(spin, spin_max, 0.02)
    # spin = lerp(spin, spin_max, 0.02)

    # Añadir la posición actual de la pelota a la estela
    estela_pelota.append(pelota.center)

    # Limitar el número de puntos en la estela para no acumular demasiados
    if len(estela_pelota) > TAMAÑO_ESTELA:
        estela_pelota.pop(0)

    # Rebote de la pelota en las paredes
    if pelota.top < 0:
        pelota_dy = -pelota_dy
        pelota.top = 0

    if pelota.bottom > ALTO:
        pelota_dy = -pelota_dy  
        pelota.bottom = ALTO

    if pelota.colliderect(pala_izquierda):
        spin = 0
        pelota_dx = abs(pelota_dx)  # Siempre mover hacia la derecha
        pelota_dy = (pelota.centery - pala_izquierda.centery) / (PALA_ALTO / 2) * 5 
        spin_max = velocidad_pala_izq * 1.3

    if pelota.colliderect(pala_derecha):
        spin = 0
        pelota_dx = -abs(pelota_dx)  # Siempre mover hacia la izquierda
        pelota_dy = (pelota.centery - pala_derecha.centery) / (PALA_ALTO / 2) * 5  
        spin_max = velocidad_pala_der * 1.3

    # Verificar si la pelota salió de la pantalla (fuera de los bordes)
    if pelota.left <= 0:  # Puntos para la pala derecha
        puntos_derecha += 1
        pelota = pygame.Rect(ANCHO // 2 - PELOTA_RADIO, ALTO // 2 - PELOTA_RADIO, PELOTA_RADIO * 2, PELOTA_RADIO * 2)  # Resetear pelota
        pelota_dx = 5   # Restablecer velocidad de la pelota
        pelota_dy = 0   # Restablecer dirección de la pelota
        spin = 0
        spin_max = 0
    elif pelota.right >= ANCHO:  # Puntos para la pala izquierda
        puntos_izquierda += 1
        pelota = pygame.Rect(ANCHO // 2 - PELOTA_RADIO, ALTO // 2 - PELOTA_RADIO, PELOTA_RADIO * 2, PELOTA_RADIO * 2)  # Resetear pelota
        pelota_dx = -5  # Restablecer velocidad de la pelota
        pelota_dy = 0   # Restablecer dirección de la pelota
        spin = 0
        spin_max = 0

    # Rellenar la pantalla con negro
    pantalla.fill(NEGRO)
    pantalla_con_alpha.fill(NEGRO)

    # Dibujar la estela de la pelota
    for i, pos in enumerate(estela_pelota):
        alpha = max(0, pygame.math.lerp(0, 255, i/(TAMAÑO_ESTELA-1)))
        pygame.draw.circle(pantalla_con_alpha, pygame.Color(255, 255, 255, int(alpha)), pos, PELOTA_RADIO)

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
