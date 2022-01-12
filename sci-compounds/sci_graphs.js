//############################################################################
//       SCI: plot basics
//       by Brian T Kaney, 2015-2017
//############################################################################

function value2DPt(x,y) {
  this.x = x;
  this.y = y;
  }

//----------------------------------------------------------------------------

function valueRect(x1,y1,x2,y2) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  }

valueRect.prototype.width = function() {
  return (this.x2-this.x1);
  };

valueRect.prototype.height = function() {
  return (this.y2-this.y1);
  };

valueRect.prototype.x_fraction = function(x) {
  if(this.width()!=0)  return (x - this.x1)/this.width();
  else                 return 0;
  };

valueRect.prototype.y_fraction = function(y) {
  if(this.height()!=0)  return (y - this.y1)/this.height();
  else                  return 0;
  };

//----------------------------------------------------------------------------

function screenCartesian() {
  this.screen = new valueRect(0,0,100,100);
  this.coord  = new valueRect(0,0,100,100);
  }

screenCartesian.prototype.setScreenRect = function(x_origin,y_origin,width,height) {
  this.screen.x1 = x_origin;
  this.screen.y1 = y_origin;
  this.screen.x2 = x_origin + width;
  this.screen.y2 = y_origin - height;
  };

screenCartesian.prototype.setCartesianRect = function(min_x,max_x,min_y,max_y) {
  this.coord.x1 = min_x;
  this.coord.y1 = min_y;
  this.coord.x2 = max_x;
  this.coord.y2 = max_y;
  };

screenCartesian.prototype.screenXFromCoordX = function(x) {
  return this.screen.x1 + this.screen.width()*this.coord.x_fraction(x);
  };

screenCartesian.prototype.screenDelXFromCoordDelX = function(x) {
  return this.screen.width()*this.coord.x_fraction(x);
  };

screenCartesian.prototype.screenYFromCoordY = function(y) {
  return this.screen.y1 + this.screen.height()*this.coord.y_fraction(y);
  };

screenCartesian.prototype.screenDelYFromCoordDelY = function(y) {
  return this.screen.height()*this.coord.y_fraction(y);
  };

screenCartesian.prototype.coordXFromScreenX = function(x) {
  return this.coord.x1 + this.coord.width()*this.screen.x_fraction(x);
  };

screenCartesian.prototype.coordYFromScreenY = function(y) {
  return this.coord.y1 + this.coord.height()*this.screen.y_fraction(y);
  };

screenCartesian.prototype.drawBackground = function(fill_color,ctx) {
  ctx.fillStyle = fill_color;
  ctx.fillRect(this.screen.x1,this.screen.y2,this.screen.x2-this.screen.x1,this.screen.y1-this.screen.y2);
  };

screenCartesian.prototype.drawGrid = function(num_x,num_y,line_color,ctx) {   
/*  There is an old RectangleGrid object much farther down.  Is it still needed (probably)?  If so how
    could it dovetail with this?  This is so much shorter than the old object.  Why was it so big?  */

  ctx.strokeStyle = line_color;
  for(var i=0;i<=num_x;++i) {
    drawCleanVertLine(this.screen.x1+i*this.screen.width()/num_x,this.screen.y1,this.screen.y2,ctx);
    }
  for(var i=0;i<=num_y;++i) {
    drawCleanHorizLine(this.screen.x1,this.screen.x2,this.screen.y1+i*this.screen.height()/num_y,ctx);
    }
  };

//  All x's and y's in next seven methods are in coord values and not pixel values.  A key feature - should the names reflect this?
//  Is another set of screen pixel centric methods worthwhile?  Prob not, but they won't have all the coversions and could be more
//  compact - is there a compelling use case.  
screenCartesian.prototype.drawVertBar = function(x1,x2,fill_color,ctx) {
  ctx.fillStyle = fill_color;
  ctx.fillRect(this.screenXFromCoordX(x1-this.coord.x1),this.screen.y2,this.screenDelXFromCoordDelX(x2-x1),this.screen.y1-this.screen.y2);
  };

screenCartesian.prototype.drawVertLine = function(x,stroke_color,line_width,ctx) {
  ctx.lineWidth = line_width;
  ctx.strokeStyle = stroke_color;
  drawCleanVertLine(this.screenXFromCoordX(x-this.coord.x1),this.screen.y1,this.screen.y2,ctx);
  };

screenCartesian.prototype.drawVertTic = function(x,y1,y2,stroke_color,line_width,ctx) {
  ctx.lineWidth = line_width;
  ctx.strokeStyle = stroke_color;
  drawCleanVertLine(this.screenXFromCoordX(x-this.coord.x1),this.screen.y1-y1,this.screen.y1-y2,ctx);
  };

screenCartesian.prototype.drawHorizBar = function(y1,y2,fill_color,ctx) {
  ctx.fillStyle = fill_color;
  ctx.fillRect(this.screen.x1,this.screenYFromCoordY(y1-this.coord.y1),this.screen.x2-this.screen.x1,this.screenDelYFromCoordDelY(y2-y1));
  };

/*  This is a pix centric version from another file (see note above on coord vs pix values). Purge or pursue further.
screenCartesian.prototype.drawHorizBar = f u n c t i o n(y1,y2,fill_color,ctx) {
  ctx.fillStyle = fill_color;
  ctx.fillRect(this.screen.x1,y1,this.screen.height,y2-y1);
  };
*/

screenCartesian.prototype.drawHorizLine = function(y,stroke_color,line_width,ctx) {
  ctx.lineWidth = line_width;
  ctx.strokeStyle = stroke_color;
  drawCleanHorizLine(this.screen.x1,this.screen.x2,this.screenYFromCoordY(y-this.coord.y1),ctx);
  };

screenCartesian.prototype.drawXText = function(str,x,align_mode,y_shift,font,text_color,ctx) {
  ctx.fillStyle = text_color;
  ctx.font = font;
  if(align_mode=="center")  ctx.fillText(str,this.screenXFromCoordX(x-this.coord.x1)-ctx.measureText(str).width/2,this.screen.y1-y_shift);
  if(align_mode=="left")    ctx.fillText(str,this.screenXFromCoordX(x-this.coord.x1),this.screen.y1-y_shift);
  };

//----------------------------------------------------------------------------

function plotYPointsVsConstantXIntervals(canvas_id,rect,y_data,missing_thresh,first_x,last_x,symbol_style,symbol_type) {
  if(arguments.length==7)  var symbol_type = "dot";
  var overflow_mode = "chop";    //---figure out way to set this later?  have y_data, misssing_thresh and overflow_mode and sybbol type all in a mini object?

  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.fillStyle = symbol_style.fill_color;
  ctx.strokeStyle = symbol_style.stroke_color;

  var num_pts = y_data.length;
  for(var i=0;i<num_pts;++i) {
    if(y_data[i] <= missing_thresh)  continue;
    var x = rect.screenXFromCoordX(first_x + i*(last_x-first_x)/(num_pts-1));
    var y = rect.screenYFromCoordY(y_data[i]);
    if(overflow_mode=='chop' && (y>rect.screen.y1 || y<rect.screen.y2))  continue;
//    if(symbol_type=='dot')  drawCanvasCircle(x,y,2,symbol_style,'',ctx);
    if(symbol_type=='dot')  drawCanvasCircle(x,y,1,symbol_style,'',ctx);
    if(symbol_type=='medium_dot')  drawCanvasCircle(x,y,2,symbol_style,'',ctx);
    }
  };




function plotLineSegments(canvas_id,rect,y_data,missing_thresh,first_x,last_x,line_style) {  //--probably should be method of line plotting object like before, but maybe in a different way.  I like the long arg list here allowing a lot of set-up on one line.  What vars do all plots have in common? only those should be part of the object.  For instance, they will all share a missing_thresh and overflow handling mode, right?
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.lineWidth = line_style.line_width;
  ctx.strokeStyle = line_style.stroke_color;

  var num_segments = y_data.length-1;
  for(var i=0;i<num_segments;++i) {
    if(y_data[i]<=missing_thresh || y_data[i+1]<=missing_thresh)  continue;

    drawLine(rect.screenXFromCoordX(first_x + i*(last_x-first_x)/(num_segments)),rect.screenYFromCoordY(y_data[i]),
             rect.screenXFromCoordX(first_x + (i+1)*(last_x-first_x)/(num_segments)),rect.screenYFromCoordY(y_data[i+1]),ctx);

//    if(overflow_mode=='chop' && (y>rect.screen.y1 || y<rect.screen.y2))  continue;   future implementation
    }
  }




function plotPointsIndependentXY(canvas_id,rect,x_data,y_data,missing_x_thresh,missing_y_thresh,symbol_style,symbol_type) {
//  if(arguments.length==7)  var symbol_type = "dot";
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.fillStyle = symbol_style.fill_color;
  ctx.strokeStyle = symbol_style.stroke_color;

  var num_pts = y_data.length;
  for(var i=0;i<num_pts;++i) {
    if(x_data[i] <= missing_x_thresh || y_data[i] <= missing_y_thresh)  continue;
    var x = rect.screenXFromCoordX(x_data[i]);
    var y = rect.screenYFromCoordY(y_data[i]);

//    if(overflow_mode=='chop' && (y>rect.screen.y1 || y<rect.screen.y2))  continue;
//    if(symbol_type=='dot')  drawCanvasCircle(x,y,2,symbol_style,'',ctx);
    if(symbol_type=='small_dot')   drawCanvasCircle(x,y,1.2,symbol_style,'',ctx);
    if(symbol_type=='medium_dot')  drawCanvasCircle(x,y,2,symbol_style,'',ctx);
    }
  }

