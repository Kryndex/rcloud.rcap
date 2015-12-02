define([
    
], function() {

    'use strict';

    var DataTableTranslator = function() {

        this.translate = function(sourceData) {
            
            /*
            var columnLength = sourceData.r_attributes.names.length;
            var extractedArrays = [];

            for(var loop = 0; loop < columnLength; loop++){
                extractedArrays.push(_.map(Object.keys(sourceData[sourceData.r_attributes.names[loop]]), function(key) {
                    return sourceData[sourceData.r_attributes.names[loop]][key];
                }));
            }

            // each array *should* be the same length:
            // last item of each extractedArrays is the "r_type" key, which we don't want (therefore -1):
            var rowCount = extractedArrays[0].length - 1, rowLoop = 0;
            var columnCount = extractedArrays.length;
            var translatedData = [], currentItem = {}, columnLoop = 0;

            for(rowLoop = 0; rowLoop < rowCount; rowLoop++) {

                // create a new object:
                currentItem = {};
                for(columnLoop = 0; columnLoop < columnCount; columnLoop++) {
                    currentItem[sourceData.r_attributes.names[columnLoop].replace('.', '')] = extractedArrays[columnLoop][rowLoop].toString();
                }

                translatedData.push(currentItem);
            }*/

            var dataObject = JSON.parse(sourceData);

            // loop through the object's keys (they're the columns):
            var columnNames = Object.keys(dataObject);
            var columnCount = columnNames.length;
            var rowCount = dataObject[Object.keys(dataObject)[0]].length;

            var translatedData = [], currentItem = {}, rowLoop = 0, columnLoop = 0;

            for(rowLoop = 0; rowLoop < rowCount; rowLoop++) {

                // create a new object:
                currentItem = {};
                for(columnLoop = 0; columnLoop < columnCount; columnLoop++) {
                    currentItem[columnNames[columnLoop].replace('.', '')] = dataObject[columnNames[columnLoop]][rowLoop].toString();
                }

                translatedData.push(currentItem);
            }

            return {
                'data' : translatedData,                
                'columns' : _.map(columnNames, function(col) { return { 'data' : col.replace('.', ''), 'title' : col }})
            };

            return;
        };
    };

    return DataTableTranslator;

});