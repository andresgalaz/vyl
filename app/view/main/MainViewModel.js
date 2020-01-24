Ext.define('vyl.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    data: {
        currentView: null
    },
        
    stores: {
        // Store con los accesos que tiene el usuario al sistema
        stNavigationTree: {
            type: 'tree',
            
            fields: [
                { name: "text" },
                { name: "cTpAcceso" },
                { name: "leaf", type:'boolean' },
                { name: "viewType" },
                { name: "cCodArbol" },
                { name: "iconCls" }
            ], 

            clearOnLoad: true, 

            root: {
                expanded: true
            },

            proxy: {
                // url : '../do/vyl/bsh/main/menuGet.bsh',
                url : '../do/menuFull',
                method : 'POST', 
                type : 'ajax',
                reader : {
                    type : 'json',
                    rootProperty : 'children',
                    successProperty : 'success'
                }
            }, 
            
            listeners: {
                load: 'onLoadStNavigationTree' 
            }
        }
    }
});
