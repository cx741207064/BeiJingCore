
if (!document.querySelectorAll) {
	document.querySelectorAll = function(selectors) {
		var style = document.createElement('style'), elements = [], element;
		document.documentElement.firstChild.appendChild(style);
		document._qsa = [];
		style.styleSheet.cssText = selectors
				+ '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
		window.scrollBy(0, 0);
		style.parentNode.removeChild(style);
		while (document._qsa.length) {
			element = document._qsa.shift();
			element.style.removeAttribute('x-qsa');
			elements.push(element);
		}
		document._qsa = null;
		return elements;
	};
}
if (!document.querySelector) {
	document.querySelector = function(selectors) {
		var elements = document.querySelectorAll(selectors);
		return (elements.length) ? elements[0] : null;
	};
}
var viewApp = angular.module("viewApp", []);
var ua = navigator.userAgent;
if (ua && ua.indexOf("MSIE 7") >= 0) {
	// Completely disable SCE to support IE7.
	viewApp.config(function($sceProvider) {
		//console.log("启动IE7兼容性支持：" + ua);
		$sceProvider.enabled(false);
	});
}

viewApp.controller('viewCtrl', function($rootScope, $scope, $http, $location) {
});

//绑定js
//var ngControllerName="angulajs_customersCtrl";//主绑定div的ctrl名称
//
//viewApp.controller(ngControllerName, function($scope, $http) {
//	
//});

viewApp.filter('to_trusted', [ '$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
} ]);

/**
 * 国地税类型代码转名称
 */
viewApp.filter('gdslxDm',function() {
					return function(gdslxDm) {
						if (gdslxDm == "1")
							return "<span class=\"fontcolor01\">国税</span>";
						if (gdslxDm == "2")
							return "<span class=\"fontcolor02\">地税</span>";
						else
							return "<span class=\"fontcolor01\">国</span><span class=\"fontcolor02\">地</span>";
					};
				});


/**
 * 根据核心返回pzxh 显示按钮
 */
viewApp.filter('pzxh',
		function() {
			return function(item) {
				if (item.pzxh == null || item.pzxh == "")
					//凭证序号为 为null 导出盘报类
					return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','3','"+item.gdslxDm+"')\">查看</button>";
				else
					//正常申报类
					if(item.showType == "0"){
						if(item.sbzfbz == "Y"){
							return "<button class=\"layui-btn layui-btn-sm\"  onclick=\"warmInfo('0');\" >查看</button>";
						}else{
							return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"')\" >查看</button>";
						}
					}else if(item.showType == "1"){
						if(item.sbzfbz == "Y"){
							return "<button class=\"layui-btn layui-btn-sm\"  onclick=\"warmInfo('1');\" >下载</button>";
						}else{
							return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
						}
					}else if(item.showType == "2"){
						if(item.sbzfbz == "Y"){
							return "<button style=\"margin:2px 1.5px;\" class=\"layui-btn layui-btn-sm\"  onclick=\"javaScript:warmInfo('0');\" >查看</button>" +
							"<button class=\"layui-btn layui-btn-sm\"  onclick=\"javaScript:warmInfo('1');\" >下载</button>";
						}else{
							return "<button style=\"margin:2px 1.5px;\" class=\"layui-btn layui-btn-sm\" onclick=\"javaScript:queryAndexport('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"')\" >查看</button>" +
							"<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
						}
					}else{
						if(item.sbzfbz == "Y"){
							return "<button class=\"layui-btn layui-btn-sm\" onclick=\"javaScript:warmInfo('1');\" >下载</button>";
						}else{
							return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cxDownloadPDF('"+item.pzxh+"','1','"+item.gdslxDm+"','"+item.id+"','"+item.ywbm+"')\" >下载</button>";
						}
					}
			};
		});

