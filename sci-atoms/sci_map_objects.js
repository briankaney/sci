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

geoBox.prototype.longWidth = function() {   //--what about 170 minus -170, how to get 20, how does long mode effect this?
  if(this.elon>=this.wlon) { return this.elon-this.wlon; }
  else                     { return (this.elon+360)-this.wlon; }
};

/*
geoBox.prototype.confineInsideBoundingBox = function(container,zoom,pix_height)
{
  var lw = this.longWidth();
  if(this.wlon < container.wlon) {
    this.wlon = container.wlon;
    this.elon = this.wlon + lw;
  }
  if(this.nlat > container.nlat) {
    this.nlat = container.nlat;   
//    this.slat = this.nlat - lh;

    this.slat = latFromRefLatPlusPix(zoom,this.nlat,-1*pix_height);   //  weird in that result does not depend on pix_height,  just used to get to equator and back?  Some core function work needed to clarify this
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

geoBox.prototype.getCenterPoint() {
  loc = new geoPoint(latFromLatIntervalFraction(this.s_lat,this.n_lat,0.5),lonFromLonIntervalFraction(this.w_lon,this.e_lon,0.5));
(above functions don't exist yet, but see notes in map_math.js)
  return loc;
  }
*/

//  Other box intersection, union and overlap functions

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
mapBox.prototype.getXFromLon = function(lon,mode) {
  if(arguments.length==1)  var mode = "int";
  if(mode=='int')    return Math.round(xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,lon));
  if(mode=='float')  return xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,lon);
  };

mapBox.prototype.getYFromLat = function(lat,mode) {
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

mapRegion.prototype.setZoomViaBoundingLon = function(wlon,elon) {
  this.zoom_level = Math.log((this.pix_width)*360/(256*(elon-wlon)))/Math.LN2;
  };

*/

