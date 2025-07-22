import aj from "../config/arcjet.js";


const arvjetMiddleware = async (req,res,next)=>{
    try{
        const desc = await aj.protect(req);
        if(desc.isDenied())
        {
            if(desc.reason.isRateLimit())
            {
              return  res.status(429).json({error:"Rate limit exceeded"});
            }
            if(desc.reason.isBot())
            {
               return res.status(403).json({error:"BOTSSSSSS"});
            }
            return res.status(403).json({error:"Access denied"});
        }
        next();
    }
    catch(error)
    {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}


export default arvjetMiddleware;