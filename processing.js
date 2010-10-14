var polygon = {};
var e = {};
var allowDraw = true;
var toggle = false;
var scrubMode = false;
PGraphics p;

void setup() 
{	
	size(848, 480);
	smooth();
	noFill();
	
	polygon.lineColor = color(255, 0, 0);
	polygon.points = [];
	
	p = createGraphics(848, 480, P3D);
}

void draw() 
{		
	clearBG();
	p.beginDraw();
	
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
	
	if(scrubMode)
	{
		p.fill(255, 0, 0);
		p.ellipse(polygon.center.x, polygon.center.y, 5, 5);
		
		p.noFill();
		p.ellipseMode(CENTER);
		p.ellipse(e.x, e.y, e.w, e.h);
		p.ellipseMode(CORNER);
		
		//mouseX / wid
		
		pos = calculatePointOnEllipse(map(mouseX, 0, width, 0, -(2 * PI)));
		
		fill(255, 255, 255);
		
		rect(e.x + pos.x, e.y + pos.y, 50, 15);

		if(videoIsReady())
		{
			targetTime = map(mouseX, 0, screen.width, 0, $("#videotag")[0].duration);
			goToTime(targetTime);
		}
	}
	
	p.endDraw();
	
	image(p, 0, 0);
}

void calculatePointOnEllipse(deg)
{
	int xPos = (e.w / 2) * cos(deg);
	int yPos = (e.h / 2) * sin(deg);
	
	return {x:xPos, y:yPos};
}

void clearBG()
{
	p.loadPixels();
	for(int i = 0; i < width * height; i++) p.pixels[i] = 0;
	p.updatePixels();
}

void mousePressed()
{
	if(allowDraw)
	{
		polygon.points.push( {x:mouseX, y:mouseY} );

		if(polygon.points.length == 2)
		{		
			allowDraw = false;
			
			calcEllipse();
		}
	}
	
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
	
	scrubMode = true;
}

void keyPressed()
{
	if(toggle)
	{	
		playVideo();
	}
	else
	{
		pauseVideo();
	}
	
	toggle = !toggle;
}
