var getPhjmswsxDm = function (zsxmDm, bqsfsyxgmyhzc) {
    var skssqq = formData.qcs.initData.jzxx.skssqq;
    if (bqsfsyxgmyhzc == 'Y' && skssqq >= '2019-01-01') {
        switch (zsxmDm) {
            case '10109':
                return 'SXA031900988';
            case '30203':
                return 'SXA031900993';
            case '30216':
                return 'SXA031900994';
            default:
                return '';
        }
    } else {
        return '';
    }
}

var getPhjmxzDm = function (zsxmDm, bqsfsyxgmyhzc) {
    var skssqq = formData.qcs.initData.jzxx.skssqq;
    if (bqsfsyxgmyhzc == 'Y' && skssqq >= '2019-01-01') {
        switch (zsxmDm) {
            case '10109':
                return '0007049901';
            case '30203':
                return '0061049901';
            case '30216':
                return '0099049901';
            default:
                return '';
        }
    } else {
        return '';
    }
}

var getPhjzbl = function (zsxmDm, bqsfsyxgmyhzc) {
    var jzxxMxList = formData.qcs.initData.jzxx.jzxxMxList;
    var zsxm2jzbl = {};
    for (var index in jzxxMxList) {
        var jzxx = jzxxMxList[index];
        zsxm2jzbl[jzxx.zsxmDm] = jzxx.jzbl;
    }
    if (bqsfsyxgmyhzc == 'Y') {
        return zsxm2jzbl[zsxmDm];
    } else {
        return 0.00;
    }
}

// 关闭弹出框，自动提交

function autoSubmit(mess, index, isSecondCall) {
    parent.layer.close(index);

    var b = parent.layer.confirm(mess, {
        title: '提示',
        btn: ['确定']
    }, function (index) {
        parent.layer.close(b);
        prepareMake(isSecondCall);
    });
}

function refreshApply(node, value) {
    formulaEngine.apply(node, value);
    var $viewAppElement = $("#frmSheet").contents().find("#viewCtrlId");
    var viewEngine = $("#frmSheet")[0].contentWindow.viewEngine;
    var body = $("#frmSheet")[0].contentWindow.document.body;
    viewEngine.formApply($viewAppElement);
    viewEngine.tipsForVerify(body);
}

/**
 * 重写提交步骤，添加提交前校验和自动提交
 *
 * @param showDeclare
 * @param isSecondCall
 */

