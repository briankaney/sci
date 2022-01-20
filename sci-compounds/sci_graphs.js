//############################################################################
//       SCI: plot basics
//       by Brian T Kaney, 2015-2017
//############################################################################

function sciPt2D(x,y) {
  this.x = x;
  this.y = y;
}

sciPt2D.prototype.setValue = function(x,y) {
  this.x = x;
  this.y = y;
};

//----------------------------------------------------------------------------

function sciNumberLine(d1,d2) {
  this.d1 = d1;
  this.d2 = d2;
}

sciNumberLine.prototype.setEnds = function(d1,d2) {
  this.d1 = d1;
  this.d2 = d2;
};

sciNumberLine.prototype.length = function() { return (this.d2-this.d1); };

sciNumberLine.prototype.fraction = function(d) {
  if(this.length()!=0) { return (d - this.d1)/this.length(); }
  else { return 0; }
};

//----------------------------------------------------------------------------

function sciPlotLine(canvas_id) {
  this.canvas_id = canvas_id;
  this.origin = 0;
  this.screen = new sciNumberLine(0,100);
  this.coord  = new sciNumberLine(0,100);
}

sciPlotLine.prototype.setPlotLength = function(w) { this.screen.setEnds(0,w); };

sciPlotLine.prototype.setCartesianDataRange = function(min,max) { this.coord.setEnds(min,max); };

sciPlotLine.prototype.canvasPixFromData = function(d) {
  return this.origin + this.screen.length()*this.coord.fraction(d);
};

//----------------------------------------------------------------------------

//function numberRect(x1,x2,y1,y2) {
//  this.x_axis = new numberLine(x1,x2);
//  this.y_axis = new numberLine(y1,y2);
//}

//numberRect.prototype.setRect = function(x1,x2,y1,y2) {
//  this.x_axis.setEnds(x1,x2);
//  this.y_axis.setEnds(y1,y2);
//};

// no use case yet   numberRect.prototype.width = function() { return this.x_axis.length(); };
// numberRect.prototype.height = function() { return this.y_axis.length(); };

//----------------------------------------------------------------------------

function sciPlotCartesian(canvas_id) {
  this.canvas_id = canvas_id;
  this.line_style = new lineStyle('#000000',1);
  this.text_style = new textStyle('normal 12pt arial','#000000','left','bottom');
  this.x_axis = new sciPlotLine(this.canvas_id);
  this.y_axis = new sciPlotLine(this.canvas_id);
}

sciPlotCartesian.prototype.setPlotOriginWithinCanvas = function(x,y) {
  this.x_axis.origin = x;
  this.y_axis.origin = y;
};

sciPlotCartesian.prototype.setPlotWidthHeight = function(w,h) {
  this.x_axis.setPlotLength(w);
  this.y_axis.setPlotLength(-1*h);
};

sciPlotCartesian.prototype.setCartesianDataRect = function(min_x,max_x,min_y,max_y) {
  this.x_axis.setCartesianDataRange(min_x,max_x);
  this.y_axis.setCartesianDataRange(min_y,max_y);
};

sciPlotCartesian.prototype.drawBackground = function(fill_color) {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');
  ctx.fillStyle = fill_color;
  ctx.fillRect(this.x_axis.origin,this.y_axis.origin+this.y_axis.screen.length(),
               this.x_axis.screen.length(),-1*this.y_axis.screen.length());
};

sciPlotCartesian.prototype.canvasXFromDataX = function(x) { return this.x_axis.canvasPixFromData(x); };

sciPlotCartesian.prototype.canvasYFromDataY = function(y) { return this.y_axis.canvasPixFromData(y); };

    //  4 or 6 arg version: (x1,y1,x2,y2) or (x1,y1,x2,y2,stroke_color,line_width)
