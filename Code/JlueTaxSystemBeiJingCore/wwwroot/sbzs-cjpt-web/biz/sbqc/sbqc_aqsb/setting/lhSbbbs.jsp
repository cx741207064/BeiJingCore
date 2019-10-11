
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE">
<meta http-equiv="pragma" content="no-cache">  
<meta http-equiv="cache-control" content="no-cache">  
<meta http-equiv="expires" content="0">  
<title>国地联合申报表</title>


 <script type="text/javascript">var cp = '/sbzs-cjpt-web';var contextRoot="/sbzs-cjpt-web";</script>
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/resources/css/comon0.css" />
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script> 
<script type="text/javascript" src="/sbzs-cjpt-web/resources/js/lib/angular.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/_res_/js/abacus/exAlert.js"></script>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/resources/js/nssb/sbqc/sbqc_aqsb.js"></script>

<!--4.0版本UI  -->
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/resources4/layui/css/layui.css" id="layui_layer_skinlayercss"/>
<link rel="stylesheet" type="text/css" href="/sbzs-cjpt-web/abacus/resources4/tax-font-icon/iconfont.css"/>
<script type="text/javascript" src="/sbzs-cjpt-web/abacus/resources4/layui/layui.js"></script>
<link rel="stylesheet" href="/sbzs-cjpt-web/abacus/resources4/tax-css/common.css">

<style>
.layui-layer-loading{
	left: 50%!important;
}
.font-x th, .font-x td{
	font-size: 12px!important;
}
.font-x th{
	font-weight: 700;
}


        .white_content {
            display: none;
            position: absolute;
            top: 5%;
            left: 25%;
            width: 50%;
            /*height: 55%;*/
            padding: 50px;
            border: 3px solid #2191da;
            background-color: white;
            z-index:1002;
            overflow: auto;
            line-height: 30px;
        }