function prepareMakeXgm(showDeclare, isSecondCall) {

    var tip = true;
    // isSecondCall为true时，忽略进入下一步
    if (!(typeof(isSecondCall) !== 'undefined' && isSecondCall === true)) {
        var regEvent = new RegEvent();
        tip = regEvent.verifyAllComfirm(prepareMake);
        if (!tip) {
            // parent.layer.alert("表格存在填写错误的数据，请检查", {icon: 2});
            $("body").unmask();
            prepareMakeFlag = true;
            return;
        }

    }
    tip = false;
    if (tip) {

        var zzsxgmGridlb = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb;
        // 主表，判断起征点的数据---第1栏+第4栏+第7栏+第9栏+第13栏
        var zzsxgmqzd = parseFloat(zzsxgmGridlb[0].yzzzsbhsxse + zzsxgmGridlb[1].yzzzsbhsxse + zzsxgmGridlb[1].xsczbdcbhsxse + zzsxgmGridlb[0].xssygdysgdzcbhsxse + zzsxgmGridlb[0].msxse + zzsxgmGridlb[1].msxse + zzsxgmGridlb[0].ckmsxse + zzsxgmGridlb[1].ckmsxse);
        // 起征点，核心返回的货物起征点与服务起征点之间的最大值
        var qzd = Math.max(parseFloat(formData.qcs.initData.zzsxgmsbInitData.zzsxgmnsrQzd), parseFloat(formData.qcs.initData.zzsxgmsbInitData.zzsxgmnsrYsfwQzd));
        // 本期销售不动产的销售额
        var bdbdcxse = zzsxgmGridlb[1].bdcxse;

        // 免税销售额-小微企业免税销售 10行
        var msxw = zzsxgmGridlb[0].xwqymsxse + zzsxgmGridlb[1].xwqymsxse;
        // 免税销售额-未达起征点销售额 11行
        var mswdqzd = zzsxgmGridlb[0].wdqzdxse + zzsxgmGridlb[1].wdqzdxse;
        // 第1栏-第2栏+第7栏 的结果
        var yzgdxse = zzsxgmGridlb[0].yzzzsbhsxse + zzsxgmGridlb[1].yzzzsbhsxse + zzsxgmGridlb[0].xssygdysgdzcbhsxse - zzsxgmGridlb[1].swjgdkdzzszyfpbhsxse - zzsxgmGridlb[0].swjgdkdzzszyfpbhsxse;
        // 第1栏-第2栏+第7栏 的结果 1列
        //var yzgdxse = zzsxgmGridlb[0].yzzzsbhsxse  + zzsxgmGridlb[0].xssygdysgdzcbhsxse - zzsxgmGridlb[0].swjgdkdzzszyfpbhsxse;
        // 第4栏-第5栏 的结果  2列
        var yzdkxse = zzsxgmGridlb[1].xsczbdcbhsxse - zzsxgmGridlb[1].swjgdkdzzszyfpbhsxse1;
        //返回true为锁10行，使用11行进行判断；返回false为锁11行，使用10行进行判断。
        //有两列，有一列没锁则为改行没加锁
        var one = formData.qcs.initData.zzsxgmsbInitData.yqwrdzzsybnsrBz == 'Y' || formData.qcs.initData.zzsxgmsbInitData.yshwjlwRdzg == 'N'
            || ['410', '411', '412', '413', '430', '431', '432', '433'].indexOf(formData.qcs.initData.nsrjbxx.djzclxDm) != -1;
        var two = formData.qcs.initData.zzsxgmsbInitData.yqwrdzzsybnsrBz == 'Y' || formData.qcs.initData.zzsxgmsbInitData.ysfwRdzg == 'N'
            || ['410', '411', '412', '413', '430', '431', '432', '433'].indexOf(formData.qcs.initData.nsrjbxx.djzclxDm) != -1;
        var lockInput = !one ? false : two;
//		if(){
//
//		}
//		(!(formData.qcs.initData.zzsxgmsbInitData.10H1LLock) ? false : (formData.qcs.initData.zzsxgmsbInitData.10H2LLock));
        // （2）、（3）第1栏+第4栏+第7栏+第9栏+第13栏>起征点，且第10栏第1列+第2列无论是否有值，纳税人选择“提交”（“下一步”或“申报”按钮）的时候均提示。
        if (zzsxgmqzd > qzd && bdbdcxse == 0) {
            // 第10行数据的校验，使用11行格式是否为readonly来判断
            if (!lockInput) { // 11行锁定了，判断10行
                if (msxw == 0) {
                    var b = parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按照现行政策规定，小规模纳税人发生增值税应税销售行为，合计月销售额超过10万元（按季30万元），但扣除本期发生的销售不动产销售额后，未超过10万元（按季30万元）的，销售货物、劳务、服务、无形资产的月销售额可以免征增值税。您本期是否发生销售不动产的销售额？', {
                        // area: ['250px','150px'],
                        title: '提示',
                        btn: ['是', '否'],
                        // 2.2
                        yes: function (index) {
                            parent.layer.close(index);
                            parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为帮助您判断是否可以享受免征增值税政策，请准确录入本期销售不动产的销售额（<input placeholder="请输入销售额" type="text" id="bdcxse" style="border:1px solid #fff;border-bottom-color:#b5b5b5;width:130px;"/>）元。', {
                                title: '提示',
                                area: ['450px', '210px'],
                                btn: ['确定']
                            }, function (index, layero) {
                                var value = parseFloat($(layero).find('#bdcxse').val());
                                if (isNaN(value)) {
                                    return;
                                }
                                // 赋值到json中
                                formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = value;
                                // 刷新数据模型
                                refreshApply("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse", value);
                                // 2.2.1
                                if (zzsxgmqzd - value > qzd) {
                                    // 关闭弹出框，自动提交
                                    autoSubmit('本期销售额已达起征点，请继续申报。', index, isSecondCall);
                                } else if (zzsxgmqzd - value <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 2.2.2
                                    closeLayer('剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第10栏“小微企业免税销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。');
                                } else if (zzsxgmqzd - value <= qzd && !(yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 2.2.3
                                    // 关闭弹出框，自动提交
                                    autoSubmit('剔除不动产销售额后，本期销售额未达起征点，请继续申报。', index, isSecondCall);
                                }
                            });
                        },
                        // 2.1
                        btn2: function (index) {
                            // 关闭弹出框，自动提交
                            autoSubmit('本期销售额已达起征点，请继续申报。', index, isSecondCall);
                        }
                    });
                } else {

                    var b = parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按照现行政策规定，小规模纳税人发生增值税应税销售行为，合计月销售额超过10万元（按季30万元），但扣除本期发生的销售不动产销售额后，未超过10万元（按季30万元）的，销售货物、劳务、服务、无形资产的月销售额可以免征增值税。您本期是否发生销售不动产的销售额？', {
                        // area: ['250px','150px'],
                        title: '提示',
                        btn: ['是', '否'],
                        // 3.2
                        yes: function (index) {
                            parent.layer.close(index);
                            parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为帮助您判断是否可以享受免征增值税政策，请准确录入本期销售不动产的销售额（<input placeholder="请输入销售额" type="text" id="bdcxse" width="15px" style="border:1px solid #fff;border-bottom-color:#b5b5b5;width:130px;"/>）元。', {
                                title: '提示',
                                area: ['450px', '210px'],
                                btn: ['确定']
                            }, function (index, layero) {
                                var value = parseFloat($(layero).find('#bdcxse').val());
                                if (isNaN(value)) {
                                    return;
                                }
                                formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = value;
                                // 刷新数据模型
                                refreshApply("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse", value);
                                // 3.2.1
                                if (zzsxgmqzd - value > qzd) {
                                    // 关闭弹出框
                                    closeLayer('您本期销售额已达起征点，第10栏“小微企业免税销售额”不应有数。');
                                } else if (zzsxgmqzd - value <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 3.2.2
                                    closeLayer('剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第10栏“小微企业免税销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。');
                                } else if (zzsxgmqzd - value <= qzd && !(yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 2.2.3
                                    // 关闭弹出框，自动提交
                                    autoSubmit('剔除不动产销售额后，本期销售额未达起征点，请继续申报。', index, isSecondCall);
                                }
                            });
                        },
                        // 3.1
                        btn2: function (index) {
                            // 关闭弹出框
                            closeLayer('本期销售额已达起征点，第10栏“小微企业免税销售额”不应有数。');
                        }
                    });

                }
            }

            // 第11行数据的校验
            if (lockInput) { // 10行锁定了，判断11行
                if (mswdqzd == 0) {
                    var b = parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按照现行政策规定，小规模纳税人发生增值税应税销售行为，合计月销售额超过10万元（按季30万元），但扣除本期发生的销售不动产销售额后，未超过10万元（按季30万元）的，销售货物、劳务、服务、无形资产的月销售额可以免征增值税。您本期是否发生销售不动产的销售额？', {
                        // area: ['250px','150px'],
                        title: '提示',
                        btn: ['是', '否'],
                        // 2.2
                        yes: function (index) {
                            parent.layer.close(index);
                            parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为帮助您判断是否可以享受免征增值税政策，请准确录入本期销售不动产的销售额（<input placeholder="请输入销售额" type="text" id="bdcxse" style="border:1px solid #fff;border-bottom-color:#b5b5b5;width:130px;"/>）元。', {
                                title: '提示',
                                area: ['450px', '210px'],
                                btn: ['确定']
                            }, function (index, layero) {
                                var value = parseFloat($(layero).find('#bdcxse').val());
                                if (isNaN(value)) {
                                    return;
                                }
                                // 赋值到json中
                                formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = value;
                                // 刷新数据模型
                                refreshApply("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse", value);
                                // 2.2.1
                                if (zzsxgmqzd - value > qzd) {
                                    // 关闭弹出框，自动提交
                                    autoSubmit('本期销售额已达起征点，请继续申报。', index, isSecondCall);
                                } else if (zzsxgmqzd - value <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 2.2.2
                                    closeLayer('剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第11栏“未达起征点销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。');
                                } else if (zzsxgmqzd - value <= qzd && !(yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 2.2.3
                                    // 关闭弹出框，自动提交
                                    autoSubmit('剔除不动产销售额后，本期销售额未达起征点，请继续申报。', index, isSecondCall);
                                }
                            });
                        },
                        // 2.1
                        btn2: function (index) {
                            // 关闭弹出框，自动提交
                            autoSubmit('本期销售额已达起征点，请继续申报。', index, isSecondCall);
                        }
                    });
                } else {

                    var b = parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按照现行政策规定，小规模纳税人发生增值税应税销售行为，合计月销售额超过10万元（按季30万元），但扣除本期发生的销售不动产销售额后，未超过10万元（按季30万元）的，销售货物、劳务、服务、无形资产的月销售额可以免征增值税。您本期是否发生销售不动产的销售额？', {
                        // area: ['250px','150px'],
                        title: '提示',
                        btn: ['是', '否'],
                        // 3.2
                        yes: function (index) {
                            parent.layer.close(index);
                            parent.layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为帮助您判断是否可以享受免征增值税政策，请准确录入本期销售不动产的销售额（<input placeholder="请输入销售额" type="text" id="bdcxse" style="border:1px solid #fff;border-bottom-color:#b5b5b5;width:130px;"/>）元。', {
                                title: '提示',
                                area: ['450px', '210px'],
                                btn: ['确定']
                            }, function (index, layero) {
                                var value = parseFloat($(layero).find('#bdcxse').val());
                                if (isNaN(value)) {
                                    return;
                                }
                                formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = value;
                                // 刷新数据模型
                                refreshApply("zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse", value);
                                // 3.2.1
                                if (zzsxgmqzd - value > qzd) {
                                    // 关闭弹出框
                                    closeLayer('您本期销售额已达起征点，第11栏“未达起征点销售额”不应有数。');
                                } else if (zzsxgmqzd - value <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 3.2.2
                                    parent.layer.confirm('剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第11栏“未达起征点销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。', {
                                        title: '提示',
                                        btn: ['确定']
                                    }, function (index) {
                                        // 阻断性提示
                                        parent.layer.close(index);
                                    });
                                } else if (zzsxgmqzd - value <= qzd && !(yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != value))) {
                                    // 2.2.3
                                    // 关闭弹出框，自动提交
                                    autoSubmit('剔除不动产销售额后，本期销售额未达起征点，请继续申报。', index, isSecondCall);
                                }
                            });
                        },
                        // 3.1
                        btn2: function (index) {
                            // 关闭弹出框
                            closeLayer('本期销售额已达起征点，第11栏“未达起征点销售额”不应有数。');
                        }
                    });

                }
            }
            return;
        }
        // 填了本期销售不动产的销售额被阻断后再点击申报时的处理，没通过还是需要阻断
        if (zzsxgmqzd > qzd && bdbdcxse > 0) {
            if (!lockInput) { // 11行锁定了，判断10行
                if ((msxw == 0 && zzsxgmqzd - bdbdcxse <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != bdbdcxse)))
                    || (msxw > 0 && zzsxgmqzd - bdbdcxse <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != bdbdcxse)))) { // 2.2.2 && 3.2.1
                    // 关闭弹出框
                    closeLayer('剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第10栏“小微企业免税销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。');
                    return;
                } else if (zzsxgmqzd - bdbdcxse > qzd) {
                    if (msxw > 0) {
                        // 3.2.1
                        // 关闭弹出框
                        closeLayer('您本期销售额已达起征点，第10栏“小微企业免税销售额”不应有数。');
                    } else if (msxw == 0) {
                        //2.2.1
                        // 关闭弹出框，自动提交
                        autoSubmit('本期销售额已达起征点，请继续申报。', index, isSecondCall);
                    }
                    return;
                } else if (msxw >= 0 && zzsxgmqzd - bdbdcxse <= qzd && !(yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != bdbdcxse))) {
                    // 关闭弹出框，自动提交
                    autoSubmit('剔除不动产销售额后，本期销售额未达起征点，请继续申报。', index, isSecondCall);
                    return;
                }
            } else if (lockInput) { // 10行锁定了，判断11行
                if ((mswdqzd == 0 && zzsxgmqzd - bdbdcxse <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != bdbdcxse)))
                    || (mswdqzd > 0 && zzsxgmqzd - bdbdcxse <= qzd && (yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != bdbdcxse)))) { // 2.2.2 && 3.2.1
                    // 关闭弹出框
                    closeLayer('剔除不动产销售额后，您本期销售额未达起征点，请将除不动产销售额之外的本期应征增值税销售额（不含开具及代开专用发票销售额）对应填写在第11栏“未达起征点销售额”中；适用增值税差额征收政策的纳税人填写差额后的销售额，差额部分填写在附列资料对应栏次中。');
                    return;
                } else if (zzsxgmqzd - bdbdcxse > qzd) {
                    if (mswdqzd > 0) {
                        // 3.2.1
                        // 关闭弹出框
                        closeLayer('您本期销售额已达起征点，第11栏“未达起征点销售额”不应有数。');
                    } else if (mswdqzd == 0) {
                        //2.2.1
                        // 关闭弹出框，自动提交
                        autoSubmit('本期销售额已达起征点，请继续申报。', index, isSecondCall);
                    }
                    return;
                } else if (mswdqzd >= 0 && zzsxgmqzd - bdbdcxse <= qzd && !(yzgdxse > 0 || (yzdkxse > 0 && yzdkxse != bdbdcxse))) {
                    // 关闭弹出框，自动提交
                    autoSubmit('剔除不动产销售额后，本期销售额未达起征点，请继续申报。', index, isSecondCall);
                    return;
                }
            }
        }
    }
    prepareMake(isSecondCall);
    return;
}

