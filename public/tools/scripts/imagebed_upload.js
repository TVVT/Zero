;
(function() {
    var upload = document.querySelector('.upload');
    var select = document.querySelector('.fab');
    var inputFile = document.querySelector('.file')
    var form = document.querySelector('.form');
    var oReq = new XMLHttpRequest();
    var dialog = document.querySelector('#dialog');
    var imagesBox = document.querySelector('#dialog .images');
    var urlPlace = document.querySelector('#url');

    select.addEventListener('click', selectFunction,false);

    inputFile.addEventListener('change',uploadFunction,false);

    oReq.onreadystatechange = function() {
        if (oReq.readyState == 4 && oReq.status == 200) {
        	responseFunction(JSON.parse(oReq.responseText));
        }
    }

    function responseFunction(object){
    	if (object.res_code && Number(object.res_code) === 1) {
    		//成功
    		var url = object.url;
    		var img = document.createElement('img');
    		img.src = url;
    		imagesBox.appendChild(img);
    		urlPlace.value = img.src;
    		dialog.toggle();
    	}else{
    		//失败

    	}
    	
    }

    function uploadFunction(e) {
        e.preventDefault();
        oReq.open("POST", "/imagebed/uploadImage");
        oReq.addEventListener("progress", progressFunction, false);
        var formData = new FormData(form);
        oReq.send(formData);
    }

    function progressFunction(e) {
        if (e.lengthComputable) {
            var percentComplete = e.loaded / e.total;
            console.log(percentComplete);
        } else {}
    }

    function selectFunction(e){
    	inputFile.click();
    }

})()