function plotLineSegmentsIndependentXY(canvas_id,rect,x_data,y_data,missing_x_thresh,missing_y_thresh,line_style) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.lineWidth = line_style.line_width;
  ctx.strokeStyle = line_style.stroke_color;

  var num_segments = x_data.length-1;
  for(var i=0;i<num_segments;++i) {
    if(x_data[i]<=missing_x_thresh || x_data[i+1]<=missing_x_thresh || 
       y_data[i]<=missing_y_thresh || y_data[i+1]<=missing_y_thresh)  continue;

    drawLine(rect.screenXFromCoordX(x_data[i]),rect.screenYFromCoordY(y_data[i]),rect.screenXFromCoordX(x_data[i+1]),rect.screenYFromCoordY(y_data[i+1]),ctx);
    }
  }



function plotYShadedVsConstantXIntervals(canvas_id,rect,y_data,missing_thresh,first_x,last_x,shade_style) {  //---need more styles - 2 color, 1 line thick, 3 ocolor, text font and color, ccombos, etc
  var ctx = document.getElementById(canvas_id).getContext('2d');
  var overflow_mode = "chop";    //---figure out way to set this later?  have y_data, misssing_thresh and overflow_mode and sybbol type all in a mini object?

  var num_pts = y_data.length;
  for(var i=1;i<num_pts;++i) {
    if(y_data[i-1] == 0 && y_data[i] == 0)  continue;

    if(y_data[i-1] <= missing_thresh || y_data[i] <= missing_thresh) {
      ctx.fillStyle = "#F2F2F2";
      ctx.strokeStyle = "#F2F2F2";
      var x_right = rect.screenXFromCoordX(first_x + i*(last_x-first_x)/(num_pts-1));
      var x_left = rect.screenXFromCoordX(first_x + (i-1)*(last_x-first_x)/(num_pts-1));
      ctx.fillRect(x_left,rect.screen.y1,x_right-x_left,rect.screen.height());
      ctx.strokeRect(x_left,rect.screen.y1,x_right-x_left,rect.screen.height());
      continue;
      }

    if((y_data[i-1]>=0 && y_data[i]>=0) || (y_data[i-1]<=0 && y_data[i]<=0)) {
      var x_right = rect.screenXFromCoordX(first_x + i*(last_x-first_x)/(num_pts-1));
      var x_left = rect.screenXFromCoordX(first_x + (i-1)*(last_x-first_x)/(num_pts-1));
      var y_top_right = rect.screenYFromCoordY(y_data[i]);
      var y_top_left = rect.screenYFromCoordY(y_data[i-1]);
      var y_mid = rect.screenYFromCoordY(0);

      if(overflow_mode=='chop') {
        if(y_top_right>rect.screen.y1) {
          y_top_right = rect.screen.y1;
//          x_right = x_left + (x_right-x_left)*rect.screen.y1/y_top_right;
          }
        if(y_top_right<rect.screen.y2) {
          y_top_right = rect.screen.y2;
//          x_right = x_left + (x_right-x_left)*rect.screen.y2/y_top_right;
          }
        if(y_top_left>rect.screen.y1) {
          y_top_left = rect.screen.y1;
//          x_left = x_right - (x_right-x_left)*rect.screen.y1/y_top_right;
          }
        if(y_top_left<rect.screen.y2) {
          y_top_left = rect.screen.y2;
//          x_left = x_right - (x_right-x_left)*rect.screen.y2/y_top_right;
          }
        }

      if(y_data[i]>0 || y_data[i-1]>0) {
        ctx.fillStyle = shade_style.fill_color;
        ctx.strokeStyle = shade_style.fill_color;
        }
      if(y_data[i]<0 || y_data[i-1]<0) {
        ctx.fillStyle = shade_style.stroke_color;
        ctx.strokeStyle = shade_style.stroke_color;
        }
      drawCanvasPolygonFullList(x_right,y_top_right,ctx,'both',3,x_left,y_top_left,x_left,y_mid,x_right,y_mid);
      }
    else {
      var x_right = rect.screenXFromCoordX(first_x + i*(last_x-first_x)/(num_pts-1));
      var x_left = rect.screenXFromCoordX(first_x + (i-1)*(last_x-first_x)/(num_pts-1));
      var x_cross = x_left + (x_right-x_left)*y_data[i]/(y_data[i]-y_data[i-1]);
      var y_top_right = rect.screenYFromCoordY(y_data[i]);
      var y_top_left = rect.screenYFromCoordY(y_data[i-1]);
      var y_mid = rect.screenYFromCoordY(0);

      if(y_data[i]>0) {
        ctx.fillStyle = shade_style.fill_color;
        ctx.strokeStyle = shade_style.fill_color;
        drawCanvasPolygonFullList(x_right,y_top_right,ctx,'both',2,x_cross,y_mid,x_right,y_mid);
        ctx.fillStyle = shade_style.stroke_color;
        ctx.strokeStyle = shade_style.stroke_color;
        drawCanvasPolygonFullList(x_cross,y_mid,ctx,'both',2,x_left,y_top_left,x_left,y_mid);
        }
      else {
        ctx.fillStyle = shade_style.stroke_color;
        ctx.strokeStyle = shade_style.stroke_color;
        drawCanvasPolygonFullList(x_right,y_top_right,ctx,'both',2,x_cross,y_mid,x_right,y_mid);
        ctx.fillStyle = shade_style.fill_color;
        ctx.strokeStyle = shade_style.fill_color;
        drawCanvasPolygonFullList(x_cross,y_mid,ctx,'both',2,x_left,y_top_left,x_left,y_mid);
        }
      }
    }
  };



//  Older stuff for comparison


//----------------------------------------------------------------------------
//    CartesianCoordinateSystem object
//----------------------------------------------------------------------------

// new version of first two is basically the same

function Point2D(x,y) {
  this.x = x;
  this.y = y;
  }

function ScreenRect(x_origin,y_origin,width,height) {
  this.origin = new Point2D(x_origin,y_origin);
  this.width  = width;
  this.height = height;
  return; 
  }

// removed units from next one, for now.  never used.  would only be needed if you had to two sets of units and had to convert.  or you
// just needed to store the string for printing purposes.  even if I put this back in for physics purposes, it would not need to be specified
// or even thought about if not used.  it would not appear in the declaration/constructor statement like it is here.  most of this would be
// moved to 'set' methods anyway.

function CartesianRect(x_units,min_x,max_x,y_units,min_y,max_y) {
  this.x_units = x_units;   //--not used yet, needed?
  this.min_x   = min_x;
  this.max_x   = max_x;

  this.y_units = y_units;
  this.min_y   = min_y;
  this.max_y   = max_y;
  return; 
  }

//  this is the same as above, except I added another variable for type.  the choices were going to be 'cart' and 'polar' and 'log'. only cart was
//  ever used.  no need to add this complication here.  treat as three separate objects in future?  might want them integrated in some physics application
//  not relevant here.

//  x_type, y_type were never used as shown by the code bug below (they are assigned to the same units vars as the lines above).

function CoordRect(x_units,x_type,min_x,max_x,y_units,y_type,min_y,max_y) {
  this.x_units = x_units;
  this.x_units = x_type;
  this.min_x   = min_x;
  this.max_x   = max_x;

  this.y_units = y_units;
  this.y_units = y_type;
  this.min_y   = min_y;
  this.max_y   = max_y;
  return; 
  }

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

//  first of two dual space covering objects (screen pixels and some cartesian value space.
//
//  either of these may have capability not yet transfered to the newer version

function ScreenCartesian() {
  this.screen = new ScreenRect(0,0,800,640);
  this.coord  = new CartesianRect("m",0,100,"m",0,100);
  return; 
  }

ScreenCartesian.prototype.SetScreen = function(x_origin,y_origin,width,height) {
  this.screen.origin.x = x_origin;
  this.screen.origin.y = y_origin;
  if(width==0) width = 1;
  if(height==0) height = 1;
  this.screen.width = width;
  this.screen.height = height;
  return;
  };

ScreenCartesian.prototype.SetCartesian = function(x_units,min_x,max_x,y_units,min_y,max_y) {
  this.coord.x_units = x_units;
  this.coord.min_x   = min_x;
  this.coord.max_x   = max_x;

  this.coord.y_units = y_units;
  this.coord.min_y   = min_y;
  this.coord.max_y   = max_y;
  return;
  };

ScreenCartesian.prototype.ScrPtFromCoordPt = function(coord_pt) {
  var scr_pt = new Point2D(-9876,-9876);
  var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
  var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
  var scr_pt = new Point2D(this.screen.origin.x+(coord_pt.x-this.coord.min_x)/x_scale,this.screen.origin.y-(coord_pt.y-this.coord.min_y)/y_scale);
  return scr_pt;
  };



ScreenCartesian.prototype.CoordPtFromScrPt = function(scr_pt) {
  var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
  var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
  var coord_pt = new Point2D(this.coord.min_x + (scr_pt.x-this.screen.origin.x)*this.x_scale,this.coord.min_y +(this.screen.origin.y-scr_pt.y)*this.y_scale);
  return coord_pt;
  };

//----------------------------------------------------------------------------

//  second of two dual space covering objects (screen pixels and some cartesian value space).  similar to above, but uses the CoordRect with 'type' - which 
//  is never used anyway.

function ScreenCoord() {
  this.screen = new ScreenRect(0,0,800,640);
  this.coord  = new CoordRect("m","cart",0,100,"m","cart",0,100);
  return; 
  }

ScreenCoord.prototype.SetScreen = function(x_origin,y_origin,width,height) {
  this.screen.origin.x = x_origin;
  this.screen.origin.y = y_origin;
  if(width==0) width = 1;
  if(height==0) height = 1;
  this.screen.width = width;
  this.screen.height = height;
  return;
  };

