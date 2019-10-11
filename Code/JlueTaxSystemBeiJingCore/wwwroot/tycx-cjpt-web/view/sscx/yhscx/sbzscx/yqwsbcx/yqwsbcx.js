//初始化layui插件
var form,laydate,layer;


	layui.use(['form','laydate','layer'], function(){

	form = layui.form;
	laydate = layui.laydate;
	layer = layui.layer;
	
	//初始化查询日期起
	laydate.render({
		elem: '#cxrqq'
		,ready: function(){
	        taxlaydate()
	    },change: function(){
	      taxlaydate()
	  }

	});
	//初始化查询日期止
	laydate.render({
		elem: '#cxrqz'
		,ready: function(){
	        taxlaydate()
	    },change: function(){
	      taxlaydate()
	  }

	});
	//初始税款所属期起
	laydate.render({
		elem: '#skssqq'
		//,type: 'month'
			,ready: function(){
		        taxlaydate()
		    },change: function(){
		      taxlaydate()
		  }
	});
	//初始化税款所属期止
	laydate.render({
		elem: '#skssqz'
		//,type: 'month'
			,ready: function(){
		        taxlaydate()
		    },change: function(){
		      taxlaydate()
		  }
	});
	
	form.on('checkbox(checkNum)', function(event){
		checkNum(event)
		form.render();
	});
});

	



/**
 * 查询未申报信息
 */
var sids=["dzswj.yhscx.sbzs.yqwsbcx"];
function customBeforeQuery(){
	
	//税款所属期起不为空时必须为某月1日;税款所属期止不为空时必须为某月最后一日
	var cxrqq=$("#cxrqq").val();
	var cxrqz=$("#cxrqz").val();
	var endD = cxrqz.replace(cxrqz.substring(0,4),(parseInt(cxrqz.substring(0,4))-1).toString());
	if(cxrqq<endD){
		tycxEngine.tycxLayerAlert("查询日期起止间隔不能大于一年");
		return false;
	}
	if(!cxrqq && !cxrqz){
		tycxEngine.tycxLayerAlert("查询日期起止不能为空！");
		return false;	
	}
	
	if(cxrqq==""||cxrqz==""){
		tycxEngine.tycxLayerAlert("查询日期起止不能为空");
		return false;
	}
	if(cxrqq > cxrqz){
		tycxEngine.tycxLayerAlert("查询日期起不能大于查询日期止");
		return false;
	}

	return true;
	
}
function customListDataProcess(bodyData){
	var data = bodyData.taxML.yqwsbxxList.yqwsbxx;
	return data;
}
//自定义加载数据--由于有些页面展示不跟普通查询页面一致，所以要这样自定义
/*function customerLoadData(bodyData,$scope){
	$scope.yqwsbDataitems = bodyData;//angular js 数据绑定
}
*/


var errorMsg = {"dzswj.yhscx.sbzs.yqwsbcx":"查询逾期未申报信息失败",
        "dzswj.yhscx.sbzs.yqwsbcx.1":"查询国税逾期未申报信息失败",
        "dzswj.yhscx.sbzs.yqwsbcx.2":"查询地税逾期未申报信息失败"};

function customErrorMsg(sid,gdslxDm,gdsbz){
	//单边查询
	if("1" == gdslxDm || "2" == gdslxDm){
		return errorMsg[sid];
	}else{
	//联合办税
	return errorMsg[sid + "." + gdsbz];
	}
}
