
/**
 * 申报提交时框架校验成功后的业务特有校验
 * @param callBeforSubmitForm ：回调方法，调用表单提交前的业务特有提示
 * @param callSubmitForm ：回调方法，调用表单提交
 * @param params : 回调参数
 */
function doAfterVerify(callBeforSubmitForm,callSubmitForm, params) {
    var swjgDm = getSwjgDm(formData);
    var url = window.location.href;

    if(swjgDm.substring(0,3)==="137" && url.indexOf("bzz=csgj") > -1&& (!isJmsb())){
        var proMessage = "<div style=\"padding-left:20px;\">请确认是否提交申报？</div><br/>";
        parent.layer.confirm(proMessage,{
            icon : 3,
            title:'提示',
            btn : ['确认','取消'],
            btn2:function(index){
                parent.layer.close(index);
                $("body").unmask();
                prepareMakeFlag = true;
                return;
            }
        },function(index){
            parent.layer.close(index);
            // 执行回调函数
            callBeforSubmitForm(callSubmitForm,params);
        });
    }else{
        // 执行回调函数
        callBeforSubmitForm(callSubmitForm,params);
    }
}
/**
 * 一般纳税人增值税附征 应纳税额计算
 * @param a 主表第 34行1列
 * @param b  主表  34行 3列
 * @param c  附加税附表 税率
 */
function calculateYnse(a,b,i) {
    var a = a;//formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.zbGrid.zbGridlbVO[0].bqybtse;
    var b = b;//formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.zbGrid.zbGridlbVO[2].bqybtse;
    var c= formData.qcs.formContent.zzsfjssb.fjsxxGrid.fjsxxGridlb[i].sl1;
    return ROUND((a+b) * c,2);
}

/**
 * 一般纳税人增值税附征 减免性质代码
 * @param i
 * @returns {string}
 * 混运 "ygznsrzg":"22",
 * 非营改征 "ygznsrzg":"11",
 * 纯营改征  "ygznsrzg":"21", 其他
 *
 */
function jmdm(i,asysljsxse){
    
    var before = asysljsxse;  //低于10万过滤
    var ssqq = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqq;
    var ssqz = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqz;
  //计算月报还是季报，月报；月销售额合计10万及以下，季度销售额合计30万及以下，才免征两费。
    var iDays = DATE_GET_TIME_INTERVAL_DAYS(ssqq,ssqz); // 相差天数
    
    if((iDays<=31 && before>100000) || ((iDays<=93 && before>300000))){
        return '';
    }
    var ygznsrzg = formData.qcs.initData.zzsybnsrsbInitData.ygznsrzg;
    if(ygznsrzg=='22'||ygznsrzg=='11'||ygznsrzg=='21'||ygznsrzg =='30'||ygznsrzg=='31'||ygznsrzg=='32'){
        if(formData.qcs.formContent.zzsfjssb.fjsxxGrid.fjsxxGridlb[i].zsxmDm == '30203' || formData.qcs.formContent.zzsfjssb.fjsxxGrid.fjsxxGridlb[i].zsxmDm == '30216'){
            return '0061042802';
        }
        return'';
    }else{
        return'';
    }
}
/**
 * 一般纳税人增值税附征 减免税额
 * @param i
 * @returns {string}
 * bf: 主表销售额合计（第1+5+7+8（第1+5+7+8栏
 * jsyj: 计税依据
 * sl:" 税率
 *
 */
function getJmse(bf,jsyj,sl,jmdm1,i){
    var before = bf;
    var jsyj = jsyj;
    var sl = sl;
    var ssqq = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqq;
    var ssqz = formData.zzsybsbSbbdxxVO.zzssyyybnsr_zb.sbbhead.skssqz;
    //计算月报还是季报，月报；月销售额合计10万及以下，季度销售额合计30万及以下，才免征两费。
    var iDays = DATE_GET_TIME_INTERVAL_DAYS(ssqq,ssqz); // 相差天数
    
    if((iDays<=31 && before>100000) || ((iDays<=93 && before>300000))){
        return 0;
    }else {
        if(jmdm1==''||jmdm1==null||jmdm1==undefined){
            return 0;
        }
        return jsyj*sl;
    }
}

/**
 * 从汇总纳税企业增值税分配表 获取附加税计税依据
 * 取值前提，分配表存在。
 */
