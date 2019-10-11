function verifyInit11() {
    //更正申报取消校验
    var gzbz = formData.kz.temp.gzsbbz;
    if (gzbz == "Y") {
        return false;
    }
    //cwbbsb 用于判断本期的财务报表是否已报送
    var cwbbsbInfo = formData.fq.cwbbsb;
    if (cwbbsbInfo == '') {
        return;
    }
    var qhjtbz = formData.fq.qhjtbz;
    var tipsLevel = cwbbsbInfo.split('_')[1];
    var cwbbsb = cwbbsbInfo.split('_')[0];
    var sbqylx = formData.hq.sbQysdsczzsyjdsbqtxxVO.sbqylx;
    if (cwbbsb == "N" && qhjtbz == "Y") {
        if (tipsLevel == 'Y') {
            parent.layer.alert("该纳税人未报送本属期的财务会计报表，请先进行财务报表报送！");
            parent.$("#save").hide();
            return;
        }

        return true;

    }
    return false;
}

//Ajax查询财务报表报送状态
function queryCwbbBszt() {
    //这里调用tygzServlet 来获取
    var requrl = "/tycx-cjpt-web/cxpt/query.do";
    //post请求，组装参数
    var skssqq = formData.fq.sssq.sqQ;
    var skssqz = formData.fq.sssq.sqZ;
    var param = '%7B%22taxML%22:%7B%22head%22:%7B%22gid%22:%22311085A116185FEFE053C2000A0A5B63%22,%22sid%22:%22dzswj.sbzs.qcs.cwbbbscx%22,%22tid%22:%22+%22,%22version%22:%22%22%7D,%22body%22:%7B%22skssqq%22:%22' + skssqq + '%22,%22skssqz%22:%22' + skssqz + '%22%7D%7D%7D';
    var cwbbbz = "N";
    $.ajax({
        type: "post",
        async: false,
        url: requrl + "?bw=" + param + "&gdslxDm=1",
        data: {},
        datatype: "text",
        success: function (data) {
            var d = JSON.parse(data);
            cwbbbz = d.taxML.body.cwbbsbbz;
        },
        error: function (xhr) {
            //请求发生错误，默认未报送，可刷新浏览器再次触发请求。
            cwbbbz = "N";
        }
    });
    if (cwbbbz == "N") {
        return true;
    } else {
        return false;
    }
}

//获取上一年小薇企业标志,skin: 'layui-layer-molv'
function getSnxwqy() {
    var a = false;
    a = verifyInit11();
    //判断是否逾期申报页面
    var yqsbbz = parent.parent.yqsbbz;
    if (a) {
        if (yqsbbz != "Y") {
            var aa = layer.msg('您尚未报送本属期的财务会计报表，请先进行财务报表报送！20s后本页面将自动关闭，谢谢合作！', {time: 20000});

            setInterval(function () {
                layer.close(aa);
                window.top.opener = null;
                window.top.open('', '_self', '');
                window.top.close();
            }, 20000)
        }

    }
    var snd = ((formData.fq.sssq.sqQ).split("-")[0]) - 1;
    var synsfysbnb = formData.kz.temp.zb.synsfysbnb;//上一年是否已申报年报

	// 上年 A年报数据
	var cyrs = formData.fq.syndNbxx.cyrs;
	var ynssde = formData.fq.syndNbxx.ynssde;
	var zcze = formData.fq.syndNbxx.zcze;
	var csgjfxzhjzhy = formData.fq.syndNbxx.csgjfxzhjzhy;
	var hyDm = formData.fq.syndNbxx.hyDm == ''
			|| formData.fq.syndNbxx.hyDm == undefined ? formData.fq.nsrjbxx.hyDm
			: formData.fq.syndNbxx.hyDm;

	// 上一年 第四季度 或12月的小薇
	var syndsjdh12ysfsxw = formData.fq.syndsjdh12ysfsxw.sfxxwlqy;

	// 上年 B年报数据

	var ynssde_b = formData.fq.synqysdsbNdxx.acbfy_ynssde != 0 ? formData.fq.synqysdsbNdxx.acbfy_ynssde
			: formData.fq.synqysdsbNdxx.asrze_ynssbe;
	var gjxzhjzhy = formData.fq.synqysdsbNdxx.gjxzhjzhy;
	var qycyrs_qnpjrs = formData.fq.synqysdsbNdxx.qycyrs_qnpjrs;
	var zcze_qnpjrs = formData.fq.synqysdsbNdxx.zcze_qnpjrs;

	// 上年 B表 第四季度 或12月的小薇

	var synqysdsbYjdxx = formData.fq.synqysdsbYjdxx.sfxxwlqy;

	if (synsfysbnb == "Y") { // 存在年报A数据的时候根据年报数据判断小薇

		var xw = sfxwqy_ND(csgjfxzhjzhy, hyDm, cyrs, zcze, ynssde, snd);

		var xwbz = xw ? "Y" : "N";
		return xwbz;

	} else if (syndsjdh12ysfsxw != "" && syndsjdh12ysfsxw != undefined) {// 上一年
		// 第四季度
		// 或12月的小薇

		return syndsjdh12ysfsxw;

	} else if (qycyrs_qnpjrs != 0 && qycyrs_qnpjrs != undefined) {// 以上都不存在的时候
		// 说明他上一年是核定
		// 今年转查账，
		// 根据上年核定申报的数据判断

		var xw_b = sfxwqy_ND(gjxzhjzhy, hyDm, qycyrs_qnpjrs, zcze_qnpjrs,
				ynssde_b, snd);
		var xwb = xw_b ? "Y" : "N";
		return xwb;

	} else {
		return synqysdsbYjdxx != undefined ? synqysdsbYjdxx : "";

	}

}

/**
 * 判断上一年是否是小威
 * 
 * @param csgjfxzhjzhy
 * @param sshyDm
 * @param cyrs
 * @param zcze
 * @param ynssde
 * @param nd
 * @returns {Boolean}
 */

