//############################################################################
//       time_select_calendar.js
//       by Brian T. Kaney, May 2021
//############################################################################

function calendarSelect(id)
{
  this.main_div_id = id;
  this.cal_field = ["yr_canvas","mo_canvas","dy_canvas","hr_canvas","min_canvas"];

  this.zone_str = "UTC";

  this.start_time = new time();  //  this.start_time = new time(2000,1,1,0,0,0);
  this.cal_time = new time();
  this.end_time = new time();   //   new time(3600*this.utc_hr_shift);

//  this.time_window_end_mode = "realtime";
//  this.time_window_range = -1;
//  this.min_res = 2;

  this.num_years = 9;
  this.yr;
  this.mo;
  this.dy;
  this.hr;
  this.min;

  this.time_field_height = [22*3+8,22*3+8,20*6+8,22*4+8,22*5+8];
  this.time_field_top_y = [0,22*3+4,22*6+4+4,22*6+20*6+4+4+4,22*10+20*6+4+4+4+4];

  this.updateRestOfPage = function() { };
}

calendarSelect.prototype.setDivInContainer = function(container_id,pix_left,pix_top,pix_width,pix_height,back_color)
{
  var DivStyle = new divStyle();
  if(arguments.length==6) { DivStyle.setBackground(back_color,""); }
  DivStyle.setPositionAndDimensionsAsInt(pix_left,pix_top,pix_width,pix_height);
  createDiv(container_id,this.main_div_id,DivStyle);
};

   //--WORK: used to be optional min_res arg like function(start_time,cal_time,end_time,min_res), how to handle?
calendarSelect.prototype.setTimes = function(start_t,current_t,end_t)
{
  this.start_time.equateToTime(start_t);
  this.cal_time.equateToTime(current_t);
  this.end_time.equateToTime(end_t);
};

calendarSelect.prototype.initialize = function()
{
  var that = this;

  this.yr = new sciCanvasRadioButtons(this.cal_field[0],this.num_years);
//  this.yr.button.rect.setAsBlockOfColumns(7,4,3,70,Math.round(104*3/this.num_years));
  this.yr.button.rect.setAsBlockOfColumns(0,0,3,70,22);
  this.setCommonTimeFieldProperties(this.yr,0);

  this.yr.updateRestOfPage = function()
  {
    that.cal_time.year = this.options[this.selected_index];
    that.updateOtherPartsOfCalendar();
    that.updateRestOfPage();
  };

  this.mo = new sciCanvasRadioButtons(this.cal_field[1],12);
  this.mo.button.rect.setAsBlockOfColumns(0,0,4,52,22);
  this.mo.button.rect.width[3]=54;
  this.mo.button.rect.width[7]=54;
  this.mo.button.rect.width[11]=54;

  this.setCommonTimeFieldProperties(this.mo,1);

  this.mo.updateRestOfPage = function()
  {
    that.cal_time.month = this.selected_index+1;
    that.updateOtherPartsOfCalendar();
    that.updateRestOfPage();
  };

  this.dy = new sciCanvasRadioButtons(this.cal_field[2],42);
  this.dy.button.rect.setAsBlockOfColumns(0,0,7,30,20);
  this.setCommonTimeFieldProperties(this.dy,2);

  this.dy.updateRestOfPage = function()
  {
    that.cal_time.day = this.selected_index+1-dayOfWeek(that.cal_time.year,that.cal_time.month,1);
    that.updateOtherPartsOfCalendar();
    that.updateRestOfPage();
  };

  this.hr = new sciCanvasRadioButtons(this.cal_field[3],24);
  this.hr.button.rect.setAsBlockOfColumns(0,0,6,35,22);
  this.setCommonTimeFieldProperties(this.hr,3);

  this.hr.updateRestOfPage = function()
  {
    that.cal_time.hour = this.selected_index;
    that.updateOtherPartsOfCalendar();
    that.updateRestOfPage();
  };

  this.min = new sciCanvasRadioButtons(this.cal_field[4],30);
  this.min.button.rect.setAsBlockOfColumns(0,0,6,35,22);
  this.setCommonTimeFieldProperties(this.min,4);

  this.min.updateRestOfPage = function()
  {
    that.cal_time.min = this.selected_index;
    that.updateOtherPartsOfCalendar();
    that.updateRestOfPage();
  };

  this.setCalendarFieldButtons();

  this.yr.initialize(this.cal_time.year);
  this.mo.initialize(monthName(this.cal_time.month,'abbrev3'));
  this.dy.initialize(this.cal_time.day);
  this.hr.initialize(this.cal_time.hour);
  this.min.initialize(this.cal_time.min);
};

   //--last arg 'i' added more recently. this makes what goes in here and what is not
   //  more flexible. for instance, the this.hr.button.rectsetAsBlockOfColumns... could 
   //  go here too.  Or make this.yr, this.mo, this.hr an array of objects and do a 
   //  loop and dispense with this altogether.
calendarSelect.prototype.setCommonTimeFieldProperties = function(obj,i)
{
  obj.button.colors[0] = "#FFFFFF";    //--need a set of more descriptive setting functions
  obj.button.colors[4] = "";
  obj.button.fonts[0] = "10pt arial";
//  obj.setCanvasInContainer(this.main_div_id,0,24,224,116);
  obj.setCanvasInContainer(this.main_div_id,0,this.time_field_top_y[i],210,this.time_field_height[i]);
};