sciPlotCartesian.prototype.drawDataLine = function(x1,y1,x2,y2) {
  var ctx = this.setUpCtx(4,arguments);
  if(x1==x2) { drawCleanVertLine(this.canvasXFromDataX(x1),this.canvasYFromDataY(y1),this.canvasYFromDataY(y2),ctx);  return; }
  if(y1==y2) { drawCleanHorizLine(this.canvasXFromDataX(x1),this.canvasXFromDataX(x2),this.canvasYFromDataY(y1),ctx);  return; }
  drawLine(this.canvasXFromDataX(x1),this.canvasYFromDataY(y1),this.canvasXFromDataX(x2),this.canvasYFromDataY(y2),ctx);
  };

sciPlotCartesian.prototype.setUpCtx = function(num_def_args,args) {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');
  if(args.length==num_def_args+2) {
    ctx.strokeStyle = args[num_def_args];
    ctx.lineWidth = args[num_def_args+1];
  }
  else {
    ctx.strokeStyle = this.line_style.stroke_color;
    ctx.lineWidth = this.line_style.line_width;
  }
  return ctx;
};

    //  1 or 3 arg version: (x) or (x,stroke_color,line_width)
sciPlotCartesian.prototype.drawVertLineAtDataX = function(x) {
  if(arguments.length==3) { this.drawDataLine(x,this.y_axis.coord.d2,x,this.y_axis.coord.d1,arguments[1],arguments[2]); }
  else { this.drawDataLine(x,this.y_axis.coord.d2,x,this.y_axis.coord.d1); }
};

    //  1 or 3 arg version: (y) or (y,stroke_color,line_width)
sciPlotCartesian.prototype.drawHorizLineAtDataY = function(y) {
  if(arguments.length==3) { this.drawDataLine(this.x_axis.coord.d1,y,this.x_axis.coord.d2,y,arguments[1],arguments[2]); }
  else { this.drawDataLine(this.x_axis.coord.d1,y,this.x_axis.coord.d2,y); }
};

    //  1 or 3 arg version: (num_x) or (num_x,stroke_color,line_width)
sciPlotCartesian.prototype.drawXBoxes = function(num_x) {   
  if(num_x<1) { return; }
  if(arguments.length==3) { var ea = true;  var sc = arguments[1];  var lw = arguments[2]; }
  for(var i=0;i<=num_x;++i) {
    if(ea) { this.drawVertLineAtDataX(this.x_axis.coord.d1+i*this.x_axis.coord.length()/num_x,sc,lw); }
    else   { this.drawVertLineAtDataX(this.x_axis.coord.d1+i*this.x_axis.coord.length()/num_x); }
  }
};

    //  1 or 3 arg version: (num_y) or (num_y,stroke_color,line_width)
sciPlotCartesian.prototype.drawYBoxes = function(num_y) {   
  if(num_y<1) { return; }
  if(arguments.length==3) { var ea = true;  var sc = arguments[1];  var lw = arguments[2]; }
  for(var i=0;i<=num_y;++i) {
    if(ea) { this.drawHorizLineAtDataY(this.y_axis.coord.d1+i*this.y_axis.coord.length()/num_y,sc,lw); }
    else   { this.drawHorizLineAtDataY(this.y_axis.coord.d1+i*this.y_axis.coord.length()/num_y); }
  }
};

    //  2 or 4 arg version: (num_x,num_y) or (num_x,num_y,stroke_color,line_width)
sciPlotCartesian.prototype.drawXYBoxes = function(num_x,num_y) {   
  if(arguments.length==4) {
    this.drawXBoxes(num_x,arguments[2],arguments[3]);
    this.drawYBoxes(num_y,arguments[2],arguments[3]);
  }
  else {
    this.drawXBoxes(num_x);
    this.drawYBoxes(num_y);
  }
};

    //  2 or 4 arg version: (start_x,delta_x) or (start_x,delta_x,stroke_color,line_width)
