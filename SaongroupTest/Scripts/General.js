var Report = {};


var printFrame = null;
function getPrintFrame() {
	if (!printFrame) {
		printFrame = document.createElement("iframe");
		printFrame.id = "_printFrame";
		$('body').append(printFrame);
		printFrame.style.display = 'none';
	}
	return printFrame;
}
function getObjectBase64Url(data, mimeType) {
	var binary_string = window.atob(data);
	var len = binary_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	var bb = new Blob([bytes], { type: mimeType });
	return URL.createObjectURL(bb);
}
function getObjectUrl(data, mimeType) {
	var bb = new Blob([data], { type: mimeType });
	return URL.createObjectURL(bb);
}
Report.print = function (config) {
	var frame = getPrintFrame();
	if (config.pdf) {
		printJS(getObjectBase64Url(config.pdf, "application/pdf"));
	}
};
Report.open = function (config) {
	if (!config.mimeType)
		config.mimeType = "text/plain";
	var url = getObjectBase64Url(config.data, config.mimeType);
	window.open(url, "_blank");
};

/*Retorna true si el usario tiene asignado el ROL, Como Parametro recibe el Codigo del Rol  */
function CheckRolUsuario(codigo) {
	return RolesUsuario.filter(function (item) {
		return item.Codigo == codigo;
	}).length > 0;
}

/*Funcion para central el Modal de la Edicion Kendo */
function ModalCenter() {
	var WindowEdit = $("[data-role='window'].k-popup-edit-form");
	if (WindowEdit.length) {
		var win = $(WindowEdit).data("kendoWindow")
		win.center();
	}
	var Kendowin = $("[data-role='window']"); 
	if (Kendowin.length) {
		var win = $(Kendowin).data("kendoWindow")
		win.center();
	}
}

function AlertCenter() {

}

window.onresize = function () {
	ModalCenter();
	AlertCenter();
}


/*Mesaje de Error*/
function ErrorMessagge(msg) {
	$.notify({
		title: "<strong>Error: </strong> ",
		message: msg
	}, {
			type: 'pastel-danger',
			delay: 5000,
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
				'<span data-notify="title">{1}</span>' +
				'<span data-notify="message">{2}</span>' +
				'</div>'
		});
}

function InfoMessage(msg) {

	$.notify({
		title: "<strong>Mensaje: </strong> ",
		message: msg
	}, {
			type: 'pastel-info',
			delay: 5000,
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
				'<span data-notify="title">{1}</span>' +
				'<span data-notify="message">{2}</span>' +
				'</div>'
		});

} 