ScreenCoord.prototype.SetCoord = function(x_units,x_type,min_x,max_x,y_units,y_type,min_y,max_y) {
  this.coord.x_units = x_units;
  this.coord.x_type  = x_type;
  this.coord.min_x   = min_x;
  this.coord.max_x   = max_x;

  this.coord.y_units = y_units;
  this.coord.y_type  = y_type;
  this.coord.min_y   = min_y;
  this.coord.max_y   = max_y;
  return;
  };
 
ScreenCoord.prototype.ScrPtFromCoordPt = function(coord_pt) {
  var scr_pt = new Point2D(-9876,-9876);

  if(this.coord.x_type == "cart") {
    var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
    scr_pt.x = this.screen.origin.x + (coord_pt.x-this.coord.min_x)/x_scale;
    }
  if(this.coord.x_type == "log" && coord_pt.x>0) {
    var x_scale = (Math.log(this.coord.max_x)-Math.log(this.coord.min_x))/this.screen.width;
    scr_pt.x = this.screen.origin.x + (Math.log(coord_pt.x)-Math.log(this.coord.min_x))/x_scale;
    }

  if(this.coord.y_type == "cart") {
    var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
    scr_pt.y = this.screen.origin.y - (coord_pt.y-this.coord.min_y)/y_scale;
    }
  if(this.coord.y_type == "log" && coord_pt.y>0) {
    var y_scale = (Math.log(this.coord.max_y)-Math.log(this.coord.min_y))/this.screen.height;
    scr_pt.y = this.screen.origin.y - (Math.log(coord_pt.y)-Math.log(this.coord.min_y))/y_scale;
    }

  return scr_pt;
  };

//---not tested anywhere
// ---not completed
ScreenCoord.prototype.CoordPtFromScrPt = function(scr_pt) {
  var coord_pt = new Point2D(this.coord.min_x,this.coord.min_y);

  if(this.coord.x_type == "cart") {
    var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
    coord_pt.x = this.coord.min_x + (scr_pt.x-this.screen.origin.x)*this.x_scale;
    }
  if(this.coord.x_type == "log") {
    }

  if(this.coord.y_type == "cart") {
    var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
    coord_pt.y = this.coord.min_y + (this.screen.origin.y-scr_pt.y)*this.y_scale;
    }
  if(this.coord.y_type == "log") {
    }

  return coord_pt;
  };




function LinePlot(line_width,line_color,symbol_type,symbol_color,missing_thresh) {
  this.line_width     = line_width;
  this.line_color     = line_color;
  this.symbol_type    = symbol_type;
  this.symbol_color   = symbol_color;
  this.missing_thresh = missing_thresh;
  return;
  }

LinePlot.prototype.DrawDepDataVsIndepData = function(canvas_id,rect,num_pts,first_x_value,last_x_value,y_data,mode) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  var value = new Point2D(0,0);
  var point = new Point2D(0,0);

  if(mode=="solid_to_origin") {
    for(var i=1;i<num_pts;++i) {
      if(y_data[i-1]>=this.missing_thresh && y_data[i]>=this.missing_thresh) {

        if(y_data[i-1]>=0 || y_data[i]>=0)  ctx.fillStyle = "#FF9999";
        else                                ctx.fillStyle = "#9999FF";
        if(y_data[i-1]>=0 || y_data[i]>=0)  ctx.strokeStyle = "#FF9999";
        else                                ctx.strokeStyle = "#9999FF";
       
        var value_ur = new Point2D(first_x_value + i*(last_x_value-first_x_value)/(num_pts-1),y_data[i]);
        var value_ul = new Point2D(first_x_value + (i-1)*(last_x_value-first_x_value)/(num_pts-1),y_data[i-1]);
        var value_ll = new Point2D(first_x_value + (i-1)*(last_x_value-first_x_value)/(num_pts-1),0);
        var value_lr = new Point2D(first_x_value + i*(last_x_value-first_x_value)/(num_pts-1),0);
        var point_ur = rect.ScrPtFromCoordPt(value_ur);
        var point_ul = rect.ScrPtFromCoordPt(value_ul);
        var point_ll = rect.ScrPtFromCoordPt(value_ll);
        var point_lr = rect.ScrPtFromCoordPt(value_lr);

        ctx.beginPath();
        ctx.moveTo(point_ur.x,point_ur.y);
        ctx.lineTo(point_ul.x,point_ul.y);
        ctx.lineTo(point_ll.x,point_ll.y);
        ctx.lineTo(point_lr.x,point_lr.y);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        }
      }
    }

  if(this.line_width>0 && (mode=="line" || mode=="dot")) {
    ctx.lineWidth = this.line_width;
    ctx.strokeStyle = this.line_color;

    var start = 1;
    ctx.beginPath();
    for(var i=0;i<num_pts;++i) {
      if(y_data[i]<this.missing_thresh) {
        start = 1;
        continue;
        }

      if(y_data[i]>=this.missing_thresh) {
        value.x = first_x_value + i*(last_x_value-first_x_value)/(num_pts-1);
        value.y = y_data[i];
        point = rect.ScrPtFromCoordPt(value);

        if(start==0)  ctx.lineTo(point.x,point.y);
        if(start==1) {
          ctx.moveTo(point.x,point.y);
          start = 0;
          }
        }
      }
    ctx.stroke();
    ctx.closePath();
    }

