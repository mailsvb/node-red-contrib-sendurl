module.exports = function(RED) {
    "use strict";

    function XMLReply(n) {
        RED.nodes.createNode(this,n);
        var LEDstate = n.state || "OFF";
        var LEDcolour = n.colour || "GREEN";
        var LEDlabel = n.label || "";
        var LEDid = n.id || "";
        var LEDwake = n.wake || false;
        
        var node = this;

        this.on("input",function(msg) {
            if (!msg.res) {
                node.status({fill:"red",shape:"dot",text:"no msg.res object available"});
                return;
            }
            
            node.status({fill:"blue",shape:"yellow",text:"sending reply..."});
            
            var state   = msg.state || LEDstate;
            var colour  = msg.colour || LEDcolour;
            var id      = msg.id || LEDid;
            var label   = msg.label || LEDlabel;
            var wake    = msg.wake || LEDwake;
            
            (wake) ? wake = "true" : wake = "false";
            
            var output =    '<Batch>' +
                            '<Capabilities_Req TYPE="ALL_OF">' +
                            '<Capability NAME="XML_LED_STATE_CONTROL" />' +
                            '</Capabilities_Req>' +
                            '<Remote_Control>' +
                            '<Turnled WAKE="' + wake + '" ID="' + id + '" STATE="' + state + '" COLOUR="' + colour + '" LABEL="' + label + '" />' +
                            '</Remote_Control>' +
                            '</Batch>';
            
            msg.res.append('Content-Type', 'text/xml; charset=utf-8');
            msg.res.status(200).send(output);
            
            setTimeout(function(){
                node.status({});
            }, 2000);
        });
    }

    RED.nodes.registerType("sendurl-node",XMLReply);
}
