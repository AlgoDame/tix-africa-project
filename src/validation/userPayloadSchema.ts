import Joi from "joi";

export const registrationSchema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required().min(5).max(20),
    email: Joi.string().email().required(),
    
});
