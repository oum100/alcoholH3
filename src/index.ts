import express from 'express'
import testRoutes from './routes/testRoutes'
import alcoholH3 from './routes/alcoholH3'
import parseALH3 from './routes/alh3Routes'
import dotenv from "dotenv";


dotenv.config()
const app = express()
const port = parseInt(process.env.PORT || '3000')

//เรียกใช้ route
app.use("/api",testRoutes)

app.use("/api",alcoholH3)

app.use("/api",parseALH3)


app.listen(port, () => {
    console.log(`Server is running on port :${port}`)
})

export default app;