

$(document).ready(function () {
    window.setTimeout(function () {
        getTzggs();
    }, 500);
});
var tzggsubmit="/xxmh/bj/tzgg/submit.do";
var tzggquery = "/xxmh/bj/tzgg/query.do";
var bjtzggdcwj=undefined;
function getTzggs() {
    $.ajax({
        type: "POST",
        url: tzggquery,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            if (data.flag) {
                var tzggs = JSON.parse(data.tzggs);
                if (tzggs.length > 0) {
                    opentzgg(tzggs);
                }
            }
        }
    });
}

function opentzgg(tzggs) {
    if(tzggs==undefined){
        return;
    }
    if(tzggs.length==0){
        return;
    }
    var item = tzggs.pop();
    var tzgg = item.tzgg;
    if(typeof (tzgg)=="undefined"){
        opentzgg(tzggs);
        return;
    }
    var content = tzgg.tznr;
    var title=tzgg.tzmc;
    var sfbd=tzgg.sfbd;
    var sfyfb = tzgg.sfyfb;
    var length = tzggs.length;
    var buttonName = "";
    if (length == 0) {
        buttonName = "确定";
    } else {
        buttonName = "下一条";
    }
    layer.ready(function () {
        var gglayerIndex = layer.open({
            shade: 0.3,
            shadeClose: sfbd != "Y",
            title:[title,'text-align:center;font-size:20px;font-weight:bold'],
            area:'850px',
            content: content,
            btn: buttonName,
            btnAlign: 'c',
            closeBtn: 0,
            yes:function(openindex,layero){
                if(sfyfb=="Y"){
                    layer.prompt({
                        formType: 2,
                        value: '',
                        title: '请填入说明',
                        area: ['800px', '350px'], //自定义文本域宽高
                        yes: function(index, layero){
                            // 获取文本框输入的值
                            var value = layero.find(".layui-layer-input").val();
                            value = $.trim(value);
                            if (value) {
                                bjtzggdcwj={"description":value};
                                layer.close(index);
                                layer.close(openindex);
                            } else {
                                layer.tips('请填写说明内容', '.layui-layer-input', {
                                    tips: 4
                                });
                            }
                        }
                    });
                }else{
                    layer.close(openindex);
                }

            },
            end: function () {
                var params={};
                params.id=tzgg.id;
                params.uuid=item.uuid;
                params.dcwj=bjtzggdcwj;
                bjtzggsubmit(params,tzggs,item);
                if (length > 0) {
                    opentzgg(tzggs);
                }
            }
        });

    });
}

function bjtzggsubmit(params,tzggs,item) {
    $.ajax({
        type: "POST",
        url: tzggsubmit,
        data: JSON.stringify(params),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            bjtzggdcwj=undefined;
            if (data.flag) {

            }else{
                tzggs.push(item);
            }
        },
        error:function () {
            bjtzggdcwj=undefined;
            tzggs.push(item);
            layer.alert('提交发生异常', {icon: 5},function (index) {
                tzggs.push(item);
                layer.close(index);
            });

        }
    });
}