function sfxwqy_ND(csgjfxzhjzhy, sshyDm, cyrs, zcze, ynssde, nd) {
	var isXwqy = false;

	// 年度小薇起征点
	var qzd;

	if (nd < 2018) {

		qzd = 500000;
	} else {

		qzd = formData.kz.temp.zb.xwqzdje;
	}

	if (csgjfxzhjzhy == null || csgjfxzhjzhy == "" || "N" != csgjfxzhjzhy) {
		// 不满足第105项为“否”的企业的条件，返回0，
		return isXwqy;
	}

	if (ynssde > qzd) {
		// 不满足A100000《中华人民共和国企业所得税年度纳税申报表（A类）》第23行应纳税所得额<=50万元且>0的条件，返回0
		return isXwqy;
	}
	if (sshyDm == null || sshyDm == "") {
		return isXwqy;
	}
	if (cyrs == null || cyrs == "" || cyrs <= 0) {
		return isXwqy;
	}
	if (zcze == null || zcze == "" || zcze < 0) {
		return isXwqy;
	}

	if (!isNaN(sshyDm)) {
		// 行业代码还有A、B、C等字母，但是属于父类，应该不可选，但是还是判断是否为数字的
		var hyDmInt = sshyDm.substring(0, 2);
		if (hyDmInt >= 6 && hyDmInt <= 46) {
			// 因为最大的数值为4690，所以可以直接判断<=46
			// 第102项“行业明细代码”属于“工业企业”的
			if (cyrs <= 100 && zcze <= 3000) {
				isXwqy = true;
			}
		} else {
			// 第102项“行业明细代码”不属于“工业企业”的
			if (cyrs <= 80 && zcze <= 1000) {
				isXwqy = true;
			}
		}
	} else {
		// 第102项“行业明细代码”不属于“工业企业”的
		if (cyrs <= 80 && zcze <= 1000) {
			isXwqy = true;
		}

	}
	return isXwqy;
}

/**
 * 当A200000第11行-本表第1+2+…+28行<=0时，本行数据清空
 * 
 * @param value
 */
function cal_qysds_a_18yjd_A201030_29Row(value, jmzlxDm, jzfd) {
	if (value <= 0) {
		formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.jzmzlx = "";
		formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.jzfd = 0;
	} else {
		if (!isNull(jmzlxDm) && jmzlxDm == '2') {
			return ROUND(ROUND((value * 0.4) * 100, 2) / 100, 2);
		} else if (!isNull(jmzlxDm) && jmzlxDm == '1') {
			return ROUND(
					ROUND(
							(ROUND(ROUND((value * 0.4) * 100, 2) / 100, 2) * jzfd) * 100,
							2) / 100, 2);
		}
	}
	return 0;
}

function cal_qysds_a_18yjd_A201030_1Row(xxwlqy, sjlreLj) {
	var skssqz = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var fhtjdxxwlqyjmqysdsLj = formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj;
	var je = formData.kz.temp.zb.xwqzdje;
	var sfqdxw300w = formData.kz.temp.zb.sfqdxw300w; // 是否启动小微标准扩围为300万
	var yhsl=0.15;// 小薇优惠的折算率
	var sskcs=0;
	if(sfqdxw300w=="Y"){
		yhsl=sjlreLj<=1000000?0.2:0.15;
		sskcs=sjlreLj<=1000000?0:50000;
	}

	if (xxwlqy == 'Y' &&( sjlreLj > 0.03||(sfqdxw300w=="Y"&&sjlreLj>0)) && sjlreLj <= je) {
		return ROUND(ROUND((sjlreLj * yhsl+sskcs) * 100, 2) / 100, 2);
	}
	return 0;
}

function vaild_qysds_a_18yjd_A201030_1Row(fhtjdxxwlqyjmqysdsLj, xxwlqy,
		sjlreLj, bz) {
	var skssqz = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var fhtjdxxLj = formData.ht.qysdsczzsyjdSbbdxxVO.A201030Ywbd.jmsdsyhMxbForm.fhtjdxxwlqyjmqysdsLj;
	var je = formData.kz.temp.zb.xwqzdje;
	var sfqdxw300w = formData.kz.temp.zb.sfqdxw300w; // 是否启动小微标准扩围为300万
	var yhsl=0.15;// 小薇优惠的折算率
	var sskcs=0;
	if(sfqdxw300w=="Y"){
		yhsl=sjlreLj<=1000000?0.2:0.15;
		sskcs=sjlreLj<=1000000?0:50000;
	}
	if (xxwlqy == 'Y' && sjlreLj > 0.03 && sjlreLj <= je) {
		if (bz == 'vaild1') {
			return fhtjdxxwlqyjmqysdsLj == ROUND(ROUND((sjlreLj * yhsl+sskcs) * 100,
					2) / 100, 2)
					|| fhtjdxxwlqyjmqysdsLj == 0;
		} else if (bz == 'vaild2') {
			var t_hj1_28 = formData.kz.temp.fb3.t_hj1_28;
			return fhtjdxxwlqyjmqysdsLj != 0 || t_hj1_28 != 0;
		}
	}
	if (bz == 'vaild1') {
		return true;
	} else if (bz == 'vaild2') {
		return true;
	}
}

function vaild_qysds_a_18yjd_A201030_2_28Row() {
	var sum = 0;
	for (var i = 0; i < arguments.length; i++) {
		if (arguments[i] != 0) {
			sum++;
		}
	}
	if (sum >= 2) {
		return false;
	} else {
		return true;
	}
}

