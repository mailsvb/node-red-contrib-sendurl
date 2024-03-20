module.exports = function(RED) {
    const https = require('node:https');
    function isEmptyString(value) {
        return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
    }

    function SendURLPush(n) {
        RED.nodes.createNode(this,n);
        const FixedDeviceAddress = n.deviceAddr || '';
        const FixedProtocol = n.protocol || 'https';
        const FixedServerAddress = n.serverAddr || '';
        const FixedServerPort = parseInt(n.serverPort) || 443;
        const FixedSymbolicName = n.symbolicName || '';

        const node = this;

        this.on('input',function(msg, send, done) {
            node.status({fill:'blue',shape:'yellow',text:'sending push...'});

            const deviceAddr    = msg.deviceAddr || FixedDeviceAddress;
            const protocol      = msg.protocol || FixedProtocol;
            const serverAddr    = msg.serverAddr || FixedServerAddress;
            const serverPort    = parseInt(msg.serverPort) || FixedServerPort;
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
                node.status({fill:'red',shape:'yellow',text:error.message});
                done(error);
                return;
            }
            let payload = `MidletName=${symName}&ServerProtocol=${protocol}&ServerAddr=${serverAddr}&ServerPort=${serverPort}&ProgramName=${symName}&RequestType=sendURL`;
            if (!isEmptyString(contextKey) && !isEmptyString(contextValue)) {
                payload += `&ServerContextKey=${contextKey}&ServerContextValue=${contextValue}`;
            }
            const options = {
                rejectUnauthorized: false,
                hostname: deviceAddr,
                port: 443,
                path: '/server_push.html/ServerPush',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': payload.length,
                },
            };
                
            const req = https.request(options, (res) => {
                res.on('end', () => {
                    node.status({fill:'green',shape:'green',text:'Request sent'});
                });
            });
                
            req.on('error', (error) => {
                node.log(`problem with request: ${error.message}`);
                node.status({fill:'red',shape:'yellow',text:error.message});
            });
            req.write(payload);
            req.end();
            setTimeout(function(){
                node.status({});
            }, 2000);
            done();
        });
    }

    RED.nodes.registerType('sendurl-push', SendURLPush);
}
