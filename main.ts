
/*
Sensors		         Actuators
Clock		           Controlled fan
Humidity		       IR Grow
Moisture		       UV Grow
Co2	               5 pumps

Sequence #
*/


/* Doesn't work, since maakecode wont allow getlenght
let text = ""
let restArg: number[]
function sendData(actuType: number, ...restArg: number[]){
  for (let i = 0; i < restArg.length; i++) {

    text += ", ";
    text += restArg[i].toString();

  }
  let output = actuType.toString() + "; " + text;
  serial.writeString(output);

}
*/


enum airList {
  //% block="Varmelegeme"
  heater,
  //% block="Blæser"
  fan
  //%block="Ventilation"
}


enum pumpList {
  //% block="Water circulation"
  waterPump,
  //% block="Airation"
  airationPump,
  //% block="External pump 1"
  fert1Pump,
  //% block="External pump 2"
  fert2Pump,
  //% block="External pump 1"
}

enum lightList {
    //% block="Hvidt Lys"
    whiteGrow,
    //% block="Infrarødt Lys"
    irGrow,
    //% block="Ultraviolet Lys"
    uvGrow,
}


// groblocks graphics
//% weight=100 color=#0f9c11 icon="\f06c"
//% groups="['Aktuatore', Sensore']"
namespace groblocks {

// ############################# Init #########################
function init(){
    basic.showString("OK")
    serial.redirect(
    SerialPin.P0,
    SerialPin.P1,
    BaudRate.BaudRate9600
    )

}

//ReceivedData:1|sequence|Humidity|Water_Level|CO2|Temp|Door|;


function readData(index: number): number {
  let readIn = serial.readString();
  let readOut = readIn.split("|");
  let readDisp = readOut[index];

  serial.writeString(readDisp);
  basic.showString(readDisp);
  return parseInt(readDisp);
  }

//Indexing for readData
//let seq = 1;
let hum = 2;
let water = 3;
//let co2 = 4;
let temp = 5
let door = 6;
let clk = 7;

function sendData(actuCat: number, actuType: number, actuSet: number){
  let output = actuCat.toString() + ";" + actuType.toString() + "," + actuSet.toString();
  serial.writeString(output);

}

// actuCat index
let lightCat: number = 0;
let airCat: number = 1;
let pumpCat: number = 2;




// #####################   SENSORS   #################################
//ReceivedData:1|sequence|Humidity|Water_Level|CO2|Temp|Door| clock


  /**
  * Luftfugtighedsmåler 0-100
  */
  //% block
  //% group="Sensore"

  /**
  * Vandstandsmåler 0-100
  */
  //% block
  //% group="Sensore"
  export function Vandstandsmåler(): number {
    let x = readData(water);
  return x ;
  }

  /**
  * CO2-Måler
  */
  //% block
  //% group="Sensore"
  export function co2Sensor(): number {
    let coIn = serial.readString();
    let coOut = coIn.split('|');
    let coDisp = parseInt(coOut[4]);
    serial.writeString(coOut[4]);
  return coDisp;
  }

  /**
 * Temperatursensor
 */
 //% block
 //% group="Sensore"
 export function tempSensor(): number {
   let x = readData(temp);
  return x ;
}

export function Luftfugtighedsmåler(): number {
  let x = readData(hum);
return x ;
}

  /**
 * DoorSensor
 */
 //% block
 //% group="Sensore"
  export function doorSensor(): number {
    let x = readData(door);
  return x;
}

  /**
  * Temperatursensor
  */
  //% block
  //% group="Sensore"
  export function clockSensor(): number {
    let x = readData(clk);
  return x;
}

// ########################  Actuators  ############################

  /**
  * Mock-up Light block
  */
  //% blockId=mockUpLight block="%lightList, Brightness %brightness"
  //% group="Aktuatore"
  export function groLys(lightType: lightList, lightBrigt: number){
    let lT = lightType.toString();
    let lB = lightBrigt.toString();
    let output = "Light" + lT + lB;
    serial.writeString(output);
  }



  /**
  * Aktuatore der håndterer luften i grobotten. Varmelegemet styrer temperaturen osv.
  */
  //% blockId=mockUpActuator block="%actuList| intensitet %randNum"
  //% group="Aktuatore"
  export function setActuator(actu:airList, setting: number){
    sendData(airCat, actu, setting);
  }


  /**
  * Aktuatore der håndterer luften i grobotten. Varmelegemet styrer temperaturen osv.
  */
  //% blockId=mockUpActuator block="%actuList| intensitet %randNum"
  //% group="Aktuatore"
  export function setPump(actu:pumpList, setting: number){
    sendData(pumpCat, actu, setting);
  }




  /**
  * Mock-up timer block
  /
  //% blockId=mockUpTimer block="fra klokken %fra| til klokken %til"
export function setClock(clockFra: number, clcokTil: number){

}






    /**
    * prints string on LEDS and on serial port
    * @param testString string
    */
    //% weight=101 blockGap=8
    //% blockId=testSerialPrint block="Test Serial print: %testString"
    export function testSerialPrint(testString: string) : void {
      basic.showString(testString);
      serial.writeString(testString);
    }


init();


}
