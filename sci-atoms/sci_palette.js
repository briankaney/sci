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

