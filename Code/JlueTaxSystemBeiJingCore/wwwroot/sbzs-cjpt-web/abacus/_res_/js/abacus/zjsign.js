function pluginSign(zjTiket, viewOrDownload) {

    var viewOrDownloadBtn = '';
    var tips='';
    if(viewOrDownload !== 'view'){
        viewOrDownloadBtn = '下载凭证';
        tips = '如果需要下载申报凭证，可以点击“'	+viewOrDownloadBtn+'”按钮下载凭证文件到您的电脑，进行查看打印。';
    }else{
        viewOrDownloadBtn = '查看凭证';
        tips = '如果需要查看申报凭证，可以点击“'	+viewOrDownloadBtn+'”按钮查看凭证文件。';
    }
    //非CA用户不用签名
    //otherParams['cayh'] = 'Y';
    //if('Y' !== otherParams['cayh']){
        nocaSb(viewOrDownload,viewOrDownloadBtn,tips);
    //}else{
    //    caSb(viewOrDownload);
    //}
}

function nocaSb(viewOrDownload, viewOrDownloadBtn, tips){
    parent.layer.confirm('请您再次确认申报数据是否正确，如确认无误，点击【申报】即可；如需要修改请点击【取消】。若申报成功后可在[税费缴纳]功能中进行缴款，未缴款前可在[申报作废]功能中作废本次申报表。',{
        icon : 1,
        title:'提示',
        btn2noclose:1,
        btn : ['申报','取消'],
        btn2:function(index){
            //右上角关闭回调
            parent.layer.close(index);
            $("body").unmask();
            prepareMakeFlag = true;
            return false ;
        },
        cancel: function(index){
            //右上角关闭回调
            parent.layer.close(index);
            $("body").unmask();
            prepareMakeFlag = true;
            return false ;
        }
    },function(index){
        //申报提交逻辑
        parent.layer.close(index);
        submitPdf("N");
        return;
    });
}

// CA签章流程
function caSb(viewOrDownload){

    parent.layer.confirm('为了给您提供更佳的办税体验，系统不再展现PDF凭证界面，您可以点击“申报”按钮直接进行申报提交操作，点击“签章”按钮进行签章',{
        icon : 1,
        title:'提示',
        btn2noclose:1,
        btn : ['申报','签章'],
        btn2:function(index){
            // 签章
            initCA(viewOrDownload);
			// 点击签章之后自动关闭弹框避免用户多次点击签章按钮
            //return false;
        },
        cancel: function(index){
            //右上角关闭回调
            parent.layer.close(index);
            $("body").unmask();
            prepareMakeFlag = true;
            return false ;
        }
    },function(index){
        //申报提交逻辑
        parent.layer.close(index);
        submitPdf("N");
        return;
    });


}

//第一步
function initCA(viewOrDownload) {
    var isIE = navigator.userAgent.toLowerCase().search(/(msie\s|trident.*rv:)([\w.]+)/) != -1;
    if (isIE) {
        if(document.getElementsByTagName("object").length === 0){
            // document.writeln("<OBJECT classid='CLSID:3F367B74-92D9-4C5E-AB93-234F8A91D5E6' height=1 id='XTXAPP'  style='height: 1px; left: 10px; top: 28px; width:1px' width=1 VIEWASTEXT></OBJECT>");
            var object = document.createElement("OBJECT");
            object.classid = 'CLSID:3F367B74-92D9-4C5E-AB93-234F8A91D5E6';
            object.id = "XTXAPP";
            object.height = 1;
            object.width = 1;
            var temp = document.getElementsByTagName("body");
            if (temp && temp.length > 0) {
                temp[0].appendChild(object);
            }
        }

        XTXAPP.SOF_GetVersion();
        XTXAPP.EnableSoftDevice(true, "");
    } else {
        document.writeln("<embed id=XTXAPP type=application/x-xtx-axhost clsid={3F367B74-92D9-4C5E-AB93-234F8A91D5E6} event_OnUsbkeyChange=OnUsbKeyChange width=1 height=1 />");
        XTXAPP.SOF_GetVersion();
        XTXAPP.EnableSoftDevice(true, "");
    }
    if (XTXAPP.GetDeviceCount() <= 0) {
        parent.layer.alert("请插入一证通设备！", {icon: 0, title:'提示'});
    } else {
        if (XTXAPP.GetDeviceCount() > 1) {
            parent.layer.alert("检测到多个一证通设备，请只保留需要的设备！", {icon: 0, title:'提示'});
        } else {
            var usrlst = XTXAPP.SOF_GetUserList();
            var userCertId = "";
            while (usrlst !== "") {
                var i = usrlst.indexOf("&&&");
                var left = usrlst.substring(0, i);
                var right = usrlst.substring(i + 3, usrlst.length);
                var j = left.indexOf("||");
                var container = left.substring(j + 2, left.length);
                if (userCertId !== container) {
                    userCertId = container;
                    break;
                }
                usrlst = right;
            }
            if (userCertId === "") {
                parent.layer.alert("一证通设备中没有证书！", {icon: 0, title:'提示'});
            } else {
                var cert = XTXAPP.SOF_ExportUserCert(userCertId);
                if (cert !== "") {
                    // 进行签章
                    getSignInfo(userCertId, cert, viewOrDownload);
                } else {
                    parent.layer.alert("获取用户证书为空！", {icon: 0, title:'提示'});
                }
            }


        }
    }
}
//第二步
function getSignInfo(userCertId, cert, viewOrDownload) {
    $.ajax({
        url: '/zlpz-cjpt-web/syncsign/getHashFromPDF.do',
        type: 'POST',
        data: {
            "userCert": cert,
            "ysqxxid": $("#ysqxxid").val(),
            "gdslxDm": $("#gdslxDm").val(),
            "_query_string_": $("#_query_string_").val(),
            "_bizReq_path_": $("#_bizReq_path_").val()
        },
        dataType: 'json',
        beforeSend: function () {
            console.log("正在进行，请稍候");
        },
        success: function (responseStr) {
            if (responseStr.stat === "1") {

                signSh(userCertId, responseStr, viewOrDownload);
            } else {
                window.parent.layer.alert(responseStr, {icon: 0, title:'提示'});
            }
        },
        error: function (result) {
            parent.layer.open({
                type: 1,
                title: '信息',
                shadeClose: true,
                shade: 0.8,
                area: ['80%', '80%'],
                content: result.responseText
            });
        }
    });

}


