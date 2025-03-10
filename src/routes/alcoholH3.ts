import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import express from "express";
import {
  validateRequest,
  H3data,
  H3record,
  H3serial,
  H3model,
  H3info,
} from "../models/alh3";

//Importe type
import { Router, Request, Response } from "express";
import {
  hexStringToUint8Array,
  addLeadingZero,
  createH3data,
  parseUnit,
} from "../utilities/alh3";
import anyBase from "any-base";

//Create route instance
const router = Router();
router.use(express.json());
// const supabaseUrl: string = String(process.env.SUPABASE_URL);
// const supabaseKey: string = String(process.env.SUPABASE_KEY);
// const supabase = createClient(supabaseUrl, supabaseKey);


router.get("/", (_: Request, res: Response): void => {
  res.send(process.env.SUPABASE_URL);
});

router.post("/parseH3", (req: Request, res: Response): void => {
  const dec2hex = anyBase(anyBase.DEC, anyBase.HEX);
  const hex2dec = anyBase(anyBase.HEX, anyBase.DEC);

  const { error } = validateRequest(req.body);

  if (error) {
    res.status(400).send(error?.details[0].message);
  }

  try {
    //Create Dec Array
    const { hexstr } = req.body;
    const result = hexStringToUint8Array(hexstr);
    console.log("body: ", hexstr);

    //Getting data part
    const h3data = createH3data(result);
    console.log("H3data", h3data);

    const command = h3data.command;
    const rawData = h3data.data;
    console.log("rawData", rawData);
    let tempValue: string = "";

    switch (command) {
      case 1:
        // result_data = String(h3data.data)
        break;

      case 2: //ParseInfo
        const info: H3info = {
          hexStr: hexstr,
          command: String(h3data.command),
          version: "",
          battery: "",
          language: "",
          testMode: "",
          unit: "",
        };

        res.status(200).json({
          success: true,
          input_data: h3data,
          output_data: info,
        });
        break;

      case 3: //parseModel
        //Test hex: BCFD03066d6f64656c596A   result: modelY
        for (let i = 0; i < h3data.dataLen; i++) {
          tempValue = tempValue + String.fromCharCode(h3data.data[i]);
        }
        console.log("TempValue:", tempValue);

        const model: H3model = {
          hexStr: hexstr,
          command: String(h3data.command),
          model: tempValue,
        };

        res.status(200).json({
          success: true,
          input_data: h3data,
          output_data: model,
        });
        break;

      case 4: //parseSerial
        //Testing hex: BCFD040C59474b4a3232303730303031C1   result: YGKJ22070001
        for (let i = 0; i < h3data.dataLen; i++) {
          tempValue = tempValue + String.fromCharCode(h3data.data[i]);
        }
        console.log("TempValue:", tempValue);

        const serial: H3serial = {
          hexStr: hexstr,
          command: String(h3data.command),
          serial: tempValue,
        };

        res.status(200).json({
          success: true,
          input_data: h3data,
          output_data: serial,
        });
        break;

      case 9:
        break;

      case 17: //parseRecord
        //Test hex: BCFD110E4A001902160A3B050604302E30308D
        //Record:74
        //Date: 22/02/25
        //Time: 10:59:05
        //Unit: 06  ug/100mL
        //Value: 0.00
        for (let i = 1; i <= h3data.data[9]; i++) {
          tempValue = tempValue + String.fromCharCode(h3data.data[9 + i]);
        }

        //Prepare parseRecord
        const record: H3record = {
          hexStr: hexstr,
          command: String(h3data.command),
          record: parseInt(
            dec2hex(String(h3data.data[0])) + dec2hex(String(h3data.data[1])),
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
          value: tempValue,
        };

        res.status(200).json({
          success: true,
          input_data: h3data,
          output_data: record,
        });
        break;
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }

});

export default router;
