// function() {
// 	$("a").on("click", function() {
// 		var url = this.href;
// 		if (url && url.match(/\.pdf$/)) {
// 			ga('send', {
// 				'hitType': 'pageview',
// 				'location': url
// 			});
// 		}
// 	});
// });
//
if (typeof jQuery != 'undefined') {
	console.info('jQuery detected');
	jQuery(document).ready(function($) {
		var filetypes = /\.(apk|ipa|zip|exe|pdf|doc*|xls*|ppt*|mp3)$/i;
		var baseHref = '';
		if (jQuery('base').attr('href') != undefined)
			baseHref = jQuery('base').attr('href');
		jQuery('a').each(function() {
			var href = jQuery(this).attr('href');
			if (href && (href.match(/^https?\:/i)) && (!href.match(document.domain))) {
				jQuery(this).click(function() {
					var extLink = href.replace(/^https?\:\/\//i, '');
					ga('send', 'event', 'download', extLink);
				});
			}
		});
	});
}
else {
	console.info('jQuery undetected');
}