if(mode=="dot" || mode=="dot_noline") {

//slapped in for gauge/qpe plots, but mode arg was just added then - also used by prisms and that arg is not used so mode is undefined here - should still work   ~2015
//  much later added dot_noline for wind dir in prisms (June 2016)  horrible state of affairs.  Now mode arg is really required for all
  ctx.fillStyle = this.symbol_color;  //---only one symbol type
  for(var i=0;i<num_pts;++i) {
    if(y_data[i]>=this.missing_thresh) {
      value.x = first_x_value + i*(last_x_value-first_x_value)/(num_pts-1);
      value.y = y_data[i];
      point = rect.ScrPtFromCoordPt(value);
//      ctx.fillRect(point.x-2,point.y-2,5,5);

        ctx.beginPath();
//        ctx.arc(point.x,point.y,2,0,Math.PI*2,true);
        ctx.arc(point.x,point.y,1,0,Math.PI*2,true);
        ctx.fill();
//        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  return;
  };

/*

Still active in sci_plots.js

LinePlot.prototype.DrawDepDataVsIndepData = f u n c t i o n(canvas_id,rect,num_pts,first_x_value,last_x_value,y_data) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  var value = new Point2D(0,0);
  var point = new Point2D(0,0);

  if(this.line_width>0) {
    ctx.lineWidth = this.line_width;
    ctx.strokeStyle = this.line_color;

    var start = 1;
    ctx.beginPath();
    for(var i=0;i<num_pts;++i) {
      if(y_data[i]<this.missing_thresh) {

//---only one of the two lines was active at any one time
//        start = 1;
        if(i>3 && y_data[i-3]<this.missing_thresh && y_data[i-2]<this.missing_thresh && y_data[i-1]<this.missing_thresh)  start = 1;
//---------------------

        continue;
        }

      if(y_data[i]>=this.missing_thresh) {
        value.x = first_x_value + i*(last_x_value-first_x_value)/(num_pts-1);
        value.y = y_data[i];
        point = rect.ScrPtFromCoordPt(value);

        if(start==0)  ctx.lineTo(point.x,point.y);
        if(start==1) {
          ctx.moveTo(point.x,point.y);
          start = 0;
          }
        }
      }
    ctx.stroke();
    ctx.closePath();
    }

  ctx.fillStyle = this.symbol_color;  //---only one symbol type
  for(var i=0;i<num_pts;++i) {
    if(y_data[i]>=this.missing_thresh) {
      value.x = first_x_value + i*(last_x_value-first_x_value)/(num_pts-1);
      value.y = y_data[i];
      point = rect.ScrPtFromCoordPt(value);
//      ctx.fillRect(point.x-1,point.y-1,3,3);
//      ctx.fillRect(point.x-2,point.y-2,5,5);

              //---borrowed from next method - its a mess
        ctx.beginPath();
        ctx.arc(point.x,point.y,2,0,Math.PI*2,true);
        ctx.fill();
//---two versions, each with just one of these lines active.  figure it out.
        ctx.closePath();
//        ctx.stroke();    older ZDR vs Z Scatterplot Version
//------------------
      }
    }
  return;
  };
*/

//--Above simplifications are not made below yet...

LinePlot.prototype.DrawYDataVsXData = function(canvas_id,rect,num_pts,x_data,y_data) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  var plot_x,plot_y;

  if(this.line_width>0) {
    ctx.lineWidth = this.line_width;
    ctx.strokeStyle = this.line_color;

    var start = 1;
    ctx.beginPath();
    for(var i=0;i<=num_pts;++i) {
      if(y_data[i]<this.missing_thresh) {
        start = 1;
        continue;
        }

      if(y_data[i]>=this.missing_thresh) {
        plot_x = rect.screen.origin.x + (x_data[i]-rect.coord.min_x)*(rect.screen.width/(rect.coord.max_x-rect.coord.min_x));
        plot_y = rect.screen.origin.y - (y_data[i]-rect.coord.min_y)*(rect.screen.height/(rect.coord.max_y-rect.coord.min_y));

        if(start==0)  ctx.lineTo(plot_x,plot_y);
        if(start==1) {
          ctx.moveTo(plot_x,plot_y);
          start = 0;
          }
        }
      }
    ctx.stroke();
    ctx.closePath();
    }


  if(this.symbol_type=="big_dot")  {
    ctx.fillStyle = this.symbol_color;
    ctx.strokeStyle = this.symbol_color;
    for(var i=0;i<=num_pts;++i) {
      if(y_data[i]>=0) {
        plot_x = rect.screen.origin.x + (x_data[i]-rect.coord.min_x)*(rect.screen.width/(rect.coord.max_x-rect.coord.min_x));
        plot_y = rect.screen.origin.y - (y_data[i]-rect.coord.min_y)*(rect.screen.height/(rect.coord.max_y-rect.coord.min_y));

        ctx.beginPath();
        ctx.arc(plot_x,plot_y,7,0,Math.PI*2,true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        }
      }
    }

  else {
    ctx.fillStyle = this.symbol_color;
    for(var i=0;i<=num_pts;++i) {
      if(y_data[i]>=0) {
        plot_x = rect.screen.origin.x + (x_data[i]-rect.coord.min_x)*(rect.screen.width/(rect.coord.max_x-rect.coord.min_x));
        plot_y = rect.screen.origin.y - (y_data[i]-rect.coord.min_y)*(rect.screen.height/(rect.coord.max_y-rect.coord.min_y));
        ctx.fillRect(plot_x-2,plot_y-2,5,5);
        }
      }
    }

  return;
  };
 

function dataPalette(num_colors) {
  this.num_colors = num_colors;
  this.mode       = "ge";
  this.color      = new Array(num_colors);
  this.cutoff     = new Array(num_colors-1);
  }

dataPalette.prototype.getColor = function(data_value) {
  ret_color = this.color[0];
  if(this.mode == "ge") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  if(this.mode == "gt") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  return ret_color;
  };


function DataPalette(num_colors) {
  this.num_colors = num_colors;
  this.mode       = "ge";
  this.color      = new Array(num_colors);
  this.cutoff     = new Array(num_colors-1);
  }

DataPalette.prototype.GetColor = function(data_value) {
  ret_color = this.color[0];
  if(this.mode == "ge") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  if(this.mode == "gt") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  return ret_color;
  };


function ruler() {
  this.x_origin = 0;
  this.y_origin = 0;
  this.rule_length = 100;
  this.orientation = "horiz";
  this.color = "#000000";
  this.rule_width = 1;

  this.num_major_div = 10;
  this.major_tic_length = 12;
  this.major_tic_width = 1;

  this.num_minor_div = 20;
  this.minor_tic_length = 6;
  this.minor_tic_width = 1;

  this.min_label = 0;
  this.max_label = 10;
  this.num_decimals = 0;

  this.x_off = -8;  //---default is suited to vertical implementation
  this.y_off = 5;

  this.label_font = "bold 12pt Arial";
  this.title_font = "bold 20pt Arial";
  this.title = "test";

  this.temp_hard_y_shift=0;   //  only used in Z vs ZDR scatter page years ago, set to about 8 or 10 to shift axis label over
  }

ruler.prototype.setRule = function(x_origin,y_origin,rule_length,orientation,color,rule_width) {
  this.x_origin = x_origin;
  this.y_origin = y_origin;
  this.rule_length = rule_length;
  this.orientation = orientation;
  this.color = color;
  this.rule_width = rule_width;

  return;
  };

ruler.prototype.setTics = function(num_major_div,major_tic_length,major_tic_width,num_minor_div,minor_tic_length,minor_tic_width) {
  this.num_major_div = num_major_div;
  this.major_tic_length = major_tic_length;
  this.major_tic_width = major_tic_width;

  this.num_minor_div = num_minor_div;
  this.minor_tic_length = minor_tic_length;
  this.minor_tic_width = minor_tic_width;

  return;
  };

ruler.prototype.setLabels = function(min_label,max_label,num_decimals,x_off,y_off,label_font,title_font,title) {
  this.min_label = min_label;
  this.max_label = max_label;
  this.num_decimals = Math.floor(num_decimals);
  if(this.num_decimals<0)  this.num_decimals = 0;
  if(this.num_decimals>3)  this.num_decimals = 3;
  this.x_off = x_off;
  this.y_off = y_off;

  this.title_font = title_font;
  this.label_font = label_font;
  this.title = title;

  return;
  };

ruler.prototype.drawRule = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.color;
  var major_offset = 0.5*this.rule_width%2;

  ctx.lineWidth = this.rule_width;
  ctx.beginPath();
  if(this.orientation == "vert") {
    ctx.moveTo(this.x_origin+major_offset,this.y_origin);
    ctx.lineTo(this.x_origin+major_offset,this.y_origin-this.rule_length);
    }
  if(this.orientation == "horiz") {
    ctx.moveTo(this.x_origin,this.y_origin+major_offset);
    ctx.lineTo(this.x_origin+this.rule_length,this.y_origin+major_offset);
    }
  ctx.stroke();
  ctx.closePath();

  return;
  };

ruler.prototype.drawTics = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.color;
  var major_offset = 0.5*this.major_tic_width%2;
  var minor_offset = 0.5*this.minor_tic_width%2;

  ctx.lineWidth = this.minor_tic_width;
  for(var i=0;i<=this.num_minor_div;++i) {
    ctx.beginPath();
    if(this.orientation == "vert") {
      ctx.moveTo(this.x_origin,this.y_origin+minor_offset-Math.floor(0.5+i*(this.rule_length)/this.num_minor_div));
      ctx.lineTo(this.x_origin-this.minor_tic_length,this.y_origin+minor_offset-Math.floor(0.5+i*(this.rule_length)/this.num_minor_div));
      }
    if(this.orientation == "horiz") {
      ctx.moveTo(this.x_origin+minor_offset+Math.floor(0.5+i*(this.rule_length)/this.num_minor_div),this.y_origin+1+minor_offset);
      ctx.lineTo(this.x_origin+minor_offset+Math.floor(0.5+i*(this.rule_length)/this.num_minor_div),this.y_origin+this.minor_tic_length+1+minor_offset);
      }
    ctx.stroke();
    ctx.closePath();
    }

  ctx.lineWidth = this.major_tic_width;
  for(var i=0;i<=this.num_major_div;++i) {
    ctx.beginPath();
    if(this.orientation == "vert") {
      ctx.moveTo(this.x_origin,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      ctx.lineTo(this.x_origin-this.major_tic_length,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      }
    if(this.orientation == "horiz") {
      ctx.moveTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+1+major_offset);
      ctx.lineTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+this.major_tic_length+1+major_offset);
      }
    ctx.stroke();
    ctx.closePath();
    }

  return;
  };

ruler.prototype.drawLabels = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.font = this.label_font;

  var message;
  var value;
  for(var i=0;i<=this.num_major_div;++i) {
    ctx.fillStyle = this.color;

    value = this.min_label + i*(this.max_label-this.min_label)/this.num_major_div;   // test fot red text below does not always work due to problems here.
//    if(value != (Math.floor(value*Math.pow(10,this.num_decimals)))/Math.pow(10,this.num_decimals))  ctx.fillStyle = "#FF0000";

    message = value.toFixed(this.num_decimals);
    if(this.orientation == "vert") {
      ctx.fillText(message,this.x_origin-this.major_tic_length-ctx.measureText(message).width+this.x_off,
                   this.y_origin-Math.floor(0.5+i*(this.rule_length)/this.num_major_div)+this.y_off);
      }
    if(this.orientation == "horiz") {
      ctx.fillText(message,this.x_origin+Math.floor(0.5+i*(this.rule_length)/this.num_major_div-ctx.measureText(message).width/2),
                   this.y_origin+this.major_tic_length+this.y_off);
      }
    }

  return;
  };

ruler.prototype.drawTitle = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.fillStyle = this.color;
  ctx.font = this.title_font;
  if(this.orientation == "vert") {
    ctx.save();

//--only one of these was active at a time.  fix this mess.
//    ctx.translate(this.x_origin-46,this.y_origin-this.rule_length/2+ctx.measureText(this.title).width/2);
//    ctx.translate(this.x_origin-64,this.y_origin-this.rule_length/2+ctx.measureText(this.title).width/2);
    ctx.translate(this.x_origin+this.temp_hard_y_shift-58,this.y_origin-this.rule_length/2+ctx.measureText(this.title).width/2);
//-------------

    ctx.rotate(-0.5*Math.PI);
    ctx.fillText(this.title,0,0);
    ctx.restore();
    }
  if(this.orientation == "horiz") {    //---need to add title mode and other offset varibales (y_off=46 in some places and 64 others))
    ctx.fillText(this.title,this.x_origin+this.rule_length/2-ctx.measureText(this.title).width/2,this.y_origin+46);
//    ctx.fillText(this.title,this.x_origin+this.rule_length/2-ctx.measureText(this.title).width/2,this.y_origin+64);
    }

  return;
  };

ruler.prototype.drawAll = function(canvas_id) {
  this.drawRule(canvas_id);
  this.drawTics(canvas_id);
  this.drawLabels(canvas_id);
  this.drawTitle(canvas_id);

  return;
  };

