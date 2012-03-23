/*! jquery.panel.js - https://github.com/amercier/jquery-panel */
(function($){
	
	// Default options
	var defaultOptions = {
		side          : 'right',
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
					
					var allOptions = $.extend({_init:true}, defaultOptions, data || {}, options);
					
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
								right: { marginLeft: 0 },
								left : { marginLeft: 0 }
							})[allOptions.side],
							collapsedStyle: ({
								right: { marginLeft: -$this.outerWidth() },
								left : { marginLeft: $this.outerWidth()  }
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
							top   : $this.position().top,
							left  : $this.position().left,
							height: $this.outerHeight(),
							width : $this.outerWidth()
					});
					wrapper.css(data.expandedStyle);
					
					// Content's CSS
					$this.css({
						top   : 0,
						left  : 0,
						bottom: 0,
						right : 0
					});
					
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
				$this.addClass('panel-expanded').removeClass('panel-collapsed');
				$this.stop().animate(data.expandedStyle, data.duration, data.easing)
					.trigger('expand.panel')
					;
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
				
				$this.stop().animate(data.collapsedStyle, data.duration, data.easing, function() {
					$this.addClass('panel-collapsed').removeClass('panel-expanded');
				});
			});
		}
	};
	
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