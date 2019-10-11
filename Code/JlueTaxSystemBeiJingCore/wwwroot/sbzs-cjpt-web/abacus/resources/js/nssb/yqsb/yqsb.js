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
var  formCT={};
var ua = navigator.userAgent;
if (ua && ua.indexOf("MSIE 7") >= 0) {
    // Completely disable SCE to support IE7.
    viewApp.config(function($sceProvider) {
        //console.log("启动IE7兼容性支持：" + ua);
        $sceProvider.enabled(false);
    });
}

viewApp.controller('viewCtrl', function($rootScope, $scope, $http,
                                        $location) {
    $scope.CT = formCT;
    $scope.filterSbywbm = function(e){

        return e.sbywbm !='' && e.sbywbm !='KJGRSDSSB' && e.sbywbm !='SCJYSDGRSDS_A' && e.sbywbm !='GRSDS_SCJY_B' && e.sbywbm !='GRSDS_SCJY_C' && e.sbywbm !='GRSDS_ZXSB_A' && e.sbywbm !='GRSDS_ZXSB_B';
    }
});
viewApp.filter('to_trusted', [ '$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
} ]);


/**
 * 国地税类型代码转名称
 */
viewApp.filter('gdslxDmFilter',
    function() {
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
 * 填写申报按钮
 */
viewApp.filter('sbztDmFilter',
    function() {
        return function(item) {
            //已申报、已处罚
            if(item.sbztDm=="210"&&"03"==item.cfztDm){
                //已申报
                return "<div class=\"sbtnbox\"><span>已申报</span></div>";
            }else
            //填写按钮
                return "<div class=\"sbtnbox\"><a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;\"  href='javaScript:sbinit(\""+item.uuid+"\",\""+item.gdslxDm+"\",\""+item.sbywbm+"\",\""+item.sbqx+"\",\""+item.sbztDm+"\",\""+item.cfztDm+"\",\""+item.zsxmDm+"\",\""+item.zspmDm+"\",\""+item.skssqq+"\",\""+item.skssqz+"\",\""+item.nsqxDm+"\")'>填写申报表</a></div>";
        };
    });

/**
 * 公共参数
 */
var showGdsbz;//控制是否显示国地税标志Y:显示，N:不显示，默认不显示
var sbowSbbms;//控制是否显示显示申报表展示模式Y，是显示申报表，N显示项目品目，默认显示项目品目
//加载数据
function loadYqsb() {
    var top = "auto"// 默认自动
    if (window.top == window.self) {
        // 不存在父页面
    } else {
        top = window.parent.document.documentElement.scrollTop + 200 + "px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    //var index = layer.load(0, {shade : 0.2});
    var yqsbIniturl = contextRoot+"/biz/yqsb/yqsbqc/enterYqSb?gdslxDm=" + parent.gdslxDm +"&zxbz="+parent.zxbz;
    $.ajax({
        type : "POST",
        url : yqsbIniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var yqsbList = data.yqsbList;

            //北京个性化 屏蔽房土两税的逾期
            if (parent.zxbz != "Y"){
                var zsxmDmList = new Array('10110','10112');
                for (var i = 0; i < yqsbList.length; i++) {
                    if (zsxmDmList.contains(yqsbList[i].zsxmDm)) {
                        yqsbList.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
                        i--; // 如果不减，将漏掉一个元素
                    }
                }
            }

            var qxmc = data.qxmc;
            showGdsbz = data.showGdsbz;
            var errList = data.errList;

            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            scope.items = yqsbList;
            scope.qxmc = qxmc;
            scope.showGdsbz = showGdsbz;
            scope.$apply();

            // 服务异常信息去重
            errList = buildErrList(errList);
            // 服务异常展示
            showExAltr(errList);

            // 设置页面高度
            var ifm = parent.document.getElementById("yqsbqcIframe");
            var yqsbSize = yqsbList.length;
            var height = 500;
            if (yqsbSize > 0) {
                height += yqsbSize * 35;
            }
            ifm.height = height + "px";
            try {
                if (height > 700) {
                    var ifrMainheight = height + 300 + "px";
                    parent.parent.document.getElementById("ifrMain").style.height = ifrMainheight;

                }
            } catch (err) {
            }
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}



/**
 * 获取逾期申报url
 * @param uuid
 * @param sbqx
 * @param skssqq
 * @param skssqz
 * @param gdslxDm
 * @param sbywbm
 */
function sbinit(uuid, gdslxDm, sbywbm, sbqx, sbztDm, cfztDm, zsxmDm, zspmDm,skssqq, skssqz, nsqxDm) {
    if(sbywbm == null || sbywbm =="" || sbywbm =="null"){
        layMsg("电子税务局暂不支持该申报表进行逾期申报，请前往办税大厅办理!");
        return;
    }
    var top="auto"//默认自动
    if(window.top==window.self){
        //不存在父页面
    }else{
        top=window.parent.document.documentElement.scrollTop+200+"px";
    }
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    //var index = layer.load(0, {shade : 0.2});
    var sbiniturl = contextRoot+"/biz/yqsb/yqsbqc/enterYqsbUrl?&yqsbbz=Y&uuid="+uuid+"&gdslxDm="+gdslxDm+"&sbywbm="+sbywbm+"&sbqx="+sbqx;
    if (parent.zxbz === "Y") {
		    sbiniturl += "&zsxmDm=" + zsxmDm + "&zspmDm=" + zspmDm + "&skssqq="+ skssqq + "&skssqz=" + skssqz + "&nsqxDm=" + nsqxDm+"&zxbz="+parent.zxbz;
	  }
    $.ajax({
        type : "POST",
        url : sbiniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var sfkyqsbbz = data.sfkyqsbbz;//是否可逾期标志
            var msg = data.msg;//逾期信息
            var sburlList = data.sburlList;
            var wfurlList = data.wfurlList;
            //先判断处罚
            if ("N" == sfkyqsbbz) {
                // 不能逾期申报，提示信息
                openWfurl(msg, wfurlList, sburlList);
                return;
            }else{
                //打开申报表
                if (sburlList.length == 0 && wfurlList.length == 0) {
                    layMsg("未配置可以申报表!");
                    return;
                } else {
                    //openUrl(sburlList, wfurlList, msg, sbztDm, cfztDm);
                    //提示裁量通知
                    //获取当前时间
                    var nowdate =  getNowFormatDate();
                    //逾期天数
                    var yqts = getDays(nowdate,sbqx);
                    var tsmsg ="该报表原申报期限为"+sbqx+"，已逾期"+yqts+"天。";
                    //裁量基准告知链接
                    tsmsg +="<br/><a class=\"font-weak\" style=\"text-decoration: underline;cursor:pointer;\" onClick=\"javaScript:openCltz('"+gdslxDm+"')\">查看相关行政处罚裁量权标准</a>";
                    layclqtz(tsmsg,sburlList,wfurlList, msg, sbztDm,cfztDm);
                }
            }

        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}


/**
 * 打开申报表
 * @param sbUrl
 * @param wfUrl
 */
function openUrl(sbUrlList, wfUrlList, xxmsg, sbztDm, cfztDm) {
    //只有申报表
    if(sbUrlList.length==1 && wfUrlList.length ==0 ){
        if (xxmsg == "" || xxmsg == null) {
            openWindow(sbUrlList[0].gnurl);
        } else {
            openWfurl(xxmsg, wfUrlList, sbUrlList);
        }
    }else if(sbUrlList.length==0 && wfUrlList.length ==1){
        //只有违法行为
        if (xxmsg == "" || xxmsg == null) {
            openWindow(wfUrlList[0].gnurl);
        } else {
            openWfurl(xxmsg, wfUrlList, sbUrlList);
        }
    }else{
        //构建表格
        var msg = "<div class=\"tc_nav_sbqc\">";
        //显示业务提示
        msg += "<div><font color='red'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + xxmsg + "</font></div><br><div style=\"height:30px; line-height:10px; text-align:center;\">请选择</div>";
        //构建表格
        msg += "<table width=\"98%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
        //申报表
        for (var i = 0; i < sbUrlList.length; i++) {
            msg += "<tr><td width=\"180px\"></td><td width=\"180px\" align=\"left\" style=\"padding-bottom:10px\">";
            if (sbUrlList[i].zxlxbz === "1") {
                msg += "<input class=\"btn btn01\" type=\"button\" value=\""+ sbUrlList[i].gnmc+ "\" onClick='javaScript:openWindow(\""+ sbUrlList[i].gnurl + "\")'>";
            } else if (sbUrlList[i].zxlxbz === "2") {
                msg += "<input class=\"btn btn01\" type=\"button\" value=\""+ sbUrlList[i].gnmc+ "(离线)\" onClick='javaScript:openWindow(\""+ sbUrlList[i].gnurl + "\")'>";
            }
            msg += "</td><td width=\"140px\"></td></tr>";
        }
        //违法url
        for (var i = 0; i < wfUrlList.length; i++) {
            msg += "<tr><td width=\"180px\"></td><td width=\"180px\" align=\"left\" style=\"padding-bottom:10px\">";
            if (wfUrlList[i].zxlxbz === "1") {
                msg += "<input class=\"btn btn01\" type=\"button\" value=\""+ wfUrlList[i].gnmc+ "\" onClick='javaScript:openWindow(\""+ wfUrlList[i].gnurl + "\")'>";
            } else if (wfUrlList[i].zxlxbz === "2") {
                msg += "<input class=\"btn btn01\" type=\"button\" value=\""+ wfUrlList[i].gnmc+ "(离线)\" onClick='javaScript:openWindow(\""+ wfUrlList[i].gnurl + "\")'>";
            }
            msg += "</td><td width=\"140px\"></td></tr>";
        }
        msg +="</table></div>";
        // 弹出框 页面层-自定义
        var top = "auto"// 默认自动
        if (window.top == window.self) {
            // 不存在父页面
        } else {
            top = parent.window.parent.document.documentElement.scrollTop -100 + "px";
        }
        layer.open({
            type : 1,
            offset : top, // 扩展后的参数
            title : "信息",
            area :  '350px',
            shadeClose : true,
            content : msg,
            end : function() {
                // alert(111);
                // 关闭后刷新页面
                loadYqsb();
            }
        });
    }
}

/**
 * 打开违法url
 * @param msg
 * @param urllist
 */
function openWfurl(msg, wfUrlList, sbUrlList) {
    var top = "auto"// 默认自动
    if (window.top == window.self) {
        // 不存在父页面
    } else {
        top = parent.window.parent.document.documentElement.scrollTop+ 100 + "px";
    }
    //增加链接
    if (wfUrlList.length != 0) {
        var slmsg ="";
        slmsg ="<a href=\"#\" style=\"color:red; font-size:14px;\" onClick='javaScript:openWindow(\""+ wfUrlList[0].gnurl + "\")'>点我受理</a> ";
        msg = msg + slmsg;
        //提示缩进
        msg ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+msg;
        // 弹出框 页面层-自定义
        layer.open({
            type : 1,
            offset : top, // 扩展后的参数
            title : "信息",
            area :  ['350px','230px'],
            shadeClose : true,
            content : msg,
            end : function() {
                // alert(111);
                // 关闭后刷新页面
                loadYqsb();
            }
        });
    } else if (sbUrlList.length != 0) {
        //提示缩进
        msg ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+msg;
        // 弹出框 页面层-自定义
        layer.open({
            type : 1,
            title : "信息",
            area :  '350px',
            offset : top, // 扩展后的参数
            shadeClose : true,
            content : msg,
            btn : [ '确定'],
            btnAlign : 'r', //按钮居右
            yes : function() {
                // 確定打开申报表
                openWindow(sbUrlList[0].gnurl);
            }
        });
    } else {
        layMsg(msg);
    }
}

/**
 * 打开申报表后刷新
 * @param url
 */
function openWindow(url) {
    var isClose = window.open(url); // 判断当前弹出窗体是否关闭
    var loop = setInterval(function() {
        if (isClose.closed) {
            clearInterval(loop);
            //关闭弹出层
            layer.close(layer.index);
            // 刷新
            loadYqsb();
        }
    }, 1000);
}

/**
 * 重置逾期申报
 */
function resetYqsb(){
    var top = "auto"// 默认自动
    if (window.top == window.self) {
        // 不存在父页面
    } else {
        top = window.parent.document.documentElement.scrollTop + 200 + "px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    //var index = layer.load(0, {shade : 0.2});
    var requrl = parent.czurl;
    $.ajax({
        type : "POST",
        url : requrl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var yqsbList = data.yqsbList;

            //北京个性化 屏蔽房土两税的逾期
            if (parent.zxbz != "Y"){
                var zsxmDmList = new Array('10110','10112');
                for (var i = 0; i < yqsbList.length; i++) {
                    if (zsxmDmList.contains(yqsbList[i].zsxmDm)) {
                        yqsbList.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
                        i--; // 如果不减，将漏掉一个元素
                    }
                }
            }

            showGdsbz = data.showGdsbz;
            var qxmc = data.qxmc;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            // var yqsbListGl = "";
            // for ()
            scope.items = yqsbList;
            scope.showGdsbz = showGdsbz;
            scope.qxmc = qxmc;
            scope.$apply();
            // 设置页面高度
            var ifm = parent.document.getElementById("yqsbqcIframe");
            var yqsbSize = yqsbList.length;
            var height = 500;
            if (yqsbSize > 0) {
                height += yqsbSize * 35;
            }
            ifm.height = height + "px";
            //框架高度
            try {
                if (height > 700) {
                    var ifrMainheight = height + 300 + "px";
                    parent.parent.document.getElementById("ifrMain").style.height = ifrMainheight;

                }
            } catch (err) {
            }
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}



//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

// 获得两个日期之间相差的天数
function getDays(date1, date2) {
    var date1Str = date1.split("-");// 将日期字符串分隔为数组,数组元素分别为年.月.日
    // 根据年 . 月 . 日的值创建Date对象
    var date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2]);
    var date2Str = date2.split("-");
    var date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2]);
    var t1 = date1Obj.getTime();
    var t2 = date2Obj.getTime();
    var dateTime = 1000 * 60 * 60 * 24; // 每一天的毫秒数
    var minusDays = Math.floor(((t2 - t1) / dateTime));// 计算出两个日期的天数差
    var days = Math.abs(minusDays);// 取绝对值
    return days;
}


/**
 * 提示信息
 * @param msg
 */
function layMsg(msg) {
    //提示缩进
    msg ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+msg;
    // 扩展代码获取父页滚动
    var top = "auto"// 默认自动
    if (window.top == window.self) {
        // 不存在父页面
    } else {
        top = parent.window.parent.document.documentElement.scrollTop + 100 + "px";
    }
    // 扩展结束
    layer.open({
        type : 1,
        area :  '350px',
        offset : top, // 扩展后的参数
        title : '提示信息',
        content : msg,
        scrollbar : false,
        btn : [ '确定' ],
        btnAlign : 'r',// 按钮居中
        yes : function() {
            layer.closeAll();
        }
    });
}

/**
 * 逾期次数信息查询
 */
function findyqcsxx(){
    // layMsg("建设中...");
    // 跳转查询页
    var yqsbcxaddress = contextRoot + "/biz/yqsb/yqsbcx?gdslxDm="+ parent.gdslxDm;
    window.open(yqsbcxaddress);
}

function loadyqsbcx(){
    var top="auto"//默认自动
    if(window.top==window.self){
        //不存在父页面
    }else{
        top=window.parent.document.documentElement.scrollTop+200+"px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var yqsbcxIniturl = contextRoot+"/biz/yqsb/yqsbcx/enterYqsbcx?gdslxDm=" + parent.gdslxDm;
    $.ajax({
        type : "POST",
        url : yqsbcxIniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var sbxxList = data.yqsbxxList;
            var sbxxSize = sbxxList.length;
            var yyqcs = data.yqcs;//累计逾期次数
            var ssqq = data.ssqq;
            var ssqz = data.ssqz;
            var nsrmc = data.nsrmc;
            var nsrsbh = data.nsrsbh;
            var yqjylxmc = data.yqjylxmc;
            showGdsbz = data.showGdsbz;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            $("#sbqxq").val(ssqq);
            $("#sbqxz").val(ssqz);
            //绑定
            scope.items = sbxxList;
            scope.yqcs = sbxxSize;
            scope.yyqcs = yyqcs;
            scope.showGdsbz = showGdsbz;
            scope.nsrmc = nsrmc;
            scope.nsrsbh = nsrsbh;
            scope.yqjylxmc = yqjylxmc;
            scope.ssqq = ssqq;
            scope.ssqz = ssqz;
            scope.$apply();
            // 设置页面高度
            var ifm = parent.document.getElementById("ysqbcxIframe");
            var height = 500;
            if (sbxxSize > 0) {
                height += sbxxSize * 35;
            }
            ifm.height = height + "px";
            if (height > 900) {
                var ifrMainheight = height + 300 + "px";
                parent.parent.document.getElementById("ifrMain").style.height=ifrMainheight;
            }
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}

function yqsbxxqueryBtn(){
    //获取查询条件
    var sbqxq = $("#sbqxq").val();
    var sbqxz = $("#sbqxz").val();
    //日期校验
    if(sbqxq == null || sbqxq=="" ||  sbqxz == null  || sbqxz==""){
        layMsg('申报期限起止不能为空！');
        return false;
    }
    if(sbqxq > sbqxz){
        layMsg('申报期限止不能小于申报期限起！');
        return false;
    }
    var top="auto"//默认自动
    if(window.top==window.self){
        //不存在父页面
    }else{
        top=window.parent.document.documentElement.scrollTop+200+"px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var yqsbcxIniturl = contextRoot+"/biz/yqsb/yqsbcx/enterYqsbcx?gdslxDm=" + parent.gdslxDm+"&sbqxq="+sbqxq+"&sbqxz="+sbqxz;
    $.ajax({
        type : "POST",
        url : yqsbcxIniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var sbxxList = data.yqsbxxList;
            var sbxxSize = sbxxList.length;
            var yyqcs = data.yqcs;//累计逾期次数
            showGdsbz = data.showGdsbz;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            //绑定
            scope.items = sbxxList;
            scope.yqcs = sbxxSize;
            scope.yyqcs = yyqcs;
            scope.showGdsbz = showGdsbz;
            scope.$apply();
            // 设置页面高度
            var ifm = parent.document.getElementById("ysqbcxIframe");
            var height = 500;
            if (sbxxSize > 0) {
                height += sbxxSize * 35;
            }
            ifm.height = height + "px";
            if (height > 700) {
                var ifrMainheight = height + 300 + "px";
                parent.parent.document.getElementById("ifrMain").style.height=ifrMainheight;
            }
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}

//违法信息查询
function findyqwfxx(){
    //layMsg("建设中...");
    // 跳转查询页
    var yqwfcxaddress = contextRoot + "/biz/yqsb/yqwfcx?gdslxDm="+ parent.gdslxDm;
    window.open(yqwfcxaddress);
}


function loadyqwfcx(){
    var top="auto"//默认自动
    if(window.top==window.self){
        //不存在父页面
    }else{
        top=window.parent.document.documentElement.scrollTop+200+"px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var yqsbcxIniturl = contextRoot+"/biz/yqsb/yqwfcx/enterYqwfcx?gdslxDm=" + parent.gdslxDm;
    $.ajax({
        type : "POST",
        url : yqsbcxIniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var wfxxList = data.yqwfxxList;
            var djrqq = data.djrqq;
            var djrqz = data.djrqz;
            showGdsbz = data.showGdsbz;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            $("#djrqq").val(djrqq);
            $("#djrqz").val(djrqz);
            //绑定
            scope.items = wfxxList;
            scope.showGdsbz = showGdsbz;
            scope.$apply();
            // 设置页面高度
            var ifm = parent.document.getElementById("yqwfcxIframe");
            var height = 500;
            if (wfxxList.length > 0) {
                height += wfxxList.length * 35;
            }
            ifm.height = height + "px";
            if (height > 700) {
                var ifrMainheight = height + 300 + "px";
                parent.parent.document.getElementById("ifrMain").style.height=ifrMainheight;
            }
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}

function yqwfxxqueryBtn(){
    //layMsg("功能建设中...");
    //获取查询条件
    var djrqq = $("#djrqq").val();
    var djrqz = $("#djrqz").val();
    //日期校验
    if(djrqq == null || djrqq=="" ||  djrqz == null  || djrqz==""){
        layMsg('违法登记日期起止不能为空！');
        return false;
    }
    if(djrqq > djrqz){
        layMsg('违法登记日期止不能小于违法登记日期起！');
        return false;
    }
    var top="auto"//默认自动
    if(window.top==window.self){
        //不存在父页面
    }else{
        top=window.parent.document.documentElement.scrollTop+200+"px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var yqwfcxIniturl = contextRoot+"/biz/yqsb/yqwfcx/enterYqwfcx?gdslxDm=" + parent.gdslxDm+"&djrqq="+djrqq+"&djrqz="+djrqz;
    $.ajax({
        type : "POST",
        url : yqwfcxIniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var wfxxList = data.yqwfxxList;
            var djrqq = data.djrqq;
            var djrqz = data.djrqz;
            showGdsbz = data.showGdsbz;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            //绑定
            scope.items = wfxxList;
            scope.showGdsbz = showGdsbz;
            scope.$apply();
            // 设置页面高度
            var ifm = parent.document.getElementById("yqwfcxIframe");
            var height = 500;
            if (wfxxList.length > 0) {
                height += wfxxList.length * 35;
            }
            ifm.height = height + "px";
            if (height > 700) {
                var ifrMainheight = height + 300 + "px";
                parent.parent.document.getElementById("ifrMain").style.height=ifrMainheight;
            }
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}

/**
 * 裁量基准告知信息提示
 */
function layclqtz(tsmsg,sburlList,wfurlList, msg, sbztDm,cfztDm){
    var top = "auto"// 默认自动
    if (window.top == window.self) {
        // 不存在父页面
    } else {
        top = parent.window.parent.document.documentElement.scrollTop + 100 + "px";
    }
    // 扩展结束
    layer.open({
        type : 1,
        area :  '400px',
        offset : top, // 扩展后的参数
        title : '提示',
        content : tsmsg,
        scrollbar : false,
        btn : [ '继续申报' ],
        btnAlign : 'r',// 按钮居中
        yes : function() {
            layer.closeAll();
            //打开申报表
            openUrl(sburlList, wfurlList, msg, sbztDm, cfztDm);
        }
    });
}

/**
 * 初始化逾期申报处罚裁量基准告知信息
 */
function openCltz(gdslxDm){
    var top = "auto"// 默认自动
    if (window.top == window.self) {
        // 不存在父页面
    } else {
        top = parent.window.parent.document.documentElement.scrollTop +100 + "px";
    }
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var yqclztcxIniturl = contextRoot+"/biz/yqsb/yqcltzcx?gdslxDm=" + gdslxDm;
    layer.open({
        type : 2, //类型，解析url
        offset : top, // 扩展后的参数
        title : " ",
        area :  ['75%', '55%'],
        shadeClose : true,
        content : yqclztcxIniturl,
        end : function() {
            layer.close(index);
        }
    });

}

/**
 * 加载逾期申报裁量处罚告知
 */
function loadCltz(){
    var top="auto"//默认自动
    if(window.top==window.self){
        //不存在父页面
    }else{
        top=window.parent.document.documentElement.scrollTop+200+"px";
    }
    //扩展结束
    var index = layer.load(2, {offset:top,time: 10*500,shade:0.1});
    var yqsbcxIniturl = contextRoot+"/biz/yqsb/yqcltzcx/enterYqclztcx?gdslxDm=" + parent.gdslxDm;
    $.ajax({
        type : "POST",
        url : yqsbcxIniturl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            // var result = eval("(" + data + ")");
            var clcfList = data.clcfList;
            showGdsbz = data.showGdsbz;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            //绑定
            scope.items = clcfList;
            scope.showGdsbz = showGdsbz;
            scope.$apply();
            // 设置页面高度
            var ifm = parent.document.getElementById("yqcltzcxIframe");
            var clcfSize = clcfList.length;
            var height = 400;
            if (clcfSize > 3) {
                height += clcfSize * 35;
            }
            ifm.height = height + "px";
        },
        error : function() {
            layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
        },
        complete : function() {
            layer.close(index);
        }
    });
}

/**
 * 服务异常信息去重
 */
function buildErrList(errList){
    var eList = [];
    for(var i in errList){
        var flag = true;
        for(var j in eList){
            var msg1 = eList[j].msg;
            var msg2 = errList[i].msg;
            var index1 = msg1.indexOf("错误码");
            var index2 = msg2.indexOf("错误码");
            if(index1 != -1){
                msg1 = msg1.substr(0,index1-1)
            }
            if(index2 != -1){
                msg2 = msg2.substr(0,index2-1)
            }
            if(msg1 == msg2){
                flag = false;
            }
        }
        if(flag){
            eList.push(errList[i])
        }
    }
    return eList
}

/**
 *服务异常展示
 */
function showExAltr(errList) {
    var htmlString="";
    for(var j=0;j<errList.length;j++){
        htmlString +="<div style=\"padding: 5px 0; color: #999;letter-spacing:1px;font-size: 12px\" id=serviceErrId"+j+"></div>";
    }
    document.getElementById('serviceErrId').innerHTML = htmlString;
    for (var i = 0; i < errList.length; i++) {
        exAlert.customizeEx(errList[i],"serviceErrId"+i);
    }
}
//北京个性化
Array.prototype.contains = function ( needle ) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}