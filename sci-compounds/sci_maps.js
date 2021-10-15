//############################################################################
//       SCI: Mapping math
//       by Brian T Kaney, 2015-2021
//############################################################################

function angleSubtendedBetweenTwoSphCoordPts(lat1,lon1,lat2,lon2) {
  var DegToRad = Math.PI/180;
  lat1 = lat1*DegToRad;
  lon1 = lon1*DegToRad;
  lat2 = lat2*DegToRad;
  lon2 = lon2*DegToRad;

  return Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1));
}

function distanceBetweenTwoLatLonPts(lat1,lon1,lat2,lon2,units) {
  var EarthRadiusKm = 6371;

  var angle_subtended = angleSubtendedBetweenTwoSphCoordPts(lat1,lon1,lat2,lon2);

  if(units=="km")  return EarthRadiusKm*angle_subtended;
  if(units=="m")   return EarthRadiusKm*1000*angle_subtended;
  if(units=="mi")  return EarthRadiusKm*0.621371*angle_subtended;
  if(units=="ft")  return EarthRadiusKm*3280.84*angle_subtended;

  return -999;
}

function bearingBetweenTwoLatLonPts(lat1,lon1,lat2,lon2,units) {
  var DegToRad = Math.PI/180;
  lat1 = lat1*DegToRad;
  lon1 = lon1*DegToRad;
  lat2 = lat2*DegToRad;
  lon2 = lon2*DegToRad;

  var x = Math.cos(lat2)*Math.sin(lon2-lon1);
  var y = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  var bearing = Math.atan2(x,y);
  if(bearing<0)  bearing = bearing + 2*Math.PI;

  if(units=="rad")  return bearing;
  if(units=="deg")  return bearing*180/Math.PI;

  return -999;
}

//----------------------------------------------------------------------------

function pixToEquatorFromLat(zoom_level,lat) {
  var pix_radius = 256*Math.pow(2,zoom_level)/(2*Math.PI);
  var deg_to_rad = (2*Math.PI)/360;
  return pix_radius*Math.log((1+Math.sin(lat*deg_to_rad))/Math.cos(lat*deg_to_rad));
}

function latFromPixToEquator(zoom_level,pix) {
  var pix_radius = 256*Math.pow(2,zoom_level)/(2*Math.PI);
  var rad_to_deg = 360/(2*Math.PI);
  return (rad_to_deg)*(2*Math.atan(Math.pow(Math.E,pix/pix_radius))) - 90;
}

function getLatFromFractionOfInterval(lat1,lat2,fraction_1_to_2) {
  var pix1 = pixToEquatorFromLat(10,lat1);
  var pix2 = pixToEquatorFromLat(10,lat2);
  var fpix = pix1 + (pix2-pix1)*fraction_1_to_2;
  return latFromPixToEquator(10,fpix);
}

function getLonFromFractionOfInterval(lon1,lon2,fraction_1_to_2) {
  if(lon2<lon1) { var temp=lon1; lon1=lon2; lon2=temp; }  //--put in ascending order
  if(lon2-lon1>180) { return rectifyLon(lon2 + (lon1+360-lon2)*fraction_1_to_2); }
  else              { return lon1 + (lon2-lon1)*fraction; }
}

//--older
//f u n c t i o n getLonFromFractionOfInterval(lon1,lon2,fraction) {
//  return lon1 + (lon2-lon1)*fraction;
//}

function latFromRefLatPlusPix(zoom_level,ref_lat,pixel_shift) {
  var orig_pix_to_eq = pixToEquatorFromLat(zoom_level,ref_lat);
  return latFromPixToEquator(zoom_level,orig_pix_to_eq+pixel_shift);
}

function lonFromRefLonPlusPix(zoom_level,ref_lon,pixel_shift) {
  var pix_circumference = 256*Math.pow(2,zoom_level);
  var raw_lon = (ref_lon+360*(pixel_shift/pix_circumference));
  return rectifyLon(raw_lon);
}

//--older
//f u n c t i o n lonFromRefLonPlusPix(zoom_level,ref_lon,pixel_shift,lon_mode) {
//  if(arguments.length==3)  var lon_mode = "-180to180";
//  var pix_circumference = 256*Math.pow(2,zoom_level);
//  var raw_lon = (ref_lon+360*(pixel_shift/pix_circumference));
//  return shiftLon(raw_lon,lon_mode);
//  }

//--extend to higher 'wrapping numbers'?
function rectifyLon(lon) {
  if(lon>180)   { lon = -180+(lon-180)%360; }
  if(lon<=-180) { lon = 180-(-180-lon)%360; }
  return lon;
}

