define(['rcap/js/ui/controls/gridControl', 
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'utils/dataTranslators/dataTableTranslator',
    'text!controlTemplates/dataTable.tpl',
    'datatables/jquery.dataTables.min'

], function(GridControl, TextControlProperty, AutocompleteControlProperty, DataTableTranslator, tpl) {

    'use strict';

    var DataTableControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'datatable',
                controlCategory: 'Dynamic',
                label: 'Data Table',
                icon: 'table',
                initialSize: [2, 2],
                controlProperties: [
                    new TextControlProperty({
                        uid: 'variablename',
                        label: 'Variable name',
                        defaultValue: 'variable',
                        helpText: 'The variable associated with this control',
                        isRequired: false
                    }),
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'Code',
                        defaultValue: '',
                        helpText: 'The R Function that assigns the data',
                        isRequired: false
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;
            var template = _.template(tpl);
            var designTimeDescription = '';

            if(isDesignTime && this.controlProperties[0].value || this.controlProperties[1].value.length ) {

                if(this.controlProperties[0].value) { 
                    designTimeDescription += 'Variable: ' + this.controlProperties[0].value;
                } 

                if(this.controlProperties[0].value && this.controlProperties[1].value) {
                    designTimeDescription += ', ';
                }

                if(this.controlProperties[1].value) {
                    designTimeDescription += 'Function: ' + this.controlProperties[1].value;
                }
            }

            return template({
                control: this,
                isDesignTime: isDesignTime,
                designTimeDescription : designTimeDescription
            });

        },
        update : function(variableName, value) {
            // do some stuff!
            //console.log('table update:', variableName, value, allValues);

            var translator = new DataTableTranslator();
            var translatedData = translator.translate(value);

            $('[data-variablename="' + variableName + '"]').dataTable(translatedData);

        }
    });

    return DataTableControl;

});