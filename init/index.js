const mongoose = require("mongoose");
const initdata = require("./data.js")
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("MongoDb connected Successfully");
})
.catch((error)=>{
    console.log("error occured", error);
})


let allcategory = [
    "Beachfront",
	"Cabins",
	"Omg",
	"Lake",
	"Design",
	"Amazing Pools",
	"Farms",
	"Amazing Views",
	"Rooms",
	"Lakefront",
	"Tiny Homes",
	"Countryside",
	"Treehouse",
	"Trending",
	"Tropical",
	"National Parks",
	"Casties",
	"Camping",
	"Top Of The World",
	"Luxe",
	"Iconic Cities",
	"Earth Homes",
]

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>({
        ...obj, owner: "67387b537812d876025b31e2",
        category:[
            `${allcategory[Math.floor(Math.random() * 22)]}`,
            `${allcategory[Math.floor(Math.random() * 22)]}`,
        ]
    }))
    await Listing.insertMany(initdata.data);
    console.log("Data is inserted");
}

initDB();