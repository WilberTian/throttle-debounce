## 遇到的问题

在开发过程中会遇到频率很高的事件或者连续的事件，如果不进行性能的优化，就可能会出现页面卡顿的现象，比如：

1. 鼠标事件：mousemove(拖曳)/mouseover(划过)/mouseWheel(滚屏)
2. 键盘事件：keypress(基于ajax的用户名唯一性校验)/keyup(文本输入检验、自动完成)/keydown(游戏中的射击)
3. window的resize/scroll事件(DOM元素动态定位)

为了解决这类问题，常常使用的方法就是**throttle(节流)**和**debounce(去抖)**。throttle(节流)和debounce(去抖)都是用来**控制某个函数在一定时间内执行多少次的解决方案**，两者相似而又不同。

下面就具体的看看两者的相似和区别。



## 认识throttle和debounce

throttle和debounce的作用就是确认事件执行的方式和时机，以前总是不太清楚两者的区别，容易把二者弄混。

下面就通过两个简单的场景描述一下debounce和throttle，以后想到这两个场景就不会再弄混了：

> **debounce**

> 假设你正在乘电梯上楼，当电梯门关闭之前发现有人也要乘电梯，礼貌起见，你会按下开门开关，然后等他进电梯； 

> **如果在电梯门关闭之前，又有人来了，你会继续开门；**

> 这样一直进行下去，**你可能需要等待几分钟，最终没人进电梯了，才会关闭电梯门，**然后上楼。

    
所以debounce的作用是，**当调用动作触发一段时间后，才会执行该动作，若在这段时间间隔内又调用此动作则将重新计算时间间隔**。

> **throttle**

> 假设你正在乘电梯上楼，当电梯门关闭之前发现有人也要乘电梯，礼貌起见，你会按下开门开关，然后等他进电梯；  

> 但是，你是个没耐心的人，**你最多只会等待电梯停留一分钟**；

> **在这一分钟内，你会开门让别人进来，但是过了一分钟之后，你就会关门，**让电梯上楼。

所以throttle的作用是，**预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新的时间周期**。

  
  
## 简单实现  

有了上面的了解，就可以去实现简单debounce和throttle了。

### debounce实现

首先来看看debounce的实现，根据前面对debounce的描述：

1. debounce函数会通过闭包维护一个timer
2. 当同一action在delay的时间间隔内再次触发，则清理timer，然后重新设置timer

可以在Chrome中运行下面的代码，看看debounce的效果：

    var debounce = function(action, delay) {
        var timer = null;
        
        return function() {
            var self = this, 
                  args = arguments;
                  
            clearTimeout(timer);
            timer = setTimeout(function() {
                action.apply(self, args)
            }, delay);
        }
    }
    
    // example
    function resizeHandler() {
        console.log("resize");
    }

    window.onresize = debounce(resizeHandler, 300);
      
      
### throttle实现

throttle跟debounce的最大不同就是，throttle会有一个阀值，当到达阀值的时候action必定会执行一次。  

所以throttle的实现可以基于前面的debounce的实现，只需要加上一个阀值：

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
    
其实，对于上面的实现可以进心简化，只是通过闭包维护一个开始的时间：

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
  
  
  
## 总结

通过前面的介绍，应该对debounce和throttle有一个直观的认识了：

- debounce：把触发非常频繁的事件合并成一次执行
- throttle：设置一个阀值，在阀值内，把触发的事件合并成一次执行；当到达阀值，必定执行一次事件


了解了throttle和debounce之后，下面看看他们的常用场景：

debounce

- 对于键盘事件，当用户输入比较频繁的时候，可以通过debounce合并键盘事件处理
- 对于ajax请求的情况，例如当页面下拉超过一定返回就通过ajax请求新的页面内容，这时候可以通过debounce合并ajax请求事件

throttle

- 对于键盘事件，当用户输入非常频繁，但是我们又必须要在一定时间内（阀值）内执行处理函数的时候，就可以使用throttle

    - 例如，一些网页游戏的键盘事件
    
- 对于鼠标移动和窗口滚动，鼠标的移动和窗口的滚动会带来大量的事件，但是在一段时间内又必须看到页面的效果

    - 例如对于可以拖动的div，如果使用debounce，那么div会在拖动停止后一下子跳到目标位置；这时就需要使用throttle



