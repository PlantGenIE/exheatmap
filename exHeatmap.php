<?php  
	?>  
	<span style="float: right;color: red">&copy;</span>
<link href="plugins/tour/css/poptour.css" rel="stylesheet"></link>	
<link href="plugins/exheatmap/css/explot.css" rel="stylesheet"></link>
<script type="text/javascript">
var linkages = ["ward", "single", "complete", "average", "centroid", "median", "weighted"];
var raw_linkages = ["ward", "centroid"];
var distances = {
	"numeric": ["correlation", "euclidean","braycurtis", "canberra", "chebyshev", "cityblock",  "cosine", "mahalanobis", "minkowski", "seuclidean", "sqeuclidean"],
	"binary": ["dice", "hamming", "jaccard", "kulsinski", "matching", "rogerstanimoto", "russellrao", "sokalmichener", "sokalsneath", "yule"]
};
var samples = ["experiment_2", "experiment_1", "experiment_3", "experiment_4"];
</script>
 <head>
 	<title>exHeatmap</title>
 	<script src="plugins/exheatmap/javascript/kinetic-v5.1.0.min.js"></script> 
 	<script src="plugins/exheatmap/javascript/inchlib-1.2.0.min.js"></script>
	 <script src="plugins/exheatmap/javascript/jspdf.min.js"></script>
 </head>
 <span style="position: absolute" id="exheatmap_waiting"><img width="160px" src="plugins/gene/css/load1.gif" /></span> 
 <div id="container"></div>
 <div id="alert-error" class="alert alert-info" style="margin-top:-20px !important;display:none;float:right">
  <a onclick="closeme2()" class="closex" data-dismiss="alert">×</a>
  <span id="max_min"></span>
</div>


 	<div id="inchlib menu">
	 <div id="newtable_2" style="width:180px;overflow:hidden;position:absolute;z-index:1000;display:none;margin-left:1200px !important" >
<div onClick="return toggleMe()"  id="newtable_2title">- Selected Genes</div>
<div id="listids" style="overflow: auto;height:auto;max-height:320px;margin-top:4px;margin-bottom:4px;"></div>
<div  id="newtable_3title" style="bottom:0px;">Make a new GeneList</div>
</div>
<div id="newtable_3"    style="height:680px;height:48px;display:none;width:160px;overflow:hidden;position:absolute;z-index:1000;margin-left:1200px !important">
<div onClick="return toggleMe()" id="newtable_4title">+ Selected Genes <strong><?php echo ' '.count($efppieces);?></strong></div>
</div>
 	</div>
	 <span id="save_selected" style="display:none" onClick='save_geneids();' >Save selected clade into a new GeneLst!</span>
	 <table>
  <tr>
    <td><div style="width:100px;"></div></td>
    <td><div style="width: 100%;position:absolute;" id="inchlib" ></div></td>
  </tr>
  
</table>
 <script src="plugins/exheatmap/javascript/init.js"></script> 
