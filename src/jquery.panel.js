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
	
	function _getProperty(side) {
		return side;
	}
	
	function _opposite(value) {
		if(value === undefined || value === null || value === 'auto') {
			return value;
		}
		else {
			var matches = value.match(/^(-)?(.*[^a-z])([a-z%]+)$/);
			return (matches[1] ? 1 : -1) * parseFloat(matches[2]) + matches[3];
		}
	}
	
	function _setExpanded($this, data, expanded) {
		data = data || $this.data('panel');
		data.expanded = expanded;
		$this.stop()
			.removeClass('panel-collapsing panel-expanding')
			.css(data.property, expanded ? data.expandedValue : data.expandedValue)
			.addClass(expanded ? 'panel-expanded' : 'panel-collapsed');
	}
	
	function _setVisible($this, data, visible) {
		data = data || $this.data('panel');
		if(visible) {
			_setExpanded($this, data, true);
		}
		$this
			.toggle(visible)
			.trigger(visible ? 'show.panel' : 'hide.panel');
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
					    cssPosition = $this.css('position'),
					    top         = $this.css('top')    || 'auto',
						bottom      = $this.css('bottom') || 'auto',
						left        = $this.css('left')   || 'auto',
						right       = $this.css('right')  || 'auto',
						side        = allOptions.side;
					
					// Ensures that position is either "absolute" ord "fixed"
					if(cssPosition !== 'absolute' && cssPosition !== 'fixed') {
						window.console && console.error('Invalid position "' + cssPosition + '" on', $this);
						throw 'Impossible to create a panel while position is "' + cssPosition + '"';
					}
					
					$this
						// Data
						.data('panel', data = {
								
							// Options
							side     : side,
							duration : allOptions.duration,
							easing   : allOptions.easing,
							
							// Animated property
							property      : _getProperty(side),
							expandedValue : 0,
							collapsedValue: $.inArray(side, ['left','right']) > -1 ? -outerWidth : -outerHeight,
							ratio         : $.inArray(side, ['left','right']) > -1 ? -outerWidth/100.0 : -outerHeight/100.0
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
						top     : top,
						bottom  : bottom,
						left    : left,
						right   : right,
						height  : top  !== 'auto' && bottom !== 'auto' ? 'auto' : (/%$/.test(height) ? height : outerHeight),
						width   : left !== 'auto' && right  !== 'auto' ? 'auto' : (/%$/.test(height) ? height : outerWidth),
						margin  : [
							$this.css('margin-top')    || 0,
							$this.css('margin-right')  || 0,
							$this.css('margin-bottom') || 0,
							$this.css('margin-left')   || 0
						].join(' '),
						position: cssPosition
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
							margin  : 0
						}
					));
					
					// Buttons
					if(allOptions.showButtons) {
						
						var border = {
							top   : $this.css('border-top-width'),
							left  : $this.css('border-left-width'),
							bottom: $this.css('border-bottom-width'),
							right : $this.css('border-right-width')
						};
						
						var buttonCSS = ({
							left: {
								'margin-top'   : _opposite(border.top),
								'margin-left'  : border.right,
								'margin-right' : _opposite(border.right),
								'margin-bottom': border.top
							},
							right: {
								'margin-top'   : _opposite(border.top),
								'margin-left'  : _opposite(border.left),
								'margin-right' : border.left,
								'margin-bottom': border.top
							}
						})[side];
						
						var collapseButton = $('<button class="panel-button panel-button-collapse"> </button>').css(buttonCSS).text('Collapse').appendTo($this);
						var   expandButton = $('<button class="panel-button panel-button-expand"> </button>')  .css(buttonCSS).appendTo($this);
						
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
		 * Show the panel(s) and set it to "expanded" mode instantly
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
				_setVisible($(this), data, show !== undefined && show || show === undefined && $this.css('display') === 'none');
			});
		},
		
		/**
		 * Expand the panel(s)
		 * 
		 * @return {jQuery} Returns the original jQuery object to maintain chainability
		 */
		expand: function(amount) {
			return this.each(function() {
				var $this      = $(this),
				    data       = $this.data('panel'),
				    properties = {},
				    matches;
				
				properties[data.property] = amount === undefined ? data.expandedValue : ((matches = /(.*)%$/.exec(amount)) ? data.ratio * (100 - parseFloat(matches[1])) : data.collapsedValue + parseFloat(amount));
				data.expanded = properties[data.property] == data.expandedValue;
				$this.stop()
					.animate(properties, data.duration, data.easing, function() {
						$this
							.removeClass('panel-expanding')
							.addClass('panel-expanded')
							.trigger('afterexpand.panel');
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
		collapse: function(amount) {
			return this.each(function() {
				var $this      = $(this),
				    data       = $this.data('panel'),
				    properties = {},
				    matches;
				
				properties[data.property] = amount === undefined ? data.collapsedValue : ((matches = /(.*)%$/.exec(amount)) ? data.ratio * parseFloat(matches[1]) : -parseFloat(amount));
				data.expanded = properties[data.property] == data.expandedValue;
				$this.stop()
					.animate(properties, data.duration, data.easing, function() {
						$this
							.removeClass('panel-collapsing')
							.addClass('panel-collapsed')
							.trigger('aftercollapse.panel');
					})
					.removeClass('panel-expanding panel-expanded panel-collapsed')
					.addClass('panel-collapsing')
					.trigger('collapse.panel');
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