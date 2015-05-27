(function(){
    var Package = me.hellobug.oop.Package;

    // Event
    Package(me.hellobug.oop)
    .Class("Event")(function(type, target){
        this.type = type;
        this.target = target;
    });

    // EventDispatcher
    Package(me.hellobug.oop)
    .Class("EventDispatcher")(function(){
        this.listeners = {};
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.addEventListener !== "function"){
            proto.addEventListener = function(type, listener){
                if(typeof this.listeners[type] === "undefined"){
                    this.listeners[type] = [];
                }
                this.listeners[type].push(listener);
                return this;
            };
            proto.removeEventListener = function(type, listener){
                if(this.listeners[type] instanceof Array){
                    var listeners = this.listeners[type]
                    for(var i = 0, len = listeners.length; i < len; i++){
                        if(listeners[i] === listener) {
                            listeners.splice(i, 1);
                        }
                    }
                    if(listeners.length === 0){
                        this.listeners[type] = null;
                        delete this.listeners[type];
                    }
                }
                return this;
            };
            proto.dispatchEvent = function(event){
                if(!event.target){
                    event.target = this;
                }
                if(this.listeners[event.type] instanceof Array){
                    var listeners = this.listeners[event.type];
                    for(var i = 0, len = listeners.length; i < len; i++){
                        listeners[i](event);
                    }
                }
                return this;
            };
            proto.hasEventListener = function(type, listener){
                if(!listener) {
                    return this.listeners[type] instanceof Array;
                } else {
                    return this.listeners[type] && ($inArray(listener, this.listeners[type]) !== -1);
                }
            };
        }
    });

    // Model
    Package(me.hellobug.oop)
    .Class("Model")
    .Extends(me.hellobug.oop.EventDispatcher)(function(){
        this.Super.prototype.Constructor();
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.addData !== "function"){
            /**
             * @param {String}  key         数据名
             * @param {*}       value       数据值
             * @param {String}  eventName   数据改变时触发的时间
             */
            proto.addData = function(key, value, eventName){
                var self = this;
                (function(key, value, eventName){
                    var _ = value;
                    self["get_" + key] = function(){
                        return _;
                    };
                    self["set_" + key] = function(value){
                        _ = value;
                        if(eventName){
                            var event = new me.hellobug.oop.Event(eventName, self);
                            self.dispatchEvent(event);
                        }
                    };
                })(key, value, eventName);
                return this;
            };
            proto.removeData = function(key){
                this["get_" + key] = null;
                delete this["get_" + key];
                this["set_" + key] = null;
                delete this["set_" + key];
            };
        }
    });

    // View
    Package(me.hellobug.oop)
    .Class("View")(function(model){
        this.model = model;
        this.listeners = [];
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.addListener !== "function"){
            proto.addListener = function(eventName, eventHandle){
                this.model.addEventListener(eventName, listener);
                this.listeners.push([eventName, eventHandle, listener]);
                var self = this;
                function listener(){
                    var event = new me.hellobug.oop.Event(eventName, self);
                    eventHandle(event);
                }
                return this;
            };
            proto.removeListener = function(eventName, eventHandle){
                var listener;
                for(var i = this.listeners.length - 1; i >= 0; i--){
                    var _ = this.listeners[i];
                    if(_[0] === eventName && _[1] === eventHandle){
                        listener = _[2];
                        this.listeners.splice(i, 1);
                    }
                }
                this.model.removeEventListener(eventName, listener);
                return this;
            };
            proto.hasListener = function(eventName, eventHandle){
                var ret = false;
                for(var i = 0, len = this.listeners.length; i < len; i++){
                    var _ = this.listeners[i];
                    if(_[0] === eventName && (!eventHandle || _[1] === eventHandle)){
                        ret = true;
                        break;
                    }
                }
                return ret;
            };
        }
    });

    function $inArray(ele, ary){
        var idx = -1;
        for(var i = 0, len = ary.length; i < len; i++){
            if(ary[i] === ele) {
                idx = i;
                break;
            }
        }
        return idx;
    }
})();