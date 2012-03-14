/*! jquery.panel.js - https://github.com/amercier/jquery-panel */
(function($){
	
	// Default options
	var defaultOptions = {
		vertical	  : false,
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
				if(!data) {
					
					var allOptions = $.extend({}, defaultOptions, options);
					
					$this.panel(allOptions.startHidden ? 'hide' : 'show');
					$this.panel(allOptions.startCollapsed ? 'expand' : 'collapse');
					
					$(this).data('panel', {
						vertical : allOptions.vertical,
						hidden   : allOptions.startHidden,
						collapsed: allOptions.startCollapsed
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
				$this.animate(properties, data.duration, data.easing, data.callback);
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