/***
 * 返回true为锁11行，使用10行进行判断；
 * 返回false为锁10行，使用11行进行判断。
 */
function lock10OR11() {
    if (("readonly" == $("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[0].xwqymsxse']").attr("readonly")
        || "readonly" == $("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[1].xwqymsxse']").attr("readonly"))
        && ($("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[0].wdqzdxse']").attr("readonly") == null
            || $("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[1].wdqzdxse']").attr("readonly") == null)) {
        return false;//11行放开，锁定10行
    } else if (("readonly" == $("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[0].wdqzdxse']").attr("readonly")
        || "readonly" == $("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[1].wdqzdxse']").attr("readonly"))
        && ($("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[0].xwqymsxse']").attr("readonly") == null
            || $("#frmSheet").contents().find("input[ng-model='zzsxgmGrid.zzsxgmGridlb[1].xwqymsxse']").attr("readonly") == null)) {
        return true;//10行放开，锁定11行
    }
}

function closeLayer(mes) {
    // 关闭弹出框
    var lay = parent.layer.confirm(mes, {
        title: '提示',
        btn: ['确定']
    }, function (index) {
        // 阻断性提示
        parent.layer.close(lay);
    });
}

var showTip = function () {
    layer.alert('尊敬的纳税人，您好！为全面贯彻党中央国务院减税降费决策部署，落实好提高增值税小规模纳税人起征点政策，申报系统会帮助您判断是否可以享受免征增值税政策，在您申报的过程中可能会出现一些提示信息，请您认真阅读，并按照相关指引进行操作，非常感谢您的支持配合！', {
        'icon': 0
    })
}

