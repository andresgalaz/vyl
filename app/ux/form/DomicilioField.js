Ext.define('vyl.ux.form.DomicilioField', {
    extend: 'Ext.Component',
    mixins: [
        'Ext.form.Labelable', //Necesario para que el fieldset lo tome para hacer este campo disabled
    ],
    // TODO: Integrar el labelField
    alias: 'widget.wkfDomicilioField',
    xtype: 'wkfdomiciliofield',

    config: {
        georeferencia: null, // Objeto georeferencia google
        direccion: {        // Datos enviados al XML por getValue()
            direccion: '',
            barrio: '',
            lat: 0,
            lng: 0
        },
        obligatorio: false,
    },

    inputType: 'text',
    submitValue: true,
    isFormField: true,
    autocomplete: null,
    readOnly: false,
    emptyText: 'Ingrese Domicilio',

    listeners: {
        afterrender: {
            fn: function(fld, opts) {
                var me = this,
                    input,
                    options = {},
                    areaCobertura;
                
                input = Ext.getDom(me.getId() + '-inputEl');
                
                if (input) {
                    areaCobertura = new google.maps.Circle({
                        center: new google.maps.LatLng(-34.591882, -58.4038007), //Coordenadas HA
                        radius: 50000 //50km
                    });
    
                    options = {
                        bounds: areaCobertura.getBounds(), 
                        types: ['address'],
                        componentRestrictions: {country: 'ar'}
                    };
    
                    me.setAutocomplete(fld, new google.maps.places.Autocomplete(input, options));
                    
                } else {
                    console.warn('[afterrender] No existe input fld');
                }
            }
        },
        // blur
        focusleave: function(fld, evt, opts) {
            this.isValid();
        }
    },

    initComponent: function() {
        var me = this,
            input,
            options = {},
            areaCobertura,
            autocomplete;

        // Init mixins 
        me.initLabelable();

        me.setHtml('<div id="' + me.getId() + '-inputWrap"><input id="' + me.getId() + '-inputEl" placeholder="' + me.emptyText + '" type="text" autocomplete="on" style="width: 99%; height: 100%; color: black; padding: 3px 6px 2px 6px; background-color: #f2f2f2; font: 400 13px/17px Open Sans, sans-serif; border-style: solid; border-color: #c9c9c9; border-width: 1px;"></div>');
        this.callParent(arguments);
    },

    isValid: function() {
        var me = this;
        
        if (me.disabled) {
            return true;
        } else {
            return this.validate();
        }
    },

    validate: function() {
    // Valida el input con el georeferenciamiento
        var me = this,
            valid = true,
            georeferencia = me.getGeoreferencia(),
            input = Ext.getDom(me.getId() + '-inputEl');

        if (me.isDirty()) {
            // Cambio de valor respecto al anterior
            if (!input.value) {
                me.reset();
                if(!me.allowBlank) valid = false;

            } else {
                if (georeferencia) {
                    if (georeferencia.formatted_address !== input.value){
                        // La georeferencia difiere del valor ingresado al input (edito y no hizo clic en el autocomplete)
                        me.reset();
                        if(!me.allowBlank) valid = false;
                    } else {
                        // Direccion valida
                        var direccion = {};
    
                        direccion['direccion'] = georeferencia.formatted_address;
                        direccion['lat'] = georeferencia.geometry.location.lat();
                        direccion['lng'] = georeferencia.geometry.location.lng();
                        
                        georeferencia.address_components.forEach(function(cmp) {
                            if ((cmp.types[0] == 'political' || cmp.types[0] == 'locality') && (cmp.long_name != "Buenos Aires" || cmp.short_name != 'CABA')) {
                                direccion['barrio'] = cmp.long_name ? cmp.long_name : cmp.short_name;
                                return;
                            }
                        });
                        me.setDireccion(direccion);
                    }
                } else {
                    // El input tiene una direccion pero no existe el objeto georeferencia => Se escribio pero no se hizo clic en el autocomple
                    valid = false;
                }
            }
        } else {
            if (me.disabled) {
                valid = true
            } else if (!me.allowBlank && !input.value) {
                valid = false;
            }
        }

        if (valid)
            input.style.borderColor = '#c9c9c9';
        else 
            input.style.borderColor = 'red';

        return valid;
    },

    isDirty: function() {
    // Devuelve verdadero si alguno de los valores en este componente ha cambiado del original  
        var me = this,
            direccion = me.getDireccion(),
            input = Ext.getDom(me.getId() + '-inputEl');

        if (direccion && input) {
            return direccion.direccion !== input.value ? true : false;
        } else {
            return false;
        }
    },

    reset: function() {
        var me = this,
            input = Ext.getDom(me.getId() + '-inputEl');
        
        me.setGeoreferencia(null);
        me.setDireccion(
            {
                direccion: '',
                barrio: '',
                lat: 0,
                lng: 0
            }
        );
        
        if (input) {
            input.style.borderColor = '#c9c9c9';
            input.value = "";
        }
            
    },

    getName: function() {
        return this.name;
    },

    getValue: function() {
        var me = this,
            value = {},
            objDireccion = me.getDireccion(),
            objGeoreferencia = me.getGeoreferencia();

        if (!objGeoreferencia) {
            return null
        } else {
            var direccion = objDireccion.direccion ? objDireccion.direccion : objGeoreferencia.formatted_address,
                lat = objDireccion.lat ? objDireccion.lat : objGeoreferencia.geometry.location.lat(),
                lng = objDireccion.lng ? objDireccion.lng : objGeoreferencia.geometry.location.lng(),
                addressCmp = me.getGeoreferencia().address_components ? objGeoreferencia.address_components : null;
            
            // if (DEBUG) console.log('[getValue] objDireccion', objDireccion);

            value['direccion'] = me.fnSacaAcentos(direccion);
            value['lat'] = lat;
            value['lng'] = lng;

            // Obtiene CP
            if (objDireccion.cp) {
                value['cp'] = objDireccion.cp;
            } else {
                if (addressCmp) {
                    addressCmp.forEach(function(cmp) {
                        if (cmp.types[0] == 'postal_code') {
                            value['cp'] = cmp.short_name ? cmp.short_name : cmp.long_name;
                        }
                    });
                }
            }

            // Obtiene Barrio (CABA) / Localidad (GBA)
            if (objDireccion.barrio) {
                value['barrio'] = me.fnSacaAcentos(objDireccion.barrio);
            } else {
                if (addressCmp) {
                    addressCmp.forEach(function(cmp) {
                        if (cmp.types[0] == 'sublocality_level_1' || cmp.types[0] == 'locality') {
                            value['barrio'] = cmp.long_name ? me.fnSacaAcentos(cmp.long_name) : me.fnSacaAcentos(cmp.short_name);
                            return;
                        }
                    });

                    if (!value.barrio) {
                        console.warn('[wkfDomicilioField] No se pudo determinar barrio', addressCmp);
                    } 
                    // else {
                    //     if (DEBUG) console.log('[wkfDomicilioField] Barrio ' + value.barrio, addressCmp);
                    // }
                }
            }
            // if (DEBUG) console.log('[getValue]', value);
            return value;
        }
    },

    getSubmitData: function() {
        var me = this,
            data = {};

        if (me.isValid()) {
            data[me.getName()] = me.getValue();
        } else   
            data[me.getName()] = null;

        return data;
    },

    setAutocomplete: function(fld, obj) {
        var me = this,
            input = Ext.getDom(me.getId() + '-inputEl'),
            direccion = {};

        obj.addListener('place_changed', function inputUbicarDireccion() {
            var me = this,
                ubicacion = me.getPlace();
            
            // if (DEBUG) console.log('[wkfDomicilioField] setAutocomplete()', ubicacion);

            // Guarda objeto completo
            fld.setGeoreferencia(ubicacion);
            
            // Crea objeto direccion y lo setea
            direccion['direccion'] = ubicacion.formatted_address;
            direccion['lat'] = ubicacion.geometry.location.lat();
            direccion['lng'] = ubicacion.geometry.location.lng();

            ubicacion.address_components.forEach(function(cmp) {
                if (cmp.types[0] == 'sublocality_level_1' || cmp.types[0] == 'locality') {
                    direccion['barrio'] = cmp.long_name ? cmp.long_name : cmp.short_name;
                    return;
                }
            });

            // if (DEBUG) console.log('[setAutocomplete] objDireccion', direccion);
            fld.setDireccion(direccion);
        
            input.value = ubicacion.formatted_address;

            if (fld.isValid() && fld.hasListeners.cargarmapa) {
                fld.fireEvent('cargarMapa', this);
            }
        });

        me.autocomplete = obj;
        me.setReadOnly();
    },

    setReadOnly: function() {
        var me = this,
            input = Ext.getDom(me.getId() + '-inputEl');
        
        input.disabled = me.readOnly;
        
        if (me.readOnly) 
            input.style.borderColor = '#c9c9c9';
    },

    setValue: function(val) {
        // Se invoca solo cuando carga el dato
        // val = objeto que tiene atributos lat y lng
        var me = this,
            geocoder = new google.maps.Geocoder
            latlng = {},
            input = Ext.getDom(me.getId() + '-inputEl');
        
        if (val.lat && val.lng) {
            latlng = {lat: parseFloat(val.lat), lng: parseFloat(val.lng)};

            // Setea los objetos del config
            // if (DEBUG) console.log('[setValue]', val);
            me.setDireccion(val);
        }
        
        if (latlng.lat && latlng.lng) {
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        me.setGeoreferencia(results[0]);
                        input.value = results[0].formatted_address;
                        me.validate();
                    } else {
                        console.warn('[wkfDomicilioField] No se encontro georeferencia');
                    }
                } else {
                    console.warn('[wkfDomicilioField] Error en geocoder: ' + status);
                }
            });
        }
    },

    fnSacaAcentos: function(c) {
        if(!c)
            return c;
        return c.replace(/Á/g,'A').replace(/É/g,'E').replace(/Í/g,'I').replace(/Ó/g,'O').replace(/Ú/g,'U').replace(/Ü/g,'U')
                .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u').replace(/ü/g,'u')
                .replace(/Ñ/g,'N').replace(/ñ/g,'n');
    },

    updateObligatorio: function(value){
        this.allowBlank = !value;
    },

    isFileUpload: function() {
        return false
    }
});