function geoPtFromRefGeoPtPlusPix(zoom_level,ref_pt,pixel_shift_x,pixel_shift_y) {
  var pix_circumference = 256*Math.pow(2,zoom_level);

  var raw_lon = (ref_pt.lon+360*(pixel_shift_x/pix_circumference));
  var ret_lon = rectifyLon(raw_lon);

  var orig_pix_to_eq = pixToEquatorFromLat(zoom_level,ref_pt.lat);
  var ret_lat = latFromPixToEquator(zoom_level,orig_pix_to_eq+pixel_shift_y);

  var ret_pt = new geoPoint(ret_lon,ret_lat);
  return ret_pt;
}

function yPixFromLat1ToLat2(zoom_level,lat1,lat2) {
  var pix_to_equator_lat1 = pixToEquatorFromLat(zoom_level,lat1);
  var pix_to_equator_lat2 = pixToEquatorFromLat(zoom_level,lat2);
  return pix_to_equator_lat2-pix_to_equator_lat1;
}

function xPixFromLon1ToLon2(zoom_level,lon1,lon2) {
  var pixel_per_deg_lon = (256*Math.pow(2,zoom_level))/360;
 
  if(lon2-lon1>180)   { var delta_x = pixel_per_deg_lon*(360-(lon2-lon1)) }
  if(lon2-lon1<=180 && lon2-lon1>-180) { var delta_x = pixel_per_deg_lon*(lon2-lon1); }
  if(lon2-lon1<=-180) { var delta_x = pixel_per_deg_lon*(360+(lon2-lon1)); }

  return delta_x;
}

//f u n c t i o n lonFromRefLonPlusPix(zoom_level,ref_lon,lon_mode,pixel_shift) {
//  var pix_circumference = 256*Math.pow(2,zoom_level);
//  var raw_lon = (ref_lon+360*(pixel_shift/pix_circumference));
//  if(raw_lon>0)      return raw_lon-360;
//  if(raw_lon<=-360)  return raw_lon+360;
//  if(raw_lon>180)    return raw_lon-360;
//  if(raw_lon<=-180)  return raw_lon+360;
//  return raw_lon;
//  }

//f u n c t i o n shiftLon(lon,lon_mode) {
//  if(lon_mode=="-180to180") {
//    if(lon>180)    lon = lon-360;
//    if(lon<=-180)  lon = lon+360;
//    return lon;
//    }
//  if(lon_mode=="-360to0") {
//    if(lon>0)      lon = lon-360;
//    if(lon<=-360)  lon = lon+360;
//    return lon;
//    }
//  if(lon_mode=="0to360") {
//    if(lon>=360)   lon = lon-360;
//    if(lon<0)      lon = lon+360;
//    return lon;
//    }
//  }

function onePixSigFigs(zoom_level,lat) {
  var next_lat = latFromRefLatPlusPix(zoom_level,lat,1);
  var delta_lat = 1000000*(next_lat-lat);  //--always positive
  if(delta_lat<5) { return 6; }
  if(delta_lat<50) { return 5; }
  if(delta_lat<500) { return 4; }
  if(delta_lat<5000) { return 3; }
  if(delta_lat<50000) { return 2; }
  if(delta_lat<500000) { return 1; }
  return 0;
}

//----------------------------------------------------------------------------
//  Old versions which were purged once.  Will probably get purged again, but 
//  brought back temporarily until I can run unit testing and really give 
//  all this code a full work out.

/*
f u n c t i o n yPixFromLatOnMap(zoom_level,center_lat,height,lat) {
  var pix_to_equator_clat = pixToEquatorFromLat(zoom_level,center_lat);
  var pix_to_equator_lat = pixToEquatorFromLat(zoom_level,lat);
  return height/2+(pix_to_equator_clat-pix_to_equator_lat);
  }

f u n c t i o n xPixFromLonOnMap(zoom_level,center_lon,width,lon) {
  var pixel_per_deg_lon = (256*Math.pow(2,zoom_level))/360;
  return width/2-pixel_per_deg_lon*(center_lon-lon);
  }

f u n c t i o n yPixFromRefLatPlusLat(zoom_level,ref_lat,lat) {
  return yPixFromLatOnMap(zoom_level,ref_lat,0,lat);
  }

f u n c t i o n xPixFromRefLonPlusLon(zoom_level,ref_lon,lon) {
  return xPixFromLonOnMap(zoom_level,ref_lon,0,lon);
  }
*/