var cshBdcxse = function (dzdzkljxse) {
    var swjgDm = formData.qcs.initData.nsrjbxx.swjgDm.substring(0,3);
    if(swjgDm == "161" || swjgDm == "261"){
        if(dzdzkljxse>0){
            formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = dzdzkljxse;
            //如果有值，直接弹出提示“本期不动产销售额为**元，不包括出租不动产销售额，如带出不动产销售额错误，请按实际修改”
            layer.alert('本期不动产销售额为'+dzdzkljxse+'元，不包括出租不动产销售额，如带出不动产销售额错误，请按实际修改！', {
                icon: '0',
                title: '提示',
                btn: ['知道了']
            });
        }
    }
}

var bdcxseTip = function (bdcxse, dzdzkljxse) {
    var swjgDm = formData.qcs.initData.nsrjbxx.swjgDm.substring(0,3);
    if(swjgDm == "161" || swjgDm == "261"){
        if((dzdzkljxse=="" || dzdzkljxse=="0") && bdcxse!="" && bdcxse!="0" && bdcxse!=dzdzkljxse){
            //纳税人如果填写了“不动产销售额”，弹框提示“系统没有查询到你的本期不动产销售额数据，请确认。如果实际确实发生，请点击“继续填写”，如果实际没有发生，请点击“取消”。”
            var mes = '“系统没有查询到你的本期不动产销售额数据，请确认。如果实际确实发生，请点击“继续填写”，如果实际没有发生，请点击“取消”！';
            var lay = parent.layer.confirm(mes, {
                title: '提示',
                icon: '3',
                btn: ['继续填写','取消'],
                yes:function(index) {
                    parent.layer.close(lay);
                },
                btn2:function(index) {
                    // 取消返回之前的值
                    formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse = 0;
                    var _jpath = "zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[1].bdcxse";
                    refreshApply(_jpath, 0);
                    parent.layer.close(lay);
                }
            });
        }
    }

}


