
Ext.define('vyl.override.AdvancedVType', {
    override: 'Ext.form.field.VTypes',
    
    passwordCheck: function(val, field) {
        var reg = /^.*(?=.{8,})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
        return reg.test(val);
    },
    passwordCheckText: 'La password ingresada debe tener al menos 8 caracteres alfanuméricos',

    passwordMatch: function(val, field) {
        if (field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordMatchText: 'La password no coincide',

    rutCheck: function(val, field) {
        var rut = val.trim().toUpperCase(),
            valid = false;

        if (rut.length > 1) {
            // Elimina ceros de la Izquierda
            if (/[0]*/.test(val))
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
                // Compara el DV calculado con el ingresado
                valid = (dv == dvCalc);
            }
        }

        return valid;
    },
    rutCheckText: 'El número de RUT ingresado es inválido',

});