function getFjsjsyjFromFpb(){
    if(formData.zzsybsbSbbdxxVO.zzssyyybnsr_hznsqyzzsfpb){
        var hznsqyzzsfpbForm = formData.zzsybsbSbbdxxVO.zzssyyybnsr_hznsqyzzsfpb.hznsqyzzsfpbForm;
        return ROUND(hznsqyzzsfpbForm.zjgybhwjlwfpse
            +hznsqyzzsfpbForm.zjgybhwjlwjzjtfpse
            +hznsqyzzsfpbForm.zjgysfwfpse
            +hznsqyzzsfpbForm.zjgysfwjzjtfpse,2);
    }else{
        return 0;
    }
}

/**
 * 设置cookie
 * */
var cookie = {
	    set:function(key,val,time,tbrq){//设置cookie方法
	    	tbrq = parseDate(tbrq);//填报日期为当前时间，因为js的new Date()为电脑的时间
	        var date=new Date(tbrq); //获取当前时间
	        var expiresDays=time;  //将date设置为n天以后的时间
	        date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
	        document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
	    },
	    get:function(key){//获取cookie方法
	        /*获取cookie参数*/
	        var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
	        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
	        var tips;  //声明变量tips
	        for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
	            var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
	            if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
	                tips=arr[1];   //将cookie的值赋给变量tips
	                break;   //终止for循环遍历
	            }
	        }
	        return tips;
	    },
	    delete:function(key){ //删除cookie方法
	    	var date = new Date(); //获取当前时间
	    	date.setTime(date.getTime()-10000); //将date设置为过去的时间
	    	document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
        }
	}

/**
 * 提示加计抵减信息，2019年4月1日之前不提示
 * SWZJ.HXZG.SB.ZZSYBRSBSQJKJHQQCSJ接口，
 * <sbZzsybnsrqtxxVO>下<jjdjBz>加计抵减标识不等于Y时，提示
 * */
function YBNSRZZS_tsJjdjxx(jjdjBz){

    //静默申报直接返回，不校验
    if(isJmsb()){
        return ;
    }

	//2019年4月1日之前
	var sssqQ = formData.qcs.initData.zzsybnsrsbInitData.sssq.rqQ;
	if(DATE_CHECK_TIME(sssqQ, '2019-04-01')){
		return ;
	}
	if("Y"==jjdjBz){
		return ;
	}
	//获取cookie是否有设置过不再提示,key=djxh_sbywbm_bztsJjdjxx（不再提示加计抵减信息）_所属期的年度
	var djxh = formData.qcs.initData.nsrjbxx.djxh;
	var tbrq = formData.qcs.initData.nsrjbxx.tbrq;
	var sssqQ = formData.qcs.initData.zzsybnsrsbInitData.sssq.rqQ;
	var ssqnd = "";
	if(sssqQ!=null && sssqQ.length>4){
		ssqnd = sssqQ.substring(0,4);
		
	}
	var key = djxh + "_YBNSRZZS_bztsJjdjxx_" + ssqnd ;
	var value = cookie.get(key);
	if("Y"==value){
		//如果设置了不再提示，则不提示
		return ;
	}
	var content = '<br/><div class="win-center">'
		+ '<div class="layui-text">'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按照政策规定，自2019年4月1日至2021年12月31日，对生产、生活性服务业纳税人，可以适用加计抵减政策。生产、生活性服务业纳税人，是指提供邮政服务、电信服务、现代服务、生活服务（以下称四项服务）取得的销售额占全部销售额的比重超过50%的纳税人。四项服务的具体范围按照《销售服务、无形资产、不动产注释》（财税〔2016〕36号印发）执行。如果您符合上述政策规定，可以通过填写《适用加计抵减政策的声明》，来确认适用加计抵减政策。'
		+ '</div>'
		+ '<br/><br/>'
		+ '<div class="win-btn" style="text-align:right;">'
		+ '<input type="checkbox" name="noTtipsCheck" id="noTtipsCheck" value="not" lay-skin="primary" title="不再提示">&nbsp;不再提示&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		+ '<a class="layui-btn" id="jjdjTxsb">填写声明</a>'
		+ '<a class="layui-btn layui-btn-primary" id="closeTsjjdjxx">关闭</a>'
		+ '</div>'
		+ '</div>';
	
	var tsJjdjxx = layer.open({
		type : 1,
		area : [ '500px', '320px' ],
		title : "",
		closeBtn: false,
		content : content
	});
	//填写申明回到函数
	$("#jjdjTxsb").click(function() {
		var mainUrl = window.location.protocol + '//' + window.location.host;
		//将当前URL加密后传过去，因为需要从那边跳转回来
		var currUrl = parent.window.location.href;
		currUrl = Base64.encode(currUrl);
		var url = mainUrl + "/sxsq-cjpt-web/biz/sxsq/syjjdjzzdsm?gdslxDm=1&swsxDm=SXA031022001&sburl="+currUrl;
		//如果有配置了URL，则使用配置的
		var jjdjzcsmUrl = formData.qcs.initData.zzsybnsrsbInitData.jjdjzcsmUrl;
		if(jjdjzcsmUrl!=null && jjdjzcsmUrl!=undefined && jjdjzcsmUrl!=""){
			url = jjdjzcsmUrl;
		}
		parent.window.location.href = url;
	});
	
	// 关闭按钮回调函数
	$("#closeTsjjdjxx").click(function() {
		//如果勾选了不再提示，则设置到cookie中
		var isCheck = $("#noTtipsCheck").prop('checked');
		if(isCheck){
			cookie.set(key,"Y",366,tbrq);
		}
		layer.close(tsJjdjxx);
	});
}