//第三步
function signSh(userCertId, responseStr, viewOrDownload) {
    var plain = responseStr.shStrHash;
    // var devType = XTXAPP.GetDeviceInfo(usercertid, 4);
    var hash_alg = 2;
    var extSign = XTXAPP.SOF_SignHashData(userCertId, plain, hash_alg);
    createsign(extSign, viewOrDownload);
}

//第四步
function createsign(extSign, viewOrDownload) {
    $.ajax({
        url: '/zlpz-cjpt-web/syncsign/mergeSignedPDF.do',
        type: 'POST',
        data: {"extSign": extSign,
            "ysqxxid": $("#ysqxxid").val(),
            "gdslxDm": $("#gdslxDm").val(),
            "_query_string_": $("#_query_string_").val(),
            "_bizReq_path_": $("#_bizReq_path_").val()
        },
        dataType: 'json',
        beforeSend: function () {
            console.log("正在进行，请稍候");
        },
        success: function (responseStr) {
            if (responseStr.stat === "1") {
                signSucc(viewOrDownload);
            } else {
                parent.layer.alert(responseStr, {icon: 0, title:'提示'});
            }
        },
        error: function (result) {
            parent.layer.alert(result.responseText, {icon: 0, title:'提示'});
        }
    });
}

//签名成功
function signSucc(viewOrDownload) {
    var signedPdfUrl = '/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ywbm=' + $("#ywbm").val().toUpperCase()
        + '&gdslxDm=' + $("#gdslxDm").val()
        + '&_query_string_=' + encodeURIComponent($("#_query_string_").val())
        + '&ysqxxid=' + $("#ysqxxid").val()
        + '&viewOrDownload=download';
    parent.layer.confirm('尊敬的CA用户您好，系统已为您签名成功，为了给您提供更佳的办税体验，不再展现PDF凭证界面，您可以点击“申报”按钮直接进行申报提交操作，如果需要查看申报凭证，可以点击“下载凭证”按钮下载凭证文件到您的电脑，进行查看打印。', {
        icon: 1,
        title: '提示',
        btn2noclose: 1,
        btn: ['申报', '下载凭证'],
        btn2: function (index) {
            //下载凭证逻辑
            var url = '/zlpz-cjpt-web/zlpz/viewOrDownloadPdfFile.do?ywbm=' + $("#ywbm").val().toUpperCase() + '&gdslxDm=' + $("#gdslxDm").val()
                + '&_query_string_=' + encodeURIComponent($("#_query_string_").val()) + '&ysqxxid=' + $("#ysqxxid").val()
                + '&viewOrDownload=download&_bizReq_path_=' + _bizReq_path_;

            if (viewOrDownload !== 'view') {
                var form = $('<form method="POST" action="' + url + '"></form>');
                var iframe = $('<iframe name="fileDownload" style="display:none"></iframe>');
                $(document.body).append(iframe).append(form);
                form.submit();
            } else {
                parent.layer.open({
                    type: 2,
                    title: 'PDF凭证',
                    shadeClose: true,
                    shade: 0.8,
                    area: ['90%', '90%'],
                    content: signedPdfUrl
                });
            }
            return false;
        },
        cancel: function (index) {
            //右上角关闭回调
            parent.layer.close(index);
            $("body").unmask();
            prepareMakeFlag = true;
            return false;
        }
    }, function (index) {
        //TODO 申报提交逻辑
        parent.layer.close(index);
        submitPdf();
    });
}
