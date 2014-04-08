// manager_page_home.js

$(function() {

	//coverflow效果 默认第二个是正面照～～～
	var json = {
		perspective: 500,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,
		translateX: 0,
		translateY: 0,
		translateZ: 0
	}

	var iframeWrappers = document.querySelectorAll('.iframe-wrapper'),
		list = document.querySelector(".manager-page-list");
	var left = 0,
		prevP = 0;
	
	$(iframeWrappers).each(function(index) {
		var _this = $(iframeWrappers)[index];
		json.rotateY = index * 25;
		left = index * 340;
		_this.style['left'] = left + "px";
		_this.style['-webkit-transform'] = "matrix3d(" + toMatrix3D(json) + ")";
	})

	$(list).scroll(function() {
		var stepWidth = Math.ceil((list.scrollWidth -$(this).scrollLeft() )/ (iframeWrappers.length));
		console.log(stepWidth)
		if (Math.ceil($(this).scrollLeft() / stepWidth) != prevP) {
			prevP = Math.ceil($(this).scrollLeft() / stepWidth);
			$(iframeWrappers).each(function(index) {
				var _this = $(iframeWrappers)[index];
				json.rotateY = -25*prevP + index * 25;
				_this.style['-webkit-transform'] = "matrix3d(" + toMatrix3D(json) + ")";
			})
		}
	})

	// $(list).scrollTo(20)
});