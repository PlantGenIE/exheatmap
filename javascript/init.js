//14th of Sepetember 2017 by CM
var session = '';
var gene_ids = null;
var tmp_selected_id;
toastr.options = {
	"closeButton": false,
	"debug": false,
	"positionClass": "toast-bottom-right",
	"onclick": null,
	"showDuration": "100",
	"hideDuration": "100",
	"timeOut": "6000",
	"extendedTimeOut": "0",
	"showEasing": "linear",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

var private_default_gene_ids

function reinitTool(newArray) {
	$("#experiment_div").empty();
	maingetAllExpriments(function(activeexpriments) {
		var tmp_selected="";
		var tmp_arr=[];
		for(var i=0;i<activeexpriments.length;i++){
			var tmp_name=activeexpriments[i]["experiment_name"].trim();
			var tmp_value=activeexpriments[i]["experiment_value"].trim();
			 $("#experiment_div").append('<div><input  type="radio" id="'+tmp_value+'" onchange="changeview(this.id)" name="datasource" class="radio" ><label s="" style="font-style:italic" for="'+tmp_value+'">'+tmp_name+'</label></div>');
			if(activeexpriments[i]["default selection"]=="1"){
				tmp_selected=tmp_value;
			}
			tmp_arr.push(tmp_value);
		}
				

		var cookieView = getCookie('cookie_view')
		if(cookieView== null || jQuery.inArray(cookieView, tmp_arr) == -1 ){
			private_view=tmp_selected;	 
			setCookie('cookie_view',private_view);
		}else{
			private_view=cookieView;
		}
		var b1 = document.getElementById(private_view);
		b1.checked = true;
		

	if (newArray[0] != undefined && newArray[0].length > 0) {
		if (newArray[0].length > 1001) {
			toastr.error('Please save less than 1000 genes.', 'Limit exceeded');
			return true
		}
		private_default_gene_ids = newArray[0].join(",");
		$("#input_ids").val(private_default_gene_ids);
		createHeatmap();;
	}
	});
}

function save_geneids(event) {
	$(".loader-wrap").show();
	var name = "clade_" + Math.floor((Math.random() * 100) + 1);
	mainCreategenelistbyName(gene_ids, name, function(e) {
		$("#inchlib").stop();
		$("#inchlib").effect("transfer", {
			to: "#numberofgenesSpan",
			className: "ui-effects-transfer-2"
		}, 800);
		$(".loader-wrap").hide();
		get_active(function(e) {})
	})
}

function update_genes(ids, name = false, operation = "add") {
	$(".loader-wrap").show();
	var finalvar = "operation=" + operation + "&ids=" + ids + "&name=" + name;
	$.ajax({
		type: "POST",
		url: "../plugins/genelist/crud/api.php",
		data: (finalvar),
		success: function() {
			toastr.success(name + " GeneList has been created with " + ids.length + ' gene ids.', 'New GeneList created');
			save_selected_button(false);
			$(".loader-wrap").hide();
			updategenebasket();
			$("#inchlib").stop();
			$("#inchlib").effect("transfer", {
				to: "#numberofgenesSpan",
				className: "ui-effects-transfer-2"
			}, 800);
		}
	});
	return true;
}

function createHeatmap() {
	$("#exheatmap_waiting").show();
	//$(".loader-wrap").show();
	save_selected_button(false);
	// -db -dbp pass.txt -dbs popgenieDB_V3 -dbtb wood -g Potri.001G000200,Potri.009G012300 -s K1-01,K1-02
	// Testvars
	//delete window.inchlib;
	var row_distance = $("#distfunc").val();
	var row_linkage = $("#clustfunc").val();
	var selected_sample = $("#sample_selection").val();
	var dendrogram = $("input[name=dendogram_selection]:checked").val()
	var vstscale = $("input[name=vst_check]:checked").val()
	var datatype_scale;
	if (vstscale == "true") {
		datatype_scale = "vst"
	} else {
		datatype_scale = "sc"
	}
	/// Not working currently.
	var table = "exatlas_tissue";
	var database = "eucgenie_egrandis_v2_new";
	var pwfile = "pass.txt";
	var domain = '';
	// May be possible to fetch directly from the database like genes using the fingerprint below.
	var samples = "";
	// Fingerprint is used to identify the gene list on the server directly in the inchlib_clust script.
	var fingerprint = getCookie('fingerprint');
	// Getvars
	$.post("plugins/exheatmap/runHeatmap.php", {
			database: MAIN_GENELIST_TABLE,
			table: private_view + "_vst",
			fingerprint: fingerprint,
			samples: sample_label_id,
			dendrogram: dendrogram,
			row_linkage: row_linkage,
			row_distance: row_distance,
			pwfile: pwfile,
			session: session,
			domain: domain,
			selected_sample: table,
			datatype_scale: datatype_scale,
			private_default_gene_ids: private_default_gene_ids
		})
		//.fail(function(err){console.log(err)})
		.done(function(data, status) {
			if (data.trim() != "something wrong") {
				$(".loader-wrap").hide();
				$("#exheatmap_waiting").hide();
				startInchlib(data);
			} else {
				toastr.error("Please add some genes into your GeneList.", 'Empty GeneList');
				console.log("Please add some gene ids into the GeneList")
			}
		});
}

function startInchlib(file_id) {
	//run when the whole page is loaded 
	window.inchlib = new InCHlib({
		//instantiate InCHlib 
		target: "inchlib",
		//ID of a target HTML element 
		metadata: true,
		independent_columns: false,
		//turn on the metadata 
		column_metadata: true,
		//turn on the column metadata 
		max_height: 1200,
		//set maximum height of visualization in pixels 
		width: 1000, //set width of visualization in pixels 
		heatmap_colors: "BuWhRd",
		//set color scale for clustered data 
		metadata_colors: "Reds", //set color scale for metadata 
	});
	inchlib.read_data_from_file("plugins/exheatmap/tmp/exHeatmap_" + file_id + ".json"); //read input json file 
	inchlib.draw(); //draw cluster heatmap 
	//	inchlib._draw_color_scale();
	bind_dendrogram_events();
}

function fill_options() {
	var options = $("#distfunc");
	$.each(distances, function() {
		$.each(this, function() {
			str = this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				return letter.toUpperCase();
			});
			options.append($("<option />").val(this).text(str));
		});
	});
	var options = $("#clustfunc");
	$.each(linkages, function() {
		str = this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
		options.append($("<option />").val(this).text(str));
	});
	var options = $("#sample_selection");
	$.each(samples, function() {
		str = this.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
		options.append($("<option />").val(this).text(str));
	});
}
var tmp_array = new Array();
var tmp_ids_array = new Array();

