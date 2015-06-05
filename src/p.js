var P = (function(prototype, ownProperty, undefined) {
  return function P(_superclass /* = Object */, definition) {
    // 如果只有一个参数，表示没有父类
    if (definition === undefined) {
      definition = _superclass;
      _superclass = Object;
    }

    // C为要返回的子类，init为初始化函数
    function C() {
      var self = this instanceof C ? this : new Bare;
      self.init.apply(self, arguments);
      return self;
    }

    // Bare让C不用new就能返回实例
    function Bare() {}
    C.Bare = Bare;

    // 为了防止改动子类影响到父类，所以将父类的原型赋值给中介者Bare，然后再将Bare的实例作为子类的原型
    var _super = Bare[prototype] = _superclass[prototype];
    var proto = Bare[prototype] = C[prototype] = C.p = new Bare;

    var key;

    // 修正子类的构造器函数，使其指向自身
    proto.constructor = C;

    C.extend = function(def) { return P(C, def); }

    return (C.open = function(def) {
      // 如果def是函数，则直接调用，并传入子类原型、父类原型、子类构造器、父类构造器
      if (typeof def === 'function') {
        def = def.call(C, proto, _super, C, _superclass);
      }

      // 如果def是对象，则是子类的扩展包，将其属性添加到子类原型
      if (typeof def === 'object') {
        for (key in def) {
          // ownProperty其实就是传入的Object.hasOwnProperty
          if (ownProperty.call(def, key)) {
            proto[key] = def[key];
          }
        }
      }

      // 确保有初始化函数可以调用
      if (!('init' in proto)) proto.init = _superclass;

      return C;
    })(definition);
  }

})('prototype', ({}).hasOwnProperty);
