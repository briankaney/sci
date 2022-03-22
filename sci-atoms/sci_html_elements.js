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

//--think about lack of defaults and error checking.  What if selected_option is not in the options, what if don't want to specify if and you are fine defaulting the first option being active.
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
  this.selected_option = new_selected_option;     //--need error checking
  this.selected_index = this.getIndexOfSelectedOption();
  document.getElementById(this.div_id).innerHTML = this.composeDDHTML();
  document.getElementById(this.input_id).addEventListener('change',this.ddMenuHandler.bind(this),false);
};

sciDDMenu.prototype.resetSelectedIndex = function(new_selected_index)
{
  this.selected_index = new_selected_index;      //--need error checking, need a boundBy function:  boundBy(new_selected_index,0,this.num_items),  the last thing is not part of the object - need to add a way to return number of options? ( I guess 'this.options.length' works)
  this.selected_option = this.options[this.selected_index];
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
  return 0;
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

