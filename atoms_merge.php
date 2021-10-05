#!/usr/bin/php -q
<?php

//--------------------------------------------------------------------------------------
//   If run with no command line args, print out usage statement and bail
//--------------------------------------------------------------------------------------

  $argc = count($argv);

  if($argc==1)
  {
    print "\n\nUsage:\n";
    print "  atoms_merge.php atom_base_dir list_file path/output_file\n\n";

    print "Examples:\n";
    print "  ./atoms_merge.php sci-atoms/ sci_base.prj sci-compounds/sci_base.js\n\n";

    print "  The library pieces (the atoms) all need to be in the same directory.  Which is\n";
    print "  the first argument.  The second argument is a text file with a list (one per line)\n";
    print "  with the atom filenames.  The last argument is the output file.  A system call to\n";
    print "  'cat' is used to perform the merge.\n\n";

    exit(0);
  }

//--------------------------------------------------------------------------------------
//   Read in command line args
//--------------------------------------------------------------------------------------

  $atom_dir  = $argv[1];
  $list_file = $argv[2];
  $out_file  = $argv[3];

  if(!file_exists($list_file)) { print "Fatal error: list file $list_file not found\n\n";  exit(0); }

//--------------------------------------------------------------------------------------
//    Read in the list file
//--------------------------------------------------------------------------------------

  $list = file("$list_file",FILE_IGNORE_NEW_LINES);
  $num_list = count($list);

//--------------------------------------------------------------------------------------
//    Form a long string of all the files in the list separated by spaces
//--------------------------------------------------------------------------------------

  $file_string = $atom_dir.$list[0];
  for($i=1;$i<$num_list;++$i) {
    $file_string = $file_string." ".$atom_dir.$list[$i];
  }

//--------------------------------------------------------------------------------------
//    Run system command to do the concatenation
//--------------------------------------------------------------------------------------

  system("cat $file_string > $out_file");

?>
