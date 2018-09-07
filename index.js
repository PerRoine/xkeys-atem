var ATEM           = require('atem');
var XKeys          = require('xkeys');
var atem           = new ATEM();
var myXkeysPanel   = new XKeys();
var currentPGM     = null;
var currentPVW     = null;
var pgmMode        = false;
atem.ip = "10.20.30.29";
atem.connect();

atem.on('connectionStateChange', function(state) {
	console.log('state', state);
	myXkeysPanel.setAllBacklights(false,false);
	myXkeysPanel.setAllBacklights(false,true);
	myXkeysPanel.setBacklight(24,true,true);
	myXkeysPanel.setBacklight(24,true,false);
	myXkeysPanel.setBacklight(25,true,false);
	myXkeysPanel.setBacklight(25,true,true);
	myXkeysPanel.setBacklight(26,true,false);
	myXkeysPanel.setBacklight(26,true,true);
	myXkeysPanel.setFrequency(50)
});



source2xkey = {
	1: 5,
	2: 4,
	3: 3,
	4: 2,
	5: 1,
	6: 0,
	7: 13,
	8: 12,
	9: 11,
	10:10,
	3010: 9,
	3020: 8,
	1000: 20,
	0: 21
	};

	atem.on('previewBus', function(source, inTransition) {
		var old_pvw = currentPVW;
		currentPVW = source;
		myXkeysPanel.setBacklight(source2xkey[source],true,false);
		if (old_pvw !== null){
			myXkeysPanel.setBacklight(source2xkey[old_pvw],false,false);
		}

	});

	atem.on('programBus', function(source, inTransition) {
		var old_pgm = currentPGM;
		currentPGM = source;
		myXkeysPanel.setBacklight(source2xkey[source],true,true,true);
		if (old_pgm !== null){
			myXkeysPanel.setBacklight(source2xkey[old_pgm],false,true);
		}

	});

myXkeysPanel.on('down', keyIndex => {
	console.log('Key pressed: '+keyIndex);

	if (keyIndex == 25) atem.auto();

	if (keyIndex == 26) atem.cut();

	if (keyIndex == 'PS') {
		pgmMode = pgmMode ? false : true;
		console.log(pgmMode);
		if (pgmMode == true){
			myXkeysPanel.setLED(1,true)
			myXkeysPanel.setLED(0,false)
		};
		if (pgmMode == false){
			myXkeysPanel.setLED(0,true)
			myXkeysPanel.setLED(1,false)
		};
	};

	for (var atemSource in source2xkey) {
		var xKey = source2xkey[atemSource];
		if (xKey == keyIndex) {

			if (pgmMode == false){
				atem.setPreview(atemSource);
			};

			if (pgmMode == true){
				atem.setProgram(atemSource);
			};
		}
	}
});
