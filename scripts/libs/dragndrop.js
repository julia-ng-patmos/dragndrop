/**
 * Created by eon-1 on 9/12/14.
 */

function isMobile() {
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/))
        );
}

var app = angular.module('dragDrop', ['angular-gestures']);

app.controller("DragDropCtrl", function ($scope) {
    $scope.handleDrop = function () {
        alert("Item has been dropped");
    };
});

app.directive('draggable', ['$document', function ($document) {
    return {
        controller: function ($scope) {
            $scope.handleGesture = function ($event) {
//                console.log($event);
                $scope.type = $event.type;
            }
        },
        link: function (scope, element, attr) {
            var startX = 0, startY = 0, x = 0, y = 0;
            console.log(attr);
            if (isMobile()) {

            }

            element.bind('hola');
            console.log(element)

            if (!element.context.classList.contains('imagehover')) {
                element.css({
                    position: 'relative',
                    cursor: 'pointer'
                });
            }

            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            var myVar;

            function retroceso() {
                if (x < 0) {
                    x++;
                } else if (x > 0) {
                    x--;
                }

                if (y < 0) {
                    y++
                } else if (y > 0) {
                    y--
                }

                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });

                if (x == 0 && y == 0) {
                    clearTimeout(myVar);
                }
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
                myVar = setInterval(retroceso, 1);
            }
        }
    };
}]);

app.directive('droppable', ['$document', function ($document) {
    return function (scope, element, attr) {
//        console.log(element)
    }
}]);