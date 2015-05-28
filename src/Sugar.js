/*
	Douglas Crockford
	http://javascript.crockford.com/inheritance.html
*/

// 辅助函数，可以将新函数绑定到对象的 prototype 上
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

// 从其它对象继承函数，同时仍然可以调用数据父对象的那些函数
Function.method('inherits', function (parent) {
	// 继承父对象的方法
    this.prototype = new parent();
    this.prototype.constructor = parent; 

    var d = {}, 
        p = this.prototype;
    // 创建一个新的特权函数'uber'，调用它时会执行所有在继承时被重写的函数
    this.method('uber', function uber(name) {
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, // 要执行的函数
        	r, // 函数的返回值
        	t = d[name], // 记录当前所在的父层次的级数
        	v = parent.prototype; // 父对象的prototype

        // 如果已经在某个'uber'函数之内
        if (t) {
        	// 上溯必要的t，找到原始的prototype
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            // 从该prototype中获得函数
            f = v[name];
        // 否则这就是'uber'函数的第一次调用
        } else {
        	// 从prototype获得要执行的函数
            f = p[name];
            // 如果此函数属于当前的prototype
            if (f == this[name]) {
            	// 则改为调用父对象的prototype
                f = v[name];
            }
        }

        // 记录在继承堆栈中所在位置的级数
        d[name] += 1;

        // 使用除第一个以外所有的arguments调用此函数
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        // 恢复继承堆栈
        d[name] -= 1;

       	// 返回执行过的函数的返回值
        return r;
    });
    return this;
});

// 只继承父对象特定函数的函数(非使用new parent()继承所有的函数)
Function.method('swiss', function (parent) {
	// 遍历所有要继承的方法
    for (var i = 1; i < arguments.length; i += 1) {
    	// 需要导入的方法名
        var name = arguments[i];
        // 将此方法导入this对象的prototype中
        this.prototype[name] = parent.prototype[name];
    }
    return this;
});