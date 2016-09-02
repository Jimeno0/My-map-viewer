var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvas1 = document.getElementById("canvas1");
var ctx1 = canvas1.getContext("2d");

var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();
var cw = canvas.width;
var ch = canvas.height;

var scaleFactor = 1.00;
var panX = 0;
var panY = 0;

var circleX = 150;
var circleY = 150;
var radius = 15;

drawTranslated();

$("#canvas").mousemove(function (e) {
    handleMouseMove(e);
});
$("#scaledown").click(function () {
    scaleFactor /= 1.1;
    drawTranslated();
});
$("#scaleup").click(function () {
    scaleFactor *= 1.1;
    drawTranslated();
});
$("#panleft").click(function () {
    panX -= 10;
    drawTranslated();
});
$("#panright").click(function () {
    panX += 10;
    drawTranslated();
});

function drawTranslated() {

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.beginPath();
    ctx.rect(circleX - radius, circleY - radius, radius * 2, radius * 2);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore();

    ctx1.clearRect(0, 0, cw, ch);
    ctx1.save();
    ctx1.translate(panX, panY);
    ctx1.scale(scaleFactor, scaleFactor);
    ctx1.beginPath();
    ctx1.arc(circleX, circleY, radius, 0, Math.PI * 2);
    ctx1.closePath();
    ctx1.fillStyle = "red";
    ctx1.fill();
    ctx1.restore();
}