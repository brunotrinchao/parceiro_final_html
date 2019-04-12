(function ($) {
	var prefix = "parceiro_";
	Lockr.prefix = prefix;

	$.gApi = {
		exec: function (method, endpoint, param, callbackSuccess, callbackError) {
			var headers = {};
			headers.Authorization = "YnJ1bm86SW50ZWdyYWNhb1BhcmNlaXJvcw==";

			var new_param = jQuery.isEmptyObject(param) ?
				null :
				JSON.stringify(param);

			jQuery.ajax({
				type: method,
				url: endpoint,
				data: new_param,
				dataType: "json",
				async: true,
				contentType: "application/json",
				processData: true,
				headers: headers,
				beforeSend: function () {
					jQuery.gDisplay.loadStart();
				},
				error: function (xhr) {
					jQuery.gDisplay.loadStop();
				},
				success: function (json) {
					jQuery.gDisplay.loadStop();

					if (typeof callbackSuccess === "function") {
						callbackSuccess.call(this, json);
					}
				}
			});
		},
		load: function (page, container, param, callBack) {
			var new_container = !container || container === undefined || container == "" ?
				"#load_page" :
				container;
			var new_param = jQuery.isEmptyObject(param) ? null : param;
			$("#load_page").load("./pages/" + page, new_param, function () {
				if (typeof callbackSuccess === "function") {
					callbackSuccess.call(this);
				}
			});
		}
	};

	$.lockrStorage = {
		set: function (key, param) {
			Lockr.set(key, param);
		},
		get: function (key) {
			var ret = JSON.parse(localStorage.getItem(prefix + key));
			if (ret) {
				return ret.data;
			}
			return;
		},
		add: function (key, value) {
			Lockr.sadd(key, value);
		},
		item: function (key) {
			Lockr.smembers(key);
		},
		exist: function (key, value) {
			return Lockr.sismember(key, value);
		},
		removeItem: function (key, value) {
			Lockr.srem(key, value);
		},
		getAll: function () {
			return Lockr.getAll(true);
		},
		clear: function () {
			Lockr.flush();
		}
	};
})(jQuery);