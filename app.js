var canvas, ctx, mx, my;
var color = '#000000';
var poly1, poly2,poly3,poly4;
var n = Math.ceil(Math.random()*10); //random number for poly1
var m = Math.ceil(Math.random()*10); //random number for poly3
var l = Math.ceil(Math.random()*10); //random number for poly4


// loads the canvas
function load(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resize(); //defined: app.js line 14
  setInterval(draw,50);
}

//resize the canvas to full screen size
function resize(){
  canvas.height = window.innerHeight;
  canvas.width = document.body.offsetWidth;
}

//get x and y coordinates of mouse pointer
window.addEventListener('mousemove', function(event){
  mx = event.clientX; //x coordinate
  my = event.clientY; //y coordinate
});

//draw polygons and check for collision of two polygons
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  poly1 = polygon(canvas.width/2,canvas.height/2,80,n+3);
  poly2 = polygonMouse(mx,my,5,4);
  poly3 = polygon(canvas.width/3,canvas.height/2,90,m+3);
  poly4 = polygon((canvas.width*2)/3,canvas.height/2,70,l+3);

  if(collide(poly1,poly2)) {
    mouseOnCollide();
    color = "#FF6700";
  }
  else if(collide(poly3, poly2)){
    mouseOnCollide();
    color = "#ffffff";
  }
  else if (collide(poly4, poly2)){
    mouseOnCollide();
    color = "#BFFF00";
  }
  else {
    color = "#000000";
  }
}

/*function which accepts
start point coordinates as x,y
radius as r and no. of sides as s
to create new type of stroked polygon*/
function polygon(x,y,r,s){
  var a = Math.PI/(n+1);
  var points = [];
  var sides = [];
  ctx.beginPath();
  for(var i=0; i<=s; i++){
    var px = x + r*Math.cos(a), py= y + r*Math.sin(a);
    if(i===0){
      ctx.moveTo(px,py);
    }
    else{
      ctx.lineTo(px,py);
      sides.push([{x: points[i-1].x, y: points[i-1].y},{x: px,y: py}])
    }
    points.push({x: px, y:py});
    a += Math.PI*2/s;
  }
  points.pop(); //remove overlapping first and last points
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  return {p:points, s:sides};
}

/*function which accepts
start point coordinates as x,y
radius as r and no. of sides as s
to create new type of filled polygon for mouse pointer specifically*/
function polygonMouse(x,y,r,s){
  var a = Math.PI/2;
  var points = [];
  var sides = [];
  ctx.beginPath();
  for(var i=0; i<=s; i++){
    var px = x + r*Math.cos(a), py= y + r*Math.sin(a);
    if(i===0){
      ctx.moveTo(px,py);
    }
    else{
      ctx.lineTo(px,py);
      sides.push([{x: points[i-1].x, y: points[i-1].y},{x: px,y: py}])
    }
    points.push({x: px, y:py});
    a += Math.PI*2/s;
  }
  points.pop(); //remove overlapping first and last points
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.fill();
  return {p:points, s:sides};
}

//function which calls intersect to check whether they really collide or not
function collide(p1,p2) {
  for(var i in p1.s) {
    for(var j in p2.s) {
      var t = intersect(p1.s[i],p2.s[j]);
      if(t === 'collinear') {continue;}
      if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
        return true;
      }
    }
  }
  return false;
}

// function with algorithm to check collision of points of two polygons
function intersect(s1,s2) {
  if(((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)) === 0) {
    return 'collinear';
  }
  var tA =  ((s2[0].y - s2[1].y)*(s1[0].x - s2[0].x) + (s2[1].x - s2[0].x)*(s1[0].y - s2[0].y))/
            ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)),
      tB =  ((s1[0].y - s1[1].y)*(s1[0].x - s2[0].x) + (s1[1].x - s1[0].x)*(s1[0].y - s2[0].y))/
            ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y));
  return [tA, tB];
}

//function to create a new circle on the mouse pointer
function mouseOnCollide(){
  ctx.beginPath();
  ctx.arc(mx, my, 10, 0, 2*Math.PI)
  ctx.strokeStyle = "#ffbf00";
  ctx.lineWidth = 5;
  ctx.stroke();
}

load();
