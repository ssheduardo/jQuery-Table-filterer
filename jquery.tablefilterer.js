/*

Description:
==========================================================================================

jQuery table filterer

This plugin is designed to work on <table/>s. It must have a <thead> with a single <tr> with <th>'s in it.
All body rows should be in a <tbody>.

Usage:
==========================================================================================

$('selector here').tablefilterer({
	cols: [0,1,2,3] // list the indexes (zero based) of the columns you want to make filterable. This is optional, ommit for all columns
});

*/

(function($) {
	$.fn.tablefilterer = function(options) {
		var cfg = $.extend({
			cols: []
		}, options);

		var tables = this.filter('table:has(thead):has(tbody)');

		tables.each(function() {
			var table = $(this);
			var headerRow = table.find('thead tr');
			var tbody = table.children('tbody');

			var selects = [];

			headerRow.children('th').each(function(col) {
				if (cfg.cols.length != 0) {
					var found = false;
					for (var i = 0; i < cfg.cols.length; i++) {
						if (cfg.cols[i] == col) {
							found = true;
							break;
						}
					}
					if (!found)
						return;
				}

				var th = $(this);
				var index = th.index();
				var select = $('<select/>').change(function() {
					changeHandler(tbody, selects);
				});
				selects[selects.length] = { Select: select, Col: col };

				select.append($('<option/>').text("-- All --").val(""));

				var pastValues = [];
				var values = tbody.find('td:nth-child(' + (index + 1) + ')');

				values.each(function() {
					var found = false;
					var text = $(this).text();
					for (var i = 0; i < pastValues.length; i++) {
						if (pastValues[i] == text) {
							found = true;
							break;
						}
					}

					if (!found) {
						pastValues[pastValues.length] = text;
					}
				});

				pastValues.sort();

				for (var i = 0; i < pastValues.length; i++)
					select.append($('<option/>').text(pastValues[i]).val(pastValues[i]));

				var form = $('<form action="#"/>')
				
				th.append(form.append(select));
			});
		});

		function changeHandler(tbody, selects) {

			var rows = tbody.children('tr');

			for (var i = 0; i < selects.length; i++) {
				var value = selects[i].Select.val();
				if (value == "")
					continue;

				rows = rows.filter(function(x) {
					return $(this).children('td:nth-child(' + (selects[i].Col + 1) + ')').text() == value
				});
			}

			tbody.children('tr').css('display', 'none');
			rows.css('display', '');
		}
	};
})(jQuery);