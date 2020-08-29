# MSFS 2020 WebUI DevKit

This devkit is a mod and guidance for easier development of WebUI (Panels, MFD..) in Microsoft Flightsimulator 2020.

The goal is to make the process of developing UIs in MSFS as painless as possible with more stuff to come.

## Features
* Hotreload HTML/CSS/JS changes without restarting the sim or flight
* View console.log output in the game
* Action buttons
* _[TODO] Devtool like debugging UI_
* _[TODO] Configurable Livereload_
* _[TODO] Load content from local webserver_
* ...

<img src="https://i.imgur.com/9P2kHUF.png" width="250" style="margin-left:30px">&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/V2Dl6bs.png" width="250" style="margin-left:30px"></img>

## Installation

* Download the latest zip release [here](https://github.com/dga711/msfs-webui-devkit/releases).
* Extract the "WebUi-Devkit" folder to the _community_ folder in your MSFS installation


## Usage

### Part 1: The code

To show the debugging UI in the panel/mfd of your choice you should put this code into the corresponding JS file (_init()_ or end of _connectedcallback()_ method works well)
```        
if (g_modDebugMgr) {
    g_modDebugMgr.AddConsole(null);
}
```
With the undefined-check in place you don't have to worry it will crash on people who don't have the DevKit in their installation.

**Tip**: To show the UI on all screens on all planes, put the code in the _connectedCallback()_ method of the _NavSystem_ class in the _NavSystems.js_

### Part 2: The ingame UI
In game, on any panel where you activated the code, it should show an opaque UI Element in the top right corner.

![](https://i.imgur.com/gw90Lmk.png)

Press on the "R" button to refresh the HTML Content of the panel.  
Press "X" to show the console output.

**Important**: To be able to click on it on cockpit panels you have to bind the "New UI Window Mode" key. Then press that key and click on a glass panel. It will pop out in a window.

### Part 3: Console Logging
In the JS corresponding to the activated panel, any `console.log()` output should show up in the console panel in game.

### Part 4: Action Buttons
```g_modDebugMgr.AddDebugButton("InsertTitleHere", function() {dosomething});```
This will show a button in the open debug UI which executes the function when clicked.


## Known Limitations

* On some FMC screens it might break the page layout and the content shifts UP for a few pixels. While not nice, its ok for development.
* Sometimes seems to fail refresh of sources no matter what you do.

## Contributing
Pull requests and further information on the insides are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
