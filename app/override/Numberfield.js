Ext.define("vyl.overrides.Numberfield", {
//override per gestire in modo automatico il punto come separatore delle migliaia
//per inibire la visualizzazione aggiungere l'attributo "allowThousandSeparator:false" nel relativo campo number field
    override: "Ext.form.field.Number",
    
    /**
     * @cfg {Boolean} allowThousandSeparator
     * False to disallow thousand separator feature.
     */
    allowThousandSeparator: true,

    
    baseChars : '0123456789. ',
    
    initComponent: function() {
        Ext.util.Format.thousandSeparator = '.'; //spazio per migliaia
        Ext.util.Format.decimalSeparator = ','; //virgola per decimale
    
        var me = this;
        if (me.decimalSeparator === null) {
            me.decimalSeparator = Ext.util.Format.decimalSeparator;
        }
        me.callParent();
    
        me.setMinValue(me.minValue);
        me.setMaxValue(me.maxValue);
    },
    
    /**
     * @private
     */
    toBaseNumber: function (value) {
        var me = this;
        return String(value).replace(new RegExp("[" + Ext.util.Format.thousandSeparator + "]", "g"), '').replace(me.decimalSeparator, '.');
    },
    
    /**
     * @private
     */
    parseRawValue: function (value) {
        var me = this;
        value = parseFloat(me.toBaseNumber(value));
        return isNaN(value) ? null : value;
    },
    
    onChange: function(newValue) {
        var ariaDom = this.ariaEl.dom;
    
        this.toggleSpinners();
        this.callParent(arguments);
    
        if (ariaDom) {
            if (Ext.isNumber(newValue) && isFinite(newValue)) {
                ariaDom.setAttribute('aria-valuenow', newValue);
            }
            else {
                ariaDom.removeAttribute('aria-valuenow');
            }
        }
    
        //se il valore diverso da vuoto
        if( newValue !=  null && newValue != '' ){
    
            var sepPos = newValue.toString().indexOf('.'), //posizione eventuale punto
                lenCtrl = newValue.toString().length; //controllo lunghezza
    
            //se ho scritto 4 caratteri inserisco il separatore
            if( lenCtrl > 3 && sepPos == -1){
    
                this.allowDecimals=false;
                this.setValue(newValue);
                this.allowDecimals=true;
    
            }
        }
    
    },
    
    getErrors: function(value) {
        if (!this.allowThousandSeparator)
            return this.callParent(arguments);
        value = arguments.length > 0 ? value : this.processRawValue(this.getRawValue());
    
        var me = this,
            errors = me.callSuper([value]),
            format = Ext.String.format,
            num;
    
        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
            return errors;
        }
    
        value = me.toBaseNumber(value);
    
        if(isNaN(value)){
            errors.push(format(me.nanText, value));
        }
    
        num = me.parseValue(value);
    
        if (me.minValue === 0 && num < 0) {
            errors.push(this.negativeText);
        }
        else if (num < me.minValue) {
            errors.push(format(me.minText, me.minValue));
        }
    
        if (num > me.maxValue) {
            errors.push(format(me.maxText, me.maxValue));
        }
    
        return errors;
    },
    
    rawToValue: function (rawValue) {
        if (!this.allowThousandSeparator) {
            return this.callParent(arguments);
        }
        var value = this.fixPrecision(this.parseRawValue(rawValue));
        if (value === null) {
            value = rawValue || null;
        }
        return value;
    },
    
    valueToRaw: function (value) {
    
        if (!this.allowThousandSeparator) {
            return this.callParent(arguments);
        }
        var me = this,
            decimalSeparator = me.decimalSeparator,
            format = "0,000";
        if (me.allowDecimals) {
            for (var i = 0; i < me.decimalPrecision; i++) {
                if (i == 0) {
                    format += ".";
                }
                format += "0";
            }
        }
        value = me.parseValue(value);
        value = me.fixPrecision(value);
        value = Ext.isNumber(value) ? value : parseFloat(String(value).replace(decimalSeparator, '.'));
        value = isNaN(value) ? '' : Ext.util.Format.number(value, format);
    
        return value;
    },
    
    getSubmitValue: function () {
        if (!this.allowThousandSeparator)
            return this.callParent();
        var me = this,
            value = me.callSuper();
    
        if (!me.submitLocaleSeparator) {
            value = me.toBaseNumber(value);
        }
        return value;
    },
    
    setMinValue: function (value) {
        if (!this.allowThousandSeparator)
            return this.callParent(arguments);
        var me = this,
            ariaDom = me.ariaEl.dom,
            minValue, allowed, ariaDom;
    
        me.minValue = minValue = Ext.Number.from(value, Number.NEGATIVE_INFINITY);
        me.toggleSpinners();
    
        // May not be rendered yet
        if (ariaDom) {
            if (minValue > Number.NEGATIVE_INFINITY) {
                ariaDom.setAttribute('aria-valuemin', minValue);
            }
            else {
                ariaDom.removeAttribute('aria-valuemin');
            }
        }
    
        // Build regexes for masking and stripping based on the configured options
        if (me.disableKeyFilter !== true) {
            allowed = me.baseChars + '';
    
            if (me.allowExponential) {
                allowed += me.decimalSeparator + 'e+-';
            }
            else {
                allowed += Ext.util.Format.thousandSeparator;
                if (me.allowDecimals) {
                    allowed += me.decimalSeparator;
                }
                if (me.minValue < 0) {
                    allowed += '-';
                }
            }
    
            allowed = Ext.String.escapeRegex(allowed);
            me.maskRe = new RegExp('[' + allowed + ']');
            if (me.autoStripChars) {
                me.stripCharsRe = new RegExp('[^' + allowed + ']', 'gi');
            }
        }
    }
    });