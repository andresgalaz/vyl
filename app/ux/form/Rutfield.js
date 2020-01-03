Ext.define('vyl.ux.form.Rutfield', {
	extend : 'Ext.form.field.Text',
	alias : 'widget.rut',
	xtype : 'rut',

	config : {
		obligatorio : false
	},

	placeholder : 'xx.xxx.xxx-x',
	inputMask : '99.999.999-*',

	fieldLabel : 'RUT',

	constructor : function(config) {
		var me = this;

		me.callParent(arguments);
		me.initConfig(config);
	},

	isValid : function() {
		var me = this;

		if (me.disabled) {
			return true;
		} else {
			return this.validate();
		}
	},

	validate : function() {
		var me = this, valid = false;

		if (me.isDirty()) {
			// Valida DV del RUT
			var rut = me.value.trim().toUpperCase();
			if (rut.length > 1) {
				// Elimina ceros de la Izquierda
				if (/[0]*/.test(numRut))
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

				// El RUT sin DV tiene que ser numérico y como máximo 8 dígitos
				if ((numRut = parseInt(numRut)) != NaN && numRut <= 99999999) {
					// Cálcula DV
					var dig = 0, suma = 1;
					for (; numRut; numRut = Math.floor(numRut / 10))
						suma = (suma + numRut % 10 * (9 - dig++ % 6)) % 11;
					var dvCalc = (suma ? suma - 1 : 'K');
					console.log('dvCalc ' + dvCalc);
					// Compara el DV calculado con el ingresado
					valid = (dv == dvCalc);
				}
			}

		} else {
			if (me.disabled) {
				valid = true
			} else if (!me.allowBlank) {
				valid = false;
			}
		}

		if (valid)
			me.setStyle('borderColor', '#c9c9c9');
		else
			me.setStyle('borderColor', 'red');

		return valid;
	}
});