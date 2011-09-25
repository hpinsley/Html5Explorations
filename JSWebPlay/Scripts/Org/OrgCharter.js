/*
Class: OrgCharter

This class's job is to create an organizational chart for on organization rooted at
rootNode on the canvas context ctx.  The caller should instantiate this class using
and then call drawTree.  The job of this class is only to draw the org chart.  The detailed
employee "popup" window is done by the EmpDetailer class.

Each node represents and employee object with an optional DirectReports array.
*/

function OrgCharter(ctx, rootNode) {
    this.ctx = ctx;
    this.rootNode = rootNode;
    this.boxHeight = 80;
    //this.boxWidth = 150;
    this.boxWidth = 150;
    this.fontHeight = 9;
    this.fontName = "Verdana";
    this.boxGap = 10;
    this.levelGap = 50;
    this.boxLineWidth = 2;
    //this.boxColor = "rgb(25,25,25)";
    this.boxColor = "rgb(25,25,75)";
    this.nameColor = "yellow";
    this.titleColor = "white";
    this.coordColor = "rgba(255,255,255,0.5)";
    this.reportsDisplayColor = "rgba(255,255,255,0.75)";
    //this.treeHeight = 600;
};

OrgCharter.prototype.drawTree = function () {
    var treeWidth = this.getSubtreeWidth(this.rootNode);
    this.ctx.canvas.width = treeWidth + 2 * this.boxGap;

    var treeHeight = this.getSubtreeHeight(this.rootNode);
    this.ctx.canvas.height = treeHeight + this.levelGap;

    //alert("canvas dimensions set to " + this.ctx.canvas.width + "," + this.ctx.canvas.height);
    this.drawSubtree(this.rootNode, this.boxGap, 0);
};

OrgCharter.prototype.drawSubtree = function (emp, xOffset, treeLevel) {

    var subTreeWidth = this.getSubtreeWidth(emp);
    var left = xOffset + subTreeWidth / 2 - this.boxWidth / 2;
    var top = this.levelGap + treeLevel * (this.boxHeight + this.levelGap);
    var bottom = top + this.boxHeight;

    var cx = left + this.boxWidth / 2;
    var cy = top + this.boxHeight / 2;

    this.drawEmpBox(emp, cx, cy);

    //Draw a small vertical up from the top center to connect to the supervisor above.
    var topOfHandle = new Point(cx, top - this.levelGap / 2);

    this.ctx.beginPath();
    this.ctx.moveTo(cx, top);
    this.ctx.lineTo(cx, topOfHandle.y);
    this.ctx.stroke();

    //Special stuff for supervisors (although we normally only draw supervisors)

    if (this.isSupervisor(emp)) {


        var firstHandle = null, lasthandle = null;

        OrgUtils.sortEmpArray(emp.DirectReports);
        
        var x = xOffset;
        for (var i = 0; i < emp.DirectReports.length; ++i) {
            var child = emp.DirectReports[i];
            if (this.isEmpDisplayed(child)) {
                var childHandle = this.drawSubtree(child, x, treeLevel + 1);
                if (firstHandle == null) {
                    firstHandle = childHandle;
                }
                lasthandle = childHandle;
                var childWidth = this.getSubtreeWidth(child);
                x += childWidth + this.boxGap;
            }
        }

        //Did we draw nodes beneath us?
        if (firstHandle != null) {

            //Draw the supervisor line down
            this.ctx.beginPath();
            this.ctx.moveTo(cx, bottom);
            this.ctx.lineTo(cx, bottom + this.levelGap / 2);
            this.ctx.stroke();

            //Connect the top of the first child handle to the top of
            //the last child handle with a horizontal line

            this.ctx.beginPath();
            this.ctx.moveTo(firstHandle.x, firstHandle.y);
            this.ctx.lineTo(lasthandle.x, lasthandle.y);
            this.ctx.stroke();
        }
    }
    return topOfHandle;
};

OrgCharter.prototype.getSubtreeHeight = function (root) {
    var levels = this.getTreeLevelsRecurse(root);
    var height = levels * (this.levelGap + this.boxHeight);
    return height;
};

OrgCharter.prototype.getTreeLevelsRecurse = function (node) {
    
    if (!this.isEmpDisplayed(node))
        return 0;
    
    var maxChildLevels = 0;
    if (this.isSupervisor(node)) {
        for (var i = 0; i < node.DirectReports.length; ++i) {
            var child = node.DirectReports[i];
            var childTreeLevels = this.getTreeLevelsRecurse(child);
            if (childTreeLevels > maxChildLevels) {
                maxChildLevels = childTreeLevels;
            }
        }
    }
    return 1 + maxChildLevels;
};

OrgCharter.prototype.getSubtreeWidth = function (root) {
    if (!this.isEmpDisplayed(root)) {
        return 0;
    }
    var subTreeWidth = Math.max(this.boxWidth, this.getDescendentWidth(root));
    return subTreeWidth;
};

