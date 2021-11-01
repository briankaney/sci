//############################################################################
//#     sci_screen_math.js
//#     by Brian T Kaney, 2015-2021
//#     Library 
//#     DEPENDENCIES:none
//############################################################################

function screenPoint()  //-- () or (x,y)
{
  if(arguments.length==0) {
    this.x = 0;
    this.y = 0;
  }

  if(arguments.length==2) {
    this.x = arguments[0];
    this.y = arguments[1];
  }
}

screenPoint.prototype.setValue = function()  //-- (pt) or (x,y)
{
  if(arguments.length==1) {
    this.x = arguments[0].x;
    this.y = arguments[0].y;
  }

  if(arguments.length==2) {
    this.x = arguments[0];
    this.y = arguments[1];
  }
};

function distBetweenScrPts(pt1,pt2)
{
  return Math.pow((pt2.x-pt1.x)*(pt2.x-pt1.x)+(pt2.y-pt1.y)*(pt2.y-pt1.y),0.5);
}

function getMouseScreenX(element_id,e)
{
  var offset = document.getElementById(element_id).getBoundingClientRect();
  return Math.round(e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft - offset.left);
}

function getMouseScreenY(element_id,e)
{
  var offset = document.getElementById(element_id).getBoundingClientRect();
  return Math.round(e.pageY - document.body.scrollTop - document.documentElement.scrollTop - offset.top);
}

function getMouseScreenPoint(element_id,e)
{
  var x = getMouseScreenX(element_id,e);
  var y = getMouseScreenY(element_id,e);
  var pt = new screenPoint(x,y);
  return pt;
}

function rectDimensions()  //--rectDimensions() or rectDimensions(width,height)
{
  if(arguments.length==0) {
    this.width = 100;
    this.height = 100;
  }

  if(arguments.length==2) {
    this.width = width;
    this.height = height;
  }
}
  
rectDimensions.prototype.setValue = function()  //--setValue(dims) or setValue(width,height)
{
  if(arguments.length==1) {
    this.width = arguments[0].width;
    this.height = arguments[0].height;
  }

  if(arguments.length==2) {
    this.width = arguments[0];
    this.height = arguments[1];
  }
};



/*--more thought
f u n c t i o n screenRect(arg1,arg2,arg3,arg4,set_mode) {
  if(arguments.length==4) {
    this.left_x = arg1;
    this.top_y = arg2;
    this.right_x = arg3;
    this.bottom_y = arg4;
    this.width = ;
    this.height = ;
    this.center_x = ;
    this.center_y = ;
    }

  this.mode = mode;
  if(this.mode=="center_x_center_y_width_height") {
    this.center = new screenPoint(arg1,arg2);
    this.
    }
  if(this.mode=="left_top_width_height")
  if(this.mode=="left_top_right_bottom")
  this.x = x;
  this.y = y;
  }
*/

//----------------------------------------------------------------------------

function hotRectangles(num_hotspots)
{
  this.num_hotspots = num_hotspots;

  this.active = new Array(num_hotspots);
  for(var i=0;i<this.num_hotspots;++i) { this.active[i] = 1; }

  this.left_x = new Array(num_hotspots);
  this.top_y  = new Array(num_hotspots);
  this.width  = new Array(num_hotspots);
  this.height = new Array(num_hotspots);
  return;
}

hotRectangles.prototype.setAllActive = function() {
  for(var i=0;i<this.num_hotspots;++i) { this.active[i] = 1; }
  };

hotRectangles.prototype.setConstWidth = function(const_width) {
  for(var i=0;i<this.num_hotspots;++i) { this.width[i] = const_width; }
  };
hotRectangles.prototype.setConstHeight = function(const_height) {
  for(var i=0;i<this.num_hotspots;++i) { this.height[i] = const_height; }
  };
hotRectangles.prototype.setConstLeft = function(const_left) {
  for(var i=0;i<this.num_hotspots;++i) { this.left_x[i] = const_left; }
  };
hotRectangles.prototype.setConstTop = function(const_top) {
  for(var i=0;i<this.num_hotspots;++i) { this.top_y[i] = const_top; }
  };
hotRectangles.prototype.setConstDimensions = function(const_width,const_height) {
  this.setConstWidth(const_width);
  this.setConstHeight(const_height);
  };
hotRectangles.prototype.packLeftFromWidths = function() {
  this.left_x[0] = 0;
  for(var i=1;i<this.num_hotspots;++i) { this.left_x[i] = this.left_x[i-1] + this.width[i-1]; }
  };

hotRectangles.prototype.setAsBlockOfRows = function(tot_left_x,tot_top_y,num_row,width,height)
{
  for(var i=0;i<this.num_hotspots;++i)
  {
    this.left_x[i] = tot_left_x + width*Math.floor(i/num_row);
    this.top_y[i]  = tot_top_y + height*(i%num_row);
    this.width[i]  = width;
    this.height[i] = height;
  }
};

hotRectangles.prototype.setAsBlockOfColumns = function(tot_left_x,tot_top_y,num_col,width,height)
{
  for(var i=0;i<this.num_hotspots;++i)
  {
    this.left_x[i] = tot_left_x + width*(i%num_col);
    this.top_y[i]  = tot_top_y + height*Math.floor(i/num_col);
    this.width[i]  = width;
    this.height[i] = height;
  }
};

hotRectangles.prototype.getIndex = function(pt)
{
  var index = -1;
  for(var i=0;i<this.num_hotspots;++i)
  {
    if(this.active[i]==0)  continue;
    if(pt.x>=this.left_x[i] && pt.x<(this.left_x[i]+this.width[i]) &&
              pt.y>=this.top_y[i] && pt.y<(this.top_y[i]+this.height[i])) {
      index = i;
    }
  }
  return index;
};

//############################################################################
//#     sci_color_math.js
//#     by Brian T Kaney, 2015-2021
//#     Library to create and modify colors using math on the RGB channel values.
//#     DEPENDENCIES:none
//############################################################################

//  This is the start for a few Functions to shift colors.  Think carefully about arg 
//  structure.  It'd be handy to brighten or dim a color at the same hue.  Or to increase
//  or decrease any or all r, b, or g channels separately.  'grey-ify' a color.  By % or by delta x.
//  Use better name for 'color', use 'color_str' or 'hex_color_str' instead to be more precise.

//  Some repeated blocks could be extracted as their own subs.  Like parsing the hex string for 
//  three ints