/*
Ruler.prototype.DrawLogTics = f u n c t i o n(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.color;
  var major_offset = 0.5*this.major_tic_width%2;
  var minor_offset = 0.5*this.minor_tic_width%2;

  ctx.lineWidth = this.minor_tic_width;

  var num_tic_per_major = 8;     //--not all choices make sense, how to handle
  var length_major_div = Math.floor(this.rule_length/this.num_major_div);
  var minor_tic_pix = new Array(num_tic_per_major);
  
  for(var i=0;i<num_tic_per_major;++i) {
    minor_tic_pix[i] = length_major_div*(Math.log(2+i)/Math.log(10));
    }

  for(var i=0;i<this.num_major_div;++i) {
    for(var j=0;j<num_tic_per_major;++j) {
      ctx.beginPath();
      if(this.orientation == "vert") {
        ctx.moveTo(this.x_origin,this.y_origin+minor_offset-i*length_major_div-minor_tic_pix[j]);
        ctx.lineTo(this.x_origin-this.minor_tic_length,this.y_origin+minor_offset-i*length_major_div-minor_tic_pix[j]);
        }
      if(this.orientation == "horiz") {
        ctx.moveTo(this.x_origin+minor_offset+i*length_major_div+minor_tic_pix[j],this.y_origin+1+minor_offset);
        ctx.lineTo(this.x_origin+minor_offset+i*length_major_div+minor_tic_pix[j],this.y_origin+this.minor_tic_length+1+minor_offset);
        }
      ctx.stroke();
      ctx.closePath();
      }
    }

  ctx.lineWidth = this.major_tic_width;
  for(var i=0;i<=this.num_major_div;++i) {
    ctx.beginPath();
    if(this.orientation == "vert") {
      ctx.moveTo(this.x_origin,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      ctx.lineTo(this.x_origin-this.major_tic_length,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      }
    if(this.orientation == "horiz") {
      ctx.moveTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+1+major_offset);
      ctx.lineTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+this.major_tic_length+1+major_offset);
      }
    ctx.stroke();
    ctx.closePath();
    }

  return;
  };

Ruler.prototype.DrawLogLabels = f u n c t i o n(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.fillStyle = this.color;
  ctx.font = this.label_font;

  var message;
  var value;
  for(var i=0;i<=this.num_major_div;++i) {
    value = this.min_label*Math.pow(10,i);

    message = value.toString();
    if(this.orientation == "vert") {
      ctx.fillText(message,this.x_origin-this.major_tic_length-ctx.measureText(message).width+this.x_off,
                   this.y_origin-Math.floor(0.5+i*(this.rule_length)/this.num_major_div)+this.y_off);
      }
    if(this.orientation == "horiz") {
      ctx.fillText(message,this.x_origin+Math.floor(0.5+i*(this.rule_length)/this.num_major_div-ctx.measureText(message).width/2),
                   this.y_origin+this.major_tic_length+1+this.y_off);
      }
    }

  return;
  };

Ruler.prototype.DrawLogAll = f u n c t i o n(canvas_id) {
  this.DrawRule(canvas_id);
  this.DrawLogTics(canvas_id);
  this.DrawLogLabels(canvas_id);
  this.DrawTitle(canvas_id);

  return;
  };
*/

//  Three versions merged together.  I think the first is the latest.  It uses all lower case letters
//  to start f u n c t i o n names.  And has much fewer args for the main object.  Those items are set later.

function rectangleGrid(x,y,width,height,num_x,num_y) {
  this.origin = new screenPoint(x,y);
  this.width = width;
  this.height = height;
  this.num_x = num_x;
  this.num_y = num_y;

  this.grid_style = new shapeStyle('#FFFFFF','#000000',1);

  this.x_shift = 0;
  this.y_shift = 0;
  }

rectangleGrid.prototype.setStyle = function(fill_color,grid_color,grid_line_width) {
  this.grid_style.fill_color = fill_color;
  this.grid_style.stroke_color = stroke_color;
  this.grid_style.line_width = grid_line_width;
  };

rectangleGrid.prototype.draw = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.lineWidth = this.grid_style.line_width;
  var offset = 0.5*this.grid_style.line_width%2;

  if(this.grid_style.fill_color != "") {
    ctx.fillStyle = this.grid_style.fill_color;
    ctx.fillRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  ctx.strokeStyle = this.grid_style.stroke_color;
  for(var i=0;i<=this.num_y;++i) {
    if(this.y_shift>0 && i==this.num_y)  continue;
    extendHorizLine(this.origin.x,this.origin.y+this.y_shift+offset-Math.floor(0.5+i*(this.height)/this.num_y),this.width,ctx);
//    ctx.beginPath();
//    ctx.moveTo(this.origin.x,this.origin.y+this.y_shift+offset-Math.floor(0.5+i*(this.height)/this.num_y));
//    ctx.lineTo(this.origin.x+this.width,this.origin.y+this.y_shift+offset-Math.floor(0.5+i*(this.height)/this.num_y));
//    ctx.stroke();
//    ctx.closePath();
    }
  for(var i=0;i<=this.num_x;++i) {
    if(this.x_shift>0 && i==this.num_x)  continue;
//    extendVertLine(this.origin.x+this.x_shift+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y,-1*this.height,ctx);
    extendVertLine(this.origin.x+this.x_shift+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y,this.height,ctx);
//    ctx.beginPath();
//    ctx.moveTo(this.origin.x+this.x_shift+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y-this.height);
//    ctx.lineTo(this.origin.x+this.x_shift+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y);
//    ctx.stroke();
//    ctx.closePath();
    }
  };

//-----------Start of version 2.  Still has lower case letters to start f u n c t i o n names.  Does not use draw Style and has a ton
//  of args to call the main object

/*
f u n c t i o n rectangleGrid(x,y,width,height,num_x,num_y,grid_line_width,grid_color,frame_line_width,frame_color,back_color,shift_x,shift_y) {
  this.origin = new screenPoint(x,y);

  this.width = width;
  this.height = height;

  this.num_x = num_x;
  this.num_y = num_y;

  this.grid_line_width = grid_line_width;
  this.grid_color = grid_color;

  this.frame_line_width = frame_line_width;
  this.frame_color = frame_color;

  this.back_color = back_color;

  this.shift_x = shift_x;
  this.shift_y = shift_y;
  }

rectangleGrid.prototype.Draw = f u n c t i o n(canvas_id) {
  if(this.num_x<0 || this.num_y<0) return;
  
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.lineWidth = this.grid_line_width;
  var offset = 0.5*this.grid_line_width%2;

  if(this.back_color != "none") {
    ctx.fillStyle = this.back_color;
    ctx.fillRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  ctx.strokeStyle = this.grid_color;
  for(var i=0;i<=this.num_y;++i) {
    if(this.shift_y>0 && i==this.num_y)  continue;   //  untested, could need to be shift_y<0??
    ctx.beginPath();
    ctx.moveTo(this.origin.x,this.origin.y+this.shift_y+offset-Math.floor(0.5+i*(this.height)/this.num_y));
    ctx.lineTo(this.origin.x+this.width,this.origin.y+this.shift_y+offset-Math.floor(0.5+i*(this.height)/this.num_y));
    ctx.stroke();
    ctx.closePath();
    }
  for(var i=0;i<=this.num_x;++i) {
    if(this.shift_x>0 && i==this.num_x)  continue;

// not most robust anyway, only handles one sign.  Need to test when grid is outside 'bounding box' on either side.
// And the whole 4 line beginPath block needs to be wrapped in a f u n c t i o n of drawLineExtend(x,y,delx,dely)
// similar to canvas rect f u n c t i o n  ( a special case of drawPolygon - almost?

    ctx.beginPath();
    ctx.moveTo(this.origin.x+this.shift_x+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y-this.height);
    ctx.lineTo(this.origin.x+this.shift_x+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y);
    ctx.stroke();
    ctx.closePath();
    }

  if(this.frame_color != "none") {      //--not yet tested
    ctx.lineWidth = this.frame_line_width;
    offset = 0.5*this.frame_line_width%2;
    ctx.strokeStyle = this.frame_color;
    ctx.strokeRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  return;
  };
*/

//--third and olders version.  Still uses capitol letters to start f u n c t i o n names

/*
f u n c t i o n RectangleGrid(x,y,width,height,num_x,num_y,grid_line_width,grid_color,frame_line_width,frame_color,back_color) {
  this.origin = new ScreenPoint(x,y);
//  this.origin = new screenPoint(x,y);  //--in another version

  this.width = width;
  this.height = height;

  this.num_x = num_x;
  this.num_y = num_y;

  this.grid_line_width = grid_line_width;
  this.grid_color = grid_color;

  this.frame_line_width = frame_line_width;
  this.frame_color = frame_color;

  this.back_color = back_color;
  }

RectangleGrid.prototype.Draw = f u n c t i o n(canvas_id) {
  if(this.num_x<=0 || this.num_y<=0) return;
  
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.lineWidth = this.grid_line_width;
  var offset = 0.5*this.grid_line_width%2;

  if(this.back_color != "none") {
    ctx.fillStyle = this.back_color;
    ctx.fillRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  ctx.strokeStyle = this.grid_color;
  for(var i=0;i<=this.num_y;++i) {
    ctx.beginPath();
    ctx.moveTo(this.origin.x,this.origin.y+offset-Math.floor(0.5+i*(this.height)/this.num_y));
    ctx.lineTo(this.origin.x+this.width,this.origin.y+offset-Math.floor(0.5+i*(this.height)/this.num_y));
    ctx.stroke();
    ctx.closePath();
    }
  for(var i=0;i<=this.num_x;++i) {
    ctx.beginPath();
    ctx.moveTo(this.origin.x+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y-this.height);
    ctx.lineTo(this.origin.x+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y);
    ctx.stroke();
    ctx.closePath();
    }

  if(this.frame_color != "none") {      //--not yet tested
    ctx.lineWidth = this.frame_line_width;
    offset = 0.5*this.frame_line_width%2;
    ctx.strokeStyle = this.frame_color;
    ctx.strokeRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  return;
  };
*/


//----------------------------------------------------------------------------

function rectanglePlotBlank(x,y,width,height,num_main_x,num_fine_x,num_main_y,num_fine_y,
                            main_line_width,main_color,fine_line_width,fine_color,main_tic_len,fine_tic_len,frame_color,back_color) {
  this.main_title = "";
  this.origin = new screenPoint(x,y);
  this.width  = width;
  this.height = height;

  this.main_grid = new rectangleGrid(x,y,width,height,num_main_x,num_main_y,main_line_width,main_color,main_line_width,frame_color,"none");
  this.fine_grid = new rectangleGrid(x,y,width,height,num_fine_x,num_fine_y,fine_line_width,fine_color,0,"none",back_color);

  this.x_rule = new ruler();
  this.x_rule.setRule(x,y,width,"horiz",frame_color,main_line_width);
  this.x_rule.setTics(num_main_x,main_tic_len,main_line_width,num_fine_x,fine_tic_len,1);
  this.x_rule.setLabels(0,10,1,-12,22,"bold 12pt Arial","bold 12pt Arial","");  //--not crazy about way title is set

  this.y_rule = new ruler();
  this.y_rule.setRule(x,y,height,"vert",frame_color,main_line_width);
  this.y_rule.setTics(num_main_y,main_tic_len,main_line_width,num_fine_y,fine_tic_len,1);
  this.y_rule.setLabels(0,10,1,-10,6,"bold 12pt Arial","bold 12pt Arial","");
  }

