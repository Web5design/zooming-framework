zf.content:
  TileSource
    - gets tile data for a given image level/x/y


zf.exec:
  Scheduler
    - queue()
  Task
    - ctor(priority -> Priority.IMMEDIATE | INPUT | RENDER | FRAME | HIGH | LOW | IDLE)
    - execute() -> Result.COMPLETE | FAIL | CONTINUE
  CallbackTask
    - ctor(priority, callback, scope, args)
  SequenceTask
    - ctor(priority, list, callback, scope)

zf.cache:
  BaseCache
    NetworkCache
    TileDataCache
  CacheEntry

zf.net

zf.render

zf.scene
  Camera2D
    - 3x3 matrix
    - basic actions (pan/zoom/etc)
    - animation support
  Viewport2D
    - bind input to camera
    - root fragment
    DomViewport2D

zf.Engine
  - viewports
  - caches
  - render contexts


var engine = new zf.Engine(document);
var viewport1 = new zf.scene.Viewport2D(engine, canvas1);
var viewport2 = new zf.scene.Viewport2D(engine, canvas2);
var renderContext = zf.render.canvas.getRenderContext(canvas1);
var viewport3 = new zf.scene.Viewport2D(engine, renderContext);

zf.zom
  Element
    - layoutMode
    - padding/margin/etc
    - transform
    - matrix
    - children[]
    Fragment
      - root
    Box
      - backgroundColor
    TiledImage
      - tileSource
  TransformManager
viewport1.setFragment(frag1);
