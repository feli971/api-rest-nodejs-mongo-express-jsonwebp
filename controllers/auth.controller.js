import { User } from '../models/user.js'
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';

export const register = async(req, res) => {
    const {email, password} = req.body
    try {
        //Second alternative searching by email
        let user = await User.findOne({ email });
        if (user) throw { code: 11000};
        user = new User({ email, password });
        await user.save();

        //Generar el token JWT

        return res.json({ok: true})
    } catch (error) {
        console.log(error);
        //Default alternative mongoose
        if(error.code === 11000){
            return res.status(400).json({error: "Ya existe este usuario"})
        }
        return res.status(500).json({error: "Server error"});
    }
   
};

export const login = async(req, res) => {
    try {
    const {email, password} = req.body   

    let user = await User.findOne({ email });   
    if (!user) return res.status(403).json({error: "No existe este usuario"})
    
    const respuestaPassword = await user.comparePassword(password)   
    if (!respuestaPassword) 
        return res.status(403).json({error: "Contraseña incorrecta"});

    //Generar el token JWT   
    const {token, expiresIn} = generateToken(user.id);
    generateRefreshToken(user.id, res)    
   
        


    return res.json({ token, expiresIn });

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Server error"});
    };


};

export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean()
        return res.json ({email:user.email, uid:user.id });
    } catch (error) {
        return res.status(500).json({error: "error de servidor"})
    };
    
};

export const refreshToken = (req, res) => {


    try {
        const refreshTokenCookie = req.cookies.refreshToken
         if(!refreshTokenCookie) throw new Error("No Existe el Token");


         const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
         const {token, expiresIn} = generateToken(uid);


         return res.json({ token, expiresIn });
    }   catch (error) {
        console.log(error)
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

export const logout = (req, res) =>{
    res.clearCookie('refreshToken')
    res.json({ok: true})
}