rectanglePlotBlank.prototype.draw = function(canvas_id) {
  this.fine_grid.draw(canvas_id);
  this.main_grid.draw(canvas_id);

  this.x_rule.drawAll(canvas_id);
  this.y_rule.drawAll(canvas_id);

  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.fillStyle = this.frame_color;
  ctx.font = "bold 16pt Arial";
  ctx.fillText(this.main_title,this.origin.x+this.width/2-ctx.measureText(this.main_title).width/2,this.origin.y-this.height-30);

  return;
  };

rectanglePlotBlank.prototype.setOrigin = function(x,y) {
  this.origin.x = x;
  this.origin.y = y;

  this.main_grid.origin.x = x;
  this.main_grid.origin.y = y;
  this.fine_grid.origin.x = x;
  this.fine_grid.origin.y = y;
                                //---note diff in handling of origin (2 var vs 1 object).  Seems to be no big advantages - just inconsistent
  this.x_rule.x_origin = x;
  this.x_rule.y_origin = y;
  this.y_rule.x_origin = x;
  this.y_rule.y_origin = y;

  return;
  };

rectanglePlotBlank.prototype.setDimensions = function(width,height) {
  this.width  = width;
  this.height = height;

  this.main_grid.width  = width;
  this.main_grid.height = height;
  this.fine_grid.width  = width;
  this.fine_grid.height = height;

  this.x_rule.rule_length = width;
  this.y_rule.rule_length = height;
  return;
  };


rectanglePlotBlank.prototype.setGrids = function(num_main_x,num_main_y,num_fine_x,num_fine_y) {
  this.main_grid.num_x = num_main_x;
  this.main_grid.num_y = num_main_y;
  this.fine_grid.num_x = num_fine_x;
  this.fine_grid.num_y = num_fine_y;

  this.x_rule.setTics(num_main_x,this.x_rule.major_tic_length,this.x_rule.major_tic_width,num_fine_x,this.x_rule.minor_tic_length,this.x_rule.minor_tic_width);
  this.y_rule.setTics(num_main_y,this.y_rule.major_tic_length,this.y_rule.major_tic_width,num_fine_y,this.y_rule.minor_tic_length,this.y_rule.minor_tic_width);

  return;
  };

//----------------------------------------------------------------------------


function timeRuler() {
  this.x_origin = 0;
  this.y_origin = 0;
  this.rule_length = 100;
  this.rule_line_width = 1;
  this.line_color = "#000000";

  this.major_tic_length = 12;
  this.major_tic_width = 1;
  this.minor_tic_length = 6;
  this.minor_tic_width = 1;

  this.origin_time;
  this.end_time;
  this.major_div_mode;
  this.minor_div_mode;

//  this.min_label = 0;
//  this.max_label = 10;
//  this.num_decimals = 0;

//  this.x_off = -8;  //---default is suited to vertical implementation
//  this.y_off = 5;

  this.label_font = "bold 12pt Arial";
  this.title_font = "bold 20pt Arial";
  this.title = "";
  }

timeRuler.prototype.setRule = function(x_origin,y_origin,rule_length,rule_line_width,line_color) {
  this.x_origin = x_origin;
  this.y_origin = y_origin;
  this.rule_length = rule_length;
  if(arguments.length>3) {
    this.rule_line_width = line_width;
    this.line_color = line_color;
    }
  };

timeRuler.prototype.setTics = function(major_tic_length,major_tic_width,minor_tic_length,minor_tic_width) {
  this.major_tic_length = major_tic_length;
  this.major_tic_width = major_tic_width;
  this.minor_tic_length = minor_tic_length;
  this.minor_tic_width = minor_tic_width;
  };

timeRuler.prototype.setTimes = function(origin_time,end_time,major_div_mode,minor_div_mode) {
  this.origin_time = origin_time;
  this.end_time = end_time;
  this.major_div_mode = major_div_mode;
  this.minor_div_mode = minor_div_mode;
  };

/*
Ruler.prototype.SetLabels = f u n c t i o n(min_label,max_label,num_decimals,x_off,y_off,label_font,title_font,title) {
  this.min_label = min_label;
  this.max_label = max_label;
  this.num_decimals = Math.floor(num_decimals);
  if(this.num_decimals<0)  this.num_decimals = 0;
  if(this.num_decimals>3)  this.num_decimals = 3;
  this.x_off = x_off;
  this.y_off = y_off;

  this.title_font = title_font;
  this.label_font = label_font;
  this.title = title;

  return;
  };
*/

timeRuler.prototype.drawRule = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  var line_nudge = 0.5*this.rule_line_width%2;

  ctx.lineWidth = this.rule_line_width;

  ctx.beginPath();   //---I have a one line f u n c t i o n for this
  ctx.moveTo(this.x_origin,this.y_origin+line_nudge);
  ctx.lineTo(this.x_origin+this.rule_length,this.y_origin+line_nudge);
  ctx.stroke();
  ctx.closePath();

  return;
  };


timeRuler.prototype.drawDayMinorTics = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  var line_nudge = 0.5*this.rule_line_width%2;
  var tic_length,str,dx;

  var num_day_gaps = subtractTimes(this.end_time,this.origin_time,'days');

  var tic_time = new time(this.origin_time.year,this.origin_time.month,this.origin_time.day,0,0,0);
  for(var d=0;d<=num_day_gaps;++d) {
    dx = this.rule_length*(tic_time.totSecLinuxEra() - this.origin_time.totSecLinuxEra())/(num_day_gaps*86400)

    tic_length = this.minor_tic_length;

    if(num_day_gaps<=120) {
      if(tic_time.day==1 || tic_time.day==10 || tic_time.day==20) {
        tic_length = this.major_tic_length;
        this.dayLabel(ctx,tic_time,dx);
        }
      if(tic_time.day==1) {
        tic_length = this.major_tic_length;
        this.monYrLabel(ctx,tic_time,dx);
        }
      }
    if(num_day_gaps>120 && num_day_gaps<=240) {
      if(tic_time.day==1 || tic_time.day==15) {
        tic_length = this.major_tic_length;
        this.dayLabel(ctx,tic_time,dx);
        }
      if(tic_time.day==1) {
        tic_length = this.major_tic_length;
        this.monYrLabel(ctx,tic_time,dx);
        }
      }
    if(num_day_gaps>240 && num_day_gaps<=300) {
      if(tic_time.day==1)  {
        tic_length = this.major_tic_length;
        this.dayLabel(ctx,tic_time,dx);
        this.monYrLabel(ctx,tic_time,dx);
        }
      }
    if(num_day_gaps>300) {
      tic_length = 0;
      if(tic_time.day==1) {
        tic_length = this.major_tic_length;
        if(tic_time.month%2==0) {
          this.dayLabel(ctx,tic_time,dx);
          this.monYrLabel(ctx,tic_time,dx);
          }
        }
      }

    ctx.beginPath();   //---I need a one line fuuction for this
    ctx.moveTo(this.x_origin+line_nudge+Math.round(dx),this.y_origin+1+line_nudge);
    ctx.lineTo(this.x_origin+line_nudge+Math.round(dx),this.y_origin+tic_length+1+line_nudge);
//    ctx.moveTo(this.x_origin,this.y_origin+line_nudge);
//    ctx.lineTo(this.x_origin+this.rule_length,this.y_origin+line_nudge);
    ctx.stroke();
    ctx.closePath();

    tic_time.addDays(1);
    }
  };

timeRuler.prototype.hourLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'H','UTC');
  ctx.fillText(str,this.x_origin+label_x-ctx.measureText(str).width/2,this.y_origin+32);
  };

timeRuler.prototype.dayLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'D','UTC');
  ctx.fillText(str,this.x_origin+label_x-ctx.measureText(str).width/2,this.y_origin+32);
  };

timeRuler.prototype.dateLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'MM/DD/YY','UTC');
  ctx.fillText(str,this.x_origin+label_x-ctx.measureText(str).width/2,this.y_origin+50);
  };

timeRuler.prototype.monYrLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'AM FY','UTC');
  ctx.fillText(str,this.x_origin+label_x-ctx.measureText(str).width/2,this.y_origin+50);
  };

timeRuler.prototype.drawHourTics = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  var line_nudge = 0.5*this.rule_line_width%2;
  var tic_length,str,dx;

  var num_hour_gaps = subtractTimes(this.end_time,this.origin_time,'hours');

  var tic_time = new time(this.origin_time.year,this.origin_time.month,this.origin_time.day,0,0,0);
