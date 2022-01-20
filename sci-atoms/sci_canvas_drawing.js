//############################################################################
//#     sci_canvas_drawing.js
//#     by Brian T Kaney, 2015-2021
//#     Library for drawing simple graphics on a canvas.
//#     DEPENDENCIES:none 
//############################################################################

function canvasClear(canvas_id)
{
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.clearRect(0,0,document.getElementById(canvas_id).width,document.getElementById(canvas_id).height);
}

function drawLine(x1,y1,x2,y2,ctx)
{
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

function drawCleanHorizLine(x1,x2,y,ctx)
{
  var offset = (ctx.lineWidth%2)/2;
  ctx.beginPath();
  ctx.moveTo(x1,Math.round(y)+offset);
  ctx.lineTo(x2,Math.round(y)+offset);
  ctx.stroke();
}

function drawCleanVertLine(x,y1,y2,ctx)
{
  var offset = (ctx.lineWidth%2)/2;
  ctx.beginPath();
  ctx.moveTo(Math.round(x)+offset,y1);
  ctx.lineTo(Math.round(x)+offset,y2);
  ctx.stroke();
}

function extendHorizLine(x,y,distance,ctx) {
  drawCleanHorizLine(x,x+distance,y,ctx);
}

function extendVertLine(x,y,distance,ctx) {
  drawCleanVertLine(x,y,y-distance,ctx);
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

    //  0 or 2 arg version: () or (stroke_color,line_width)
function lineStyle()
{
  if(arguments.length==2) { this.stroke_color = arguments[0];  this.line_width = arguments[1]; }
  else { this.stroke_color = "#000000";  this.line_width = 1; }
}

lineStyle.prototype.set = function(stroke_color,line_width)
{
  this.stroke_color = stroke_color;
  this.line_width = line_width;
};

    //  0 or 3 arg version: () or (fill_color,stroke_color,line_width)
function shapeStyle()
{
  if(arguments.length==3) {
    this.fill_color = arguments[0];
    this.line = new lineStyle(arguments[1],arguments[2]);
  }
  else {
    this.fill_color = "#FFFFFF";
    this.line = new lineStyle();
  }
}

shapeStyle.prototype.set = function(fill_color,stroke_color,line_width)
{
  this.fill_color = fill_color;
  this.line.set(stroke_color,line_width);
};

    //  0 or 4 arg version: () or (font,text_color,h_align,v_align)
function textStyle()
{
  if(arguments.length==3) {
    this.font = arguments[0];
    this.text_color = arguments[1];
    this.h_align = arguments[2];
    this.v_align = arguments[3];
  }
  else {
    this.font = "normal 12pt arial";
    this.text_color = "#000000";
    this.h_align = "left";
    this.v_align = "bottom";
  }
}

textStyle.prototype.set = function(font,text_color,h_align,v_align)
{
  this.font = font;
  this.text_color = text_color;
  this.h_align = h_align;
  this.v_align = v_align;
};

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function drawCanvasLine(x1,y1,x2,y2,line_style,canvas_id,ctx)
{
  if(arguments.length==6) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.strokeStyle = line_style.stroke_color;
  ctx.lineWidth = line_style.line_width;

  drawLine(x1,y1,x2,y2,ctx);
}

function drawCanvasRect(left_x,top_y,width,height,shape_style,canvas_id,ctx)
{    //--rename as 'Clean' version and add ooch variable.  do I need a non-clean version, test it out?
     //  [old note above: do not add 'ooch' here, but call 'clean' subs - push logic to lower levels of code.)
  if(arguments.length==6)  { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  if(shape_style.fill_color!='') { ctx.fillStyle = shape_style.fill_color; }
  if(shape_style.line.stroke_color!='') { ctx.strokeStyle = shape_style.line.stroke_color; }
  ctx.lineWidth = shape_style.line_width;

  if(shape_style.fill_color!='') {
    ctx.fillRect(Math.round(left_x),Math.round(top_y),Math.round(width-1),Math.round(height-1));
  }
  if(shape_style.line.stroke_color!='') {
    ctx.strokeRect(Math.round(left_x)+0.5,Math.round(top_y)+0.5,Math.round(width-1),Math.round(height-1));
  }
}

function drawCanvasCircle(x,y,radius,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  if(style.fill_color!='') { ctx.fillStyle   = style.fill_color; }
  if(style.stroke_color!='') { ctx.strokeStyle = style.line.stroke_color; }
  ctx.lineWidth = style.line.line_width;

  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2,true);
  if(style.fill_color!='') { ctx.fill(); }
  if(style.stroke_color!='') { ctx.stroke(); }
}

function drawCanvasText(text,x,y,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.fillStyle = style.text_color;
  ctx.font = style.font;
  if(style.h_align=="left")   { var x_offset = 0; }
  if(style.h_align=="center") { var x_offset = -1*ctx.measureText(text).width/2; }
  if(style.h_align=="right")  { var x_offset = -1*ctx.measureText(text).width; }
  if(style.v_align=="bottom") { var y_offset = 0; }
  if(style.v_align=="center") { var y_offset = approxFontHeight(style.font)/2; }
  if(style.v_align=="top")    { var y_offset = approxFontHeight(style.font); }
  ctx.fillText(text,x+x_offset,y+y_offset);
}

function drawCanvasVerticalText(text,x,y,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.fillStyle = style.text_color;
  ctx.font = style.font;
  if(style.h_align=="left")   { var x_offset = 0; }
  if(style.h_align=="center") { var x_offset = -1*ctx.measureText(text).width/2; }
  if(style.h_align=="right")  { var x_offset = -1*ctx.measureText(text).width; }
  if(style.v_align=="bottom") { var y_offset = 0; }
  if(style.v_align=="center") { var y_offset = approxFontHeight(style.font)/2; }
  if(style.v_align=="top")    { var y_offset = approxFontHeight(style.font); }

  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(-0.5*Math.PI);
  ctx.fillText(text,x_offset,y_offset);
  ctx.restore();
}



//  changes to shapeStyle may not be reflected in code past this point

function drawCanvasConfinedRect(left_x,top_y,width,height,style,canvas_id)
{
  var ctx = document.getElementById(canvas_id).getContext('2d');
  if(style.fill_color!='') { ctx.fillStyle = style.fill_color; }
  if(style.stroke_color!='') { ctx.strokeStyle = style.stroke_color; }
  ctx.lineWidth = style.line_width;

  var w = Math.round(width-1);
  var h = Math.round(height-1);
  if((left_x+w+1)>document.getElementById(canvas_id).width) { w = document.getElementById(canvas_id).width-left_x-1; }
  if((top_y+h+1)>document.getElementById(canvas_id).height) { h = document.getElementById(canvas_id).height-top_y-1; }

  if(style.fill_color!='') { ctx.fillRect(Math.round(left_x),Math.round(top_y),w,h); }
  if(style.stroke_color!='') { ctx.strokeRect(Math.round(left_x)+0.5,Math.round(top_y)+0.5,w,h); }
}






//needless diff between how next two Functions compare to each other and above
//--rename to 'DeltaList', same as below in that it uses a descrete list, but uses x and y deltas instead of full vlalues.  Both can have an array version too!!!  

//-- note new approach to handling both '' for color, spread elsewhere
function drawCanvasPolygon(x,y,ctx,style,num_points)
{  
  ctx.lineWidth = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x,y);
  for(var i=0;i<num_points;++i) {
    ctx.lineTo(x+arguments[5+2*i],y+arguments[5+2*i+1]);
  }
  ctx.closePath();
  if(style.fill_color!='') { ctx.fillStyle = style.fill_color;  ctx.fill(); }
  if(style.stroke_color!='') { ctx.strokeStyle = style.stroke_color;  ctx.stroke(); }
}

function drawCanvasPolygonFullList(x,y,ctx,mode,num_points)
{
//  here ctx, must be sent so just as easy to set colors there. passing styyle multi layers deep
//  if(style.fill_color!='none')    ctx.fillStyle = style.fill_color;
//  if(style.stroke_color!='none')  ctx.strokeStyle = style.stroke_color;
//  ctx.lineWidth   = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x,y);
  for(var i=0;i<num_points;++i) {
    ctx.lineTo(arguments[5+2*i],arguments[5+2*i+1]);
  }
  ctx.closePath();
  if(mode=='both' || mode=='fill') { ctx.fill(); }
  if(mode=='both' || mode=='stroke') { ctx.stroke(); }
}

//----------------------------------------------------------------------------
//   Revise this statement

//   In labelStyle any of the three color strings or font string can be set to ''.  This empty string will
//   suppress the drawing of any relevant features in other Functions that use this.  This behavior should be
//   respected in all usage of this object.
//----------------------------------------------------------------------------

function labelStyle(fill_color,stroke_color,line_width,font,text_color)
{
  this.shape = new shapeStyle(fill_color,stroke_color,line_width);
  this.font = font;
  this.text_color = text_color;
}

labelStyle.prototype.set = function(fill_color,stroke_color,line_width,font,text_color)
{
  this.shape.set(fill_color,stroke_color,line_width);
  this.font = font;
  this.text_color = text_color;
};

/*   2021-2022 notes: mix of older stuff follows.  Drawing of 'labels' has not been fully reworked since I started
     adding labelStyle and textStyle (and 'align') and other improvements at lower levels.  */

function drawCanvasLabel(text,x,y,x_offset,y_offset,style,canvas_id,ctx)
{
  if(arguments.length==7) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.fillStyle = style.text_color;
  ctx.font = style.font;

  if(x_offset=="center") { x_offset = -1*(ctx.measureText(text).width)/2; }
  if(y_offset=="center") { y_offset = approxFontHeight(style.font)/2; }

  ctx.fillText(text,x+x_offset,y+y_offset);
}

//  rename as drawMinimalLabel or something.  this one has no width or height specified - size set by text size and some (ought to be settable) margin
//  this Function probably not in use - check that/has issues.  arg structure supposedly allows 'canvas_id' to be optional and yet it is forced
//  in the drawCanvasRect call.  And why have this call at all if the drawing of rect is supposed to be optional and triggered by the prescence of a fill
//  color in the 'label_style'.  Don't use these until it gets worked out.

function drawCanvasRectLabel(x,y,label_text,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }

  ctx.font = style.font;     //--must precede use of ctx.measureText
  var text_x_offset = Math.round(ctx.measureText(label_text).width/2);
  var text_y_offset = Math.round(approxFontHeight(style.font)/2);

  drawCanvasRect(x-text_x_offset-4,y-text_y_offset-4,2*(text_x_offset+4),2*(text_y_offset+4),style.shape,canvas_id);
  ctx.fillStyle = style.text_color;
  ctx.fillText(label_text,x-text_x_offset,y+text_y_offset);
}

