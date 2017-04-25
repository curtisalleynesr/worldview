# [Worldview](https://worldview.earthdata.nasa.gov)

[![Build Status](https://api.travis-ci.org/nasa-gibs/worldview.svg?branch=master)](https://travis-ci.org/nasa-gibs/worldview)

Visit Worldview at
[https://worldview.earthdata.nasa.gov](https://worldview.earthdata.nasa.gov)

## About

This tool from [NASA's](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov)
provides the capability to interactively browse global, full-resolution
satellite imagery and then download the underlying data. Most of the 200+
available products are updated within three hours of observation, essentially
showing the entire Earth as it looks "right now". This supports time-critical
application areas such as wildfire management, air quality measurements, and
flood monitoring. Arctic and Antarctic views of several products are also
available for a "full globe" perspective. Browsing on tablet and smartphone
devices is generally supported for mobile access to the imagery.

Worldview uses the
[Global Imagery Browse Services (GIBS)](https://earthdata.nasa.gov/gibs) to
rapidly retrieve its imagery for an interactive browsing experience. While
Worldview uses [OpenLayers](http://openlayers.org/) as its mapping library,
GIBS imagery can also be accessed from Google Earth, NASA World Wind, and
several other clients. We encourage interested developers to build their own
clients or integrate NASA imagery into their existing ones using these
services.

## License

This code was originally developed at NASA/Goddard Space Flight Center for
the Earth Science Data and Information System (ESDIS) project.

Copyright &copy; 2013 - 2016 United States Government as represented by the
Administrator of the National Aeronautics and Space Administration.
All Rights Reserved.

Licensed under the [NASA Open Source Agreement, Version 1.3](LICENSE.md).

## Contributing

We'd be quite excited if you'd like to contribute to Worldview! Whether it's finding bugs, adding new features, fixing anything broken, or improving documentation, get started by submitting an issue or pull request!

Please see our [Roadmap](https://github.com/nasa-gibs/worldview/wiki/Worldview-Roadmap) for a list of features currently in progress or planned in the reasonably near future.  We're also working to synchronize our (currently internal) sprint planning and issue tracking systems with GitHub.  

Here are the tickets we are currently working on: 
[![Stories in Ready](https://badge.waffle.io/nasa-gibs/worldview.svg?label=ready&title=Ready)](http://waffle.io/nasa-gibs/worldview)
[![Stories in In Progress](https://badge.waffle.io/nasa-gibs/worldview.svg?label=in progress&title=In Progress)](http://waffle.io/nasa-gibs/worldview)

To get your instance of Worldview running, follow the [Installation](https://github.com/nasa-gibs/worldview#installation) guide below or the [Manual Setup](https://github.com/nasa-gibs/worldview/blob/master/doc/manual_setup.md) instructions.

Thanks for considering contributing and making our planet easier to explore!

## Installation

These instructions install a development version of Worldview using a virtual
machine. If you prefer to install locally on your computer, follow the
directions in [Manual Setup](doc/manual_setup.md)

*Notes:* This has only been tested on Mac OS X and Windows 8.1. Let us know if this works in
other environments.

*Also note:* As documented in [this issue](https://github.com/nasa-gibs/worldview/issues/73), there may be a problem with using Vagrant 1.8.7 and above.  The current workaround is to downgrade to Vagrant 1.8.6, though we are working to find a better fix.

Clone this repository:

```bash
git clone https://github.com/nasa-gibs/worldview.git
cd worldview
```

Select one of the following configuration repositories:

```bash
# Official EOSDIS configurations
git clone https://github.com/nasa-gibs/worldview-options-eosdis.git options

# Or a blank repository with only Corrected Reflectance and no branding
git clone https://github.com/nasa-gibs/worldview-options-template.git options
```
Install dependencies
```bash
# install local version of grunt

sudo npm install --global grunt-cli
```

```bash
# install virtualenv to keep additional libraries installed in a local directory: 

sudo easy_install virtualenv==1.10.1
```

Run local node server
```bash
npm install
grunt
npm start
```
# Worldview should be available at

```bash

http://localhost:3000
```
A node server will continue running until you end the session.
You can end the session by pressing `control-X`

## Other Information

* [Manual Setup](doc/manual_setup.md)
* [Branding](doc/branding.md)
* [Optional Features](doc/features.md)
* [Development Notes](doc/developing.md)
* [Configuration](doc/config.md)
* [Third-Party Library Use](THIRD_PARTY.md)


## Contact

Contact us by sending an email to
[support@earthdata.nasa.gov](mailto:support@earthdata.nasa.gov)
