import numpy as np
import matplotlib.pyplot as plt
from enum import Enum

class Sim:
    simSize = 10

class Bus:
    route = [(1,1),(7,1),(7,7),(1,7)]
    speedMax = 2.0
    speedMin = -2.0

    def __init__(self):
        self.xLoc = 1.
        self.yLoc = 1.

    def move(self):
        if self.xLoc > 6.9:
            self.yLoc += Bus.speedMax
        if self.xLoc < 1.1:
            self.yLoc -= Bus.speedMax
        if self.yLoc > 6.9:
            self.xLoc -= Bus.speedMax
        if self.yLoc < 1.1:
            self.xLoc += Bus.speedMax

class PedState(Enum):
    ONBUS = 1
    TOBSTOP = 2
    WALK = 3

class Pedestrian:
    onBus = False
    walkSpeedMax = .50
    walkSpeedMin = -.50
    walk2toBStopProb = 0.15

    def __init__(self):
        self.xLoc = np.random.uniform(0,Sim.simSize)
        self.yLoc = np.random.uniform(0,Sim.simSize)
    
        #randomly set state to toStop or Walk
        if np.random.rand() < .5:
            self.pedState = PedState.WALK
        else:
            self.pedState = PedState.TOBSTOP

    def walk(self):
        self.xLoc = self.xLoc + np.random.uniform(Pedestrian.walkSpeedMin, Pedestrian.walkSpeedMax)
        self.yLoc = self.xLoc + np.random.uniform(Pedestrian.walkSpeedMin, Pedestrian.walkSpeedMax)

        #some chance of transitioning to going towards nearest bus stop
        if np.random.rand() < .15:
            self.pedState = PedState.TOBSTOP

    def toBStop(self):
        #find closest bus stop
        
        lastDist = float('inf')
        #print(f"locationX: {self.xLoc}, {self.yLoc}")
        for bStop in Bus.route:
            #import ipdb; ipdb.set_trace()
            dist = np.linalg.norm(np.array((self.xLoc, self.yLoc)) - np.array(bStop))
            #print(f"dist {dist}")
            if dist < lastDist:
                closestStop = bStop
                lastDist = dist

            #check if you're at a busStop
            if dist < np.sqrt(2):
                self.pedState = PedState.ONBUS
                return
        #print(closestStop)
    
        #move towards nearest bus stop
        if (closestStop[0] -  self.xLoc) > 0.:
            #move left
            self.xLoc += Pedestrian.walkSpeedMax
        else:
            self.xLoc -= Pedestrian.walkSpeedMax
        
        if (closestStop[1] -  self.yLoc) > 0.:
            #move down
            self.yLoc += Pedestrian.walkSpeedMax
        else:
            self.yLoc -= Pedestrian.walkSpeedMax
        return
        
    def nearBStop(self):
        near = False
        lastDist = float('inf')
        for bStop in Bus.route:
            dist = np.linalg.norm(np.array((self.xLoc, self.yLoc)) - np.array(bStop))
            if dist < lastDist:
                closestStop = bStop
                lastDist = dist

            if dist < np.sqrt(2):
                near = True
        return near
                
    def onBus(self):
        if self.nearBStop() and np.random.rand() < .1:
            self.pedState = PedState.WALK
        return

if __name__ == '__main__':
    peds = [Pedestrian() for _ in range(4)]
    bus = Bus()
    x = []
    y = []

    for simTime in range(30):
        pedNum = 0
        bus.move()
        for ped in peds:
            pedNum += 1
            print(f"ped {pedNum}, state: {ped.pedState}, xLoc: {ped.xLoc}, yLoc: {ped.yLoc}")
            if ped.pedState == PedState.ONBUS:
                ped.xLoc = bus.xLoc
                ped.yLoc = bus.yLoc
                ped.onBus()
            elif ped.pedState == PedState.WALK:
                ped.walk()
            elif ped.pedState == PedState.TOBSTOP:
                ped.toBStop()
            x.append(ped.xLoc)
            y.append(ped.yLoc)
        plt.scatter(x, y, c ="blue")
        # To show the plot
        ax = plt.gca()
        ax.set(xlim=(-5, 12), ylim=(-5, 12))
        plt.show()
        x = []
        y = []
