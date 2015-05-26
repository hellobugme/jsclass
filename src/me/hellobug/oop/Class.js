/**
 * Use JavaScript Class like ActionScript
 * @author Kainan Hong <1037714455@qq.com>
 * @version 2015.05.26
 *
 eg:
(function(){
    window.myClass = { demo : {} }; // namespace
    var Package = me.hellobug.oop.Package,
        Class = me.hellobug.oop.Class;

 // Package("myClass.demo").Class("ClassA")(funciton(name){
 // Class("myClass.demo.ClassA")(funciton(name){
    Package(myClass.demo).Class("ClassA")(funciton(name){
        // privileged member
        this.name = name;
        //... other privileged members

        // note: don't use private members in prototype

        // ptototype member
        var proto = this.nameSpace[this.className].prototype;
        if(typeof proto.particularMothed != "function"){
            proto.particularMothed = function(){
                //Do something
            };
            //... other prototype members
        }
    })

 // Package("myClass.demo").Class("ClassB").Extends("myClass.demo.ClassA")(funciton(name){
 // Class("myClass.demo.ClassB").Extends("myClass.demo.ClassA")(funciton(name){
    Package(myClass.demo).Class("ClassB").Extends(myClass.demo.ClassA)(funciton(name){
        // call the super class's constructor
        this.super(name);

        //... override super class's public members, or create new members
    })
})();
 *
 */
(function(){
    var libNS = $nameSpace("me.hellobug.oop");
    if(!!libNS.Class) return;

    /**
     * 类的构造
     * @param {String} className (带命名空间的)类名
     * @return {Function} initFn 初始化入口
     */
    function Class(className, nameSpace){
        var definition = $getDefinitionByName(className);
        className = definition.className;
        if(!nameSpace){
            nameSpace = definition.nameSpace;
        }

        function Class(){
            Class.prototype.constructorFn.apply(this, arguments);
        };
        Class.prototype = {
            nameSpace : nameSpace,  // 命名空间
            constructor : Class,    // 构造器
            super : null,           // 超类
            className : className,  // 类名
            constructorFn : null,   // 伪构造器函数
            toString : function(){ return "[object " + this.className + "]"; }
        }

        /**
         * 初始化入口
         * @param {Function} fn 伪构造器函数
         */
        function initFn(fn){
            var proto = Class.prototype;
            proto.constructorFn = fn;
            if(!proto.super){
                proto.super = Object;
            }
        }

        /**
         * 继承实现
         * @param {Function/String} superClass 带命名空间的超类(名)
         * @return {Function} initFn 初始化入口
         */
        initFn.Extends = function(superClass){
            // 单继承
            if(!Class.prototype.super){
                if(typeof superClass === "string"){
                    superClass = $getDefinitionByName(superClass).classReference;
                }
                inheritPrototype(Class, superClass);
            }
            return initFn;
        }

        nameSpace[className] = Class;
        return initFn;
    }

    // 寄生组合继承
    function object(o){
        function Prototype(){}
        Prototype.prototype = o;
        return new Prototype();
    }
    function inheritPrototype(subClass, superClass){
        var oProto = subClass.prototype;
            nProto = object(superClass.prototype);
        for(var p in oProto){
            nProto[p] = oProto[p];
        }
        nProto.super = superClass;
        subClass.prototype = nProto;
    }

    /**
     * 创建命名空间
     * @param {Object/String} param 命名空间对象/名字
     */
    function $nameSpace(param){
        var ret = null;
        switch(typeof param){
            case "object":
                ret = param;
                break;
            case "string":
                if(param === ""){
                    ret = window;
                } else if(/^\w+(\.\w+)*$/.test(param)){
                    // 格式必须为 "a.bb.ccc"
                    var arr = param.split("."), _parent = window;
                    for(var i = 0, l = arr.length; i < l; i++){
                        var o = arr[i];
                        (!_parent[o]) && (_parent[o] = {});
                        _parent = _parent[o];
                    }
                    ret = _parent;
                }
                break;
        }
        return ret;
    }
    // 获取字符串相应的类的信息
    function $getDefinitionByName(str){
        var lastDotIdx = str.lastIndexOf("."),
            nameSpace = $nameSpace(str.substring(0, lastDotIdx)),
            className = str.substring(lastDotIdx + 1);
        return {
            classReference : nameSpace[className], // 类的引用
            nameSpace : nameSpace, // 命名空间
            className : className // 类名
        };
    }

    libNS.Class = Class;

    libNS.Package = function(ns){
        return {
            nameSpace : $nameSpace(ns), 
            Class : function(className){
                return new libNS.Class(className, $nameSpace(ns || window));
            }
        }
    };
})();