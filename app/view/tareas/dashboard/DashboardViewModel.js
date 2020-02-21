Ext.define('vyl.view.tareas.dashboard.DashboardViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashboard',

    stores: {
        stTareasPendientes: {
            fields: [
                { name: 'pEvento', type: 'int' },
                { name: 'pSecuencia', type: 'int' },
                { name: 'cUsuarioNombre', type: 'string' },
                { name: 'cUsuarioAsignadoNombre', type: 'string' },
                { name: 'pUsuarioAsignadoPadre', type: 'int' },
                { name: 'tCreacion', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                { name: 'tEstimadaFin', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                { name: 'cEtapaTitulo', type: 'string' },
                { name: 'cFlujoTitulo', type: 'string' },
                { name: 'nAtraso', type: 'float' },
                { name: 'cAtraso', type: 'string' },
            ],

            proxy: {
                type : 'wkfcall',
                url : '../do/wkfListaEventos',
                extraParams: {
                    prm_pFlujo: 3
                }
            },

            autoLoad: true,

            sorters: [
                {
                    property: 'nAtraso',
                    direction: 'DESC'
                },
                {
                    property: 'tEstimadaFin',
                    direction: 'ASC'
                }
            ],

            listeners: {
                load: 'onLoadStTareasPendientes'
            }
        },
        
        stTareasPendientesLocal: {
            fields: [
                { name: 'pEvento', type: 'int' },
                { name: 'pSecuencia', type: 'int' },
                { name: 'cUsuarioNombre', type: 'string' },
                { name: 'cUsuarioAsignadoNombre', type: 'string' },
                { name: 'pUsuarioAsignadoPadre', type: 'int' },
                { name: 'tCreacion', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                { name: 'tEstimadaFin', type: 'date', dateFormat: 'Y-m-d H:i:s' },
                { name: 'cEtapaTitulo', type: 'string' },
                { name: 'cFlujoTitulo', type: 'string' },
                { name: 'nAtraso', type: 'float' },
                { name: 'cAtraso', type: 'string' },
            ],

            remoteFilter: true,
            remoteSort: true,

            proxy: {
                type: 'memory',
                enablePaging: true,
                reader: {
                    rootProperty: 'records',
                    totalProperty: 'count'
                }
            },

            pageSize: 25
        }
    }
});