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

viewApp.controller('viewCtrl', function($rootScope, $scope, $http,
                                        $location) {
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
            if(item.sbztDm=="210"){
                //已申报
                return "<div class=\"sbtnbox\"><span style=\"font-size:14px\">"+item.sbrq+"</span></div>";
            }else{
                //填写按钮
//					return "<div class=\"sbtnbox\"><a class=\"sbtn sbtn01\"  href='javaScript:sbinit(\""+item.url+"\")'>填写申报表</a></div>";
                return "<a class=\"layui-btn layui-btn-sm\" style=\"height:24px;line-height:24px;\" href='javaScript:sbinit(\""+item.url+"\")'>填写申报表</a>";
            }
        };
    });

/**
 * 公共参数
 */
var tqyqsbbz;//是否允许切换月份 Y表示不允许 N或NULL表示允许
var showGdsbz;//控制是否显示国地税标志Y:显示，N:不显示，默认不显示



//加载数据
function loadQtsb() {
    var index = parent.layer.load(2, {shade:0.1});
//	var sksq = parent.document.getElementById("sksq").innerText;
    var sksq = parent.$("#test3").val();
    var nd = sksq.substr(0, 4);
    var yf = sksq.substr(5, 6);
    var qtsbUrl = contextRoot+"/biz/sbqc/sbqc_qtsb/enterQtsb?tjNd="+nd+"&tjYf="+yf + "&gdslxDm=" + parent.gdslxDm;
    //财税管家请求参数
    if (parent.appid == "csgj") {
        qtsbUrl += "&appid=" + parent.appid + "&token=" + parent.token + "&yypt_nsrsbh=" + parent.yypt_nsrsbh;
    }

    $.ajax({
        type : "POST",
        url : qtsbUrl,
        dataType : "json",
        contentType : "text/json",
        data : "",
        success : function(data) {
            //var result = eval("(" + data + ")");
            var qtsbList = data.qtsbList;
            var errList = data.errList;
            tqyqsbbz = data.tqyqsbbz;
            //判断是否允许切换月份
            isChangeYf();
            showGdsbz = data.showGdsbz;
            var scope = angular.element($('#viewCtrlid')).scope();
            if (typeof (scope) == 'undefined') {
                scope = angular.element($('#viewCtrlid')).scope($('#viewCtrlid'));
            }
            scope.items = qtsbList;
            scope.showGdsbz = showGdsbz;
            // 调用方法后，可以重新绑定，在页面同步（可选）
            scope.$apply();
            // 服务异常信息去重
            errList = buildErrList(errList);
            //服务异常展示
            showExAltr(errList);
            //关闭遮罩
            parent.layer.close(index);
            //iframe根据页面内容自适应高度
            var qtsbSize = qtsbList.length;
            changQtsbHiget(qtsbSize);
        },
        error : function() {
            parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1");
        },
        complete : function() {
            parent.layer.close(index);
        }
    });

}

/**
 * 其他申报iframe根据页面内容自适应高度
 */
function changQtsbHiget(qtsbSize){
    if ("Y"==showGdsbz) {
        parent.document.getElementById("gdslesfsb").innerHTML="国地税联合税费申报";
    }
    //其他申报iframe根据页面内容自适应高度
    var height = 200;
    if (qtsbSize > 1) {
        height += qtsbSize * 32;
    }
    var main = $(window.parent.document).find("#iframeId");
    main.height(height);
    // 重新自定义框架高度
    parent.changeHeight("ifrMain");
}

/**
 * 添加了处罚判断 打开申报表放在了sbinit2
 */