//id = 原ywrz jylsh
viewApp.filter('id',
		function() {
			return function(item) {
				if (item.id == null || item.id == "")
					// 其他按钮预留
					return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','2','"+item.gdslxDm+"')\">查看</button>";
				else
					return "<button class=\"layui-btn layui-btn-sm\" onclick=\"queryAndexport('"+item.id+"','2','"+item.gdslxDm+"')\" >查看</button>" ;
			};
		});

//cksbb查看申报表 1.0补打功能
viewApp.filter('cksbb',
		function() {
			return function(item) {
				return "<button class=\"layui-btn layui-btn-sm\" onclick=\"cksbb('"+item.gnId+"','"+item.bdDm+"','"+item.id+"','"+item.gdslxDm+"','"+item.sjgsrq+"','"+item.sjgsdq+"')\">查看</button>";
			};
		});
/**
 * 判断是否存在某个值
 */
String.prototype.endWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substring(this.length - s.length) == s)
		return true;
	else
		return false;
	return true;
}

var isFirstChangeiframeHight = true;//只改变一次ifrMain容器的高度
/**
 *页面加载提示
 */
window.onload=function(){
	//初始化日期控件
	//定义laydate全局基础参数
//	laydate.set({
//		min : "2000-01-01", // 设定最小日期为当前日期
//		max : '2099-12-31', // 最大日期
//		theme:'#1A56A9',
//		istime : false,
//		istoday : false
//	});
	//申报日期起
//	laydate.render({
//		elem : '#sbrqq',
//		format : 'yyyy-MM-dd'
//	});
	//申报日期止
//	laydate.render({
//		elem : '#sbrqz',
//		format : 'yyyy-MM-dd'
//	});
	
	//改用datepicker
//	$("#skssqq").on('click', function () {
//		new DatePicker({inputObj:this,dateFormatStyle:'yyyy-MM',beginDate:'2000-01-01',endDate:'2099-12-30',lang:1,type:'m'}).show();
//		//WdatePicker({dateFmt:'yyyyMM',maxDate:'%y-%M-%d 00:00:00',autoPickDate:true,onpicked:changvalue,isShowClear:false});
//	});
	
//	$("#skssqz").on('click', function () {
//		new DatePicker({inputObj:this,dateFormatStyle:'yyyy-MM',beginDate:'2000-01-01',endDate:'2099-12-30',lang:1,type:'m'}).show();
//	});
	/*//税款所属期起
	var start = laydate.render({
		elem : '#skssqq',
		type: 'month',
		done : function(value,date) {
			if(value!=""){
				end.config.min = {
	                year: date.year,
	                month: date.month - 1,
	                date: date.date,
	                hours: date.hours,
	                minutes: date.minutes,
	                seconds: date.seconds
				}; //开始日选好后，重置结束日的最小日期
			}
		}
	});
	//税款所属期止
	var end = laydate.render({
		elem : '#skssqz',
		type: 'month',
		done : function(value,date) {
			if(value!=""){
				start.config.max = {
	                year: date.year,
	                month: date.month - 1,
	                date: date.date,
	                hours: date.hours,
	                minutes: date.minutes,
	                seconds: date.seconds
	            }; //结束日选好后，重置开始日的最大日期
			}
		}
	});*/
	
	var nsr = jQuery.parseJSON(nsrJson);
	var error = nsr.error;
	if (null != error && "" != error) {
		dhtmlx.message(error, "info", 3000);
	}
	//控制国地标志的显示
	if("3" == gdbsms){
		$("#gdbztd1").show();
		$("#gdbztd2").show();
		$("#gdbz").find("option").eq(0).attr("selected","selected");
	}else if("1" == gdbsms){
		$("#gdbz").find("option").eq(1).attr("selected","selected");
	}else if("2" == gdbsms){
		$("#gdbz").find("option").eq(2).attr("selected","selected");
	}else{
		alertMsgs('国地部署模式参数错误', {icon: 5});
	}
}	

function warmInfo(type){
	if(type=="0"){
		alertMsgs('已作废的申报数据暂不支持查看PDF!', {icon: 5});
	}else if(type=="1"){
		alertMsgs('已作废的申报数据暂不支持下载PDF!', {icon: 5});
	}
}