/*

Below is rough code from notes.  Syntax may need work.  Think about use of zoom level in library that is supposed to be pure math.
Needs to be done but odd.  There are two step math problems where zoom level does not effect the answer and yet you need to pick one
to do the intermediate step?  Really?

f u n c t i o n latFromLatIntervalFraction(start_lat,end_lat,fraction) {
  var start_pix = pixToEquatorFromLat
  var end_pix = pixToEquatorFromLat
  var pix = start_pix + (end_pix-start_pix)*fraction;
  return latFromPixToEquator(zl,pix)
  }

f u n c t i o n lonFromLonIntervalFraction(start_lon,end_lon,fraction) {
  just linear, except for IDL handling?

  need more IDL handling here anyway.  In QVS IDL problem addressed by just going from 180 to -180 
  to 0 to -360 - bascially shifting IDL to PM.  Not a robust fix.
  }

*/

//############################################################################
//       sci_map_objects.js
//       by Brian T Kaney, 2015-2021
//############################################################################

//#---------------------------------------------------------------------------
//#  OBJECT:  A single geographic location as a longitude/latitude number pair
//#---------------------------------------------------------------------------

    //  0, 1, or 2 arg version: () or (geoPoint) or (lon,lat)
function geoPoint() {
  if(arguments.length==0) { this.lon = -95;   this.lat = 36; }
  if(arguments.length==1) { this.lon = parseFloat(arguments[0].lon);  this.lat = parseFloat(arguments[0].lat); }
  if(arguments.length==2) { this.lon = parseFloat(arguments[0]);   this.lat = parseFloat(arguments[1]); }
}

    //  1 or 2 arg version: (geoPoint) or (lon,lat)
geoPoint.prototype.setValue = function() {
  if(arguments.length==1) { this.lon = parseFloat(arguments[0].lon);  this.lat = parseFloat(arguments[0].lat); }
  if(arguments.length==2) { this.lon = parseFloat(arguments[0]);  this.lat = parseFloat(arguments[1]); }
};

//#----------------------------------------------------------------------------
//#  OBJECT:  A pair of longitude/latitude points interpreted as a bounding 'box'    
//#----------------------------------------------------------------------------

    //  0, 2, or 4 arg version: () or (geoPoint1,geoPoint2) or (wlon,nlat,elon,slat)
function geoBox(wlon,nlat,elon,slat) {
  if(arguments.length==0) {
    this.wlon = -96;    this.nlat = 37;
    this.elon = -94;    this.slat = 35;
  }

  if(arguments.length==2) {
    this.wlon = arguments[0].lon;    this.nlat = arguments[0].lat;
    this.elon = arguments[1].lon;    this.slat = arguments[1].lat;
  }

  if(arguments.length==4) {
    this.wlon = wlon;    this.nlat = nlat;
    this.elon = elon;    this.slat = slat;
  }
}

    //  1, 2, or 4 arg version: (geoBox) or (geoPoint1,geoPoint2) or (wlon,nlat,elon,slat)
geoBox.prototype.setValue = function() {
  if(arguments.length==1) {
    this.wlon = arguments[0].wlon;    this.nlat = arguments[0].nlat;
    this.elon = arguments[0].elon;    this.slat = arguments[0].slat;
  }

  if(arguments.length==2) {
    this.wlon = arguments[0].lon;    this.nlat = arguments[0].lat;
    this.elon = arguments[1].lon;    this.slat = arguments[1].lat;
  }

  if(arguments.length==4) {
    this.wlon = arguments[0];    this.nlat = arguments[1];
    this.elon = arguments[2];    this.slat = arguments[3];
  }
};

geoBox.prototype.latHeight = function() {
  return this.nlat-this.slat;
};

geoBox.prototype.containsIDL = function() {
  if(this.wlon>this.elon) { return "yes"; }   //-- replace with boolean 'true' and  'false' 
  else                    { return "no";  } 
};

//--what about 170 minus -170, how to get 20, how does long mode effect this?
geoBox.prototype.longWidth = function() {
  if(this.elon>=this.wlon) { return this.elon-this.wlon; }
  else                     { return (this.elon+360)-this.wlon; }
};

/*
geoBox.prototype.confineInsideBoundingBox = f u n c t i o n(container,zoom,pix_height)
{
  var lw = this.longWidth();
  if(this.wlon < container.wlon) {
    this.wlon = container.wlon;
    this.elon = this.wlon + lw;
  }
  if(this.nlat > container.nlat) {
    this.nlat = container.nlat;   
//    this.slat = this.nlat - lh;

    this.slat = latFromRefLatPlusPix(zoom,this.nlat,-1*pix_height);   //  weird in that result does not depend on pix_height,  just used to get to equator and back?  Some core code work needed to clarify this
  }
  if(this.elon > container.elon) {
    this.elon = container.elon;
    this.wlon = this.wlon - lw;
  }
  if(this.slat < container.slat) {
    this.slat = container.slat;
//    this.nlat = this.slat + lh;
    this.nlat = latFromRefLatPlusPix(zoom,this.slat,pix_height);
  }
};
*/