/**
 * 北京个性化提示加计抵减信息，需要覆盖上面的提示，公式ID需要使用同一个06100101010110109
 * 2019年4月1日之后所有人都提示
 * */
function YBNSRZZS_bjgxh_tsJjdjxx(jjdjBz){
	//2019年4月1日之前
	var sssqQ = formData.qcs.initData.zzsybnsrsbInitData.sssq.rqQ;
	if(DATE_CHECK_TIME(sssqQ, '2019-04-01')){
		return ;
	}
	var content = '<br/><div class="win-center">'
		+ '<div class="layui-text">'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据《财政部 税务总局 海关总署关于深化增值税改革有关政策的公告》等相关文件，现对2019年增值税改革有关事项提示如下：<br/>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一、增值税一般纳税人（以下称纳税人）发生增值税应税销售行为或者进口货物，原适用16%税率的，税率调整为13%；原适用10%税率的，税率调整为9%。<br/>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二、自2019年4月1日起，《营业税改征增值税试点有关事项的规定》（财税〔2016〕36号印发）第一条第（四）项第1点、第二条第（一）项第1点停止执行，纳税人取得不动产或者不动产在建工程的进项税额不再分2年抵扣。此前按照上述规定尚未抵扣完毕的待抵扣进项税额，可自2019年4月税款所属期起从销项税额中抵扣。<br/>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三、纳税人购进国内旅客运输服务，其进项税额允许从销项税额中抵扣。<br/>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;四、自2019年4月1日至2021年12月31日，允许生产、生活性服务业纳税人按照当期可抵扣进项税额加计10%，抵减应纳税额。<br/>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;五、自2019年4月1日起，试行增值税期末留抵税额退税制度。<br/>'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">详细内容请登录国家税务总局北京市税务局官网或关注“北京税务”微信公众号查看。</span>'
		+ '</div>'
		+ '<br/><br/>'
		+ '<div class="win-btn" style="text-align:right;">'
		+ '<a class="layui-btn layui-btn-primary" id="yydTsjjdjxx">已阅读</a>'
		+ '</div>'
		+ '</div>';
	
	var bjgxh_tsJjdjxx = layer.open({
		type : 1,
		area : [ '700px', '450px' ],
		title : "",
		closeBtn: false,
		content : content
	});
	// 关闭按钮回调函数
	$("#yydTsjjdjxx").click(function() {
		layer.close(bjgxh_tsJjdjxx);
		//已阅读之后出现全国版的提示
		YBNSRZZS_tsJjdjxx(jjdjBz);
	});
}

/**
 * 2019年4月1日之前不用提示
 * SWZJ.HXZG.SB.ZZSYBRSBSQJKJHQQCSJ接口，
 * <sbZzsybnsrqtxxVO>下<jjdjBz>加计抵减标识不等于Y时，并且需要填写附表4的数据事提示
 * */
