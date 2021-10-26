//############################################################################
//      calendar_jump_buttons.js
//      by Brian T Kaney, 2016, 2021
//############################################################################

function timeJumpButtons(num_jumps)
{  
  this.num_jumps = num_jumps;
  this.buttons;
  this.jump_sec = new Array(this.num_jumps);
  this.jump_txt = new Array(this.num_jumps);
  this.jump_hover_index = -1;

  this.utc_hr_shift = 0;
  this.start_time = new time(1970,1,1,0,0,0);
  this.selected_time = new time(3600*this.utc_hr_shift);
  this.end_time = new time(3600*this.utc_hr_shift);
  this.window_mode = "realtime_end";   //--only option so far, later add realtime_fixed_width_window or something?
  this.seconds_resolution = 1;

  this.arrow_color = "#000000";
  this.text_box_color = "#E0F5E0";
  this.highlight_box_color = "#C0F5C0";
  this.text_color = "#000000";
  this.inactive_color = "#CCCCCC";   //---or just grey-ify the active colors/some good new functions I need to write
  this.a_wid;
  this.b_hgt;
  this.t_wid;

  this.updateRestOfPage = function() { };
}

timeJumpButtons.prototype.setTimes = function(start_time,selected_time,end_time) {
  this.start_time    = start_time;     //--error handling:  what to do with selected time outside the start,end window?  enforce this?
  this.selected_time = selected_time;
  this.end_time      = end_time;
};

timeJumpButtons.prototype.setCanvas = function(parent_id,pix_left,pix_top,child_id,pix_width,pix_height,back_color) {
  this.jump_canvas_id = child_id;
  createCanvas(parent_id,pix_left,pix_top,child_id,pix_width,pix_height,back_color);
};

timeJumpButtons.prototype.initialize = function() {
  document.getElementById(this.jump_canvas_id).addEventListener('mousemove',this.defaultAction.bind(this),false);
  document.getElementById(this.jump_canvas_id).addEventListener('mousedown',this.defaultAction.bind(this),false);
  document.getElementById(this.jump_canvas_id).addEventListener('mouseout',this.defaultAction.bind(this),false);
  this.drawButtons();
};

timeJumpButtons.prototype.setLayout = function(arrow_width,button_height,text_width,num_cols,col_gap)
{
  this.a_wid = arrow_width;
  this.b_hgt = button_height;
  this.t_wid = text_width;
  this.buttons = new hotRectangles(2*this.num_jumps);
  this.buttons.setConstDimensions(this.a_wid,this.b_hgt);

  for(var i=0;i<2*this.num_jumps;++i) { 
    this.buttons.left_x[i] = (i%2)*(this.a_wid+this.t_wid) + Math.floor(Math.floor(i/2)/(this.num_jumps/num_cols))*(2*this.a_wid+this.t_wid+col_gap);
    this.buttons.top_y[i] = (Math.floor(i/2)%(this.num_jumps/num_cols))*this.b_hgt;
  }
};

timeJumpButtons.prototype.drawButtons = function()
{
  if(this.window_mode=="realtime_end") { this.end_time = new time(3600*this.utc_hr_shift,this.seconds_resolution); }

  canvasClear(this.jump_canvas_id);
  var ctx = document.getElementById(this.jump_canvas_id).getContext('2d');

  ctx.font = "9pt Arial";

//  Still convoluted.  Break into blocks by function (i.e. set active = 0 or 1 all together, etc), even if num lines doesn't decrease
  for(var i=0;i<this.num_jumps;++i)
  {
    this.buttons.active[2*i] = 1;
    this.buttons.active[2*i+1] = 1;

    ctx.fillStyle = this.text_box_color;
    if(this.jump_sec[i]%this.seconds_resolution!=0)  { 
      ctx.fillStyle = this.inactive_color;
      this.buttons.active[2*i] = 0;
      this.buttons.active[2*i+1] = 0;
    }
    ctx.fillRect(this.buttons.left_x[2*i],this.buttons.top_y[2*i],2*this.a_wid+this.t_wid,this.b_hgt);

    ctx.fillStyle = this.text_color;
    ctx.fillText(this.jump_txt[i],this.buttons.left_x[2*i]+this.a_wid+(this.t_wid-ctx.measureText(this.jump_txt[i]).width)/2,this.buttons.top_y[2*i]+15);

    if(this.jump_sec[i]%this.seconds_resolution!=0) { continue; }
    if(this.jump_hover_index==2*i) { ctx.fillStyle = this.highlight_box_color;  ctx.fillRect(this.buttons.left_x[2*i],this.buttons.top_y[2*i],this.a_wid,this.b_hgt); }
    if(this.jump_hover_index==2*i+1) { ctx.fillStyle = this.highlight_box_color;  ctx.fillRect(this.buttons.left_x[2*i+1],this.buttons.top_y[2*i+1],this.a_wid,this.b_hgt); }

    var arrow_style = new shapeStyle('#000000','',0);
    if(compareTimes(this.selected_time.spawnTime(-1*this.jump_sec[i]),this.start_time)!='less') {
      drawCanvasPolygon(this.buttons.left_x[2*i]+4,this.buttons.top_y[2*i]+11,ctx,arrow_style,2,8,-5,8,5);    //---left arrow
    }
    else { this.buttons.active[2*i] = 0; }

    if(compareTimes(this.selected_time.spawnTime(this.jump_sec[i]),this.end_time)!='more') { 
      drawCanvasPolygon(this.buttons.left_x[2*i+1]+13,this.buttons.top_y[2*i+1]+11,ctx,arrow_style,2,-8,5,-8,-5);    //--right arrow
    }
    else { this.buttons.active[2*i+1] = 0; }
  }
};

//----------------------------------------------------------------------------

timeJumpButtons.prototype.defaultAction = function(e)
{
  pt = getMouseScreenPoint(this.jump_canvas_id,e);
  e.preventDefault();

  this.jump_hover_index = this.buttons.getIndex(pt);

  if(e.type == "mousemove") {
    if(this.jump_hover_index>=0) { document.getElementById(this.jump_canvas_id).style.cursor = "pointer"; }
    else                         { document.getElementById(this.jump_canvas_id).style.cursor = "default"; }
  }
  if(e.type == "mouseout") { document.getElementById(this.jump_canvas_id).style.cursor = "default"; }

  if(e.type == "mousedown"&& this.jump_hover_index>=0) {
    this.selected_time.addSeconds(Math.pow(-1,1+this.jump_hover_index)*this.jump_sec[Math.floor(this.jump_hover_index/2)]);
    this.updateRestOfPage();
  }

  this.drawButtons();
};

//----------------------------------------------------------------------------

