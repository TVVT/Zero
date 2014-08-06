$(function() {
	var collect=$('.manager_projects_list'),
		iframeContent=$('.iframeContent');
	/**
	 * [收藏]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	collect.on('click','.collect',function(event){
		alert('aaaaa');
		//debugger
		event.stopPropagation();
		event.preventDefault();
	});

	collect.on('click','img',function(event){
		var a=$(this).attr('data-url'),
			ifr=iframeContent.find('iframe');

		ifr.attr('src',a);
		iframeContent.addClass('show');
	});

	/*iframeContent.on('mouseleave',function(){
		iframeContent.removeClass('show');
	});*/
});
