///<reference path="./ractive.d.ts"/>
var ractive;
$(function () {
    ractive = new Ractive({
        el: '#container',
        template: '#template',
        data: {
            apiKey: '',
            token: '',
            msg: '',
            entries: []
        }
    });
    ractive.on({
        add: function () {
            ractive.push('entries', {
                key: '',
                value: '',
                type: '1'
            });
        },
        remove: function (e, index) {
            ractive.splice('entries', index, 1);
        },
        submit: function () {
            submit();
        }
    });
    console.log('done');
});
function submit() {
    var apiKey = ractive.get('apiKey');
    var token = ractive.get('token');
    var entries = ractive.get('entries');
    var data = toData(entries);
    // input check
    if (apiKey.length == 0) {
        addMessage('Please input Server API Key');
        return;
    }
    if (token.length == 0) {
        addMessage('Please input registration token');
        return;
    }
    var json = {
        data: data,
        to: token
    };
    createRequest(apiKey, json);
}
function toData(entries) {
    var data = {};
    for (var i = 0; i < entries.length; ++i) {
        var key = entries[i].key;
        var value = entries[i].value;
        if (key.length == 0) {
            continue;
        }
        switch (entries[i].type) {
            case '0':
                data[key] = value;
                break;
            case '1':
                var tmpNum = Number(value);
                data[key] = isNaN(tmpNum) ? 0 : tmpNum;
                break;
            case '2':
                data[key] = (value == 'true');
                break;
            default:
                data[key] = value;
                break;
        }
    }
    return data;
}
function createRequest(apiKey, json) {
    addMessage("curl -v -X POST -H 'Content-Type:application/json' " +
        "-H 'Authorization:key=" + apiKey + "' " +
        "https://gcm-http.googleapis.com/gcm/send " +
        "-d '" + JSON.stringify(json) + "'");
}
function addMessage(msg) {
    ractive.set('msg', ractive.get('msg') + "\n" + msg);
}
