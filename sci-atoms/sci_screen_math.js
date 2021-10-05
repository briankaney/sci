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

