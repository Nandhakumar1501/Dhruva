import matplotlib.pyplot as plt 
import numpy as np 
from physics import rk4_step

fig, ax = plt.subplots()
ax.set_xlim(-8000, 8000)
ax.set_ylim(-8000, 8000)
ax.set_xlabel("x(t)")
ax.set_ylabel("y(t)")
ax.set_title("satellite orbit")
ax.axis("equal")

earth = plt.Circle((0, 0), 6378, fill = False, color='blue')
ax.add_patch(earth)

satellite, = ax.plot([], [], 'g^')
debris, = ax.plot([], [], 'r^')
collision_marker, = ax.plot([], [], 'yo', markersize=8)
trail, = ax.plot([], [], 'green')
debris_trail, = ax.plot([], [], 'red')
burn_point, = ax.plot([], [], 'mo', markersize=6)

maneuver_started = False

state = np.array([6778, 0, 0, 0, 7.67, 0])
debris_state = np.array([6780, 0, 0, 0, -7.66, 0])


x_list = []
y_list = []

x_list_debris = []
y_list_debris = []

dt = 20
steps = 200
max_trail = 200

def predict_closest_approach(state, debris_state):
    test_state = state.copy()
    test_debris = debris_state.copy()

    min_distance = 1e9 
    collision_point = None 

    for i in range(200):
        test_state = rk4_step(test_state, dt)
        test_debris = rk4_step(test_debris, dt)

        dx = test_state[0] - test_debris[0]
        dy = test_state[1] - test_debris[1]

        distance = np.sqrt(dx * dx + dy * dy)
        if distance < min_distance:
            min_distance = distance
            collision_point = (test_state[0], test_state[1])

    return min_distance, collision_point


while(True):
    state = rk4_step(state, dt)
    debris_state = rk4_step(debris_state, dt)

    predicted_distance, collision_point = predict_closest_approach(state, debris_state)
    
    if collision_point != None:
        collision_marker.set_data([collision_point[0]], [collision_point[1]])

    debris_x = debris_state[0]
    debris_y = debris_state[1]
    x = state[0]
    y = state[1]

    dx = x - debris_x
    dy = y - debris_y

    distance = np.sqrt(dx * dx + dy * dy) 
    print(distance)

