define([
    'rcap/js/utils/rcapLogger',
    'text!ui/templates/pageMenuItem.tpl',
    'pubsub',
    'site/pubSubTable'
], function(RcapLogger, pageMenuItemTemplate, PubSub, pubSubTable) {

    'use strict';

    var rcapLogger = new RcapLogger(),
        pagesTree;

    var PageTreeManager = Class.extend({
        init: function() {

        },
        initialise: function() {

            rcapLogger.info('PageTreeManager: initialise');

            var selectRootNode = function() {
                // select first node:
                var rootNode = pagesTree.tree('getTree').children[0];
                pagesTree.tree('selectNode', rootNode);

                PubSub.publish(pubSubTable.changeSelectedPageId, rootNode.id);
            };

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.updatePage, function(msg, pageObj) {

                rcapLogger.info('pageTreeManager: pubSubTable.updatePage');

                var nodeToUpdate = pagesTree.tree('getNodeById', pageObj.id);

                // want to, but it doesn't work:
                // pagesTree.tree('updateNode', nodeToUpdate, pageObj.navigationTitle);

                // so, addnodebefore, remove initial node.
                // <hack>
                pagesTree.tree('addNodeBefore', {
                    name: pageObj.navigationTitle,
                    id: nodeToUpdate.id,
                    canAddChild: nodeToUpdate.depth < 3,
                    isEnabled: nodeToUpdate.isEnabled,
                    navigationTitle: pageObj.navigationTitle }, nodeToUpdate);

                pagesTree.tree('removeNode', nodeToUpdate);
                //</hack>

                // title:
                $(nodeToUpdate.element).find('.jqtree-title:eq(0)').html(pageObj.navigationTitle);

                // enabled status:
                $(nodeToUpdate.element)[pageObj.isEnabled ? 'removeClass' : 'addClass']('not-enabled');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.deletePageConfirm, function(msg, pageId) {

                rcapLogger.info('pageTreeManager: pubSubTable.deletePageConfirm');

                var nodeToDelete = pagesTree.tree('getNodeById', pageId);

                pagesTree.tree('removeNode', nodeToDelete);

                selectRootNode();

            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {

                rcapLogger.info('pageTreeManager: pubSubTable.initSite');

                var buildTree = function(pages/*, container*/) {
                    _.each(pages, function(item) {
                        pagesTree.tree('appendNode', {
                          name: item.navigationTitle,
                          id: item.id,
                          canAddChild: item.depth < 3,
                          isEnabled: item.isEnabled,
                          navigationTitle: item.navigationTitle // for some events
                        }, item.parentId ? pagesTree.tree('getNodeById', item.parentId) : undefined);
                    });
                };

                pagesTree = $('#pages-tree');

                var template = _.template(pageMenuItemTemplate);

                pagesTree.tree({
                  data: [],
                  dragAndDrop: true,
                  // autoOpen doesn't work here because data is empty
                  onCreateLi: function(node, $li) {
                    $li.find('.jqtree-element').append(
                      template({
                        p: node
                      })
                    );
                    if(!node.isEnabled) {
                      $li.addClass('not-enabled');
                    }
                    $li.attr('title', node.id);
                  }
                });

                buildTree(site.pages);

                var tree = pagesTree.tree('getTree');
                    tree.iterate(
                    function(node) {
                        if (node.hasChildren()) {
                            pagesTree.tree('openNode', node);
                            return true;
                        }

                        return false;
                });

                // auto-select first page:
                selectRootNode();

                // page click:
                pagesTree.bind('tree.click', function(e) {
                  // clicking on a page modification span should not select the node:
                  var target = $(e.click_event.target); // jshint ignore:line

                  if(target.parent().hasClass('page-tree-settings')) {

                    if(target.hasClass('page-duplicate')) {
                      // show confirmation:
                      PubSub.publish(pubSubTable.showConfirmDialog, {
                          heading: 'Duplicate Page?',
                          message: 'Are you sure you wish to duplicate this page?',
                          pubSubMessage: pubSubTable.duplicatePageConfirm,
                          dataItem: e.node.id
                      });
                    } else if(target.hasClass('page-addchild')) {
                      PubSub.publish(pubSubTable.addPage, {
                          parentPageId: e.node.id
                      });
                    } else if(target.hasClass('page-settings')) {
                      PubSub.publish(pubSubTable.pageSettingsClicked, e.node.id);
                    }

                    return false;

                  } else {

                    if(e.node) {

                      $('.menu-flyout').hide();

                      // just the id:
                      PubSub.publish(pubSubTable.changeSelectedPageId, e.node.id);
                    } else {
                      return false;
                    }
                  }
                });

                // page move:
                pagesTree.bind(
                    'tree.move',
                    function(event) {

                      var pageMovedDetails = {
                        movedPage: event.move_info.moved_node.id, // jshint ignore:line
                        targetPage: event.move_info.target_node.id, // jshint ignore:line
                        position: event.move_info.position, // jshint ignore:line
                        previousParent: event.move_info.previous_parent.id // jshint ignore:line
                      };

                      PubSub.publish(pubSubTable.pageMoved, pageMovedDetails);
                    }
                );

                PubSub.publish(pubSubTable.pageCountChanged, site.pages.length);
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.close, function() {
              // clear up the tree:
              pagesTree.tree('destroy');
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            $('body').on('click', '#main-menu a[data-messageid]', function() {
                // hide all:
                $('.menu-flyout').hide();
                $('#main-menu li').removeClass('selected');

                // but this one isn't selected since it invokes something else:
                var message = $(this).attr('data-messageid');
                rcapLogger.info('pageTreeManager: pubSubTable dynamic: ' + message);
                PubSub.publish(pubSubTable[message]);
            });

            //////////////////////////////////////////////////////////////////////////////////////////
            //
            //
            //
            PubSub.subscribe(pubSubTable.pageAdded, function(msg, msgData) {

                rcapLogger.info('pageTreeManager: pubSubTable.addPage');

                _.each(msgData.pageData, function(item) {
                    pagesTree.tree('appendNode', {
                          name: item.navigationTitle,
                          id: item.id,
                          canAddChild: item.depth < 3,
                          isEnabled: item.isEnabled
                    }, item.parentId ? pagesTree.tree('getNodeById', item.parentId) : null);
                });

                pagesTree.tree('selectNode', pagesTree.tree('getNodeById', msgData.pageData[0].id));

/*
                _.each(msgData.pageData, function(page) {

                    var template = _.template(pageMenuItemTemplate),
                        newPageMarkup = template({
                            p: page,
                            canAddChild: page.canAddChild()
                        });

                    if (page.parentId) {
                        $('#pages li[data-pageid="' + page.parentId + '"]').children('ol').append(newPageMarkup);
                    } else {
                        $('#pages').append(newPageMarkup);
                    }

                });
                */

                // select the newly added page:
                PubSub.publish(pubSubTable.changeSelectedPageId, msgData.pageData[0].id);

            });

            PubSub.subscribe(pubSubTable.pageCountChanged, function(msg, pageCount) {

                var countEl = $('#main-menu a[data-flyoutid="pages"]').find('.count');
                countEl.text(pageCount);

                if(pageCount === 0) {
                    countEl.fadeOut();
                } else {
                    countEl.fadeIn();
                }
            });

            return this;
        },
        getPages: function() {
            // get the page items:
            var pages = [];
            $('#pages li').each(function() {
                pages.push($(this).data('pageid'));
            });
            return pages;
        }
    });

    return PageTreeManager;

});
