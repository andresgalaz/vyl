Ext.define('vyl.view.tareas.asignacion.AsignacionViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.asignacion',

    stores: {
        stRoles: { 
            idProperty: 'COD',
            fields: [
                { name: 'ID', type: 'int' },
                { name: 'COD', type: 'string' },
                { name: 'ROL', type: 'string' }
            ],

            autoLoad: true,
            // proxy: {
            //     type : 'jsoncall',
            //     extraParams : {       
            //         // TODO: Implementar funcion     
            //         // prm_funcion : 'pe.js_pe_tareas.operConsultaRoles'
            //     }
            // }
        },
        stUsrAsignados: {
            fields: [
                { name: 'USUARIO', type: 'string' },
                { name: 'NOMBRE', type: 'string' },
                { name: 'ROL', type: 'string' },
                { name: 'CANT_TAREAS', type: 'int' },
                { name: 'TOTAL_TAREAS', type: 'int' },
            ],
            autoLoad: false,
            // proxy: {
            //     type : 'jsoncall',
            //     extraParams : {            
            //         // TODO: Implementar funcion
            //         // prm_funcion : 'pe.js_pe_tareas.operConsultaUsuariosRol'
            //     }
            // }
        },
        stUsuarios: {
            fields: [
                { type: 'string', name: 'NOMBRE' },
                { type: 'string', name: 'USUARIO' },
                { type: 'int', name: 'ID' },
                { type: 'int', name: 'ID_USR_PADRE' }
            ],
            autoLoad: false,
            // proxy: {
            //     type : 'jsoncall',
            //     extraParams : {       
            //         // TODO: Implementar funcion     
            //         // prm_funcion : 'pe.js_pe_tareas.operConsultaUsuarios'
            //     }
            // }
        },
        stUsrDetalle: {
            fields: [
                'USUARIO',
                'ROL',
                'CANT_TAREAS',
                'NOMBRE'
            ],
            autoLoad: true,

            // proxy: {
            //     type : 'jsoncall',
            //     extraParams : {            
            //         // TODO: Implementar funcion
            //         // prm_funcion : 'pe.js_pe_tareas.operConsultaUsuariosRol'
            //     }
            // },

            groupField: 'NOMBRE',
            sorters: ['ROL','NOMBRE']
        },
        stRolDetalle: {
            fields: [
                'ROL',
                'TAREA',
                'HS_ESTIMADAS',
                'CIRCUITO',
                'CANT_USRS_ASIGNADOS'
            ],
            autoLoad: true,

            // proxy: {
            //     type : 'jsoncall',
            //     extraParams : {       
            //         // TODO: Implementar funcion     
            //         // prm_funcion : 'pe.js_pe_tareas.operConsultaRolDetalles'
            //     }
            // },

            groupField: 'ROL',
            sorters: ['TAREA','CIRCUITO','ROL']
        }   
    },
});