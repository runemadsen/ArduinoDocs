/*@pjs
isTransparent=true
*/

/* Properties
________________________________________________________ */

var components = [];
var polygon = {};
var e = {};
var toggle = false;
PGraphics p;

/* Setup
________________________________________________________ */

void setup() 
{	
	size(640, 480);
	smooth();
	noFill();
	
	components = circuit.components;
	
	polygon.lineColor = color(255, 0, 0);
	polygon.points = [];
	
	p = createGraphics(848, 480);
}

/* Draw
________________________________________________________ */

void draw() 
{		
	background(255, 255, 0, 0);
	p.background(0, 0);
	p.beginDraw();
	
	if(app.mode == "scrub" && components.length > 0 || app.newComponent)
	{
		setComponent()
		
		//drawComponents();
		
		drawLabels();

		if(videoIsReady())
		{
			targetTime = map(mouseX, 0, width, 0, getLoopLength());
			goToTime(targetTime);
		}
	}
	else if(app.mode == "draw")
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
	return components[0].points.length * 0.5;
}

/* Draw Components
________________________________________________________ */

void drawComponents()
{	
	for(int i = 0; i < components.length; i++)
	{
		drawComponent(components[i]);
	}
}

void drawComponent(c)
{
	p.noFill();
	
	p.beginShape();
	
	for(int i = 0; i < c.points.length; i++)
	{
		p.curveVertex(c.points[i].x,c.points[i].y);
	}
	
	// close shape
	for(int i = 0; i < c.points.length - 1; i++)
	{
		p.curveVertex(c.points[i].x, c.points[i].y);
	}
	
	p.endShape();
}

/* Draw
________________________________________________________ */

void drawEllipse()
{
	p.fill(255, 0, 0);
	p.ellipse(polygon.center.x, polygon.center.y, 5, 5);
	
	p.noFill();
	p.ellipseMode(CENTER);
	p.ellipse(e.x, e.y, e.w, e.h);
	p.ellipseMode(CORNER);
}

void drawLabels()
{
	for(int i = 0; i < components.length; i++)
	{
		drawLabel(components[i]);
	}
}

void drawLabel(c)
{
	reading = map(mouseX, 0, width, 0, c.points.length);
	
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
			pointsToUse.push(c.points[c.points.length + i]);
		} 
		else if (i > c.points.length - 1)
		{
		  	pointsToUse.push(c.points[i - c.points.length]);
		}
		else
		{
			pointsToUse.push(c.points[i]);
		}
	}
	
	//console.log(pointsToUse.length);

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
	if(app.mode == "draw")
	{
		polygon.points.push( {x:mouseX, y:mouseY});
		
		goToTime($("#videotag")[0].currentTime + 0.5);
	}
	
}

void keyPressed()
{
	if(key == 'c' && app.mode == "draw")
	{
		var request = {
			"points" : polygon.points,
			"circuit_id" : circuit.id,
			"name" : "test"
		};
		
	
		request.name = "test circuit";
	
		$.ajax({
			type: 'POST',
		  	url: '/components',
		  	data: request,
			dataType: "json",
		  	success: function(data) 
			{ 
				polygon.points = [];
				app.newComponent = data;
				//components.push( data  )
				//setComponent();
				app.mode = "scrub";
			}
		});
		
		
	}
}

void setComponent()
{
	if(app.newComponent)
	{
		console.log(app.newComponent)
		components.push(app.newComponent);
		app.newComponent = false;
		console.log(components);
		
	}
	
//	console.log(components);
}
