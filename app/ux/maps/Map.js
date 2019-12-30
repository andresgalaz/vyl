Ext.define('vyl.ux.maps.map', {
    extend: 'Ext.Component',
    alias: 'widget.wkfMap',
    xtype: 'wkfmap',

    divId: '',

    config: {
        markers: [],
        infoWindows : [],
        map: {}
    },

    listeners: {
        render: {
            fn: function(cmp, eOpts) {
                var me = this,
                    cmpMapa = document.getElementById(me.divId),
                    map = {};

                if (cmpMapa) {
                    map = new google.maps.Map(cmpMapa, {
                        center: {lat: -34.591882, lng: -58.4038007}, //Hospital Aleman,
                        zoom: 12,
                        panControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        mapTypeControl: false
                    });

                    // Quita todos los puntos de interes
                    var styles = [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [
                                { visibility: "off" }
                            ]
                        }
                    ]
            
                    // Creo un objeto styledMap utilizando la definicion anterior
                    var clearMap = new google.maps.StyledMapType(styles, {name: "Mapa limpio"});  
            
                    // Asigno estilo al mapa
                    map.mapTypes.set('mapa_limpio', clearMap);
                    map.setMapTypeId('mapa_limpio');

                    me.setMap(map);
                } else {
                    console.error('[render] No se encontro el html div id='+ me.divId, this);
                }
            }
        }
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        if (me.divId) {
            me.setHtml('<div id="' + me.divId + '" style="position: relative;overflow: hidden;height: 100%;"></div>');
        } else {
            console.error('[initComponent] No se puede crear el objeto sin divId');    
        }
    },

    resetMap: function() {
        var me = this
            map = me.getMap();

        me.deleteMarkers();
        
        map.setZoom(12);
        map.panTo(map.getCenter());
    },

    ocultarVentanasInfo: function() {
        var me = this,
            map = me.getMap(),
            infoWindows = me.getInfoWindows();

        infoWindows.forEach(function(wnd) {
            wnd.close(map, wnd);
        });
    },

    setMapOnAll: function(map) {
        var me = this,
            markers = me.getMarkers();
        
        
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].setMap) {
                markers[i].setMap(map);
            }
        }
    },
    
    addInfoWindow: function(infoWnd) {
        var me = this,
            infoWindows = me.getInfoWindows();
        
        infoWindows.push(infoWnd);
    },

    addMarker: function(marker) {
        var me = this,
            markers = me.getMarkers();
        
        markers.push(marker);
    },

    // Removes the markers from the map, but keeps them in the array.
    clearMarkers: function() {
        this.setMapOnAll(null);
    },

    // Shows any markers currently in the array.
    showMarkers: function() {
        var me = this,
            map = me.getMap();
        
        me.setMapOnAll(map);
    },

    // Deletes all markers in the array by removing references to them.
    deleteMarkers: function() {
        var me = this;
        
        me.clearMarkers();
        me.setMarkers([]);
    },
});