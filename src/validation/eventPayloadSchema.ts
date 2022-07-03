import Joi from "joi";

export const createEventSchema = Joi.object().keys({
    user_id: Joi.number().required(),
    event_name: Joi.string().required(),
    event_description: Joi.string().required(),
    event_type: Joi.string().valid("free", "paid").required(),
    start_date: Joi.date().iso().messages({"date.format": "Date format is YYYY-MM-DD"}).required(),
    end_date: Joi.date().iso().messages({"date.format": "Date format is YYYY-MM-DD"}).required()
    
});

export const updateEventSchema = Joi.object().keys({
    event_name: Joi.string(),
    event_description: Joi.string(),
    event_type: Joi.string().valid("free", "paid"),
    start_date: Joi.date().iso().messages({"date.format": "Date format is YYYY-MM-DD"}),
    end_date: Joi.date().iso().messages({"date.format": "Date format is YYYY-MM-DD"})
    
});

export const getEventsQuerySchema = Joi.object().keys({
    next_page_token: Joi.number()
    
});