/**
 *重置
 */
function resetBtn(){
	window.location.href='sbxxcx.do?ywbm='+ywbm;

}

/**下载凭证*/
function cxDownloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm){
	if(ywbm == "DKDJDSJCCSSB" && dyExYwbms.indexOf(ywbm)!=-1){
		//下载Excel
		downloadExcel(pzxh, version, gdslxDm, ysqxxid, ywbm);
	}else{
		//下载pdf
	    downloadPDF(pzxh, version, gdslxDm, ysqxxid, ywbm);
	}
}

var sid="dzswj.yhscx.sbzs.sbxxcx";//dzswj.yhscx.sbzs.sbxxcx--yhscx.SBZS.SBXXCX

function queryBtn() {
	//获取查询条件
	
	var gdbz = $("#gdbz").val();
	var sbny = "";
	
	var sbrqq = $("#sbrqq").val();
	var sbrqz = $("#sbrqz").val();
	var skssqq = $("#skssqq").val();
	var skssqz = $("#skssqz").val();
	
	// 校验申报日期
	var isok = jyCxtjfun(skssqq,skssqz,sbrqq,sbrqz);
	if (!isok) return;
	
	var top="auto"//默认自动
	try{
		if(window.top==window.self){
			//不存在父页面
		}else{
			top=window.parent.document.documentElement.scrollTop+200+"px";
		}
	}catch(e){}

	var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
	var sbxxcxurl  ="getSbxxcx.do?skssqq="+skssqq+"&skssqz="+skssqz+"&gdbz="+gdbz+"&sbny="+sbny+"&urlgdslxDm="+urlgdslxDm+"&sbrqq="+sbrqq+"&sbrqz="+sbrqz+"&ywbm="+ywbm;
	$.ajax({
		url:sbxxcxurl,
		type:"GET",
		data:{},
		dataType:"json",
		contentType:"application/json",
		success:function(data){
			//赋值
			var result = eval("(" + data + ")");
			//异常信息
			var errormsg = result.error;
			//根据配置的申报业务编码过滤申报信息
			var filterSbywbms = result.filterSbywbms;
			//申报信息
			var sbList = result.sbList;
			//过滤业务编码后申报信息
			var ywbmsbList = [];
			//过滤已作废后申报信息
			var ysbsbList = [];
			//过滤掉已作废数据,北京申报业务编码过滤申报信息
			if (sbList.length > 0) {
				// 过滤北京特色业务
				if (filterSbywbms != null && "" != filterSbywbms && "null" != filterSbywbms) {
					for (var i = 0; i < sbList.length; i++) {
						if (filterSbywbms.indexOf(sbList[i].ywbm) != -1) {
							ywbmsbList.push(sbList[i]);
						}
					}
					sbList = ywbmsbList;
				}

			}
			//过滤已作废
			if (sbList.length > 0) {
				for (var i = 0; i < sbList.length; i++) {
					if (sbList[i].sbzfbz != "Y") {
						ysbsbList.push(sbList[i]);
					}
				}
				sbList = ysbsbList;
			}
			//财报信息
			var cbList = result.cbList;
            //申报分页
			paging("dataList",sbList);
			//财报分页
			if(isZrrF == "true"){
				cbpaging("cbxxList",cbList);
			}
			//异常提示
			if(errormsg.length>0){
				alertMsgs(errormsg);
			}
			
			if (isFirstChangeiframeHight) {
				changeHeight("ifrMain");
				isFirstChangeJframeHight = false;
			}
		},
		error:function(){
			alertMsgs('链接超时或网络异常', {icon: 5});
		},
		complete:function(){
			layer.close(index);
		},
		timeout : 1000000000
	});
	
}



