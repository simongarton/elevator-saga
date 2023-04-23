{
    
    init: function(elevators, floors) {
        var elevator = elevators[0]; 
        
        var floorsRequested = [];
        var targetFloor = 0;
        
        elevator.on("idle", function() {
            if (floorsRequested.length == 0) {
                console.log("nothing to do.");
                return;
            }
            var nextFloor = floorsRequested.shift(); // FIFO
            elevator.goToFloor(nextFloor);
            targetFloor = nextFloor;
        });

        elevator.on("floor_button_pressed", function(floorNum) { 
            console.log("floor_button_pressed " + floorNum);
            floorsRequested.push(floorNum); 
        });

        elevator.on("passing_floor", function(floorNum, direction) { 
            console.log("passing_floor ", floorNum, direction);
            for (i=0; i < floorsRequested.length; i++) {
                if (floorNum == floorsRequested[i]) {
                    console.log("redirecting to", floorNum);
                    floorsRequested.shift(targetFloor); // need to put this back on the queue
                    elevator.goToFloor(floorNum);
                    targetFloor = floorNum;
                }
            }
        });

        elevator.on("stopped_at_floor", function(floorNum) { 
            console.log("stopped_at_floor  ", floorNum);
        });
        
        for (i=0; i < floors.length; i++) {
            var floor = floors[i];
            floor.on("up_button_pressed", function(activeFloor) {
                console.log("up_button_pressed: activeFloor.level ", activeFloor.level);
                if (floorsRequested.length == 0) {
                    elevator.goToFloor(activeFloor.level);
                } else {
                    floorsRequested.push(activeFloor.level);                     
                }
            });
            floor.on("down_button_pressed", function(activeFloor) {
                console.log("down_button_pressed: activeFloor.level ", activeFloor.level);
                if (floorsRequested.length == 0) {
                    elevator.goToFloor(activeFloor.level);
                } else {
                    floorsRequested.push(activeFloor.level);                     
                }
            });
        };
    },
       

    update: function(dt, elevators, floors) {
    }
}