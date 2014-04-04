var coverflow = {
	init: function(options) {
		this.opt = $.extend({
			//初试位置
			coverIndex: 0
		}, options || {});

		this._initCoverFlow();
	},
	_initCoverFlow: function() {
		var totol = this.opt.coverflow.children().length;
		var time = 0;
		$('.iframe-wrapper').each(function() {
			var _this = $(this);
			time += 200;
			setTimeout(function() {
				_this.addClass('left');
			}, time)
		})
	}
}

return coverflow;