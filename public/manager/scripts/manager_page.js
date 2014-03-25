(function(window) {
	var moduleName,developper,totolType,currType,e,e_moduleName,e_developper,e_currType;
	var e_moduleName = document.querySelector(".manager-page-attr-name"),
		e_developper = document.querySelector(".manager-page-attr-developper"),
		managerModuleName = document.body.attributes.getNamedItem('manager-module-name').value;

		window.frames["page-manager-iframe"].onload = function() {
		e = window.frames["page-manager-iframe"].document.body;
		moduleName = e.attributes.getNamedItem('module-name');
		developper = e.attributes.getNamedItem('developper');
		//TODO 判断属性存在 如果不存在会出现错误
		if(!moduleName||!developper) {
			console.log("模块信息不完整！");
			return;
		};

		e_developper.innerText = developper.value;
		e_moduleName.innerText = moduleName.value;
	}
})(window);