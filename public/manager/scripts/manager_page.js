$(function(){
	$('.showSource').on('click',function(){
		$('.source-code-wrapper').toggleClass('show');
	});

	$('.source-code-wrapper .close').on('click',function(){
		$('.source-code-wrapper').removeClass('show');
	})


	$('pre').on('click',function(){
		// $(this).select();
	})
})