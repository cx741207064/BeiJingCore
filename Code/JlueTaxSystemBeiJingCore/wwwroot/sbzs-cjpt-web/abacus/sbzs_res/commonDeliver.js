function goPageZf() {
    url = "/sbzs-cjpt-web/nssb/sbzf/sbzf.do?gdslxDm=3&amp;cdId=24&amp;gnDm=gndm-24";
    // window.location.href=url;
    window.open(url,"_blank");
}

/*
 * 下载模版按钮
 * */
function modelDownload2() {
	//alert(1);
	try{
		var tempParems = "{"+$("#myform").find("input[id='_query_string_']").val()+"}";
		var tempData = eval('('+tempParems+')');
		var sbywbm = tempData.ywbm;
		var downloadPath = "";
		if (sbywbm.indexOf("YBNSRZZS")==0||sbywbm.indexOf("XGMZZS")==0){
			downloadPath = "../../cwbb/_default_/form/kcxm_import.zip";
		} else if(sbywbm.indexOf("WHSYJSF_YGZ")==0){
			downloadPath = "../../cwbb/_default_/form/whsyjsf_import.zip";
		}else {
			downloadPath = "../"+sbywbm.toLocaleLowerCase()+"/form/"+sbywbm.toLocaleLowerCase()+".xls";
		}
        var elemIF = document.createElement("iframe");
        elemIF.src = downloadPath;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    }catch(e){

    } 
    
}

var index = 201
function fileUpload2() {
	var $myModa1 = $(window.parent.document).find("#myModa1");
	index = index + 1
	// 添加遮罩层
	var boxbg = "<div class='winbox_bg'></div>";
	var $b = $(window.parent.document).find("body")
	$b.append(boxbg);
	var $winbox_bg = $(window.parent.document).find(".winbox_bg")
	$winbox_bg.last().css({
		"z-index" : index
	})
	$winbox_bg.animate({
		opacity : 0.3
	})
	$myModa1.css({
		"z-index" : index + 1,
		"position" : "absolute",
		"left" : "210px",
		"top" : "-100px"
	}).show().animate({
		top : "10%",
		opacity : "1"
	}, 300);
}
