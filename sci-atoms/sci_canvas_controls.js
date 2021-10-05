//############################################################################
//#     sci_canvas_controls.js
//#     by Brian T Kaney, 2015-2021
//#     Library for navigational controls drawn on a canvas
//#     DEPENDENCIES:sci_screen_math.js,sci_canvas_drawing.js
//############################################################################

function sciSingleSlider(unique_base_id,orientation,num_pixels)
{
  this.div_id      = unique_base_id + "_div";
  this.canvas_id   = unique_base_id + "_canvas";
  this.orientation = orientation;    //--"vertical" or "horizontal"
  this.num_pixels  = num_pixels;
  this.current_pixel = 0;

  this.allowed_step = 1;
  this.slider_adjust = "off";

  this.knob_width = 10;
  this.knob_height = 26;
  this.knob_style = new shapeStyle('#FFFFFF','#000000',1);
  this.knob_to_canvas_margin = 2;

  this.canvas_width;
  this.canvas_height;
  this.canvas_left_offset = -1;
  this.canvas_top_offset = -1;

  this.div_width;
  this.div_height;

//  this.origin;

  this.trench_line_color = "#000000";
  this.trench_line_width = 2;  //--set to zero to suppress

  this.updateRestOfPage = function() { };
}

sciSingleSlider.prototype.setKnobAndCanvasSize = function(knob_width,knob_height,knob_fill_color,knob_stroke_color,knob_line_width)
{
  this.knob_width = knob_width;
  this.knob_height = knob_height;
  this.knob_style.set(knob_fill_color,knob_stroke_color,knob_line_width);
};

sciSingleSlider.prototype.setDivInContainer = function(container_id,div_left_offset,div_top_offset,div_width,div_height)
{   //--- (,,,,,background)
  var back_color = "";
  var back_image = "";
  if(arguments.length==6)
  {
    var background = arguments[5];
    if(background.substring(0,1)=="#") { back_color = background; }
    else { back_image = background; }
  }
  this.div_width = div_width;
  this.div_height = div_height;

  var div_style = new divStyle();
  div_style.setPositionAsInt(div_left_offset,div_top_offset);
  div_style.setDimensionsAsInt(this.div_width,this.div_height);
  div_style.back_color = back_color;
  div_style.back_image = back_image;

  createDiv(container_id,this.div_id,div_style);
};

sciSingleSlider.prototype.initialize = function(current_pixel)
{
  this.current_pixel = current_pixel;

  this.canvas_width = this.knob_width + 2*this.knob_to_canvas_margin;
  this.canvas_height = this.knob_height + 2*this.knob_to_canvas_margin;
  if(this.orientation=="vertical") { this.canvas_height = this.canvas_height + this.num_pixels; }
  if(this.orientation=="horizontal") { this.canvas_width = this.canvas_width + this.num_pixels; }

  if(this.canvas_left_offset==-1) { this.canvas_left_offset = Math.round((this.div_width-this.canvas_width)/2); }
  if(this.canvas_top_offset==-1) { this.canvas_top_offset = Math.round((this.div_height-this.canvas_height)/2); }

  createCanvas(this.div_id,this.canvas_left_offset,this.canvas_top_offset,this.canvas_id,this.canvas_width,this.canvas_height);
//  createCanvas(this.div_id,this.canvas_left_offset,this.canvas_top_offset,this.canvas_id,this.canvas_width,this.canvas_height,"#DDFFDD");

  document.getElementById(this.canvas_id).addEventListener('mousemove',this.defaultSlideAction.bind(this),false);
  document.getElementById(this.canvas_id).addEventListener('mousedown',this.defaultSlideAction.bind(this),false);
  document.getElementById(this.canvas_id).addEventListener('mouseup',this.endSlideAction.bind(this),false);
  document.getElementById(this.canvas_id).addEventListener('mouseout',this.endSlideAction.bind(this),false);
  this.draw();
};

