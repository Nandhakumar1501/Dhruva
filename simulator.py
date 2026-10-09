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
