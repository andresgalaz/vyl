Ext.define('vyl.view.tareas.dashboard.Dashboard', {
    extend: 'Ext.container.Container',
    xtype: 'tareas-dashboard',
    
    requires: [
        'vyl.view.tareas.dashboard.DashboardController',
        'vyl.view.tareas.dashboard.DashboardViewModel',
    ],

    controller: 'dashboard',
    viewModel: {
        type: 'dashboard'
    },

    layout: 'fit',

    listeners: {
        activate: 'onActivate',
        afterrender: 'onAfterRender'
    },
    
    margin: '10 20 0 20',
    
    items: [
        {
            xtype: 'grid',
            reference: 'gdPendientes',
            title: 'Tareas pendientes',
        
            bind: {
                store: '{stTareasPendientesLocal}',
            },
        
            scrollable: 'y',
        
            emptyText: 'No existen tareas pendientes',
            viewConfig: {
                stripeRows: true,
                listeners: {
                    expandbody: 'onGrillaPendientesExpand'
                }
            },
        
            plugins: [
                {
                    ptype: 'rowexpander',
                    rowBodyTpl : new Ext.XTemplate('<div class="detailData"></div>'),
                },
                {
                    ptype: 'gridfilters'
                }
            ],
        
            listeners: {
                rowdblclick: 'onGrillaPendientesDblClick',
                afterrender: 'onGrillaPendientesAfterRender',
            },
        
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    fixed: true,
                    ui: 'wkf-tlb-acciones',
                    margin: '10 0 5 0',
                    defaultButtonUI: 'wkf-tlb-acciones-toolbar',
                    items: [
                        {
                            text: 'Resolver Tarea',
                            tooltip: 'Direccionar al módulo que resuelve la tarea',
                            iconCls: 'x-fa fa-stack-overflow',
                            handler: 'onResolverTarea'
                        },
                        '-', 
                        {
                            text: 'Derivar',
                            hidden: true, //Funcion desactivada para este proyecto
                            reference: 'btnTareaDerivar',
                            tooltip: 'Derivar la tarea a otro usuario',
                            iconCls: 'x-fa fa-reply',
                            handler: 'onDerivarTarea'
                        },
                        '->',
                        {
                            xtype: 'tbtext',
                            reference: 'txUltimaActualizacion',
                            cls: 'tlb-grilla-pendientes'
                        },
                        '-',
                        {
                            xtype: 'segmentedbutton',
                            defaults: {
                                handler: 'onRefrescar'
                            },
                            reference: 'sbVerTareas',
                            items: [
                                {
                                    text: 'Propias',
                                    value: 'tareas_propias',
                                    pressed: true,
                                    tooltip: 'Tareas pendientes propias'
                                }, 
                                {
                                    text: 'Equipo a Cargo',
                                    value: 'tareas_a_cargo',
                                    tooltip: 'Tareas pendientes de usuarios a cargo'
                                }, 
                                {
                                    text: 'Todas',
                                    reference: 'btnTareasTodas',
                                    value: 'tareas_todas',
                                    tooltip: 'Ver todas las tareas pendientes',
                                    // disabled: true  //Ver wkfListaEventos, sin parametros solo trae las tareas del usr conectado
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-refresh',
                            handler: 'onRefrescar',
                            tooltip: 'Actualizar datos'
                        }
                    ]
                },
                {
                    xtype: 'pagingtoolbar',
                    dock: 'bottom',
                    controller: 'dashboard',
                    displayInfo: true,
                    bind: '{stTareasPendientesLocal}'
                },
            ],
            
            columns: [
                {
                    text: 'Prioridad',
                    dataIndex: 'nAtraso',
                    width: 70, // Mantener fijo
                    renderer: function(value, metaData) {
                        if (value >= 0 && value < 20) {
                            metaData.tdCls = 'icono-baja';
                        } else if (value >= 20 && value < 40) {
                            metaData.tdCls = 'icono-media';
                        } else if (value >= 40 && value < 60) {
                            metaData.tdCls = 'icono-alta';
                        } else if (value > 60) {
                            metaData.tdCls = 'icono-urgente';
                        }
        
                        return;
                    }
                },
                {
                    text: 'Tiempo Restante',
                    dataIndex: 'cAtraso',
                    flex: 1,
                    sortable: false,
                },
                {
                    text: 'Tarea',
                    dataIndex: 'cEtapaTitulo',
                    flex: 2,
                    sortable: true,
                    filter: {
                        type: 'list',
                    },
                },
                {
                    text: 'Solicitante',
                    dataIndex: 'cUsuarioNombre',
                    flex: 1,
                    sortable: true,
                },
                {
                    text: 'Asignado',
                    reference: 'colUsuarioAsignado',
                    dataIndex: 'cUsuarioAsignadoNombre',
                    flex: 1,
                    sortable: true,
                    hidden: true,
                    filter: {
                        type: 'list',
                    },
                },
                // {
                //     text: 'Creación',
                //     dataIndex: 'tCreacion',
                //     formatter: 'date("d/m/Y H:i")',
                //     width: 130,
                //     sortable: true,
                // },
                {
                    text: 'Finalización Estimada',
                    dataIndex: 'tEstimadaFin',
                    formatter: 'date("d/m/Y H:i")',
                    width: 130,
                    sortable: true,
                    filter: true 
                },
            ],        
        }
    ]
});