function drawCanvasFixedLabel(label_text,left_x,top_y,x_indent,width,height,style,canvas_id,ctx)
{
  if(arguments.length==8) { var ctx = document.getElementById(canvas_id).getContext('2d'); }

  ctx.font = style.font;     //--must precede use of ctx.measureText
  if(x_indent=="center") { var text_x_offset = (width - ctx.measureText(label_text).width)/2; }
  else                   { var text_x_offset = x_indent; }
  var text_y_offset = height/2 + approxFontHeight(style.font)/2;

  drawCanvasRect(left_x,top_y,width,height,style.shape,canvas_id,ctx);
  ctx.fillStyle = style.text_color;
  ctx.fillText(label_text,left_x+text_x_offset,top_y+text_y_offset);
}
















function drawCanvasWedge(x,y,a1,a2,radius,style,canvas_id,ctx)
{
  if(arguments.length==6) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  if(style.fill_color!='none') { ctx.fillStyle = style.fill_color; }
  if(style.stroke_color!='none') { ctx.strokeStyle = style.stroke_color; }
  ctx.lineWidth = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.arc(x,y,radius,-1*a1*Math.PI/180,-1*a2*Math.PI/180,true);
  ctx.lineTo(x,y);
  if(style.fill_color!='none') { ctx.fill(); }
  if(style.stroke_color!='none') { ctx.stroke(); }
}

