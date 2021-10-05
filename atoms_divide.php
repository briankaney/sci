#!/usr/bin/php -q
<?php

//--------------------------------------------------------------------------------------
//   If run with no command line args, print out usage statement and bail
//--------------------------------------------------------------------------------------

  $argc = count($argv);

  if($argc==1)
  {
    print "\n\nUsage:\n";
    print "  atoms_divide.php path/list_file path/input_file\n\n";

    print "Examples:\n";
    print "  ./atoms_divide.php sci-atoms/ sci_base.prj ./sci-compounds/sci_base.js\n\n";

    print "  Reverse of the 'atoms_merge.php' script.  A single input to split is given\n";
    print "  (3rd argument).  The 1st and 2nd arguments are the base directory for the\n";
    print "  output pieces (atoms) and a list file to name the pieces.  The list will contain\n";
    print "  one filename per line.  The splitting is done on a very specific format trigger.\n";
    print "  Odd numbered occurrences of lines starting with '//****' are used to trigger the\n";
    print "  next output file.\n\n";

    exit(0);
  }

//--------------------------------------------------------------------------------------
//   Read in command line args
//--------------------------------------------------------------------------------------

  $atom_dir  = $argv[1];
  $list_file = $argv[2];
  $in_file   = $argv[3];

  if(!file_exists($in_file))   { print "Fatal error: $in_file not found\n";    exit(0); }
  if(!file_exists($list_file)) { print "Fatal error: $list_file not found\n";  exit(0); }

//--------------------------------------------------------------------------------------
//    Read in the list file and input file
//--------------------------------------------------------------------------------------

  $list = file("$list_file",FILE_IGNORE_NEW_LINES);
  $num_list = count($list);

  $lines = file("$in_file",FILE_IGNORE_NEW_LINES);
  $num_lines = count($lines);

//--------------------------------------------------------------------------------------
//    Loop thru input.  Print out every line but swap the file pointer every other time
//    a line starting with '//####' is found.
//--------------------------------------------------------------------------------------

  $j=0;
//  if(!file_exists($list[$j])) { print "Fatal Error, $list[$j] does not exist\n"; exit(0); }
  $fpt = fopen($atom_dir.$list[$j],'w');

  for($i=0;$i<$num_lines;++$i)
  {
    if($i>0 && strpos($lines[$i],"//####")!==false)
    {
      ++$j;
      if($j%2==0)
      {
        fclose($fpt);
        $next_file = $atom_dir.$list[intval($j/2)];
//        if(!file_exists($next_file)) { print "Fatal Error, $next_file does not exist\n"; exit(0); }
        $fpt = fopen($next_file,'w');
      }
    }
    fprintf($fpt,"%s\n",$lines[$i]);
  }

  fclose($fpt);

?>
