module.exports = function(RED) {
    function SendURLReply(n) {
        RED.nodes.createNode(this,n);
        const LEDstate = n.state || 'OFF';
        const LEDcolour = n.colour || 'GREEN';
        const LEDlabel = n.label || '';
        const LEDsymbolicName = n.symbolicName || '';
        const LEDwake = n.wake || false;

        const node = this;

        this.on('input', function(msg, send, done) {
            node.status({fill:'blue',shape:'yellow',text:'sending reply...'});

            const state = msg.state || LEDstate;
            const colour = msg.colour || LEDcolour;
            const symbolicName = msg.symbolicName || LEDsymbolicName;
            const label = msg.label || LEDlabel;
            const wake = msg.wake || LEDwake;

            const payload = '<Batch>' +
                            '<Capabilities_Req TYPE="ALL_OF">' +
                            '<Capability NAME="XML_LED_STATE_CONTROL" />' +
                            '</Capabilities_Req>' +
                            '<Remote_Control>' +
                            `<Turnled WAKE="${wake === true ? 'true' : 'false'}" ID="${symbolicName}" STATE="${state}" COLOUR="${colour}" LABEL="${label}" />` +
                            '</Remote_Control>' +
                            '</Batch>';

            node.log(payload);

            if (msg.res && msg.res._res) {
                msg.res._res.set('content-type', 'text/xml; charset=utf-8');
                msg.res._res.set('content-length', payload.length);
                msg.res._res.status(200).send(payload);
                node.status({fill:'green',shape:'yellow',text:'reply sent'});
            } else {
                node.status({fill:'red',shape:'yellow',text:'error sending reply'});
            }
            setTimeout(function(){
                node.status({});
            }, 2000);
            done();
        });

        this.on('close',function() {
            node.status({});
        });
    }

    RED.nodes.registerType('sendurl-reply', SendURLReply);
}