// 初始化本期小薇判断
function getXwinit() {
	var sbqylx = formData.hq.sbQysdsczzsyjdsbqtxxVO.sbqylx;
	var tsnsrlxDm = formData.hq.sbQysdsczzsyjdsbqtxxVO.tsnsrlxDm
	var kdqsszyDm = formData.fq.kdqsszyDm;
	var zfjglxDm = formData.fq.zfjglxDm;
	var sjlreLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjlreLj;
	var synsfsxwqy = formData.kz.temp.zb.synsfsxwqy;// 上一年是否是小薇
	var swjgDm = formData.fq.nsrjbxx.swjgDm;
	var gsdq = (swjgDm).substring(0, 5);
	var dq = (swjgDm).substring(1, 3);
	var qzd = formData.kz.temp.zb.xwqzdje;
	var sfqdxw300w = formData.kz.temp.zb.sfqdxw300w; // 是否启动小微标准扩围为300万
	 var skssqq= formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	 var skssqz= formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	 var yf_q=parseInt((skssqq).split("-")[1], 10);
	 var yf_z=parseInt((skssqz).split("-")[1], 10);

    var zfjglxDm_nsrxx = formData.fq.zfjglxDm_nsrxx;//纳税人信息扩展表中的总分机构类型
    var xsd2_39 = formData.kz.temp.zb.xsd2_39;//是否是xsd2.39版本

	// 分支机构是小薇默认N ; 应纳大于100万默认N
	 if(sfqdxw300w!="Y"){
			if (sjlreLj > qzd || sbqylx == "2" || tsnsrlxDm == "05"
				|| tsnsrlxDm == "06" || tsnsrlxDm == "10" || kdqsszyDm == "0"
				|| (zfjglxDm == "2" && kdqsszyDm == "1")) {
			
			return 'N';
		}
		}

    //19年以后： 启动小微标准扩围为300万 后
    if (sfqdxw300w == 'Y') {
        var qccyrs = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.qccyrs;
        var qmcyrs = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.qmcyrs;
        var qczcze = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.qczcze;
        var qmzcze = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.qmzcze;
        var gjxzhjzhy = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.gjxzhjzhy;
        var yjfs = formData.hq.sbQysdsczzsyjdsbqtxxVO.yjfs;
        var ybtsdseLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.ybtsdseLj;
        var sjyyjsdseLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjyyjsdseLj;
        var cyrsPjsLjs = formData.hq.sbQysdsczzsyjdsbqtxxVO.cyrsPjsLjs;
        var zczePjsLjs = formData.hq.sbQysdsczzsyjdsbqtxxVO.zczePjsLjs;
        var ysbJds = formData.hq.sbQysdsczzsyjdsbqtxxVO.ysbJds;

        cyrsPjsLjs = isNull(cyrsPjsLjs) ? 0 : cyrsPjsLjs;
        zczePjsLjs = isNull(zczePjsLjs) ? 0 : zczePjsLjs;
        ysbJds = isNull(ysbJds) ? 0 : ysbJds;


        var bdpjrs = ROUND((qccyrs + qmcyrs) / 2, 2);
        var bdpjzcze = ROUND((qczcze + qmzcze) / 2, 2);


        var pjrs = ROUND((cyrsPjsLjs + bdpjrs) / (ysbJds + 1), 2);
        var pjzcze = ROUND((zczePjsLjs + bdpjzcze) / (ysbJds + 1), 2);

        //19版本  当纳税人属于跨地区经营汇总纳税企业的分支机构 的小薇默认空
        if (sbqylx == "2") {
            return "";
        }

        // 19版本 申报期止不是季末时 小薇默认空
        if (yf_z != 3 && yf_z != 6 && yf_z != 9 && yf_z != 12) {
            return "";
        }
        if((zfjglxDm_nsrxx=="2"||zfjglxDm_nsrxx=="3")&&xsd2_39==="Y"&&tsnsrlxDm != "05"&&tsnsrlxDm != "06" &&tsnsrlxDm != "10"){
            return "N";
        }

        if (yjfs == "3" && (sbqylx == "0" || sbqylx == "1")) {
            var  se=ROUND(sjyyjsdseLj+ybtsdseLj,2);
            if(pjrs<=300&&pjzcze<=5000&&gjxzhjzhy=="N"&&se<=250000){
                return "Y";
            }else{
                return "N";
            }

        }


        if (pjrs <= 300 && pjzcze <= 5000 && gjxzhjzhy == "N" && sjlreLj <= qzd) {
            return "Y";
        }
        return "N";
    }


    // 19年以前 ：当 应纳小于100万 且 上一年为N 或上一年没信息（新开企业）时 返回空纳税人手动填写
    if (synsfsxwqy == 'N' || synsfsxwqy == '') {

		// 大连/青海个性化
		if (gsdq == "12102" || dq == "63") {

			return "Y";

		} else {

			return '';
		}

	}

	return 'Y';

}

// 触发性本期小薇判断