function bwxx(sid,cs){
	var bwcs="{\"taxML\":{\"head\":{\"gid\":\"311085A116185FEFE053C2000A0A5B63\"," +
		"\"sid\":\""+sid+"\"," +
			"\"tid\":\" \"," +
			"\"version\":\"\"}," +
	"\"body\":{"+cs+"}}}";
	return bwcs;
}

/**
 * 查询pdf、导出pdf
 * @param pzxh
 * @param czlxDm
 * @param gdslxDm
 */
function queryAndexport(pzxh, version,gdslxDm,ysqxxid) {
	// alert("查看PDF");
	//此方法可重写 根据地方实际情况获取PDF信息 此处默认查询产品归档信息  其中VERSION 1 表示PZXH = 依申请PZXH、 3 PZXH=表示依申请 ID、 2 表示  PZXH =原NSBB_YWRZ的JYLSH
	printPdf(pzxh, version,gdslxDm,ysqxxid);
}

/**
 * 
 * @param ysqxxid   依申请id
 * @param version   版本类型
 * @param gdslxDm   国地税类型代码
 * @param ywbm      业务编码
 */
function downPdf(ysqxxid,version,gdslxDm,ywbm){
	var downPdfurl="/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ysqxxid="+ysqxxid+"&viewOrDownload=download&gdslxDm="+gdslxDm+"&ywbm="+ywbm;
	window.open(downPdfurl);
}
/**
 * 查看申报表（1.0补打功能）
 */
function cksbb(gnId,bdDm,sblsh,gdslxDm,sjgsrq,sjgsdq){
	var bdurl="/sbzs-cjpt-web/nssb/sbbd/jump2EtaxSbbd.do?gnId="+gnId+"&gnDm="+bdDm+"&sblsh="+sblsh+"&gdslxDm="+gdslxDm+"&sjgsrq="+sjgsrq+"&sjgsdq="+sjgsdq;
	$.ajax({
		url:bdurl,
		type:"GET",
		data:{},
		dataType:"json",
		contentType:"application/json",
		success:function(data){
			window.open(data);
		},
		error:function(){
			alertMsgs('链接超时或网络异常', {icon: 5});
		}
	});
}


/**
 * 分页
 */
function paging(tableName, data) {
	cleanTable(tableName);
	var lineNumber = 1;
	var nums = "10"; //document.getElementById("pageSize").value; 
	$("#pageInfo").html("条/页，共" + data.length + "条信息");
	// 每页出现的数量
	var pages = Math.ceil(data.length / nums); // 得到总页数
	// 调用分页
	laypage({
		cont : 'page1',
		pages : pages,
		jump : function(obj, first) {
			cleanTable(tableName);
			cpsbxxpaging(tableName, data, obj.curr, nums);
		}
	});
}

//财报分页
function cbpaging(tableName, data) {
	cleanTable(tableName);
	var lineNumber = 1;
	var nums = "10"; //document.getElementById("cbpageSize").value;
	$("#cbpageInfo").html("条/页，共" + data.length + "条信息");
	// 每页出现的数量
	var pages = Math.ceil(data.length / nums); // 得到总页数
	// 调用分页
	laypage({
		cont : 'cbpage1',
		pages : pages,
		jump : function(obj, first) {
			cleanTable(tableName);
			cbxxpaging(tableName, data, obj.curr, nums);
		}
	});
}

function cbxxpaging(tableName, data, curr, nums) {
	var last = curr * nums - 1;
	last = last >= data.length ? (data.length - 1) : last;
	var pageData = [];
	for (var i = (curr * nums - nums); i <= last; i++) {
		pageData.push(data[i]);
	}
	// 排序
	pageData.sort(function(a,b) {
		return Date.parse(b.sbrq.replace(/-/g,"/"))-Date.parse(a.sbrq.replace(/-/g,"/"));
	});
	// 序号赋值
	var xh = (curr * nums - nums);
	for (var j = 0; j < pageData.length; j++) {
		pageData[j].index = xh;
		xh++;
	}
	var scope = angular.element($('#cbviewCtrlid')).scope();
	if(typeof(scope)=='undefined'){
		scope = angular.element($('#cbviewCtrlid')).scope($('#cbviewCtrlid'));
	}
	if(pageData==null || pageData==undefined || pageData.length<1){
		$("#cbxxNotTips").show();
	}else{
		$("#cbxxNotTips").hide();
	}
	// 调用$scope中的方法
	scope.cbxxitems = pageData;
	// 调用方法后，可以重新绑定，在页面同步（可选）
	scope.$apply();
}