//Get the width of all descendants that are themselves supervisors
OrgCharter.prototype.getDescendentWidth = function (node) {
    var totalWidth = 0;
    var displayedChildren = 0;
    if (this.isSupervisor(node)) {
        for (var i = 0; i < node.DirectReports.length; ++i) {
            var child = node.DirectReports[i];
            if (this.isEmpDisplayed(child)) {

                var childWidth = Math.max(this.boxWidth, this.getDescendentWidth(child));
                ++displayedChildren;
                totalWidth += childWidth;
                if (displayedChildren > 1) {
                    totalWidth += this.boxGap;
                }
            }
        }
    }
    return totalWidth;
};

//Draw just the one emp box centered on point
OrgCharter.prototype.drawEmpBox = function (emp, x, y) {
    this.ctx.save();


    //Center the box on 0,0
    this.ctx.translate(x, y);

    var top = -this.boxHeight / 2;
    var left = -this.boxWidth / 2;

    //For later hit testing, save the bounding rectangle
    emp.boundingRect = new BoundingRectangle(x - this.boxWidth / 2, y - this.boxHeight / 2, this.boxWidth, this.boxHeight);

    //this.ctx.translate(x + this.boxWidth / 2, y + this.boxHeight / 2);
    this.ctx.fillStyle = this.boxColor;
    this.ctx.lineWidth = this.boxLineWidth;

    this.ctx.save();    //just for these shadow statements
    this.ctx.shadowOffsetX = 10;
    this.ctx.shadowOffsetY = 10;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

    //this.ctx.fillRect(left, top, this.boxWidth, this.boxHeight);
    roundRect(this.ctx, left, top, this.boxWidth, this.boxHeight, 10, true, false);
    this.ctx.restore(); //after shadow statements

    this.writeString(emp.Name, this.fontHeight * 1.2, -this.boxHeight / 6, this.nameColor);
    if (emp.Title) {
        this.writeString(emp.Title, this.fontHeight, this.boxHeight / 6, this.titleColor);
    }
    //this.writeString(emp.boundingRect.toString(), this.fontHeight * .8, this.boxHeight / 3, this.coordColor);
    this.writeString(this.reportsLineDisplay(emp), this.fontHeight, this.boxHeight / 3, this.reportsDisplayColor);
    this.ctx.restore();
};

OrgCharter.prototype.writeString = function (str, fontSize, yOffsetFromMiddle, fillStyle) {
    this.ctx.save();
    this.ctx.font = this.getFontName(fontSize);
    this.ctx.fillStyle = fillStyle;
    var textDim = this.ctx.measureText(str);
    this.ctx.fillText(str, -1 * textDim.width / 2, yOffsetFromMiddle);
    this.ctx.restore();
};

OrgCharter.prototype.getFontName = function (fontSize) {
    return "" + Math.round(fontSize) + "px " + this.fontName;
};

/**
* Draws a rounded rectangle using the current state of the canvas. 
* If you omit the last three params, it will draw a rectangle 
* outline with a 5 pixel border radius 
* @param {CanvasRenderingContext2D} ctx
* @param {Number} x The top left x coordinate
* @param {Number} y The top left y coordinate 
* @param {Number} width The width of the rectangle 
* @param {Number} height The height of the rectangle
* @param {Number} radius The corner radius. Defaults to 5;
* @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
* @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
*/
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

OrgCharter.prototype.findClickedEmp = function (x, y) {
    var emp = this.findClickedEmpRecurse(x, y, this.rootNode);
    return emp;
};

OrgCharter.prototype.findClickedEmpRecurse = function (x, y, node) {
    if (node == null)
        return null;

    if (!this.isEmpDisplayed(node))
        return null;

    var rect = node.boundingRect;

    if ((x >= rect.left) &&
        (x < (rect.left + rect.width)) &&
            (y >= rect.top) &&
                (y <= (rect.top + rect.height))) {

        return node;    //hit
    }

    if (this.isSupervisor(node)) {
        for (var i = 0; i < node.DirectReports.length; ++i) {
            var childRoot = node.DirectReports[i];
            var clickedNode = this.findClickedEmpRecurse(x, y, childRoot);
            if (clickedNode != null)
                return clickedNode;
        }
    }
    return null;
};

OrgCharter.prototype.isSupervisor = function (emp) {
    return (emp.DirectReports != undefined);
};

OrgCharter.prototype.isEmpDisplayed = function (emp) {
    return (this.isSupervisor(emp));
};

OrgCharter.prototype.countDirectReports = function (emp) {
    if (!this.isSupervisor(emp))
        return 0;

    return emp.DirectReports.length;
};

OrgCharter.prototype.countAllReports = function (emp) {

    if (!this.isSupervisor(emp))
        return 0;

    var totalReports = 0;
    for (var i = 0; i < emp.DirectReports.length; i++) {
        var child = emp.DirectReports[i];
        ++totalReports;
        if (child != emp) { //Protect against bad data where emp supervises self
            totalReports += this.countAllReports(child);
        }
    }
    return totalReports;
};

OrgCharter.prototype.reportsLineDisplay = function (emp) {
    var directReports = this.countDirectReports(emp);
    var allReports = this.countAllReports(emp);

    return "Direct: " + directReports + "  All: " + allReports;
};

