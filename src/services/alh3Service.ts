import express from "express";
import { Request, Response } from "express";
import { validateRequest } from "../models/alh3";
import {
  H3data,
  H3info,
  H3lastRec,
  H3lastSetTime,
  H3model,
  H3record,
  H3report,
  H3serial,
  H3status,
} from "../models/alh3";
import {
  hexStringToUint8Array,
  checksum8mod256,
  createH3data,
  parseAscii,
  parseLanguage,
  parseMode,
  parseStatus,
  parseTimestamp,
  parseUnit,
  parseWord,
  addLeadingZero,
} from "../utilities/alh3";
// import * as h3Func from '../utilities/alh3'

export const parseALH3 = async (req: Request, _: Response) => {
  const { error } = validateRequest(req.body);

  if (error) {
    return error?.details[0].message;
  }

  try {
    //Create Dec Array
    const { hexstr } = req.body;
    const result = hexStringToUint8Array(hexstr);
    const decArray = Array.from(result);
    const hexArray = Array.from(result, (byte) =>
      byte.toString(16).padStart(2, "0")
    );

    //Getting data part
    const h3data = createH3data(result);

    //Getting command code
    const command = h3data.command;

    // let tempValue: string = "";

    switch (command) {
      case 1: //Get Connection Status
        //Testing hex:  BCFD01010000 (failure),  BCFD01010101 (success)
        const status: H3status = {
          hexStr: hexstr,
          command: String(h3data.command),
          status: String(h3data.data[0] == 0 ? "Failure" : "Success"),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: status,
        };
        break;

      case 2: //Get Device Info
        //Test hex: BCFD0205016400010066

        const info: H3info = {
          hexStr: hexstr,
          command: String(h3data.command),
          version: h3data.data[0].toString(),
          battery: h3data.data[1].toString(),
          language: parseLanguage(h3data.data),
          testMode: parseMode(h3data.data),
          unit: parseUnit(h3data.data[4]),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: info,
        };

      case 3: //Get Device Model
        //Test hex: BCFD03066d6f64656c596A   result: modelY

        const model: H3model = {
          hexStr: hexstr,
          command: String(h3data.command),
          model: parseAscii(h3data.data),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: model,
        };
        break;

      case 4: //Get Device Serial Number
        //Testing hex: BCFD040C59474b4a3232303730303031C1   result: YGKJ22070001

        const serial: H3serial = {
          hexStr: hexstr,
          command: String(h3data.command),
          serial: parseAscii(h3data.data),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: serial,
        };
        break;

      case 5: //Get latest setting time
        //Testing hex: BCFD050468DF3C30B3
        //Timestamp: 1759460400
        //Time: 10/3/2025, 10:00:00 AM

        const timeHere: string = parseTimestamp(h3data.data); //Return second value

        // const msec = Date.parse('10/03/2025 10:00:00')
        // const timeH = new Date(1759460400*1000).toLocaleString()
        // console.log("msec:", msec)
        // console.log("timeH: ", timeH)

        const lastSet: H3lastSetTime = {
          hexStr: hexstr,
          command: String(h3data.command),
          timeInSecond: timeHere, //second value
          lastSet: new Date(parseInt(timeHere) * 1000).toLocaleString(),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: lastSet,
        };
        break;

      case 6: //Get latest record id
        //Test hex: BCFD060203E8EB

        const lastRec: H3lastRec = {
          hexStr: hexstr,
          command: String(h3data.command),
          recordID: parseWord(h3data.data),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: lastRec,
        };
        break;

      case 9: //Get Result testing
        //Test hex: BCFD090600001400004B5F

        const report: H3report = {
          hexStr: hexstr,
          command: String(h3data.command),
          status: parseStatus(h3data.data[0]),
          value: parseInt(
            h3data.data[1].toString(16) + h3data.data[2].toString(16),
            16
          ).toString(),
          unit: parseUnit(h3data.data[3]),
          record: parseInt(
            h3data.data[4].toString(16) + h3data.data[5].toString(16),
            16
          ).toString(),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: report,
        };

        break;

      case 17: //parseRecord
        //Test hex: BCFD110E0A201902160A3B05000431352E306D (522,22/02/25,10:59:05,0,15.0)
        //Test hex: BCFD110E4A001902160A3B050604302E30308D
        //Record:74
        //Date: 22/02/25
        //Time: 10:59:05
        //Unit: 06  ug/100mL
        //Value: 0.00

        //Prepare parseRecord
        const record: H3record = {
          hexStr: hexstr,
          command: String(h3data.command),
          record: parseInt(
            h3data.data[1].toString(16) + h3data.data[0].toString(16),
            16
          ).toString(),
          dateStr:
            addLeadingZero(h3data.data[4]) +
            "/" +
            addLeadingZero(h3data.data[3]) +
            "/" +
            addLeadingZero(h3data.data[2]),
          timeStr:
            addLeadingZero(h3data.data[5]) +
            ":" +
            addLeadingZero(h3data.data[6]) +
            ":" +
            addLeadingZero(h3data.data[7]),
          unit: parseUnit(h3data.data[8]),
          value: parseAscii(h3data.data.slice(10)),
        };

        return {
          success: true,
          request: {
            decArray: decArray,
            hexArray: hexArray,
          },
          response: record,
        };
        break;
    }
  } catch (error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
  }
};
