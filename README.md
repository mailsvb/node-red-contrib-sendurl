# node-red-contrib-sendurl
Provides a node for sending XML responses to a Unify OpenScape CP phone SendURL request

## Introduction
The SendURL FPK of the Unify OpenScape CP phone can be used to send a predefined HTTP/HTTPS GET or POST request in order to trigger a flow in your node-red installation.
This node-red node can be used to pass information back to CP phone (or the user pressing the FPK on the phone).
* The LED state can be on, off or blink
* The LED colour can be green, amber or red
* The label of the CP600 FPK can be overwritten
* The CP phone can be waken up from energy saving or screensaver mode

## Installation
```
npm install node-red-contrib-sendurl
```

## Features
Define the following items for your response either from the node or via the msg object

* msg.state will set the LED state to "ON", "OFF" or "FLASH"
* msg.colour will set the LED to one of "GREEN", "AMBER" or "RED"
* msg.id should contain the symbolic name of the configured FPK
* msg.wake will wake up the device from screensaver mode or energy saving mode when set to "TRUE"
* msg.label will overwrite the current FPK label on a CP600 model
