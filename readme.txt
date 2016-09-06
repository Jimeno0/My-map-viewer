# Readme

This is a brief readme about how did I create the renderer and what decisions I took.

## Requests

I started my renderer project by trying to get the data with the Carto SQL API.

Then I figured out that It was a huge amount of data so my next step was to think about how to obtain a lighter dataset.

I tried to get just the geometries and I got a sensitive lighter dataset but then I realised that the data wasn't in a coordinate-readable format to use it without any library so I decide to get It as as a `geoJSON`.
Once I got a thinner request I started to work in the rendering.

## Rendering data

This point was a real challenge for me and one of the most excited parts to me. I never render anything without any library so I had to learn about representing data with canvas/SVG from the very beginning. It was an amazing experience understanding how it works and to start to understand how possibly map viewers, like Carto, leaflet or ArcGIS, renders data. 

The first step was to think about what was the proper way to render and fill the canvas with the dataset. For sure I will had to use a transformation to project the dataset and a scale to fit it in the canvas.

I create a `mercator()` function to call it inside the `draw()` function and transform the geographic coordinates in projected coordinates and be able to render it.

To use the full width and height browser window I decide to set the canvas width and height via JavaScript. To take advantage of the full canvas extension I decided to made a previous request to the server to get the extent of the dataset and then, using the width/height of the window and the extent of the dataset get the scale (both x and y axes and the get the greater value).

To save time instead of chaining requests I put the two of them in a `.when() .then ` jQuery method to cast them asynchronously and as soon as I got the two of them start to draw. Also to save time I decided to store the data in a variable to do not lose too much time in so many request. 

The next thing to do was to create a draw function to render the dataset every time anybody open the browser, moves through the canvas or zoom it. To do it the workflow was:
1. Determine the scale.
2. Get the features and loop over them.
3. Get each coordinate of the polygon.
4. Apply the transformation and the scale to the points.
5. If it is the first point start to draw the polygon and then continue drawing the rest of the points to the last one and fill it.

Once I got the data rendered I decided It was a good idea to render it representing an attribute. After a brief study of the fields I decide to render it by the number of floors. To do it I add the `numfloor` field to the data request and then in the `draw()` function right before to fill the polygons check the range of the number of floors and apply the correct fill color.

## Panning

You can pan with:
* Direction buttons
* Keyboard arrows
* Mouse dragging

When I check that the dataset renders ok I started with the panning stuff. To do it I had to dig into the canvas methods to figure out how to do it. The best result I found was to use the `.translate()` method.

I decided to work against the coordinates obtained applying the scale (without the zoom factor) and store the pan x and y movement. This way I can always obtain the last translation coordinates and use it on the next translation.

For the panning buttons and arrows I just added a `+ - 10` to the stored pan movement.

For the mouse panning I  get the first coordinate where I “grab” the canvas and check if there is a movement. If it is I get the last coordinate, calculate the difference, add it to the panning variables and then `draw()`.

## Zooming

You can zoom in/out using:

* Zoom in/out buttons
* Ctrl+
* Double click

In the canvas the zoom is always done respect to the origin coordinates. I didn't want it working this way because I wanted to zoom in the screen centre, if I press any zoom in/out button, or at the mouse pointer, in case of double click.

To solve the zooming challenge  once again I had to take a look at the canvas documentation. After some research work I decided that the best solution was to use the `transform()` method because it allows you to pass a scaling parameter ( the zoom level at the current position) and a movement (to the screen centre or to the mouse pointer) obtaining a translation to the position we are interested at and applying the zoom we need to it.

## Animations

The last point I worked at was the panning animations. To remove the slow-movement feeling I create a `moveCanvasTo()` function where, by moving the canvas, I created an animated effect. I also had to add a delay to be able to apply the effect, other ways the effect didn't worked. Adding a delay I'm aware that are not best practices but it helped to had a better user experience.



