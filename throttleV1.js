var throttleV1 = function(action, delay, mustRunDelay) {
 	var timer = null,
 	      startTime;
          
 	return function() {
 		var self = this, 
              args = arguments, 
              currTime = new Date();
              
 		clearTimeout(timer);
        
 		if(!startTime) {
 			startTime = currTime;
 		}
        
 		if(currTime - startTime >= mustRunDelay) {
 			action.apply(self, args);
 			startTime = currTime;
 		}
 		else {
 			timer = setTimeout(function() {
 				action.apply(self, args);
 			}, delay);
 		}
    };
};

// example
function resizeHandler() {
    console.log("resize");
}

window.onresize = throttleV1(resizeHandler, 1000, 300);
