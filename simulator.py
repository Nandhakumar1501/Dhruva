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
