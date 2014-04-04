// manager_page_home.js

$(function(){

	//初始化coverflow
	var time = 0,
		length = $('.iframe-wrapper').length,
		startIndex = 2;//第二个是正面
	$('.iframe-wrapper').each(function(index) {
			var _this = $(this);
			time += 150;
			setTimeout(function() {
				if (index<startIndex) _this.css('-webkit-transform','translate(-'+(100+40*(startIndex-1-index))+'%,0) rotateY(60deg)');
				else if(index>startIndex) _this.css('-webkit-transform','translate('+(10+40*(length-index+1))+'%,0) rotateY(-60deg)');
			}, time)
		})

});