(function(){
    var Package = me.hellobug.oop.Package;

    // EventDispatcher
    Package("me.hellobug.oop")
    .Class("EventDispatcher")(function(){
        this.listeners = {};
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.addEventListener != "function"){
            proto.addEventListener = function(type, listener){
                var _ = this.listeners;
                if(!_[type]){
                    _[type] = [];
                }
                if($inArray(listener, _[type]) === -1){
                    _[type].push(listener);
                }
                return this;
            };
            proto.removeEventListener = function(type, listener){
                var _ = this.listeners;
                if(_[type]){
                    for(var i = 0, len = _[type].length; i < len; i++){
                        if(_[type][i] === listener) {
                            _[type].splice(i, 1);
                        }
                    }
                }
                return this;
            };
            proto.removeAllEventListener = function(){
                var _ = this.listeners;
                for(var type in _){
                    _[type] = null;
                    delete _[type];
                }
                return this;
            };
            proto.dispatchEvent = function(type, args){
                var _ = this.listeners;
                if(_[type]){
                    for(var i = 0, len = _[type].length; i < len; i++){
                        _[type][i].apply(args);
                    }
                }
                return this;
            };
        }
    });

    // Model
    Package("me.hellobug.oop")
    .Class("Model")
    .Extends("me.hellobug.oop.EventDispatcher")(function(){
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.addData != "function"){
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
                            self.dispatchEvent(eventName);
                        }
                    };
                })(key, value, eventName);
                return this;
            }
        }
    });

    // View
    Package("me.hellobug.oop")
    .Class("View")(function(model){
        this.model = model;
        this.handles = [];
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.addListener != "function"){
            proto.addListener = function(eventName, eventHandle){
                this.model.addEventListener(eventName, eventHandle);
                this.handles.push([eventName, eventHandle]);
                return this;
            };
            proto.removeListener = function(eventName, eventHandle){
                this.model.removeEventListener(eventName, eventHandle);
                var _ = this.handles;
                for(var i = 0, l = _.length; i < l; i++){
                    if(_[i][0] === eventName && _[i][1] === eventHandle){
                        _.splice(i, 1);
                    }
                }
                return this;
            };
            proto.removeAllListener = function(){
                var _ = this.handles;
                for(var i = 0, l = _.length; i < l; i++){
                    this.model.removeEventListener(_[i][0], _[i][1]);
                }
                this.handles = [];
                return this;
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