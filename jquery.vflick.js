(function($){

	var support = {};
	support.touch = 'ontouchstart' in window;
	var touchStartEvent = support.touch ? 'touchstart' : 'mousedown';
	var touchMoveEvent = support.touch ? 'touchmove' : 'mousemove';
	var touchEndEvent = support.touch ? 'touchend' : 'mouseup';
	var resizeEvent = support.touch ? 'resize' : 'resize';
	var scrollEvent = support.touch ? 'scroll' : 'scroll';
	support.venders = {};
	support.venders.prefix = {webkit:'-webkit-',moz:'',o:'-o-',none:''};
	support.venders.transitionEnd = {webkit:'webkitTransitionEnd',moz:'transitionend',o:'otransitionEnd',none:'transitionend'};
	support.vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'moz' : 'opera' in window ? 'o' : 'none';
	
	$.fn.vflick = function(opt){
		opt = $.extend({
			verticalFlick:false,
			flickClass:'.flick',
			transitionSpeed:350,
			transitionTiming:'cubic-bezier(0, 0, 0.25, 1)',//ease-out
			threshold:0.3,
			fsEndAnim:function(){/*console.log('animation end');*/}
		},opt);
		
		/*
		 * pos.dist     => moving distance
		 * pos.offset   => point of touchstart relative
		 * pos.client   => point of touchstart absolute
		 * pos.leave    => point of touchend relative
		 * pos.endpoint => end point of animation
		 * 
		 */
		var elm = this;
		var pos = {};
		pos.dist = 0;
		pos.direction = 0;//0=>no change,1=>positive move,2=>negative move
		pos.endpoint = 0;
		pos.num = 0;//number of slide
		pos.length = 0;//size of slide
		pos.offset = {x:0,y:0};
		pos.client = {x:0,y:0};
		pos.leave = {x:0,y:0};
		pos.scroll = {x:0,y:0};
		var flick = {};
		flick.size ={w:$(elm).parent().width(),h:$(elm).parent().height()};
		flick.pos = {x:$(elm).parent().offset().left,y:$(elm).parent().offset().top};
		flick.direction = {loc:(opt.verticalFlick)?'y':'x',vol:(opt.verticalFlick)?'h':'w'};
		var events = {flick:{},win:{}};
		var methods = {};
		var returnObjects = {};
		var dg = false;
		/*
		 * methods
		 */
		methods.loopChange = function(){
			if(pos.direction == 1){
				$(elm).find(opt.flickClass).first().insertAfter($(elm).find(opt.flickClass).last());
				pos.num = (pos.num >= pos.length-1)?0:pos.num+1;
			}else if(pos.direction == 2){
				$(elm).find(opt.flickClass).last().insertBefore($(elm).find(opt.flickClass).first());
				pos.num = (pos.num <= 0)?pos.length-1:pos.num-1;
			}
		};
		methods.endAnimV = function(){
			methods.loopChange();
			$(elm).attr({style:support.venders.prefix[support.vendor] + 'transform: translate3d(0, -' + flick.size[flick.direction.vol] + 'px, 0);'});
			opt.fsEndAnim(pos.num);
		};
		methods.endAnimH = function(){
			methods.loopChange();
			$(elm).attr({style:support.venders.prefix[support.vendor] + 'transform: translate3d(-' + flick.size[flick.direction.vol] + 'px, 0, 0);'});
			opt.fsEndAnim(pos.num);
		};
		methods.slide = function(){
			//forking vertical or horizontal
			if(opt.verticalFlick){
				$(elm).attr({
					style:
						support.venders.prefix[support.vendor] + 'transform: translate3d(0, ' + pos.endpoint + 'px, 0);' + 
						support.venders.prefix[support.vendor] + 'transition: ' + support.venders.prefix[support.vendor] + 'transform ' + opt.transitionSpeed + 'ms ' + opt.transitionTiming + ';'
				}).unbind(support.venders.transitionEnd[support.vendor]).on(support.venders.transitionEnd[support.vendor],methods.endAnimV);
			}else{
				$(elm).attr({
					style:
						support.venders.prefix[support.vendor] + 'transform: translate3d(' + pos.endpoint + 'px, 0, 0);' + 
						support.venders.prefix[support.vendor] + 'transition: ' + support.venders.prefix[support.vendor] + 'transform ' + opt.transitionSpeed + 'ms ' + opt.transitionTiming + ';'
				}).unbind(support.venders.transitionEnd[support.vendor]).on(support.venders.transitionEnd[support.vendor],methods.endAnimH);
			}
		};
		/*
		 * events
		 */
		events.flick[touchStartEvent] = function(e){
			pos.offset.x = (support.touch)?e.originalEvent.changedTouches[0].pageX - flick.pos.x:e.pageX - $(this).offset().left - pos.scroll.x;
			pos.offset.y = (support.touch)?e.originalEvent.changedTouches[0].pageY - flick.pos.y:e.pageY - $(this).offset().top - pos.scroll.y;
			//console.log(pos.offset.x,e.pageX - $(this).offset().left);
			//blur input elements in flickClass
			$(elm).find('input,textarea').blur();
			dg=true;
		};
		events.flick[touchMoveEvent] = function(e){
			if(dg){
				e.preventDefault();
				pos.client.x = (support.touch)?e.originalEvent.changedTouches[0].pageX:e.clientX;
				pos.client.y = (support.touch)?e.originalEvent.changedTouches[0].pageY:e.clientY;
				pos.dist = ((flick.pos[flick.direction.loc] + flick.size[flick.direction.vol]) - pos.client[flick.direction.loc])*-1 - pos.offset[flick.direction.loc];
				// console.log(
					// flick.pos[flick.direction.loc],
					// flick.size[flick.direction.vol],
					// pos.client[flick.direction.loc],
					// pos.offset[flick.direction.loc],
					// pos.dist
				// );
				//forking vertical or horizontal
				if(opt.verticalFlick){
					$(elm).attr({style:support.venders.prefix[support.vendor] + 'transform: translate3d(0, ' + pos.dist + 'px, 0);'});
				}else{
					$(elm).attr({style:support.venders.prefix[support.vendor] + 'transform: translate3d(' + pos.dist + 'px, 0, 0);'});
				}
				
			}
		};
		events.win[touchEndEvent] = function(e){
			if(dg){
				pos.leave.x = (support.touch)?e.originalEvent.changedTouches[0].pageX:e.clientX;
				pos.leave.y = (support.touch)?e.originalEvent.changedTouches[0].pageY:e.clientY;
				if(Math.abs(pos.offset[flick.direction.loc] - (pos.leave[flick.direction.loc] - flick.pos[flick.direction.loc])) > opt.threshold*flick.size[flick.direction.vol]){
					if(pos.offset[flick.direction.loc] > pos.client[flick.direction.loc] - flick.pos[flick.direction.loc]){
						pos.endpoint = flick.size[flick.direction.vol]*2*-1;
						pos.direction = 1;
					}else{
						pos.endpoint = 0;
						pos.direction = 2;
					}
				}else{
					pos.endpoint = flick.size[flick.direction.vol]*-1;
					pos.direction = 0;
				}
				methods.slide();
				dg=false;
			}
		};
		events.win[resizeEvent] = function(){
			//update each size&pos
			flick.size ={w:$(elm).parent().width(),h:$(elm).parent().height()};
			flick.pos = {x:$(elm).parent().offset().left,y:$(elm).parent().offset().top};
			//update scroll position
			pos.scroll.x = $(window).scrollLeft();
			pos.scroll.y = $(window).scrollTop();
		};
		events.win[scrollEvent] = function(){
			//update scroll position
			pos.scroll.x = $(window).scrollLeft();
			pos.scroll.y = $(window).scrollTop();
		};
		returnObjects.goNext = function(e){
			e.preventDefault();
			pos.endpoint = flick.size[flick.direction.vol]*2*-1;
			pos.direction = 1;
			methods.slide();
		};
		returnObjects.goPrev = function(e){
			e.preventDefault();
			pos.endpoint = 0;
			pos.direction = 2;
			methods.slide();
		};
		/*
		 * init
		 */
		$(elm).find(opt.flickClass).last().insertBefore($(elm).find(opt.flickClass).first());
		pos.length = $(elm).find(opt.flickClass).size();
		//forking vertical or horizontal
		if(opt.verticalFlick){
			$(elm).attr({style:support.venders.prefix[support.vendor] + 'transform: translate3d(0, -' + flick.size[flick.direction.vol] + 'px, 0);'});
		}else{
			$(elm).attr({style:support.venders.prefix[support.vendor] + 'transform: translate3d(-' + flick.size[flick.direction.vol] + 'px, 0, 0);'});
		}
		/*
		 * event bind
		 */
		$(elm).find(opt.flickClass).bind(events.flick);
		$(window).bind(events.win);
		/*
		 * return
		 */
		returnObjects.jq = $(elm);
		return returnObjects;
	};
	
})(jQuery);
