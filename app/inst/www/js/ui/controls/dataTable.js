define(['rcap/js/ui/controls/gridControl', 
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/autocompleteControlProperty',
    'rcap/js/ui/controls/properties/dropdownControlProperty',
    'utils/translators/sparklinesTranslator',
    'text!controlTemplates/dataTable.tpl',
    'datatables/jquery.dataTables.min',
    'datatablesbuttons/buttons.html5.min',
    'jquery.sparkline/jquery.sparkline.min'
], function(GridControl, TextControlProperty, AutocompleteControlProperty, DropdownControlProperty, SparklinesTranslator, tpl) {

    'use strict';

    var DataTableControl = GridControl.extend({
        init: function() {
            this._super({
                type: 'datatable',
                controlCategory: 'Dynamic',
                label: 'Data Table',
                icon: 'table',
                initialSize: [4, 4],
                controlProperties: [
                    new AutocompleteControlProperty({
                        uid: 'code',
                        label: 'Code',
                        value: '',
                        helpText: 'The R Function that assigns the data for this control',
                        isRequired: false,
                        isHorizontal: true
                    }),
                    new TextControlProperty({
                        uid: 'sortColumnIndex',
                        label : 'Initial Sort Column',
                        value : '1',
                        helpText : 'Which column should the data be sorted on.',
                        isRequired: true,
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'sortColumnOrder',
                        label: 'Initial Sort Order',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Ascending',
                            value: 'asc'
                        }, {
                            text: 'Descending',
                            value: 'desc'
                        }],
                        helpText: 'What order should the data be sorted',
                        value: 'asc',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'showPaging',
                        label: 'Show paging', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether paging options should be shown',
                        value: 'false',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'showSearch',
                        label: 'Show search', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether search box should be shown',
                        value: 'false',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'showInfo',
                        label: 'Show info', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        helpText: 'Whether information footer should be shown',
                        value: 'false',
                        isHorizontal: true
                    }),
                    new DropdownControlProperty({
                        uid: 'downloadAsCsv',
                        label: 'Download as CSV', 
                        isRequired: true,
                        availableOptions: [{
                            text: 'Yes',
                            value: 'true'
                        }, {
                            text: 'No',
                            value: 'false'
                        }],
                        value: 'true',
                        helpText: 'Allow user to download data as CSV',
                        isHorizontal: true
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};
            var isDesignTime = options.isDesignTime || false;
            var template = _.template(tpl);
            var designTimeDescription = '';

            if(isDesignTime && this.controlProperties[0].value) {
                designTimeDescription += 'Function: ' + this.controlProperties[0].value;
            }

            var output = template({
                control: this,
                isDesignTime: isDesignTime,
                designTimeDescription : designTimeDescription,
                paging: this.getControlPropertyValueOrDefault('showPaging') === 'true',
                info: this.getControlPropertyValueOrDefault('showInfo') === 'true',
                searching: this.getControlPropertyValueOrDefault('showSearch') === 'true',
                sortColumnIndex: this.getControlPropertyValueOrDefault('sortColumnIndex') - 1,
                sortColumnOrder: this.getControlPropertyValueOrDefault('sortColumnOrder'),
                downloadAsCsv: this.getControlPropertyValueOrDefault('downloadAsCsv') === 'true'
            });

            return output;
        },
        updateData : function(controlId, result) {

            result = JSON.parse(result);

            if($.fn.DataTable.isDataTable('#' + controlId)) {
                var dt = $('#' + controlId).dataTable().api();
                dt.destroy();
                $('#' + controlId).empty();
            } 

            var controlData = $('#' + controlId).data();
            
            var dtProperties = {
                dom: 'lfrtiBp', 
                data:  result.data,
                columns: result.columns.map(function(x){ return {data: x, title: x }; })
            };

            // pass in dynamic options from R
            // but first, need to tidy up
            result.options.datatables.columnDefs = _.flatten(result.options.datatables.columnDefs);
            $.extend(true, dtProperties, 
                result.options.datatables);

            // sparklines stuff
            var translator = new SparklinesTranslator();
            var additionalColDefs = translator.translate(result.options.sparklines).columnDefs;
            dtProperties.columnDefs = dtProperties.columnDefs.concat(additionalColDefs);
                        
            
            // pass in options from form
            $.extend(true, dtProperties, 
                {
                    info: controlData.info,
                    searching: controlData.searching,
                    // input order will be R-centric (1-offset), where JavaScript is 0-offset:
                    order: [controlData.sortcolumnindex, controlData.sortcolumnorder],
                    buttons: controlData.downloadAsCsv ? ['csv'] : []
                }
            );

            $('#' + controlId).DataTable(dtProperties);
            
            // font sizes
            $('th').css('font-size', result.options.css.thSize);
            $('td').css('font-size', result.options.css.tdSize);

        }
    });

    return DataTableControl;

});