var throttleV2 = function(action, delay){
    var statTime = 0;
    
    return function() {
        var currTime = +new Date();
        
        if (currTime - statTime > delay) {
            action.apply(this, arguments);
            statTime = currTime ;
        }
    }
}


// example
function resizeHandler() {
    console.log("resize");
}

window.onresize = throttleV2(resizeHandler, 300);
