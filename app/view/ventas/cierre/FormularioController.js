Ext.define('vyl.view.ventas.cierre.FormularioController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ventasciere',

	init: function (view) {
	},

	onCargarFormulario: function() {
	},
	
	onClienteBuscar: function(fld, event, eOpts) {
		var me = this,
			refs = me.getReferences(),
			view = me.getView(),
			frmComprador = refs.frmComprador,
			arrFldsComprador = view.query('[name^="VYL_COMPRADOR"]');
	

		if (fld.isValid()) {
			// Verifica que el cliente exista
			var rut = fld.getValue();

			arrFldsComprador.forEach(function(fld) {
				fld.setReadOnly(false);
			});

		} else {
			fld.reset();
		}
	},

	onModalidadVentaSelect: function(cb, record, eOpts) {
		var me = this,
			refs = me.getReferences(),
			view = me.getView(),
			modalidadVenta = record.get('COD'),
			arrFldsFinanciamiento = view.query('[name^="VYL_FINANCIAMIENTO"]');

		if (modalidadVenta == 'financiamiento') {
			refs.ctnFinanciamiento.setHidden(false);

			arrFldsFinanciamiento.forEach(function(fld) {
				fld.setObligatorio(true);
			});

		} else {
			refs.ctnFinanciamiento.setHidden(true);

			arrFldsFinanciamiento.forEach(function(fld) {
				fld.setObligatorio(false);
			});
		}
	},

	onWkfAccion: function(fld, event, eOpts) {
		var me = this,
			accion = fld.name;
	}
});