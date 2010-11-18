/*@pjs
isTransparent=true
*/

var polygon = {};
var e = {};
var allowDraw = true;
var toggle = false;
var scrubMode = false;
PGraphics p;

void setup() 
{	
	size(640, 480);
	smooth();
	noFill();
	
	polygon.lineColor = color(255, 0, 0);
	polygon.points = [];
	
	p = createGraphics(848, 480);
}

void draw() 
{		
	background(255, 255, 0, 0);
	p.background(0, 0);
	p.beginDraw();
	
	if(scrubMode)
	{
		// drawEllipse();
		
		drawCurves();
		
		drawLabel();

		if(videoIsReady())
		{
			targetTime = map(mouseX, 0, width, 0, getLoopLength());//$("#videotag")[0].duration);
			goToTime(targetTime);
		}
	}
	else
	{
		for(int i = 0; i < polygon.points.length; i++)
		{		
			p.fill(polygon.lineColor);
			p.noStroke();
			p.ellipse(polygon.points[i].x, polygon.points[i].y, 5, 5);

			p.noFill();
			p.stroke(polygon.lineColor);

			if(i > 0)
			{
				p.line(polygon.points[i - 1].x, polygon.points[i - 1].y, polygon.points[i].x, polygon.points[i].y);
			}
		}
	}
	
	p.endDraw();
	
	image(p, 0, 0);
}

function getLoopLength()
{
	return polygon.points.length * 0.5;
}

void drawCurves()
{	
	p.noFill();
	
	p.beginShape();
	
	for(int i = 0; i < polygon.points.length; i++)
	{
		p.curveVertex(polygon.points[i].x, polygon.points[i].y);
	}
	
	// close shape
	for(int i = 0; i < polygon.points.length - 1; i++)
	{
		p.curveVertex(polygon.points[i].x, polygon.points[i].y);
	}
	
	p.endShape();
}

void drawEllipse()
{
	p.fill(255, 0, 0);
	p.ellipse(polygon.center.x, polygon.center.y, 5, 5);
	
	p.noFill();
	p.ellipseMode(CENTER);
	p.ellipse(e.x, e.y, e.w, e.h);
	p.ellipseMode(CORNER);
}

void drawLabel()
{
	//pos = calculatePointOnEllipse(map(mouseX, 0, width, 0, -(2 * PI)));

	reading = map(mouseX, 0, width, 0, polygon.points.length);
	
	parts = reading.toString().split(".");
	
	bottomPoint = parseInt(parts[0]);
	
	t = reading - bottomPoint;
	
	pointsToUse = [];
	
	for(int i = bottomPoint - 1; i < bottomPoint + 3; i++ )
	{
		if(i < 0)
		{
			// -1 == length -1
			// -2 -- length -2
			pointsToUse.push(polygon.points[polygon.points.length + i]);
		} 
		else if (i > polygon.points.length - 1)
		{
		  	pointsToUse.push(polygon.points[i - polygon.points.length]);
		}
		else
		{
			pointsToUse.push(polygon.points[i]);
		}
	}
	
	console.log(pointsToUse.length);

	coords = getScreenPositionOfSpline(t, pointsToUse[0].x, pointsToUse[0].y, pointsToUse[1].x, pointsToUse[1].y, pointsToUse[2].x, pointsToUse[2].y, pointsToUse[3].x, pointsToUse[3].y);
	
	
	p.stroke(0, 0, 0);
	p.fill(255, 255, 255);
	//p.ellipse(coords[0], coords[1], 10, 10);
	p.rect(coords[0], coords[1], 50, 15);
}

function calculatePointOnEllipse(deg)
{
	int xPos = (e.w / 2) * cos(deg);
	int yPos = (e.h / 2) * sin(deg);
	
	var returnObject = {x:xPos, y:yPos};
	
	return returnObject;
}

void calcEllipse()
{
	// calculate center
	
	polygon.center = {};
	polygon.center.x = polygon.points[1].x;
	polygon.center.y = polygon.points[0].y;
	
	// calculate ellipse
	
	e.w= dist(polygon.center.x, polygon.center.y, polygon.points[0].x, polygon.points[0].y) * 2;
	e.h = dist(polygon.center.x, polygon.center.y, polygon.points[1].x, polygon.points[1].y) * 2;
	e.x = polygon.center.x;
	e.y = polygon.center.y;
}

function getScreenPositionOfSpline(t , p0x , p0y , p1x , p1y , p2x , p2y , p3x , p3y)

{
  x = 0.5 * ((2 * p1x) + (p2x - p0x) * t + (2 * p0x - 5 * p1x + 4 * p2x - p3x) * t * t + (3 * p1x + p3x - p0x - 3 * p2x) * t * t * t);
  y = 0.5 * ((2 * p1y) + (p2y - p0y) * t + (2 * p0y - 5 * p1y + 4 * p2y - p3y) * t * t + (3 * p1y + p3y - p0y - 3 * p2y) * t * t * t);
  return [x,y];
}

void mousePressed()
{
	if(allowDraw)
	{
		polygon.points.push( {x:mouseX, y:mouseY} );
		
		//console.log("Current time: " + $("#videotag")[0].currentTime);
		
		goToTime($("#videotag")[0].currentTime + 0.5);
	}
	
}

void keyPressed()
{
	if(key == 'c')
	{
		var request = {
			"points" : polygon.points,
			"circuit_id" : circuit.id,
			"name" : "test"
		};


		console.log("hj");
		console.log(request);
		request.name = "test circuit";
		
		//{:points=>[{:y=>5, :x=>10}, {:y=>20, :x=>12}], :circuit_id=>1, :name=>"resistor"}
		$.ajax({
		  type: 'POST',
		  url: '/components',
		  data: request,
		  success: function() { alert("Success"); }
		});
		
		allowDraw = false;
		
		//calcEllipse();
		
		scrubMode = true;
	}
	else if(key == 't')
	{
		
		
		/*if(toggle)
		{	
			playVideo();
		}
		else
		{
			pauseVideo();
		}

		toggle = !toggle;*/
		
		
	}
}
