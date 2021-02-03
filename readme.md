# MSFS 2020 WebUI DevKit

This devkit is a mod and guidance for easier development of WebUI (Panels, MFD..) in Microsoft Flightsimulator 2020.

The goal is to make the process of developing UIs in MSFS as painless as possible with more stuff to come.

### **⚠️ The init code changed with version 0.9.0, check the Usage section**

## Features
* Hotreload HTML/CSS/JS changes without restarting the sim or flight
* View console.log output in game
* Console input field to directly run JS commands
* Action buttons
* Basic HTML inspector
* Panel FPS counter
* _[TODO] Devtool like debugging UI_ / see [devtools-backend-refurb](https://github.com/dga711/devtools-backend-refurb)
* _[TODO] Load content from local webserver_
* ...

<img src="https://i.imgur.com/YZdhMiA.gif" width="250" style="margin-left:30px">&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/XC7l5mu.png" width="250" style="margin-left:30px"></img>&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/DoIzpuK.png" width="250" style="margin-left:30px">

### Hotkeys
* ALT + T = Show/Hide Panel
* ALT + R = Reload page
* ALT + X = Run JS command

## Installation

* Download the latest zip release [here](https://github.com/dga711/msfs-webui-devkit/releases).
* Extract the "msfs-webui-devkit" folder to the _community_ folder in your MSFS installation  
_or_  
* Clone the repo into your _community_ folder


## Usage

### Part 1: The code

### **⚠️ This changed with version 0.9.0. Get rid of the former initialization code and follow the instructions below**

To show the debugging UI in the panel/mfd of your choice you should put this code into the corresponding HTML file of the instrument or page.

**⚠️ It must come after the script-tag for _common.js_**
```        
<script type="text/javascript" src="/JS/debug.js"></script>
```
<img src="https://i.imgur.com/92KI7bM.png" width="350">

**Tip**: To show the UI on all screens on all planes, put the script tag into _Official\OneStore\asobo-vcockpits-core\html_ui\Pages\VCockpit\Core\VCockpit.html_
### Part 2: The ingame UI
In game, on any panel where you activated the code, it should show an opaque UI Element in the top right corner.

![](https://i.imgur.com/gw90Lmk.png)

Press on the "R" button to refresh the HTML Content of the panel.  
Press on the "C" button to clear the console log.
Press "X" to show the console output.

**Important**: To be able to click on it on cockpit panels you have to bind the "New UI Window Mode" key in MsFs. Then press that key and click on a glass panel. It will pop out in a window.

### Part 3: Console Logging
In the JS corresponding to the activated panel, any `console.log()` output should show up in the console panel in game.

### Part 4: Console Input
At the bottom of the debug panel is an input field. You can run JS commands here like ```console.log("test")``` and run them by clicking the "->" button or pressing ALT+X

### Part 5: Action Buttons
```g_modDebugMgr.AddDebugButton("InsertTitleHere", function() {dosomething});```
This will show a button in the open debug UI which executes the function when clicked.


## Known Limitations

* Sometimes seems to fail refresh of sources no matter what you do.   
HTML/CSS usually always refreshes. When it fails for JS for you, a workaround would be to add a querystring to the import in the HTML file of the panel to bust the cache. Ofc I will work on ways to make this obsolete.

## Contributing
Pull requests and further information on the insides are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dga711"><img src="https://avatars0.githubusercontent.com/u/2995606?v=4" width="80px;" alt=""/><br /><sub><b>dga711</b></sub></a><br /><a href="#ideas-naorunaoru" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/dga711/msfs-webui-devkit/commits?author=dga711" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Smirow"><img src="https://avatars1.githubusercontent.com/u/16503412?v=4" width="80px;" alt=""/><br /><sub><b>Smirow</b></sub></a><br /><a href="https://github.com/dga711/msfs-webui-devkit/issues?q=is%3Aissue+author%3ASmirow" title="Bug reports">🐛</a> <a href="https://github.com/dga711/msfs-webui-devkit/commits?author=Smirow" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/knighty"><img src="https://avatars3.githubusercontent.com/u/1693684?v=4" width="80px;" alt=""/><br /><sub><b>Knighty</b></sub></a><br /><a href="https://github.com/dga711/msfs-webui-devkit/commits?author=knighty" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/kaosfere"><img src="https://avatars3.githubusercontent.com/u/235912?v=4" width="80px;" alt=""/><br /><sub><b>kaosfere</b></sub></a><br /><a href="https://github.com/dga711/msfs-webui-devkit/commits?author=kaosfere" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
[MIT](https://choosealicense.com/licenses/mit/)