sciPlotCartesian.prototype.drawXDataGrid = function(start_x,delta_x) {   
  if(arguments.length==4) { var ea = true;  var sc = arguments[2];  var lw = arguments[3]; }
  for(var i=0;i<1000;++i) {
    var x_value = start_x + i*delta_x;
    if(x_value<this.x_axis.coord.d1) { continue; }
    if(x_value>this.x_axis.coord.d2) { return; }
    if(ea) { this.drawVertLineAtDataX(this.x_axis.coord.d1+x_value,sc,lw); }
    else   { this.drawVertLineAtDataX(this.x_axis.coord.d1+x_value); }
  }
};

    //  2 or 4 arg version: (start_y,delta_y) or (start_y,delta_y,stroke_color,line_width)
sciPlotCartesian.prototype.drawYDataGrid = function(start_y,delta_y) {   
  if(arguments.length==4) { var ea = true;  var sc = arguments[2];  var lw = arguments[3]; }
  for(var i=0;i<1000;++i) {
    var y_value = start_y + i*delta_y;
    if(y_value<this.y_axis.coord.d1) { continue; }
    if(y_value>this.y_axis.coord.d2) { return; }
    if(ea) { this.drawHorizLineAtDataY(this.y_axis.coord.d1+y_value,sc,lw); }
    else   { this.drawHorizLineAtDataY(this.y_axis.coord.d1+y_value); }
  }
};

    //  4 or 6 arg version: (start_x,delta_x,start_y,delta_y) or (start_x,delta_x,start_y,delta_y,stroke_color,line_width)
sciPlotCartesian.prototype.drawXYDataGrid = function(start_x,delta_x,start_y,delta_y) {   
  if(arguments.length==6) {
    this.drawXDataGrid(start_x,delta_x,arguments[4],arguments[5]);
    this.drawYDataGrid(start_y,delta_y,arguments[4],arguments[5]);
  }
  else {
    this.drawXDataGrid(start_x,delta_x);
    this.drawYDataGrid(start_y,delta_y);
  }
};

sciPlotCartesian.prototype.drawDataBar = function(x1,y1,x2,y2,fill_color) {  //add point2D cap
  var ctx = document.getElementById(this.canvas_id).getContext('2d');
  ctx.fillStyle = fill_color;
  ctx.fillRect(this.canvasXFromDataX(x1),this.canvasYFromDataY(y2),this.canvasXFromDataX(x2)-this.canvasXFromDataX(x1),
               this.canvasYFromDataY(y1)-this.canvasYFromDataY(y2));
};

sciPlotCartesian.prototype.drawVertBarForDataRangeX = function(x1,x2,fill_color) {
  this.drawDataBar(x1,this.y_axis.coord.d2,x2,this.y_axis.coord.d1,fill_color);
};

sciPlotCartesian.prototype.drawHorizBarForDataRangeY = function(y1,y2,fill_color) {
  this.drawDataBar(this.x_axis.coord.d1,y1,this.x_axis.coord.d2,y2,fill_color);
};

    //  3 or 5 arg version: (x,y1,y2) or (x,y1,y2,stroke_color,line_width)
sciPlotCartesian.prototype.drawVertTicAtDataX = function(x,y1,y2) {
  var ctx = this.setUpCtx(3,arguments);
  drawCleanVertLine(this.canvasXFromDataX(x),this.y_axis.origin-y1,this.y_axis.origin-y2,ctx);
};

    //  3 or 5 arg version: (x1,x2,y) or (x1,x2,y,stroke_color,line_width)
sciPlotCartesian.prototype.drawHorizTicAtDataY = function(x1,x2,y) {
  var ctx = this.setUpCtx(3,arguments);
  drawCleanHorizLine(this.x_axis.origin+x1,this.x_axis.origin+x2,this.canvasYFromDataY(y),ctx);
};

sciPlotCartesian.prototype.drawHorizTextAtDataX = function(str,x,y) {
  drawCanvasText(str,this.canvasXFromDataX(x),this.y_axis.origin-y,this.text_style,this.canvas_id);
};

