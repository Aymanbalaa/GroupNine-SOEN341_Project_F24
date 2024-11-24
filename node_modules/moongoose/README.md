![moongoose](https://i.kinja-img.com/gawker-media/image/upload/s--wbCHfA3R--/c_fit,fl_progressive,q_80,w_636/17hnwnvcypnk6jpg.jpg)
Q: Why do people use mongoose?

Here are some of the benefits:
* You can execute commands right away without having to wait for `mongo.connect()`
* You get schema validation
* You can create synthetic joins via populate

However, there are some potential downsides:
* Mongoose is global object - causing potential conflicts
* Mongoose can be very slow with all the getters, setters and whatnot
* the `lean()` options ends up being slower than native
* It can be difficult to understand what is going on behind the scenes
* The schema is non-standard

Moongoose to the rescue

* Around 100 LOC - simple wrapper around native
* No need to wait for connection before executing commands
* Efficient `populate` for streaming and findOnes
* Validation with JSON schema
* Acts global but can be cloned for ringfencing different instances

Example: find a record

```js
var moongoose = require('moongoose');

moongoose.connect('mongodb://localhost:27017/test');

moongoose.collection('test')
  .findOne({})
  .populate('org_id','orgs')
  .then(console.log);
```

Same example streaming:

```js
mongoose.collection('test')
  .find()
  .populate('org_id','orgs')
  .stream()
  .pipe(...);
```