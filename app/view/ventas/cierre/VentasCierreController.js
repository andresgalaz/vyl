Ext.define('vyl.view.ventas.cierre.VentasCierreController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.ventasciere',

	init: function (view) {
		var me = this;

		me.titulo = 'Formulario Cierre Venta';
		me.cxnCtrl = Ext.getApplication().getController('Conexion');
	},

	formularioGrabar: function(btn, borrarFormulario) {
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
					
					btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
						if (dataOut.success) {
							Ext.Msg.alert(me.titulo, 'Formulario grabado con éxito.');

							if (borrarFormulario) {
								me.formularioReiniciar();
							}

						} else {
							console.error('[formularioGrabar] Error inesperado', resp);
							
							Ext.Msg.show({
								title: me.titulo,
								message: dataOut.message,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
					});
					
				}, me.cxnCtrl.getUsuarioId(), jsonData);

			} else {
				// Error evento <> 0, solicitud = 0
				console.error('[formularioGrabar] Error inesperado: WkfEvento ' + view.getEvento() + ' solicitud = 0');
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

				if (borrarFormulario) 
					me.formularioReiniciar();
			});
		}
	},

	formularioLeer: function(eventoId) {
		var me = this,
			vm = me.getViewModel(),
			view = me.getView();

		me.formularioReiniciar();

		view.mask('Cargando Formulario');

		view.setEvento(eventoId);
		view.leeEvento(function(rta) {
			// Cargar formulario
			var formData = rta.dataFormulario ? rta.dataFormulario : null;

			if (formData) {
				var registro = Ext.create('vyl.model.Base');

				registro.set(formData);
				view.loadRecord(registro);

				view.setTitle('Formulario Cierre de Venta - ' + rta.dataWkf.etapas[0].cTitulo);

				if (formData.VYL_ID)
					vm.set('formularioId', formData.VYL_ID);

				if (formData.VYL_COMPRADOR_RUT)
					vm.set('rutComprador', formData.VYL_COMPRADOR_RUT);
			
				if (formData.VYL_VALOR)
					me.setValorPredio(formData.VYL_VALOR);
				
				if (formData.VYL_RESERVA)
					me.setValorReserva(formData.VYL_RESERVA);
				
				if (formData.VYL_FINANCIAMIENTO_PIE)
					me.setValorContado(formData.VYL_FINANCIAMIENTO_PIE);
			}

			view.unmask();
		});
	},

	formularioReiniciar: function() {
		var me = this,
			refs = me.getReferences();
			vm = me.getViewModel(),
			view = me.getView();
		
		view.resetForm();
		view.setEtapaActual('ingresado');
		view.setTitle('Formulario Cierre de Venta - Nuevo');

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
	
	salir: function() {
		var me = this,
			defaultToken = Ext.getApplication().getDefaultToken();

		me.formularioReiniciar();
		me.redirectTo(defaultToken);
	},

	setValorContado: function(valor) {
		var me = this,
			vm = me.getViewModel();
		
		if (valor >= 0) {
			vm.set('valorContado', valor);
		}
	},

	setValorPredio: function(valor) {
		var me = this,
			vm = me.getViewModel(),
			refs = me.getReferences();
		
		vm.set('valorPredio', valor);
		refs.nfReserva.setMaxValue(valor);
	},

	setValorReserva: function(valor) {
		var me = this,
			vm = me.getViewModel();
		
		vm.set('valorReserva', valor);
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
	
	onConsultaActivate: function() {
		var me = this,
			vm = me.getViewModel(),
			stFormulariosIngresados = vm.getStore('stFormulariosIngresados');
		
		stFormulariosIngresados.load();
	},

	onConsultaRowDblClick: function(grid, record, element, rowIndex, e, eOpts) {
		var me = this,
			eventoId = record.get('WKF_EVENTO');

		if (eventoId > 0) {
			me.redirectTo('ventas-cierre/' + eventoId);
		
		} else {
			console.warn('[onConsultaRowDblClick] Evento invalido ' + eventoId, record);
		}
	},


	onConsultarFormulario: function(view, rowIdx, colIdx, item, e, record, row) {
		var me = this,
			eventoId = record.get('WKF_EVENTO');

		if (eventoId > 0) {
			me.redirectTo('ventas-cierre/' + eventoId);
		
		} else {
			console.warn('[onConsultarFormulario] Evento invalido ' + eventoId, record);
		}
	},

	onCuotasChange: function(fld, event, eOpts) {
		var me = this,
			vm = me.getViewModel(),
			value = fld.getValue();
		
		vm.set('cuotas', value);
	},

	onFormularioActivate: function() {
		var me = this,
			vm = me.getViewModel(),
			stLoteo = vm.getStore('stLoteo');

		stLoteo.reload();
	},

	onFormularioCargar: function(eventoId) {
		var me = this;

		if (eventoId > 0) {
			me.formularioLeer(eventoId);
		}	
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
	
	onLoteoNuevo: function() {
		var me = this;

		me.redirectTo('admin-loteo/0');
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
			valor = fld.getValue();
		
		if (valor >= 0) {
			me.setValorContado(valor);
		}
	},

	onValorPredioBlur: function(fld, event, eOpts) {
		var me = this,
			valor = fld.getValue();
		
		if (valor >= 0) {
			me.setValorPredio(valor);
		}
	},

	onValorReservaBlur: function(fld, event, eOpts) {
		var me = this,
			valor = fld.getValue();
		
		if (valor >= 0) {
			me.setValorReserva(valor);
		}
	},

	onWkfAccion: function(btn, event, eOpts) {
		var me = this,
			accion = btn.name,
			view = me.getView();
		
		switch (accion) {
			case 'cancelar': 
				btn.ejecutarAcciones(jsonData, view.getEvento(), view.getEtapaActual(), function(dataOut) {
					Ext.Msg.alert(me.titulo, 'Formulario cancelado con éxito.');
						me.formularioReiniciar();
				});
				break;

			case 'grabar':
				me.formularioGrabar(btn, true);
				break;

			case 'finalizar':
			case 'leasing':
			case 'cotizacion':
			case 'cotizacion_envio':
			case 'transferencia_reciba':	
			case 'transferencia_no_recibida':
			case 'leasing_finalizar':
				if (view.isValid()) {
					me.formularioGrabar(btn, true);

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