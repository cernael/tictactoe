/*
  TF 2014, extend and createClass,  v 1.21
*/

(function(){

  // Define Object.create if it is not implemented natively
  Object.create  ||  (Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  });

  // Deep copy using Object.create and JSON.stringify
  Object.createDeep = function(org){
    var a, o = Object.create(org);
    for(var i in o){
      if(typeof o[i] == "object"){
        !a && (a = JSON.parse(JSON.stringify(org)));
        o[i] = a[i];
      }
    }
    return o;
  }

  // Extend an object with new properties
  Object.extend = function(obj,props){
    for(var i in props){
      obj[i] = props[i];
    }
    return obj;
  }

  // Create a class
  Object.createClass = function(props){
    var obj = {}, _private, className = props._class || '_', empty_obj = {};
    var settings = props._settings;
    // If no explicit inheritance and not a _baseClass then inherit base class
    !props._extends && !props._baseClass && (props._extends = Class);
    // Inheritance
    if(props._extends){
      obj = Object.createDeep(props._extends._obj);
      // Set __proto__ if the not implemented natively
      obj.__proto__ || (obj.__proto__ = props._extends._obj);
    }
    // Delete special properties (only intended to control Object.create Class)
    if(props._extends){_private = props._private; delete props._private; }
    delete props._class;
    delete props._extends;
    delete props._settings;
    delete props._baseClass;
    // Add class specific properties
    obj = Object.extend(obj,props);
    // Generic constructor
    var func = function(){
      // Use Object.create for fast prototypical inheritance
      var o = Object.createDeep(obj);
      // Run init method if it exists
      typeof o.init == "function" && o.init.apply(o,arguments);
      // Fix private properties using the base class method for this
      _private && o._private(Object.createDeep(_private));
      // Implement setting properties through a settings object (if _settings is not false)
      var lastArg = arguments[arguments.length-1];
      if(settings!==false && lastArg && lastArg.constructor === empty_obj.constructor){
        Object.extend(o,lastArg);
      }
      // return a new instance
      return o;
    }
    // Named constructor
    eval("obj.constructor = function " + className + "(){return func.apply(this,arguments)}");
    // Remember the class properties (that we need to create instances with Object.create)
    obj.constructor._obj = func._obj = obj;
    // Fix the constructor.prototype.chain, make instanceof work
    obj.constructor.prototype = func._obj;
    // Return the named constructor
    return obj.constructor;
  }

  // _inside - prevent a method from being called outside an object
  var _inside = function(obj,funcName,min){
    var cname = obj.constructor.name, inside, co = 0;
    min = min || 1;
    func = arguments.callee.caller.caller;
    while(func){
      for(var i in obj){
        if(obj[i] === func && co >= min){ inside = true; break; }
      }
      func = func.caller;
      co++;
    }
    if(!inside){ 
      throw(cname + '.' + funcName + ' can only be called inside an instance of ' + cname);
    }
  }

  // _wrap - wrap a function in another function using closure 
  var _wrap = function(func){
    return function(){return func.apply(this,arguments)};
  }

  // Implement a base class containing some important methods
  // we want to share across all classes
  // _super - lets us adress super class methods even though they are overridden
  // _private -  holds private properties (by creating an instance specific closure)
  var Class = Object.createClass({
    _class: "Class",
    _baseClass: true,
    _super: _wrap(function(x){
      var me = this, p = me, a = arguments;
      _inside(this,"_super");
      var levels = x && x._super ? x._super : 1;
      for(var i = 0; i <= levels; i++){
        p = p.__proto__;
      }                                                                                                 
      for(var i in this){
        if(this[i] === a.callee.caller.caller){
          if(!p || !p[i]){throw((p || {}).constructor.name + '.' + i + ' is not a method.');}
          x && x._super && (a = [].slice.call(a) || 1) && a.shift();
          return p[i].apply(me,a);
        }
      }
    }),
    _private: _wrap(function(x,y,obj){
      var a = arguments, firstRun = this._private === a.callee.caller;
      _inside(this,"_private",firstRun ? 1 : 3);
      if(firstRun){
        obj = {o:{}};
        this._private = _wrap(function(x,y){return this.__proto__._private.call(this,x,y,obj);})
      }
      o = obj.o;
      if (typeof x == "string"  && y !== undefined){ o[x] = y; }
      if (typeof x == "string"){ return o[x]; }
      if (typeof x == "object"){ o = obj.o = x; }
      if (x === undefined){ return o; }
    })
  });

})();