function getBqxwqy(sjlreLj,qccyrs,qmcyrs,qczcze,qmzcze,gjxzhjzhy,ybtsdseLj) {

	var sjlreLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjlreLj;
	var synsfsxwqy = formData.kz.temp.zb.synsfsxwqy;
	var sfsyxxwlqy = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sfsyxxwlqy;
	var sbqylx = formData.hq.sbQysdsczzsyjdsbqtxxVO.sbqylx;
	var qzd = formData.kz.temp.zb.xwqzdje;
	var tsnsrlxDm = formData.hq.sbQysdsczzsyjdsbqtxxVO.tsnsrlxDm
	var kdqsszyDm = formData.fq.kdqsszyDm;
	var zfjglxDm = formData.fq.zfjglxDm;
	var sfqdxw300w = formData.kz.temp.zb.sfqdxw300w; // 是否启动小微标准扩围为300万
	 var skssqq= formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqq;
	 var skssqz= formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	 var yf_q=parseInt((skssqq).split("-")[1], 10);
	 var yf_z=parseInt((skssqz).split("-")[1], 10);
	if(ybtsdseLj==null||ybtsdseLj==undefined){
		 ybtsdseLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.ybtsdseLj
	}
	var sjyyjsdseLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjyyjsdseLj;

    var zfjglxDm_nsrxx = formData.fq.zfjglxDm_nsrxx;//纳税人信息扩展表中的总分机构类型
    var xsd2_39 = formData.kz.temp.zb.xsd2_39;//是否是xsd2.39版本

	//特殊纳税人的只有就版本用到新版本不用判断
	if(sfqdxw300w!="Y"){
		if (sjlreLj > qzd || sbqylx == "2" || tsnsrlxDm == "05"
			|| tsnsrlxDm == "06" || tsnsrlxDm == "10" || kdqsszyDm == "0"
			|| (zfjglxDm == "2" && kdqsszyDm == "1")) {
		
		return 'N';
	}
	}
	

	
	//19年以后： 启动小微标准扩围为300万 后
	if(sfqdxw300w=='Y'){
		
		var yjfs= formData.hq.sbQysdsczzsyjdsbqtxxVO.yjfs;
		var cyrsPjsLjs= formData.hq.sbQysdsczzsyjdsbqtxxVO.cyrsPjsLjs;
		var zczePjsLjs= formData.hq.sbQysdsczzsyjdsbqtxxVO.zczePjsLjs;
		var ysbJds= formData.hq.sbQysdsczzsyjdsbqtxxVO.ysbJds;
		
		cyrsPjsLjs=isNull(cyrsPjsLjs)?0:cyrsPjsLjs;
		zczePjsLjs=isNull(zczePjsLjs)?0:zczePjsLjs;
		ysbJds=isNull(ysbJds)?0:ysbJds;
		
		
		var bdpjrs=ROUND((qccyrs+qmcyrs)/2,2);
		var bdpjzcze=ROUND((qczcze+qmzcze)/2,2);
		
		
		var pjrs=ROUND((cyrsPjsLjs+bdpjrs)/(ysbJds+1),2);
		var pjzcze=ROUND((zczePjsLjs+bdpjzcze)/(ysbJds+1),2);
		
		   //19版本  当纳税人属于跨地区经营汇总纳税企业的分支机构 的小薇默认空
		   if(sbqylx == "2"){
			    return "";
		    }
			// 19版本 申报期止不是季末时 小薇默认N
			 if(yf_z!=3&&yf_z!=6&&yf_z!=9&&yf_z!=12){
				 return "";
			 }
			if((zfjglxDm_nsrxx=="2"||zfjglxDm_nsrxx=="3")&&xsd2_39==="Y"&&tsnsrlxDm != "05"&&tsnsrlxDm != "06" &&tsnsrlxDm != "10"){
				return "N";
			}
		
			 if(yjfs=="3"&&(sbqylx=="0"||sbqylx=="1")){
				 //如果暑期起的月份 等于暑期止的月份 说明是按月申报
				 var  se=ROUND(sjyyjsdseLj+ybtsdseLj,2);
				 if(pjrs<=300&&pjzcze<=5000&&gjxzhjzhy=="N"&&se<=250000){
					 return "Y";
				 }else{
					 return "N";
				 }
				 
				 
			 }
			 
			 
		if(pjrs<=300&&pjzcze<=5000&&gjxzhjzhy=="N"&&sjlreLj<=qzd){
			return "Y";
		}
		return "N";
	}
	
	
	//19年以前
	if (synsfsxwqy == "Y" && sbqylx != "2") {
		return "Y"
	}

	return sfsyxxwlqy;

}

// 获取分配比例
function getfpbl(fzjgsrze, fzjggzze, fzjgzcze, fzjgnsrsbh, t_fzjgsrzeHj,
		t_fzjggzzeHj, t_fzjgzczeHj,ynsdse) {

	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var nsrsbh = formData.fq.nsrjbxx.nsrsbh;
	var fdlbmfpblHj = 0; // 记录非独立生产经营部门的分配比例之和
	var sfczdlbm = false; // 判断是否存在独立部门
	var dlbmID = 0; // 用于记录独立部门的下标
	var blhj = 0; // 用于记录除最后一行外的比例合计
	var srzebl = 0;
	var gzzebl = 0;
	var zczebl = 0;
	var fpbl = 0;
	var defaultVal=ROUND(0,16);
	var zjgftbz=false;//总机构是否参与分摊标志
	var zgfIndex=0; //用于记录总机构下标
	
	for (var i = 0, len = fzjgxx.length; i < len; i++) {

		// 只有一个分支机构时
		if (fzjgxx.length == 1) {
			fzjgxx[0].fpbl = ROUND(1, 10);
			break;
		}

		srzebl = t_fzjgsrzeHj === 0 ? defaultVal : ROUND((fzjgxx[i].fzjgsrze/ t_fzjgsrzeHj * 0.35), 16);
		gzzebl =t_fzjggzzeHj === 0 ? defaultVal :  ROUND((fzjgxx[i].fzjggzze/ t_fzjggzzeHj * 0.35), 16);
		zczebl = t_fzjgzczeHj === 0 ? defaultVal: ROUND((fzjgxx[i].fzjgzcze/ t_fzjgzczeHj * 0.3), 16);
		fpbl = ROUND(srzebl + gzzebl + zczebl, 10);
		fpbl=ROUND(ROUND(fpbl * 100000, 10) / 100000, 10);

		if (fzjgxx[i].fzjglxlb === "dlbm") {
			sfczdlbm = true;
			dlbmID = i;
		}else{
			fdlbmfpblHj += fpbl;
	}
		
		if (i !== fzjgxx.length - 1) {
			blhj += fpbl;
			}

		if(fzjgxx[i].fzjglxlb === "zjg"){
			zjgftbz=true;
			zgfIndex=i;
		}
		
		// 每一行的分配比例和分配税额赋值
		fzjgxx[i].fpbl =fpbl;

	}

	if (sfczdlbm) { // 独立生产经营部门分配比例和分配税额要重新计算

		fzjgxx[dlbmID].fpbl =ROUND( ROUND((1 - fdlbmfpblHj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - fdlbmfpblHj) * 100000, 10) / 100000
				: 0,10);
		var sbqylx=formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx;
		if(sbqylx=="1"){
			formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.dlscjybmftbl=fzjgxx[dlbmID].fpbl;
			var _jpath1 = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.dlscjybmftbl";
			var _jpath2 = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.zjgdlscjybmyftsdseBq";
			formulaEngine.apply(_jpath1,  "");
			formulaEngine.apply(_jpath2,  "");
		
		}
		
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpblHj=ROUND(ROUND((fdlbmfpblHj+fzjgxx[dlbmID].fpbl)*100000,10)/100000,10);
	} else { // 不存在独立部门时最后一行重新计算

		fzjgxx[fzjgxx.length - 1].fpbl =ROUND( ROUND((1 - blhj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - blhj) * 100000, 10) / 100000
				: 0,10);

		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpblHj=ROUND(ROUND((blhj+fzjgxx[fzjgxx.length - 1].fpbl)*100000,10)/100000,10);
	
	}
	
	//总机构参与分摊时  总机构分摊所得税额 的重新计算
	
	if(zjgftbz){
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.zjgftsdse=ROUND(fzjgxx[zgfIndex].fpbl*ynsdse,2);
		var _jpath1 = "ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.zjgftsdse";
		formulaEngine.apply(_jpath1,  "");
	}
		
	var _jpath2 = "ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[#].fpbl";
	formulaEngine.apply(_jpath2,  "");
 }

