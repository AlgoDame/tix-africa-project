import Joi from "joi";

export const createTicketSchema = Joi.object().keys({
    event_id: Joi.number().required(),
    ticket_description: Joi.string().required(),
    ticket_type: Joi.string().valid("free", "paid").required(),
    ticket_price:  Joi.number().messages({"info": "Set price as zero if ticket_type is free"}).required()
    
});

