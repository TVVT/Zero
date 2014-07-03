$(function() {
    var list_wrapper = $('.manager-ui-list');
    list.forEach(function(cName, index) {
        $.ajax({
            method: "GET",
            url: link + "/projects/"+projectName+"/components/"+cName+".json",
            success: function(data) {
            	var wrapper = $('<div class="mananger_ui_list_wrapper"></div>');
            	var renderData = {};
            	renderData.data = data;
            	var html = new EJS({url: link + "/projects/"+projectName+"/components/"+cName+".ejs"}).render(renderData);
            	wrapper.append($(html));
            	list_wrapper.append(wrapper);
            }
        })
    })



})
