import Joi from 'joi'
import type { Request,Response } from "express";


//H3 command syntax  BC FD <command> <data len> <data> <checksum256 of data>  ex: BC FD 01 00 00

export interface H3data{
    header:Uint8Array
    command:number
    dataLen:number
    data:Uint8Array
    checkSum:number
}

export interface H3status {
    hexStr:Uint8Array
    command: string
    status:string  
}

export interface H3lastRec {
    hexStr:Uint8Array
    command: string
    recordID:string 
}

export interface H3lastSetTime {
    hexStr:Uint8Array
    command: string
    timeInSecond: string
    lastSet:string  //convert Hex to Ascii
}

export interface H3model {
    hexStr:Uint8Array
    command: string
    model:string  //convert Hex to Ascii
}

export interface H3serial {
    hexStr:Uint8Array
    command: string
    serial:string  //convert Hex to Ascii
}

export interface H3info{
    hexStr:Uint8Array
    command: string
    version:string
    battery:string
    language:string
    testMode:string
    unit:string
}

export interface H3report{
    hexStr:Uint8Array   
    command: string 
    status : string // byte[0] 
    value: string //byte[1] byte[2]
    unit: string //byte[3]
    record: string //byte[4] byte[5]
}

export interface H3record{
    hexStr: string
    command: string
    record: string
    dateStr:string
    timeStr: string
    unit:string
    value:string
}



export function validateRequest(req:Request){
    const schema = Joi.object({
        hexstr: Joi.string().required()
    })

    return schema.validate(req)
}





