import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../../config";

export class AuthController {

    public async setup(req: Request, res: Response): Promise<void>  {
        const admin = new User({
            name: 'admin',
            password: 'password',
            admin: true
        });
        await admin.save(function(err) {
            if (err) throw err;
    
            res.json({ success: true });
        });
    }

    public async authenticateJWT(req: Request, res: Response): Promise<void> {
        User.findOne({
            name: req.body.name
        },
        function(err, user) {
            if (err) throw err;
      
            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
      
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
      
                const payload = {
                    admin: user.admin 
                };
                const token = jwt.sign(payload, config.secret, {
                    expiresIn: '1440m'  // expires in 24 hours
                });
      
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }   
          } 
        });
    }

    public async authorizeJWT(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, config.secret, function(err: any, decoded: any) {      
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    req.decoded = decoded;    
                    next();
                }
            });
        } else {
            res.status(403).send({ 
                success: false, 
                message: 'No token provided.'
            });
        }
    }
}