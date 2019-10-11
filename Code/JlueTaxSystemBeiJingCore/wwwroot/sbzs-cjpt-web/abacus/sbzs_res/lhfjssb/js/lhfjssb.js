/**
 * 减免优惠提示
 * 当享受的时候，fjsnsrxxForm下的bqsfsyxgmyhzc节点传Y，且sbxxGridlbVO各明细行的sbxxGridlbVO也要传Y； 
 * 当不享受的时候，fjsnsrxxForm下的bqsfsyxgmyhzc节点传N即可，明细行不用传此节点。 
 * Add by C.Q 20190131 23:35
 * 水利建设不享受普惠减免
 */
function bqsfsyxgmyhzcToSbxxGridlbVO(bqsfsyxgmyhzc){
	var sbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	for (var i = 0; i < sbxxGridlbVO.length; i++) {
		if (bqsfsyxgmyhzc == 'Y' && sbxxGridlbVO[i].zsxmDm !='30221') {
			sbxxGridlbVO[i].bqsfsyxgmyhzc = 'Y';
		} else {
            sbxxGridlbVO[i].bqsfsyxgmyhzc = '';
            sbxxGridlbVO[i].phjmse = 0;
            sbxxGridlbVO[i].phjmxzDm = '';
            sbxxGridlbVO[i].phjzbl = 0;
            sbxxGridlbVO[i].phjmswsxDm = '';
            sbxxGridlbVO[i].phjmxzMc = '';
		}
	}
	return sbxxGridlbVO[0].bqsfsyxgmyhzc;
}

/**
 * 当一般纳税人 点击“是否适用增值税小规模纳税人减征优惠”选择是时，弹出提示框提示：“增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？”
 * 点击按钮“是” 关闭提示框 ，并默认选中是；点“否” 则选中否。
 * Add by C.Q 20190131 23:35
 */
function jmyhTips(bqsfsyxgmyhzc,sfzzsxgmjz,qzjyXgmFlag){
	//默认提示语
	var tips="增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？";
	var width = "230px";
	var height= "210px";
	var qdBtn = "是";
	var qxBtn = "否";
	var titleTips = "提示";
	var btn1Callback = function(index){
		layer.close(b);
	};
	var btn2Callback = function(index){
		//点击取消自动选为否。
		formData.fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc = "N";
		//重新执行相关公式
		var _jpath = "fjsSbbdxxVO.fjssbb.fjsnsrxxForm.bqsfsyxgmyhzc";
		formulaEngine.apply(_jpath,"N");
		// 去子页面刷新视图，子页面需要引入var subViewCustomScripts = ["/sbzs_res/fjssb/js/fjssb_cus.js"];
		$("#frmSheet")[0].contentWindow.refreshView();
		layer.close(b);
		/*viewEngine.formApply($('#viewCtrlId'));
		viewEngine.tipsForVerify(document.body);*/
	};
	//广东、陕西个性化提示语
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	if((swjgDm !=null && swjgDm != "") && (swjgDm.substring(0,3)=="144" || swjgDm.substring(0,3)=="161")){
		tips = "<h1 align='center'>温馨提示</h1><br/>"
			+ "尊敬的纳税人：<br/>"
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据系统校验结果，本次税款所属期内，您属于“增值税一般纳税人”。"
			+ "根据《财政部 税务总局关于实施小微企业普惠性税收减免政策的通知》（财税〔2019〕13号）第三条的规定，"
			+ "增值税一般纳税人<strong>不属于</strong>资源税、城市维护建设税、房产税、城镇土地使用税、印花税（不含证券交易印花税）、"
			+ "耕地占用税和教育费附加、地方教育附加享受减征50%的范围。<br/>"
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请再次核对您本次所属期内是否属于“增值税小规模纳税人”，若您继续选择“增值税小规模纳税人”身份申报，事后确认您属于“增值税一般纳税人”，可能出现以下情形：<br/>"
			+ "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、需补缴因错误享受减征少缴的税费；</strong><br/>"
			+ "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、需缴纳因逾期缴纳税费产生的滞纳金；</strong><br/>"
			+ "<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、影响您的纳税信用等级评定。</strong><br/>"
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如有疑问，您可联系主管税务机关进行确认。<br/>"
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感谢您对我们工作的理解和支持！";
		//广东的取消按钮要和全国版的对调
		qdBtn = "取消（不需享受减免）";
		qxBtn = "确定（仍要享受减免）";
		width = "700px";
		height = "430px";
		titleTips = "";
		var tmpCallback = btn1Callback;
		btn1Callback = btn2Callback;
		btn2Callback = tmpCallback;
	}
	
	if (bqsfsyxgmyhzc=='Y' && sfzzsxgmjz=='N' && qzjyXgmFlag=='N') {
		//当纳税人是本期非增值税小规模纳税人
		//var tips="增值税一般纳税人不适用增值税小规模纳税人减征政策，是否确定要申报减征优惠？";
		/*viewEngine.formApply($('#viewCtrlId'));
		viewEngine.tipsForVerify(document.body);*/
		var b=layer.confirm(tips,{
			area: [width,height],
			title:titleTips,
			closeBtn: false,
			btn : [qdBtn,qxBtn],
			btn1:btn1Callback,
			btn2:btn2Callback
		});
	}
	//返回true不提示，提示改由上面弹框处理
	return true;
}

