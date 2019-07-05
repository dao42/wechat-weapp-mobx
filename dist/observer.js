var mobx = require('./mobx');
var diff = require('./diff').default;
var autorun = mobx.autorun;
var observable = mobx.observable;
var action = mobx.action;

var isObservable = mobx.isObservable;
var isObservableArray = mobx.isObservableArray;
var isObservableObject = mobx.isObservableObject;
var isBoxedObservable = mobx.isBoxedObservable;
var isObservableMap = mobx.isObservableMap;

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

            Object.getOwnPropertyNames(source).forEach( function(propertyName){
              if(propertyName === "$mobx"){ return };

              // deal getter property
              var descriptor = Object.getOwnPropertyDescriptor(source, propertyName);
              if( descriptor && !descriptor.enumerable && !descriptor.writable ){
                res[propertyName] = toJS(source[propertyName], detectCycles, __alreadySeen);
                return;
              }

              res[propertyName] = toJS(source[propertyName], detectCycles, __alreadySeen);
            })

            return res;
        }
        if (isObservableMap(source)) {
            var res_1 = cache({});
            source.forEach(function (value, key) { return res_1[key] = toJS(value, detectCycles, __alreadySeen); });
            return res_1;
        }
        if (isBoxedObservable(source))
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

  // thanks to Danney
  // Using closure to ignore weapp framework upating props mobx object, causing mobx array initialize fail
  var _props = mobx.observable(page.props) || {};
  delete page.props;

  // Inject props to data ASAP, fix: https://github.com/dao42/wechat-weapp-mobx/issues/17
  if( !page.data ){
    page.data = {}
  };
  page.data.props = toJS(_props);

  page._update = function() {
    // console.log('_update');
    var props = _props || {};
    var diffProps = diff(toJS(props), this.data.props || {});
    if (Object.keys(diffProps).length > 0) {
      var hash = {};
      for (var key in diffProps) {
        var hash_key = 'props' + '.' + key;
        hash[hash_key] = diffProps[key]
      }
      this.setData(hash);
    }
  }

  page.onLoad = function() {
    var that = this;
    // support observable props here
    that.props = _props;

    that._autorun = autorun( function(){
      //console.log('autorun');
      that._update();
    });

    if( oldOnLoad ) {
      oldOnLoad.apply(that, arguments);
    }
  }

  page.onUnload = function() {
    if( oldOnUnload ) {
      oldOnUnload.apply(this, arguments);
    }

    // clear autorun
    this._autorun();
  }

  return page;
}

module.exports = {
  observer: observer,
  toJSWithGetter: toJS,
  version: null,
}
