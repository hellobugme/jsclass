    var Base = function() {
        //并没有什么卵用
    };

    //Base.extend 方法功能：
    //1、创建子类；2、继承父类；3、返回子类
    Base.extend = function(_instance, _static) {
        var proto = new this;//原型继承，proto将作为子类的prototype
        Base.prototype.extend.call(proto, _instance);//给子类添加原型方法
        //...
        var klass = function(){};//子类
        klass.prototype = proto;
        Base.prototype.extend.call(klass, _static);//给子类添加特权方法
        //...
        return klass;//返回子类
    };

    //Base.prototype.extend 方法功能：
    //复制新的成员到子类
    Base.prototype = {  
        extend: function(source, value) {
            if(arguments.length > 1){
                //传入的是2个参数，为键值对，直接给this的source赋值为value
                //该方法通过call来调用，这里的执行环境this为调用时传入的环境
                //...
                this[source] = value;
            } else {
                //传入的是1个参数，为对象，遍历对象，把对象的所有属性复制给this
                //...
                for (var key in source) {
                    Base.prototype.extend.call(this, key, source[key]);
                }
            }
            return this;
        }
    };

    //初始化Base
    Base = Base.extend({
        constructor: function() {/*...*/}
    }, {
        ancestor: Object,
        version: "1.1"
        // 其它方法
    });
