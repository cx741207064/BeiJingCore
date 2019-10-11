function lscjycf(url) {
    var ywid = "";
    var tjNd = "";
    var tjYf = "";
    var gdslxDm ="";
    var urlTemp = url;
    urlTemp = urlTemp.substr(urlTemp.indexOf("?")+1,urlTemp.length);
    var arr = urlTemp.split("&");
    for (var i = 0; i < arr.length; i++) {
        var num = arr[i].indexOf("=");
        if (num > 0) {
            var name = arr[i].substr(0, num);
            var value = arr[i].substr(num + 1);
            if (name == "ywid") {
                ywid = value;
            }else if(name == "tjNd"){
                tjNd = value;
            }else if(name == "tjYf"){
                tjYf = value;
            }
        }
    }

    var yyyf = tjNd+""+tjYf;

    var ywidList = new Array('01005','02008','02009','02010','02011','03006','03007','03008','04005','06005','06006','07003');

    if (ywidList.contains(ywid)){

        var params = 'gdslxDm=1&uuid=lscyqsb&sbqx='+yyyf+'&sbywbm=lscyqsb&yqsbbz=Y';
        var index = layer.load(2, {shade:0.1});
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
                var wfurlList = data.wfurlList;
                //先判断处罚
                if ("N" == sfkyqsbbz) {
                    // 不能逾期申报，提示信息
                    openWfurl(msg, wfurlList);
                    return;
                }else{
                    openWindow(url);
                }

            },
            error : function() {
                layMsg("尊敬的纳税人：连接超时或服务异常，请稍后再试！");
            },
            complete : function() {
                layer.close(index);
            }
        });
    }else {
        openWindow(url);
    }

}

Array.prototype.contains = function ( needle ) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}

/**
 * 打开违法url
 * @param msg
 * @param urllist
 */
function openWfurl(msg, wfUrlList) {
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
    var index = layer.open({
        type : 1,
        area :  '350px',
        offset : top, // 扩展后的参数
        title : '提示信息',
        content : msg,
        scrollbar : false,
        btn : [ '确定' ],
        btnAlign : 'r',// 按钮居中
        yes : function() {
            layer.close(index);
        }
    });
}