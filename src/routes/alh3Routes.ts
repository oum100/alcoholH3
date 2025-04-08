import express from 'express'
import * as alh3Controller from '../controllers/alh3Controller'

const router = express.Router()

router.post("/h3/v1.0.0/parseALH3", alh3Controller.parseALH3)

export default router