function sbinit(url){
    //获取url中的sbywbm
    var sbywbm = "";
    var tjNd = "";
    var tjYf = "";
    var gdslxDm ="";
    var arr = url.split("&");
    for (var i = 0; i < arr.length; i++) {
        var num = arr[i].indexOf("=");
        if (num > 0) {
            var name = arr[i].substr(0, num);
            var value = arr[i].substr(num + 1);
            if (name == "sbywbm") {
                sbywbm = value;
            }else if(name == "tjNd"){
                tjNd = value;
            }else if(name == "tjYf"){
                tjYf = value;
            }else if(name == "gdslxDm"){
                gdslxDm = value;
            }
        }
    }

    var yyyf = tjNd+""+tjYf;
    var params = "";

    params += 'gdslxDm='+gdslxDm+'&yyyf='+yyyf+'&sbywbm=' + sbywbm;

    if (params) {
        var index = layer.load(2, {shade:0.1});
        params += '&yqsbbz=N';
        var sUrl = contextRoot + '/biz/yqsb/yqsbqc/enterYqsbUrl?' + params;
        $.ajax({
            type : "POST",
            url : sUrl,
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
                    sbinit2(url);
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
}
/**
 *打开申报表
 */
function sbinit2(url) {
    //加工url
    var sbburl = contextRoot+"/biz/sbqc/sbqc_qtsb/sburlControl?"+ url
    var index = layer.load(2, {shade:0.1});
    $.ajax({
        type : "post",
        async : false, // ajax同步
        url : sbburl,
        data : {},
        success : function(data) {
            var result = eval("(" + data + ")");
            var success = result.success;
            // 展示申报表
            if(success=="Y"){
                var urlList = result.urlList;
                //北京个性化 屏蔽房土两税的逾期
                for (var i = 0; i < urlList.length; i++) {
                    if (urlList[i].gnmc == "房产税-逾期申报" || urlList[i].gnmc == "城镇土地使用税-逾期申报") {
                        urlList.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
                        i--; // 如果不减，将漏掉一个元素
                    }
                }
                //正常url展示
                showSburldata(urlList);
            }else{
                parent.alertMsg("尊敬的纳税人：系统暂未配置可用申报表!","1")
            }

        },
        error : function() {
            parent.alertMsg("尊敬的纳税人：连接超时或网络异常，请稍后再试！","1")
        },
        complete : function() {
            layer.close(index);
        }
    });
}

/**
 *正常展示申报表
 */
function showSburldata(urlList){
    if(urlList.length===1){
        parent.openWindow(urlList[0].gnurl);
    }else if(urlList.length>1){
        var msg = "<div class='win-center'>";
        msg += "<table class='layui-table' lay-even='' lay-skin='nob'><colgroup><col><col width='60'></colgroup>";
        msg += "<tbody>";
        //当网页填写申报和离线PDF申报都存在时,网页填写申报默认在左边
        for (var i = 0; i < urlList.length; i++) {
            if (urlList[i].zxlxbz === "1") {
                msg += "<tr><td>"+urlList[i].gnmc+"</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:lscjycf(\""+ urlList[i].gnurl + "\")'>申报</button></td></tr>";
            }
        }
        for (var i = 0; i < urlList.length; i++) {
            if (urlList[i].zxlxbz === "2") {
                msg += "<tr><td>离线PDF申报</td><td><button class='layui-btn layui-btn-primary layui-btn-xs' onClick='javaScript:lscjycf(\""+ urlList[i].gnurl + "\")'>申报</button></td></tr>";
            }
        }
        msg += "</tbody></table>";
        msg += "</div>";
        parent.alertMsg(msg,"3")
    }
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


/**
 * 是否允许切换月份 供父页面调用子页面方法
 * @param tqyqsbbz
 * @returns
 */
function checkYfjk(){
    return tqyqsbbz;
}
/**
 * 判断是否允许切换月份
 * 设置input 是否可点击
 * @returns
 */
function isChangeYf(){
    if(tqyqsbbz == "Y"){
        parent.$("#test3").attr("disabled","disabled")
    }
    else {
        parent.$("#test3").removeAttr("disabled")
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
        slmsg ="<a href=\"#\" style=\"color:red; font-size:14px;\" onClick='javaScript:openWindow(\""+ wfUrlList[0].gnurl + "\");'>点我受理</a> ";
        msg = msg + slmsg;
        //提示缩进
        msg ="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+msg;
        // 弹出框 页面层-自定义
        parent.layer.open({
            type : 1,
            offset : top, // 扩展后的参数
            title : "信息",
            area :  ['350px','230px'],
            shadeClose : true,
            content : msg,
            end : function() {
                //loadAqsb();
            }
        });
    } else {
        layMsg(msg);
    }
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
    parent.layer.open({
        type : 1,
        area :  '350px',
        offset : top, // 扩展后的参数
        title : '提示信息',
        content : msg,
        scrollbar : false,
        btn : [ '确定' ],
        btnAlign : 'r',// 按钮居中
        yes : function() {
            parent.layer.closeAll();
        }
    });
}