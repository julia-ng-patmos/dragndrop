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
        element.css({cursor: "pointer"});
        var el = element[0];
        var crt;

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function (e) {
                console.dir(el)
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text', this.id);
                crt = this.cloneNode(true);
                if (!el.estado) {
                    el.estado = {
                        miPadre: el.parentNode
                    };
                }

                /******* CSS For The Clone Node  ******
                 **************************************/
                this.style.opacity = "0";
                crt.style.position = "absolute";
                crt.style.width = el.offsetWidth + "px";
                crt.style.top = "30%";
                crt.style.right = "50%";
                crt.style.zIndex = "-100";
                crt.style.backgroundSize = "100% 100%";
                /****************************************/
                document.body.appendChild(crt);
                e.dataTransfer.setDragImage(crt, 0, 0);
                if (!e.target.dragactive) {
                    e.target.dragactive = true
                }

                return false;
            },
            false
        );

        el.addEventListener(
            "dragend",
            function (e) {
                this.style.opacity = "1";
                document.body.removeChild(crt);
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
                    if (e.target.dragactive) {
                        if (this.firstChild != null) {
                            this.removeChild(this.firstChild)
                        }
                        if (e.target.estado) {
                            e.target.estado.miPadre.appendChild(e.target)
                        }
                        el.ocupado = false;
                    }
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
                    var respu = document.createTextNode(e.dataTransfer.getData("text"));
                    var item = document.getElementById(e.dataTransfer.getData("text"));
                    if (!el.ocupado) {
                        this.appendChild(respu);
                        this.appendChild(item);
                        el.ocupado = true;
                    } else {
                        this.removeChild(this.firstChild);
                        var oldElement = this.firstChild;
                        oldElement.estado.miPadre.appendChild(oldElement);
                        this.appendChild(respu);
                        this.appendChild(item);
                    }
                    item.dragactive = false;

                    // call the drop passed drop function
                    scope.$apply(function (scope) {
                        var fn = scope.drop();
                        if ("undefined" !== typeof fn) {
                            fn(item.id, binId);
                        }
                    });

                    e.preventDefault();
                    return false;
                },
                false
            )
        }
    }
});