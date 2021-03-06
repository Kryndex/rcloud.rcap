define(['text!rcap/partials/viewer.htm',
    'rcap/js/ui/gridManager',
    'rcap/js/ui/themeManager',
    'rcap/js/utils/historyManager',
    'pubsub',
    'site/pubSubTable',
    'controls/factories/controlFactory',
    'rcap/js/serializer',
    'site/siteManager',
    'rcap/js/utils/rcapLogger',
    'rcap/js/utils/request',
    'rcap/js/ui/viewerDialogManager',
    'css!rcap/styles/default.css',
    'css!quill/quill.snow.css'
], function(mainPartial, GridManager, ThemeManager, HistoryManager, PubSub, pubSubTable, ControlFactory, Serializer, SiteManager, RcapLogger, Request, ViewerDialogManager) {

    'use strict';

    var Viewer = function() {

        var me = this;
        var themeManager = new ThemeManager();
        var rcapLogger = new RcapLogger();

        this.setup = function() {

            // TEMP
            // var ss = document.createElement('link');
            // ss.type = 'text/css';
            // ss.rel = 'stylesheet';
            // ss.href = 'http://127.0.0.1:8080/shared.R/rcloud.rcap.style.att.ecomp/rcap-style.css';
            // document.getElementsByTagName('head')[0].appendChild(ss);
            // TEMP

            $('body')
                .addClass('rcap-viewer')
                .append(mainPartial);

            // dialog manager:
            new ViewerDialogManager().initialise();

            // theme manager:
            themeManager.initialise();

            // show the preloader whilst things are initialised:
            $('#rcap-preloader').show();

            // site manager:
            new SiteManager().initialise();

            // grid manager:
            var gridManager = new GridManager();
            gridManager.initialise({
                isDesignTime: false
            });

            // serializer:
            new Serializer().initialise(true);

            // history manager:
            var historyManager = new HistoryManager();
            historyManager.initialise();

            // subscribe to grid done event:
            PubSub.subscribe(pubSubTable.gridInitComplete, function() {

                rcapLogger.info('viewer: pubSubTable.gridInitComplete');

                me.initialiseControls();

                gridManager.setGridSize(Request.getGridPreferences());

                ///////////////////////////////////////////////////////
                window.setTimeout(function() {
                    var plotSizes = [];

                    var getPlotSizeData = function(plot) {
                        var container = plot.closest('.grid-stack-item-content');
                        return {
                           id : plot.attr('id'),
                           width : container.width() - 38,
                           height: container.height() - 38
                        };
                    };

                    $('.leaflet').each(function() {
                        var plotSizeData = getPlotSizeData($(this));

                        $(this).css({
                                'width' : plotSizeData.width,
                                'height' : plotSizeData.height
                            });
                    });

                    $('.rplot, .r-interactiveplot, .rhtmlwidget').each(function() {

                        var container = $(this).closest('.grid-stack-item-content');
                        var plotSizeData = getPlotSizeData($(this));

                        plotSizes.push(plotSizeData);

                        // initialise the plot's container with information for later retrieval:
                        container.data({
                            'width' : plotSizeData.width,
                            'height' : plotSizeData.height
                        });
                    });

                    var dataToSubmit = JSON.stringify({
                        plotSizes : plotSizes
                    });

                    rcapLogger.log('%cJS%c → %cR%c: '  + dataToSubmit, 'color: black; background-color: yellow; font-weight: bold', 'color: black', 'font-weight: bold; color: blue; background-color: #eee', 'color: black');
                    window.RCAP.updateAllControls(dataToSubmit);

                    // show the single page:
                    // if there's a hash value (method that is used to bookmark a 'page'):
                    historyManager.setInitialState();

                    $('#rcap-preloader').fadeOut();

                }, 500);
                ///////////////////////////////////////////////////////

            });
        };

        this.initialiseControls = function() {

            // dependent on notebook_result:
            var interval = setInterval(function() {
                if (window.notebook_result) { // jshint ignore:line

                    clearInterval(interval);

                    _.each(new ControlFactory().getGridControls(), function(control) {
                        control.initialiseViewerItems();
                    });

                }
            }, 500);
        };

        this.initialise = function(json, themeExists, sessionInfo) {

            this.setup();

            $('body').data({
                'nodenameusername' : sessionInfo.nodeNameUserName,
                'nodename' : sessionInfo.nodeName,
                'user' : sessionInfo.user
            });

            // and pub:
            PubSub.publish(pubSubTable.deserialize, {
                isDesignTime: false,
                jsonData: json,
                themeExists: themeExists
            });

        };

    };

    return Viewer;

});
