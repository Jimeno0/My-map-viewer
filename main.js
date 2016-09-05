
//TRANSFORM: set transform¿?¿?¿?

// (function (){
  var data, bounds = {}, panX = 0, panY = 0, scaleFactor = 1.00, lastX = 0, lastY= 0;
  var initX, initY, endX, endY;


  var lastoffsetX = 0;
  var lastoffsetY = 0;

  var relativeX = 0;
  var relativeY = 0;

  var headderHeight = document.getElementById('headderBar').clientHeight;
  var width = $(document).width();
  var height = $(document).height() - headderHeight;

  console.log("Welcome to the console log partyyyyy!! Yeeeeeehaaaa");

  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  canvasMiddleX =  canvas.width/2;
  canvasMiddleY =  canvas.height/2;


  //AJAX REQUESTS

  $.when(
  
    $.get("https://rambo-test.carto.com:443/api/v2/sql?q=select%20ST_Extent(the_geom)%20from%20public.mnmappluto", function(response,status) {
      var extent = response.rows[0].st_extent;
       
      extent = extent.split(/[ \(,\)]+/);
      extent.shift();
      extent.pop();

      for (i = 0; i < extent.length; i++) {
        extent[i] = Number(extent[i]);
      }
      
      bounds.xMin= extent[0];
      bounds.yMin= extent[1];
      bounds.xMax= extent[2];
      bounds.yMax= extent[3];


      minimBounds = mercator(bounds.xMin, bounds.yMin);
      maximBounds = mercator(bounds.xMax, bounds.yMax);

      bounds.xMin= minimBounds.x;
      bounds.yMin= minimBounds.y;
      bounds.xMax= maximBounds.x;
      bounds.yMax= maximBounds.y;

      console.log("extent status response: " + status);
    }),

    
    $.get("https://rambo-test.carto.com:443/api/v2/sql?format=GeoJSON&q=select%20the_geom%2C%20numfloors%20from%20public.mnmappluto", function(response, status) {
      data = response;
      console.log("data status response: " + status);
    })

  ).then(function() {

      console.log("all ready, then fuck yeah lets draw!!!");
      console.log(bounds);
      console.log(data);
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY); 
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY); 
  });


  // EVENTS AND LISTENERS

  $("#home").click(function(){
    panX = 0;
    panY = 0;
    lastX = 0;
    lastY = 0;
    scaleFactor = 1;
    lastoffsetX = 0;
    lastoffsetY = 0;
    draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY); 
  });

  $("#transLeft").click(function(){

    panX -= 10;
    moveCanvasTo ('marginLeft','-16px');
    setTimeout(function(){
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY,context); 
    }, 250);
    lastX = panX;
  });

  $("#transRight").click(function(){  

    panX +=10;
    moveCanvasTo ('marginLeft','16px');
    setTimeout(function(){
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY,context); 
    }, 250);
    lastX = panX;
  });
  

  $("#transDown").click(function(){

    panY += 10;
    moveCanvasTo ('marginTop','16px');
    setTimeout(function(){
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY,context); 
    }, 250);
    lastY = panY;

  });
  $("#transUp").click(function(){

    panY -=10;
    moveCanvasTo ('marginTop','-16px');
    setTimeout(function(){
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY,context); 
    }, 250);
    lastY = panY;

  });

  $("#zoomUp").click(function(){
    scaleFactor *= 1.5;
  
    draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY); 
  });

  $("#zoomDown").click(function(){
    scaleFactor /= 1.5;
    
    draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY); 
  });

  canvas.addEventListener('mousedown',function (evt){
    
    initX = evt.offsetX;
    initY = evt.offsetY;

  });

  canvas.addEventListener('mouseup',function (evt){

    endX = evt.offsetX;
    endY = evt.offsetY;

    panX = (endX - initX) + lastX;
    panY = (endY - initY) + lastY;
    marginX =((endX - initX)*1.7).toString(); 
    marginY =((endY - initY)*1.7).toString();

    console.log(marginY + 'px ' + marginX + 'px');

    if ((endX - initX)!==0) {

    moveCanvasTo ('margin',marginY + 'px ' + marginX + 'px');
    setTimeout(function(){
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY,context); 
    }, 250);
      
      lastX = panX;
      lastY = panY;
    }

  });
  canvas.addEventListener('dblclick',function (evt){

    relativeX = ((evt.offsetX - lastoffsetX)/scaleFactor);
    relativeY = ((evt.offsetY - lastoffsetY)/scaleFactor);

    zoomCenterX = lastoffsetX + relativeX;  
    zoomCenterY = lastoffsetY + relativeY;

    
    console.log("desplazamiento");
    console.log(panX,panY);
    console.log("factor de escala");
    console.log(scaleFactor);
    scaleFactor *= 1.5;
    
    
    console.log("ponto clickado");
    console.log(zoomCenterX,zoomCenterY);

    draw (width, height, bounds, data, panX, panY,scaleFactor,zoomCenterX,zoomCenterY);
    lastoffsetX = zoomCenterX ;
    lastoffsetY = zoomCenterY ;



  }, false);


  $(document).on('keydown', function ( e ) {
    

    if ((e.metaKey || e.ctrlKey) && ( e.which === 187 || e.which === 43 || e.which === 61) ) {
        
      zoomCenterX = width/2;  
      zoomCenterY = height/2;

      scaleFactor *= 1.5;

      

      draw (width, height, bounds, data, panX, panY, scaleFactor,canvasMiddleX,canvasMiddleY); 
    }
    else if ((e.metaKey || e.ctrlKey) && ( e.which === 189) ) {
      
      zoomCenterX = width/2;  
      zoomCenterY = height/2;

      scaleFactor /= 1.5;
      draw (width, height, bounds, data, panX, panY, scaleFactor,canvasMiddleX,canvasMiddleY); 
    }
    else if (e.which === 37) {
      panX -= 10;
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY);       

    }
    else if (e.which === 39) {
      panX += 10;
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY);       

    }
    else if (e.which === 38) {
      panY -= 10;
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY);       

    }
    else if (e.which === 40) {
      panY += 10;
      draw (width, height, bounds, data, panX, panY, scaleFactor, canvasMiddleX, canvasMiddleY);       

    }
  });





  // DRAW AND PROJECTION FUNCTIONS
  
  function draw (width, height, bounds, data, panX, panY, scaleFactor, zoomToX, zoomToY) {
    var coords, point, latitude, longitude, xScale, yScale, scale;


    
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#00BCD4';
    context.save();
    context.translate(panX, panY);
    // context.transform(scaleFactor,0,0,scaleFactor,-(scaleFactor-1)*zoomToX,-(scaleFactor-1)*zoomToY);
    context.transform(scaleFactor,0,0,scaleFactor,-(scaleFactor-1)*zoomToX,-(scaleFactor-1)*zoomToY);
  
    

    // Determine  scale 
    xScale = width / Math.abs(bounds.xMax - bounds.xMin);
    yScale = height / Math.abs(bounds.yMax - bounds.yMin);
    scale = xScale < yScale ? xScale : yScale;


    data = data.features;

    // Loop over the features…
    for (var i = 0; i < data.length; i++) {

      // …pulling out the coordinates…
      coords = data[i].geometry.coordinates[0][0];

      // …and for each coordinate…
      for (var j = 0; j < coords.length; j++) {

        longitude = coords[j][0];
        latitude = coords[j][1];

        point = mercator(longitude, latitude);

        // Scale the points of the coordinate
        // to fit inside our bounding box
        point = {
          x: (point.x - bounds.xMin) * scale,
          y: (bounds.yMax - point.y) * scale
        };

        // If this is the first coordinate in a shape, start a new path
        if (j === 0) {

          context.beginPath();
          context.moveTo(point.x, point.y);
        // Otherwise just keep drawing
        } else {

          context.lineTo(point.x, point.y); 
        }
      }

      // select render color
      if (data[i].properties.numfloors === 0) {
        context.fillStyle = '#bfd3e6';
      }
      else if (data[i].properties.numfloors > 0 && data[i].properties.numfloors <= 5) {
        context.fillStyle = '#9ebcda';
      }
      else if (data[i].properties.numfloors > 5 && data[i].properties.numfloors <= 15) {
        context.fillStyle = '#8c96c6';
      }
      else if (data[i].properties.numfloors > 15 && data[i].properties.numfloors <= 30) {
        context.fillStyle = '#8c6bb1';
      }
      else if (data[i].properties.numfloors > 30 && data[i].properties.numfloors <= 60) {
        context.fillStyle = '#88419d';
      }
      else if (data[i].properties.numfloors > 60) {
        context.fillStyle = '#6e016b';
      }


      // Fill the path
      context.fill();    
      //context.stroke();
    }
    context.restore();
  }


  function mercator (longitude, latitude) {
    var radius = 6378137;
    var max = 85.0511287798;
    var radians = Math.PI / 180;
    var point = {};

    point.x = radius * longitude * radians;
    point.y = Math.max(Math.min(max, latitude), -max) * radians;
    point.y = radius * Math.log(Math.tan((Math.PI / 4) + (point.y / 2)));

    return point;
  }


  function moveCanvasTo (margin, pixels){
    canvas.style.transition = '0.7s';
    canvas.style[margin] = pixels;

    setTimeout(function(){ 
      canvas.style[margin] = '0px';
      canvas.style.opacity = 1;
      canvas.style.transition = '0s';
    }, 250); 
  }




// })();


