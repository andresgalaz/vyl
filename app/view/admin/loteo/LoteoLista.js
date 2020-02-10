Ext.define('vyl.view.admin.loteo.LoteoLista', {
	extend : 'Ext.grid.Panel',
	xtype : 'loteoLista',
	plugins : 'gridfilters',
	width : '100%',
	scrollable : true,
	emptyText : 'No existen loteo ingresados con este filtro',
	viewConfig : {
		stripeRows : true
	},
	listeners : {
		activate : 'onActivateGrillaLista',
		itemdblclick : 'onDblClickGrillaLista'
	},
	bind : {
		store : '{stListaLoteoLocal}'
	},
	dockedItems : [ {
		xtype : 'pagingtoolbar',
		dock : 'bottom',
		displayInfo : true,
		bind : '{stListaLoteoLocal}',
		doRefresh : function() {
			this.fireEvent('refrescar');
		},
		listeners : {
			refrescar : 'onRefrescar'
		}
	} ],
	columns : [ {
		text : "ID",
		dataIndex : 'LOTEO_ID',
		hidden : true
	}, {
		text : "Nombre",
		dataIndex : 'LOTEO_NOMBRE',
		flex : 1,
		filter : {
			type : 'string',
			itemDefaults : {
				emptyText : 'Buscar por nombre...'
			}
		}
	}, {
		text : "Descripción",
		dataIndex : 'LOTEO_DESCRIPCION',
		flex : 3
	}, {
		xtype : 'actioncolumn',
		align : 'center',
		width : 100,
		items : [ 
			{
			iconCls : 'x-fa fa-trash separador_accionColumn',
			tooltip : 'Borrar lote',
			handler : 'onEliminarRegistro'
		}, {
			iconCls : 'x-fa fa-file-text-o separador_accionColumn',
			tooltip : 'Ver detalles',
			handler : 'onCargarRegistro'
		} ]
	} ]
});