function getFpse(fzjgftdsdse, fpbl, fzjglxlb, fzjgnsrsbh,ynsdse) {

	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var nsrsbh = formData.fq.nsrjbxx.nsrsbh;

	var fdlbmfpseHj = 0; // 记录非独立生产经营部门的分配税额之和
	var sfczdlbm = false; // 判断是否存在独立部门
	var dlbmID = 0; // 用于记录独立部门的下标
     var sehj = 0; // 用于记录除最后一行外的税额合计
	var defaultVal=ROUND(0,16);
	var fpse=0;
	var zjgftbz=formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.zjgftbz;
	for (var i = 0, len = fzjgxx.length; i < len; i++) {

		// 只有一个分支机构时
		if (fzjgxx.length == 1) {
			 if(fzjgxx[0].fzjglxlb === "zjg"){
				 fzjgxx[0].fpse = ROUND(ynsdse, 2);
			 }else{
					fzjgxx[0].fpse = ROUND(fzjgftdsdse, 2);
			 }
		
			break;
		}

		fpbl=fzjgxx[i].fpbl;

		  if(zjgftbz === "Y"){
			  fpse=ROUND(ynsdse*fpbl,2);
			}else{
				fpse=ROUND(fzjgftdsdse*fpbl,2);
			}
	
		if (fzjgxx[i].fzjglxlb === "dlbm") {
			sfczdlbm = true;
			dlbmID = i;
		}else{
			fdlbmfpseHj+=fpse;
		}
		
		if (i !== fzjgxx.length - 1) {
			sehj+=fpse;
			}

		
		// 每一行的分配比例和分配税额赋值
		fzjgxx[i].fpse =fpse;

	}

	if (sfczdlbm) { // 独立生产经营部门分配比例和分配税额要重新计算

		if(zjgftbz==="Y"){
			fzjgxx[dlbmID].fpse = ROUND(ynsdse-fdlbmfpseHj, 2);
		}else{
			fzjgxx[dlbmID].fpse = ROUND(fzjgftdsdse-fdlbmfpseHj, 2);
		}
		
		var sbqylx=formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx;
		if(sbqylx=="1"){
			formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.zjgdlscjybmyftsdseBq=fzjgxx[dlbmID].fpse;
			
			var _jpath1 = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.dlscjybmftbl";
			var _jpath2 = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.zjgdlscjybmyftsdseBq";
			formulaEngine.apply(_jpath1,  "");
			formulaEngine.apply(_jpath2,  "");
		
		}
		
	
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpseHj=ROUND(fdlbmfpseHj+fzjgxx[dlbmID].fpse,2);
	} else { // 不存在独立部门时最后一行重新计算

		if(zjgftbz==="Y"){
			
			fzjgxx[fzjgxx.length - 1].fpse = ROUND(ynsdse-sehj, 2);
		}else{
			fzjgxx[fzjgxx.length - 1].fpse = ROUND(fzjgftdsdse-sehj, 2);
		}
		

		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpseHj=ROUND(sehj+fzjgxx[fzjgxx.length - 1].fpse,2);

	}
	var _jpath2 = "ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[#].fpse";
	formulaEngine.apply(_jpath2,  "");
		
}

// 更正申报是要不参股表的证件类型名称重新赋值。GDSDZSWJ-8118
function setZjlxMc() {
	var gzbz = formData.kz.temp.gzsbbz;
	if (gzbz != "Y") {
		return;
	}
	var dmb = formData.kz.basedata["sfzjlx"];
	var zjCT = formCT.sfzjlxCT
	var cgbList = formData.kz.temp.cgwgqyxxbgbVO;
	var arr = new Array();
	if (!isNull(dmb)) {
		arr = dmb['item'];
	}

	for (var i = 0; i < cgbList.length; i++) {

		var dsxxList = cgbList[i].dsxxGrid.dsxxGridlb;

		for (var j = 0; j < dsxxList.length; j++) {

			dm = dsxxList[j].sfzjlx;
			mc = zjCT[dm];

			if (!isNull(dm) && !isNull(mc)) {
				dmb = {};
				// 去掉重复的TODO
				var item = {};
				item['dm'] = dm;
				item['mc'] = mc;
				arr.push(item);
				dmb['item'] = arr;
			}

		}

	}

}