//  var tic_time = new time(this.origin_time.year,this.origin_time.month,this.origin_time.day,this.origin_time.hour,0,0);
  for(var d=0;d<=num_hour_gaps;++d) {
    dx = Math.round(d*this.rule_length/num_hour_gaps);

    tic_length = this.minor_tic_length;

/*  hard ocde junk for fixed calendar day  */
    if(d%6==0) {
      tic_length = this.major_tic_length;
      if(d!=24) {  var str=d;    ctx.fillText(str,this.x_origin+dx-ctx.measureText(str).width/2,this.y_origin+32);  }
      else      {  var str="0";  ctx.fillText(str,this.x_origin+dx-ctx.measureText(str).width/2,this.y_origin+32);  }
      if(d==0)  this.dateLabel(ctx,img_time,dx);
      if(d==24) this.dateLabel(ctx,img_time.spawnTime(24,"hours"),dx);
      }
/*  for real adjustable end time behavior
    if(tic_time.hour%6==0) {
      tic_length = this.major_tic_length;
      this.hourLabel(ctx,tic_time,dx);
      if(tic_time.hour==0)  this.dateLabel(ctx,tic_time,dx);
      }
*/
    ctx.beginPath();   //---I need a one line fuuction for this
    ctx.moveTo(this.x_origin+line_nudge+Math.round(dx),this.y_origin+1+line_nudge);
    ctx.lineTo(this.x_origin+line_nudge+Math.round(dx),this.y_origin+tic_length+1+line_nudge);
    ctx.stroke();
    ctx.closePath();

    tic_time.addHours(1);
    }
  };

//############################################################################
//       SCI: time axis
//       by Brian T Kaney, 2015-2017
//############################################################################

function minuteAxis() {
  this.x_origin = 100;
  this.y_origin = 100;
  this.rule_length = 200;
  this.rule_line_width = 1;
  this.line_color = "#000000";

  this.minor_tic_length = 6;
  this.major_tic_length = 12;
  this.tic_line_width = 1;

     /*  Nudge origin to optimize canvas drawing of lines with odd pixel line widths  */
  this.y_origin = this.y_origin + 0.5*this.rule_line_width%2;
  this.x_origin = this.x_origin + 0.5*this.tic_line_width%2;

  this.end_time = new time();
  this.end_time.truncateToMinRes(60);
  this.origin_time = this.end_time.spawnTime(-1,"days");

  this.minor_div_minutes = 60;
  this.major_div_minutes = 360;
  this.label_font = "bold 9pt Arial";
  this.label_offset = 15;
  this.hour_units = " Z";
  this.left_spill = 50;
  this.right_spill = 50;
  }

minuteAxis.prototype.setRule = function(x_origin,y_origin,rule_length,rule_line_width,line_color) {
  this.x_origin = x_origin;
  this.y_origin = y_origin;
  this.rule_length = rule_length;
  if(arguments.length>3) {
    this.rule_line_width = rule_line_width;
    this.line_color = line_color;
    }
     /*  Nudge origin to optimize canvas drawing of lines with odd pixel line widths  */
  this.y_origin = this.y_origin + 0.5*this.rule_line_width%2;
  this.x_origin = this.x_origin + 0.5*this.tic_line_width%2;
  };

minuteAxis.prototype.setTics = function(minor_tic_length,major_tic_length,tic_line_width) {
  this.minor_tic_length = minor_tic_length;
  this.major_tic_length = major_tic_length;
  this.tic_line_width = tic_line_width;
  };

minuteAxis.prototype.setTimes = function(origin_time,end_time,minor_div_minutes,major_div_minutes) {
  this.origin_time = origin_time;
  this.end_time = end_time;
  this.minor_div_minutes = minor_div_minutes;
  this.major_div_minutes = major_div_minutes;
  };

minuteAxis.prototype.drawAxis = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  ctx.font = this.label_font;

  ctx.lineWidth = this.rule_line_width;
  drawLine(this.x_origin-0.5,this.y_origin,this.x_origin+this.rule_length,this.y_origin,ctx);

  var num_possible_tics = 1 + subtractTimes(this.end_time,this.origin_time,'minutes')/this.minor_div_minutes;   //--can return decimal value
  var minor_tic_time = this.origin_time.spawnTime(0);
  minor_tic_time.truncateToMinRes(this.minor_div_minutes);

  ctx.lineWidth = this.tic_line_width;
  for(var t=0;t<=num_possible_tics;++t) {
    var dx = this.rule_length*(minor_tic_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra())/(this.end_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra());
    dx = Math.round(dx);
    if(dx<0 || dx>this.rule_length) {
      minor_tic_time.addMinutes(this.minor_div_minutes);
      continue;
      }

    var major_tic_time = minor_tic_time.spawnTime(0);
    major_tic_time.truncateToMinRes(this.major_div_minutes);
    if(subtractTimes(minor_tic_time,major_tic_time,'minutes')==0) {
      var tic_length = this.major_tic_length;
      this.hourLabel(ctx,major_tic_time,dx);
      if(major_tic_time.hour==0)  this.dateLabel(ctx,major_tic_time,dx);
      }
    else  var tic_length = this.minor_tic_length;

    drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+tic_length,ctx);
    minor_tic_time.addMinutes(this.minor_div_minutes);
    }
  }

minuteAxis.prototype.drawDayAxis = function(canvas_id,day_div) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  ctx.font = this.label_font;

  ctx.lineWidth = this.rule_line_width;
  drawLine(this.x_origin-0.5,this.y_origin,this.x_origin+this.rule_length,this.y_origin,ctx);

  var num_possible_tics = 1 + subtractTimes(this.end_time,this.origin_time,'minutes')/1440;   //--can return decimal value
  var major_tic_time = this.origin_time.spawnTime(0);
  major_tic_time.truncateToMinRes(1440);

  ctx.lineWidth = this.tic_line_width;
  for(var t=0;t<=num_possible_tics;++t) {
    var dx = this.rule_length*(major_tic_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra())/(this.end_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra());
    dx = Math.round(dx);
    if(dx<0 || dx>this.rule_length) {
      major_tic_time.addMinutes(1440);
      continue;
      }

    drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.minor_tic_length,ctx);
    if(day_div==2) {
      this.hourLabel(ctx,major_tic_time,dx);
      if(major_tic_time.day%day_div==0) {
        this.dateLabel(ctx,major_tic_time,dx);
        drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.major_tic_length,ctx);
        }
      }
    if(day_div>2) {
      if(major_tic_time.day%day_div==0) {
        this.dayLabel(ctx,major_tic_time,dx);
        drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.major_tic_length,ctx);
        }
      }

    major_tic_time.addMinutes(1440);
    }
  }

minuteAxis.prototype.drawMonthAxis = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  ctx.font = this.label_font;

  ctx.lineWidth = this.rule_line_width;
  drawLine(this.x_origin-0.5,this.y_origin,this.x_origin+this.rule_length,this.y_origin,ctx);

  var num_possible_tics = 1 + subtractTimes(this.end_time,this.origin_time,'minutes')/1440;   //--can return decimal value
  var major_tic_time = this.origin_time.spawnTime(0);
  major_tic_time.truncateToMinRes(1440);

  ctx.lineWidth = this.tic_line_width;
  for(var t=0;t<=num_possible_tics;++t) {
    var dx = this.rule_length*(major_tic_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra())/(this.end_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra());
    dx = Math.round(dx);
    if(dx<0 || dx>this.rule_length) {
      major_tic_time.addMinutes(1440);
      continue;
      }

    drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.minor_tic_length,ctx);
    if(major_tic_time.day==1) {
      this.dayLabel(ctx,major_tic_time,dx);
      drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.major_tic_length,ctx);
      }

    major_tic_time.addMinutes(1440);
    }
  }

//  Following code could be improved.  I just copied the block above and skipped using day tics unless the day=1
//  and then only wrote the label every other month.
minuteAxis.prototype.drawMultiMonthAxis = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.line_color;
  ctx.font = this.label_font;

  ctx.lineWidth = this.rule_line_width;
  drawLine(this.x_origin-0.5,this.y_origin,this.x_origin+this.rule_length,this.y_origin,ctx);

  var num_possible_tics = 1 + subtractTimes(this.end_time,this.origin_time,'minutes')/1440;   //--can return decimal value
  var major_tic_time = this.origin_time.spawnTime(0);
  major_tic_time.truncateToMinRes(1440);

  ctx.lineWidth = this.tic_line_width;
  for(var t=0;t<=num_possible_tics;++t) {
    var dx = this.rule_length*(major_tic_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra())/(this.end_time.totSecLinuxEra()-this.origin_time.totSecLinuxEra());
    dx = Math.round(dx);
    if(dx<0 || dx>this.rule_length) {
      major_tic_time.addMinutes(1440);
      continue;
      }
    if(major_tic_time.day!=1) {
      major_tic_time.addMinutes(1440);
      continue;
      }

    drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.minor_tic_length,ctx);
    if(major_tic_time.month%2==0) {
      this.dayLabel(ctx,major_tic_time,dx);
      drawLine(this.x_origin+dx,this.y_origin,this.x_origin+dx,this.y_origin+this.major_tic_length,ctx);
      }

    major_tic_time.addMinutes(1440);
    }
  }

//----------------------------------------------------------------------------

minuteAxis.prototype.hourLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'H','UTC') + this.hour_units;
  ctx.fillText(str,this.x_origin+label_x-ctx.measureText(str).width/2,this.y_origin+this.major_tic_length+this.label_offset);
  };

minuteAxis.prototype.dayLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'MM/DD/YY','UTC');

  var x = this.x_origin+label_x-ctx.measureText(str).width/2;
  if(x<(this.x_origin-this.left_spill))  return;   //---blank out labels that stick out
  if((x+ctx.measureText(str).width)>(this.x_origin+this.rule_length+this.right_spill))  return;   //--blank out labels that stick out

//  if(x<(this.x_origin-this.left_spill))  x = this.x_origin-this.left_spill;
//  if((x+ctx.measureText(str).width)>(this.x_origin+this.rule_length+this.right_spill))  x = this.x_origin+this.rule_length+this.right_spill-ctx.measureText(str).width;

  ctx.fillText(str,x,this.y_origin+this.major_tic_length+this.label_offset);
  };

