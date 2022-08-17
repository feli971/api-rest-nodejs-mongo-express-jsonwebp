import { User } from '../models/user.js'
import jwt from 'jsonwebtoken'

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
        return res.status(500).json({error: "Contraseña incorrecta"});

    //Generar el token JWT   
    const token = jwt.sign({uid: user._id}, process.env.JWT_SECRET) 

    return res.json({ok: token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Server error"});
    }

  
};

