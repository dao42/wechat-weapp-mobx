var mobx = require('./mobx');
var autorun = mobx.autorun;
var observable = mobx.observable;
var action = mobx.action;

var observer = function(page){
  var connected = observable(false);

  var oldOnLoad = page.onLoad;
  var oldOnUnload = page.onUnload;

  var _mergeGetterValue = function(res, object){
    Object.getOwnPropertyNames(object).forEach( function(propertyName){
      if(propertyName === "$mobx"){ return };
      var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
      if( descriptor && !descriptor.enumerable && !descriptor.writable ){
        res[propertyName] = object[propertyName];
      }
    })
  }

  var _toJS = function(object){
    var res = mobx.toJS(object);
    _mergeGetterValue(res, object);
    return res;
  }

  var toJS = function(props){
    var res = {};
    Object.keys(props).forEach( function(key){
      res[key] = _toJS(props[key]);
    })
    return res;
  }


  page._update = function() {
    //console.log('_update');
    var newData = {};
    var props = this.props;
    this.setData({props: toJS(props)});
  }

  page.onLoad = function() {
    var that = this;

    action(function() {
      connected.set(true)
    })();

    autorun( function(){
      //console.log('autorun');
      if( connected.get() ){
        that._update();
      }
    });

    if( oldOnLoad ) {
      oldOnLoad.apply(this, arguments);
    }
  }

  page.onUnload = function() {
    if (connected.get()) {
      action(function() {
        connected.set(false)
      })();
    }

    if( oldOnUnload ) {
      oldOnUnload.apply(this, arguments);
    }
  }

  return page;
}

module.exports = {
  observer: observer,
  version: '0.1.1',
}
