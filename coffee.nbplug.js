/*!
 * Coffee-Script plugin for nBuild
 * Copyright(c) 2011-2012 vol4ok <admin@vol4ok.net>
 * MIT Licensed
*/
/** Module dependencies
*/
var CoffeePlugin, Filter, basename, coffee, dirname, existsSync, extname, fs, join, makeDir, normalize, relative, setExt, walkSync, _, _ref, _ref2,
  __slice = Array.prototype.slice;

require("colors");

fs = require('fs');

_ = require('underscore');

coffee = require('coffee-script');

walkSync = require('fs.walker').walkSync;

Filter = require('path.filter');

_ref = require('fs.utils'), makeDir = _ref.makeDir, setExt = _ref.setExt;

_ref2 = require('path'), join = _ref2.join, dirname = _ref2.dirname, basename = _ref2.basename, extname = _ref2.extname, normalize = _ref2.normalize, relative = _ref2.relative, existsSync = _ref2.existsSync;

exports.initialize = function(builder) {
  return new CoffeePlugin(builder);
};

CoffeePlugin = (function() {

  CoffeePlugin.prototype.defaults = {
    targets: [],
    coffeeOptions: {},
    recursive: true,
    outdir: null,
    filter: null,
    fileExts: ["coffee"]
  };

  function CoffeePlugin(builder) {
    this.builder = builder;
    this.builder.registerType('coffee', this.coffee, this);
  }

  CoffeePlugin.prototype.coffee = function(name, options) {
    var target, _i, _len, _ref3, _ref4, _results,
      _this = this;
    this.opt = _.defaults(options, this.defaults);
    if (this.opt.target != null) this.opt.targets.push(this.opt.target);
    this.count = 0;
    this.filter = (_ref3 = new Filter()).allow.apply(_ref3, ['ext'].concat(__slice.call(this.opt.fileExts)));
    if (this.opt.filter != null) {
      if (_.isArray(this.opt.filter.allow)) {
        filter.allowList(this.opt.filter.allow);
      }
      if (_.isArray(this.opt.filter.deby)) filter.denyList(this.opt.filter.deny);
    }
    _ref4 = this.opt.targets;
    _results = [];
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      target = _ref4[_i];
      _results.push(walkSync().on('file', function(file, dir, base) {
        var infile, outdir, outfile, _ref5;
        if (!_this.filter.test(file)) return;
        infile = join(base, dir, file);
        outdir = join((_ref5 = _this.opt.outdir) != null ? _ref5 : base, dir);
        outfile = join(outdir, setExt(file, '.js'));
        makeDir(outdir);
        return _this._compile(infile, outfile);
      }).walk(target));
    }
    return _results;
  };

  CoffeePlugin.prototype._compile = function(infile, outfile) {
    var cs, js;
    cs = fs.readFileSync(infile, 'utf-8');
    js = coffee.compile(cs, this.opt.coffeeOptions);
    fs.writeFileSync(outfile, js, 'utf-8');
    return console.log('_compile'.green, infile, ' -> '.green, outfile);
  };

  return CoffeePlugin;

})();
