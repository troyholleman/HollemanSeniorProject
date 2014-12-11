	
	$('body').popover({
		html : true,
		selector : '[rel=popover]',
		title : function() {
			return $(this).parent().find('.head').html();
		},
		content : function() {
			return $(this).parent().find('.content').html();
		},
		animation : true,
		container : 'body',
	});
	
	// $('body').on('click', function(e) {
		// //did not click a popover toggle or popover
		// if ($(e.target).data('original-title') !== 'popover' && $(e.target).parents('.popover.in').length === 0) {
			// $('.popover').popover('hide');
		// }
	// });