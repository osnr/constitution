/* @flow */

var halfAdder = function(a, b, s, c) {
    var d = makeWire();
    var e = makeWire();

    /* orGate(a, b, d);
       andGate(a, b, c);
       inverter(c, e);
       andGate(d, e, s); */

    return 'ok';
};

var makeWire = function() {
    var signalValue = 0;
    var actionProcedures = [];

    var setMySignal = function(newValue) {
        if (signalValue != newValue) {
            signalValue = newValue;
            actionProcedures.forEach(function(proc) { proc(); });
            return 'done';
        }
        return 'done';
    };

    var acceptActionProcedure = function(proc) {
        actionProcedures.unshift(proc);
        proc();
    };

    var dispatch = function(m) {
        if (m == 'get-signal') {
            return signalValue;

        } else if (m == 'set-signal!') {
            return setMySignal;

        } else if (m == 'add-action!') {
            return acceptActionProcedure;
        }

        throw ['Unknown operation - WIRE', m];
    };

    return dispatch;
}

var getSignal = function(wire) {
    wire('get-signal');
}

var setSignal = function(wire, newValue) {
    wire('set-signal!')(newValue);
}

var addAction = function(wire, actionProcedure) {
    wire('add-action!')(actionProcedure);
}


