const config = (req , res) =>{
    return res.status(200).json({API_URL: process.env.API_URL , PORT: process.env.PORT})
}

export default config;