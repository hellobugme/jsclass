var Class = {
    create : function(){
        return function(){
            this.initialize.apply(this, arguments);
        }
    }
};
Object.extend = function(destination, source){
    for(var property in source){
        destination[property] = source[property];
    }
    return destination;
};