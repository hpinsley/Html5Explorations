function MovieMaker() {
    this.movieWidth = 0;
    this.movieHeight = 0;
    this.frames = [];
};

MovieMaker.prototype.playMovie = function (ctx) {
    alert("Playing movie with " + this.getFrameCount() + " frames.");

    var that = this;
    var frameNo = 0;
    var sleep = 500;
    playFrame();
    function playFrame() {
        if (frameNo >= that.getFrameCount())
            return;
        //alert("Playing frame " + frameNo);
        var data = that.frames[frameNo];
        ctx.putImageData(data, 0, 0);
        ++frameNo;
        setTimeout(playFrame, sleep);
    };
};

MovieMaker.prototype.pushFrame = function (ctx) {
    var canvas = ctx.canvas;
    this.setMovieDimensions(canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0, this.movieWidth, this.movieHeight);
    this.frames.push(imageData);
};

MovieMaker.prototype.setMovieDimensions = function (w, h) {

    if (this.getFrameCount() === 0) {
        this.movieWidth = w;
        this.movieHeight = h;
        return;
    }
    //On subsequent frames, make sure the size is consistent
    if ((this.movieWidth !== w) || (this.movieHeight !== h)) {
        throw "Frame size not compatible with prior frames";
    }
};

MovieMaker.prototype.getFrameCount = function () {
    return this.frames.length;
};


