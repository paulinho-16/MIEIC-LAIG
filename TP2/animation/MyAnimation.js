
class MyAnimation {
    constructor(startTime, endTime, startTransformations, endTransformations) {
        // -- Used
        this.startTime = 0;
        this.endTime = 15;
        this.active = true;

        // -- Not used yet bellow
        this.totalTime = this.endTime - this.startTime;
        this.startTransformations = startTransformations; // [x, y, z]
        this.endTransformations = endTransformations;  // [x, y, z]
        this.currentTransformations;
        this.currentTime;

        this.active = true;
    }

    /*
    update(currentTime) {
        if (!this.active)
            return 0;

        this.currentTime = currentTime;
        
        if (currentTime < this.endTime) {
            let elapsedTime = currentTime - this.startTime;

            let currentXValue = this.startTransformations[0] + (this.endTransformations[0] - this.startTransformations[0]) * (elapsedTime / this.totalTime);
            let currentYValue = this.startTransformations[1] + (this.endTransformations[1] - this.startTransformations[1]) * (elapsedTime / this.totalTime);
            let currentZValue = this.startTransformations[2] + (this.endTransformations[2] - this.startTransformations[2]) * (elapsedTime / this.totalTime);

            this.currentTransformations = [currentXValue, currentYValue, currentZValue];
        }
    }
    */
}