function bind_dendrogram_events() {
	window.inchlib.events.row_onclick = function(ids, evt) {
		this.name = ids
		tmp_array.push("     <a target='_blank' href='gene?id=" + this.name + "'>" + this.name + "</a>  <span onclick='" + 'tmp_array_alert("' + this.name + '");' + "' style='font-weight:bold;font-size:14px;color:#FF0000;cursor:pointer'>x</span>");
		geneadded(this.name);
		tmp_array = $.unique(tmp_array);
		tmp_array = tmp_array.sort();
		tmp_ids_array.push(this.name);
		tmp_ids_array = $.unique(tmp_ids_array);
		tmp_ids_array = tmp_ids_array.sort();
		if (tmp_array != null) {
			$('#newtable_2').fadeIn();
			$('#newtable_2title').html("- Selected Genes <strong>" + tmp_array.length + "</strong>");
			$('#newtable_4title').html("+ Selected Genes <strong>" + tmp_array.length + "</strong>");
			$('#listids').html(tmp_array.join("<br>"));
		} else {
			$('#newtable_2').hide();
		}
		$('#newtable_2').show();
	}
	window.inchlib.events.dendrogram_node_onclick = function(column_indexes, node_id, evt) {
		gene_ids = column_indexes;
		save_selected_button(true);
	}
	window.inchlib.events.dendrogram_node_unhighlight = function(node_id) {
		save_selected_button(false);
	}
	window.inchlib.events.row_onmouseover = function(object_ids, evt) {
		//console.log(object_ids, evt)
	}
}
// readyfunctions for menu
$('#genelistname').on('click focusin', function() {
	this.value = '';
});
var show_hide_chk = true;
var show_vst = true;
var sample_label_id = true;
/// document readyfunctions
$(document).ready(function() {
	fill_options();
	var private_default_gene_ids = "";
	$.each(['dendogram_1', 'dendogram_2'], function(i, type) {
		$('#' + type).change(function(e) {
			dendrogram = e.target.value;
			maingetActiveGeneList(function(activegenes) {
				if (activegenes[0] != undefined && activegenes[0].gene_list.split(",").length > 0) {
					private_default_gene_ids = activegenes[0].gene_list;
					createHeatmap();
				}
			});
		});
	});
	$.each(['cell_values_1', 'cell_values_2'], function(i, type) {
		$('#' + type).change(function(e) {
			if (e.target.value == "true") {
				show_hide_chk = true;
			} else {
				show_hide_chk = false;
			}
			createHeatmap();
		});
	});
	$.each(['sample_id', 'sample_name'], function(i, type) {
		$('#' + type).change(function(e) {
			if (e.target.value == "true") {
				sample_label_id = true;
			} else {
				sample_label_id = false;
			}
			createHeatmap();
		});
	});
	$.each(['vst_1', 'vst_2'], function(i, type) {
		$('#' + type).change(function(e) {
			if (e.target.value == "true") {
				show_vst = true;
				toastr.info('VST values are showing in the heatmap.', 'Updated VST values');
			} else {
				show_vst = false;
				toastr.info('Standrad scores are showing in the heatmap.', 'Updated Standrad score');
			}
			maingetActiveGeneList(function(activegenes) {
				if (activegenes[0] != undefined && activegenes[0].gene_list.split(",").length > 0) {
					private_default_gene_ids = activegenes[0].gene_list;
					createHeatmap();
				}
			});
		});
	});
	document.querySelector("g#eximage").addEventListener("click", () => window.open('/eximage?id=' + tmp_selected_id, '_blank'), false)
	document.querySelector("g#gene_pages").addEventListener("click", () => window.open('/gene?id=' + tmp_selected_id, '_blank'), false)
});
//Change views method using corresponding mode values to load SVG
var private_view = "private_view";