function YBNSRZZS_fb4_tsJjdjxx(fb4JjdjTsBz){
	if("Y"!=fb4JjdjTsBz){
		return ;
	}
	var jjdjBz = formData.qcs.initData.zzsybnsrsbInitData.jjdjBz;
	if("Y"==jjdjBz){
		return ;
	}
	//2019年4月1日之前
	var sssqQ = formData.qcs.initData.zzsybnsrsbInitData.sssq.rqQ;
	if(DATE_CHECK_TIME(sssqQ, '2019-04-01')){
		return ;
	}
	var content = '<div class="win-center">'
		+ '<div class="layui-text">'
		+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果符合加计抵减政策条件，请先提交《适用加计抵减政策的声明》。'
		+ '</div>'
		+ '<br/><br/>'
		+ '<div class="win-btn" style="text-align:right;">'
		+ '<a class="layui-btn" id="fb4JjdjTxsb">填写声明</a>'
		+ '<a class="layui-btn layui-btn-primary" id="fb4CloseTsjjdjxx">关闭</a>'
		+ '</div>'
		+ '</div>';
	
	var fb4tsJjdjxx = layer.open({
		type : 1,
		area : [ '320px', '230px' ],
		title : "提示",
		content : content
	});
	//填写申明回到函数
	$("#fb4JjdjTxsb").click(function() {
		var mainUrl = window.location.protocol + '//' + window.location.host;
		//将当前URL加密后传过去，因为需要从那边跳转回来
		var currUrl = parent.window.location.href;
		currUrl = Base64.encode(currUrl);
		var url = mainUrl + "/sxsq-cjpt-web/biz/sxsq/syjjdjzzdsm?gdslxDm=1&swsxDm=SXA031022001&sburl="+currUrl;
		//如果有配置了URL，则使用配置的
		var jjdjzcsmUrl = formData.qcs.initData.zzsybnsrsbInitData.jjdjzcsmUrl;
		if(jjdjzcsmUrl!=null && jjdjzcsmUrl!=undefined && jjdjzcsmUrl!=""){
			url = jjdjzcsmUrl;
		}
		//先暂存数据,暂存时增加校验的逻辑
		//
	    try{
	        var child = document.getElementById("frmSheet").contentWindow;
	        if(typeof(child.isTempSave) === 'function'){
	            if(!child.isTempSave()){
	                return;
	            }
	        }
	    }catch(e){

	    }
	    if(checkDIffDjxh()){//djxh不一致，不进行保存
	        return;
	    }


	    var _guideParam=$("#_query_string_").val().replace(/\"/g,'').replace(/,/g,';').replace(/:/g,'-');//增加guideParam作为组合主键来确认是否生产一条新的依申请记录

	    var d = {};
	    d['_query_string_'] = $("#_query_string_").val();
	    d['gdslxDm'] = $("#gdslxDm").val();
	    d['ysqxxid'] = $("#ysqxxid").val();
	    d['djxh'] = formData.qcs.initData.nsrjbxx.djxh;
	    d['nsrsbh'] = formData.qcs.initData.nsrjbxx.nsrsbh;
	    d['secondLoadTag'] = $("#secondLoadTag").val();
	    d['_bizReq_path_'] = _bizReq_path_;
	    d['_guideParam'] = _guideParam;
	    d['formData'] = encodeURIComponent(JSON.stringify(formData));
	    $.ajax({
	        type : "POST",
	        url : "xTempSave?",
	        dataType : "json",
	        //contentType : "text/json",
	        data : d,
	        success : function(data) {
	            if ('Y' == data.returnFlag) {
	            	parent.window.location.href = url;
	            }else{
	            	var b=layer.confirm("尊敬的纳税人：暂存填写数据失败，继续填写申明会导致填写的数据被删掉，是否继续填写？您还可以手动暂存已填写的数据！",{
	        			area: ["320","230"],
	        			title:"确认",
	        			btn : ["是","否"],
	        			btn2:function(index){
	        				parent.layer.close(b);
	        				layer.close(fb4tsJjdjxx);
	        			}
	        		},function(index){
	        			parent.window.location.href = url;
	        		});
	            } 
	           
	        },
	        error : function() {
	        	var b=layer.confirm("尊敬的纳税人：暂存填写数据失败，继续填写申明会导致填写的数据被删掉，是否继续填写？您还可以手动暂存已填写的数据！",{
        			area: ["320","230"],
        			title:"确认",
        			btn : ["是","否"],
        			btn2:function(index){
        				parent.layer.close(b);
        				layer.close(fb4tsJjdjxx);
        			}
        		},function(index){
        			parent.window.location.href = url;
        		});
	        }
	    });
	});
	
	// 关闭按钮回调函数
	$("#fb4CloseTsjjdjxx").click(function() {
		layer.close(fb4tsJjdjxx);
	});
}

/**
 * 附表2：6行农产品收购发票或者销售发票自定义公式，只有在初始化的时候执行
 * @param type fs、je、se（份数、金额、税额）
 * */
function YBNSRZZS_fb2_ncpsgfphzxsfpse(se_zjjd,je){
	//本身的值，更正申报初始化时取本身的值
	var value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].se;
	var se_cshjsCs = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].se_cshjsCs;
	var gzsbBz = formData.qcs.initData.zzsybnsrsbInitData.gzsbBz;
	if("1"==gzsbBz && se_cshjsCs<1){
		value = ROUND(value,2);
		formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].se_cshjsCs = se_cshjsCs + 1;
		return value;
	}
	//2019年4月1日之前,使用旧版的公式:当《农产品核定扣除增值税进项税额计算表（汇总表）》存在时，《附表二》第6栏[税额]自动带出《农产品核定扣除增值税进项税额计算表（汇总表）》[当期允许抵扣农产品增值税进项税额合计数],
	//2019-04之后使用新版的公式：“税额”列=本栏次“金额”列×9%
	var sssqQ = formData.qcs.initData.zzsybnsrsbInitData.sssq.rqQ;
	if(DATE_CHECK_TIME(sssqQ, '2019-04-01')){
		//2019年4月1日之前
		value = se_zjjd;
	}else{
		//2019年4月1日之后
		value = je*0.09;
	}
	value = ROUND(value,2);
	return value;
}

