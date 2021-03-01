module.exports = function(RED) {
    "use strict";

    function SendURLReply(n) {
        RED.nodes.createNode(this,n);
        const LEDstate = n.state || "OFF";
        const LEDcolour = n.colour || "GREEN";
        const LEDlabel = n.label || "";
        const LEDid = n.id || "";
        const LEDwake = n.wake || false;

        const node = this;

        this.on("input",function(msg, send, done) {
            node.status({fill:"blue",shape:"yellow",text:"sending reply..."});

            const state   = msg.state || LEDstate;
            const colour  = msg.colour || LEDcolour;
            const id      = msg.id || LEDid;
            const label   = msg.label || LEDlabel;
            let wake      = msg.wake || LEDwake;

            (wake) ? wake = "true" : wake = "false";

            msg.payload = '<Batch>' +
                          '<Capabilities_Req TYPE="ALL_OF">' +
                          '<Capability NAME="XML_LED_STATE_CONTROL" />' +
                          '</Capabilities_Req>' +
                          '<Remote_Control>' +
                          '<Turnled WAKE="' + wake + '" ID="' + id + '" STATE="' + state + '" COLOUR="' + colour + '" LABEL="' + label + '" />' +
                          '</Remote_Control>' +
                          '</Batch>';

            node.log(msg.payload);

            msg.headers = {
                'Content-Type': 'text/xml; charset=utf-8',
                'Content-Size': msg.payload.length
            };
            msg.statusCode = 200;
            send(msg);
            if (done) {
                done();
            }

            setTimeout(function(){
                node.status({});
            }, 2000);
        });
    }

    RED.nodes.registerType("sendurl-reply-node",SendURLReply);
}
