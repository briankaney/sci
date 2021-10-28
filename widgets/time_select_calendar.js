//############################################################################
//#       time_select_calendar.js
//#       by Brian T. Kaney, May 2021
//############################################################################

//#       0 or 1 arg version: () or (id)
function calendarSelect()
{
  if(arguments.length>0) { this.main_div_id = arguments[0]; }
  else { this.main_div_id = "sci_time_select_calendar"; }
  this.cal_field = ["_yr_canvas","_mo_canvas","_dy_canvas","_hr_canvas","_min_canvas"];
  this.cal_field_canvas_id = new Array(5);
  for(var i=0;i<5;++i) { this.cal_field_canvas_id[i] = this.main_div_id + this.cal_field[i]; }

  this.start_time = new time(2020,1,1,0,0,0);
  this.obj_time = new time(0,3600);
  this.end_time = new time();

  this.time_window_mode = "fixed";  //  'fixed' or 'real_end' or 'real_window'
  this.utc_hr_shift = 0;

  this.t_obj = new Array();

  this.horiz_padding = 3;
  this.vert_padding = 3;
  this.time_field_padding_color = "#FFFFFF";
  this.field_gap = 3;
  this.total_button_width = 210;
  this.time_field_width;
  this.tot_div_height;

  this.num_fields = 5;
  this.hr_res = 1;
  this.min_res = 5;

  this.num_rows = [2,3,6,4,2];
  this.num_columns = [5,4,7,6,6];
  this.button_height = [22,22,20,22,20];
  this.button_width  = [42,52.5,30,35,35];

  this.num_buttons = new Array(5);
  this.time_field_height = new Array(5);
  this.time_field_top_y = new Array(5);
  this.evaluateDimensions();

  this.updateRestOfPage = function() { };
}

calendarSelect.prototype.setNumYears = function(num_years)
{
  if(arguments.length!=1 || num_years<1 || num_years>100) { return; }

  var num_col = 1;
  for(var i=2;i<=5;++i) {
    if(num_years%i==0) { num_col = i; }
  }
  if(num_col==1 && num_years>1) { return; }

  this.num_rows[0] = num_years/num_col;
  this.num_columns[0] = num_col;
  this.button_width[0] = this.total_button_width/num_col;

  this.evaluateDimensions();
};

calendarSelect.prototype.setSmallestIncrementInSec = function(sec_res)
{
  var allowed_sec = [60,120,300,600,900,1800,3600,21600,43200,86400,30*86400];

  var i = findIndex(allowed_sec,sec_res);  
  if(i<0) { return; }

  if(i==10) { this.num_fields = 2;  return; }
  if(i==9)  { this.num_fields = 3;  return; }

  var num_col = [6,6,6,6,4,2,  6,4,2];
  var num_row = [10,5,2,1,1,1, 4,1,1];

  if(i>9 && i<=6) {
    this.hr_res = sec_res/3660;
    this.num_fields = 4;
    this.num_columns[3] = num_col[i];
    this.num_rows[3] = num_row[i];
    this.button_width[3] = this.total_button_width/this.num_columns[3];
  }
  if(i<6) {
    this.min_res = sec_res/60;
    this.num_fields = 5;
    this.num_columns[4] = num_col[i];
    this.num_rows[4] = num_row[i];
    this.button_width[4] = this.total_button_width/this.num_columns[4];

    this.hr_res = 1;
    this.num_columns[3] = 6;
    this.num_rows[3] = 4;
    this.button_width[3] = this.total_button_width/this.num_columns[3];
  }

  this.evaluateDimensions();
};

calendarSelect.prototype.setTimes = function(start_t,current_t,end_t)
{
  this.start_time.equateToTime(start_t);
  this.obj_time.equateToTime(current_t);
  this.end_time.equateToTime(end_t);
  if(compareTimes(this.obj_time,this.start_time)=='less') { this.obj_time.equateToTime(start_t); }
  if(compareTimes(this.obj_time,this.end_time)=='more')   { this.obj_time.equateToTime(end_t); }
};

