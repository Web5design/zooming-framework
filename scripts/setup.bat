@ECHO OFF

REM Copyright 2012 Ben Vanik. All Rights Reserved.
REM
REM zf Windows setup script
REM
REM This script will install all dependencies to the system (that it can).
REM The dependencies are all global.
REM
REM Requires:
REM - Git 1.7.5+
REM - Python 2.7+
REM - Python easy_install:  http://pypi.python.org/pypi/setuptools
REM - node.js v0.6.10+ (containing npm)

REM TODO(benvanik): check python/node versions

ECHO.
REM ============================================================================
REM Git submodules
REM ============================================================================
ECHO Fetching submodules...

git submodule init
git submodule update

ECHO.
REM ============================================================================
REM Node modules
REM ============================================================================
ECHO Installing node modules...

npm install

ECHO.
REM ============================================================================
REM Content tools
REM ============================================================================
ECHO Installing content tools...

REM TODO(benvanik): install tools (grab exes/etc?)
ECHO TODO!

ECHO.