/*
Ideas added from hand written notes.  Added here July 2017, notes are quite a bit older:

geoBox.prototype.getCenterPoint() {   //bad syntax?, where is '= f u n c t i o n() {' part
  loc = new geoPoint(latFromLatIntervalFraction(this.s_lat,this.n_lat,0.5),lonFromLonIntervalFraction(this.w_lon,this.e_lon,0.5));
(above method doesn't exist yet, but see notes in map_math.js)
  return loc;
  }
*/

//  Other box intersection, union and overlap methods

//  need to add longitude_wrapping_mode and think this through, currently -360to0 hard coded

//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------

//-- () or (pix_rect,zoom,center_loc) or (pix_width,pix_height,zoom,center_lon,center_lat)
function mapBox() {
  if(arguments.length==0) {
    this.pix_width  = 900;    this.pix_height = 600;
    this.zoom_level = 4;
    this.center_lon = -95;    this.center_lat = 36;
  }

  if(arguments.length==3) {
    this.pix_width  = arguments[0].width;    this.pix_height = arguments[0].height;
    this.zoom_level = arguments[1];
    this.center_lon = arguments[2].lon;      this.center_lat = arguments[2].lat;
  }

  if(arguments.length==5) {
    this.pix_width  = arguments[0];     this.pix_height = arguments[1];
    this.zoom_level = arguments[2];
    this.center_lon = arguments[3];     this.center_lat = arguments[4];
  }
}

//-- (pix_rect) or (pix_width,pix_height)
mapBox.prototype.setDimensions = function() {
  if(arguments.length==1) {  
    this.pix_width  = arguments[0].width;    this.pix_height = arguments[0].height;
  }

  if(arguments.length==2) {  
    this.pix_width  = arguments[0];    this.pix_height = arguments[1];
  }
};

//-- (zoom,center_loc) or (zoom,center_lon,center_lat)
mapBox.prototype.setMap = function() {
  if(arguments.length==2) {
    this.zoom_level = arguments[0];
    this.center_lon = arguments[1].lon;    this.center_lat = arguments[1].lat;
  }

  if(arguments.length==3) {
    this.zoom_level = arguments[0];
    this.center_lon = arguments[1];    this.center_lat = arguments[2];
  }
};

//  above is pretty basic and good.  but should clarify in the arg options that geoPoint is being
//  optionally used.  And also 'pix-rect' is being optionally used.  AND 'pix_rect' is not defined 
//  here.  My thinking was, this would need to be defined elsewhere if used here.  Should be noted 
//  in documentation.  Not a problem to allow for it, even though it's not defined here.  And the naming 
//  is an issue elsewhere too - do I really need to specify that it is a pixel or screen rect.  Instead 
//  of a math rect.  Same discussion applies to screenPoint vs number pair.  Screen values should be ints
//  so maybe that is reason enough to keep them separate.

//  (lon) or (lon,mode)
mapBox.prototype.getXFromLon = function(lon,accuracy_mode) {
  if(arguments.length==1) { var accuracy_mode = "int"; }
  var ret_x = this.pix_width/2-xPixFromLon1ToLon2(this.zoom_level,lon,this.center_lon);
  if(accuracy_mode=='int')   { return Math.round(ret_x); }
  if(accuracy_mode=='float') { return ret_x; }
};

//  (lat) or (lat,mode)
mapBox.prototype.getYFromLat = function(lat,accuracy_mode) {
  if(arguments.length==1) { var accuracy_mode = "int"; }
  var ret_y = this.pix_height/2 + yPixFromLat1ToLat2(this.zoom_level,lat,this.center_lat);
  if(accuracy_mode=='int')   { return Math.round(ret_y); }
  if(accuracy_mode=='float') { return ret_y; }
};

/*---old versions that seem to differ in substance and not just style.  why?  i think these will get purged 
     but I'd like to wait until I set up a unit testing page and go thru all these in detail one by one 
     that is the real way to address the IDL issue and so on
mapBox.prototype.getXFromLon = f u n c t i o n(lon,mode) {
  if(arguments.length==1)  var mode = "int";
  if(mode=='int')    return Math.round(xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,lon));
  if(mode=='float')  return xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,lon);
  };

mapBox.prototype.getYFromLat = f u n c t i o n(lat,mode) {
  if(arguments.length==1)  var mode = "int";
  if(mode=='int')    return Math.round(yPixFromLatOnMap(this.zoom_level,this.center_lat,this.pix_height,lat));
  if(mode=='float')  return yPixFromLatOnMap(this.zoom_level,this.center_lat,this.pix_height,lat);
  };
*/

