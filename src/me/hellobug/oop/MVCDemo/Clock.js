(function(){
    var Package = me.hellobug.oop.Package;
    
    // 指针时钟
    Package("me.hellobug.oop.display")
    .Class("AnalogClock")(function(canvasNodeId){
        var canvas = document.getElementById(canvasNodeId),
            context = canvas.getContext('2d'),
            FONT_HEIGHT = 15,
            MARGIN = 6,
            HAND_TRUNCATION = canvas.width / 25,
            HOUR_HAND_TRUNCATION = canvas.width / 5,
            MINUTE_HAND_TRUNCATION = canvas.width / 12,
            NUMERAL_SPACING = 20,
            RADIUS = canvas.width / 2 - MARGIN,
            HAND_RADIUS = RADIUS + NUMERAL_SPACING;

        function drawCircle(){
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
            context.stroke();
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, RADIUS + 4, 0, Math.PI * 2, true);
            context.stroke();
        }
        function drawNumerals(){
            var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                angle = 0,
                numeralWidth = 0,
                w, h;
            for(var i = 0, l = numerals.length; i < l; i++){
                var numeral = numerals[i];
                angle = Math.PI / 6 * (numeral - 3);
                numeralWidth = context.measureText(numeral).width;
                w = canvas.width / 2 + Math.cos(angle) * (RADIUS - FONT_HEIGHT / 2) - numeralWidth / 2;
                h = canvas.height / 2 + Math.sin(angle) * (RADIUS - FONT_HEIGHT / 2) - FONT_HEIGHT / 3 + 10;
                context.fillText(numeral, w, h);
            }
        }
        function drawCenter(){
            context.beginPath();
            context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
            context.fill();
        }
        function drawHand(loc, handType){
            var angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2,
                handRadius = 0;
            switch(handType){
                case "hour":
                    handRadius = RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION;
                    context.lineWidth = 3;
                    context.strokeStyle = 'blue';
                    break;
                case "minute":
                    handRadius = RADIUS - HAND_TRUNCATION - MINUTE_HAND_TRUNCATION;
                    context.lineWidth = 2;
                    context.strokeStyle = 'green';
                    break;
                case "second":
                    handRadius = RADIUS - HAND_TRUNCATION;
                    context.lineWidth = 1;
                    context.strokeStyle = 'red';
                    break;
            }
            context.beginPath();
            context.moveTo(canvas.width / 2, canvas.height / 2);
            context.lineTo(canvas.width / 2 + Math.cos(angle) * handRadius, 
                            canvas.height / 2 + Math.sin(angle) * handRadius);
            context.stroke();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
        }
        function drawHands(date){
            var hour = date.getHours();
            hour = hour > 12 ? hour - 12 : hour;
            drawHand(hour * 5 + (date.getMinutes() / 60) * 5, "hour");
            drawHand(date.getMinutes(), "minute");
            drawHand(date.getSeconds(), "second");
        }
        function drawClock(date){
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawCircle();
            drawCenter();
            drawNumerals();
            drawHands(date);
        }

        context.font = FONT_HEIGHT + 'px Arial';

        this.update = drawClock;
    });
    
    // 数字时钟
    Package("me.hellobug.oop.display")
    .Class("DigitalClock")(function(canvasNodeId){
        var canvas = document.getElementById(canvasNodeId),
            context = canvas.getContext('2d'),
            X = 2, Y = canvas.height / 2 + 16, xOffset = 0;

        function drawClock(date){
            context.clearRect(0, 0, canvas.width, canvas.height);
            var hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();
            hour = hour > 12 ? hour - 12 : hour;
            hour = hour < 10 ? "0" + hour : "" + hour;
            minute = minute < 10 ? "0" + minute : "" + minute;
            second = second < 10 ? "0" + second : "" + second;

            xOffset = 0;

            context.fillStyle = 'blue'
            context.fillText(hour, X, Y);
            xOffset += context.measureText(hour).width;

            context.fillStyle = 'black'
            context.fillText(":", X + xOffset, Y - 4);
            xOffset += context.measureText(":").width;

            context.fillStyle = 'green'
            context.fillText(minute, X + xOffset, Y);
            xOffset += context.measureText(minute).width;

            context.fillStyle = 'black'
            context.fillText(":", X + xOffset, Y - 4);
            xOffset += context.measureText(":").width;

            context.fillStyle = 'red'
            context.fillText(second, X + xOffset, Y);
        }

        context.font = '50px Arial';
        context.shadowColor = 'black';
        context.shadowBlur = 1;

        this.update = drawClock;
    });
})();