function shiftColor(color) {   //---no other occurrence in this lib
  var red_hex = parseInt(color.substring(1,3),16);
  var green_hex = parseInt(color.substring(3,5),16);
  var blue_hex = parseInt(color.substring(5,7),16);

//      an older use
//  red_hex = Math.round(red_hex + 0.5*(255-red_hex));
//  green_hex = Math.round(green_hex + 1.0*(255-green_hex));
//  blue_hex = Math.round(blue_hex + 0.5*(255-blue_hex));
  green_hex = 255;

  if(red_hex<0)     red_hex=0;
  if(green_hex<0)   green_hex=0;
  if(blue_hex<0)    blue_hex=0;
  if(red_hex>255)   red_hex=255;
  if(green_hex>255) green_hex=255;
  if(blue_hex>255)  blue_hex=255;

  if(red_hex<16)   var red_hex_str = "0" + red_hex.toString(16);
  else             var red_hex_str = red_hex.toString(16);
  if(green_hex<16) var green_hex_str = "0" + green_hex.toString(16);
  else             var green_hex_str = green_hex.toString(16);
  if(blue_hex<16)  var blue_hex_str = "0" + blue_hex.toString(16);
  else             var blue_hex_str = blue_hex.toString(16);

  return "#" + red_hex_str + green_hex_str + blue_hex_str;
  }

//############################################################################
//#     sci_time.js
//#     by Brian T Kaney, 2015-2021
//#     Library of time objects and processing.
//#     DEPENDENCIES:none
//############################################################################

function timeString(arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
{   //---make zone str optional
  if(arguments.length==3)
  {
    var yr = arg1.year; 
    var mo = arg1.month; 
    var dy = arg1.day; 
    var hr = arg1.hour; 
    var min = arg1.minute; 
    var sec = arg1.second; 
    var pattern = arg2; 
    var zone_str = arg3; 
  }
  if(arguments.length==8)
  {
    var yr = arg1; 
    var mo = arg2; 
    var dy = arg3; 
    var hr = arg4; 
    var min = arg5; 
    var sec = arg6; 
    var pattern = arg7; 
    var zone_str = arg8; 
  }

  var mon_str,dy_str,hr_str,min_str,sec_str;

  if(mo<10)   mon_str = "0" + mo;
  else        mon_str = mo;
  if(dy<10)   dy_str  = "0" + dy;
  else        dy_str  = dy;
  if(hr<10)   hr_str  = "0" + hr;
  else        hr_str  = hr;
  if(min<10)  min_str = "0" + min;
  else        min_str = min;
  if(sec<10)  sec_str = "0" + sec;
  else        sec_str = sec;

  var message = "";
  if(pattern=='HH')                 message = hr_str;
  if(pattern=='H')                  message = hr;
  if(pattern=='MM')                 message = min_str;
  if(pattern=='D')                  message = dy;
  if(pattern=='HH:MM')              message = message.concat(hr_str,":",min_str);
  if(pattern=='M/DD HH:MM')         message = message.concat(mo,"/",dy_str," ",hr_str,":",min_str);
  if(pattern=='FM FY')              message = message.concat(monthName(mo,'full')," ",yr);
  if(pattern=='AM FY')              message = message.concat(monthName(mo,'abbrev')," ",yr);
  if(pattern=='AM D, FY')           message = message.concat(monthName(mo,'abbrev')," ",dy,", ",yr);
  if(pattern=='YYYY/MM')            message = message.concat(yr,"/",mon_str);
  if(pattern=='YYYYMMDD.HHMMSS')    message = message.concat(yr,mon_str,dy_str,".",hr_str,min_str,sec_str);
  if(pattern=='YYYYMMDDHHMMSS')     message = message.concat(yr,mon_str,dy_str,hr_str,min_str,sec_str);
  if(pattern=='YYYYMMDDHHMM')       message = message.concat(yr,mon_str,dy_str,hr_str,min_str);
  if(pattern=='MM/DD/YY')              message = message.concat(mon_str,"/",dy_str,"/",yr-2000);
  if(pattern=='MM/DD/YYYY3HH:MM Z')    message = message.concat(mon_str,"/",dy_str,"/",yr,"&nbsp;&nbsp;&nbsp;",hr_str,":",min_str," ",zone_str);
  if(pattern=='MM/DD/YYYY3HH:MM:SS Z') message = message.concat(mon_str,"/",dy_str,"/",yr,"&nbsp;&nbsp;&nbsp;",hr_str,":",min_str,":",sec_str," ",zone_str);
  if(pattern=='MM/DD/YYYY HH:MM Z')    message = message.concat(mon_str,"/",dy_str,"/",yr," ",hr_str,":",min_str," ",zone_str);
  return message;
}
//---last two above are confusing.  You might want to write 12 Z, but 'Z' above is used as zone_str placeholder

function numDaysInMonth(year,month)
{
  var days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
  if(year%4==0 && year%100!=0) { ++days_in_month[1]; }
  if(year%400==0) { ++days_in_month[1]; }
  return days_in_month[month-1];
}

function numDaysInYear(year)
{
  var days_in_year = 365;
  if(year%4==0 && year%100!=0) { ++days_in_year; }
  if(year%400==0) { ++days_in_year; }
  return days_in_year;
}

// need a YM object still.  spawnTime does not allow adding month or years since they are not fixed # of sec

function dayOfWeek(year,month,day)
{
  var offset = 4;

  if(year>=1970) {
    for(var i=1970;i<year;++i)  offset = offset + numDaysInYear(i);
    for(var m=1;m<month;++m)    offset = offset + numDaysInMonth(year,m);
    offset = offset + day - 1;
  }
  else {
//---complete for case going into the past
  }
  return offset%7;
}

//  bad mix in next two Functions, day_index is 0-6, month index is 1-12.  since this is outside the 'time' object I prefer the day method

function dayName(day_index,abbr_mode)
{
  if(arguments.length==1) { var day_str = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]; }
  if(abbr_mode=='abbr2') { var day_str = ["Su","Mo","Tu","We","Th","Fr","Sa"]; }
  if(abbr_mode=='abbr3') { var day_str = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; }
  return day_str[day_index];
}

