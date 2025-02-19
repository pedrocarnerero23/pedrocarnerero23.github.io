import pygame

class Player:
    def __init__(self, x, y, width, height, mass, controls):
        self.position = pygame.math.Vector2([x, y])
        self.velocity = pygame.math.Vector2([0, 0])
        self.acceleration = pygame.math.Vector2([0, 0])
        self.width = width
        self.height = height
        self.mass = mass
        self.rect = pygame.Rect(self.position.x - self.width // 2, self.position.y - self.height // 2,
                                 self.width, self.height)

        type, location = controls
        if type == "PLAYER":
            if location == "LEFT":
                self.up_key = pygame.K_w
                self.down_key = pygame.K_d
            elif location == "RIGHT":
                self.up_key = pygame.K_UP
                self.down_key = pygame.K_DOWN
            else:
                print("location error")
        elif type == "AI":
            pass
        else:
            print("type error")

    def apply_force(self, force):
        self.acceleration = force/self.mass
    
    def update(self, dt):
        self.velocity = self.acceleration * dt
        self.position = self.velocity * dt


    def handle_collision(self, walls):
        collision_key = self.rect.collidedict(walls)
    
        if collision_key == "TOP":
            self.position.y = self.height // 2
            self.velocity.y = 0
            self.acceleration.y = 0

        elif collision_key == "BOTTOM":
            alto_pantalla = walls[collision_key].top
            self.position.y = alto_pantalla - self.height // 2
            self.velocity.y = 0
            self.acceleration.y = 0

            
    def handle_input(self, teclas):
        if teclas[self.up_key]:
            self.apply_force(pygame.math.Vector2([0,-10]))

        if teclas[self.down_key]:
            self.apply_force(pygame.math.Vector2([0,10]))
    
    