function isNull(param) {
	if (param === null || param === "null" || param === undefined
			|| param === "undefined" || '' === param) {
		return true;
	}
	return false;
}

/**
 * 逾期申报校验
 * 
 */

function yqsbVaild() {
	var yqsbbz = parent.parent.yqsbbz;
	var sbqx = formData.hq.sbxxGrid.sbxxGridlb[0].sbqx;
	var gdslxDm = formData.fq.nsrjbxx.gdslxDm;

	if (yqsbbz != "Y") {
		var sbiniturl = parent.pathRoot
				+ "/biz/yqsb/yqsbqc/enterYqsbUrl?gdslxDm=" + gdslxDm + "&sbqx="
				+ sbqx + "&yqsbbz=" + yqsbbz;
		$
				.ajax({
					url : sbiniturl,
					type : "GET",
					data : {},
					dataType : "json",
					contentType : "application/json",
					success : function(data) {
						var sfkyqsbbz = data.sfkyqsbbz;

						if (sfkyqsbbz == "N") {

							$(window.parent.document.body).mask("&nbsp;");
							window.parent.cleanMeunBtn();

							var b = parent.layer
									.confirm(
											data.msg,
											{
												// area: ['250px','150px'],
												title : '提示',
												btn : [ '确定' ]
											// btn2:function(index){}
											},
											function(index) {
												parent.layer.close(b);

												var wfurl = data.wfurlList;

												if (wfurl != undefined
														&& wfurl != ""
														&& wfurl != null) {
													var gnurl = wfurl[0].gnurl;
													var url = parent.location.protocol
															+ "//"
															+ parent.location.host
															+ gnurl
													parent.parent.window.location.href = url;

												} else {
													if (navigator.userAgent
															.indexOf("MSIE") > 0) {
														if (navigator.userAgent
																.indexOf("MSIE 6.0") > 0) {
															window.opener = null;
															window.close();
														} else {
															window.open('',
																	'_top');
															window.top.close();
														}
													} else if (navigator.userAgent
															.indexOf("Firefox") > 0) {
														window.location.href = 'about:blank ';
														window.close();
													} else if (navigator.userAgent
															.indexOf("Chrome") > 0) {
														top.open(location,
																'_self')
																.close();
													} else {
														window.open('', '_top');
														window.top.close();
													}
												}
											});

						}

					},
					error : function() {
						layer.alert('链接超时或网络异常', {
							icon : 5
						});
					}
				});
	}
}

// 弥补亏损的提示:当暑期在1-5月内且年报没有申报时，8行的弥补亏损不带出初始化值，这时候要给予对应的提示
function mbksVerify() {
	var synsfysbnb = formData.kz.temp.zb.synsfysbnb;// 上一年是否已申报年报
	var sfqymbksjk = formData.kz.temp.zb.sfqymbksjk;// 是否启用弥补亏损监控
	var skssqz = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.skssqz;
	var month = parseInt((skssqz).split("-")[1], 10);

	if (synsfysbnb == "N" && month < 6 && sfqymbksjk == "Y") {

		var msg = "因您的弥补亏损数据需关联上年度年度申报数据，请完成年度申报后再填写弥补亏损数据，如因未能在第一季度预缴前完成年度申报，建议第二季度预缴再弥补。";

		layer.alert(msg, {
			icon : 7
		});

	}

}

/**
 * 初始化A202000表
 */
function setFpbxx() {
	var fzjgxxList = formData.hq.fzjgxxGrid.fzjgxxGridlb;

	// 把核心接口返回的分支机构信息初始化到表单界面对应的节点中
	for (var i = 0; i < fzjgxxList.length; i++) {
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i] = {
			"fzjgdjxh" : "",
			"fzjgzgswjDm" : "",
			"fzjglxlb" : "",
			"fzjgnsrsbh" : "",
			"fzjgmc" : "",
			"fzjgsrze" : 0,
			"fzjggzze" : 0,
			"fzjgzcze" : 0,
			"fpbl" : 0,
			"fpse" : 0,
			"sfxsdfjm" : 0,
			"xsdfjmje" : 0,
			"xsdfjmfd" : 0
		};
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjglxlb = fzjgxxList[i].fzjglxlb;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgnsrsbh = fzjgxxList[i].fzjgnsrsbh;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgmc = fzjgxxList[i].fzjgmc;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgsrze = fzjgxxList[i].fzjgsrze;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjggzze = fzjgxxList[i].fzjggzze;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgzcze = fzjgxxList[i].fzjgzcze;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgdjxh = fzjgxxList[i].fzjgdjxh;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].sfxsdfjm = fzjgxxList[i].sfxsdfjm;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].xsdfjmje = fzjgxxList[i].xsdfjmje;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].xsdfjmfd = fzjgxxList[i].xsdfjmfd;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].fzjgzgswjDm = fzjgxxList[i].fzjgzgswjDm;
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[i].idx = i;

	}

}