//核定销售额未达起征点，必须填写主表第11行“未达起征点销售额”,QHGSDZSWJ-803
var initWdqzdxse = function (index) {
    //更正申报则返回原值
    if (indexOf(location.href,'gzsb=zx') > -1 || indexOf(location.href,'gzsb=lx') > -1 || indexOf(location.href,'gzsb=Y') > -1) {
        return formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[index].wdqzdxse;
    }
    //核定销售额
    var hdxse = formData.qcs.initData.zzsxgmsbInitData.dqdeYshwlwHdxse + formData.qcs.initData.zzsxgmsbInitData.dqdeYsfwHdxse;
    //起征点
    var qzd = ROUND(MAX(formData.qcs.initData.zzsxgmsbInitData.zzsxgmnsrQzd, formData.qcs.initData.zzsxgmsbInitData.zzsxgmnsrYsfwQzd),2);
    if (formData.qcs.initData.zzsxgmsbInitData.dqdeBz == "Y" && hdxse <= qzd) {
        return formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[index].hdxse;
    }

    return formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid.zzsxgmGridlb[index].wdqzdxse;
}

/**
 * 申报提交时框架校验成功后的业务特有校验，空方法，预留给产品具体业务实现
 * @param callBeforSubmitForm ：回调方法，调用表单提交前的业务特有提示
 * @param callSubmitForm ：回调方法，调用表单提交
 * @param params : 回调参数
 */
