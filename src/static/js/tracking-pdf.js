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
					ga('send', 'event', 'External', 'click', extLink);
					if (jQuery(this).attr('target') != undefined && jQuery(this).attr('target').toLowerCase() != '_blank') {
						setTimeout(function() { location.href = href; }, 200);
						return false;
					}
				});
			}
			else if (href && href.match(/^mailto\:/i)) {
				jQuery(this).click(function() {
					var mailLink = href.replace(/^mailto\:/i, '');
					ga('send', 'event', 'Email', 'click', mailLink);
				});
			}
			else if (href && href.match(filetypes)) {
				jQuery(this).click(function() {
					var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
					var filePath = href;
					ga('send', 'event', 'Download', 'click-' + extension, filePath);
					if (jQuery(this).attr('target') != undefined && jQuery(this).attr('target').toLowerCase() != '_blank') {
						setTimeout(function() { location.href = baseHref + href; }, 200);
						return false;
					}
				});
			}
		});
	});
}
else {
	console.info('jQuery undetected');
}
