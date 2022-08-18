import jwt from "jsonwebtoken";
export const requireToken = (req, res, next) => {
    try {
        let  token = req.headers?.authorization;
        console.log(token);
        if (!token)
            throw new Error("No Bearer");

            
            token = token.split(" ")[1];
           const {uid} = jwt.verify(token, process.env.JWT_SECRET);
           console.log(payload);

           req.uid = uid
           next();
        } catch (error) {
        console.log(error.message);


        const TokenVerificationErrors = {
            "invalid signature": "La firma de JWT no es valida",
            "JWT Expired": "JWT expirado",
            "Invalid Token": "Token Invalido",
            "No Bearer": "Utiliza Formato Bearer",
            "jwt malformed": "JWT Formato no valido"
        };
        return res
        .status(401)
        .send({error: TokenVerificationErrors[error.message] });
    }
};