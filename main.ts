//Auth

/*
enum airList {
  //% block="Varmelegeme"
  heater,
  //% block="Indre Blæser"
  fan
}
*/

//TEEST GIT TEST GIT
enum pumpList {
  //% block="Luftudskiftning"
  airationPump,
  //% block="Ekstern pumpe 1"
  fert1Pump,
  //% block="Ekstern pumpe 2"
  fert2Pump,
  //% block="Luftsten"
  waterPump,
}

enum lightList {
    //% block="Hvidt lys"
    whiteGrow,
    //% block="Infrarødt lys"
    irGrow,
    //% block="Ultraviolet lys"
    uvGrow,
}

let bufboi = [0, 0, 0, 0, 0, 0901, 0]; //buffboi int atm
let wState = 0; // Stores the desiered setting for WhiteLight
let bState = 0;
let rState = 0;
 //killWhite acts as a microbit persistance function
//If MB is lost, Ardu will look for rule on white light first. kW returns settig to desired 



// groblocks graphics
//% weight=100 color=#0f9c11 icon="\uf06c"
//% groups="['Aktuatorer', Sensorer']"
namespace groblokke {

  //#########################    INITILIZATION   #########################

function init(){
    serial.redirect(
    SerialPin.P0,
    SerialPin.P1,
    BaudRate.BaudRate9600
  );
  pins.digitalWritePin(DigitalPin.P2, 1);
  basic.showString("v3");
  }

//#########################    END INITILIZATION   #########################


//#########################    SENSORS    #########################

//ReceivedData:1|sequence|Humidity|Water_Level|CO2|Temp|Door| clock
//Indexing for readData
let hum = 0;
let water = 1;
let CO2 = 2;
let temp = 3;
//let door = 4;
let clk = 5;


  //% group="Sensorer"
    /**
    * Luftfugtighedsmåler 0-100 procent
    */
    //% block
  export function Luftfugtighed(): number {
    return bufboi[hum];
  }

  /**
  * Vandstandsmåler
  */
  //% block
  //% group="Sensorer"
  export function Vandstand(): number {
    return bufboi[water];
  }

  /**
  * CO2-Måler ppm
  */
  //% block
  //% group="Sensorer"
  export function co2(): number {
    return bufboi[CO2];
  }
  /**
 * Temperatursensor
 */
 //% block
 //% group="Sensorer"
 export function temperatur(): number {
  return bufboi[temp];
}


  /**
  * Klokken i 24 timersformat. Blokken fjerner foranstillede nuller. Dvs klokken 0800 forstås 800. Der må kun være tal i Tidsblokken dvs ingen 21:00 osv.
  */
  //% block
  //% group="Sensorer"
  export function tid(): number {
    return bufboi[clk];
}
//#########################    END SENSORS    #########################

//#########################    ACTUATORS    #########################
/*Indexing actuators
a,white,
b,uv,
c,ir
d,fert
e,water
f,air
g,changeAIR
h,heater
i,fan
j,time
*/
  /**
  * Angiv hvor intenst lyset skal være på en skala 0 til 100 procent
  */
  //% blockId=mockUpLight block="Lysstyrken for %lightList til %brightness"
  //% group="Aktuatorer"
  //% lightBrigt.min=0 lightBrigt.max=100
  export function groLys(lightType: lightList, lightBrigt: number){
    let lB = lightBrigt.toString();
    if (lightType == 0){
      let output = "a:" + lB + "|x";
      
      serial.writeString(output);
      
      if (wState == lightBrigt){
        basic.pause(1000);
      }
      
      wState = lightBrigt;
    
      
    } else if (lightType == 1){
      let output = "b:" + lB + "|x";
      
      if (bState == lightBrigt){
        basic.pause(1000);
      }
      bState = lightBrigt;
      serial.writeString(output);
    
    } else if (lightType == 2){
        let output = "c:" + lB + "|x";
        if (rState == lightBrigt){
          basic.pause(1000);
        }
        rState = lightBrigt;
        serial.writeString(output);
       
  }
}

/**
*Angiv hvor meget flow du ønsker i mililiter per time.
*/
//% blockId=pumpeActu block="Sæt %pumpList til %randNum mL/t"
//% group="Aktuatorer"
export function setPump(actu:pumpList, setting: number){
  let set = setting.toString();
  if (actu == 0){
    let output = "d:" + set + "|x";
    serial.writeString(output);
  }
 else if (actu == 1){
    let output = "e:" + set + "|x";
    serial.writeString(output);
  }
  else if (actu == 2){
     let output = "f:" + set + "|x";
     serial.writeString(output);
   }
   else if (actu == 3) {
      let output = "g:" + set + "|x";
      serial.writeString(output);
    }
 }

