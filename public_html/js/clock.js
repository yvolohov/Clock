var yvClock =
{
    showClock : function (canvas, fillColor, strokeColor)
    {    
        if (canvas === null) return;

        var context = canvas.getContext("2d");
        context.fillStyle = fillColor;
        context.strokeStyle = strokeColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var drawParams = this.getDrawParams(canvas.width, canvas.height);
        this.drawCircle(context, drawParams);
        this.drawTicks(context, drawParams);

        /* first call */
        this.timerProc(context, drawParams, fillColor, strokeColor);

        /* set timer for next calls */  
        var timerId = setInterval(function(){yvClock.timerProc(context, drawParams, 
            fillColor, strokeColor);}, 1000);
        return timerId;
    },

    timerProc : function(context, drawParams, fillColor, strokeColor)
    {
        var currentDate = new Date();
        hours = currentDate.getHours();
        minutes = currentDate.getMinutes();
        seconds = currentDate.getSeconds();    

        var hours12 = (hours > 11) ? hours - 12 : hours; // 12-hours scale
        var hoursToMin = (hours12 * 5) + Math.floor(minutes / 12);

        this.clearCenter(context, drawParams);
        this.drawArrow(context, drawParams, seconds, "s");
        this.drawArrow(context, drawParams, minutes, "m");
        this.drawArrow(context, drawParams, hoursToMin, "h");
        this.drawCenterPoint(context, drawParams);    
    },

    getDrawParams : function(width, height)
    {
        drawParams = new Object();

        /* размеры canvas */
        drawParams.width = width;
        drawParams.height = height;

        /* длина стороны часов, всегда равна меньшей стороне canvas */
        drawParams.sideLength = Math.min(width, height); 

        /* коефициент определяющий ширину разных частей часов */
        drawParams.strokeIndex = Math.floor(drawParams.sideLength / 20);  

        return drawParams;
    },

    drawCircle : function(context, drawParams)
    { 
        var centerX = Math.floor(drawParams.width / 2);
        var centerY = Math.floor(drawParams.height / 2);
        var radius = Math.floor(drawParams.sideLength / 2) - 
            Math.floor(drawParams.strokeIndex / 2);
        var endAngle = 2.0 * Math.PI;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, endAngle, false);
        context.lineWidth = drawParams.strokeIndex;
        context.stroke();
    },

    drawTicks : function (context, drawParams)
    {
        var angle, cosX, sinY, x1, y1, x2, y2, tickRadius2;

        var radius = Math.floor(drawParams.sideLength / 2);   
        var tickRadius1 = radius - Math.floor(drawParams.strokeIndex / 2);
        var tickRadius21 = radius - Math.floor(drawParams.strokeIndex * 1.5);
        var tickRadius22 = radius - Math.floor(drawParams.strokeIndex * 2);
        var offsetX = Math.floor(drawParams.width / 2);
        var offsetY = Math.floor(drawParams.height / 2);

        context.lineWidth = Math.floor(drawParams.strokeIndex / 4);

        for (var index = 0; index < 60; index++) 
        {
           tickRadius2 = (index % 5 > 0) ? tickRadius21 : tickRadius22;

           angle = ((index * 6) / 180) * Math.PI; // в радианах
           cosX = Math.cos(angle);
           sinY = -(Math.sin(angle));
           x1 = Math.round(tickRadius1 * cosX) + offsetX;
           y1 = Math.round(tickRadius1 * sinY) + offsetY;  
           x2 = Math.round(tickRadius2 * cosX) + offsetX;
           y2 = Math.round(tickRadius2 * sinY) + offsetY;

           context.beginPath();
           context.moveTo(x1, y1);
           context.lineTo(x2, y2);
           context.stroke();
        }
    },

    drawArrow : function (context, drawParams, minute, type)
    {
        var angleDegrees = this.minutesToDegrees(minute);
        var angle = (angleDegrees / 180) * Math.PI; // в радианах
        var cosX = Math.cos(angle);
        var sinY = -(Math.sin(angle));    
        var radius = Math.floor(drawParams.sideLength / 2); 

        if (type === "s")
        {
            context.lineWidth = Math.floor(drawParams.strokeIndex / 4);
            radius = radius - Math.floor(drawParams.strokeIndex * 2.5);
        }
        else if (type === "m") 
        {
            context.lineWidth = Math.floor(drawParams.strokeIndex / 3);
            radius = radius - Math.floor(drawParams.strokeIndex * 3);
        }
        else
        {
            context.lineWidth = Math.floor(drawParams.strokeIndex / 2);
            radius = radius - Math.floor(drawParams.strokeIndex * 4);
        }

        var x1 = Math.floor(drawParams.width / 2);
        var y1 = Math.floor(drawParams.height / 2);
        var x2 = Math.round(radius * cosX) + x1;
        var y2 = Math.round(radius * sinY) + y1;    

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();    
    },

    drawCenterPoint : function(context, drawParams)
    {
        var centerX = Math.floor(drawParams.width / 2);
        var centerY = Math.floor(drawParams.height / 2);
        var radius = Math.floor(drawParams.strokeIndex / 2);

        context.beginPath();
        context.arc(centerX, centerY, radius, 
            0, 2.0 * Math.PI, false);
        context.fill();
        context.stroke();
    },

    clearCenter : function (context, drawParams)
    {
        var centerX = Math.floor(drawParams.width / 2);
        var centerY = Math.floor(drawParams.height / 2);
        var radius = Math.floor(drawParams.sideLength / 2);
        var tickRadius = radius - Math.floor(drawParams.strokeIndex * 2);
        var endAngle = 2.0 * Math.PI;

        context.beginPath();
        context.arc(centerX, centerY, tickRadius, 0, endAngle, false);
        context.fill();    
    },

    minutesToDegrees : function (minute)
    {
        minute = (minute > 59) ? 59 : minute;
        var degrees = 90 - (minute * 6);
        degrees = (minute > 15) ? degrees + 360 : degrees;
        return degrees;
    }    
};