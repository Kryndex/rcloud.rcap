define(['rcap/js/Class'], function() {

    'use strict';

    var generateId = function() {
        return 'rcap' + Math.random().toString(16).slice(2);
    };

    var Timer = Class.extend({
        init: function(options) {
            options = options || {};
            this.variable = "";
            this.id = 'rcap' + Math.random().toString(16).slice(2);
            this.interval = 60;
        },
        start: function() {
            var varName = this.variable;
            var id = this.id;

            var eventFunction = function(varName, id) {
                return function() {
                    var updateVarsJSON = JSON.stringify({
                        updatedVariables:[{
                            variableName: varName,
                            controlId: id,
                            value: 0
                        }]
                    });
                    window.RCAP.updateControls(updateVarsJSON);
                };
            };

            setInterval(eventFunction(varName, id), this.interval * 1000);
        },
        stop: function() {
            //clearInterval(this.intervalEvent);
        },
        toJSON: function() {
            return {
                'id' : this.id,
                'variable': this.variable,
                'interval': this.interval,
                'type': 'timer'
            };
        }
    });

    return Timer;
});