/**
 * 清楚表数据
 * 
 * @param tableName
 */
function cleanTable(tableName) {
	$("#" + tableName + " tr:not(:first)").remove();
}

function cpsbxxpaging(tableName, data, curr, nums) {
	var last = curr * nums - 1;
	last = last >= data.length ? (data.length - 1) : last;
	var pageData = [];
	for (var i = (curr * nums - nums); i <= last; i++) {
		pageData.push(data[i]);
	}
	// 排序
	pageData.sort(function(a,b) {
		return Date.parse(b.sbrq.replace(/-/g,"/"))-Date.parse(a.sbrq.replace(/-/g,"/"));
	});
	// 序号赋值
	var xh = (curr * nums - nums);
	for (var j = 0; j < pageData.length; j++) {
		pageData[j].index = xh;
		xh++;
	}
	var scope = angular.element($('#viewCtrlid')).scope();
	if(typeof(scope)=='undefined'){
		scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
	}
	if(pageData==null || pageData==undefined || pageData.length<1){
		$("#sbxxNotTips").show()
	}else{
		$("#sbxxNotTips").hide()
	}
	// 调用$scope中的方法
	scope.sbxxcsmx = pageData;
	// 调用方法后，可以重新绑定，在页面同步（可选）
	scope.$apply();
}

//调整界面高度
function changeHeight(id) {
	try {
		//var height = document.body.scrollHeight;
		//固定高度
		// $("#" + id, window.parent.document).css({
		// 'height' : height
		// });
		$("#ifrMain", window.parent.document).css({'height' : 800});
	} catch (ex) {
	}
}

function jyCxtjfun(skssqq,skssqz,sbrqq,sbrqz){
	if(skssqq =="" && skssqz == "" && sbrqq == "" && sbrqz == ""){
		alertMsgs('申报日期起止、税款所属期起止，请至少选择一项！', {icon: 5});
		return false;
	}
	if(sbrqq !="" && sbrqz == ""){
		alertMsgs('申报日期止不能为空！', {icon: 5});
		return false;
	}
	if(sbrqz !="" && sbrqq == ""){
		alertMsgs('申报日期起不能为空！', {icon: 5});
		return false;
	}
	if(skssqq !="" && skssqz == ""){
		alertMsgs('税款所属期止不能为空！', {icon: 5});
		return false;
	}
	if(skssqz !="" && skssqq == ""){
		alertMsgs('税款所属期起不能为空！', {icon: 5});
		return false;
	}
	if(sbrqq > sbrqz){
		alertMsgs('申报日期止的时间不能小于申报日期起的时间！', {icon: 5});
		return false;
	}
	if(skssqq > skssqz){
		alertMsgs('税款所属期止的时间不能小于税款所属期起！', {icon: 5});
		return false;
	}
	return true;
}

/*
 * 提示
 */
function alertMsgs(msg){
	layui.use('layer', function(){
		var layer = layui.layer;
		var top="auto"//默认自动
		try{
			if(window.top==window.self){
				//不存在父页面
			}else{
				top=window.parent.document.documentElement.scrollTop+100+"px";
			}
		}catch(e){}	
		layer.open({
			type : 1,
			area : [ '300px' ], //固定宽高400px
			offset : top,
			title : [ '提示信息' ],
			scrollbar : false,
			content : msg,
			btn : ['关闭' ],
			btnAlign : 'r', //按钮居右
			yes : function() {
				layer.closeAll();
			}
		});
	}); 
}