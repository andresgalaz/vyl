Ext.define('vyl.view.admin.loteo.LoteoViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.loteo',

    stores: {
        stCargos: {
            fields: ['COD', 'DESCRIPCION'],
            data: [
                { COD: 'S', DESCRIPCION: 'Solicitante' },
                { COD: 'PM', DESCRIPCION: 'Jefe de Proyectos' },
                { COD: 'SG', DESCRIPCION: 'Sub Gerente' },
                { COD: 'G', DESCRIPCION: 'Gerente' },
                { COD: 'U', DESCRIPCION: 'Otro' }
            ]
        },

        stListaLoteoLocal: {
            fields: ['LOTEO_ID', 'LOTEO_NOMBRE', 'LOTEO_DESCRIPCION', 'LOTEO_DESLINDE'],
            remoteFilter: true,
            remoteSort: true,
            proxy: {
                type: 'memory',
                enablePaging: true,
                reader: { rootProperty: 'records', totalProperty: 'count' }
            },
            pageSize: 25
        },

        stListaLoteo: {
            fields: ['LOTEO_ID', 'LOTEO_NOMBRE', 'LOTEO_DESCRIPCION', 'LOTEO_DESLINDE'],
            autoLoad: false,
            proxy: {
                url: GLOBAL_HOST+'/do/vyl/bsh/loteoNombres.bsh',
                cors: true, withCredentials: true, useDefaultXhrHeader: false,
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'response',
                    successProperty : 'success'
                },
                extraParams: {
                    prm_dataSource: 'vylDS'
                }
            },


            listeners: {
                load: 'onLoadStLoteo'
            }
        },

        stPerfiles: {
            fields: ['COD', 'DESCRIPCION'],
            data: [
                { COD: 'S', DESCRIPCION: 'Solicitante' },
                { COD: 'PM', DESCRIPCION: 'Jefe de Proyectos' },
                { COD: 'SG', DESCRIPCION: 'Sub Gerente' },
                { COD: 'G', DESCRIPCION: 'Gerente' },
                { COD: 'U', DESCRIPCION: 'Otro' }
            ]
        }
    }
});
