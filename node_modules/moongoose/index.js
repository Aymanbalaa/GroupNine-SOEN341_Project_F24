var Promise = require('bluebird'),
    streamz = require('streamz'),
    keys = require('./keys.json'),
    cursor_keys = require('./cursor_keys.json');

// Creates a lazy cursor that executes methods when connected
// returning promises for everything except `.stream()` and `.pipe`
function cursor(action,__populate) {
  function next(key) {
    return function() {
      return action.then(cur => cur[key].apply(c,arguments));
    };
  }

  var obj = cursor_keys.reduce( (p,key) => {
    p[key] = next(key);
    return p;
  },{});

  obj.stream = function() {
    var s = streamz(populate(__populate));
    action.then(cur => cur.pipe(s));
    return s;
  };

  obj.pipe = d => action.then(cur => cur.pipe(d)) && d;

  return obj;
}

// Populates incoming data based on __populate definitions
function populate(defs) {
  return function(d) {
    if (!defs || !defs.length) return d;
    defs.forEach(p => {
      d[p.field] = p.collection.findOne({_id:d[p.field]},p.select);
    });
    return Promise.props(d);
  };
}

// Creates a lazy collection that executes methods when connected
function collection(col,options) {
  var c = this.__connected.promise.then(db => db.collection(col)),
      self = this;

  function then(key) {
    return function() {
      var action = c.then(c => c[key].apply(c,arguments)),
          __populate = [];

      if (key === 'find')
        action = cursor(action,__populate);
      else if (key === 'findOne')
        action = action.then(populate(__populate));

      action.populate = function(field,collection,project) {
        __populate.push({field: field, collection: self.collection(collection), project: project});
        return action;
      };

      return action;
    };
  }

  var obj = keys.reduce(function(p,key) {
    p[key] = then(key);
    return p;
  },{});

  obj.__populate = [];

  return obj;
}

function moongoose() {
 return  Object.create({
    collection : function(col,options) {
      if (this.__collections[col]) {
        if (options) 
          throw new Error('Options already set');
        return this.__collections[col];
      }
      var obj = collection.call(this,col,options);
      if (options) this.__collections[col] = obj;
      return obj;
    },
    connect : function() {
      var mongodb = this.mongodb || require('mongodb');
      return mongodb.connect.apply(mongodb,arguments)
        .then(db => this.__connected.resolve(db));
    },
    clone : moongoose
  },{
    __connected : { value : Promise.defer() },
    __collections: { value: {}}
  });
}

module.exports = moongoose();