const ini=require("./data.js");
const mongoose=require("mongoose");

const Listing = require("../models/listing.js");



main().then((res)=>{
    console.log("connection establish");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initdata = async ()=>{
    await Listing.deleteMany({});
    ini.data = ini.data.map((obj)=>({...obj,owner:"68467c56270af77260f824ff"}));
    await Listing.insertMany(ini.data);
}

initdata();