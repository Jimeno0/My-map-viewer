



// (function (){
  var data, bounds = {}, width = 800, height = 400;

  var extSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://rambo-test.carto.com:443/api/v2/sql?q=select%20ST_Extent(the_geom)%20from%20public.mnmappluto",
    "method": "GET",
  };

  var dataAjaxSettings = {
    "async": true,
    "crossDomain": true,
    "url": "https://rambo-test.carto.com:443/api/v2/sql?format=GeoJSON&q=select%20the_geom%2C%20cartodb_id%20from%20public.mnmappluto%20LIMIT%2010",
    "method": "GET",
    
  };

  $.ajax(extSettings).done(function (response) {
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
  });


  $.ajax(dataAjaxSettings).done(function (response) {
    data = response;
  });

  
  $.when( $.ajax(extSettings), $.ajax(dataAjaxSettings)).then(function() {
    console.log("suuuuuuuup");
    console.log(bounds);
    console.log(data);
    draw(width, height, bounds, data);
  
  });







  // var canvas = document.createElement('canvas');
  var canvas = document.getElementById('myCanvas');




  // var c = document.getElementById("myCanvas");
  // var ctx = c.getContext("2d");
  // ctx.fillStyle = "#FF0000";
  // ctx.fillRect(0,0,150,75);



  function draw (width, height, bounds, data) {
    var context, coords, point, latitude, longitude, xScale, yScale, scale;

    // Get the drawing context from our <canvas> and
    // set the fill to determine what color our map will be.
    context = canvas.getContext('2d');
    context.fillStyle = '#333';

    // Determine how much to scale our coordinates by
    xScale = width / Math.abs(bounds.xMax - bounds.xMin);
    yScale = height / Math.abs(bounds.yMax - bounds.yMin);
    scale = xScale < yScale ? xScale : yScale;

    // Again, we want to use the “features” key of
    // the FeatureCollection
    data = data.features;

    // Loop over the features…
    for (var i = 0; i < data.length; i++) {

      // …pulling out the coordinates…
      coords = data[i].geometry.coordinates[0][0];

      // …and for each coordinate…
      for (var j = 0; j < coords.length; j++) {

        longitude = coords[j][0];
        latitude = coords[j][1];

        // Scale the points of the coordinate
        // to fit inside our bounding box
        point = {
            x: ((longitude - bounds.xMin) * scale),
            y: ((bounds.yMax - latitude) * scale)
        };

        // If this is the first coordinate in a shape, start a new path
        if (j === 0) {
          // this.context.beginPath();
          // this.context.moveTo(point.x, point.y);

          context.beginPath();
          context.moveTo(point.x, point.y);
          console.log(point.x, point.y);

        // Otherwise just keep drawing
        } else {
          // this.context.lineTo(point.x, point.y); 

          context.lineTo(point.x, point.y); 
          console.log(point.x, point.y);
        }
      }

      // Fill the path we just finished drawing with color
      // this.context.fill();
      context.fill();
      console.log("--------------");
    }
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























// })();


