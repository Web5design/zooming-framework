# Building


## Setup

    # Clone the project
    git clone git@github.com:benvanik/zooming-framework.git
    cd zooming-framework/
    # Run one-time setup of dependencies
    sudo scripts/setup.sh

    # Source the utility script to get the nice bash aliases
    # You'll want to do this every time you start up a new prompt
    source zfrc
    # Start a dev server on port 8080
    anvil serve -p 8080 &
    # Do a full build
    anvil build :debug :release

    # When updating goog.require/provide you must regen deps:
    anvil build :deps
