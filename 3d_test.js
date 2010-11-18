float b = 0.0;

void setup() {

size(400,400);
}

void draw() {
 background(255);
 stroke(0);
 translate(width/2,height/2);


 float a = map(mouseX,0,width,0,PI/2);
 //rotateX(a);
 noFill();
 
 beginShape();
curveVertex(84,  91 );
curveVertex(84,  91);
curveVertex(68,  19);
curveVertex(21,  17);
curveVertex(32, 100);
curveVertex(32, 100);
endShape();
 /*ellipse(0,0,300,300);

 rotate(b);
 translate(150,0);
 fill(255,0,0);
// rotateX(-a);
 ellipse(0,0,10,10);

 b+=0.01;
 */
}

/*
rotateX: function(angle) {
        var c = p.cos(angle);
        var s = p.sin(angle);
        this.apply([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]);
      },
,
apply: function() {
        var source;
        if (arguments.length === 1 && arguments[0] instanceof PMatrix2D) {
          source = arguments[0].array();
        } else if (arguments.length === 6) {
          source = Array.prototype.slice.call(arguments);
        } else if (arguments.length === 1 && arguments[0] instanceof Array) {
          source = arguments[0];
        }

        var result = [0, 0, this.elements[2],
                      0, 0, this.elements[5]];
        var e = 0;
        for (var row = 0; row < 2; row++) {
          for (var col = 0; col < 3; col++, e++) {
            result[e] += this.elements[row * 3 + 0] * source[col + 0] +
                         this.elements[row * 3 + 1] * source[col + 3];
          }
        }
        this.elements = result.slice();
      },

*/