sciPlotCartesian.prototype.drawHorizTextAtDataY = function(str,x,y) {
  drawCanvasText(str,this.x_axis.origin+x,this.canvasYFromDataY(y),this.text_style,this.canvas_id);
};

sciPlotCartesian.prototype.drawHorizTextAtPixXY = function(str,x,y) {
  drawCanvasText(str,this.x_axis.origin+x,this.y_axis.origin-y,this.text_style,this.canvas_id);
};

sciPlotCartesian.prototype.drawVertTextAtDataX = function(str,x,y) {
  drawCanvasVerticalText(str,this.canvasXFromDataX(x),this.y_axis.origin-y,this.text_style,this.canvas_id);
};

sciPlotCartesian.prototype.drawVertTextAtPixXY = function(str,x,y) {
  drawCanvasVerticalText(str,this.x_axis.origin+x,this.y_axis.origin-y,this.text_style,this.canvas_id);
};

/*
//  These are the old inverse functions to go from screen pix data value.  No use within this lib.  Should be kept, but 
//  uses are much less common (e.g. mouse read out of data).
screenCartesian.prototype.coordXFromScreenX = function(x) {
  return this.coord.x.d1 + this.coord.width()*this.screen.x_fraction(x);
};

screenCartesian.prototype.coordYFromScreenY = function(y) {
  return this.coord.y.d1 + this.coord.height()*this.screen.y_fraction(y);
};
*/

/*   little use within lib itself, what would be use cases outside of the lib?
screenCartesian.prototype.screenDelXFromCoordDelX = function(x) { return this.screen.width()*this.coord.x_fraction(x); };
screenCartesian.prototype.screenDelYFromCoordDelY = function(y) {  return this.screen.height()*this.coord.y_fraction(y); };
*/

/*  Future ideas:

   Transparency on DataBar drawing, for overlaying a highlight
   Log based number line eventually - separate sci-atom

   Might need basic line drawing method:
     Draw a line from a point onward at a said angle but terminating at a given x or y.
     Uses: Implementing 'chop' mode on line plots (cutting off lines at a given box bounds)
           Drawing line of specific slope/ratio in a 2d scatter type plot that terminate within plot bounds
     This is one way to enforce a bounded plot, but maybe a better one is to have the plot area be its own canvas - maybe
       have code/templates to assist in that.  That is a lot easier.  Need to make sure lines drawn right on the edge 
       don't get dropped.
*/

//----------------------------------------------------------------------------

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
// just initializations
  };

ruler.prototype.setTics = function(num_major_div,major_tic_length,major_tic_width,num_minor_div,minor_tic_length,minor_tic_width) {
// just initializations
  };

ruler.prototype.setLabels = function(min_label,max_label,num_decimals,x_off,y_off,label_font,title_font,title) {
// straight initialization
  this.num_decimals = Math.floor(num_decimals);
  if(this.num_decimals<0)  this.num_decimals = 0;
  if(this.num_decimals>3)  this.num_decimals = 3;
// straight initialization
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
//  same code block as minor tics above
    }
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
  };

ruler.prototype.drawTitle = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  if(this.orientation == "vert") {
//---stuff
    }
  if(this.orientation == "horiz") {
//---stuff
    }
  };

ruler.prototype.drawAll = function(canvas_id) {
  this.drawRule(canvas_id);
  this.drawTics(canvas_id);
  this.drawLabels(canvas_id);
  this.drawTitle(canvas_id);
  };

//----------------------------------------------------------------------------

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
    }
  for(var i=0;i<=this.num_x;++i) {
    if(this.x_shift>0 && i==this.num_x)  continue;
    extendVertLine(this.origin.x+this.x_shift+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y,this.height,ctx);
    }
  };

//----------------------------------------------------------------------------
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
// just initializations
  };

timeRuler.prototype.setTimes = function(origin_time,end_time,major_div_mode,minor_div_mode) {
// just initializations
  };

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

