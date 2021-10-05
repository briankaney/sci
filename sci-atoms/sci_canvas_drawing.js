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

function shapeStyle(fill_color,stroke_color,line_width)
{
  this.fill_color = fill_color;
  this.stroke_color = stroke_color;
  this.line_width = line_width;
}

shapeStyle.prototype.set = function(fill_color,stroke_color,line_width)
{
  this.fill_color = fill_color;
  this.stroke_color = stroke_color;
  this.line_width = line_width;
};

function textStyle(font,text_color)
{
  this.font = font;
  this.text_color = text_color;
}

textStyle.prototype.set = function(font,text_color)
{
  this.font = font;
  this.text_color = text_color;
};

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function drawCanvasLine(x1,y1,x2,y2,style,canvas_id,ctx)
{
  if(arguments.length==6) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;

  drawLine(x1,y1,x2,y2,ctx);
}

function drawCanvasRect(left_x,top_y,width,height,style,canvas_id,ctx)
{  //--rename as 'Clean' version and add ooch variable.  do I need a non-clean version, test it out 
  if(arguments.length==6)  { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  if(style.fill_color!='') { ctx.fillStyle = style.fill_color; }
  if(style.stroke_color!='') { ctx.strokeStyle = style.stroke_color; }
  ctx.lineWidth = style.line_width;

  if(style.fill_color!='') { ctx.fillRect(Math.round(left_x),Math.round(top_y),Math.round(width-1),Math.round(height-1)); }
  if(style.stroke_color!='') { ctx.strokeRect(Math.round(left_x)+0.5,Math.round(top_y)+0.5,Math.round(width-1),Math.round(height-1)); }
}

function drawCanvasCircle(x,y,radius,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }
  if(style.fill_color!='') { ctx.fillStyle   = style.fill_color; }
  if(style.stroke_color!='') { ctx.strokeStyle = style.stroke_color; }
  ctx.lineWidth = style.line_width;

  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2,true);
  if(style.fill_color!='') { ctx.fill(); }
  if(style.stroke_color!='') { ctx.stroke(); }
}





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

//  Below is now just a wrapper for ctx.fillText().  Basically allows one to call fillText for canvas drawing 
//  for any canvas by id without needing to define a ctx context;

function drawCanvasText(text,x,y,style,canvas_id,ctx)
{
  if(arguments.length==5) { var ctx = document.getElementById(canvas_id).getContext('2d'); }

  ctx.fillStyle = style.text_color;
  ctx.font = style.font;
  ctx.fillText(text,x,y);
}

/*   2021 change, replaced the one below with thee simpler one above.  the one below needs to be revived with a new name.  it has value
     added beyone the one above.  where (if anywhere) is it used?
*/

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



