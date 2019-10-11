var zyUrl="/xxmh";
var resNsrIndex = 0;
var layer;
$(function() {
	getShowGdsbz();// 获取国地税标志是否显示配置 在portal.js

	layui.use(['element','layer','jquery'], function() {
		layer = layui.layer;
	});

	$.post("/xxmh/portalSer/checkLogin.do", {}, function(d) {
		var ssoXxmhUrl = d.ssoXxmhUrl;
		$("#ssoXxmhUrl").val(ssoXxmhUrl); //信息门户单点登录地址
		getLoginMenus();
//		getMenu();
	});

	/*获取切换身份、主管税务机关div*/
	getQhsfDiv();
	
	//事件绑定开始
	/**
	 * 绑定回车搜索
	 */
	$("#keyword").keydown(function(e) {
		if (e.keyCode == 13) {
			window.location.href="/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do?key="+encodeURI($('#keyword').val());
		}
	});

	/**
	 * 绑定按钮搜索
	 */
	$("#keysearch").click(function(e) {
		window.location.href="/yyzxn-cjpt-web/yyzx/qjss/showQjssPage.do?key="+encodeURI($('#keyword').val());
	});

	/**
	 * 鼠标划入切换标签,把对应的id存入cookie,返回时切换到对应标签
	 */
	$(".layui-tab-hover>.layui-tab-title>li").on("mouseenter", function() {
		$(this).click();
		$(window).trigger('scroll');//切换tab触发滚动---这样懒加载的图标才显示
	});

	/**
	 * 常用功能设置
	 */
	$('#cygnsz').click(function() {
		return false;
		layer.open({
			type : 2,
			area : [ '940px', '572px' ],
			title : [ '常用功能设置' ],
			scrollbar : false,
			id : 'layerCygn' // 防止重复弹出
			,
			content : '/xxmh/html/cygn.html'
		});
	});
	
	//切换用户脚本		
	var iSum;
   
	$(".user-item").on("mouseenter",function(){
		var i=0
		iSum=setInterval(function(){
		if(i>3){
			$(".user-item ul").fadeIn()
			clearInterval(iSum);
		}
		i++	
		},70)
			
	})

	$(".user-item").on("mouseleave",function(){
		$(".user-item ul").fadeOut();
        clearInterval(iSum);
	})
	//切换用户脚本结束
	
	//事件绑定结束
	
	/**
	 * 获取切换身份和主管税务机关切换div
	 */
	function getQhsfDiv(){
		$.ajax({
			type:"get",
			url:"/xxmh/html/qhsf.html",
			dataType:"text",
			success:function(data){
				$('body').append(data);
			}
		});
	}
});