// 获取分配比例
function getfpblhfpse(fzjgsrze, fzjggzze, fzjgzcze, fzjgnsrsbh, t_fzjgsrzeHj,
		t_fzjggzzeHj, t_fzjgzczeHj, fzjglxlb,fzjgftdsdse,ynsdse) {

	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var nsrsbh = formData.fq.nsrjbxx.nsrsbh;

	var fdlbmfpblHj = 0; // 记录非独立生产经营部门的分配比例之和
	var fdlbmfpseHj = 0; // 记录非独立生产经营部门的分配税额之和
	var sfczdlbm = false; // 判断是否存在独立部门
	var dlbmID = 0; // 用于记录独立部门的下标
	var blhj = 0; // 用于记录除最后一行外的比例合计
	var sehj = 0; // 用于记录除最后一行外的税额合计
	var srzebl = 0;
	var gzzebl = 0;
	var zczebl = 0;
	var fpbl = 0;
	var defaultVal=ROUND(0,16);
	
	for (var i = 0, len = fzjgxx.length; i < len; i++) {

		// 只有一个分支机构时
		if (fzjgxx.length == 1) {
			fzjgxx[0].fpbl = ROUND(1, 10);
			fzjgxx[0].fpse = ROUND(fzjgftdsdse, 2);
			break;
		}

		srzebl = t_fzjgsrzeHj === 0 ? defaultVal : ROUND((fzjgxx[i].fzjgsrze/ t_fzjgsrzeHj * 0.35), 16);
		gzzebl =t_fzjggzzeHj === 0 ? defaultVal :  ROUND((fzjgxx[i].fzjggzze/ t_fzjggzzeHj * 0.35), 16);
		zczebl = t_fzjgzczeHj === 0 ? defaultVal: ROUND((fzjgxx[i].fzjgzcze/ t_fzjgzczeHj * 0.3), 16);
		fpbl = ROUND(srzebl + gzzebl + zczebl, 10);
		fpbl=ROUND(ROUND(fpbl * 100000, 10) / 100000, 10);
		fpse=ROUND(fzjgftdsdse*fpbl,2);

		if (fzjgxx[i].fzjglxlb === "dlbm") {
			sfczdlbm = true;
			dlbmID = i;
		}else{
			fdlbmfpblHj += fpbl;
			fdlbmfpseHj+=fpse;
		}
		
		if (i !== fzjgxx.length - 1) {
			blhj += fpbl;
				sehj+=fpse;
			}

		// 每一行的分配比例和分配税额赋值
		fzjgxx[i].fpbl =fpbl;
		fzjgxx[i].fpse =fpse;

	}

	if (sfczdlbm) { // 独立生产经营部门分配比例和分配税额要重新计算

		fzjgxx[dlbmID].fpbl =ROUND( ROUND((1 - fdlbmfpblHj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - fdlbmfpblHj) * 100000, 10) / 100000
				: 0,10);

		fzjgxx[dlbmID].fpse = ROUND(fzjgftdsdse-fdlbmfpseHj, 2);
		var sbqylx=formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx;
		if(sbqylx=="1"){
			formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.dlscjybmftbl=fzjgxx[dlbmID].fpbl;
			formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.zjgdlscjybmyftsdseBq=fzjgxx[dlbmID].fpse;
			
			var _jpath1 = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.dlscjybmftbl";
			var _jpath2 = "ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.zjgdlscjybmyftsdseBq";
			formulaEngine.apply(_jpath1,  "");
			formulaEngine.apply(_jpath2,  "");
		
		}
		
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpblHj=ROUND(ROUND((fdlbmfpblHj+fzjgxx[dlbmID].fpbl)*100000,10)/100000,10);
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpseHj=ROUND(fdlbmfpseHj+fzjgxx[dlbmID].fpse,2);
	} else { // 不存在独立部门时最后一行重新计算

		fzjgxx[fzjgxx.length - 1].fpbl =ROUND( ROUND((1 - blhj) * 100000, 10) / 100000 > 0 ? ROUND(
				(1 - blhj) * 100000, 10) / 100000
				: 0,10);

		fzjgxx[fzjgxx.length - 1].fpse = ROUND(fzjgftdsdse
				-sehj, 2);
		
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpblHj=ROUND(ROUND((blhj+fzjgxx[fzjgxx.length - 1].fpbl)*100000,10)/100000,10);
		formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.zjgxxForm.t_fpseHj=ROUND(sehj+fzjgxx[fzjgxx.length - 1].fpse,2);

	}
	
		
		}
	
function validFpbl(fpbl){
	// $..A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[#].fpbl>=0&&$..A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[#].fpbl<=1
	var gridlb = fpbl.substring(0,fpbl.lastIndexOf('[')); // 截取jpath中最后一个节点所在的列表路径
	var _lst = eval(gridlb); // 通过eval 将列表路径转成集合数据
	var ret=[];
	for(var i=0;i<_lst.length;i++) {
		ret[i] = _lst[i].fpbl >=0&&_lst[i].fpbl<=1;
	}
	return ret;
}


/**
 * 关闭当前页面
 */

function closeWin() {

	if (navigator.userAgent.indexOf("MSIE") > 0) {
		if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
			window.opener = null;
			window.close();
		} else {
			window.open('', '_top');
			window.top.close();
		}
	} else if (navigator.userAgent.indexOf("Firefox") > 0) {
		window.location.href = 'about:blank ';
		window.close();
	} else if (navigator.userAgent.indexOf("Chrome") > 0) {
		top.open(location, '_self').close();
	} else {
		window.open('', '_top');
		window.top.close();
	}

}
/**
 * 服务于rule_A200000.json文件公式06100103010100001K和06100103010100202
 * */
function validation(){
	var swjgDm = formData.fq.nsrjbxx.swjgDm.substring(1,3);
	var valid={
		"fpbl":"N",
		"fpse":"N"
	}
	if(swjgDm != '11'){
		if(formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx =='2'){
			valid.fpbl="Y";
			valid.fpse="Y";
		}else{
			valid.fpbl="N";
			valid.fpse="N";
		}
		return valid;
	}else{
		var key1 = 0;
		var key2 = 0;
		if(formData.hq.fzjgxxGrid != null){
			if(formData.hq.fzjgxxGrid.fzjgxxGridlb != null && formData.hq.fzjgxxGrid.fzjgxxGridlb .length>0){
				for(var i = 0; i<formData.hq.fzjgxxGrid.fzjgxxGridlb.length;i++){
					if(formData.hq.fzjgxxGrid.fzjgxxGridlb[i].fzjgnsrsbh == formData.fq.nsrjbxx.nsrsbh){
						key1 = formData.hq.fzjgxxGrid.fzjgxxGridlb[i].fpbl;
						key2 = formData.hq.fzjgxxGrid.fzjgxxGridlb[i].fpse;
					}
				}
			}
			if(key1 == 0 && formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx =='2'){
				valid.fpbl="Y";
			}
			if(key2 == 0 && formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.nsrxxForm.sbqylx =='2'){
				valid.fpse="Y";
			}
		}
		return valid;
	}
}