sciSingleSlider.prototype.draw = function()
{
  canvasClear(this.canvas_id);
  var ctx = document.getElementById(this.canvas_id).getContext('2d');

  ctx.strokeStyle = this.trench_line_color;
  ctx.lineWidth = this.trench_line_width;

  if(this.orientation=="vertical") {
    drawCleanVertLine(this.canvas_width/2,(this.canvas_height-this.num_pixels)/2,(this.canvas_height+this.num_pixels)/2,ctx);
  }
  if(this.orientation=="horizontal") {
    drawCleanHorizLine((this.canvas_width-this.num_pixels)/2,(this.canvas_width+this.num_pixels)/2,this.canvas_height/2,ctx);
  }

  if(this.orientation=="vertical") {
      drawCanvasRect(this.knob_to_canvas_margin,this.knob_to_canvas_margin+this.num_pixels-this.current_pixel,this.knob_width,this.knob_height,this.knob_style,'',ctx);
  }
  if(this.orientation=="horizontal") {
      drawCanvasRect(this.knob_to_canvas_margin+this.current_pixel,this.knob_to_canvas_margin,this.knob_width,this.knob_height,this.knob_style,'',ctx);
  }
};

sciSingleSlider.prototype.endSlideAction = function(e)
{
  e.preventDefault();
  document.getElementById(this.canvas_id).style.cursor = "default";
  this.slider_adjust = "off";
};

sciSingleSlider.prototype.defaultSlideAction = function(e)
{
  e.preventDefault();
 
  if(this.orientation=="vertical") { var pix = this.canvas_height - getMouseScreenY(this.canvas_id,e) - (this.canvas_height-this.num_pixels)/2; }
  if(this.orientation=="horizontal") { var pix = getMouseScreenX(this.canvas_id,e) - (this.canvas_width-this.num_pixels)/2; }

  if(pix<0) { pix=0; }
  if(pix>=this.num_pixels) { pix=this.num_pixels-1; }

  if(this.slider_adjust=="off" && e.type=="mousedown") {
    document.getElementById(this.canvas_id).style.cursor = "pointer";
    this.slider_adjust = "on";
  }

  if(this.slider_adjust=="on")
  {
    this.current_pixel = this.allowed_step*Math.round(pix/this.allowed_step);
    this.updateRestOfPage();  // only if current pixel has changed?
    this.draw();
  }
};

//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function sciCanvasButtons(unique_base_id,num_controls)
{
  this.unique_base_id = unique_base_id;
  this.num_controls   = num_controls;

  this.event_type;
  this.last_hover_index = -1;
  this.current_hover_index = -1;

  this.rect = new hotRectangles(this.num_controls);

  this.colors = new Array();
  this.rect_fill_color_index = new Array();
  this.rect_stroke_color_index = new Array();
  this.rect_line_width = new Array();
  this.setLineWidths(1);

  this.display_txt = new Array();
  this.x_indent = "center";
  this.draw_rect = 1; 
  this.draw_text = 1; 

  this.updateRestOfPage = function() { };
  this.customDrawing = function() { };
}

sciCanvasButtons.prototype.setFillColorIndexes = function(value) {
  for(var i=0;i<this.num_controls;++i) { this.rect_fill_color_index[i]=value; }
};

sciCanvasButtons.prototype.setStrokeColorIndexes = function(value) {
  for(var i=0;i<this.num_controls;++i) { this.rect_stroke_color_index[i]=value; }
};

sciCanvasButtons.prototype.setLineWidths = function(value) {
  for(var i=0;i<this.num_controls;++i) { this.rect_line_width[i]=value; }
};

sciCanvasButtons.prototype.setCanvasInContainer = function(container_id,left_pix,top_pix,pix_width,pix_height) {  //--- (,,,,,background)
  if(arguments.length==6) { createCanvas(container_id,left_pix,top_pix,this.unique_base_id,pix_width,pix_height,arguments[5]); }
  else                    { createCanvas(container_id,left_pix,top_pix,this.unique_base_id,pix_width,pix_height); }
};

sciCanvasButtons.prototype.initialize = function()
{
  document.getElementById(this.unique_base_id).addEventListener('mousemove',this.defaultAction.bind(this),false);
  document.getElementById(this.unique_base_id).addEventListener('mousedown',this.defaultAction.bind(this),false);
  document.getElementById(this.unique_base_id).addEventListener('mouseout',this.defaultAction.bind(this),false);
  this.draw();
};