calendarSelect.prototype.evaluateDimensions = function()
{
  for(var i=0;i<this.num_fields;++i) {
    this.time_field_height[i] = this.button_height[i]*this.num_rows[i]+2*this.vert_padding;
    this.num_buttons[i] = this.num_rows[i]*this.num_columns[i];
  }

  this.time_field_top_y[0] = 0;
  for(var i=1;i<this.num_fields;++i) { this.time_field_top_y[i] = this.time_field_top_y[i-1]+this.time_field_height[i-1]+this.field_gap; }

  this.time_field_width = this.button_width[0]*this.num_columns[0]+2*this.horiz_padding;
  this.tot_div_height = this.time_field_top_y[this.num_fields-1] + this.time_field_height[this.num_fields-1];
}

calendarSelect.prototype.setDivInContainer = function(container_id,pix_left,pix_top,back_color)
{
  this.evaluateDimensions();

  var DivStyle = new divStyle();
  if(arguments.length==4) { DivStyle.setBackground(back_color,""); }

  DivStyle.setPositionAndDimensionsAsInt(pix_left,pix_top,this.time_field_width,this.tot_div_height);
  createDiv(container_id,this.main_div_id,DivStyle);
};

calendarSelect.prototype.initialize = function()
{
  var that = this;

  for(var i=0;i<this.num_fields;++i) {
    this.t_obj[i] = new sciCanvasRadioButtons(this.cal_field_canvas_id[i],this.num_buttons[i]);
    this.t_obj[i].button.colors[0] = "#FFFFFF";    //--need a set of more descriptive setting functions
    this.t_obj[i].button.colors[4] = "";
    this.t_obj[i].button.fonts[0] = "10pt arial";
    this.t_obj[i].button.rect.setAsBlockOfColumns(this.horiz_padding,this.vert_padding,this.num_columns[i],
                  this.button_width[i],this.button_height[i]);
    this.t_obj[i].setCanvasInContainer(this.main_div_id,0,this.time_field_top_y[i],this.time_field_width,
                  this.time_field_height[i],this.time_field_padding_color);
  }

  this.t_obj[0].updateRestOfPage = function()
  {
    that.obj_time.year = this.options[this.selected_index];
    that.updateAndDrawCalendar();
    that.updateRestOfPage();
  };

  this.t_obj[1].updateRestOfPage = function()
  {
    that.obj_time.month = this.selected_index+1;
    that.updateAndDrawCalendar();
    that.updateRestOfPage();
  };

  this.t_obj[2].updateRestOfPage = function()
  {
    that.obj_time.day = this.selected_index+1-dayOfWeek(that.obj_time.year,that.obj_time.month,1);
    that.updateAndDrawCalendar();
    that.updateRestOfPage();
  };

  this.t_obj[3].updateRestOfPage = function()
  {
    that.obj_time.hour = that.hr_res*this.selected_index;
    that.updateAndDrawCalendar();
    that.updateRestOfPage();
  };

  this.t_obj[4].updateRestOfPage = function()
  {
    that.obj_time.minute = that.min_res*this.selected_index;
    that.updateAndDrawCalendar();
    that.updateRestOfPage();
  };

  this.setCalendarFieldButtons();

  this.t_obj[0].initialize(this.obj_time.year);
  this.t_obj[1].initialize(monthName(this.obj_time.month,'abbrev3'));
  this.t_obj[2].initialize(this.obj_time.day);
  this.t_obj[3].initialize(this.obj_time.hour);
  this.t_obj[4].initialize(this.obj_time.minute);
};

