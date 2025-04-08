import {Request, Response } from 'express'
import * as alh3Service from '../services/alh3Service'

export const parseALH3 = async(req:Request, res:Response) => {
    try{
        const alh3Data = await alh3Service.parseALH3(req,res)
        res.status(200).json(alh3Data)
    }catch (error){
        const err = error as Error
        res.status(500).json({
            message: err.message
        })
    }
}