function doAfterVerify(callBeforSubmitForm, callSubmitForm, params) {
    var xw = 0;
    //获取差额标志 1是差额  0非差额
    var cebz = formData.qcs.initData.zzsxgmsbInitData.cebz;
    //获取小微起征点
    var wdqzd = formData.qcs.initData.zzsxgmsbInitData.wdqzd;
    if (cebz == 0) {//非差额
        //获取增值税纳税申报表（适用增值税小规模纳税人）主表
        var zzsxgmzb = formData.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid;
        xw = zzsxgmzb.zzsxgmGridlb[0].yzzzsbhsxse + zzsxgmzb.zzsxgmGridlb[1].yzzzsbhsxse
            + zzsxgmzb.zzsxgmGridlb[1].xsczbdcbhsxse + zzsxgmzb.zzsxgmGridlb[0].xssygdysgdzcbhsxse
            + zzsxgmzb.zzsxgmGridlb[0].msxse + zzsxgmzb.zzsxgmGridlb[1].msxse
            + zzsxgmzb.zzsxgmGridlb[0].ckmsxse + zzsxgmzb.zzsxgmGridlb[1].ckmsxse;
    } else if (cebz == 1) { //差额
        //获取差额征税辅助填报工具表
        var cezsXgmFztbgj = formData.zzssyyxgmnsrySbSbbdxxVO.cezsXgmFztbgj;
        //获取增值税纳税申报表（适用增值税小规模纳税人）
        var zzsxgmflzl = formData.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl;
        //计算纳税人填表数据是否符合小微标准
        xw = cezsXgmFztbgj.fztbgjList[0].hjxse + cezsXgmFztbgj.fztbgjList[4].hjxse + cezsXgmFztbgj.fztbgjList[5].kchhsxse
            + cezsXgmFztbgj.fztbgjList[6].hjxse + cezsXgmFztbgj.fztbgjList[7].kchhsxse + zzsxgmflzl.flzlForm.ysfwxsbhsxse
            + zzsxgmflzl.flzlForm.ysfwxsbhsxse5;
    }
    //判断小规模纳税人申报收入是否满足小微标准且大于0
    if (xw > 0 && xw <= wdqzd) {
        var proMessage = "<div style=\"padding-left:20px;\"> &nbsp; &nbsp;&nbsp;&nbsp;根据《财政部 税务总局关于实施小微企业普惠性税收减免政策的通知》（财税[2019]13号）、《国家税务总局关于小规模纳税人免征增值税政策有关征管问题的公告》（国家税务总局公告2019年第4号）的规定，您已满足并享受相关小微政策。</div><br/>";
        parent.layer.confirm(proMessage, {
            area: ['500px', '250px'],
            title: '提示',
            closeBtn: 0,
            btn: '阅读完毕',
        }, function (index) {
            parent.layer.close(index);
            // 执行回调函数
            callBeforSubmitForm(callSubmitForm, params);
        });
    } else {
        callBeforSubmitForm(callSubmitForm, params);
    }
}


/**
 * 获取小规模附列资料本期扣除额，默认为 0
 */
function GET_XGMFLZL_BQKCE_NUM() {
    var data = this.formData;
    var zzsxgmflzl = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl;
    var a = 0.00;
    if (zzsxgmflzl == undefined) {
        return a;
    } else {
        var bqkce = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl.flzlForm._bqkce;
        return bqkce;
    }
}

/**
 * 获取小规模附列资料本期扣除额5，默认为 0
 */
