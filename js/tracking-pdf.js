// (function($) {
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
(function ($) {
	    $('a').on('click', function () {
			        const $this = $(this);

			        if ($this.get(0).tagName.toLowerCase() === 'png') {
						            gtag('event', 'click', {
										                'event_category': 'download',
										                'event_label': $this.attr('alt')
										            });
						        }
			    });
});
