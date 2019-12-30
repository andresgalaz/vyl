Ext.define('vyl.controller.Conexion', {
    extend: 'Ext.app.Controller',

    init: function() {
        var me = this;

        me.usuario = {};
        me.appId = 4; // ID del sistema, corresponde a la PK de xformgen4.tSistema, se utiliza en permisos y carga del menu
        me.defaultDataSource = "xgenJNDI";
    },

    getDefaultDS: function() {
        return this.defaultDataSource;
    },

    getUsuario: function() {
        return this.usuario;
    },

    getUsuarioId: function() {
        var me = this,
            usr = me.usuario;
        
        if (usr) {
            return usr.pUsuario;

        } else {
            console.warn('[getUsuarioId] No existe usuario');
        }
    },

    getUsuarioNombre: function() {
        var me = this,
            usr = me.usuario;
        
        if (usr) {
            return usr.cNombre;

        } else {
            console.warn('[getUsuarioNombre] No existe usuario');
        }
    },

    getSistemaId: function() {
        return this.appId;
    },

    setUsuario: function(usr) {
        var me = this;

        me.usuario = usr;
    },
});