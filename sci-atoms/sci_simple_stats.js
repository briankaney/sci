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

