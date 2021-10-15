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

