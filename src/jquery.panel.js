/*! jquery.panel.js - https://github.com/amercier/jquery-panel */
(function($){
	
	// Default options
	var defaultOptions = {
		side          : 'left',
		startHidden   : false,
		startCollapsed: false,
		duration      : undefined,
		easing        : undefined,
		callback      : undefined
	};
	
	var methods = {
		
		/**
		 * Initialize the panel(s)
		 * 
		 * @param {Object}  [options=null]				 The panel initialization options
		 * @paran {Boolean} [options.vertical=false]	   Whether the panel should collapse vertically (`true`) or horizontally (`false`, default)
		 * @paran {Boolean} [options.startHidden=false]	Whether the panel should start hidden (`true`) or shown (`false`, default)
		 * @paran {Boolean} [options.startCollapsed=false] Whether the panel should start collapsed (`true`) or expanded (`false`, default)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		init: function(options) {
			return this.each(function(){
				
				var $this = $(this),
					data  = $this.data('panel');
				
				// If the plugin hasn't been initialized yet
				if(!data || !data._init) {
					
					var allOptions  = $.extend({_init:true}, defaultOptions, data || {}, options),
					    outerWidth  = $this.outerWidth(),
					    outerHeight = $this.outerHeight(),
					    width       = $this.width(),
					    height      = $this.height(),
					    position    = $this.position();
					
					$this
						// Data
						.data('panel', data = {
								
							// Options
							side     : allOptions.side,
							duration : allOptions.duration,
							easing   : allOptions.easing,
							hidden   : allOptions.startHidden,
							collapsed: allOptions.startCollapsed,
							
							// Animated properties
							expandedStyle: ({
								right: { right: 0 },
								left : { left : 0 },
							})[allOptions.side],
							collapsedStyle: ({
								right: { right: -outerWidth },
								left : { left : -outerWidth }
							})[allOptions.side],
						})
						.addClass('panel-' + data.side)
						.addClass('panel-content')
						.addClass(data.collapsed ? 'panel-collapsed' : 'panel-expanded')
						;
					
					var wrapper = $this.wrap('<div></div>').parent()
						.addClass('panel')
						;
					
					var collapseButton = $('<button class="panel-button panel-button-collapse"> </button>').text('Collapse').appendTo($this);
					var   expandButton = $('<button class="panel-button panel-button-expand"> </button>')  .text('Expand'  ).appendTo($this);
					
					// Wrapper's CSS
					wrapper.css({
							top   : position.top  + Number($this.css('margin-left').replace(/[^0-9]+/g, '')),
							left  : position.left + Number($this.css('margin-top') .replace(/[^0-9]+/g, '')),
							height: outerHeight,
							width : outerWidth,
							margin: $this.css('margin')
					});
					
					// Content's CSS
					$this.css($.extend(({
						left: {
							left  : 0,
							right : 'auto',
							top   : 0,
							bottom: 0,
							width : width,
							height: 'auto'
						},
						right: {
							bottom: 0,
							left  : 'auto',
							top   : 0,
							right : 0,
							width : width,
							height: 'auto'
						}})[data.side], { // common
							position: 'absolute',
							margin  : '0'
						}
					));
					
					// Collapse button action
					collapseButton.click(function(event) {
						event.preventDefault();
						event.stopPropagation();
						$this.panel('collapse');
					});

					// Expand button action
					expandButton.click(function(event) {
						event.preventDefault();
						event.stopPropagation();
						$this.panel('expand');
					});
				}
			});
		},
		
		/**
		 * Show the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		show: function() {
			return this.each(function(){
				var $this = $(this),
					data  = $this.data('panel');
				
			});
		},
		
		/**
		 * Hide the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		hide: function() {
			return this.each(function(){
				var $this = $(this),
				    data  = $this.data('panel');
				var properties = data.vertical
					? {'height': 0}
					: {'width' : 0}
					;
				$this.animate(properties, data.duration, data.easing, data.callback)
					.trigger('hide.panel')
					;
			});
		},
		
		/**
		 * Expand the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		expand: function() {
			return this.each(function(){
				var $this = $(this),
				    data  = $this.data('panel');
				$this.stop()
					.animate(data.expandedStyle, data.duration, data.easing, function() {
						$this.removeClass('panel-expanding').addClass('panel-expanded');
					})
					.removeClass('panel-collapsing panel-collapsed panel-expanded')
					.addClass('panel-expanding')
					.trigger('expand.panel');
			});
		},
		
		/**
		 * Collapse the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		collapse: function() {
			return this.each(function(){
				var $this = $(this),
				    data  = $this.data('panel');
				$this.stop()
					.animate(data.collapsedStyle, data.duration, data.easing, function() {
						$this.removeClass('panel-collapsing').addClass('panel-collapsed');
					})
					.removeClass('panel-expanding panel-expanded panel-collapsed')
					.addClass('panel-collapsing')
					.trigger('collapse.panel');
			});
		}
	};
	
	/**
	 * Plugin registration
	 */
	$.fn.panel = function(method) {
		
		// Method calling logic
		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.panel');
		}
		
	};
	
})(jQuery);