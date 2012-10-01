# zooming-framework

(As the name implies) a zooming image framework. Strongly influenced by Seadragon-esque projects such as
[Seadragon AJAX](http://gallery.expression.microsoft.com/SeadragonAjax),
[Deep Zoom](http://en.wikipedia.org/wiki/Deep_Zoom), and [OpenZoom](http://www.openzoom.org/).

This is a project of love, done solely because I have an itch that needs scratching.

## Getting Started

    git clone git@github.com:benvanik/zooming-framework.git
    cd zooming-framework/
    sudo scripts/setup.sh
    source zfrc
    anvil serve -p 8080 &
    anvil build :fast :debug :release
    open http://localhost:8080/examples/simple/simple.html?uncompiled

    # Edit-reload works, but run this if you change a goog.provide/require:
    anvil build :fast

    # Build and copy the 'zf_js_compiled.js' file someplace:
    anvil deploy -o /tmp/foo/ :release

## License

BSD
