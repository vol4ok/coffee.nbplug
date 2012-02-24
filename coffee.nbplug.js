/*!
 * Coffee-Script plugin for nBuild
 * Copyright(c) 2011-2012 vol4ok <admin@vol4ok.net>
 * MIT Licensed
*/
/** Module dependencies
*/
var CoffeePlugin, Filter, basename, coffee, dirname, existsSync, extname, fs, join, makeDir, normalize, relative, setExt, walkSync, _, _ref,
  __slice = Array.prototype.slice;

require("colors");

fs = require('fs');

_ = require('underscore');

coffee = require('coffee-script');

walkSync = require('fs.walker').walkSync;

Filter = require('path.filter');

makeDir = function(path, options) {
  var mode, parent;
  if (options == null) options = {};
  mode = options.mode || 0755;
  parent = dirname(path);
  if (!existsSync(parent)) makeDir(parent, options);
  if (!existsSync(path)) {
    fs.mkdirSync(path, mode);
    if (_.isArray(options.createdDirs)) return options.createdDirs.push(path);
  }
};

setExt = function(file, ext) {
  return file.replace(/(\.[^.\/]*)?$/i, ext);
};

_ref = require('path'), join = _ref.join, dirname = _ref.dirname, basename = _ref.basename, extname = _ref.extname, normalize = _ref.normalize, relative = _ref.relative, existsSync = _ref.existsSync;

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
  }

  CoffeePlugin.prototype.coffee = function(name, options) {
    var target, _i, _len, _ref2, _ref3, _results,
      _this = this;
    this.opt = _.defaults(options, this.defaults);
    if (this.opt.target != null) this.opt.targets.push(this.opt.target);
    this.count = 0;
    this.filter = (_ref2 = new Filter()).allow.apply(_ref2, ['ext'].concat(__slice.call(this.opt.fileExts)));
    if (this.opt.filter != null) {
      if (_.isArray(this.opt.filter.allow)) {
        filter.allowList(this.opt.filter.allow);
      }
      if (_.isArray(this.opt.filter.deby)) filter.denyList(this.opt.filter.deny);
    }
    _ref3 = this.opt.targets;
    _results = [];
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      target = _ref3[_i];
      _results.push(walkSync().on('file', function(file, dir, base) {
        var infile, outdir, outfile, _ref4;
        if (!_this.filter.test(file)) return;
        infile = join(base, dir, file);
        outdir = join((_ref4 = _this.opt.outdir) != null ? _ref4 : base, dir);
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