//公式调用该方法获取tempJmxzDm,初始化教育费附加30203，地方教育费附加30216减免性质
function cshjmxz(skssqq,skssqz) {
    //GDSDZSWJ-10700 广东、青海个性化，不需要自动带出
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="163" || swjgDm.substring(0,3)=="152")){
		return;
	}
	var qsSbxxGridlbVO = formData.qcs.formContent.fjssbb.body.sbxxGrid.sbxxGridlbVO;
	var tjSbxxGridlbVO = formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO;
	
	for(var i=0;i<qsSbxxGridlbVO.length;i++){
		if(qsSbxxGridlbVO[i].zsxmDm=="30203" || qsSbxxGridlbVO[i].zsxmDm=="30216"){
			//计算hj值 等同于06100120010100018公式
			qsSbxxGridlbVO[i].hj = qsSbxxGridlbVO[i].ybzzs+qsSbxxGridlbVO[i].zzsmdse+qsSbxxGridlbVO[i].xfs+qsSbxxGridlbVO[i].yys;
            if(qsSbxxGridlbVO[i].hj ==0 || qsSbxxGridlbVO[i].xssr == 0){
            	continue;	
            }

            var xxsr = qsSbxxGridlbVO[i].xssr;

          //福建、陕西个性化-SW2017112-2031 广东也要加此功能（GDSDZSWJ-11657）
            if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="135" || swjgDm.substring(0,3)=="161" || swjgDm.substring(0,3)=="144")){
                if (qsSbxxGridlbVO[i].zspmDm == '302030300') {
                    for (var j = 0; j < qsSbxxGridlbVO.length; j++) {
                        if (qsSbxxGridlbVO[j].zspmDm == '302030100') {
                            xxsr = qsSbxxGridlbVO[j].xssr;
                            break;
                        }
                    }
                }

                if (qsSbxxGridlbVO[i].zspmDm == '302160300') {
                    for (var j = 0; j < qsSbxxGridlbVO.length; j++) {
                        if (qsSbxxGridlbVO[j].zspmDm == '302160100') {
                            xxsr = qsSbxxGridlbVO[j].xssr;
                            break;
                        }
                    }
                }
            }

            if(((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xxsr<=100000 && xxsr>0) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xxsr<=300000 && xxsr>0)){
                var jmxzList = formData.qcs.formContent.fjssbb.body.sbxxGrid.jmxxlist.option;
				for(var j=0;j<jmxzList.length;j++){
					if(jmxzList[j].pc == qsSbxxGridlbVO[i].zspmDm && jmxzList[j].dm=="0061042802" && jmxzList[j].swsxDm=="SXA031900783"){
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = j + "";
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmzlxDm = "02";
						formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm = "0061042802";
					}
				}
				//地方教育附加选不到0061042802，暂时设置其他（四川个性化，由于其他没选项时也会出现这情况，故先统一默认为其他）。liji，20190505
				if (!formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm) {
					for(var j=0; j<jmxzList.length; j++){
						if(jmxzList[j].pc == qsSbxxGridlbVO[i].zspmDm && jmxzList[j].dm=="0099129999"){
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].tempJmxzDm = j + "";
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmzlxDm = "02";
							formData.fjsSbbdxxVO.fjssbb.sbxxGrid.sbxxGridlbVO[i].jmxzDm = "0099129999";
						}
					}
				}
			}
		}
	}
}

function jyqzdjmxz(skssqq, skssqz,xssr,jmxzKey) {
	if(jmxzKey=="0061042802_SXA031900783" &&(((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xssr>100000) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xssr>300000))){
		return false;
	}
	return true;
}

/**
 * 计算销售额不满10万（月度）、30万（季度）
 */
function jsxxsr(skssqq, skssqz,xssr) {
	//GDSDZSWJ-10700 广东、青海个性化 不需要锁定
	var swjgDm = formData.qcs.initData.nsrjbxx.zgswjDm;
	if(swjgDm !=null && swjgDm != "" && (swjgDm.substring(0,3)=="163" || swjgDm.substring(0,3)=="152")){
		return false;
	}
	if(xssr ==0 ||((skssqz.substring(5,7)-skssqq.substring(5,7))==0 && xssr>100000) || ((skssqz.substring(5,7)-skssqq.substring(5,7))==2 && xssr>300000)){
		return false;
	}
	return true;
}


/**
 * 校验是否是企业重点群体人员
 */
function jysfqyzdqtry(jmxzDm,jmxzKey, qyzdrq){
	if((jmxzKey != null && jmxzKey != "") && "0007013612_0007013613_0061013610_0061013611_0099013603_0099013604".search(jmxzKey.split("_")[0]) !=-1){
		return qyzdrq=='Y';
	}
	return true;
}


//当前是否是代理代理申报，若不是，清空代理人信息
function dqsfdlsb(sfdlsb){
	if(sfdlsb=="N"){
		var fjsslxxForm = formData.fjsSbbdxxVO.fjssbb.fjsslxxForm;
		fjsslxxForm.dlr="";
		fjsslxxForm.dlrsfzjzlDm1="";
		fjsslxxForm.dlrsfzh="";
	}
}

function jsxxsr_sx(skssqq, skssqz,xssr,ssjmxzdm) { 
	if(ssjmxzdm!="0061042802"){ 
		return false; 
	}	
	return true; 
}

/**
 * 控制减免性质是否锁定
 */
function controllerJmxz(swjgDm,zsxmDm,skssqq,skssqz,xssr) {
	var xssrIfBoom = jsxxsr(skssqq,skssqz,xssr); // 销售收入月度是否大于10w、季度大于30w 大于——false，小于——true
	if (swjgDm == '151') { // 四川不需要锁定
		return false;
	} else {
		if (zsxmDm == '30203'||zsxmDm == '30216') {
			if (xssrIfBoom) {
				return false; // 时间原因，暂时先全部都放开不锁定
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}