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