//  (loc) or (loc,mode)
mapBox.prototype.getScrPtFromGeoPt = function(loc,accuracy_mode) {
  if(arguments.length==1) { var accuracy_mode = "int"; }
  var ret_x = this.getXFromLon(loc.lon,"float");
  var ret_y = this.getYFromLat(loc.lat,"float");

  if(accuracy_mode=='int')   { var pt = new screenPoint(Math.round(ret_x),Math.round(ret_y)); }
  if(accuracy_mode=='float') { var pt = new screenPoint(ret_x,ret_y); }
  return pt;
};

mapBox.prototype.getLonFromX = function(x) {
  return lonFromRefLonPlusPix(this.zoom_level,this.center_lon,x-this.pix_width/2);
};

mapBox.prototype.getLatFromY = function(y) {
  return latFromRefLatPlusPix(this.zoom_level,this.center_lat,this.pix_height/2-y);
};

mapBox.prototype.getGeoPtFromScrPt = function(pt) {
//  var lon = lonFromRefLonPlusPix(this.zoom_level,this.center_lon,pt.x-this.pix_width/2);
//  var lat = latFromRefLatPlusPix(this.zoom_level,this.center_lat,this.pix_height/2-pt.y);
//  var loc = new geoPoint(lon,lat);
  var loc = new geoPoint(this.getLonFromX(pt.x),this.getLatFromY(pt.y));  //more compact, but need to test.  calls previous two methods.
  return loc;
};


mapBox.prototype.getWLon = function() {
  return lonFromRefLonPlusPix(this.zoom_level,this.center_lon,-1*this.pix_width/2);
};

mapBox.prototype.getNLat = function() {
  return latFromRefLatPlusPix(this.zoom_level,this.center_lat,this.pix_height/2);
};

mapBox.prototype.getELon = function() {
  return lonFromRefLonPlusPix(this.zoom_level,this.center_lon,this.pix_width/2);
};

mapBox.prototype.getSLat = function() {
  return latFromRefLatPlusPix(this.zoom_level,this.center_lat,-1*this.pix_height/2);
};

mapBox.prototype.getBoundingGeoBox = function() {
  var box = new geoBox(this.getWLon(),this.getNLat(),this.getELon(),this.getSLat());
  return box;
};



//---these next are 'stand-alones' but both have exact analogs for geoBox.  Some extra code, I think?
//---also quit using strings 'yes' and 'no' and switch to true false keywords.

mapBox.prototype.containsIDL = function()
{
  if(this.getWlon()>this.getELon()) { return "yes"; } 
  else                              { return "no";  } 
//  return this.getBoundingGeoBox().containsIDL();   //  test this one line replacement
};

mapBox.prototype.confineToBoundingBox = function(container)
{
  var bb = this.getBoundingGeoBox();

  if(bb.latHeight()<container.latHeight())
  {
    if(bb.nlat > container.nlat) { this.center_lat = latFromRefLatPlusPix(this.zoom_level,container.nlat,-1*this.pix_height/2); }
    if(bb.slat < container.slat) { this.center_lat = latFromRefLatPlusPix(this.zoom_level,container.slat,this.pix_height/2); }
  }

  if(bb.longWidth()>=container.longWidth()) { return; }

  if(container.containsIDL()=="no")
  {
    if(bb.wlon < container.wlon) { this.center_lon = lonFromRefLonPlusPix(this.zoom_level,container.wlon,this.pix_width/2); }
    if(bb.elon > container.elon) { this.center_lon = lonFromRefLonPlusPix(this.zoom_level,container.elon,-1*this.pix_width/2); }
  }

  if(container.containsIDL()=="yes" && bb.wlon>container.elon)
  {
    if(bb.wlon < container.wlon) { this.center_lon = lonFromRefLonPlusPix(this.zoom_level,container.wlon,this.pix_width/2); }
  }

  if(container.containsIDL()=="yes" && bb.elon<container.wlon)
  {
    if(bb.elon > container.elon) { this.center_lon = lonFromRefLonPlusPix(this.zoom_level,container.elon,-1*this.pix_width/2); }
  }
};

/*

Old method that I'm not sure has a new counterpart.  Or if I need a counterpart.

mapRegion.prototype.setZoomViaBoundingLon = f u n c t i o n(wlon,elon) {
  this.zoom_level = Math.log((this.pix_width)*360/(256*(elon-wlon)))/Math.LN2;
  };

*/

