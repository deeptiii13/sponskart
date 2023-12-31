const express = require("express");
const { createCustomError } = require("../error handler/customApiError");
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const APIFeatures = require("../utils/APIfeatures");
const user = require("../models/user");
const Email = require('../utils/email');
const Organizer = require("../models/Organizer");


const addprofile = async(req,res,next)=>{
    try{
        const {organizationName,followers, eventType, preferredGender,
            platform, language,state,city,country,phonenumber,tagline,personOfcontact,
            personOfcontactPhoneNo,personOfcontactEmail  } = req.body;
        const toAdd = {
            organizationName:organizationName,
            followers:followers,
            eventType:eventType,
            preferredGender:preferredGender,
            platform:platform,
            language:language,
            state:state,
            city:city,
            country:country,
            tagline:tagline,
            personOfcontact:personOfcontact,
            personOfcontactPhoneNo:personOfcontactPhoneNo,
            personOfcontactEmail:personOfcontactEmail,
            logo:`public/${req.files.logo[0].filename}`,
            backgroundImage:`public/${req.files.backgroundImage[0].filename}`
        }
        let result = await Organizer.findOne({organizationName:organizationName});
        if(result){
            await Organizer.findOneAndUpdate({organizationName:organizationName},toAdd); 
        }
        else await Organizer.create(toAdd);
        const response = await Organizer.findOne({organizationName:organizationName});
        res.json(sendSuccessApiResponse(response));
    }
    catch(err){
        return next(createCustomError(err,400));
    }
}

const getAll = async(req,res,next)=>{
    try{
        const SearchString = ["organizationName"];
        const query = new APIFeatures(Organizer.find(),req.query)
        .filter()
        .search(SearchString)
        const data = await query.query;
        const response = sendSuccessApiResponse(data);
        res.json(response);
    }
    catch(err){
        return next(createCustomError(err,400));
    }
}
module.exports = {
    addprofile,
    getAll
};