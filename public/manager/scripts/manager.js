(function(window) {
	var moduleName,developper,totolType,currType,e,e_moduleName,e_developper,e_currType;
	var e_moduleName = document.querySelector(".manager-ui-attr-name"),
		e_developper = document.querySelector(".manager-ui-attr-developper"),
		e_currType = document.querySelector(".manager-ui-attr-type"),
		managerModuleName = document.body.attributes.getNamedItem('manager-module-name').value;

	window.frames["ui-manager-iframe"].onload = function() {
		if (!window.frames["ui-manager-iframe"].document.getElementById("module-info")){
			alert("模块信息不完整！");
			return;
		}
		e = window.frames["ui-manager-iframe"].document.getElementById("module-info");
		//TODO 判断属性存在 如果不存在会出现错误
		if(moduleName||developper||totolType||currType) {
			alert("模块信息不完整！");
			return;
		};

		moduleName = e.attributes.getNamedItem('module-name');
		developper = e.attributes.getNamedItem('developper');
		totolType = e.attributes.getNamedItem('totol-type');
		currType = e.attributes.getNamedItem('curr-type');

		
		e_developper.innerText = developper.value;
		e_moduleName.innerText = moduleName.value;
		e_currType.value = Number(currType.value);

		for(var i = 1;i<Number(totolType.value);i++){
			var value = i+1;
			e_currType.options.add(new Option("样式"+value,value));
		}

		e_currType.onchange = function(){
			var currId = e_currType.value;
			window.frames["ui-manager-iframe"].location.href = '/uis/'+managerModuleName+'/'+currId;
		}

	}
})(window);