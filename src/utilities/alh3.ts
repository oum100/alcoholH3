//Function for alcohol H3
import anyBase from "any-base";
import { H3info, H3model, H3serial, H3record, H3data } from "../models/alh3";

export function hexStringToUint8Array(hexString: string): Uint8Array {
  // Remove any spaces or non-hex characters
  hexString = hexString.replace(/\s/g, "");

  // Check if the hex string has an even length
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }

  // Create a Uint8Array with half the length of the hex string
  const array = new Uint8Array(hexString.length / 2);

  // Fill the array with byte values
  for (let i = 0; i < hexString.length; i += 2) {
    array[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  return array;
}

export function addLeadingZero(num: number) {
  // Convert the number to a string and pad it with a leading zero if necessary
  //   return num < 10 ? `0${num}` : num.toString();
  return String(num).padStart(2, "0");
}


export function createH3data(dataArray: Uint8Array): H3data {

  const data = dataArray.slice(4,4+dataArray[3])
  const checkSum = checksum8mod256(data)
  
  if (checkSum !== dataArray[dataArray.length - 1]) {
    throw new Error('Invalid dataArray: Checksum mismatch');
  }
  
  return {
    header: dataArray.slice(0,2),
    command: dataArray[2],
    dataLen: dataArray[3],
    data: data,
    checkSum: checkSum
  }
   
}

export function checksum8mod256(items: Uint8Array): number {
  const sum = items.reduce((total, value) => {
    return total + value;
  });
  return sum % 256;
}


export function parseUnit(unit:number):string {
  let data_unit = ""
  //Parse unit
  switch (unit) {
    case 0:
      data_unit = "mg/100ml";
      break;
    case 1:
      data_unit = "g/100ml";
      break;
    case 2:
      data_unit = "g/L";
      break;
    case 3:
      data_unit = "%";
      break;
    case 4:
      data_unit = "%.";
      break;
    case 5:
      data_unit = "mg/L";
      break;
    case 6:
      data_unit = "ug/100ml";
      break;
  }

  return data_unit
}

export function parseStatus(status:number):string {
  let result = ''

  switch(status){
    case 0:
      result = '(0)Normal'
      break;
    case 1:
      result = '(1)Drinking'
      break;
    case 2:
      result = '(2)Drunk'
      break;  
  }
  return result
}

export function parseAscii(data: Uint8Array):string{
  let result =''

  // console.log("data ",data)
  for (let i = 0; i < data.length; i++) {
    result = result + String.fromCharCode(data[i]);
  }

  return result
}

export function parseLanguage(data:Uint8Array):string{
  console.log("Data now: ",data)
  return data[2]==0?'Chinese':'English'
}

export function parseMode(data:Uint8Array):string{
  console.log("Data now: ",data)
  return data[3]==0?'Continuous':'Fast'
}

export function parseWord(data:Uint8Array):string{
  //convert 2 byte hex data to decimal
  const dec2hex = anyBase(anyBase.DEC, anyBase.HEX);
  const hex2dec = anyBase(anyBase.HEX, anyBase.DEC);

  let hexStr =''
  data.forEach( (value)=> {
    hexStr = hexStr+dec2hex(String(value)).toString().padStart(2,"0")
  })

  // return parseInt(
  //   dec2hex(String(data[0])) + dec2hex(String(data[1])),
  //   16
  // ).toString()

  return hex2dec(hexStr)

}

export function parseTimestamp(data:Uint8Array):string{
  const dec2hex = anyBase(anyBase.DEC, anyBase.HEX);
  const hex2dec = anyBase(anyBase.HEX, anyBase.DEC);

  let hexStr =''
  data.forEach( (value)=> {
    hexStr = hexStr+dec2hex(String(value)).toString().padStart(2,"0")
  })
 
  return hex2dec(hexStr) // second value
}