/**
 * 附表2：25行期初已认证相符但未申报抵扣自定义公式，只有在初始化的时候执行
 * @param type fs、je、se（份数、金额、税额）
 * */
function YBNSRZZS_fb2_qcyrdxfdwsbdk(type){
	var value = 0.00;
	//本身的值，更正申报初始化时取本身的值
	var currValue = 0.00;
	if("fs"==type){
		value = formData.qcs.initData.zzsybnsrsbInitData.sqqmyrzxfDwsbdkfs;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].fs;
	}else if("je"==type){
		value = formData.qcs.initData.zzsybnsrsbInitData.sqqmyrzxfDwsbdkje;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].je
	}else if("se"==type){
		value = formData.qcs.initData.zzsybnsrsbInitData.sqqmyrzxfDwsbdkse;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].se;
	}
	var gzsbBz = formData.qcs.initData.zzsybnsrsbInitData.gzsbBz;
	if("1"==gzsbBz){
		if("fs"==type){
			currValue = ROUND(currValue,0);
		}else{
			currValue = ROUND(currValue,2);
		}
		return currValue;
	}
	if("fs"==type){
		value = ROUND(value,0);
	}else{
		value = ROUND(value,2);
	}
	return value;
}

/**
 * 附表2：27行期末已认证相符但未申报抵扣自定义公式
 * @param type fs、je、se（份数、金额、税额）
 * @param 第2个参数是为了触发相关公式
 * */
function YBNSRZZS_fb2_qmyrdxfdwsbdk(type){
	var value = 0.00;
	//本身的值
	var currValue = 0.00;
	if("fs"==type){
		value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].fs + formData.qcs.initData.zzsybnsrsbInitData.qmyrzxfDwsbdkfsBqFp;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].fs;
	}else if("je"==type){
		value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].je + formData.qcs.initData.zzsybnsrsbInitData.qmyrzxfDwsbdkjeBqFp;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].je
	}else if("se"==type){
		value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].se + formData.qcs.initData.zzsybnsrsbInitData.qmyrzxfDwsbdkseBqFp;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].se;
	}
	var gzsbBz = formData.qcs.initData.zzsybnsrsbInitData.gzsbBz;
	//获取27行初始化计算的次数，初始化只会执行3次，更正初始化时，取本身的值
	var chsjsCs = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].cshjsCs;
	if("1"==gzsbBz && chsjsCs<3){
		if("fs"==type){
			currValue = ROUND(currValue,0);
		}else{
			currValue = ROUND(currValue,2);
		}
		formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].cshjsCs = chsjsCs + 1;
		return currValue;
	}
	if("fs"==type){
		value = ROUND(value,0);
	}else{
		value = ROUND(value,2);
	}
	return value;
}

/**
 * 附表2广东个性化：27行期末已认证相符但未申报抵扣自定义公式
 * 第27栏取值改为第27栏等于第25栏-第3栏+第26栏
 * @param type fs、je、se（份数、金额、税额）
 * @param 第2个参数是为了触发相关公式
 * */
function YBNSRZZS_gdgxh_fb2_qmyrdxfdwsbdk(type){
	var value = 0.00;
	//本身的值
	var currValue = 0.00;
	if("fs"==type){
		value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].fs-formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[2].fs+formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[25].fs;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].fs;
	}else if("je"==type){
		value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].je-formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[2].je+formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[25].je;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].je
	}else if("se"==type){
		value = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[24].se-formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[2].se+formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[25].se;
		currValue = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].se;
	}
	var gzsbBz = formData.qcs.initData.zzsybnsrsbInitData.gzsbBz;
	//获取27行初始化计算的次数，初始化只会执行3次，更正初始化时，取本身的值
	var chsjsCs = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].cshjsCs;
	if("1"==gzsbBz && chsjsCs<3){
		if("fs"==type){
			currValue = ROUND(currValue,0);
		}else{
			currValue = ROUND(currValue,2);
		}
		formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[26].cshjsCs = chsjsCs + 1;
		return currValue;
	}
	if("fs"==type){
		value = ROUND(value,0);
	}else{
		value = ROUND(value,2);
	}
	return value;
}