//----------------------------------------------------------------------------

function drawCanvasPlus(x,y,length,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;
  var nudge = (ctx.lineWidth%2)/2;      //--can 'push down' this to lower level Function and purge
  var ooch = ctx.lineWidth%2;   //--- to what extent have these 'tricks' been fully tested?  check it out sometime

  drawLine(x-length,Math.round(y)+nudge,x+length+ooch,Math.round(y)+nudge,ctx);
  drawLine(Math.round(x)+nudge,y-length,Math.round(x)+nudge,y+length+ooch,ctx);
}

function drawCanvasX(x,y,width,height,style,canvas_id,ctx)
{
  if(arguments.length==6) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;

  drawLine(x-width/2,y-height/2,x+width/2,y+height/2,ctx);
  drawLine(x-width/2,y+height/2,x+width/2,y-height/2,ctx);
}

//----------------------------------------------------------------------------

function drawVerticalText(text,x,y,ctx)
{
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(-0.5*Math.PI);
  ctx.fillText(text,0,0);
  ctx.restore();
}

function approxFontHeight(font)
{
  if(font.indexOf('9pt')>=0)  return 9;
  if(font.indexOf('10pt')>=0)  return 10;
  if(font.indexOf('11pt')>=0 || font.indexOf('12pt')>=0)  return 12;
  return 12;
}

/*
f u n c t i o n drawCanvasLineArrow(x1,y1,x2,y2,arrow_length,style,canvas_id,ctx) {
*/



