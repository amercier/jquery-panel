/*! jquery.panel.js - https://github.com/amercier/jquery-panel */
(function($) {
	
	// Default options
	var defaultOptions = {
		side          : 'left',
		showButtons   : true,
		startHidden   : false,
		startCollapsed: false,
		duration      : undefined,
		easing        : undefined,
		callback      : undefined
	};
	
	function _setExpanded($this, data, expanded) {
		data = data || $this.data('panel');
		if(expanded != data.expanded) {
			data.expanded = expanded;
			$this.css(expanded ? data.expandedStyle : data.collapsedStyle);
		}
	}
	
	function _setVisible($this, data, visible) {
		data = data || $this.data('panel');
		if(visible != data.visible) {
			data.visible = visible;
			if(visible) {
				_setExpanded($this, data, true);
			}
			$this.toggle(visible);
		}
	}
	
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
			return this.each(function() {
				
				var $this = $(this),
					data  = $this.data('panel');
				
				// If the plugin hasn't been initialized yet
				if(!data || !data._init) {
					
					var allOptions  = $.extend({_init:true}, defaultOptions, data || {}, options),
					    outerWidth  = $this.outerWidth(),
					    outerHeight = $this.outerHeight(),
					    width       = $this.width(),
					    height      = $this.height(),
					    position    = $this.position(),
					    cssPosition = $this.css('position');
					
					// Ensures that position is either "absolute" ord "fixed"
					if(cssPosition !== 'absolute' && cssPosition !== 'fixed') {
						window.console && console.error('Invalid position "' + cssPosition + '" on', $this);
						throw 'Impossible to create a panel while position is "' + cssPosition + '"';
					}
					
					$this
						// Data
						.data('panel', data = {
								
							// Options
							side     : allOptions.side,
							duration : allOptions.duration,
							easing   : allOptions.easing,
							
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
					
					// Wrapper's CSS
					wrapper.css({
						top     : this.style.top    || 'auto',
						bottom  : this.style.bottom || 'auto',
						left    : this.style.left   || 'auto',
						right   : this.style.right  || 'auto',
						height  : outerHeight,
						width   : outerWidth,
						margin  : [this.style.marginTop, this.style.marginRight, this.style.marginBottom, this.style.marginLeft].join(' ') || 'auto',
						position: $this.css('position') || 'absolute'
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
					
					// Buttons
					if(allOptions.showButtons) {

						var collapseButton = $('<button class="panel-button panel-button-collapse"> </button>').text('Collapse').appendTo($this);
						var   expandButton = $('<button class="panel-button panel-button-expand"> </button>')  .text('Expand'  ).appendTo($this);
						
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
					
					// Start enabled/disabled
					_setVisible($this, data, !allOptions.startHidden);
					
					// Start expanded/collapsed
					_setExpanded($this, data, !allOptions.startCollapsed);
				}
			});
		},
		
		/**
		 * Show the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		show: function() {
			return this.each(function() {
				_setVisible($(this), undefined, true);
			});
		},
		
		/**
		 * Hide the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		hide: function() {
			return this.each(function() {
				_setVisible($(this), undefined, false);
			});
		},
		
		/**
		 * Show/hide the panel(s)
		 * 
		 * @param {Boolean} [show] If set, force the toggling state
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		toggle: function(show) {
			return this.each(function() {
				var $this = $(this),
				    data  = $this.data('panel');
				_setVisible($(this), data, show !== undefined && show || show === undefined && !data.visible);
			});
		},
		
		/**
		 * Expand the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		expand: function() {
			return this.each(function() {
				var $this = $(this),
				    data  = $this.data('panel');
				
				if(!data.expanded) {
					data.expanded = true;
					
					$this.stop()
						.animate(data.expandedStyle, data.duration, data.easing, function() {
							$this.removeClass('panel-expanding').addClass('panel-expanded');
						})
						.removeClass('panel-collapsing panel-collapsed panel-expanded')
						.addClass('panel-expanding')
						.trigger('expand.panel');
				}
			});
		},
		
		/**
		 * Collapse the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		collapse: function() {
			return this.each(function() {
				var $this = $(this),
				    data  = $this.data('panel');
				
				if(data.expanded) {
					data.expanded = false;
					
					$this.stop()
						.animate(data.collapsedStyle, data.duration, data.easing, function() {
							$this.removeClass('panel-collapsing').addClass('panel-collapsed');
						})
						.removeClass('panel-expanding panel-expanded panel-collapsed')
						.addClass('panel-collapsing')
						.trigger('collapse.panel');
				}
			});
		},
		
		/**
		 * Collapse/expand the panel(s)
		 * 
		 * @param {Boolean} [expand] If set, force the toggling state
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		toggleExpand: function(expand) {
			return this.each(function() {
				var $this = $(this),
				    data  = $this.data('panel');
				
				$this.panel(
						expand !== undefined && expand || expand === undefined && !data.expanded
						? 'expand'
						: 'collapse'
					);
			});
		}
	};
	
	/**
	 * Plug-in registration
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