function changeview(tmpview) {
	setCookie("cookie_view", tmpview, 10);
	var b1 = document.getElementById('C');
	var b2 = document.getElementById('experiment_2');
	var b3 = document.getElementById('expression_exatlas_chrysoporthe');
	var b4 = document.getElementById('expression_exatlas_leptocybe');
	var b5 = document.getElementById('expression_exatlas_phytopthora');
	var replicate_str = "";
	private_view = tmpview;
	createHeatmap();
}
// Save selected button function
function save_selected_button(show) {
	var timer;
	var elm = $("#save_selected");
	if (show == true) {
		elm.show();
		timer = setInterval(blink, 1200);
		blink();

		function blink() {
			elm.toggleClass('blink');
		}
	} else {
		clearInterval(timer)
		elm.hide();
	}
}
/*
var show_hide_chk=true;
function show_hide_values(){
	//window.inchlib.current_draw_values=false;
	//console.log(window.inchlib.current_draw_values)
	if(show_hide_chk==true){
		show_hide_chk=false;
		$("#hide_cell").html("Show cell values");
	}else{
		show_hide_chk=true;
		$("#hide_cell").html("Hide cell values");
	}
	createHeatmap();

}
*/
/*var show_vst=true;
function vst_standard_score(){
	
	if(show_vst==true){
		show_vst=false;
		$("#vst_label").html("Change to VST values")
		toastr.info('Standrad scores are showing in the heatmap.', 'Updated Standrad score');
	}else{
		show_vst=true;
		$("#vst_label").html("Change to Standard score");
		toastr.info('VST values are showing in the heatmap.', 'Updated VST values');
		
	}
	createHeatmap();
}*/
function tmp_array_alert(removeItem) {
	var removeme = "     <a target='_blank' href='gene?id=" + removeItem + "'>" + removeItem + "</a>  <span onclick='" + 'tmp_array_alert("' + removeItem + '");' + "' style='font-weight:bold;font-size:14px;color:#FF0000;cursor:pointer'>x</span>";
	tmp_array = $.grep(tmp_array, function(value) {
		return value != removeme;
	});
	tmp_ids_array = $.grep(tmp_ids_array, function(value) {
		return value != removeItem;
	});
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"positionClass": "toast-bottom-right",
		"onclick": null,
		"showDuration": "1",
		"hideDuration": "0",
		"timeOut": "4000",
		"extendedTimeOut": "0",
		"showEasing": "linear",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	toastr.info('' + removeItem + ' gene has been removed from explot list.', 'Successfully removed');
	if (tmp_ids_array.length == 0) {
		toastr.options = {
			"closeButton": false,
			"debug": false,
			"positionClass": "toast-bottom-right",
			"onclick": null,
			"showDuration": "100",
			"hideDuration": "100",
			"timeOut": "8000",
			"extendedTimeOut": "0",
			"showEasing": "linear",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		}
		toastr.warning('You just removed all genes in your explot list. Please add some genes.', 'Empty explot list');
		$('#newtable_2').fadeOut()
	}
	tmp_array = $.unique(tmp_array);
	tmp_array = tmp_array.sort();
	tmp_ids_array = $.unique(tmp_ids_array);
	tmp_ids_array = tmp_ids_array.sort();
	if (tmp_array != null) {
		$('#newtable_2').show();
		$('#newtable_2title').html("- Selected Genes <strong>" + tmp_array.length + "</strong>");
		$('#newtable_4title').html("+ Selected Genes <strong>" + tmp_array.length + "</strong>");
		$('#listids').html(tmp_array.join("<br>"));
	} else {
		$('#newtable_2').hide();
	}
}