calendarSelect.prototype.updateAndDrawCalendar = function()
{
  if(this.time_window_mode!="fixed") { this.end_time = new time(3600*this.utc_hr_shift,60*this.min_res); }
//  if(this.time_window_mode=="real_window") { this.start_time = this.end_time.spawnTime(-1*this.time_window_range); }
//  not implemented yet, need to think about fact valid times at start are taken away with a click.

  this.obj_time.rectifyDate();
  this.obj_time.confineTimeToWindow(this.start_time,this.end_time);
  this.setCalendarFieldButtons();
  this.t_obj[1].setSelectedOption(monthName(this.obj_time.month,'abbrev3'));
  this.t_obj[2].setSelectedOption(this.obj_time.day);
  this.t_obj[3].setSelectedOption(this.obj_time.hour);
  this.t_obj[4].setSelectedOption(this.obj_time.minute);
  for(var i=0;i<this.num_fields;++i) { this.t_obj[i].draw(); }
};

     //---set all active first, then inactivate buttons
calendarSelect.prototype.setCalendarFieldButtons = function()
{
  for(var i=0;i<this.num_buttons[0];++i)
  {
    this.t_obj[0].button.display_txt[i] = this.start_time.year + i;
    this.t_obj[0].options[i] = this.start_time.year + i;
    this.t_obj[0].button.rect.active[i] = 1;
    if(this.start_time.year+i > this.end_time.year) { this.t_obj[0].button.rect.active[i] = 0; }
  }

  for(var i=0;i<this.num_buttons[1];++i)
  {
    this.t_obj[1].button.display_txt[i] = monthName(i+1,'abbrev3');
    this.t_obj[1].options[i] = monthName(i+1,'abbrev3');
    this.t_obj[1].button.rect.active[i] = 1;
    if(this.obj_time.year==this.start_time.year && i<this.start_time.month-1) { this.t_obj[1].button.rect.active[i] = 0; }
    if(this.obj_time.year==this.end_time.year && i>this.end_time.month-1)     { this.t_obj[1].button.rect.active[i] = 0; }
  }

  for(var i=0;i<this.num_buttons[2];++i)
  {
    var d = i + 1 - dayOfWeek(this.obj_time.year,this.obj_time.month,1);
    if(d<1 || d>this.obj_time.numDaysInMonth())
    {
      this.t_obj[2].button.rect.active[i]=0;
      this.t_obj[2].button.display_txt[i] = "";
      this.t_obj[2].options[i] = "";
    }
    else
    {
      this.t_obj[2].button.rect.active[i]=1;
      this.t_obj[2].button.display_txt[i] = d;
      this.t_obj[2].options[i] = d;
      if(compareTimes(this.obj_time.alterTime(-1,-1,d,23,59,59),this.start_time)=='less') { this.t_obj[2].button.rect.active[i] = 0; }
      if(compareTimes(this.obj_time.alterTime(-1,-1,d,0,0,0),this.end_time)=='more')      { this.t_obj[2].button.rect.active[i] = 0; }
    }
  }

  for(var i=0;i<this.num_buttons[3];++i)
  {
    this.t_obj[3].button.display_txt[i] = timeString(0,0,0,this.hr_res*i,0,0,'HH','') + ":";
    this.t_obj[3].options[i] = this.hr_res*i;
    this.t_obj[3].button.rect.active[i]=1;
    if(compareTimes(this.obj_time.alterTime(-1,-1,-1,this.hr_res*i,59,59),this.start_time)=='less')
    { this.t_obj[3].button.rect.active[i] = 0; }
    if(compareTimes(this.obj_time.alterTime(-1,-1,-1,this.hr_res*i,0,0),this.end_time)=='more')
    { this.t_obj[3].button.rect.active[i] = 0; }
  }

  for(var i=0;i<this.num_buttons[4];++i)
  {
    this.t_obj[4].button.display_txt[i] = ":" + timeString(0,0,0,0,this.min_res*i,0,'MM','');
    this.t_obj[4].options[i] = this.min_res*i;
    this.t_obj[4].button.rect.active[i]=1;
    if(compareTimes(this.obj_time.alterTime(-1,-1,-1,-1,this.min_res*i,59),this.start_time)=='less')
    { this.t_obj[4].button.rect.active[i] = 0; }
    if(compareTimes(this.obj_time.alterTime(-1,-1,-1,-1,this.min_res*i,0),this.end_time)=='more')
    { this.t_obj[4].button.rect.active[i] = 0; }
  }
};

