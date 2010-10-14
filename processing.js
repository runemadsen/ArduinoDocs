var polygon = {};
var drawing = false;
var toggle = false;

void setup() 
{	
	size(848, 480);
	smooth();
	noFill();
	
	polygon.points = [];
}

void draw() 
{		
	for(int i = 0; i < polygon.points.length; i++)
	{		
		fill(polygon.lineColor);
		noStroke();
		ellipse(polygon.points[i].x, polygon.points[i].y, 5, 5);

		noFill();
		stroke(polygon.lineColor);
		
		if(i > 0)
		{
			line(polygon.points[i - 1].x, polygon.points[i - 1].y, polygon.points[i].x, polygon.points[i].y);
		}
	}
}

void mousePressed()
{
	if(!drawing)
	{
		// create new polygon
		polygon = {};
		polygon.lineColor = color(random(255), random(255), random(255));
		polygon.points = [];
		
		drawing = true;
	}
	
	polygon.points.push( {x:mouseX, y:mouseY} );
	
	if(polygon.points.length >= 4)
	{
		polygon.points.push( {x:polygon.points[0].x, y:polygon.points[0].y} );
		
		console.log("Saved");
	}
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
