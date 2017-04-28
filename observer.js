var mobx = require('./mobx');
var autorun = mobx.autorun;
var observable = mobx.observable;
var action = mobx.action;

var isObservable = mobx.isObservable;
var isObservableArray = mobx.isObservableArray;
var isObservableObject = mobx.isObservableObject;
var isObservableValue = mobx.isObservableValue;
var isObservableMap = mobx.isObservableMap;

var _mergeGetterValue = function(res, object){
  Object.getOwnPropertyNames(object).forEach( function(propertyName){
    if(propertyName === "$mobx"){ return };
    var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
    if( descriptor && !descriptor.enumerable && !descriptor.writable ){
      res[propertyName] = toJS(object[propertyName]);
    }
  })
}

var toJS = function(source, detectCycles, __alreadySeen) {
    if (detectCycles === void 0) { detectCycles = true; }
    if (__alreadySeen === void 0) { __alreadySeen = []; }
    function cache(value) {
        if (detectCycles)
            __alreadySeen.push([source, value]);
        return value;
    }
    if (isObservable(source)) {
        if (detectCycles && __alreadySeen === null)
            __alreadySeen = [];
        if (detectCycles && source !== null && typeof source === "object") {
            for (var i = 0, l = __alreadySeen.length; i < l; i++)
                if (__alreadySeen[i][0] === source)
                    return __alreadySeen[i][1];
        }
        if (isObservableArray(source)) {
            var res = cache([]);
            var toAdd = source.map(function (value) { return toJS(value, detectCycles, __alreadySeen); });
            res.length = toAdd.length;
            for (var i = 0, l = toAdd.length; i < l; i++)
                res[i] = toAdd[i];
            return res;
        }
        if (isObservableObject(source)) {
            var res = cache({});
            for (var key in source)
                res[key] = toJS(source[key], detectCycles, __alreadySeen);
            _mergeGetterValue(res, source);
            return res;
        }
        if (isObservableMap(source)) {
            var res_1 = cache({});
            source.forEach(function (value, key) { return res_1[key] = toJS(value, detectCycles, __alreadySeen); });
            return res_1;
        }
        if (isObservableValue(source))
            return toJS(source.get(), detectCycles, __alreadySeen);
    }

    if (Object.prototype.toString.call(source) ===  '[object Array]') {
      return source.map( function(value) {
        return toJS(value);
      });
    }
    if (source !== null && typeof source === 'object') {
      var res = {};
      for (var key in source){
        res[key] = toJS(source[key]);
      }
      return res;
    }
    return source;
}

var observer = function(page){

  var oldOnLoad = page.onLoad;
  var oldOnUnload = page.onUnload;

  page._update = function() {
    //console.log('_update');
    var newData = {};
    var props = this.props || {};
    this.setData({props: toJS(props)});
  }

  page.onLoad = function() {
    var that = this;

    // support observable props here
    that.props = mobx.observable(that.props);

    that._autorun = autorun( function(){
      //console.log('autorun');
      that._update();
    });

    if( oldOnLoad ) {
      oldOnLoad.apply(this, arguments);
    }
  }

  page.onUnload = function() {
    // clear autorun
    this._autorun();

    if( oldOnUnload ) {
      oldOnUnload.apply(this, arguments);
    }
  }

  return page;
}

module.exports = {
  observer: observer,
  toJSWithGetter: toJS,
  version: '0.1.3',
}
