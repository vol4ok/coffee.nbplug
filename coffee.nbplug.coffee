###!
 * Coffee-Script plugin for nBuild
 * Copyright(c) 2011-2012 vol4ok <admin@vol4ok.net>
 * MIT Licensed
###

###* Module dependencies ###

require "colors"
fs     = require 'fs'
_      = require 'underscore'
coffee = require 'coffee-script'

{walkSync} = require 'fs.walker'
Filter = require 'path.filter'
{makeDir, setExt} = require 'fs.utils'

{join, dirname, basename, extname, normalize, relative, existsSync} = require 'path'

exports.initialize = (builder) -> new CoffeePlugin(builder)

class CoffeePlugin
  defaults:
    targets: []
    coffeeOptions: {}
    recursive: yes
    outdir: null
    filter: null
    fileExts: [ "coffee" ]
  
  constructor: (@builder) ->
    @builder.registerType('coffee', @coffee, this)
    
  coffee: (name, options) ->
    @opt = _.defaults(options, @defaults)
    @opt.targets.push(@opt.target) if @opt.target?
    @count = 0
    @filter = new Filter().allow('ext', @opt.fileExts...)
    if @opt.filter?
      filter.allowList(@opt.filter.allow) if _.isArray(@opt.filter.allow)
      filter.denyList(@opt.filter.deny)   if _.isArray(@opt.filter.deby)
    for target in @opt.targets 
      walkSync()
        .on 'file', (file, dir, base) => 
          return unless @filter.test(file)
          infile  = join(base, dir, file)
          outdir = join(@opt.outdir ? base, dir)
          outfile = join(outdir, setExt(file, '.js'))
          makeDir(outdir)
          @_compile(infile, outfile)
        .walk(target)
      
  _compile: (infile, outfile) ->
    cs = fs.readFileSync(infile, 'utf-8')
    js = coffee.compile(cs, @opt.coffeeOptions)
    fs.writeFileSync(outfile, js, 'utf-8')
    console.log '_compile'.green, infile, ' -> '.green, outfile