/**
 * 控制只有附表为BDA0611037显示上传、下载按钮
 * @param dzbdbm
 */
// 暂时只发北京区域，放入北京分支
/*function ywControlBtn(dzbdbm) {
	var deliverConfig = JSON.parse(JSON.stringify(config));
	if (dzbdbm === "BDA0611037") {
		deliverConfig['btnUpload'].disp = 'block';
		deliverConfig['btnDownload'].disp = 'block';
		parent.menuBtnControl(deliverConfig,isExporting);
	} else {
		parent.menuBtnControl(config,isExporting);
	}
	// 显示上传文件按钮后需要调用frame.js中的fileUploadMeunBtnShow显示上传页面
	parent.fileUploadMeunBtnShow();
}*/

/**
 * 重写下载模板方法
 * 将期初数传入后台，然后把期初数中的识别号和名称写入模板
 */
function modelDownload() {
    var mainUrl = window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split("/")[1];
    var url = mainUrl + "/nssb/qysds/qysdsA18yjdFile.do";

    //定义一个form表单
    var form=$("<form>");
   	form.attr("style","display:none");
   	form.attr("target","");
    //请求类型
    form.attr("method","post");
    //请求地址
    form.attr("action",url);
    //将表单放置在web中
    $("body").append(form);

    //传递期初数
    var hqFzjgxxGridlb = encodeURIComponent(JSON.stringify(formData.hq.fzjgxxGrid.fzjgxxGridlb));
    var input = $("<input>");
    input.attr("type","hidden");
    input.attr("name","formData");
    input.attr("value",hqFzjgxxGridlb);
    form.append(input);

    //表单提交
    form.submit();
}

/**
 * 修改上传页面的提示语
 * @returns {string}
 */
function ywControlUploadTip() {
	var divHtml = '<div class="textRM">备注：当前只支持上传xls的附件类型' +
		'<span class="redtext" style="color: red;">支持最大上传值为10M.</span></div>' +
        '<div class="textRM"><span class="redtext" style="color: red;">执行导入后，将会覆盖分支机构所得税分配表所有数据，请保证导入文件的数据正确，如需修改本表数据请修改导入文件再重新导入！</span></div>';
	return divHtml;
}

//获取总机构是否参与分摊的标志
function getZjgftbz(cs){
	var fzjgxx = formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb;
	var bz="N";
	var zjgIndex=0;
	for(var i=0;i<fzjgxx.length;i++){
		if(fzjgxx[i].fzjglxlb==="zjg"){
		  zjgIndex=i;
			bz="Y";
			break;
		}
	}
	if(cs=="xb"){
		return zjgIndex;
	}else{
		return  bz;
	}
	
}

function valiZjgyftsdseBq(zjgftbz,ynsdse,zjgIndex,zjgftsdse,ybtsdseLj,zjgftbl,zjgyftsdseBq){
	
    var se=ROUND(ybtsdseLj*zjgftbl,2)
		if(zjgftbz==="Y"){
			var bl=ROUND(formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[zjgIndex].fpbl,4)
			var ftse=ROUND(ynsdse*bl,2);
			return se==ftse;
		}else{
			return se==zjgyftsdseBq;
		}	
				
}
function valiZjgyftsdseBq(zjgftbz,ynsdse,zjgIndex,zjgftsdse,ybtsdseLj,zjgftbl,zjgyftsdseBq){

    var se=ROUND(ybtsdseLj*zjgftbl,2)
    if(zjgftbz==="Y"){
        var bl=ROUND(formData.ht.qysdsczzsyjdSbbdxxVO.A202000Ywbd.fzjgxxGrid.fzjgxxGridlb[zjgIndex].fpbl,4)
        var ftse=ROUND(ynsdse*bl,2);
        return se==ftse;
    }else{
        return se==zjgyftsdseBq;
    }

}
//主表第九行 实际利润额 的自定义公式
function getSjlreLj(yjfs,sbqylx,lrzeLj,tdywjsdynssdeLj,bzssrLj,mssrLj,gdzcjszjkctjeLj,mbyqndksLj){
    var sjlreLj=0;
    if(yjfs==="1"&&(sbqylx==="0"||sbqylx==="1")){
        sjlreLj=lrzeLj+tdywjsdynssdeLj-bzssrLj-mssrLj-gdzcjszjkctjeLj-mbyqndksLj
    }else{
        sjlreLj = formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.sjlreLj;
    }

    return  sjlreLj;

}

//主表第15行 本期应补（退）所得税额 的自定义公式
function getYbtsdseLj(tsnsrlxDm,ynsdseLj,jmsdseLj,jdyjbl,sjyyjsdseLj,tdywyjzsdseLj,yjfs,sbqylx){

    var ybtsdselj=0;

    if(sbqylx!=="0"&&sbqylx!=="1"){
        return ybtsdselj;
    }
    if(tsnsrlxDm==="06"&&(yjfs==="1"||yjfs==="2")){
        ybtsdselj=MAX(0,(ynsdseLj-jmsdseLj)*jdyjbl-sjyyjsdseLj-tdywyjzsdseLj);
    }else if(yjfs==="1"||yjfs==="2"){
        ybtsdselj=MAX(0,ynsdseLj-jmsdseLj-sjyyjsdseLj-tdywyjzsdseLj);
    }else if(yjfs==="3"){
        ybtsdselj= formData.ht.qysdsczzsyjdSbbdxxVO.A200000Ywbd.sbbxxForm.ybtsdseLj;
    }else{
        ybtsdselj=0;
    }
    return ybtsdselj;
}