function GET_XGMFLZL_BQKCE5_NUM() {
    var data = this.formData;
    var zzsxgmflzl = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl;
    var a = 0.00;
    if (zzsxgmflzl == undefined) {
        return a;
    } else {
        var bqkce5 = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl.flzlForm._bqkce5;
        return bqkce5;
    }
}

/**
 * 获取小规模销售不动产情况表不含税销售额，默认为 0
 */
function GET_XGMXSBDC_BHSXSE_NUM() {
    var data = this.formData;
    var xgmZzsXsbdcQkb = data.zzssyyxgmnsrySbSbbdxxVO.xgmZzsXsbdcQkb;
    var a = 0.00;
    if (xgmZzsXsbdcQkb == undefined) {
        return a;
    } else {
        var bhsxse = data.zzssyyxgmnsrySbSbbdxxVO.xgmZzsXsbdcQkb.xsbdcbhsxse;
        return bhsxse;
    }
}


/**
 * 获取小规模附列资料全部含税收入，默认为 0
 */
function GET_XGMFLZL_QBHSSR_NUM() {
    var data = this.formData;
    var zzsxgmflzl = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl;
    var a = 0.00;
    if (zzsxgmflzl == undefined) {
        return a;
    } else {
        var ysfwxsqbhssr = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl.flzlForm.ysfwxsqbhssr;
        return ysfwxsqbhssr;
    }
}

/**
 * 获取小规模附列资料全部含税收入5，默认为 0
 */
function GET_XGMFLZL_QBHSSR5_NUM() {
    var data = this.formData;
    var zzsxgmflzl = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl;
    var a = 0.00;
    if (zzsxgmflzl == undefined) {
        return a;
    } else {
        var ysfwxsqbhssr5 = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl.flzlForm.ysfwxsqbhssr5;
        return ysfwxsqbhssr5;
    }
}


/**
 * 获取小规模小微判断
 * return   N  非小微
 *          Y  全部收入小微
 *          T  剔除不动产后小微（提示纳税人持不动产发票原件至办税服务厅手工校验）
 */