//  CHECK:  a couple of purges below.  also better names for the 'abbr_mode'
function monthName(month,abbr_mode)
{
  if(arguments.length==1) { var mon_str = ["January","February","March","April","May","June","July","August","September","October","November","December"]; }
  if(abbr_mode=='abbrev') { var mon_str = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"]; } //--purge
  if(abbr_mode=='abbr')   { var mon_str = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"]; }
  if(abbr_mode=='abbrev3') { var mon_str = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; }  //--change to 'abbr3'
  if(abbr_mode=='full')   { var mon_str = ["January","February","March","April","May","June","July","August","September","October","November","December"]; }  //-purge
  return mon_str[month-1];
}

//----------------------------------------------------------------------------
//      time();                    No args = return current UTC time
//      time(-60);                 One arg, same as zero args, but shifted by number of seconds given
//      time(0,120);               Same as one arg, but force result to have seconds resolution given by second arg
//      time(2016,7,20,12,0,0);    Six args uses the full time given.
//----------------------------------------------------------------------------

function time()
{
  var now = new Date();
  this.year   = now.getUTCFullYear();
  this.month  = now.getUTCMonth()+1;
  this.day    = now.getUTCDate();
  this.hour   = now.getUTCHours();
  this.minute = now.getUTCMinutes();
  this.second = now.getUTCSeconds();

  if(arguments.length==1) { this.addSeconds(arguments[0]); }
 
  if(arguments.length==2)
  {
    this.addSeconds(arguments[0]);

    var sec_res = arguments[1];
    if(sec_res>=60) { var min_res = Math.floor(sec_res/60); }
    else            { var min_res = 1; }
    if(sec_res>=3600) { var hr_res = Math.floor(sec_res/3600); }
    else              { var hr_res = 1; }

    this.hour   = hr_res*Math.floor(this.hour/hr_res);
    this.minute = min_res*Math.floor(this.minute/min_res);
    this.second = sec_res*Math.floor(this.second/sec_res);
  }
  if(arguments.length==6)
  {
    this.year   = arguments[0];
    this.month  = arguments[1];
    this.day    = arguments[2];
    this.hour   = arguments[3];
    this.minute = arguments[4];
    this.second = arguments[5];
  }
}

time.prototype.equateToTime = function(target_time)
{
  this.year = target_time.year;
  this.month = target_time.month;
  this.day = target_time.day;
  this.hour = target_time.hour;
  this.minute = target_time.minute;
  this.second = target_time.second;
};

time.prototype.totSecLinuxEra = function() {
  return Date.UTC(this.year,this.month-1,this.day,this.hour,this.minute,this.second,0)/1000;
};

time.prototype.addSeconds = function(second_shift)
{
  var shifted = new Date(Date.UTC(this.year,this.month-1,this.day,this.hour,this.minute,this.second,0)+second_shift*1000);

  this.year   = shifted.getUTCFullYear();
  this.month  = shifted.getUTCMonth()+1;
  this.day    = shifted.getUTCDate();
  this.hour   = shifted.getUTCHours();
  this.minute = shifted.getUTCMinutes();
  this.second = shifted.getUTCSeconds();
};

time.prototype.addMinutes = function(minute_shift) {
  this.addSeconds(minute_shift*60);
};

time.prototype.addHours = function(hour_shift) {
  this.addSeconds(hour_shift*3600);
};

time.prototype.addDays = function(day_shift) {
  this.addSeconds(day_shift*86400);
};

time.prototype.numDaysInMonth = function() {
  return numDaysInMonth(this.year,this.month);
};

time.prototype.numDaysInYear = function() {
  return numDaysInYear(this.year);
};

time.prototype.dayOfWeek = function() {
  return dayOfWeek(this.year,this.month,this.day);
};

//--name is not clear.  just applies max moves day index to last of month if exceeds bounds.  which is really a special case of what comes next
time.prototype.rectifyDate = function() {
  var last_valid_day = this.numDaysInMonth();
  if(this.day>last_valid_day) { this.day = last_valid_day; }
};

time.prototype.confineTimeToWindow = function(start,end) {
  if(compareTimes(this.spawnTime(0),start)=='less') { this.equateToTime(start); }
  if(compareTimes(this.spawnTime(0),end)=='more')   { this.equateToTime(end); }
};

time.prototype.truncateToMinRes = function(min_res)
{
  if(min_res<60) {
    this.minute = min_res*Math.floor(this.minute/min_res);
    this.second = 0;
  }
  if(min_res>=60) {
    var hr_res = Math.floor(min_res/60);
    this.hour = hr_res*Math.floor(this.hour/hr_res);
    this.minute = 0;
    this.second = 0;
  }
};

time.prototype.spawnTime = function(time_shift,time_mode)
{
  var new_time = new time(this.year,this.month,this.day,this.hour,this.minute,this.second);
  if(arguments.length==1) { new_time.addSeconds(time_shift); }
  if(arguments.length==2 && time_mode=='seconds') { new_time.addSeconds(time_shift); }
  if(arguments.length==2 && time_mode=='minutes') { new_time.addMinutes(time_shift); }
  if(arguments.length==2 && time_mode=='hours')   { new_time.addHours(time_shift); }
  if(arguments.length==2 && time_mode=='days')    { new_time.addDays(time_shift); }
  return new_time;
};

time.prototype.alterTime = function(yr,mo,dy,hr,min,sec)
{   //  any uses yet?  Less sure of this one - maybe useful
  var new_time = new time(this.year,this.month,this.day,this.hour,this.minute,this.second);
  if(yr!=-1)  { new_time.year = yr; }
  if(mo!=-1)  { new_time.month = mo; }
  if(dy!=-1)  { new_time.day = dy; }
  if(hr!=-1)  { new_time.hour = hr; }
  if(min!=-1) { new_time.minute = min; }
  if(sec!=-1) { new_time.seoond = sec; }
  return new_time;
};

time.prototype.addMonthsToYM = function(mon_shift)
{  //  not right yet, where used??  (not buggy, just needs more thought - what about day?  is this a new object??
  var raw_month = this.month-1+mon_shift;
  if(raw_month>=0) {
    this.year = this.year + Math.floor(raw_month/12);
    this.month = raw_month%12+1;
  }
  if(raw_month<0)  {
    this.year = this.year - Math.floor((11-raw_month)/12);
    this.month = 11 - (-1*raw_month-1)%12 + 1;
  }
};

//----------------------------------------------------------------------------

//  time.prototype.shiftTime(#,'hour')  year, month,day,hour minute or second
//   time.prototype.compareTimes(time1,time2)   returns equal, less or more
//   time.prototype.subtractTimes(time1,time2,'hour')  returns number

function compareTimes(time1,time2)
{
  if(time1.totSecLinuxEra() <  time2.totSecLinuxEra()) { return "less"; }
  if(time1.totSecLinuxEra() == time2.totSecLinuxEra()) { return "equal" ; }
  if(time1.totSecLinuxEra() >  time2.totSecLinuxEra()) { return "more" ; }
}

function subtractTimes(time1,time2,time_mode)
{
  var diff_sec = time1.totSecLinuxEra() - time2.totSecLinuxEra();

  if(time_mode=='seconds') { diff = diff_sec; }
  if(time_mode=='minutes') { diff = diff_sec/60; }
  if(time_mode=='hours')   { diff = diff_sec/3600; }
  if(time_mode=='days')    { diff = diff_sec/86400; }

  return diff;
}

//############################################################################
//#     sci_simple_stats.js
//#     by Brian T Kaney, 2015-2021
//#     Library for simple value testing and 1D array stats.
//#     DEPENDENCIES:none
//############################################################################

function symbolicComparison(value,mode,target)
{
  if(target=='minus_infinity') {
    if(mode=='>' || mode=='>=') { return true; }
    else { return false; }
  }
  if(target=='plus_infinity') {
    if(mode=='<' || mode=='<=') { return true; }
    else { return false; }
  }
  if(mode=='==') { return (value==target); }  //  CHECK: Does this return 'true' and 'false' correctly?
  if(mode=='<=') { return (value<=target); }
  if(mode=='<')  { return (value<target); }
  if(mode=='>')  { return (value>target); }
  if(mode=='>=') { return (value>=target); }
  return false;
}

function boundValue(value,min,max)
{
  if(value<min) { return min; }
  if(value>max) { return max; }
  return value;
}

//--Specifically, it finds the first occurrence (other options?)
function findIndex(test_array,value) {
  for(var i=0;i<test_array.length;++i) {
    if(value==test_array[i]) { return i; }
  }
  return -1;
}

function countOccurences(test_array,compare_mode,target)
{
  var cnt = 0;
  for(var i=0;i<test_array.length;++i) {
    if(symbolicComparison(test_array[i],compare_mode,target)) { ++cnt; }
  }
  return cnt;
}

//f u n c t i o n countOccur(test_array,compare_mode,target) {  //--check for occurrences and replace with above.  there is a bug so this should never have worked

function arrayTotal(test_array,compare_mode,target)
{
  if(arguments.length==1) {
    var compare_mode = ">";
    var target = "minus_infinity";
  }

  var sum = 0;
  for(var i=0;i<test_array.length;++i) {
    if(symbolicComparison(test_array[i],compare_mode,target)) { sum = sum + test_array[i]; }
  }
  return sum;
}

function arrayAverage(test_array,compare_mode,target)
{
  if(arguments.length==1) {
    var compare_mode = ">";
    var target = "minus_infinity";
  }

  var count = 0;
  var sum = 0;
  for(var i=0;i<test_array.length;++i) {
    if(symbolicComparison(test_array[i],compare_mode,target)) { sum = sum + test_array[i];  ++count; }
    }
  if(count>0)  return sum/count;
  else         return -9999;
}

//  move this, more complex
function arrayStdDev(test_array,compare_mode,target)
{
  if(arguments.length==1) {   var compare_mode = ">";    var target = "minus_infinity";  }

  var avg = arrayAverage(test_array,compare_mode,target);
  var count = 0;
  var sum = 0;
  for(var i=0;i<test_array.length;++i)
  {
    if(symbolicComparison(test_array[i],compare_mode,target)) {
      sum = sum + (test_array[i]-avg)*(test_array[i]-avg);
      ++count;
    }
  }
  if(count>0) { return Math.sqrt(sum/count); }
  else        { return -9999; }
}

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



//############################################################################
//#     sci_html_elements.js
//#     by Brian T Kaney, 2015-2021
//#     Library of wrappers for html form elements.
//#     DEPENDENCIES:none
//############################################################################

//  future stuff to add:  margins, div overflow handling, tile image options

function divStyle()
{
  this.setPositioningAsStrings("0px","0px","absolute");
  this.setDimensionsAsStrings("","");
  this.setBackground("","");
  this.setTextProperties("left","#000000","arial","10pt","normal","normal");
  this.setBorder("0px","0px","solid","#000000");
  this.setPadding("0px 0px 0px 0px");
}

divStyle.prototype.setPositioningAsStrings = function(left_x,top_y,mode)
{
  this.div_left = left_x;
  this.div_top = top_y;
  this.div_position = mode;
};

divStyle.prototype.setDimensionsAsStrings = function(width,height)
{
  this.div_width = width;
  this.div_height = height;
};

divStyle.prototype.setPositionAsInt = function(left_x,top_y)
{
  this.div_left = left_x + "px";
  this.div_top = top_y + "px";
};

divStyle.prototype.setDimensionsAsInt = function(width,height)
{
  this.div_width = width + "px";
  this.div_height = height + "px";
};

divStyle.prototype.setPositionAndDimensionsAsInt = function(left_x,top_y,width,height)
{
  this.setPositionAsInt(left_x,top_y);
  this.setDimensionsAsInt(width,height);
};

divStyle.prototype.setBackground = function(back_color,back_image)
{
  this.back_color = back_color;
  this.back_image = back_image;
};

divStyle.prototype.setTextProperties = function(align,color,family,size,style,weight)
{
  this.text_align = align;
  this.text_color = color;
  this.font_family = family;
  this.font_size = size;
  this.font_style = style;
  this.font_weight = weight;
};

divStyle.prototype.setBorder = function(corner_radius,line_thickness,line_style,line_color)
{
  this.border_radius = corner_radius;
  this.border_thickness = line_thickness;
  this.border_line_style = line_style;
  this.border_color = line_color;
};

divStyle.prototype.setPadding = function(padding)
{
  this.padding = padding;
};

//----------------------------------------------------------------------------

function DefaultSCITextButtonDivStyle(style)
{
  style.setTextProperties("center","#000000","arial","10pt","normal","normal");
  style.setBorder("3px","1px","solid","#555555");
  style.setPadding("2px 3px 2px 3px");
}

/*
New sci_base.2020.js implementation notes

-----------------------------
divStyle object
                           initialization block a lot diffferent, new methods:   setTextProperties
                                                                                 setBorder
                                                                                 setPadding
                                                                                 setBackground
  setDivCoverage method          replaced by several pieces and alternatives     setDimensions
                                                                                 setPositionAsInt
                                                                                 setDimensionsAsInt
                                                                                 setPositionAndDimensionsAsInt
  setTextButtonDefaults method       replaced by stand alone Function            DefaultSCITextButtonDivStyle(style)

-----------------------------
checkBox object      renamed as      sciCheckBox object
  setDiv method      renamed as      setCheckInContainer method
  -----              newly added     setLabelInContainer method

-----------------------------
ddMenu               renamed as      sciDDMenu
  setDiv method      renamed as      setMenuInContainer method
  -----              newly added     setLabelInContainer method
  setSelectedOption  renamed as      resetSelectedOption method
  insertDropDown     stand alone redone as a method     composeDDHTML

-----------------------------
*/



function createDiv(parent_id,child_id,style)
{
  var new_div = document.createElement('div');

  new_div.id = child_id;
  if(style.div_position != '')      { new_div.style.position = style.div_position; }
  if(style.div_left != '')          { new_div.style.left = style.div_left; }
  if(style.div_top != '')           { new_div.style.top = style.div_top; }
  if(style.div_width != '')         { new_div.style.width = style.div_width; }
  if(style.div_height != '')        { new_div.style.height = style.div_height; }
  if(style.back_color != '')        { new_div.style.backgroundColor = style.back_color; }
  if(style.back_image != '')        { new_div.style.backgroundImage = style.back_image; }

  if(style.font_family != '')       { new_div.style.fontFamily = style.font_family; }
  if(style.font_size != '')         { new_div.style.fontSize = style.font_size; }
  if(style.font_weight != '')       { new_div.style.fontWeight = style.font_weight; }
  if(style.font_style != '')        { new_div.style.fontStyle = style.font_style; }
  if(style.text_align != '')        { new_div.style.textAlign = style.text_align; }
  if(style.text_color != '')        { new_div.style.color = style.text_color; }

  if(style.border_radius != '')     { new_div.style.borderRadius = style.border_radius; }
  if(style.border_thickness != '')  { new_div.style.borderWidth = style.border_thickness; }
  if(style.border_line_style != '') { new_div.style.borderStyle = style.border_line_style; }
  if(style.border_color != '')      { new_div.style.borderColor = style.border_color; }

  if(style.padding_top != '')       { new_div.style.padding = style.padding; }

  document.getElementById(parent_id).appendChild(new_div);
}

function createCanvas(parent_id,pix_left,pix_top,child_id,pix_width,pix_height)   //--- (,,,,,,,back_color or back_image);
{
  var new_canvas = document.createElement('canvas');

  new_canvas.id = child_id;
  new_canvas.width = pix_width;
  new_canvas.height = pix_height;
  new_canvas.style.position = "absolute";
  new_canvas.style.left = pix_left + "px";
  new_canvas.style.top = pix_top + "px";
//  new_canvas.style.width = pix_width + "px";   add in somehow if different values desired
//  new_canvas.style.height = pix_height + "px";
  if(arguments.length==7) {
    new_canvas.style.backgroundColor = arguments[6];
//    new_canvas.style.backgroundImage = arguments[6];   test for '#' at start of string
  }
  document.getElementById(parent_id).appendChild(new_canvas);
}

function createLabelDiv(str,parent_id,child_id,left_x,top_y,color,font_family,font_size,font_weight)
{
  var style = new divStyle();
  style.setPositionAsInt(left_x,top_y);
  style.setTextProperties("",color,font_family,font_size,"",font_weight)

  createDiv(parent_id,child_id,style);
  document.getElementById(child_id).innerHTML = str;
}

function createImageDiv(parent_id,child_id,left_x,top_y,width,height,back_image)
{
  var style = new divStyle();
  style.setPositionAndDimensionsAsInt(left_x,top_y,width,height);
  style.setBackground("",back_image);

  createDiv(parent_id,child_id,style);
}

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function sciDivButton(button_id,label_string)
{
  this.button_id = button_id;
  this.label_string = label_string;

  this.style = new divStyle();
  DefaultSCITextButtonDivStyle(this.style);
  this.style.back_color = "#CCCCCC";
  this.hover_color = "#FFFFFF";

  this.updateRestOfPage = function() { };
}

sciDivButton.prototype.setDivColors = function(back_color,hover_color)
{
  this.style.back_color = back_color;
  this.hover_color = hover_color;
};

sciDivButton.prototype.setDivInContainer = function(container_id,pix_left,pix_top,back_color,hover_color)
{
  this.style.setPositionAsInt(pix_left,pix_top);
  createDiv(container_id,this.button_id,this.style);
  document.getElementById(this.button_id).innerHTML = this.label_string;
};

sciDivButton.prototype.initialize = function()
{
  document.getElementById(this.button_id).addEventListener('mousemove',this.textDivButtonHandler.bind(this),false);
  document.getElementById(this.button_id).addEventListener('mousedown',this.textDivButtonHandler.bind(this),false);
  document.getElementById(this.button_id).addEventListener('mouseout',this.textDivButtonHandler.bind(this),false);
};

sciDivButton.prototype.textDivButtonHandler = function(e)
{
  e.preventDefault();

  if(e.type == "mousemove") { document.getElementById(this.button_id).style.cursor = "pointer"; }
  if(e.type == "mouseout")  { document.getElementById(this.button_id).style.cursor = "default"; }

  if(e.type == "mousemove") {
    document.getElementById(this.button_id).style.backgroundColor = this.hover_color;
  }
  if(e.type == "mousedown" || e.type == "mouseout") {
    document.getElementById(this.button_id).style.backgroundColor = this.style.back_color;
  }

  if(e.type == "mousedown") { this.updateRestOfPage(); }
};

//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function sciCheckBox(unique_base_id,state)
{
  this.div_id = unique_base_id + "_div";
  this.input_id = unique_base_id + "_input";
  this.label_id = unique_base_id + "_label";
  this.style = new divStyle();

  this.state = state;
  this.updateRestOfPage = function() { };
}

sciCheckBox.prototype.setCheckInContainer = function(container_id,pix_left,pix_top)
{
  this.style.setPositionAsInt(pix_left,pix_top);
  createDiv(container_id,this.div_id,this.style);
  document.getElementById(this.div_id).innerHTML = "<input type=\"checkbox\" id=\"" + this.input_id + "\">";
};

sciCheckBox.prototype.setLabelInContainer = function(container_id,pix_left,pix_top,str)
{
  this.style.setPositionAsInt(pix_left,pix_top);
  createDiv(container_id,this.label_id,this.style);
  document.getElementById(this.label_id).innerHTML = str;
};

sciCheckBox.prototype.initialize = function()
{
  if(this.state=='off') { document.getElementById(this.input_id).checked = false; }
  if(this.state=='on')  { document.getElementById(this.input_id).checked = true; }

  document.getElementById(this.input_id).addEventListener('change',this.checkBoxHandler.bind(this),false);
};

sciCheckBox.prototype.checkBoxHandler = function(e)
{
  if(document.getElementById(this.input_id).checked == false) { this.state = "off"; }
  if(document.getElementById(this.input_id).checked == true)  { this.state = "on"; }

  this.updateRestOfPage();
};

//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function sciDDMenu(unique_base_id,selected_option)
{
  this.div_id = unique_base_id + "_div";
  this.input_id = unique_base_id + "_input";
  this.input_name = unique_base_id + "_name";
  this.label_id = unique_base_id + "_label";
  this.style = new divStyle();

  this.rows_shown = 1;
  this.font_size = "9pt";
  this.divider_text_color = "#000099";

  this.selected_option = selected_option;
  this.selected_index;
  this.options = new Array();
  this.display_strs = new Array();
  this.updateRestOfPage = function() { };
}

sciDDMenu.prototype.setMenuInContainer = function(container_id,pix_left,pix_top)
{
  this.style.setPositionAsInt(pix_left,pix_top);
  createDiv(container_id,this.div_id,this.style);
};

sciDDMenu.prototype.setLabelInContainer = function(container_id,pix_left,pix_top,str)
{
  this.style.setPositionAsInt(pix_left,pix_top);
  createDiv(container_id,this.label_id,this.style);
  document.getElementById(this.label_id).innerHTML = str;
};

sciDDMenu.prototype.initialize = function()
{
  this.selected_index = this.getIndexOfSelectedOption();
  document.getElementById(this.div_id).innerHTML = this.composeDDHTML();
  document.getElementById(this.input_id).addEventListener('change',this.ddMenuHandler.bind(this),false);
};


sciDDMenu.prototype.resetSelectedOption = function(new_selected_option)
{
  this.selected_option = new_selected_option
  this.selected_index = this.getIndexOfSelectedOption();
  document.getElementById(this.div_id).innerHTML = this.composeDDHTML();
  document.getElementById(this.input_id).addEventListener('change',this.ddMenuHandler.bind(this),false);
};

sciDDMenu.prototype.ddMenuHandler = function(e)
{
  this.selected_index = document.getElementById(this.input_id).selectedIndex;
  this.selected_option = document.getElementById(this.input_id).options[this.selected_index].value;
  this.updateRestOfPage();
};

sciDDMenu.prototype.getIndexOfSelectedOption = function()
{
  for(var i=0;i<this.options.length;++i) {
    if(this.selected_option == this.options[i]) { return i; }
  }
};

sciDDMenu.prototype.composeDDHTML = function()
{
  var html_str = "<select" + " id=\"" + this.input_id + "\" name=\"" + this.input_name + "\" size=\"" + 
                 this.rows_shown + "\" style=\"font-size:" + this.font_size + ";\">\n";

  for(var i=0;i<this.options.length;++i)
  {
    if(this.options[i] == "div") {
      html_str = html_str + "<optgroup label=\"" + this.display_strs[i] + "\" style=\"color:" + 
                 this.divider_text_color + "\"></optgroup>\n";
      continue;
    }

    if(this.options[i] == this.selected_option) { var selected_str = "selected"; }
    else                                        { var selected_str = ""; }
    html_str = html_str + "<option " + selected_str + " value=\"" + this.options[i] + "\">" + 
               this.display_strs[i] + "</option>\n";
  }
  html_str = html_str + "</select>\n";
  return html_str
};

//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function sciRadioButtons(unique_base_id,num_controls,selected_option)
{
  this.unique_base_id = unique_base_id;
  this.group_name     = unique_base_id + "_name";
  this.num_controls   = num_controls;
  this.selected_option = selected_option;
  this.selected_index;

  this.div_id = new Array();
  this.input_id = new Array();
  this.label_id = new Array();
  for(var i=1;i<=this.num_controls;++i)
  {
    this.div_id[i-1]   = this.unique_base_id + "_div" + i;
    this.input_id[i-1] = this.unique_base_id + "_input" + i;
    this.label_id[i-1] = this.unique_base_id + "_label" + i;
  }

  this.style = new divStyle();
  this.label_left_x = new Array();
  this.label_top_y = new Array();
  this.label_str = new Array();

  this.button_left_x = new Array();
  this.button_top_y = new Array();
  this.values = new Array();

  this.updateRestOfPage;
}

sciRadioButtons.prototype.setDivInContainer = function(container_id,pix_left,pix_top)
{
  this.style.setPositionAsInt(pix_left,pix_top);
  createDiv(container_id,this.unique_base_id,this.style);
};

sciRadioButtons.prototype.initialize = function()
{
  for(var i=0;i<this.num_controls;++i)
  {
    this.style.setPositionAsInt(this.label_left_x[i],this.label_top_y[i]);
    createDiv(this.unique_base_id,this.label_id[i],this.style);
    document.getElementById(this.label_id[i]).innerHTML = this.label_str[i];

    this.style.setPositionAsInt(this.button_left_x[i],this.button_top_y[i]);
    createDiv(this.unique_base_id,this.div_id[i],this.style);
  }

  this.insertInputHTML();
  for(var i=0;i<this.num_controls;++i) {
    document.getElementById(this.input_id[i]).addEventListener('change',this.radioButtonHandler.bind(this),false);
  }
};

sciRadioButtons.prototype.resetSelectedOption = function(new_selected_option)
{
  this.selected_option = new_selected_option
  this.selected_index = this.getIndexOfSelectedOption();
  this.insertInputHTML();
  for(var i=0;i<this.num_controls;++i) {
    document.getElementById(this.input_id[i]).addEventListener('change',this.ddMenuHandler.bind(this),false);
  }
};

sciRadioButtons.prototype.radioButtonHandler = function(e)
{
  for(var i=0;i<this.num_controls;++i) {
    if(document.getElementById(this.input_id[i]).checked) { this.selected_option = this.values[i]; }
  }
  this.selected_index = this.getIndexOfSelectedOption();
  this.updateRestOfPage();
};

sciRadioButtons.prototype.getIndexOfSelectedOption = function()
{
  for(var i=0;i<this.num_controls;++i) {
    if(this.selected_option == this.values[i]) { return i; }
  }
};

sciRadioButtons.prototype.insertInputHTML = function()
{
  for(var i=0;i<this.num_controls;++i)
  {
    if(this.values[i]==this.selected_option) { var check_status = "checked"; }
    else                                     { var check_status = ""; }

    document.getElementById(this.div_id[i]).innerHTML = "<input type=\"radio\" name=\"" + this.group_name + "\" id=\"" + 
                    this.input_id[i] + "\" " + check_status + " value=\"" + this.values[i] + "\">";
  }
};

//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function singleIndexCheckSet(div_id,num_controls,index)
{
  this.div_id       = div_id;
  this.num_controls = num_controls;
  this.index = index;

  this.checks = new Array(this.num_controls);
  this.style = new divStyle();
  this.style.font_family = "arial";
  this.style.font_size = "9pt";
  this.style.font_weight = "bold";;

  this.left_label_x = new Array(this.num_controls);
  this.left_check_x = new Array(this.num_controls);
  this.top_y = new Array(this.num_controls);
  this.label_str = new Array(this.num_controls);
  this.code_name = new Array(this.num_controls);

  this.updateRestOfPage;
}

singleIndexCheckSet.prototype.initialize = function()
{
  for(var i=0;i<this.num_controls;++i)
  {
    this.style.div_left = this.left_label_x[i] + "px";
    this.style.div_top = this.top_y[i] + "px";
    createDiv(this.div_id,this.code_name[i]+"_label",this.style);

    document.getElementById(this.code_name[i]+"_label").innerHTML = this.label_str[i]

    if(Math.floor((this.index%(Math.pow(2,i+1)))/Math.pow(2,i))==1) { var set="on"; }
    else                                                            { var set="off"; }

    this.checks[i] = new checkBox(this.code_name[i]+"_check",set);
    this.checks[i].setDiv(this.div_id,this.left_check_x[i],this.top_y[i]-3);
    this.checks[i].initialize();

    var that = this;
    this.checks[i].updateRestOfPage = function() {
      that.evaluateIndex();
    };
  }
};

singleIndexCheckSet.prototype.evaluateIndex = function()
{
  this.index = 0;
  for(var i=0;i<this.num_controls;++i) {
    if(document.getElementById(this.code_name[i]+"_check").checked == true) { this.index = this.index + Math.pow(2,i); }
  }
  this.updateRestOfPage();
};

//----------------------------------------------------------------------------

function getDataPacket(format)
{
  this.format = format;
  this.url;
  this.data;
  this.launchLoad;
  this.updateRestOfPage;
}

getDataPacket.prototype.load = function()
{
  var request = new XMLHttpRequest();
  request.onload = function () { this.parseRequest(request.responseText); }.bind(this);
  request.open("get",this.url,true);
  request.send();
};

getDataPacket.prototype.parseRequest = function(return_string)
{
  if(this.format=="json") { this.data = JSON.parse(return_string); }
  else                    { this.data = return_string; }
  this.updateRestOfPage();
};

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

//--make sure there is default behavior for everything?
  this.colors = new Array();
  this.rect_fill_color_index = new Array();
  this.rect_stroke_color_index = new Array();
  this.rect_line_width = new Array();

  this.fonts = new Array();
  this.font_index = new Array();
  this.text_color_index = new Array();

// only default setting so far, why just these?
  this.setLineWidths(1);

  this.display_txt = new Array();
  this.x_indent = "center";
  this.draw_rect = 1;   //--are these still needed?  I was thinking to suppress these with color="" and font="" also.
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

sciCanvasButtons.prototype.setFontIndexes = function(value) {
  for(var i=0;i<this.num_controls;++i) { this.font_index[i]=value; }
};

sciCanvasButtons.prototype.setTextColorIndexes = function(value) {
  for(var i=0;i<this.num_controls;++i) { this.text_color_index[i]=value; }
};

/*   not in use yet, still thinking about this, or something like this?
sciCanvasButtons.prototype.setCellDesign = function(fc,sc,tc,tf,lw)
{
  if(fc>=0) { this.setFillColorIndexes(fc); }
  if(sc>=0) { this.setStrokeColorIndexes(sc); }
  if(tc>=0) { this.setTextColorIndexes(tc); }
  if(tf>=0) { this.setFontIndexes(tf); }
  if(lw>=0) { this.setLineWidths(lw); }
};
*/

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
//-----FIX  ??  why doesn't above code catch this - need to really test in a template page
  if(e.type=="mouseout") { this.current_hover_index = -1; }
//----

  if(this.current_hover_index!=this.last_hover_index || this.event_type!="mousemove") { this.updateRestOfPage(); }
  this.last_hover_index = this.current_hover_index;
};

sciCanvasButtons.prototype.draw = function()
{
  canvasClear(this.unique_base_id);

  if(this.draw_rect==1)
  {
    for(var i=0;i<this.num_controls;++i)
    {
      var style = new shapeStyle(this.colors[this.rect_fill_color_index[i]],this.colors[this.rect_stroke_color_index[i]],this.rect_line_width[i]);
      drawCanvasConfinedRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i]+1,this.rect.height[i]+1,style,this.unique_base_id);
//  try out the following, this was an 'improvement' made for empe.  what does it do exactly?  makes the '+1' above unneeded.
//      drawCanvasCleanBoundedRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i],style,this.unique_base_id);
    }
  }

  this.customDrawing();

  if(this.draw_text==1)
  {
    for(var i=0;i<this.num_controls;++i)
    {
      var style = new textStyle(this.fonts[this.font_index[i]],this.colors[this.text_color_index[i]]);
//      var style = new textStyle("bold 11pt arial","#000000");
//      drawCanvasFixedLabel(this.display_txt[i],this.rect.left_x[i],this.rect.top_y[i],this.x_indent,this.rect.width[i]+1,this.rect.height[i]+1,style,this.unique_base_id);


      if(this.x_indent=="center") {
        drawCanvasLabel(this.display_txt[i],this.rect.left_x[i]+this.rect.width[i]/2,this.rect.top_y[i]+this.rect.height[i]/2,this.x_indent,"center",style,this.unique_base_id);
      }
      else {
        drawCanvasLabel(this.display_txt[i],this.rect.left_x[i]+this.x_indent,this.rect.top_y[i]+this.rect.height[i]/2,0,"center",style,this.unique_base_id);
      }
//  Some weirdness to fix.  Need to clean up the underlying 'drawLabel' options that this will be based on.  As it is, if this.x_indent is 'center' then 'drawCanvasLabel'
//  gets called with 'center' as both the x offset and y offset args.  But 'drawCanvasLabel' doesn't know how wide the button is - the half width value is used 
//  before the call to place the start x in the middle of the button to begin with.  But you don't want this is x_indent is just a number.  Then you don't care 
//  how wide the button is
    }
  }
};

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function sciCanvasRadioButtons(unique_base_id,num_controls)
{
  this.button = new sciCanvasButtons(unique_base_id,num_controls);

  this.button.colors = ["#AAAAAA","#FFFFFF","#DDDDDD","#BBEEFF","#000000","#DDDDDD","#000000"];
//  color array has no meaningful order in the sciCanvasButtons obj, it is just a list of all the colors you want to use in any order.
//  Order is set here: inactive fill color, active but not hovered or selected, active and hovered over, selected,stroke color, inactive text, active text
//  still might need more/better named setting functions for times when you want to not use the defaults
  this.button.fonts = ["11pt arial"];

//  only needed here since they are not set in 'setButtonStyleWithoutHover'.  so these will be fixed for all implementations of sciCanvasRadioButtons
//  To vary that, I'll need to move these from here to 'setButtonStyleWithoutHover'.
  this.button.setStrokeColorIndexes(4);
  this.button.setFontIndexes(0);

  this.selected_index=0;
  this.selected_option;
  this.options = new Array();

//  this.hover_index  = -1;
//  this.state_change = 0;

  this.updateRestOfPage = function() { };
}

