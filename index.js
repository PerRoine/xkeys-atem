var ATEM					 = require('atem');
var XKeys 			   = require('xkeys');
var atem   			   = new ATEM();
var myXkeysPanel	 = new XKeys();
var currentPGM     = null;
var currentPVW     = null;

atem.ip = "10.0.1.240";
atem.connect();

atem.on('connectionStateChange', function(state) {
  console.log('state', state);
  myXkeysPanel.setAllBacklights(false,false);
  myXkeysPanel.setAllBacklights(false,true);
  myXkeysPanel.setFrequency(50)
});



source2xkey = {
    0: 5,
		1: 4,
		2: 3,
		3: 2,
		4: 1,
		5: 0,
		6: 13,
		7: 12,
		8: 11,
		3010: 10,
		3020: 9,
		1000: 8
	};

  atem.on('previewBus', function(source, inTransition) {
    var old_pvw = currentPVW;
    currentPVW = source;
    console.log('prw source', source);
    console.log('prw button',source2xkey[source]);
    console.log('old prw source',old_pvw);
    myXkeysPanel.setBacklight(source2xkey[source],true,false);
    if (old_pvw !== null){
    myXkeysPanel.setBacklight(source2xkey[old_pvw],false,false);
    }

  });

  atem.on('programBus', function(source, inTransition) {
    var old_pgm = currentPGM;
    currentPGM = source;
    console.log('pgm source', source);
    console.log('pgm button',source2xkey[source]);
    console.log('old pgm source',old_pgm);
    myXkeysPanel.setBacklight(source2xkey[source],true,true,true);
    if (old_pgm !== null){
    myXkeysPanel.setBacklight(source2xkey[old_pgm],false,true);
    }

  });

myXkeysPanel.on('down', keyIndex => {
  console.log('Key pressed: '+keyIndex);

  if (keyIndex == 25) atem.auto();

  if (keyIndex == 26) atem.cut();

  else {
    for (var atemSource in source2xkey) {
      var xKey = source2xkey[atemSource];
      if (xKey == keyIndex) {
  atem.setPreview(atemSource);
      }
    }
  };

  });


/*
  self.currentPGM = null;
	self.currentPVW = null;

  self.myXkeysPanel.setAllBacklights(false, false)
  self.myXkeysPanel.setAllBacklights(true, false)
  self.myXkeysPanel.setBacklight(24, true, true);
  self.myXkeysPanel.setBacklight(25, true, true);
  self.myXkeysPanel.setBacklight(26, true, true);
  self.atem.connect();


  // Incoming event when connection state changes on ATEM
  self.atem.on('connectionStateChange', function(state) {
    console.log("connectionStateChange()",state);
    if (state.description == 'connected') self.connected = true;
  });


  // Incoming event when connection to ATEM is lost
  self.atem.on('connectionLost', function() {
    console.log('connectionLost(): reconnecting');
    self.connected = false;
    self.atem.connect();
  }
};
*/