function geneadded(addedgene) {
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"positionClass": "toast-bottom-right",
		"onclick": null,
		"showDuration": "1",
		"hideDuration": "0",
		"timeOut": "4000",
		"extendedTimeOut": "0",
		"showEasing": "linear",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	toastr.info('' + addedgene + ' gene has been added to explot list.', 'Successfully updated');
}

function toggleMe() {
	var e = document.getElementById('newtable_3');
	if (!e) return true;
	if (e.style.display == "none") {
		//  e.style.display="block"
		document.getElementById('newtable_3').style.display = "block"
		document.getElementById('newtable_2').style.display = "none"
	} else {
		document.getElementById('newtable_3').style.display = "none"
		document.getElementById('newtable_2').style.display = "block"
	}
	return true;
}
$('#newtable_3title').click(function() {
	mainCreategenelistbyName(tmp_ids_array.join(), "Cutsom List_" + Math.floor((Math.random() * 100) + 1), function(e) {
		get_active(function(e) {
			$("#newtable_2").hide();
		})
	})
});

function export_image_as_pdf(type_of_image) {
	var action = "save"
	if (type_of_image == "pdf") {
		var zoom = 1; //1.4,a3
	} else {
		var zoom = 1;
	}
	var width = window.inchlib.stage.width();
	var height = window.inchlib.stage.height();
	var loading_div = $("<h3 style='margin-top: 100px; margin-left: 100px; width: " + width + "px; height: " + height + "px;'>Downloading please wait...</h3>");
	window.inchlib.target_element.after(loading_div);
	window.inchlib.target_element.hide();
	window.inchlib.stage.width(width * zoom);
	window.inchlib.stage.height(height * zoom);
	window.inchlib.stage.scale({
		x: zoom,
		y: zoom
	});
	window.inchlib.stage.draw();
	window.inchlib.navigation_layer.children[3].hide();
	window.inchlib.navigation_layer.children[5].hide();
	if (window.inchlib.navigation_layer.children[7] != undefined) {
		window.inchlib.navigation_layer.children[7].hide();
	}
	$("#tool_links").hide();
	window.inchlib.stage.toDataURL({
		quality: 1,
		callback: function(dataUrl) {
			if (action === "open") {
				open_image(dataUrl), type_of_image;
			} else {
				download_image(dataUrl, type_of_image);
			}
			window.inchlib.stage.width(width);
			window.inchlib.stage.height(height);
			window.inchlib.stage.scale({
				x: 1,
				y: 1
			});
			window.inchlib.stage.draw();
			loading_div.remove();
			window.inchlib.target_element.show();
			window.inchlib.navigation_layer.show();
			window.inchlib.navigation_layer.children[3].show();
			window.inchlib.navigation_layer.children[5].show();
			if (window.inchlib.navigation_layer.children[7] != undefined) {
				window.inchlib.navigation_layer.children[7].show();
			}
			window.inchlib.navigation_layer.draw();
		}
	});
}

function download_image(dataUrl, type_of_image) {
	if (type_of_image == "pdf") {
		var pdf = new jsPDF({
			orientation: 'landscape',
			unit: 'mm',
			format: 'a1'
		}); //{orientation: 'landscape' }
		pdf.addImage(dataUrl, 'JPEG', 16, 4);
		pdf.save("exHeatmap.pdf");
	} else {
		$('<a download="exHeatmap" href="' + dataUrl + '"></a>')[0].click();
	}
};

function download_all_expression() {
	var feature_names = Object.values(window.inchlib.data.feature_names)
	var temp_array = (Object.values(window.inchlib.data.nodes));
	var results_array = [];
	var sample_length;
	for (var i = 0; i < temp_array.length; i++) {
		var obj = temp_array[i]
		var array_concat = [];
		var result = Object.keys(obj).map(function(key) {
			if (key == "objects") {
				array_concat.push(obj[key].join())
			}
			if (key == "features") {
				array_concat.push(obj[key].join("\t"))
				results_array.push(array_concat.join("\t"))
				sample_length = obj[key].length;
			}
		})
	}
	var tmp_header_array = ["gene_id"];
	for (var k = 0; k < sample_length; k++) {
		tmp_header_array.push(feature_names[k]);
	}
	var tmp_header_str = tmp_header_array.join("\t")
	var data_str;
	for (var j = 0; j < results_array.length; j++) {
		data_str = tmp_header_str + "\n" + results_array.join("\n");
	}
	var blob = new Blob([data_str], {
		type: "text/plain;charset=utf-8"
	});
	//console.log(JSON.stringify(window.inchlib.data))
	saveAs(blob, "exHeatmap.txt");
}