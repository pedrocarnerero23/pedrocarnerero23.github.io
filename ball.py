import pygame
from math import pi
class Ball:
    def __init__(self,x, y, vx, vy,radius):
        self.position = pygame.math.Vector2([x, y])
        self.velocity = pygame.math.Vector2([vx, vy])
        self.acceleration = pygame.math.Vector2([0, 0])
        self.radius = radius
        self.angle = 0
        self.angular_velocity = 0
        self.angular_acceleration = 0
        self.inertia_momentum = 0.5 * pi * self.radius * self.radius
        self.radius = radius
        self.rect = pygame.Rect(self.position.x - self.radius, self.position.y - self.radius, self.radius, self.radius)
    
    def apply_force(self, force, point = None):
        self.acceleration = force/self.mass

        if point:
            pass
    
    def update(self, dt):
        self.velocity = self.acceleration * dt
        self.position = self.velocity * dt
    
    def handle_collision(self, collision_dict):

        collision_key = self.rect.collidedict(collision_dict)
    
        if collision_key == "TOP" or collision_key == "BOTTOM":
            self.velocity.y *= -1

        if collision_key == "LEFT_PLAYER" or collision_key == "RIGHT_PLAYER":
            self.velocity.x *= -1

        if collision_key != "GOAL_LEFT" and collision_key != "GOAL_RIGHT":
            self.is_goal = None
        elif collision_key == "GOAL_RIGHT":
            self.is_goal = "RIGHT"
        elif collision_key == "GOAL_LEFT":
            self.is_goal = "LEFT"
        