 /**
 *Angiv størrelsen på enkeltdosis i mL.
 */
 //% blockId=pumpeburst block="Dosér %randNum mL fra %pumpList"
 //% group="Aktuatorer"
 export function burstPump(setting: number, actu:pumpList){
   let set = setting.toString();
   if (actu == 0){
     let output = "j:" + set + "|x";
     serial.writeString(output);
   }
  else if (actu == 1){
     let output = "k:" + set + "|x";
     serial.writeString(output);
   }
   else if (actu == 2){
      let output = "l:" + set + "|x";
      serial.writeString(output);
    }
    else if (actu == 3) {
       let output = "m:" + set + "|x";
       serial.writeString(output);
     }
  }

  /**
  * Angiv den ønskede temperatur i vækstkammeret i celcius
  * NB. Den indre blæser kører altid når varmelegemet er tændt
  */
  //% blockId=airActu block="Opvarm til %randNum °C"
  //% group="Aktuatorer"
  //% setting.min=0 setting.max=40
  /*
  export function setHeat(setting: number){
    let set = setting.toString();
      let output = "h:" + set + "|x";
      serial.writeString(output);
  }
  */
  

  /**
  * Angiv om den indre blæser skal være tændt eller slukket. Værdien 0 er slukket
  * mens 1 er tændt. NB. Blæseren kører altid når varmelegemet er tændt
  */
  //% blockId=internalFan block="Blæser Sluk/Tænd %randNum"
  //% group="Aktuatorer"
  //% setting.min=0 setting.max=1
  /*
  export function fan(setting: number){
    let set = setting.toString();
    let output = "i:" + set + "|x";
    serial.writeString(output);
    }
    */
  //#########################    END ACTUATORS    #########################


  //#########################    DEBUG FUNCTIONS    #########################
let timeString = "N/A";
let fakeTime = 0801;
let fakeTimeString = "0801";
/**
*Display data buffer contents
*/
//% block
//% group="xDebug"
//% advanced=true
  export function fakeTimeFunction(): number{
    return fakeTime;
  }

