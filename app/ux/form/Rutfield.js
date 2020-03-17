Ext.define('vyl.ux.form.Rutfield', {
	extend : 'Ext.form.field.Text',
	alias : 'widget.rut',
	xtype : 'rut',
	viewModel: {
        data: {
            numeroRut: ''
        }
    },

	config : {
		obligatorio : false,
		rut: null
	},

	// twoWayBindable: ['rut'],
	bind: {
		value: '{numeroRut}',
		rut: '{numeroRut}'
	},

	fieldLabel : 'RUT',
	vtype: 'rutCheck',

	//* Override the apply method to add business logic affecting what value is set.
	//* Override the update method when you need to do something after the value has changed.
	//* Do NOT override the getter or setter.

	updateRut: function(value) {
		// console.log('[applyRut] rut:', value);
		var me = this,
			rut = value.trim().toUpperCase();

		// Elimina ceros de la Izquierda
		if (/[0]*/.test(value))
			rut = rut.replace(/[0]*/, '');
		// Saca los separadores de miles en el caso que el RUT venga formateado
		rut = rut.replace(/[\._]/g, '');
		// Separa el número del DV
		var numRut = rut, dv = null;
		if (/[-]/.test(rut)) {
			var arr = rut.split('-');
			numRut = arr[0];
			dv = arr[1];
		} else {
			numRut = rut.substr(0, rut.length - 1);
			dv = rut.substr(rut.length - 1);
		}

		Ext.util.Format.thousandSeparator = '.';

		if (numRut > 0 && numRut.length >= 7 ){
			value = Ext.util.Format.number( numRut, "0,000") + '-' + dv;
			me.setValue(value);
		}
	},

	// applyRut: function(value) {
	// 	console.log('[applyRut] rut:', value);
	//  	return value;
	// }
});