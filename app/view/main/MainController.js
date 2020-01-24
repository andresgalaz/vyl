Ext.define('vyl.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onNoRoute'
            }
        }
    },

    routes: {
        ':node': {
            action: 'onRouteChange',
            before: 'beforeRoute'
        },

        ':node/:id': {
            action: 'onRouteChange',
            before: 'beforeRouteDeep'
        }
    },

    lastView: null,
    activeNode: null,

    init: function () {
        var me = this;

        console.log('[init]');
        me.titulo = 'Compustrom - Lakus Sistema Venta y Leasing';
    },

    beforeRoute: function (node, action) {
        // Tipicamente controla el acceso del usuario a la ruta
        var me = this,
            vm = me.getViewModel(),
            refs = me.getReferences(),
            stNavigationTree = vm.getStore('stNavigationTree'),
            token, newToken;
        
        Ext.Ajax.request({
            url: '../do/estadoSesion',
            method: 'POST',
            extraParams: {
                st: stNavigationTree
            },
            success: function (response, opts) {
                var rta = Ext.decode(response.responseText);
                if (!rta.bConectado || rta.cUsuario == 'automata') {
                    // Si no esta conectado => fuerza pantalla login
                    if (refs.wndLogin) {
                        refs.wndLogin.show();
                    } else {
                        var pnLogin = refs.wndLogin ? refs.wndLogin : Ext.create({
                            xtype: 'login',
                            reference: 'wndLogin',
                            listeners: {
                                close: 'onLoginOk',
                            }
                        });

                        console.log('[beforeRoute] login', pnLogin);
                        pnLogin.show();
                    }
                } else {
                    // Control de acceso al modulo destino
                    newToken = action.getUrlParams().input;
                    var node = opts.extraParams.st.findNode('viewType', newToken);

                    if (node && node.data.cTpAcceso == 'DENEGAR') {
                        Ext.Msg.show({
                            title: me.titulo,
                            message: 'Usted no tiene permisos al módulo que intenta acceder',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.ERROR
                        });
                        return;
                    }

                    action.resume();
                }
            },
            failure: function (response, opts) {
                console.error('Falla del lado del servidor, código respuesta: ' + response.responseText);
                Ext.Msg.show({
                    title: me.titulo,
                    message: 'Error inesperado del servidor',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            }
        });
    },

    beforeRouteDeep: function (node, id, action) {
        action.resume();
    },

    doLogin: function () {
        var me = this,
            refs = me.getReferences(),
            pnLogin = refs.wndLogin ? refs.wndLogin : Ext.create({
                xtype: 'login',
                reference: 'wndLogin',
                listeners: {
                    close: 'onLoginOk',
                }
            });

        console.log('[doLogin] login', pnLogin);
        pnLogin.show();
    },


    filterNodes: function () {
        var me = this,
            store = me.getViewModel().getStore('stNavigationTree'),
            nodeMsj = store.findNode('viewType', 'pe-mensajes-inbox');

        if (nodeMsj) {
            store.filterBy(function (rec) {
                return rec != nodeMsj;
            });
        }
    },

    getActiveNode: function () {
        return this.activeNode;
    },

    setCurrentView: function (hashTag, callback) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag),
            view = (node && node.get('viewType')), // || 'page404',
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {

            if (!view) {
                // A veces sucede que no llega a levantar el viewType al iniciar el sistema
                // Vuelve a llamar onRoteChange

                console.warn('[setCurrentView] No existe view, vuelve a cargar onRouteChange', node);
                this.onRouteChange(hashTag);
                return;

            } else {
                newView = Ext.create({
                    xtype: view,
                    routeId: hashTag,  // for existingItem search later
                    hideMode: 'offsets'
                });
            }
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.

            // Asigno el node aca para que el listener activate pueda tomar el nodo activo y asi determinar los permisos sobre el 
            me.activeNode = node;

            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
        me.activeNode = node;

        if (callback) {
            callback();
        }
    },

    onLoadStNavigationTree: function (tree, records, successful, operation, node, eOpts) {
        // Filtra nodo mensajes que debe existir en el treeStore pero no mostrarse
        if (successful) {
            this.filterNodes();
        }
    },

    onMensajes: function () {
        // this.redirectTo('pe-mensajes-inbox');
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            stNavigationTree = me.getViewModel().getStore('stNavigationTree'),
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 45 : 250;

        // Quito filtro para que no de errores 
        stNavigationTree.clearFilter();

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.cntLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);

                refs.haLogo.removeCls('ha-logo-micro');
                refs.haLogo.addCls('ha-logo');

                me.filterNodes();
            }

            navigationList.canMeasure = false;

            // Start this layout first since it does not require a layout
            refs.haLogo.animate({ dynamic: true, to: { width: new_width } });

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({ isRoot: true });
            navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                        navigationList.canMeasure = true;
                    },
                    single: true,
                });

                refs.haLogo.removeCls('ha-logo');
                refs.haLogo.addCls('ha-logo-micro');
            }
        }
    },

    onLoginOk: function (pnl, opts) {
        var me = this,
            refs = me.getReferences(),
            app =  Ext.getApplication(),
            stNavigationTree = refs.navigationTreeList.getStore(),
            cxnCtrl = app.getController('Conexion'),
            usrNombre = cxnCtrl.getUsuarioNombre(),
            hash = me.getHash() ? me.getHash() : app.getDefaultToken();

        if (usrNombre)
            refs.usrConectado.setData(usrNombre);

        // Carga el menu lateral con los permisos para el usuario logueado
        if (stNavigationTree.getRoot().childNodes.length > 0) {
            stNavigationTree.getRoot().removeAll();
        }

        console.log('[onLoginOk] usuario', cxnCtrl.getUsuario());
        stNavigationTree.load({
            params: {
                prm_cCodArbol: cxnCtrl.getSistemaId()
            },
            callback: function (records, operation, success) {
                if (hash)
                    me.setCurrentView(hash);
            
                // var app = Ext.getApplication(),
                //     defaultToken = app.getDefaultToken();

                // // IMPORTANTE: Modificar aca si se quiere usar otro view predeterminado segun perfil usuario
                // // me.setCurrentView(defaultToken);

                // // Modifica el defaultToken en caso que el perfil requiera otro que el dashboard de tareas
                // Ext.Ajax.request({
                //     url: '../do/vyl/bsh/main/menuPerfiles.bsh',
                //     method: 'POST',
                //     params: {
                //         prm_dataSource: cxnCtrl.getDefaultDS(),
                //     },
                //     success: function (response, opts) {
                //         var obj = Ext.decode(response.responseText);
                //         if (obj.success) {
                //             var data = obj.response,
                //                 importancia = 0;

                //             data.forEach(function (pf) {
                //                 switch (pf) {
                //                     // Perfiles con el mismo nivel de importancia son incompatibles
                //                 }
                //             });

                //             if (app.getDefaultToken()) {
                //                 app.redirectTo(app.getDefaultToken());
                //             }
                //         }
                //     }
                // });
            }
        });
    },

    onLogout: function () {
        var me = this,
            refs = me.getReferences(),
            pnLogin = refs.wndLogin ? refs.wndLogin : Ext.create({
                xtype: 'login',
                reference: 'wndLogin',
                listeners: {
                    close: 'onLoginOk',
                }
            });

        Ext.Ajax.request({
            url: '../do/salir',
            method: 'POST',
            success: function (response, opts) {
                if (response.status == 200) {
                    console.log('[onLogout] login', pnLogin);
                    pnLogin.show();

                } else
                    console.error(response.responseText);
            },
            failure: function (response, opts) {
                console.error('Falla del lado del servidor, código respuesta: ' + response.status);
            }
        });
    },

    onNoRoute: function (node, evento_id) {
        console.error('No existe el nodo', node);
    },

    onRouteChange: function (node, evento_id) {
        // IMPORTANTE: El parametro evento_id corresponde a la PK de wkf_evento que la vista espera para poder 
        // cargar datos. Dicha vista debe tener el listener 'cargadatos' direccionado a una funcion u otro evento.
        // Ejemplo this.redirectTo('pe-ingreso-solicitud/1234'); carga la vista pe-ingreso-solicitud cuyo wkf_evento_id=1234

        var me = this,
            view = me.getView(),
            cxnCtrl = Ext.getApplication().getController('Conexion'),
            stNavigationTree = me.getViewModel().getStore('stNavigationTree'),
            activeView;

        view.mask('Cargando Sistema');

        console.log('[onRouteChange] usuario', cxnCtrl.getUsuario());

        if (stNavigationTree.getCount() == 0) {
            // Primera carga del sistema requiere sincronismo con el store del mainTree
            // Fuerza espera 3s para volver a intentar
            setTimeout(function () {
                if (stNavigationTree.getCount() == 0) {

                    stNavigationTree.load({
                        params: {
                            prm_cCodArbol: cxnCtrl.getSistemaId()
                        },
                        callback: function (records, operation, success) {
                            if (success && records.length > 0) {

                                me.setCurrentView(node, function () {
                                    // Funcion callback que carga datos en la vista
                                    if (id) {
                                        activeView = me.lastView;
                                        activeView.fireEvent('cargadatos', evento_id);
                                    }
                                    view.unmask();
                                });
                            } else {
                                Ext.Msg.show({
                                    title: me.titulo,
                                    message: 'El usuario logeado no tiene permisos para utilizar este sistema',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.ERROR,
                                    fn: function (btn) {
                                        if (btn === 'ok') {
                                            view.unmask();
                                            me.onLogout();
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else {
                    me.setCurrentView(node, function () {
                        // Funcion callback que carga datos en la vista
                        if (id) {
                            activeView = me.lastView;
                            activeView.fireEvent('cargadatos', evento_id);
                        }
                        view.unmask();
                    });
                }
            }, 2000);
        } else {
            me.setCurrentView(node, function () {
                // Funcion callback que carga datos en la vista
                if (id) {
                    activeView = me.lastView;
                    activeView.fireEvent('cargadatos', evento_id);
                }
                view.unmask();
            });
        }
    },

    getHash: function () {
        var hash = window.location.hash;
        
        return hash.substring(1, hash.length);
    }
});
