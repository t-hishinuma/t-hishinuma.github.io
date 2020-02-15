function() {
	$("a").on("click", function() {
		var url = this.href;
		if (url && url.match(/\.pdf$/)) {
			ga('send', {
				'hitType': 'pageview',
				'location': url
			});
		}
	});
});
