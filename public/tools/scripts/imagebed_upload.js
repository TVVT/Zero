;
(function() {
    var upload = document.querySelector('.upload');
    var select = document.querySelector('.fab');
    var inputFile = document.querySelector('.file')
    var form = document.querySelector('.form');
    var oReq = new XMLHttpRequest();
    var dialog = document.querySelector('#dialog');

    select.addEventListener('click', selectFunction,false);

    inputFile.addEventListener('change',uploadFunction,false);

    oReq.onreadystatechange = function() {
        if (oReq.readyState == 4 && oReq.status == 200) {
            var input = document.createElement('input');
            input.classList.add('url_place');
            input.disabled = true;
            input.value = JSON.parse(oReq.responseText).file;

            
            
            dialog.toggle();
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