function GET_XGMXWPD() {
    var data = this.formData;
    var zzsxgmxsbdc = data.zzssyyxgmnsrySbSbbdxxVO.xgmZzsXsbdcQkb;
    var zzsxgmfztbgj = data.zzssyyxgmnsrySbSbbdxxVO.cezsXgmFztbgj;
    var wdqzd = this.formData.qcs.initData.zzsxgmsbInitData.wdqzd;
    var cebz = this.formData.qcs.initData.zzsxgmsbInitData.cebz;
    var zzsxgmzb = data.zzssyyxgmnsrySbSbbdxxVO.zzssyyxgmnsr.zzsxgmGrid;
    var zzsxgmflzl = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl;
    var xwbz = 'Y';
    var xsbdc1a = 0.00;
    var xsbdc1c = 0.00;
    if (zzsxgmxsbdc == undefined) {
        xsbdc1a = 0.00;
        xsbdc1c = 0.00;
    } else {
        xsbdc1a = data.zzssyyxgmnsrySbSbbdxxVO.xgmZzsXsbdcQkb.xsbdcbhsxseceq;
        xsbdc1c = data.zzssyyxgmnsrySbSbbdxxVO.xgmZzsXsbdcQkb.xsbdcbhsxseceh;
    }
    var flzl8 = 0.00;
    var flzl16 = 0.00;
    if (zzsxgmflzl == undefined) {
        flzl8 = 0.00;
        flzl16 = 0.00;
    } else {
        flzl8 = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl.flzlForm.ysfwxsbhsxse;
        ;
        flzl16 = data.zzssyyxgmnsrySbSbbdxxVO.zzsxgmflzl.flzlForm.ysfwxsbhsxse5;
        ;
    }
    if (cebz == 1) {
        //差额
        //辅助填报工具“3%征收率的货物及加工修理修配劳务”行次第七列“合计 销售额” fztbgjList[0].hjxse
        // +“其他免税 货物及加工修理修配劳务”第七列“合计 销售额”             fztbgjList[4].hjxse
        // +“其他免税 服务、不动产和无形资产”第十一列“扣除后 含税(免税)销售额” fztbgjList[5].kchhsxse
        // +“出口免税 货物及加工修理修配劳务”第七列“合计 销售额”             fztbgjList[6].hjxse
        // +“出口免税 服务、不动产和无形资产”第十一列“扣除后 含税(免税)销售额” fztbgjList[7].kchhsxse
        // +附列资料第八栏“不含税销售额”                                 flzlForm.ysfwxsbhsxse
        // +附列资料第十六栏“不含税销售额”                                flzlForm.ysfwxsbhsxse5
        // -不动产表第1c栏＞10万（按季30万）时：xsbdc1c
        if (zzsxgmfztbgj.fztbgjList[0].hjxse + zzsxgmfztbgj.fztbgjList[4].hjxse + zzsxgmfztbgj.fztbgjList[5].kchhsxse + zzsxgmfztbgj.fztbgjList[6].hjxse + zzsxgmfztbgj.fztbgjList[7].kchhsxse + flzl8 + flzl16 - xsbdc1c > wdqzd) {
            return 'N';
        } else {
            if (zzsxgmfztbgj.fztbgjList[0].hjxse + zzsxgmfztbgj.fztbgjList[4].hjxse + zzsxgmfztbgj.fztbgjList[5].kchhsxse + zzsxgmfztbgj.fztbgjList[6].hjxse + zzsxgmfztbgj.fztbgjList[7].kchhsxse + flzl8 + flzl16 > wdqzd) {
                return 'T';
            } else {
                return 'Y';
            }
        }
    } else {
        //非差额
        //当主表第1行（货+服）+第4行（服）+第7行（货）+第9行（货+服）+第13行（货+服）-不动产表第1A栏＞10万（按季30万）时 非小微
        if (zzsxgmzb.zzsxgmGridlb[0].yzzzsbhsxse + zzsxgmzb.zzsxgmGridlb[1].yzzzsbhsxse + zzsxgmzb.zzsxgmGridlb[1].xsczbdcbhsxse + zzsxgmzb.zzsxgmGridlb[0].xssygdysgdzcbhsxse + zzsxgmzb.zzsxgmGridlb[0].msxse + zzsxgmzb.zzsxgmGridlb[1].msxse + zzsxgmzb.zzsxgmGridlb[0].ckmsxse + zzsxgmzb.zzsxgmGridlb[1].ckmsxse - xsbdc1a > wdqzd) {
            return 'N';
        } else {
            //当主表第1行（货+服）+第4行（服）+第7行（货）+第9行（货+服）+第13行（货+服）＞10万（按季30万）时 且 当主表第1行（货+服）+第4行（服）+第7行（货）+第9行（货+服）+第13行（货+服）-不动产表第1A栏《=10万（按季30万） 剔除后小微

            if (zzsxgmzb.zzsxgmGridlb[0].yzzzsbhsxse + zzsxgmzb.zzsxgmGridlb[1].yzzzsbhsxse + zzsxgmzb.zzsxgmGridlb[1].xsczbdcbhsxse + zzsxgmzb.zzsxgmGridlb[0].xssygdysgdzcbhsxse + zzsxgmzb.zzsxgmGridlb[0].msxse + zzsxgmzb.zzsxgmGridlb[1].msxse + zzsxgmzb.zzsxgmGridlb[0].ckmsxse + zzsxgmzb.zzsxgmGridlb[1].ckmsxse > wdqzd) {
                return 'T';
            } else {
                //当主表第1行（货+服）+第4行（服）+第7行（货）+第9行（货+服）+第13行（货+服）《=10万（按季30万）时 小微
                return 'Y'
            }

        }
    }

}
/**
 * 校验本期发生额额度，根据核心的参数配置和采集的人数做限制
 * */
function XGMZZS_jyBqfse(hmc,swsxDm,bqfse){
    var flag = true;
    if(hmc==null || hmc==undefined || hmc==""){
        return flag;
    }
    if(swsxDm==null || swsxDm==undefined || swsxDm==""){
        return flag;
    }
    //参数值格式：GTTYSB:14400,GTZDRY:14400,QYTYSB:7800,QYZDRY:7800
    var jzlxCsz = formData.qcs.initData.zzsxgmsbInitData.jzlxCsz;
    if(jzlxCsz==null || jzlxCsz==undefined || jzlxCsz==""){
        return flag;
    }
    var qytysbcj = formData.qcs.initData.zzsxgmsbInitData.qytysbcj;
    var qyzdrq = formData.qcs.initData.zzsxgmsbInitData.qyzdrq;
    var qytysbcjrs = formData.qcs.initData.zzsxgmsbInitData.qytysbcjrs;
    var qyzdrqcjrs = formData.qcs.initData.zzsxgmsbInitData.qyzdrqcjrs;
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
