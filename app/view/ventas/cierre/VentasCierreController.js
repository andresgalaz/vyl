Ext.define('vyl.view.ventas.cierre.VentasCierreController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ventasciere',

	init: function (view) {
		var me = this;

		me.titulo = 'Formulario Cierre Venta';
		me.cxnCtrl = Ext.getApplication().getController('Conexion');
	},

	formularioGrabar: function(accion, borrarFormulario) {
		var me = this,
			refs = me.getReferences(),
			vm = me.getViewModel(),
			formularioId = vm.get('formularioId'),
			view = me.getView(),
			datos = {}
			jsonData = {};
		
		datos = view.getValues();

		// Modifica nacionalidad
		if (datos.VYL_COMPRADOR_SEXO && datos.VYL_COMPRADOR_NACIONALIDAD) {
			var nacSelect = refs.cbNacionalidad.getSelection();

			if (datos.VYL_COMPRADOR_SEXO == 'femenino') {
				datos['VYL_COMPRADOR_NACIONALIDAD'] = nacSelect.get('COD_F') ? nacSelect.get('COD_F') : nacSelect.get('COD');
			} else {
				datos['VYL_COMPRADOR_NACIONALIDAD'] = nacSelect.get('COD_M') ? nacSelect.get('COD_M') : nacSelect.get('COD') ;
			}
		}

		jsonData['DATOS'] = {};
		jsonData.DATOS['formIngreso'] = datos;
		jsonData.DATOS['usuario'] = me.cxnCtrl.getUsuario();

		if (formularioId == 0) {
			// Solicitud nueva
			if (view.getEvento() == 0) {
				// Crea el evento
				view.creaEvento(function callback() {
					// Ejecuta la accion
					jsonData['TOKEN'] = {};
					jsonData.TOKEN['url'] = 'ventas-cierre/' + view.getEvento();
					
					Ext.Ajax.request({
						url : '../do/wkfAccionEvento',
						method : 'POST',
						params : {
							prm_dataSource : 'vylDS', 
							prm_nEvento: view.getEvento(),
							prm_cEtapaActual: view.getEtapaActual(),
							prm_cAccion: accion,
							json_data: JSON.stringify(jsonData)
						},
			
						success : function(response, opts) {
							var resp = Ext.decode(response.responseText);
							if (resp.success) {
								Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');

								if (borrarFormulario) {
									me.formularioReiniciar();
								}

							} else {
								console.error('[formularioGrabar] Error inesperado', resp);
								
								Ext.Msg.show({
									title: me.titulo,
									message: resp.message,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							} 
						},

						failure : function(response, opts) {
							var resp = Ext.decode(response.responseText);
							console.error('[ejecutarAcciones] Falla del lado del servidor', resp);
							Ext.Msg.show({
								title: me.titulo,
								message: 'Falla del lado del servidor',
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
					});
					
				}, me.cxnCtrl.getUsuarioId(), jsonData);

			} else {
				// Error evento <> 0, solicitud = 0
				console.error('[formularioGrabar] Error inesperado: WkfEvento '|| view.getEvento()||' solicitud = 0');
				Ext.Msg.show({
					title: me.titulo,
					message: 'Error inesperado: Se reiniciará el formulario',
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});

				me.formularioReiniciar();
			}
		} else {
			// Solicitud creada
			jsonData['TOKEN'] = {};
			jsonData.TOKEN['url'] = 'ventas-cierre/' + view.getEvento();

			btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
				Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');
			});
		}
	},

	formularioLeer: function(eventoId) {

	},

	formularioReiniciar: function() {
		var me = this,
			refs = me.getReferences();
			vm = me.getViewModel(),
			view = me.getView();
		
		view.resetForm();
		view.setEtapaActual('ingresado');

		vm.setData({
			formularioId: 0,
			rutComprador: '',
			valorPredio: 0,
			valorReserva: 0,
			valorContado: 0,
			cuotas: 0,
			interes: 0
		});

		refs.ctnFinanciamiento.setHidden(true);
		refs.ctnFinanciamientoGastos.setHidden(true);
	},

	renderEstado: function(value, meta) {
        var color, valor;

        switch(value) {
            case '1':
                valor = 'Vigente';
                color = 'green';
                break;
            case '0':
                valor = 'Dado baja';
                color = 'red';
                break;
            default: 
                color = 'grey';
        }

        meta.style = 'color:' + color + ';';
        
        return valor;
	},
	
	salir: function() {
		var me = this,
			defaultToken = Ext.getApplication().getDefaultToken();

		me.formularioReiniciar();
		me.redirectTo(defaultToken);
	},
	
	onActivateConsulta: function() {
		var me = this,
			vm = me.getViewModel(),
			stFormulariosIngresados = vm.getStore('stFormulariosIngresados');
		
		stFormulariosIngresados.load();
	},

	onClienteBuscar: function(fld, event, eOpts) {
		var me = this,
			refs = me.getReferences(),
			view = me.getView(),
			vm = me.getViewModel(),
			frmComprador = refs.frmComprador,
			arrFldsComprador = view.query('[name^="VYL_COMPRADOR"]');
	

		if (fld.isValid()) {
			// Verifica que el cliente exista
			var rut = fld.getValue();

			if (rut != vm.get('rutComprador')) {
				frmComprador.mask('Buscando comprador');

				Ext.Ajax.request({
					url: '../do/vyl/bsh/getComprador.bsh',
					method : 'POST',
					params: {
						prm_dataSource: 'vylDS',
						prm_cRut: rut,
						prm_alias: 'VYL'
					},
					
					success : function(response, opts) {
						var resp = Ext.decode(response.responseText);
	
						if (resp.success) {
							console.log('[onClienteBuscar]', resp);
	
							arrFldsComprador.forEach(function(fld) {
								fld.setReadOnly(false);
							});
	
							if (resp.VYL_COMPRADOR_ID && resp.VYL_COMPRADOR_ID > 0) {
								// Carga el formulario
								var reg = Ext.create('vyl.model.Base');

								reg.set(resp);
								frmComprador.loadRecord(reg);

							} else {
								frmComprador.reset();
								fld.setValue(rut); // Vuelve a colocar el RUT
							}

							vm.set('rutComprador', rut);
	
						} else {
							console.error('[onClienteBuscar]', resp);
							Ext.Msg.show({
								title: me.titulo,
								message: resp.message,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
						
						frmComprador.unmask();
					},
					failure : function(response, opts) {
						var resp = Ext.decode(response.responseText);
						console.error('[onClienteBuscar] Falla del lado del servidor', response.responseText);
						
						frmComprador.unmask();
						Ext.Msg.show({
							title: me.titulo,
							message: resp.message,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						})
					}
				});
			}

		} else {
			if (fld.getValue() != fld.getInputMask()._mask)
				Ext.toast('RUT ingresado inválido', me.titulo, 'tl');

			fld.reset();
			frmComprador.reset();

			arrFldsComprador.forEach(function(fld) {
				fld.setReadOnly(true);
			});

			vm.set('rutComprador', '');
		}
	},

	onCuotasChange: function(fld, event, eOpts) {
		var me = this,
			vm = me.getViewModel(),
			value = fld.getValue();
		
		vm.set('cuotas', value);
	},

	onFormularioCargar: function() {
		var me = this;

		// me.formularioLeer();
	},

	onInteresChange: function(fld, event, eOpts) {
		var me = this,
			vm = me.getViewModel(),
			value = fld.getValue();
		
		vm.set('interes', value);
	},

	onLoadStFormulariosIngresados: function(st, records, successful, operation, eOpts ) {
        var me = this,
			stLocal = me.getViewModel().getStore('stFormulariosIngresadosLocal');
        
		stLocal.getProxy().setData(st.getRange());
		stLocal.load();
    },

	onModalidadVentaSelect: function(cb, record, eOpts) {
		var me = this,
			refs = me.getReferences(),
			view = me.getView(),
			modalidadVenta = record.get('COD'),
			arrFldsFinanciamiento = view.query('[name^="VYL_FINANCIAMIENTO"]'),
			btnContadoFinalizar = view.query('[name="finalizar"]')[0],
			btnLeasing = view.query('[name^="leasing"]')[0];

		if (modalidadVenta == 'financiamiento') {
			// Leasing
			refs.ctnFinanciamiento.setHidden(false);
			refs.ctnFinanciamientoGastos.setHidden(false);

			btnLeasing.setHidden(false);
			btnContadoFinalizar.setHidden(true);

			arrFldsFinanciamiento.forEach(function(fld) {
				if (fld.setObligatorio) {
					fld.setObligatorio(true);
				}
			}); 

		} else {
			// Contado
			refs.ctnFinanciamiento.setHidden(true);
			refs.ctnFinanciamientoGastos.setHidden(true);

			btnLeasing.setHidden(true);
			btnContadoFinalizar.setHidden(false);

			arrFldsFinanciamiento.forEach(function(fld) {
				if (fld.setObligatorio) {
					fld.setObligatorio(false);
				}
			});
		}
	},

	onValorContadoBlur: function(fld, event, eOpts) {
		var me = this,
			vm = me.getViewModel(),
			valor = fld.getValue();
		
		if (valor >= 0) {
			vm.set('valorContado', valor);
		}
	},

	onValorPredioBlur: function(fld, event, eOpts) {
		var me = this,
			vm = me.getViewModel(),
			refs = me.getReferences(),
			valor = fld.getValue();
		
		if (valor >= 0) {
			vm.set('valorPredio', valor);
			refs.nfReserva.setMaxValue(valor);
		}
	},

	onValorReservaBlur: function(fld, event, eOpts) {
		var me = this,
			vm = me.getViewModel(),
			valor = fld.getValue();
		
		if (valor >= 0) {
			vm.set('valorReserva', valor);
		}
	},

	onWkfAccion: function(btn, event, eOpts) {
		var me = this,
			accion = btn.name,
			view = me.getView();
		
		switch (accion) {
			case 'cancelar': 
				// TODO
				break;
				å
			case 'grabar':
				me.formularioGrabar(accion, true);
				break;

			case 'finalizar':
			case 'leasing':
				if (view.isValid()) {
					me.formularioGrabar(accion, true);

				} else {
					// Campos invalidos
					Ext.Msg.show({
                        title: me.titulo,
                        message: 'Existen campos obligatorios de completar vacios o inválidos.<br>Por favor verificar formulario',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING,
                    });
				}

				break;
			
			case 'salir':
				me.salir();
				break;

			case 'nuevo':
				me.formularioReiniciar();
				break;

			default:
				break;
		}
	}
});