minuteAxis.prototype.dateLabel = function(ctx,label_time,label_x) {
  var str = timeString(label_time,'MM/DD/YY','UTC');

  var x = this.x_origin+label_x-ctx.measureText(str).width/2;
  if(x<(this.x_origin-this.left_spill))  return;   //---blank out labels that stick out
  if((x+ctx.measureText(str).width)>(this.x_origin+this.rule_length+this.right_spill))  return;   //--blank out labels that stick out

//  if(x<(this.x_origin-this.left_spill))  x = this.x_origin-this.left_spill;
//  if((x+ctx.measureText(str).width)>(this.x_origin+this.rule_length+this.right_spill))  x = this.x_origin+this.rule_length+this.right_spill-ctx.measureText(str).width;

  ctx.fillText(str,x,this.y_origin+this.major_tic_length+2*this.label_offset);
  };

//----------------------------------------------------------------------------


//----------------------------------------------------------------------------

function HistoBins(num_bins,min_value,max_value) {
  this.num_bins  = num_bins;
  this.min_value = min_value;
  this.max_value = max_value;

  this.bin = new Array(num_bins);
  for(var i=0;i<num_bins;++i) { this.bin[i] = 0; }

this.draw_diag = 1;  //  temp variable used in Z vs ZDR scatter only, until better capability is devised

  return; 
  }

HistoBins.prototype.ImportBins = function(data) {
  for(var i=0;i<this.num_bins;++i) {
    this.bin[i] = data[i];
    }

  return;
  };

HistoBins.prototype.BinData = function(num_data,data) {
  for(var i=0;i<num_data;++i) {
    if(data[i]<this.min_value || data[i]>this.max_value) continue;
    
    ++this.bin[Math.floor(this.num_bins*(data[i]-this.min_value)/(this.max_value-this.min_value))];  //--handle case where data[i]==max_value
    }

  return;
  };

HistoBins.prototype.LogBinData = function(num_data,data) {
  for(var i=0;i<num_data;++i) {
    if(data[i]<this.min_value || data[i]>this.max_value) continue;
    
    ++this.bin[Math.floor(this.num_bins*(Math.log(data[i])-Math.log(this.min_value))/(Math.log(this.max_value)-Math.log(this.min_value)))];
    }

  return;
  };

//  This turns integer bin counts into float values.  Is this okay?  Call the output something else? Return a float array to 
//  a new object? FreqDistribution?  Think about this.
HistoBins.prototype.NormalizeWeightByCnt = function() {
//  var sum_bins = this.getTotalCount();   replaces next 4 lines - does the getTotalCount exist yet?
  var sum_bins = 0;
  for(var i=0;i<this.num_bins;++i) {
    sum_bins = sum_bins + this.bin[i];
    }

  if(sum_bins==0) return;

  for(var i=0;i<this.num_bins;++i) { this.bin[i] = this.bin[i]/sum_bins; }

//  return;    purged these trailing void 'return' statements in later versions, as they have no effect
  };

HistoBins.prototype.NormalizeWeightByValue = function() {
//  var value_per_bin = (this.max_value-this.min_value)/this.num_bins

  var mid_bin_value = new Array(this.num_bins)
  for(var i=0;i<this.num_bins;++i) {
    mid_bin_value[i] = Math.pow(Math.E,Math.log(this.min_value) + (i+0.5)*(Math.log(this.max_value)-Math.log(this.min_value))/this.num_bins);
    }

  var sum_bins = 0;
  for(var i=0;i<this.num_bins;++i) {
    sum_bins = sum_bins + this.bin[i]*mid_bin_value[i];
    }

  if(sum_bins==0) return;

  for(var i=0;i<this.num_bins;++i) {
    this.bin[i] = (this.bin[i]*mid_bin_value[i])/sum_bins;
    }

  return;
  };

function HistoBins2D(num_x_bins,num_y_bins,min_x_value,min_y_value,max_x_value,max_y_value) {
  this.num_x_bins  = num_x_bins;
  this.num_y_bins  = num_y_bins;
  this.min_x_value = min_x_value;
  this.min_y_value = min_y_value;
  this.max_x_value = max_x_value;
  this.max_y_value = max_y_value;

  this.bin = new Array(num_x_bins);
  for(var i=0;i<num_x_bins;++i) {
    this.bin[i] = new Array(num_y_bins);
    for(var j=0;j<num_y_bins;++j) {
      this.bin[i][j] = 0;
      }
    }

  return; 
  }


HistoBins2D.prototype.ImportBins = function(data) {
  for(var i=0;i<this.num_x_bins;++i) {
    for(var j=0;j<this.num_y_bins;++j) {
      this.bin[i][j] = data[i][j];
      }
    }

  return;
  };


HistoBins2D.prototype.BinData = function(num_data,x_data,y_data) {
  for(var i=0;i<num_data;++i) {
    if(x_data[i]<this.min_x_value || x_data[i]>this.max_x_value || y_data[i]<this.min_y_value || y_data[i]>this.max_y_value) continue;
    
    var x_index = Math.floor(this.num_x_bins*(x_data[i]-this.min_x_value)/(this.max_x_value-this.min_x_value));
    var y_index = Math.floor(this.num_y_bins*(y_data[i]-this.min_y_value)/(this.max_y_value-this.min_y_value));
    ++this.bin[x_index][y_index];
    }

  return;
  };

HistoBins2D.prototype.LogBinData = function(num_data,x_data,y_data) {
  for(var i=0;i<num_data;++i) {
    if(x_data[i]<this.min_x_value || x_data[i]>this.max_x_value || y_data[i]<this.min_y_value || y_data[i]>this.max_y_value) continue;
    
    var x_index = Math.floor(this.num_x_bins*(Math.log(x_data[i])-Math.log(this.min_x_value))/(Math.log(this.max_x_value)-Math.log(this.min_x_value)));
    var y_index = Math.floor(this.num_y_bins*(Math.log(y_data[i])-Math.log(this.min_y_value))/(Math.log(this.max_y_value)-Math.log(this.min_y_value)));
    ++this.bin[x_index][y_index];
    }

  return;
  };

//f u n c t i o n HistoScatterPlot(num_colors) {
//  this.num_colors = num_colors;
//  this.bin_cuts   = new Array(num_colors+1);
//  this.colors     = new Array(num_colors);
//  return; 
//  }

//HistoBins2D.prototype.Draw = f u n c t i o n(canvas_id,screen,palette,diagonal) {  alt version
HistoBins2D.prototype.Draw = function(canvas_id,screen,palette) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  var w = screen.width/this.num_x_bins;
  var h = screen.height/this.num_y_bins;

  for(var i=0;i<this.num_x_bins;++i) {
    for(var j=0;j<this.num_y_bins;++j) {
      var x = screen.origin.x + Math.floor(i*w);
      var y = screen.origin.y - Math.floor((j+1)*h); 

      ctx.fillStyle = palette.GetColor(this.bin[i][j]);

      ctx.fillRect(x,y,Math.ceil(w),Math.ceil(h));
      }
    }

  if(this.draw_diag==1) {
         //  In a fork briefly, I had an arg for this in this fucntion, but I don't like the layer of complication here.
         //  Keep this cleaner, need a whole lib of possible overlays and underlays for plots.  Also, don't use '1' use 'true' instead
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(screen.origin.x,screen.origin.y);
    ctx.lineTo(screen.origin.x+screen.width,screen.origin.y-screen.height);
    ctx.stroke();
    ctx.closePath();
    }

  return;
  };

//############################################################################
//       SCI: plot basics
//       by Brian T Kaney, 2015-2017
//############################################################################

function valueBins(num_bins) {
  this.num_bins = num_bins;

  this.bin = new Array(this.num_bins);
  for(var i=0;i<this.num_bins;++i) { this.bin[i] = 0; }

  return; 
  }

valueBins.prototype.fillBinsLinearlyViaFloatArray = function(min_value,max_value,data) {
  for(var i=0;i<data.length;++i) {
    if(data[i]<this.min_value || data[i]>=this.max_value) continue;
    
    ++this.bin[Math.floor(this.num_bins*(data[i]-min_value)/(max_value-min_value))];
    }

  return;
  };

function valueBins2D(num_x_bins,num_y_bins) {
  this.num_x_bins = num_x_bins;
  this.num_y_bins = num_y_bins;

  this.bin = new Array(this.num_x_bins);
  for(var i=0;i<this.num_x_bins;++i) {
    this.bin[i] = new Array(this.num_y_bins);
    for(var j=0;j<this.num_y_bins;++j) {
      this.bin[i][j] = 0;
      }
    }

  return; 
  }

valueBins2D.prototype.fillBinsLinearlyViaTwoFloatArrays = function(min_x_value,max_x_value,x_data,min_y_value,max_y_value,y_data) {
  if(x_data.length!=y_data.length)  return;

  for(var i=0;i<x_data.length;++i) {
    if(x_data[i]<min_x_value || x_data[i]>=max_x_value || y_data[i]<min_y_value || y_data[i]>=max_y_value) continue;
    var x_index = Math.floor(this.num_x_bins*(x_data[i]-min_x_value)/(max_x_value-min_x_value));
    var y_index = Math.floor(this.num_y_bins*(y_data[i]-min_y_value)/(max_y_value-min_y_value));
    ++this.bin[x_index][y_index];
    }

  return; 
  }


valueBins2D.prototype.draw = function(canvas_id,screen,palette) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  var w = screen.width()/this.num_x_bins;
  var h = screen.height()/this.num_y_bins;

  for(var i=0;i<this.num_x_bins;++i) {
    for(var j=0;j<this.num_y_bins;++j) {
      var x = screen.x1 + Math.floor(i*w);
      var y = screen.y1 - Math.floor((j+1)*h); 

      ctx.fillStyle = palette.getColor(this.bin[i][j]);
      ctx.fillRect(x,y,Math.ceil(w),Math.ceil(h));
      }
    }

  return;
  };

