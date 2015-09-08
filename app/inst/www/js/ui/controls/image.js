define(['rcap/js/ui/controls/gridControl', 'rcap/js/ui/controls/properties/textControlProperty', 'rcap/js/ui/controls/properties/dropdownControlProperty',
	'text!controlTemplates/image.tpl'], 
	function(GridControl, TextControlProperty, DropdownControlProperty, tpl) {
	
	'use strict';

	var ImageControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'image',
				label : 'Image',
				icon: 'f03e',  
				inlineIcon: 'picture',
				initialSize: [2, 2],
				controlProperties: [
					new TextControlProperty({
						uid: 'imagesource',
						label : 'Image source',
						defaultValue : '',
						helpText : 'The source of this image',
						isRequired: true
					}),
					new DropdownControlProperty({
                        uid: 'imageLayout',
                        label: 'Image style',
                        helpText: 'Whether the image should be tiled, stretched or placed as is.',
                        isRequired: true,
                        availableOptions: [{
                            text: 'Initial size',
                            value: 'background-repeat:no-repeat;'
                        }, {
                            text: 'Tiled along x axis',
                            value: 'background-repeat: repeat-x;'
                        }, {
                            text: 'Tiled along y axis',
                            value: 'background-repeat: repeat-y;'
                        }, {
                            text: 'Tiled',
                            value: 'background-repeat: repeat;'
                        }, {
                            text: 'Cover',
                            value: 'background-size: cover;'
                        }, {
                            text: 'Stretch',
                            value: 'background-size: 100% 100%'
                        }],
                        value: 'background-repeat:no-repeat;'
                    })
				]
			});
		},
		render: function() {

			var template = _.template(tpl);

            return template({
                control: this
            });
		}
	});

	return ImageControl;

});