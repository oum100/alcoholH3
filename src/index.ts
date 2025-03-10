import express from 'express'
import testRoutes from './routes/testRoutes'
import alcoholH3 from './routes/alcoholH3'

const app = express()

//เรียกใช้ route
app.use("/api",testRoutes)

app.use("/api/h3/v1.0.0",alcoholH3)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

export default app;