/**
 * 判断是否是离线更正申报
 * */
function YBNSRZZS_sfLxgzsb(){
	var lxgzFlg = false;
	if (location.href.indexOf('gzsb=lx') != -1 || location.href.indexOf('gzsb=Y') != -1) {
		lxgzFlg = true;
	}
	return lxgzFlg;
}

/**
 * 校验本期发生额额度，根据核心的参数配置和采集的人数做限制
 * */
function YNBSRZZS_jyBqfse(hmc,swsxDm,bqfse){
	var flag = true;
	if(hmc==null || hmc==undefined || hmc==""){
		return flag;
	}
	if(swsxDm==null || swsxDm==undefined || swsxDm==""){
		return flag;
	}
	//参数值格式：GTTYSB:14400,GTZDRY:14400,QYTYSB:7800,QYZDRY:7800
	var jzlxCsz = formData.qcs.initData.zzsybnsrsbInitData.jzlxCsz;
	if(jzlxCsz==null || jzlxCsz==undefined || jzlxCsz==""){
		return flag;
	}
	var qytysbcj = formData.qcs.initData.zzsybnsrsbInitData.qytysbcj;
	var qyzdrq = formData.qcs.initData.zzsybnsrsbInitData.qyzdrq;
	var qytysbcjrs = formData.qcs.initData.zzsybnsrsbInitData.qytysbcjrs;
	var qyzdrqcjrs = formData.qcs.initData.zzsybnsrsbInitData.qyzdrqcjrs;
	var cszJson = {};
	var cszArr = jzlxCsz.split(",");
	if(cszArr!=null && cszArr.length>0){
		for(var i=0;i<cszArr.length;i++){
			var cszValue = cszArr[i];
			var ed = null;
			if(cszValue.indexOf(":")>1){
				ed = cszValue.split(":")[1];
			}
			if(ed==null || ed==undefined || ed==""){
				continue ;
			}
			if(cszValue.indexOf("GTTYSB:")>-1){
				cszJson.gttysbEd = Number(ed);
			}else if(cszValue.indexOf("GTZDRY")>-1){
				cszJson.gtzdryEd = Number(ed);
			}else if(cszValue.indexOf("QYTYSB")>-1){
				cszJson.qytysbEd = Number(ed);
			}else if(cszValue.indexOf("QYZDRY")>-1){
				cszJson.qyzdryEd = Number(ed);
			}
		}
	}
	//根据条件判断额度
	var bqfseed = 0;
	if(hmc=="0001011814" && swsxDm=="SXA031900832"){
		//企业退役士兵取QYTYSB数值,额度等于企业退役士兵采集人数乘以配置的金额
		if("Y"!=qytysbcj || qytysbcjrs<=0){
			//企业退役士兵没有采集信息，不做校验，因为有校验不能选择该减免
			return true;
		}
		var qytysbEd = cszJson.qytysbEd;
		if(qytysbEd!=null && qytysbEd!=undefined && qytysbEd!=""){
			bqfseed = ROUND(qytysbcjrs*qytysbEd,2);
		}else{
			//没有取到配置，不做校验
			return true;
		}
		
	}else if(hmc=="0001011813" && swsxDm=="SXA031900831"){
		//个体退役士兵取GTTYSB数值,额度等于配置的金额
		var gttysbEd = cszJson.gttysbEd;
		if(gttysbEd!=null && gttysbEd!=undefined && gttysbEd!=""){
			bqfseed = ROUND(gttysbEd,2);
		}else{
			//没有取到配置，不做校验
			return true;
		}
		
	}else if((hmc=="0001013613" && swsxDm=="SXA031901022") || (hmc=="0001013612" && swsxDm=="SXA031901039")){
		//企业重点群体人员采集取QYZDRY数值,额度等于企业重点群体人员采集人数乘以配置的金额
		if("Y"!=qyzdrq || qyzdrqcjrs<=0){
			//企业重点群体人员没有采集信息，不做校验，因为有校验不能选择该减免
			return true;
		}
		var qyzdryEd = cszJson.qyzdryEd;
		if(qyzdryEd!=null && qyzdryEd!=undefined && qyzdryEd!=""){
			bqfseed = ROUND(qyzdrqcjrs*qyzdryEd,2);
		}else{
			//没有取到配置，不做校验
			return true;
		}
		
	}else if((hmc=="0001013610" && swsxDm=="SXA031901038") || (hmc=="0001013611" && swsxDm=="SXA031901021")){
		//个体重点群体人员采集取GTZDRY数值,额度等于配置的金额
		var gtzdryEd = cszJson.gtzdryEd;
		if(gtzdryEd!=null && gtzdryEd!=undefined && gtzdryEd!=""){
			bqfseed = ROUND(gtzdryEd,2);
		}else{
			//没有取到配置，不做校验
			return true;
		}
	}
	bqfse = ROUND(bqfse,2);
	if(bqfse>bqfseed){
		//本期发生额，不能大于本期发生额的额度
		flag = false;
	}
	return flag;
}

