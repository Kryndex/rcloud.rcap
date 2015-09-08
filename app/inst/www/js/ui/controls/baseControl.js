define(['rcap/js/Class'], function() {

    'use strict';

    var BaseControl = Class.extend({
        init: function(options) {
            options = options || {};
            this.type = options.type;
            this.label = options.label;
            this.icon = options.icon;
            this.inlineIcon = options.inlineIcon;
            this.controlProperties = options.controlProperties;
            // generate a random ID:
            this.id = 'rcap' + Math.random().toString(16).slice(2);
        },
        deserialize: function() {

        },
        serialize: function() {

        },
        render: function(/*options*/) {
            return '<p><i class="icon-' + this.inlineIcon + '"></i></p>';
        },
        getDialogMarkup: function() {
            var html = '';

            if (this.controlProperties.length === 0) {
            	html = 'There are no configurable properties for this control';
            } else {
                $.each(this.controlProperties, function(key, prop) {
                    html += prop.render(key);
                });
            }

            return html;
        },
        getDialogValue: function() {
            return '';
        },
        toJSON: function() {
            return {
                'type': this.type,
                'id': this.id,
                'controlProperties': this.controlProperties
            };
        },
    });

    return BaseControl;

});
