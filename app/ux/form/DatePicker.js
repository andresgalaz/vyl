Ext.define('vyl.ux.form.DatePicker', {
    extend: 'Ext.picker.Date',
    alias: 'widget.wkfDatePicker',
    xtype: 'wkfdatepicker',

    selectedDates : [],
    clsHighlightClass :'x-datepicker-selected',

    isFormField: true,
    submitValue: true,
    
    config: {
        name: '',
        obligatorio: false
    },
    
    initComponent: function(){
        var me = this;

        me.callParent(arguments);
        me.on('select', me.handleSelectionChanged, me);
        me.on('afterrender', me.highlightDates, me);
    },
    
    highlightDates: function(){
        var me = this;

        if(!me.cells)
            return;

        me.cells.each(function(item){
            var date = new Date(item.dom.firstChild.dateValue);

            if (item.removeCls){
                item.removeCls(me.clsHighlightClass);
            }
            
            me.selectedDates.forEach(function(d, idx){
                if (d.toDateString() === date.toDateString()) {
                    if(item.getAttribute('class').indexOf(me.clsHighlightClass)=== -1){
                        if (item.addCls && me.clsHighlightClass){
                            item.addCls(me.clsHighlightClass)
                        }
                    }
                }
            });
        })
    },

    handleSelectionChanged: function(cmp, date){
        var me = this
            existe = false;

        me.selectedDates.forEach(function(d, idx){
            if (d.toDateString() === date.toDateString()) {
                existe = true;
                me.selectedDates.splice(idx, 1);
            }
        });

        if (!existe) {
            me.selectedDates.push(date);
        }

        me.highlightDates();

        me.fireEvent('change');
    },

    isDirty: function() {
        return this.selectedDates.length > 0 ? true : false;
    },

    isValid: function() {
        var me = this;
        
        if (me.disabled) {
            return true;
        } else {
            return this.validate();
        }
    },

    getValue: function() {
        return this.selectedDates;
    },

    getSubmitData: function() {
        var me = this,
            data = {};

        if(!me.submitValue) 
            return null;

        if (me.selectedDates.length > 0) {
            data[me.getName()] = me.getValue();
        } else   
            data[me.getName()] = null;

        return data;
    },

    reset: function() {
        var me = this;

        me.selectedDates = [];

        me.cells.each(function(item){
            if(item.getAttribute('class').indexOf(me.clsHighlightClass) > -1) {
                item.removeCls(me.clsHighlightClass);
            }
        });
    },

    validate: function() {
        return this.obligatorio && this.selectedDates.length == 0 ? false : true;
    }
})