/**
 * Created by eon-1 on 9/12/14.
 */
var app = angular.module('dragDrop', []);

app.controller("DragDropCtrl", function ($scope) {
    $scope.handleDrop = function () {
        alert("Item has been dropped");
    }
});

app.directive('draggable', function () {
    return function (scope, element) {
        var el = element[0];
        var crt;
        var trick;

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function (e) {
                /*********************************************/
                trick = document.createElement("div");
                trick.id = "coverup";
                trick.style.background = "white";
                trick.style.position = "absolute";
                trick.style.top = "0px";
                trick.style.right = "0px";
                trick.style.width = "6%";
                trick.style.height = "6%";
                trick.style.zIndex = "2";
                /**********************************************/
                document.body.appendChild(trick);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', this.id);
                crt = this.cloneNode(true);
                this.style.opacity = "0";
                crt.style.position = "absolute";
                crt.style.top = "0px";
                crt.style.right = "0px";
                document.body.appendChild(crt);
                e.dataTransfer.setDragImage(crt, 0, 0);

                return false;
            },
            false
        );

        el.addEventListener(
            "dragend",
            function (e) {
                this.style.opacity = "1";
                document.body.removeChild(crt);
                document.body.removeChild(trick);
                return false;
            },
            false
        );
    }
});

app.directive("droppable", function () {
    return{
        scope: {
            drop: "&",
            bin: "="
        },
        replace: true,
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            el.addEventListener("dragover", function (e) {
                    e.dataTransfer.dropEffect = "move";
                    //allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    this.classList.add("over");
                    return false;
                },
                false
            );

            el.addEventListener(
                "dragenter",
                function (e) {
                    this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function (e) {
                    this.classList.remove("over");
                    return false;
                },
                false
            );

            el.addEventListener(
                "drop",
                function (e) {
                    if (e.stopPropagation) e.stopPropagation();

                    this.classList.remove("over");

                    var binId = this.id;
                    var item = document.getElementById(e.dataTransfer.getData("Text"));
                    this.appendChild(item);

                    // call the drop passed drop function
                    scope.$apply(function (scope) {
                        var fn = scope.drop();
                        if ("undefined" !== typeof fn) {
                            fn(item.id, binId);
                        }
                    });

                    return false;
                },
                false
            )
        }
    }
});