calendarSelect.prototype.updateOtherPartsOfCalendar = function()
{
  this.cal_time.rectifyDate();
  this.cal_time.confineTimeToWindow(this.start_time,this.end_time);
  this.setCalendarFieldButtons();
  this.mo.setSelectedOption(monthName(this.cal_time.month,'abbrev3'));
  this.dy.setSelectedOption(this.cal_time.day);
  this.hr.setSelectedOption(this.cal_time.hour);
  this.min.setSelectedOption(this.cal_time.min);
  this.yr.draw();
  this.mo.draw();
  this.dy.draw();
  this.hr.draw();
  this.min.draw();
};

     //---inactivate buttons outside start/end time window among other things...
calendarSelect.prototype.setCalendarFieldButtons = function()
{
  for(var i=0;i<this.num_years;++i)
  {
    this.yr.button.display_txt[i] = this.start_time.year + i;
    this.yr.options[i] = this.start_time.year + i;
    this.yr.button.rect.active[i] = 1;   //--set all buttons active, inactivate those outside start/end time window next
    if(this.start_time.year+i > this.end_time.year) { this.yr.button.rect.active[i] = 0; }
  }

  for(var i=0;i<12;++i)
  {
    this.mo.button.display_txt[i] = monthName(i+1,'abbrev3');
    this.mo.options[i] = monthName(i+1,'abbrev3');
    this.mo.button.rect.active[i] = 1;   //--set all buttons active, inactivate those outside start/end time window next
    if(this.cal_time.year==this.start_time.year && i<this.start_time.month-1) { this.mo.button.rect.active[i] = 0; }
    if(this.cal_time.year==this.end_time.year && i>this.end_time.month-1)     { this.mo.button.rect.active[i] = 0; }
  }

  for(var i=0;i<42;++i)
  {
    var d = i + 1 - dayOfWeek(this.cal_time.year,this.cal_time.month,1);
    if(d<1 || d>this.cal_time.numDaysInMonth())
    {
      this.dy.button.rect.active[i]=0;
      this.dy.button.display_txt[i] = "";
      this.dy.options[i] = "";
    }
    else
    {
      this.dy.button.rect.active[i]=1;
      this.dy.button.display_txt[i] = d;
      this.dy.options[i] = d;
      if(compareTimes(this.cal_time.alterTime(-1,-1,d,23,59,59),this.start_time)=='less') { this.dy.button.rect.active[i] = 0; }
      if(compareTimes(this.cal_time.alterTime(-1,-1,d,0,0,0),this.end_time)=='more')      { this.dy.button.rect.active[i] = 0; }
    }
  }

  for(var i=0;i<24;++i)
  {
    this.hr.button.display_txt[i] = timeString(0,0,0,i,0,0,'HH','') + ":";
    this.hr.options[i] = i;
    this.hr.button.rect.active[i]=1;   //--set all buttons active, inactivate those outside start/end time window next
    if(compareTimes(this.cal_time.alterTime(-1,-1,-1,i,59,59),this.start_time)=='less') { this.hr.button.rect.active[i] = 0; }
    if(compareTimes(this.cal_time.alterTime(-1,-1,-1,i,0,0),this.end_time)=='more')     { this.hr.button.rect.active[i] = 0; }
  }

  for(var i=0;i<30;++i)
  {
    this.min.button.display_txt[i] = ":" + timeString(0,0,0,0,2*i,0,'MM','');
    this.min.options[i] = 2*i;
    this.min.button.rect.active[i]=1;   //--set all buttons active, inactivate those outside start/end time window next
    if(compareTimes(this.cal_time.alterTime(-1,-1,-1,-1,2*i,59),this.start_time)=='less') { this.min.button.rect.active[i] = 0; }
    if(compareTimes(this.cal_time.alterTime(-1,-1,-1,-1,2*i,0),this.end_time)=='more')    { this.min.button.rect.active[i] = 0; }
  }
};

/*
   Old code snippets and notes below.  All having to do with thorny issues of how to dynamically have the calendar adjust to changes 
   in allowed resolution that could be triggered by other places in the code.

calendarSelect.prototype.setMinuteField = function(min_res) {
  this.min_res = min_res;
  if(this.min_res>=60) { //--July 2019 '==' changed to '>' as I tried to do a min_res=360 (6 hr) calendar.  This keeps it from crashing but all hours on hour panel still show
    this.head.button.rect.active[4] = 0;
    if(this.head.selected_index==4) {
      this.head.selected_index = 3;
      this.showCurrentHeadField();
      }
  this.min = new radioButtons(this.cal_field[4],60/this.min_res);
  if(this.min_res==2)  this.min.rect.setAsBlockOfColumns(7,4,6,35,21);
  if(this.min_res==5)  this.min.rect.setAsBlockOfColumns(12,4,4,50,36);
  if(this.min_res==10) this.min.rect.setAsBlockOfColumns(12,4,3,66,52);
  if(this.min_res==15) this.min.rect.setAsBlockOfColumns(12,4,2,100,52);
  if(this.min_res==30) this.min.rect.setAsBlockOfColumns(12,4,2,100,104);
  if(this.min_res<60)  {  for(var i=0;i<60/this.min_res;++i)  this.min.display_txt[i] = ":" + timeString(0,0,0,0,this.min_res*i,0,'MM','');  }

    The block below was a later addition.  It was only called elsewhere in the js.  An external change (like a product selection)
    could cause the 'min_res' to change.  If the min_res went from say 60 to 1440, then the entire hour panel must go.  But nothing 
    within the calendar object would cause an update/redraw.  I had a note saying that it just hid/unhid the hour panel and was 
    not set up to correctly handle like 6hr or 12hr res.  So never really finished and still needs work on options of this kind.

calendarSelect.prototype.drawCalendar = function() {
//  if(this.time_window_end_mode=="realtime")  this.end_time = new time(3600*this.utc_hr_shift,60*this.min_res);
//  if(this.time_window_range>0)               this.start_time = this.end_time.spawnTime(-1*this.time_window_range);
//  ...more stuff, I think...
*/

