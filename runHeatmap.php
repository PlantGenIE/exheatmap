<?php
	function execute($cmd,$stdin=null){
	    $proc=proc_open($cmd,array(0=>array('pipe','r'),1=>array('pipe','w'),2=>array('pipe','w')),$pipes);
	    fwrite($pipes[0],$stdin);                      fclose($pipes[0]);
	    $stdout=stream_get_contents($pipes[1]);        fclose($pipes[1]);
	    $stderr=stream_get_contents($pipes[2]);        fclose($pipes[2]);
	    $return=proc_close($proc);
	    return array( 'stdout'=>$stdout, 'stderr'=>$stderr, 'return'=>$return );
	}
#-db -dbp pass.txt -dbs popgenieDB_V3 -dbtb wood -g Potri.001G000200,Potri.009G012300 -s K1-01,K1-02
/*
	database: database, 
	table: table,
	fingerprint: fingerprint,
	samples: samples,
	dendrogra: dendrogram,
	row_linkage: row_linkage,
	row_distance: row_distance,
	pwfile: pwfile
*/


$table_tmp = preg_replace('/_vst/', '_vst', $_POST["table"]); 
//echo  $_POST["table"];
$php_unique_id=uniqid();
$genesfile = fopen(getcwd()."/tmp/exHeatmap_".$php_unique_id.".txt", "w") or die("Unable to open file!");
$txt = trim($_POST["private_default_gene_ids"]);
fwrite($genesfile, $txt);
fclose($genesfile);
$v1 = execute("python ".getcwd()."/python/inchlib_clust-0.1.4/inchlib_clust.py -db -dbp ".getcwd()."/".$_POST["pwfile"]." -dbs ".$_POST["database"]." -dbtb ".$table_tmp." -a ".$_POST["dendrogram"]." -f \"".$_POST["fingerprint"]."\" -s '".$_POST["samples"]."' -o ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".json -d fingerprint -rd ".$_POST["row_distance"]." -rl ".$_POST["row_linkage"]." -g  ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".txt  -sc ".$_POST["datatype_scale"] , $output);

//echo "python ".getcwd()."/python/inchlib_clust-0.1.4/inchlib_clust.py -db -dbp ".getcwd()."/".$_POST["pwfile"]." -dbs ".$_POST["database"]." -dbtb ".$table_tmp." -a ".$_POST["dendrogram"]." -f \"".$_POST["fingerprint"]."\" -s '".$_POST["samples"]."' -o ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".json -d fingerprint -rd ".$_POST["row_distance"]." -rl ".$_POST["row_linkage"]." -g  ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".txt  -sc ".$_POST["datatype_scale"];

//echo "python ".getcwd()."/python/inchlib_clust-0.1.4/inchlib_clust.py -db -dbp ".getcwd()."/".$_POST["pwfile"]." -dbs ".$_POST["database"]." -dbtb ".$_POST["table"]." -a ".$_POST["dendrogram"]." -f \"".$_POST["fingerprint"]."\" -s ".$_POST["samples"]." -o ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".json -d fingerprint -rd ".$_POST["row_distance"]." -rl ".$_POST["row_linkage"]." -g  ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".txt  -sc ".$_POST["datatype_scale"];
//$v1 = execute("python ".getcwd()."/python/inchlib_clust-0.1.4/inchlib_clust.py -db -dbp ".getcwd()."/".$_POST["pwfile"]." -dbs ".$_POST["database"]." -dbtb ".$_POST["table"]." -a ".$_POST["dendrogram"]." -f \"".$_POST["fingerprint"]."\" -s ".$_POST["samples"]." -o ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".json -d fingerprint -rd ".$_POST["row_distance"]." -rl ".$_POST["row_linkage"]." -g  ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".txt  -sc ".$_POST["datatype_scale"] , $output);
//echo "python ".getcwd()."/python/inchlib_clust-0.1.4/inchlib_clust.py -db -dbp ".getcwd()."/".$_POST["pwfile"]." -dbs ".$_POST["database"]." -dbtb ".$_POST["table"]." -a ".$_POST["dendrogram"]." -f \"".$_POST["fingerprint"]."\" -s ".$_POST["samples"]." -o ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".json -d fingerprint -g  'Eucgr.A00375,Eucgr.A02339,Eucgr.A02507,Eucgr.A02805' "; 
//echo "python ".getcwd()."/python/inchlib_clust-0.1.4/inchlib_clust.py -db -dbp ".getcwd()."/".$_POST["pwfile"]." -dbs ".$_POST["database"]." -dbtb ".$_POST["table"]." -a ".$_POST["dendrogram"]." -f \"".$_POST["fingerprint"]."\" -s ".$_POST["samples"]." -o ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".json -d fingerprint -rd ".$_POST["row_distance"]." -rl ".$_POST["row_linkage"]." -g  ".getcwd()."/tmp/exHeatmap_".$php_unique_id.".txt -sc ".$_POST["datatype_scale"];


print_r($php_unique_id); 





?>
