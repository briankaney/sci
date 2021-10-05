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

