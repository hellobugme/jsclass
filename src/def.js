/*
 *    def.js: Simple Ruby-style inheritance for JavaScript
 *
 *    Copyright (c) 2010 Tobias Schneider
 *    This script is freely distributable under the terms of the MIT license.
 *
 *    Featuring contributions by
 *    John-David Dalton
 *    Dmitry A. Soshnikov
 *    Devon Govett
 */

(function(global){
    // used to defer setup of superclass and properties
    // deferred 是整个库中最重要的部件，扮演3个角色
    // 1、def("SuperClass")时就是返回deferred，此时我们可以直接接括号对原型进行扩展
    // 2、在继承父类时 < 触发两者调用 valueOf，此时会执行 deferred.valueOf 里面的逻辑
    // 3、在继承父类时，父类的后面还可以接括号（此时构造器当普通函数使用），当作传送器，保存着父类与扩展包到 _super，_props
    var deferred;
    
    // 扩展自定义的原型
    function extend(source){
        var prop, target = this.prototype;
        
        for(var key in source) if(source.hasOwnProperty(key)){
            prop = target[key] = source[key];
            // check if we're overwriting an existing function
            if('function' == typeof prop){
                // mark each method with its name and surrounding class
                // 在每个原型方法上添加2个自定义属性，保存其名字与当前类
                prop._name = key;
                prop._class = this;
            }
        }
        
        return this;
    }
    
    // calls same method as its caller but in the superclass
    // based on http://github.com/shergin/legacy by Valentin Shergin
    function base(){
        // cross browser support > strict mode compatibility
        // 取得调用 this._super() 这个函数本身，如果是在init内，那么就是当前类
        var caller = arguments.callee.caller;
        // arguments automatically passed to super if none provided
        // 执行父类的同名方法，有2种形式，一是用户自己传，二是只能取当前函数的参数
        return caller._class._super.prototype[caller._name]
            .apply(this, arguments.length ? arguments : caller.arguments);
    }
    
    function def(context, klassName){
        klassName || (klassName = context, context = global);
        // create class on given context (defaults to global object)
        // 偷偷在给定的全局作用域或某对象上创建一个类
        var Klass = context[klassName] = function Klass(){
            if(context != this){
                // called as a constructor
                // allow init to return a different class/object
                // 如果不使用 new 操作符，大多数情况下 context 与 this 都为 window
                return this.init && this.init.apply(this, arguments);
            }
            // called as a function - defer setup of superclass and properties
            // 实现继承的第二步，复制自身与扩展包到 deferred
            deferred._super = Klass;
            deferred._props = arguments[0] || { };
        }
        
        // make this class extendable
        // 让所有自定义类都共用一个 extend 方法
        Klass.extend = extend;
        
        // called as function to set properties
        // 实现继承的第一步，重写 deferred，为新创建的自定义类的扩展函数
        deferred = function(props){
            return Klass.extend(props);
        };
        
        // dummy subclass
        // 一个中介者，用于切断子类与父类的原型连接，会被反复读写
        function Subclass(){ }
        
        // valueOf is called to setup inheritance from a superclass
        // 实现继承的第三步，重写 valueOf，方便在 def("SubClass") < SuperClass({}) 执行它
        deferred.valueOf = function(){
            var Superclass = deferred._super;
            
            if(!Superclass){
                return Klass;
            }
            // inherit from superclass
            // 先将父类的原型赋给中介者，然后再将中介者的实例作为子类的原型
            Subclass.prototype = Superclass.prototype;
            var proto = Klass.prototype = new Subclass;
            // reference base and superclass
            // 引用自身与父类
            Klass._class = Klass;
            Klass._super = Superclass;
            // 获取该类名字
            Klass.toString = function(){
              return klassName;  
            };
            // enforce the constructor to be what we expect
            // 修复原型中 constructor 指向自身
            proto.constructor = Klass;
            // to call original methods in the superclass
            // 让所有自定义类都共用这个 base 方法，它是构成方法链的关系
            proto._super = base;
            // set properties
            // 把父类后来传入的扩展包混入子类的原型中
            deferred(deferred._props);
        };
        
        return deferred;
    }
    
    // expose def to the global object
    global.def = def;
}(this));