function prepareMakeYBR(isSecondCall) {

    //2019年4月1日之前
    var sj_201904yq=formData.qcs.initData.zzsybnsrsbInitData.sj_201904yq;

    if (sj_201904yq=="Y") {
        prepareMake(isSecondCall);
    } else {
        var jxselj = formData.qcs.initData.zzsybnsrsbInitData.jxselj;
        var yjtelj =formData.qcs.initData.zzsybnsrsbInitData.yjtelj;
        var se11 = formData.zzsybsbSbbdxxVO.zzssyyybnsr02_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[11].se;
        var bqfse7 = formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[7].bqfse;
        var bqzce7 = formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[7].bqzce;
        var jjdjBz = formData.qcs.initData.zzsybnsrsbInitData.jjdjBz;
        var msg = "您已提交生产、生活性服务业纳税人加计抵减声明，如您确认适用该政策，请填写附表四加计抵减情况相关行次。";
        if ("Y" == jjdjBz && bqfse7 + bqzce7 == 0 && (se11 > 0  || (jxselj > 0 && yjtelj == 0))) {
            parent.layer.confirm(msg, {
                title: '提示',
                btn: ['继续申报', '取消']
            }, function (index) {
                parent.layer.close(index);
                prepareMake(isSecondCall);
            }, function (index) {
                parent.layer.close(index);
            });
        } else {
            prepareMake(isSecondCall);
        }
    }

}
//根据药品名称匹配上期累计销售额   ypmc 药品名称   ywmc  业务名称（HJB：罕见病    KAY：抗癌药）
function getljxsewithypmc(ypmc,ywmc) {
	var ljxse = 0.00;
	if(ywmc=="")
	{
		return ljxse;
	}
    if(ypmc=="")
    {
        return ljxse;
    }
	//根据药品名称匹配上期累计销售额
    if(ywmc=="HJB")
    {
    	if(formData.qcs.hjbzzszczxqktjbsqsj!=null)
    	{
    		if(formData.qcs.hjbzzszczxqktjbsqsj.mxVoList!=null && formData.qcs.hjbzzszczxqktjbsqsj.mxVoList.length>0)
    		{
    			for(var i = 0; i<formData.qcs.hjbzzszczxqktjbsqsj.mxVoList.length;i++)
    			{
    				//匹配药品名称
    				if(formData.qcs.hjbzzszczxqktjbsqsj.mxVoList[i].hjbypmc==ypmc)
    				{
    					//匹配上期累计
                        ljxse=formData.qcs.hjbzzszczxqktjbsqsj.mxVoList[i].hjbypdxselj;
					}
				}
			}
		}
	}else if(ywmc=="KAY")
    {
        if(formData.qcs.kayzzszczxqktjbsqsj!=null)
        {
            if(formData.qcs.kayzzszczxqktjbsqsj.mxVoList!=null && formData.qcs.kayzzszczxqktjbsqsj.mxVoList.length>0)
            {
                for(var i = 0; i<formData.qcs.kayzzszczxqktjbsqsj.mxVoList.length;i++)
                {
                    //匹配药品名称
                    if(formData.qcs.kayzzszczxqktjbsqsj.mxVoList[i].kaymc==ypmc)
                    {
                        //匹配上期累计
                        ljxse=formData.qcs.kayzzszczxqktjbsqsj.mxVoList[i].kaydxse2019;
                    }
                }
            }
        }
    }
    return ljxse;

}
/*
 * 大连个性化 增值税减免税申报明细表减税项目根据期初数报文自动带出
 */
