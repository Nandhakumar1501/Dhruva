import numpy as np  

#constants 
MU = 398600.4418
J2 = 1.08263e-3
RE = 6378.137
ISP = 300.0
G0 = 9.80665 

#J2 acceleration vector 
#-> input value -> [x, y, z]
#-> output value -> [ax, ay, az]

def j2_acceleration(r):
    r = np.array(r)
    r_mag = np.linalg.norm(r)
    scalar = ((3/2) * J2 * MU * RE ** 2) / r_mag ** 5
    x_param = r[0] * (5 * r[2] ** 2 / r_mag ** 2 - 1)
    y_param = r[1] * (5 * r[2] ** 2 / r_mag ** 2 - 1)
    z_param = r[2] * (5 * r[2] ** 2 / r_mag ** 2 - 3)
    j2_accel = np.array([scalar * x_param, scalar * y_param, scalar * z_param])
    return j2_accel

#derivatives state -> total acceleration 
#-> input value -> [x, y, z, vx, vy, vz]
#-> output value -> [vx, vy, vz, ax, ay, az]

def derivatives(state):
    state = np.array(state)
    r = state[0:3]
    v = state[3:6]
    r_mag = np.linalg.norm(r)
    scalar = -1 * (MU / r_mag ** 3)
    a_j2 = j2_acceleration(r)
    acceleration = (scalar * r) + a_j2
    total_acceleration = np.concatenate([v, acceleration])
    return total_acceleration

#Range Kutta 4th order derivative to find out position with respect to the velocity and time forwarding