  /**
  *Display data buffer contents
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function fakeTimeParsedAsInt(): number{
    return parseInt(fakeTimeString);
  }
  /**
  *Display data buffer contents
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function dispDataBuffer(){

    basic.showString("A"); //First string from ardu
    basic.pause(1000);
    basic.showNumber(bufboi[0]); //Hum - Luftfugtighed
    basic.pause(1000);
    basic.showNumber(bufboi[1]); // Water level
    basic.pause(1000);

    basic.showString("B"); //Second string from ardu
    basic.pause(1000);
    basic.showNumber(bufboi[2]); //CO2
    basic.pause(1000);
    basic.showNumber(bufboi[3]); //Temp
    basic.pause(1000);

    basic.showString("C"); //Third string from ardu
    basic.pause(1000);
    basic.showNumber(bufboi[4]); //Door
    basic.pause(1000);
    basic.showNumber(bufboi[5]); //Clock
    basic.pause(1000);
  }

  /**
  * Runs all actuators as a test
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function runActuators(){

    groLys(0,100);  //White light
    basic.pause(2000);
    groLys(0,0);
    basic.pause(500);
    groLys(1,100); //IR Light
    basic.pause(2000);
    groLys(1,0);
    basic.pause(500);
    groLys(2,100);  //UV Light
    basic.pause(2000);
    groLys(2,0);

    basic.pause(1000);

    //basic.showString("P"); // Pumps not checked
    burstPump(0,100); //Water pump
    basic.pause(2000);
    burstPump(1,100); //airationPump
    basic.pause(2000);
    burstPump(2,100); //External pump 1
    basic.pause(2000);
    burstPump(3,100); // External pump 2
    basic.pause(2000);
    
    /*
    //basic.showString("H");
    setHeat(40);
    basic.pause(2000);
    //setHeat(0,0);
    //setHeat(1,0);
    basic.showString("E");
    */
  }

  /**
  * Runs all lights seqenctially
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function calibrateLight(){
    //Run White at 25, 50 and 100
    groLys(0,25);  //White light
    basic.pause(2000);
    groLys(0,50);
    basic.pause(2000);
    groLys(0,100);
    basic.pause(2000);
    groLys(0,0);
    basic.pause(3000);

    groLys(1,25); //IR Light
    basic.pause(2000);
    groLys(1,50);
    basic.pause(2000);
    groLys(1,100);
    basic.pause(2000);
    groLys(1,0);
    basic.pause(3000);

    groLys(2,25); //UV Light
    basic.pause(2000);
    groLys(2,50);
    basic.pause(2000);
    groLys(2,100);
    basic.pause(2000);
    groLys(2,0);
    basic.pause(3000);

    groLys(0,100); //Test White/IR
    basic.pause(200);
    groLys(1,100);
    basic.pause(2000);
    groLys(0,0);
    basic.pause(200);
    groLys(1,0);
    basic.pause(3000);

    groLys(0,100); //Test White/UV
    basic.pause(200);
    groLys(2,100);
    basic.pause(2000);
    groLys(0,0);
    basic.pause(200);
    groLys(2,0);
    basic.pause(3000);

    groLys(1,100); //Test IR/UV
    basic.pause(200);
    groLys(2,100);
    basic.pause(2000);
    groLys(1,0);
    basic.pause(200);
    groLys(2,0);
    basic.pause(3000);

    groLys(0,100);
    basic.pause(200);
    groLys(1,100); //Test all channels
    basic.pause(200);
    groLys(2,100);
    basic.pause(5000);
    groLys(1,0);
    basic.pause(200);
    groLys(2,0);
    basic.pause(200);
    groLys(0,0);
    basic.pause(3000);

  }
  /**
  * Adds 5 deg per 15 minutes for an hour and stops
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  /*
export function heatStairs(){
  let stepCount = [0,0,0] //snapshot time, currTime
  let flag = 0;
  let flag2 = 0;
  basic.showString("Init Heatstairs")
  basic.pause(10000);
  stepCount[1]=bufboi[5];
  if (flag == 0) {
    stepCount[0]=bufboi[5];
    flag = 1;
  } else if (stepCount[1]-stepCount[0] >= 15) {
    setHeat(bufboi[3]+5);
  } else if (stepCount[1]-stepCount[0] >= 30) {
    setHeat(bufboi[3]+10);
  } else if (stepCount[1]-stepCount[0] >= 45) {
    setHeat(bufboi[3]+15);
  } else if (stepCount[1]-stepCount[0] >= 60) {
    setHeat(bufboi[3]+20);
    flag2 = 1;
  }
  }
*/







  /**
  * Displays time as a string
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function timeAsString(){
    let readIn = serial.readString();
    let inSplit = readIn.split('|');
    if (inSplit[0] == "c") {
      timeString = inSplit[2];
    }
    basic.showString(timeString);
    bufboi[5] = parseInt(inSplit[2]);
  }


    /**
    * prints string on LEDS and on serial port
    * @param testString string
    */
    //% weight=101 blockGap=8
    //% blockId=testSerialPrint block="Test Serial print: %testString"
    //% group="xDebug"
    //% advanced=true
    export function testSerialPrint(testString: string) : void {
      basic.showString(testString);
      serial.writeString(testString);
    }
  //#########################   END DEBUG FUNCTIONS    #########################

//Calls the initilization function to run on startup
init();

}//Ends namespce
/////////////////////////////////     END OF GROBLOCKS NAMESPACE      /////////////////////////////////



/////////////////////////////////     START OF INBACKGROUND NAMESPACE      /////////////////////////////////

control.inBackground(function () {

  function sensData(){
    let readIn = serial.readString();
    let inSplit = readIn.split('|');
    if (inSplit[0] == "a") {
      bufboi[0] = parseInt(inSplit[1]);
      bufboi[1] = parseInt(inSplit[2]);

    } else if (inSplit[0] == "b") {
      bufboi[2] = parseInt(inSplit[1]);
      bufboi[3] = parseInt(inSplit[2]);

    } else if (inSplit[0] == "c") {
      bufboi[4] = parseInt(inSplit[2]);
      bufboi[5] = parseInt(inSplit[2]);
    } 
  }
 
  //function killWhite(){
  //  serial.writeString( "a:" + whiteState + "|x");
  //}
  

while(true){
  sensData();
  basic.pause(100);
  //killWhite();
  //basic.pause(100);
}

})