function ybnsrzzs_getJsxmValue(){
    var zzsjmssbmxbjsxmGridlbVO = formData.zzsybsbSbbdxxVO.zzsjmssbmxb.zzsjmssbmxbjsxmGrid.zzsjmssbmxbjsxmGridlbVO;
    var sbZzsjmssbmxbjsxmqcsxxGrid = formData.qcs.initData.zzsybnsrsbInitData.sbZzsjmssbmxbjsxmqcsxxGrid;
    if(sbZzsjmssbmxbjsxmqcsxxGrid!=null && sbZzsjmssbmxbjsxmqcsxxGrid!=undefined
        && sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb!=null
        && sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb!=undefined
        && sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb.length>0){
        var sbZzsjmssbmxbjsxmqcsxxGridlb = sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb;
        // 动态增行
        var ewbhxh = JSON.parse(JSON.stringify(zzsjmssbmxbjsxmGridlbVO[0])).ewbhxh;
        for(var j=1;j<sbZzsjmssbmxbjsxmqcsxxGridlb.length-1;j++){
            var obj = JSON.parse(JSON.stringify(zzsjmssbmxbjsxmGridlbVO[0]));
            ewbhxh = ewbhxh + 1;
            obj.ewbhxh = ewbhxh;
            zzsjmssbmxbjsxmGridlbVO.push(obj);
        }
        // 动态赋值
        for(var i=0;i<sbZzsjmssbmxbjsxmqcsxxGridlb.length;i++){
            if(sbZzsjmssbmxbjsxmqcsxxGridlb[i].ewbhxh>=2){
                zzsjmssbmxbjsxmGridlbVO[i-1].hmc = sbZzsjmssbmxbjsxmqcsxxGridlb[i].hmc;
                zzsjmssbmxbjsxmGridlbVO[i-1].swsxDm = sbZzsjmssbmxbjsxmqcsxxGridlb[i].swsxDm;
                zzsjmssbmxbjsxmGridlbVO[i-1].hmc1 = "JS_"+sbZzsjmssbmxbjsxmqcsxxGridlb[i].hmc+"_"+sbZzsjmssbmxbjsxmqcsxxGridlb[i].swsxDm;
                zzsjmssbmxbjsxmGridlbVO[i-1].qcye = sbZzsjmssbmxbjsxmqcsxxGridlb[i].qmye;
            }
        }
    }
}

/*
 * 大连个性化 增值税减免税申报明细表减税项目锁定校验
 */
function ybnsrzzs_checkJsxmValue(hmc,swsxDm,qcye){
    var sbZzsjmssbmxbjsxmqcsxxGrid = formData.qcs.initData.zzsybnsrsbInitData.sbZzsjmssbmxbjsxmqcsxxGrid;
    if(sbZzsjmssbmxbjsxmqcsxxGrid!=null && sbZzsjmssbmxbjsxmqcsxxGrid!=undefined
        && sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb!=null
        && sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb!=undefined
        && sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb.length>0){
        var sbZzsjmssbmxbjsxmqcsxxGridlb = sbZzsjmssbmxbjsxmqcsxxGrid.sbZzsjmssbmxbjsxmqcsxxGridlb;
        for(var i=0;i<sbZzsjmssbmxbjsxmqcsxxGridlb.length;i++){
            if(sbZzsjmssbmxbjsxmqcsxxGridlb[i].ewbhxh>=2){
                var hmc_temp = sbZzsjmssbmxbjsxmqcsxxGridlb[i].hmc;
                var swsxDm_temp = sbZzsjmssbmxbjsxmqcsxxGridlb[i].swsxDm;
                if(hmc == hmc_temp && swsxDm == swsxDm_temp){
                    return true;
                }
            }
        }
    }
    return false;
}

//北京个性化 附表四加计抵减将已填写的数据清0
function YBR_FB4_jjdjts() {

    var jjdjBz = formData.qcs.initData.zzsybnsrsbInitData.jjdjBz;
    if("Y"!=jjdjBz){

        formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].bqfse = 0.00;
        var _jpath = "zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].bqfse";
        formulaEngine.apply(_jpath,0.00);

        formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[6].bqfse = 0.00;
        _jpath = "zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[6].bqfse";
        formulaEngine.apply(_jpath,0.00);

        formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].bqzce = 0.00;
        _jpath = "zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[5].bqzce";
        formulaEngine.apply(_jpath,0.00);

        formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[6].bqzce = 0.00;
        _jpath = "zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[6].bqzce";
        formulaEngine.apply(_jpath,0.00);

        formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[7].bqfse =0.00;
        _jpath = "zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[7].bqfse";
        formulaEngine.apply(_jpath,0.00);

        formData.zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[7].bqzce = 0.00;
        _jpath = "zzsybsbSbbdxxVO.zzssyyybnsr04_bqjxsemxb.bqjxsemxbGrid.bqjxsemxbGridlbVO[7].bqzce";
        formulaEngine.apply(_jpath,0.00);
    }
}