sciCanvasButtons.prototype.defaultAction = function(e)
{
  var pt = getMouseScreenPoint(this.unique_base_id,e);
  e.preventDefault();

  this.event_type = e.type;
  this.current_hover_index = this.rect.getIndex(pt);

  if(this.current_hover_index!=this.last_hover_index || this.event_type!="mousemove") { this.updateRestOfPage(); }
  this.last_hover_index = this.current_hover_index;
};

sciCanvasButtons.prototype.draw = function()
{
  canvasClear(this.unique_base_id);

  if(this.draw_rect==1)
  {
    for(var i=0;i<this.num_controls;++i) {
      var style = new shapeStyle(this.colors[this.rect_fill_color_index[i]],this.colors[this.rect_stroke_color_index[i]],this.rect_line_width[i]);
      drawCanvasConfinedRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i]+1,this.rect.height[i]+1,style,this.unique_base_id);
    }
  }

  this.customDrawing();

  if(this.draw_text==1)
  {
    for(var i=0;i<this.num_controls;++i)
    {
      var style = new textStyle("bold 11pt arial","#000000");
//      drawCanvasFixedLabel(this.display_txt[i],this.rect.left_x[i],this.rect.top_y[i],this.x_indent,this.rect.width[i]+1,this.rect.height[i]+1,style,this.unique_base_id);
      drawCanvasLabel(this.display_txt[i],this.rect.left_x[i]+this.rect.width[i]/2,this.rect.top_y[i]+this.rect.height[i]/2,this.x_indent,"center",style,this.unique_base_id);
    }
  }
};

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function sciCanvasRadioButtons(unique_base_id,num_controls)
{
  this.button = new sciCanvasButtons(unique_base_id,num_controls);
  this.button.colors = ["#888888","#FFFFFF","#DDDDDD","#BBEEFF","#000000"];
  this.button.setFillColorIndexes(1);
  this.button.setStrokeColorIndexes(4);

  this.selected_index=0;
  this.selected_option;
  this.options = new Array();

//  this.hover_index  = -1;
//  this.state_change = 0;

  this.updateRestOfPage = function() { };
}

sciCanvasRadioButtons.prototype.setCanvasInContainer = function(container_id,left_pix,top_pix,pix_width,pix_height)
{  //--- (,,,,,background)
  if(arguments.length==6) { this.button.setCanvasInContainer(container_id,left_pix,top_pix,pix_width,pix_height,arguments[5]); }
  else                    { this.button.setCanvasInContainer(container_id,left_pix,top_pix,pix_width,pix_height); }
};

sciCanvasRadioButtons.prototype.setSelectedOption = function(test_option)
{
  var test_index = findIndex(this.options,test_option);
  if(test_index>=0)
  {
    this.selected_index = test_index;
    this.selected_option = test_option;
    this.button.setFillColorIndexes(1);
    this.button.rect_fill_color_index[this.selected_index]=3;
  }
};

sciCanvasRadioButtons.prototype.initialize = function(selected_option)
{
  this.setSelectedOption(selected_option);

  this.button.initialize();   //--No new event listeners, just these.  Includes button.draw() call.

  var that = this;
  this.button.updateRestOfPage = function()
  {
    if(this.event_type=="mousedown" && this.current_hover_index>=0) {
      that.setSelectedOption(that.options[this.current_hover_index]);
      that.updateRestOfPage();
    }

    if(this.current_hover_index==-1 || this.current_hover_index==that.selected_index) {
      document.getElementById(this.unique_base_id).style.cursor = "default";
    }
    if(this.current_hover_index>=0 && this.current_hover_index!=that.selected_index) {
      document.getElementById(this.unique_base_id).style.cursor = "pointer";
    }

    this.setFillColorIndexes(1);
    if(this.current_hover_index>=0) { this.rect_fill_color_index[this.current_hover_index]=2; }
    this.rect_fill_color_index[that.selected_index]=3;
    this.draw();
  };
};