<style type="text/css" media="screen">
.slide-out-div {
	border-left: #9ac352 2px solid;
	width: 240px;
	padding: 20px;
	background: url(plugins/exdraw/img/sidebar_background.png
) no-repeat scroll 100% 100%;
	line-height: 1;
	position: absolute;
	height: 100%;
	right: -3px;
}
.handle {
	background-image: url(plugins/exdraw/img//right_sidebar3.png);
	width: 28px;
	height: 134px;
	display: block;
	text-indent: -99999px;
	outline: none;
	position: absolute;
	top: 30px;
	left: -32px;
	background-position: initial initial;
	background-repeat: no-repeat no-repeat;
}
	</style>
    <script src="plugins/exdraw/js/jquery.tabSlideOut.v1.3.js"></script>
         <script>
         $(function () {
         	$('.slide-out-div').tabSlideOut({
         		tabHandle: '.handle', //class of the element that will be your tab
         		//   pathToTabImage: 'images/contact_tab.gif',          //path to the image for the tab (optionaly can be set using css)
         		imageHeight: '186px', //height of tab image
         		imageWidth: '40px', //width of tab image
         		tabLocation: 'right', //side of screen where tab lives, top, right, bottom, or left
         		speed: 300, //speed of animation
         		action: 'click', //options: 'click' or 'hover', action to trigger animation
         		topPos: '0px', //position from the top
         		fixedPosition: true //options: true makes it stick(fixed position) on scroll
         	});
         });
 
         //SVG convertion and download into different formats
         function submit_download_form(output_format) {
         	var tmp = chanaka.select(document.getElementById("popcharts-0")).node();
         	var svg = document.getElementsByTagName("svg")[0];
         	// Extract the data as SVG text string
         	var svg_xml = (new XMLSerializer).serializeToString(svg);
         	// Submit the <FORM> to the server.
         	// The result will be an attachment file to download.
         	var form = document.getElementById("svgform");
         	form['output_format'].value = output_format;
         	form['data'].value = svg_xml;
         	form.submit();
         }
         if (getCookie("select_species") != undefined) {
         	var current_species_cook = getCookie("select_species");
         }
         $('#poplar_species_select').on('change', function () {
         	if (this.value != current_species_cook) {
         		location.reload();
         	}
         });
         </script>
         <div class="slide-out-div">
        <a class="handle" href="http://link-for-non-js-users">Content</a>
<button id="startTourBtn" style=" width:100%;background-color:#F90;border-color:#F90;color:#000"  class="btn btn-large btn-primary">Take a Tour</button>
</br></br>
<div id="experiment_div" >
<!--<div >

<input  type="radio" id="norwood" onchange="changeview('norwood');" name="datasource" class="radio" checked="checked">
<label s="" style="font-style:italic" for="norwood">NorWood</label></div>
<div><input onchange="changeview('exatlas');" type="radio" id="exatlas" name="datasource" class="radio">
<label s="" style="font-style:italic" for="exatlas">P. abies exAtlas</label></div>-->
</div>
</br></br>
<div>
</br></br></br></br>
<!-- <input class="button" type="submit" value="Create heatmap" />
 <button class="btn btn-success"   onClick="export_image_as_pdf('svg')" id="save_as_svg" value="" >SVG</button> -->
    <button class="btn btn-success"  onClick="export_image_as_pdf('pdf')" id="save_as_pdf"  value="" >PDF</button>
    <button class="btn btn-success"  onClick="export_image_as_pdf('png')" id="save_as_png" value="" >PNG</button><br><br>

	<button id="download" style=" width:100%;" class="btn btn-large btn-primary" onclick="download_all_expression()">Download Expression data</button>

<br>
<textarea id="input_ids" style="width:200px;font-size:14px;height:0px;display:none"  rows="15"> </textarea><br><!--</div>-->
<div id="datasourcediv2"><div>
<input  type="radio"   value="row"  id="dendogram_1" name="dendogram_selection" class="radio" checked="checked" />
<label  for="dendogram_1">Cluster genes only</label></div><div>
<input  type="radio" value="both" id="dendogram_2" name="dendogram_selection" class="radio" />
<label  for="dendogram_2">Cluster genes and samples</label></div>
</div>
</br></br></br>
<div id="datasourcediv3"><div>
<input  type="radio"   value="true"  id="cell_values_1" name="cell_values" class="radio" checked="checked" />
<label  for="cell_values_1">Show cell values</label></div><div>
<input  type="radio" value="false" id="cell_values_2" name="cell_values" class="radio" />
<label  for="cell_values_2">Hide cell values</label></div>
</div>

</br><br></br>

<div id="datasourcediv4"><div>
<input  type="radio"   value="true"  id="vst_1" name="vst_check" class="radio" checked="checked" />
<label style="width:220px" for="vst_1">Absolute expression (VST)</label></div><a target="_blank" href="https://en.wikipedia.org/wiki/Variance-stabilizing_transformation">&nbsp;?</a><div>
<input  type="radio" value="false" id="vst_2" name="vst_check" class="radio" />
<label style="width:220px"  for="vst_2">Row scaled z-score</label></div><a target="_blank" href="https://en.wikipedia.org/wiki/Standard_score">&nbsp;?</a>
</div>

</br>

<div id="datasourcediv5"><div>
<input  type="radio"   value="true"  id="sample_id" name="sample_label_check" class="radio" checked="checked" />
<label style="width:220px" for="sample_id">Sample ID</label></div><div>
<input  type="radio" value="false" id="sample_name" name="sample_label_check" class="radio" />
<label style="width:220px"  for="sample_name">Sample Description</label></div>
</div>
</br></br></br>

<!--<span id="hide_cell">Hide cell values</span><br>
<label style="margin-top:4px;"  id="show_hide_chk_lbl" class="switch">
<input id="show_hide_chk" type="checkbox" onchange="show_hide_values();" checked>
<span class="slider round"></span>
</label>
</br></br>
<span  id="vst_label">Change to Standard score</span></br>
<label style="margin-top:4px;" id="vst" class="switch">
<input id="ss" name ="ss" type="checkbox" onchange="vst_standard_score();" checked>
<span class="slider round"></span>
</label>
</br></br>-->
<span>Row Distance <span>
<select class="select-style" onchange="createHeatmap()" id="distfunc" name="distfunc"></select></br></br>
<span>Row Linkages </span>
<select class="select-style" onchange="createHeatmap()"  id="clustfunc" name="clustfuc"></select></br></br>
<select class="select-style" id="sample_selection" name="sample_selection" style="display:none"></select></br>
<button id="submit" style=" width:100%;" class="btn btn-large btn-primary" onclick="createHeatmap()">update chart</button>
<td style="display:none"> <input type="radio" style="display:none" id="dendrogram" name="dendrogram" value="row" checked>
	<input type="radio" id="dendrogram" name="dendrogram" style="display:none" value="both">
</td>
</br>
<br><br>
<div style="display: none" id="charttyperadio">
	<input type="radio" id="line" name="charttype" class="radio" checked/>
	<label for="line">Line</label></div>
<div>
	<input type="radio" id="column" name="charttype" class="radio" style="display: none" />
	<label for="column" style="display: none">Bar</label></div>
<div>
	<button class="btn btn-large btn-primary" id="swaplabelsbtn" style="display: none">Change Sample names</button>
	<div style="color: #464646;font-family: Verdana;font-size:12px" id="infolabels"></div>
	<br><br>
</div>
</div>
</div>

<div id="tool_links"  style="cursor:pointer;display:none;background:#FEC722;width:112px;height:48px;padding:8px; border-radius: 10px;border: 1px solid #222222;" >
<svg xmlns="http://www.w3.org/2000/svg" >
 <g transform="scale(1.6)" id="eximage">
     <circle id="svg_3" fill="#FEC722" stroke="#222222" stroke-linecap="round" stroke-linejoin="round" r="11.7" cy="12.2" cx="15.8"/>
    <path id="svg_1" fill="#FEC722" d="m17.06,3.69c-0.32,-0.74 -0.87,-1.22 -1.27,-1.22s-1,0.56 -1.27,1.22l-1,2.43l4.48,0l-0.94,-2.43zm2.42,6.08l-6.48,0l-1,2.43l7.47,0l0.01,-2.43zm0.53,-1.2l-8.45,0l-1,2.43l10.44,0l-0.99,-2.43zm1.47,6.06l-0.49,-1.22l-10.92,0l-0.49,1.22a0.83,0.83 0 0 0 0.81,1.22l10.8,0c0.7,1.21 1.15,0.66 0.81,0l-0.52,-1.22zm-7.46,6.08l2.54,0l0,-2.43l-2.04,0l-0.5,2.43z"/>
    <path id="svg_2" fill="#FEC722" stroke="#222222" stroke-miterlimit="10" d="m17.06,3.69c-0.32,-0.74 -0.87,-1.22 -1.27,-1.22s-1,0.56 -1.27,1.22l-1,2.43l4.48,0l-0.94,-2.43zm2.42,6.08l-6.48,0l-1,2.43l7.47,0l0.01,-2.43zm0.53,-1.2l-8.45,0l-1,2.43l10.44,0l-0.99,-2.43zm1.47,6.06l-0.49,-1.22l-10.92,0l-0.49,1.22a0.83,0.83 0 0 0 0.81,1.22l10.8,0c0.7,1.21 1.15,0.66 0.81,0l-0.52,-1.22zm-7.46,6.08l2.54,0l0,-2.43l-2.04,0l-0.5,2.43z"/>
    <text id="svg_4" x="1" y="29.85" font-size="7.40613px" fill="#222222"  font-family="AmericanTypewriter, American Typewriter">exImage</text>
  </g>
  <g transform="scale(1.6)" id="gene_pages">
    <circle id="svg_5" fill="#FEC722" stroke="#222222" stroke-linecap="round" stroke-linejoin="round" r="11.46" cy="11.96" cx="52.78"/>
    <path id="svg_6" fill="#FEC722" stroke="#222222" stroke-miterlimit="10" d="m56.68,6.86a2,2 0 0 0 -2,1.89a2,2 0 0 0 4.05,0a2,2 0 0 0 -2.05,-1.89zm0,2.83a0.94,0.94 0 1 1 1,-0.94a1,1 0 0 1 -1,0.94zm2,-4.71l-5.5,0a1.73,1.73 0 0 0 -1.2,0.32l-8,7.45a0.9,0.9 0 0 0 0,1.34l6.13,5.7a1,1 0 0 0 0.72,0.28a1.05,1.05 0 0 0 0.72,-0.28l8,-7.46a1.52,1.52 0 0 0 0.34,-1.22l0,-5a1.19,1.19 0 0 0 -1.24,-1.11l0.03,-0.02zm0.18,6.69l-8,7.45l-6.12,-5.7l8,-7.45a1.61,1.61 0 0 1 0.49,0l5.47,0a0.21,0.21 0 0 1 0.22,0.2l0,5a1.88,1.88 0 0 1 -0.09,0.49l0.03,0.01z"/>
    <text id="svg_7" x="34" y="29.92" font-size="7.2509px"  fill="#222222"  font-family="AmericanTypewriter, American Typewriter">GenePages</text>
  </g>
</svg></div>
   <!-- <div id="plantgenie_box" style="left:1400px;border-radius:6px;top:420px; background:#fff;opacity:0.8;position:absolute">      </div> -->
<script src="<?php print $GLOBALS['base_url']?>/plugins/tour/poptour.js"></script>
<script src="<?php print $GLOBALS['base_url']?>/plugins/tour/exheatmap.js"></script>
<script src="<?php print $GLOBALS['base_url']?>/plugins/tour/workflow.js"></script>