</style>
</head>
<body>
	<div ng-app="viewApp" ng-controller="viewCtrl" id="viewCtrlid">

    <div id="light" class="white_content ">

        <table style="width:100%;"   border="0" cellpadding="0" cellspacing="1" >

            <tr >
                <td>&nbsp;&nbsp;&nbsp;&nbsp;尊敬的纳税人：根据北京市财政局 国家税务总局北京市税务局《转发财政部 税务总局关于实施小微企业普惠性税收减免政策的通知》（京财税〔2019〕196号）规定，2019年1月1日至2021年12月31日，对增值税小规模纳税人减按50%征收资源税（不含水资源税）、城市维护建设税、房产税、城镇土地使用税、印花税（不含证券交易印花税）、耕地占用税和教育费附加、地方教育附加。<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;（注：补缴以前年度地方税费的，不享受此优惠。）<br/><br/><br/><br/>
                </td>
            </tr>

            <tr >
                <td align="center" ><input type="button" style="width:100px;height:30px; "  onclick = "closeDialog()" value="阅读完毕"></td>
            </tr>

        </table>

    </div>

	<ng-codetable url="dm_sb_sbywbmxmc.json" name="sbywbmCT" node="" dm="" mc=""></ng-codetable>
	<!-- 清册申报表格，可覆盖，但不建议覆盖  -->
	<div class="sh_title01 sh_title02" style="width: 99%;border-bottom: none;">
		<div id="gdslhsfsb"  class="tax-title marginB16 blold"><i class="dot" style="height: 16px;top: 11px;"></i>税费申报</div>
	</div>
	<div class="searchbox">
		<div class="searchTable">
			<table width="99%" border="0" cellspacing="0" cellpadding="0" id="gdslhsb" style="border-collapse: collapse">
				<tr>
					<th width="50px">序号</th>
					<th ng-if="showGdsbz == 'Y' || showGdsbz == ''" width="50px">国地标志</th>
					<th ng-if="sbqcShowms != 'SBB'" width="270">征收项目</th>
					<th ng-if="sbqcShowms != 'SBB'" width="270">征收品目</th>
					<th ng-if="sbqcShowms == 'SBB'" width="540">申报表</th>
					<th width="120px">税（费）款所属期起</th>
					<th width="120px">税（费）款所属期止</th>
					<th width="120px">申报期限</th>
					<th width="120px">申报日期</th>
					<th width="120px">操作</th>
					<th width="30">
						
						<a class="link-strong remove-line iconfont fsicon-refresh " href="javaScript:refreshSbqc()" title="刷 新" style="text-decoration: none"></a>
					</th>
				</tr>
				<tr ng-repeat="item in qcitems">
					<td width="30px" align="center" ng-cloak ng-bind="$index + 1"></td>
					<td width="50px" align="center" ng-if="showGdsbz == 'Y' || showGdsbz == ''"  ng-bind-html="item.gdslxDm | gdslxDmFilter | to_trusted"></td>
					<td width="270" align="left" ng-if="sbqcShowms != 'SBB'" ng-cloak ng-bind="item.zsxmMc"></td>
					<td width="270" align="left" ng-if="sbqcShowms != 'SBB'" ng-cloak ng-bind="item.zspmMc"></td>
					<td width="540" align="left" ng-if="sbqcShowms == 'SBB'" ng-cloak ng-bind="CT.sbywbmCT[item.sbywbm]"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.skssqQ"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.skssqZ"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.sbqx"></td>
					<td width="120px" align="center" ng-cloak ng-bind="item.sbrq"></td>
					<td width="120px" align="center" ng-cloak ng-bind-html="item | sbztDmFilter | to_trusted"></td>
					<td width="10"  align="center" ng-cloak ng-bind-html="item | uuidFilter:$index | to_trusted"></td>
				</tr>
				<tr ng-cloak ng-if="qcitems.length <= 0">
					<td colspan="10" align="center"><font color="red">没有申报清册信息</font></td>
				</tr>
			</table>
		</div>
	</div>
	<!-- 特色区域，可覆盖，自行覆盖 初始化时，暂时不加载子页面，目的为了让按期应申报的初始化方法先加载，等初始化方法发起请求后再架子扩展页面-->
	
	<iframe id="aqsbkzIframe" width ="100%" frameborder="0" scrolling="no" style="border:0px"></iframe>
	<!-- 财报申报表格，可覆盖，但不建议覆盖  -->
	<div class="sh_title01 sh_title02" style="width: 99%;border-bottom: none;">
		<div id="gdslhcwbbbs" class="tax-title marginB16 blold"><i class="dot" style="height: 16px;top: 11px;"></i>财务报表报送</div>
	</div>
	<div class="searchbox">
		   <div class="searchTable">
				<table width="99%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse">
					<tr style="height: 44px">
						<th width="50px">序号</th>
						<th ng-if="showGdsbz == 'Y' || showGdsbz == ''" width="50px">国地标志</th>
						<th width="270">财务、会计制度</th>
						<th width="270">财务报表报送小类</th>
						<th width="120px">报送所属期起</th>
						<th width="120px">报送所属期止</th>
						<th width="120px">报送期限</th>
						<th width="120px">报送日期</th>
						<th width="120px">操作</th>
					</tr>
					<tr ng-repeat="item in cbitems">
						<td width="30px" align="center" ng-cloak ng-bind="$index + 1"></td>
						<td width="50px" align="center" ng-cloak ng-if="showGdsbz == 'Y' || showGdsbz == ''" ng-bind-html="item.gdsbz | cbgdsbzFilter | to_trusted"></td>
						<td width="270" align="left" ng-cloak ng-bind="item.cwkjzd"></td>
						<td width="270" align="left" ng-cloak ng-bind="item.cwbsxlmc"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsssqQ"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsssqZ"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsqx"></td>
						<td width="120px" align="center" ng-cloak ng-bind="item.bsrq"></td>
						<td width="120px" align="center" ng-cloak ng-bind-html="item | cbBtnFilter | to_trusted"></td>
					</tr>
					<!-- 未启用国地财报模式 -->
					<tr ng-cloak ng-if="cbitems.length == 0 && gdbamsBz==''">
						<td colspan="9" align="center"><font ng-if="cwbbzzfDm==1 && (showGdsbz == 'Y' || showGdsbz == '')">你在国税</font><font ng-if="cwbbzzfDm==2 && (showGdsbz == 'Y' || showGdsbz == '')">你在地税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N',cwbbzzfDm);return false;" href="#" target='_blank' ng-show="showCburlbz">现在去备案</a><br/>
						</td>
					</tr>
					<!-- 国无地无财报 -->
					<tr ng-cloak ng-if="cbitems.length == 0 && gdbamsBz=='GWDW'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在国税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','1');return false;" href="#" target='_blank' ng-show="showGsCburlBz">现在去备案</a><br/>
						</td>
					</tr>
					<tr ng-cloak ng-if="cbitems.length == 0 && gdbamsBz=='GWDW'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在地税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','2');return false;" href="#" target='_blank' ng-show="showDsCburlBz">现在去备案</a><br/>
						</td>
					</tr>
					<!-- 国无地有财报 -->
					<tr ng-cloak ng-if="cbitems.length > 0 && gdbamsBz=='GWDY'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在国税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','1');return false;" href="#" target='_blank' ng-show="showGsCburlBz">现在去备案</a><br/>
						</td>
					</tr>
					<!--地有国无财报  -->
					<tr ng-cloak ng-if="cbitems.length > 0 && gdbamsBz=='GYDW'">
						<td colspan="9" align="center"><font ng-if="showGdsbz=='Y' || showGdsbz==''">你在地税</font><font>未做财务报表备案或本月非报送期，如未做财务报表备案,请先填报“财务会计制度及核算软件备案报告”</font>
							<a class="link-strong" onclick="JavaScript:cwbainit('CWKJZDBA','N','2');return false;" href="#" target='_blank' ng-show="showDsCburlBz">现在去备案</a><br/>
						</td>
					</tr>
					<!--GWDW=国无地无 GYDY=国有地有  GYDW=国有地无 GWDY=国无地有  -->
				</table>
		</div>
	</div>
	<!-- 特色区域，可覆盖，自行覆盖  暂时不加载子页面，目的为了让按期应申报的初始化方法先加载，等初始化方法发起请求后再架子扩展页面-->
	
	<iframe id="cwbbkzIframe" width ="100%" frameborder="0" scrolling="no" style="border:0px"></iframe>
	<!-- 财报扩展提示  原写在cwbbkzIframe模块在，但存在加载iframe子页面比渲染数据速度慢引起报错，所以移到这里 -->
	<div id="cwbaMsgId"></div>
	<!-- 服务异常，可覆盖，不建议覆盖 -->
	<div id="serviceErrId"></div>
	<!-- 特色区域，可覆盖，自行覆盖   暂时不加载子页面，目的为了让按期应申报的初始化方法先加载，等初始化方法发起请求后再架子扩展页面-->
	
	<iframe id="msgIframe" width ="100%" frameborder="0" scrolling="no" style="border:0px"></iframe>
	<!--纳税人基础信息隐藏区  -->
	<div id="nsrztxxId" style="word-break: break-all; color: #fff"></div>
	</div>
    <script type="text/javascript">
    	var layer,page;
		//初始化加载数据
		$(document).ready(
				function(e) {
					layui.use(['layer','laypage'], function(){
						layer = layui.layer;
						page = layui.laypage; 
						loadAqsb();
						loadIframe();
					})
				});
		
		//提供给lhCwbbbsKz.jsp页面调用     设置iframe大小
		function setCwbbkzIframe(){
			//高度自行修改
			$("#cwbbkzIframe").height(0);
		}
		
		//提供给doWord.jsp页面调用    设置iframe大小
		function setMsgIframe(){
			$("#msgIframe").height(310);
		}
		
		//提供给lhSbbbsKz.jsp页面调用   设置iframe大小
		function setAqsbkzIframe(){
			//高度自行修改
			$("#aqsbkzIframe").height(0);
		}
		
		//加载其他iframe扩展模块，写成动态加载是为了让lhSbbbs.jsp里的初始化清册方法优先加载。
		function loadIframe(){
			//加载重置清册模块
			parent.$("#btnIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/doHead.jsp");
			//加载税费申报扩展模块
			$("#aqsbkzIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/lhSbbbsKz.jsp");
			//加载财务报表模块
			$("#cwbbkzIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/lhCwbbbsKz.jsp");
			//加载温馨提示模块
			$("#msgIframe").attr("src", "/sbzs-cjpt-web/biz/sbqc/sbqc_aqsb/setting/doWord.jsp");
		}

    function closeDialog(){
        $("#light").hide();
    }
	</script>
	
	<div class="showsy">		
		<div class="win-center" id="showsy" style="display: none;">
			<div class="con-symx searchbox font-x"> 
				<span><span class="font-orange" id="wxts" >您本期应申报税源x条，已申报x条。</span>  
				<div class="layui-form marginT8">
					<table class="layui-table" lay-even="">
    					<thead>
					      <tr>
					        <th>序号</th>
					        <th>税源编号</th>
					        <th>所属期起</th>
					        <th>所属期止</th>
					        <th>申报状态</th>
					      </tr> 
    					</thead>
						<tbody id="syxxmx">
    					</tbody>
					</table>		
				</div>	
				<!-- 存放分页的容器 -->
				<div id="layuiPage"></div>  
			</div>
		</div>
	</div>
	
</body>
</html>