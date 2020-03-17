Ext.define('vyl.view.tareas.asignacion.AsignacionViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.asignacion',

    stores: {
        stRoles: { 
            idProperty: 'pRol',
            fields: [
                { name: 'pRol', type: 'int' },
                { name: 'cRol', type: 'string' },
                { name: 'cRolTitulo', type: 'string' },
                { name: 'fSistema', type: 'int' }
            ],
            autoLoad: true,
            proxy: {
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                // url : GLOBAL_HOST+'/do/vyl/bsh/wkfListaRol.bsh',
                url : GLOBAL_HOST+'/do/wkfListaRol',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST'
            }
        },

        stUsrAsignados: {
            fields: [
                { name: 'pUsuario', type: 'string' },
                { name: 'cUsuarioNombre', type: 'string' },
                { name: 'cUsuario', type: 'string' },
                { name: 'cRolTitulo', type: 'string' },
                { name: 'nCantidadTareas', type: 'int' },
                { name: 'nTotalTareas', type: 'int' },
                { name: 'pRol', type: 'int' }
            ],
            autoLoad: false,
            proxy: {
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                // url : GLOBAL_HOST+'/do/vyl/bsh/wkfListaRolUsuarios.bsh',
                url : GLOBAL_HOST+'/do/wkfListaRolUsuarios',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST'
            }
        },

        stUsuarios: {
            idProperty: 'pUsuario',
            fields: [
                { name: 'cUsuario', type: 'string' },
                { name: 'cUsuarioNombre', type: 'string' },
                { name: 'pUsuario', type: 'int' },
                { name: 'fSistema', type: 'int' }
            ],
            autoLoad: false,
            proxy: {
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                // url : GLOBAL_HOST+'/do/vyl/bsh/wkfListaUsuariosJerarquia.bsh',
                url : GLOBAL_HOST+'/do/wkfListaUsuariosJerarquia',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
                extraParams :{
                    prm_fSistema: 3
                }
            }
        },

        stRolUsuarios: {
            fields: [
                { name: 'pRol', type: 'int' },
                { name: 'cRol', type: 'string' },
                { name: 'cRolTitulo', type: 'string' },
                { name: 'nCantidadTareas', type: 'int' },
                { name: 'nTotalTareas', type: 'int' },
                { name: 'pUsuario', type: 'int' },
                { name: 'cUsuario', type: 'string' },
                { name: 'cUsuarioNombre', type: 'string' },
            ],
            autoLoad: true,

            proxy: {
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                // url : GLOBAL_HOST+'/do/vyl/bsh/wkfListaRolUsuarios.bsh',
                url : GLOBAL_HOST+'/do/wkfListaRolUsuarios',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
                extraParams :{
                }
            },

            groupField: 'cUsuarioNombre',
            sorters: ['cRolTitulo','cRol']
        },
        
        stRolDetalle: {
            fields: [
                { name: 'cRol', type: 'string' },
                { name: 'cRolTitulo', type: 'string' },
                { name: 'cEtapa', type: 'string' },
                { name: 'cEtapaTitulo', type: 'string' },
                { name: 'nDuracionMinutos', type: 'int' },
                { name: 'nDuracionHoras', type: 'int' },
                { name: 'cFlujo', type: 'string' },
                { name: 'cFlujoTitulo', type: 'string' },
                { name: 'nUsuariosAsignados', type: 'int' },
            ],
            autoLoad: true,

            proxy: {
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                // url : GLOBAL_HOST+'/do/vyl/bsh/wkfListaRolDetalle.bsh',
                url : GLOBAL_HOST+'/do/wkfListaRolDetalle',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                method : 'POST',
            },

            groupField: 'cRolTitulo',
            sorters: ['cEtapaTitulo','cFlujoTitulo','cRol']
        }   
    },
});
