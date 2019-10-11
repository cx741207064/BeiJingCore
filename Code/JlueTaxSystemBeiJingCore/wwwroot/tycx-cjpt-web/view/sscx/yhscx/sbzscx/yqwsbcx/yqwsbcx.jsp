



<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="renderer" content="ie-comp" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=EDGE" />
<title>逾期未申报查询</title>
<!-- 通用样式和框架js -->
<link href="/tycx-cjpt-web/tycx-res/skin/css/comon0.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/lib/jquery.min.js"></script>

<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/laypage/laypage.js"></script>
<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/layer-v2.2/layer/layer.js"></script>

<script type="text/javascript" src="/tycx-cjpt-web/resources/js/ecm-taglib/DatePicker/DatePicker.js"></script>

<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/lib/angular.js"></script>
<link rel="stylesheet" type="text/css" href="/tycx-cjpt-web/abacus/_res_/css/message/message_solid.css">
<link rel="stylesheet" type="text/css" href="/tycx-cjpt-web/abacus/_res_/js/message/skin/default/Message.css"/>

<script type="text/javascript" src="/tycx-cjpt-web/abacus/_res_/js/message/Message.js"></script>
<script src="/tycx-cjpt-web/abacus/_res_/js/lib/message.js"></script>
<script type="text/javascript">
   var cp = "/tycx-cjpt-web";
</script>

<!-- 4.0版本UI样式 -->
<link rel="stylesheet" type="text/css" href="/tycx-cjpt-web/resources4/layui/css/layui.css" />
<script type="text/javascript" src="/tycx-cjpt-web/resources4/layui/layui.js"></script>
<script src="/tycx-cjpt-web/resources4/tax-module/select2/select2.js"></script>
<link href="/tycx-cjpt-web/resources4/tax-module/select2/select2.css" rel="stylesheet" />
<link rel="stylesheet" href="/tycx-cjpt-web/resources4/tax-css/common.css">
<script type="text/javascript" src="/tycx-cjpt-web/resources4/tax-js/common.js"></script>

<!-- 自定义脚本 -->
<script language=JavaScript src="/tycx-cjpt-web/resources/js/lib/cascade-select.js"></script>
<script type="text/javascript" src="/tycx-cjpt-web/resources/js/tycx/base-tycx2.js"></script>
<script type="text/javascript" src="yqwsbcx.js"></script>
<script language=JavaScript src="/tycx-cjpt-web/resources/js/tycx/timeValidate.js"></script>
<style type="text/css">
	.btn{overflow: visible!important;}
</style>	
</head>
<body class="minBody">
	<div class="user_box01" ng-app="angulajs_tycxApp"
		ng-controller="angulajs_customersCtrl">
		<div class="show01">
			<div class="searchbox"   id="queryContion">
				<div class="layui-form-item" style="margin-top: 10px;margin-bottom: 0px;">
						
							<div class="layui-inline marginB16">
								<label class="layui-form-label label-left" style="width:110px">申报期限起止：</label>
								<div class="layui-input-inline" style="width: 120px">
									<input type="text" name="cxrqq" id="cxrqq"
									class="layui-input layui-date-input" 
									defualtValue="{L3MD}"/> 
								</div>
								<label class="layui-form-label label-left" style="width:20px">&nbsp;-</label>
								<div class="layui-input-inline" style="width: 120px">
									<input type="text" name="cxrqz"
									id="cxrqz" class="layui-input layui-date-input" 
									defualtValue="{NOWDATE}"/>
								</div>
							</div>
							
							<div class="layui-inline marginB16">
								<label class="layui-form-label label-left" style="width:80px">征收项目：</label>
								<div class="layui-input-inline">
								<select style="width:190px;" class="mySelect" id="zsxmDm" cde-init="Y"  cde-subname =""  readonly  cde-datasource="/tycx-cjpt-web/resources/xml/hx_dm_gy_zsxm.xml">
								</select>
								</div>
							</div>
						
							<div class="layui-inline marginB16">
								<label class="layui-form-label label-left" style="width:120px">税款所属期起止：</label>
								<div class="layui-input-inline" style="width: 120px">
									<input type="text" name="skssqq" id="skssqq"
									class="layui-input layui-date-input"/>  
								</div>
								<label class="layui-form-label label-left" style="width:20px">&nbsp;-</label>
								<div class="layui-input-inline" style="width: 120px">
									<input type="text" name="skssqz"
									id="skssqz" class="layui-input layui-date-input"/>
								</div>
								<div class="layui-inline">
									<input id="queryBtn" class="layui-btn layui-btn-primary" type="button"
									ng-click="queryBtn()" value="查询">
								</div>
							</div>
							
							<!-- <td><input class="btn btn05 cz" type="button" 
								ng-click="resetBtn()" value="重 置"/></td> -->
						

				</div>
				
				<div class="layui-table">
					
					<table width="100%" border="0" cellspacing="0" cellpadding="0" id="dataList1">
						<tbody>
							<tr class="trheader">
								<th ng-cloak width="30">序号</th>
								<th ng-cloak width="80" ng-if="gdslxDm == 3" ng-class="{'ng-show':showGdsbz=='Y','ng-hide':showGdsbz=='N'}">国地标志 </th>
								<th ng-cloak>税/费种</th>
								<th ng-cloak>税（费）目</th>
								<th ng-cloak>税款所属期起</th>
								<th ng-cloak>税款所属期止</th>
								<th ng-cloak>申报期限</th>
<!-- 								<th>催报日期</th> -->
							</tr>
							<tr ng-repeat="item in formData | orderBy:'sbqx':true">
								<td align="center" ng-cloak ng-bind="$index + 1"></td>
								<td align="center" ng-cloak ng-if="gdslxDm == 3" ng-class="{'ng-show':showGdsbz=='Y','ng-hide':showGdsbz=='N'}"><span class="fontcolor01" ng-bind="item.gdbz"></span></td>
								<td ng-cloak ng-bind="item.zsxmmc"></td>
								<td ng-cloak ng-bind="item.zspmmc"></td>
								<td ng-cloak ng-bind="item.skssqq | limitTo : 10"  style="text-align:center"></td>
								<td ng-cloak ng-bind="item.skssqz | limitTo : 10"  style="text-align:center"></td>
								<td ng-cloak ng-bind="item.sbqx | limitTo : 10"  style="text-align:center"></td>
<!-- 								<td ng-cloak>{{ item.cbqx }}</td> -->
							</tr>
							<tr class="noData" ng-cloak ng-if="formData.length <= 0">
					      		<td colspan="7" align="center"><font color="red">查无数据</font></td>
					   		</tr>
						</tbody>
					</table>
				</div>
				<!-- 分页位置 -->
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tbody>
						<tr>
							<td class="custom_layper_page_info" id="layper_page_info"></td>
							<td>
								<div style="padding: 10px 0; float: right;">
		        					<div class="custom_page_box" id="layper_page_box" style="margin-right: 0px"></div>
		        				</div>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- 分页位置 -->
			</div>


		</div>
	</div>

<!-- 通用查询数据引入，必须 -->
	<script type="text/javascript" src="/tycx-cjpt-web/resources/js/tycx/tycxDataTable.js"></script>
	<!-- 如果有时间起止控件，直接定义sjq,sjz，引用这个js，如果只有单个的，自己直接参考写js -->
	<script type="text/javascript" src="/tycx-cjpt-web/resources/js/tycx/tycxFormDate.js"></script>
</body>
</html>