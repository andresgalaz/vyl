
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
    passwordMatchText: 'La password no coincide'
});