//  get rid of this?  duplicate of button.setCanvasInContainer that already exists
sciCanvasRadioButtons.prototype.setCanvasInContainer = function(container_id,left_pix,top_pix,pix_width,pix_height)
{  //--- (,,,,,background)
  if(arguments.length==6) { this.button.setCanvasInContainer(container_id,left_pix,top_pix,pix_width,pix_height,arguments[5]); }
  else                    { this.button.setCanvasInContainer(container_id,left_pix,top_pix,pix_width,pix_height); }
};

sciCanvasRadioButtons.prototype.setSelectedOption = function(test_option)
{
  var test_index = findIndex(this.options,test_option);
  if(test_index>=0)
  {     //--need to handle 'error' of trying to set an inactive option as selected (just activate it?, probably not)
    this.selected_index = test_index;
    this.selected_option = test_option;
  }
};

sciCanvasRadioButtons.prototype.initialize = function(selected_option)
{  //--make this arg optional?
  this.setSelectedOption(selected_option);

  this.button.initialize();   //--No new event listeners, just these.  Includes button.draw() call.
  this.draw();

  var that = this;
  this.button.updateRestOfPage = function()
  {
    if(this.event_type=="mousedown" && this.current_hover_index>=0) {
      that.setSelectedOption(that.options[this.current_hover_index]);
      this.current_hover_index=-1;
      that.updateRestOfPage();
    }

    if(this.current_hover_index==-1 || this.current_hover_index==that.selected_index) {
      document.getElementById(this.unique_base_id).style.cursor = "default";
    }
    if(this.current_hover_index>=0 && this.current_hover_index!=that.selected_index) {
      document.getElementById(this.unique_base_id).style.cursor = "pointer";
    }

    that.draw();
  };
};

