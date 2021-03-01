module.exports = function(RED) {
    "use strict";

    function isEmptyString(value) {
        return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
    }

    function SendURLPush(n) {
        RED.nodes.createNode(this,n);
        const FixedDeviceAddress = n.deviceAddr || "";
        const FixedProtocol = n.protocol || "https";
        const FixedServerAddress = n.serverAddr || "";
        const FixedServerPort = n.serverPort || "";
        const FixedSymbolicName = n.symbolicName || "";

        const node = this;

        this.on("input",function(msg, send, done) {
            node.status({fill:"blue",shape:"yellow",text:"sending push..."});

            const deviceAddr    = msg.deviceAddr || FixedDeviceAddress;
            const protocol      = msg.protocol || FixedProtocol;
            const serverAddr    = msg.serverAddr || FixedServerAddress;
            const serverPort    = msg.serverPort || FixedServerPort;
            const symName       = msg.symbolicName || FixedSymbolicName;
            const contextKey    = msg.serverContextKey || '';
            const contextValue  = msg.serverContextValue || '';

            let error = null;
            if (isEmptyString(protocol) || (protocol !== 'http' && protocol !== 'https')) {
                error = new Error('not a valid server protocol')
            }
            else if (isEmptyString(deviceAddr)) {
                error = new Error('not a valid device address')
            }
            else if (isEmptyString(serverAddr)) {
                error = new Error('not a valid server address')
            }
            else if (typeof serverPort !== 'number' || serverPort < 0 || serverPort > 65535) {
                error = new Error('not a valid server port')
            }
            else if (isEmptyString(symName)) {
                error = new Error('not a valid symbolic name')
            }
            if (error) {
                if (done) {
                    done(error);
                } else {
                    node.error(error, msg);
                }
            }

            msg.method = 'POST';
            msg.url = `https://${deviceAddr}/server_push.html/ServerPush`;
            msg.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            msg.payload = `MidletName=${symName}&ServerProtocol=${protocol}&ServerAddr=${serverAddr}&ServerPort=${serverPort}&ProgramName=${symName}&RequestType=sendURL`;
            if (!isEmptyString(contextKey) && !isEmptyString(contextValue)) {
                msg.payload += `&ServerContextKey=${contextKey}&ServerContextValue=${contextValue}`;
            }

            node.log(`${msg.method} to ${msg.url}`);
            node.log(`payload: ${msg.payload}`);

            send(msg);
            if (done) {
                done();
            }

            setTimeout(function(){
                node.status({});
            }, 2000);
        });
    }

    RED.nodes.registerType("sendurl-push-node",SendURLPush);
}
