define(['controls/factories/controlFactory', 'pubsub'], function(ControlFactory, PubSub) {

    'use strict';

    var FormBuilder = Class.extend({

        initialise: function() {

            var updateConfigurationContent = function(control) {
                $('#formbuilder-form').html(control.getDialogMarkup());

                // don't forget the 'save' button, if there are control properties:
                if (control.controlProperties.length > 0) {
                    $('#formbuilder-form').append($('<button class="btn btn-primary">Update</button>'));
                }

            };

            var updateChildControls = function() {
                // get the main control:
                var parentControl = $('#dialog-form-builder').data('control');

                // clear:
                parentControl.childControls = [];

                // and get based on order or state after deletion:
                $('#dialog-form-builder .form-item').each(function() {
                    parentControl.childControls.push($(this).data('control'));
                });

            };

            var me = this;
            me.controlFactory = new ControlFactory();

            // parsley:
            $('#formbuilder-form').parsley({
                excluded: 'input[type=button], input[type=submit], input[type=reset], :input[type=hidden], :disabled, textarea:hidden'
            });

            $('.drop-zone').on('click', '.ui-remove', function(e) {
                updateChildControls();
                $(this).parent().remove();
                e.preventDefault();
                return false;
            });

            // CLICK FORM ITEM IN LIST:
            $('.drop-zone').on('click', '.form-item', function() {

                $('.drop-zone .form-item').removeClass('selected');
                $(this).addClass('selected');

                var currentControl = $(this).data('control');

                updateConfigurationContent(currentControl);

                $('#dialog-form-builder .nav-tabs li:eq(1) a').tab('show');
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // child control validation:
            //
            $('body').on('click', '#formbuilder-form .btn-primary', function() {
                $('#formbuilder-form').parsley().validate();

                if (true === $('#formbuilder-form').parsley().isValid()) {

                    // remove any 'parsley valid' classes:
                    $('#formbuilder-form *').removeClass('parsley-success');

                    var originatingControl = $('#dialog-form-builder .form-item.selected').data('control');

                    $.each(originatingControl.controlProperties, function(index, prop) {
                        var dialogValue = prop.getDialogValue();
                        originatingControl.controlProperties[index].value = dialogValue;
                    });

                    // set:
                    $('#dialog-form-builder .form-item.selected').effect('highlight', {
                        color: '#f7a24d'
                    }, 1000);

                    $('#dialog-form-builder .form-item.selected').data('control', originatingControl);

                    // update UI:
                    var updateItem = $('#dialog-form-builder .form-item.selected').find('.js-dynamic');
                    updateItem.html(originatingControl.render({
                        'isDesignTime': true
                    }));

                    //console.log('VALID');

                    return false;

                } else {

                    //console.log('INVALID');

                }
            });






            $('#dialog-form-builder .approve').on('click', function() {

                // TODO: apply validation on the form's control properties (TOP LEVEL - NOT CHILD CONTROLS' PROPERTIES)

                // $('#control-form').parsley().validate();
                // validate();


                PubSub.publish('controlDialog:updated', $('#dialog-form-builder').data('control'));

                $('#dialog-form-builder').jqmHide();
            });

            $('#dialog-form-builder .controls li').draggable({
                start: function() {

                },
                helper: function(e) {
                    //<a class="caret" href="javascript:void(0)"></a>
                    return $('<div><div class="ui-remove" href="javascript:void(0)"></div><div class="js-dynamic">' + $(e.target).text() + '</div></div>')
                        .addClass('form-item');
                },
                connectToSortable: '.drop-zone'
            });

            $('.drop-zone').sortable({
                placeholder: 'form-item-placeholder',
                update: function(event, ui) {
                    ui.item.addClass('form-item');
                },
                start: function( /*e, ui*/ ) {

                },
                stop: function() {
                    $('#dialog-form-builder .nav-tabs li:eq(1) a').tab('show');
                    updateChildControls();
                },
                remove: function() {
                    updateChildControls();
                },
                receive: function(event, ui) {

                    // a new child control has been added to the 'parent' control:

                    // create a default child with default properties:
                    var child = me.controlFactory.getChildByKey(ui.item.data('type'));

                    // render the item's content based on the child's information:
                    ui.helper.find('.js-dynamic').html(child.render({
                        'isDesignTime': true
                    }));

                    // update the data for this child control:
                    ui.helper.data('control', child);
                    updateConfigurationContent(child);

                    // add the child to the child controls:
                    //var parentControl = $('#dialog-form-builder').data('control');
                    //parentControl.childControls.push(child);

                    // styling:
                    $('.drop-zone .form-item').removeClass('selected');
                    ui.helper.addClass('dropped selected');

                    ui.helper.css('height', '');

                    updateChildControls();
                }
            });
        },

        setFormControl: function(control) {

            // clear stuff and reset:
            $('#dialog-form-builder .drop-zone, #formbuilder-form').empty();

            $('#formbuilder-form').append($('<div>Add or select a control to configure its properties.</div>'));

            $('#dialog-form-builder .nav-tabs li:eq(1) a').tab('show');

            // set the data:
            $('#dialog-form-builder').data('control', control);

            $.each(control.childControls, function(key, child) {
                // add an item and set its data:
                var item = $('<div class="form-item dropped"><div class="ui-remove" href="javascript:void(0)"></div><div class="js-dynamic">' +
                    child.render({
                        'isDesignTime': true
                    }) + '</div></div>').data('control', child);

                $('#dialog-form-builder .drop-zone').append(item);

            });
        }

    });

    return FormBuilder;
});