sciCanvasRadioButtons.prototype.setButtonStyleWithoutHover = function()
{
  this.button.setFillColorIndexes(1);
  this.button.setTextColorIndexes(6);
  for(var i=0;i<this.button.num_controls;++i) {
    if(this.button.rect.active[i]==0) {
      this.button.rect_fill_color_index[i]=0;
      this.button.text_color_index[i]=5;
    }
  }
  this.button.rect_fill_color_index[this.selected_index]=3;
};

sciCanvasRadioButtons.prototype.draw = function() {
    this.setButtonStyleWithoutHover();
    if(this.button.current_hover_index>=0 && this.button.current_hover_index!=this.selected_index) {
      this.button.rect_fill_color_index[this.button.current_hover_index]=2; 
    }
    this.button.draw();
};

//############################################################################
//#     sci_palette.js
//#     by Brian T Kaney, 2015-2021
//#     Library to associate numerical data with a color palette.
//#     DEPENDENCIES:sci_simple_stats.js
//############################################################################

function binPalette(num_colors)
{
  this.num_colors = num_colors;
  this.default_color = "#FF00FF";

  this.color = new Array(this.num_colors);
  this.bin = new Array(this.num_colors);
  for(var i=0;i<=this.num_colors;++i) {
    this.color[i] = this.default_color;
    this.bin[i] = i;
  }
}

binPalette.prototype.getColor = function(value)
{
  for(var i=0;i<this.num_colors;++i) {
    if(value==this.bin[i]) { return this.color[i]; }
  }
  return this.default_color;
};

//----------------------------------------------------------------------------

function rangePalette(num_colors)
{
  this.num_colors = num_colors;
  this.default_color = "#FF00FF";

  this.color = new Array(this.num_colors);
  this.limit = new Array(this.num_colors+1);
  this.test = new Array(this.num_colors+1);

  for(var i=0;i<=this.num_colors;++i) {
    if(i<this.num_colors) { this.color[i] = this.default_color; }
    this.limit[i] = i;
    this.test[i] = "<";
  }
}

rangePalette.prototype.getColor = function(value)
{
  if(symbolicComparison(value,this.test[0],this.limit[0])) { return this.default_color; }  //--CHECK:  need this? why?
  if(!symbolicComparison(value,this.test[this.num_colors],this.limit[this.num_colors])) { return this.default_color; }  //--CHECK: why?

  for(var i=0;i<this.num_colors;++i) {
    if(symbolicComparison(value,this.test[i+1],this.limit[i+1])) { return this.color[i]; }
    }
  return this.default_color;
};

