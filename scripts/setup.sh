#!/bin/bash

# Copyright 2012 Ben Vanik. All Rights Reserved.

# zf unix setup script

# This script will install all dependencies to the system.
# The dependencies are all global, and require root to install. If no package
# manager is supported on your system (or this file doesn't support yours)
# please add support and submit back to help out others!
#
# Requires:
# - All:
#   - Git 1.7.5+
#   - Python 2.6+
#   - Python easy_install: http://pypi.python.org/pypi/setuptools
#   - node.js v0.6.10+ (containing npm)
# - Linux:
#   - apt-get
# - OS X:
#   - MacPorts: http://www.macports.org

# TODO(benvanik): support cygwin somehow (existing script?)
# TODO(benvanik): support OS X homebrew http://mxcl.github.com/homebrew/
# TODO(benvanik): support other Linux package managers?

# Ensure running as root (or on Cygwin, where it doesn't matter)
if [ "$(id -u)" -ne 0 ]; then
  if [ ! -e "/Cygwin.bat" ]; then
    echo "This script must be run as root to install Python and system packages"
    echo "Run with sudo!"
    exit 1
  fi
fi

# This must currently run from the root of the repo
# TODO(benvanik): make this runnable from anywhere (find git directory?)
if [ ! -d ".git" ]; then
  echo "This script must be run from the root of the repository (the folder containing .git)"
  exit 1
fi

# ==============================================================================
# Check for Python/node/etc
# ==============================================================================
echo "Checking for dependencies..."

echo "- Python 2.6+:"
if [ ! -e "$(which python)" ]; then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "! Python not found or not in PATH - at least version 2.6 is required           !"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  exit 1
fi
PYTHON_CHECK=`python -c 'import sys; print(sys.version_info >= (2, 6) and "1" or "0")'`
PYTHON_VERSION=`python -c 'import sys; print(sys.version_info[:])'`
if [ "$PYTHON_CHECK" = "0" ]; then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "! Python is out of date - at least version 2.6 is required                     !"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Your version: $PYTHON_VERSION"
  exit 1
fi
echo "     path: $(which python)"
echo "  version: $PYTHON_VERSION"

echo "- Python easy_install:"
if [ ! -e "$(which easy_install)" ]; then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "! easy_install not found or not in PATH                                        !"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Grab the latest version from: http://pypi.python.org/pypi/setuptools"
  exit 1
fi
echo "     path: $(which easy_install)"

echo "- node.js 0.6.10+:"
if [ ! -e "$(which node)" ]; then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "! node.js not found or not in PATH - at least version 0.6.10 is required       !"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Grab the latest version from: http://nodejs.org/#download"
  exit 1
fi
NODE_CHECK=`node -e "var v = process.version.split('v')[1].split('.'); console.log(v[0] > 0 || v[1] > 6 || v[2] >= 10)"`
NODE_VERSION=`node -e "console.log(process.version)"`
if [ "$NODE_CHECK" = "false" ]; then
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "! node.js is out of date - at least version 0.6.10 is required                 !"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Your version: $NODE_VERSION"
  echo "Grab the latest version from: http://nodejs.org/#download"
  exit 1
fi
echo "     path: $(which node)"
echo "  version: $NODE_VERSION"

echo ""
# ==============================================================================
# Git submodules
# ==============================================================================
echo "Fetching submodules..."

git config core.sparsecheckout true
git submodule init
git submodule update

echo ""
# ==============================================================================
# Closure linter
# ==============================================================================
echo "Installing Closure linter..."

easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz

echo ""
# ==============================================================================
# Python dependencies
# ==============================================================================
echo "Installing Python packages..."

PYTHON_PACKAGES=(  )

for p in ${PYTHON_PACKAGES[@]}
do
  easy_install $p
done

echo ""
# =============================================================================
# Node modules
# =============================================================================
echo "Installing node modules..."

npm install

echo ""
# ==============================================================================
# Content tools
# ==============================================================================
echo "Installing content tools..."

SYSTEM_PACKAGES=(  )

if [ "$(which apt-get 2>/dev/null)" ]; then
  # Linux (Ubuntu)
  for p in ${SYSTEM_PACKAGES[@]}
  do
    apt-get install $p
  done
elif [ "$(which port 2>/dev/null)" ]; then
  # OS X (MacPorts)
  port selfupdate
  for p in ${SYSTEM_PACKAGES[@]}
  do
    port install $p
  done
else
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "! No supported package manager found!                                          !"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo " If on OS X ensure you install MacPorts (port) and run again"
  echo " Or, manually install these packages:"
  for p in ${SYSTEM_PACKAGES[@]}
  do
    echo "   $p"
  done
fi

echo ""

source zfrc
