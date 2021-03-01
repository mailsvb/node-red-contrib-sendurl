# node-red-contrib-sendurl
Provides nodes for sending XML responses to a Unify OpenScape Desk Phone CP device SendURL request and Server Push requests sent to the Unify OpenScape Desk Phone CP device.

## Introduction
#### send url reply node
The SendURL FPK of the Unify OpenScape CP phone can be used to send a predefined HTTP/HTTPS GET or POST request in order to trigger a flow in your node-red installation.
This node-red node can be used to pass information back to CP phone (or the user pressing the FPK on the phone).
* The LED state can be on, off, blink or flutter
* The LED colour can be green, yellow or red
* The label of the CP600 FPK can be overwritten
* The CP phone can be waken up from energy saving or screensaver mode

#### send url push node
The SendURL FPK of the Unify OpenScape CP phone can be triggered remotely to update it's status.
This node-red node can be used to trigger the POST request sent to the device, so that the actual SendURL key gets updated.

## Installation
```
npm install node-red-contrib-sendurl
```

## Features
Define the following items for your response either from the node or via the msg object

#### send url reply node
* msg.state will set the LED state to "ON", "OFF", "FLASH" or "FLUTTER"
* msg.colour will set the LED to one of "GREEN", "YELLOW" or "RED"
* msg.id should contain the symbolic name of the configured FPK
* msg.wake will wake up the device from screensaver mode or energy saving mode when set to "TRUE"
* msg.label will overwrite the current FPK label on a CP600 model

#### send url push node
* msg.deviceAddr will be used as the target address to sent the POST request to
* msg.protocol needs to be set according to the protocol configured for the SendURL key, either "http" or "https"
* msg.serverAddr needs to be set according to the server address configured for the SendURL key.
* msg.serverPort needs to be set according to the server port configured for the SendURL key.
* msg.symbolicName needs to be set according to the symbolic name configured for the SendURL key.
