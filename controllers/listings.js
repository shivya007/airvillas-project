const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
    if(!listing){
      req.flash("error", "Listing doesn't exit!");
      res.redirect("/listings");
    }
    else{
    res.render("listings/show.ejs", { listing });
    }
}

module.exports.createListing = async (req, res, next) => {
  // map related
  let response = await geocodingClient.forwardGeocode({
    query: `${req.body.listing.location}, ${req.body.listing.country}`,
    limit: 1,
  })
    .send()


  let url = req.file.path;
  let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success", "New listing created sucessfully!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing doesn't exit!");
      res.redirect("/listings");
    }
    else{
      let originalImageUrl = listing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
      res.render("listings/edit.ejs", { listing, originalImageUrl });
    }

}

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      updatedListing.image = {url, filename};
      await updatedListing.save(); 

    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}


// work on filters and search bar in nav
// filters

module.exports.filter = async(req, res) =>{
  let { id } = req.params;

  let allListings = await Listing.find({category: {$all: [id]}});

  if(allListings.length != 0){
    res.locals.success = `results for listings based on the ${id}`;
    return res.render("listings/index.ejs", {allListings});
  }
  req.flash("error", "Oops! We couldn’t find any listings matching your search.");
  res.redirect("/listings");
}









module.exports.searchbar = async (req, res) =>{
  let searchinput = req.query.query.trim().replace(/\s+/g, " ");
  if(searchinput == "" || searchinput == " "){
    req.flash("error", "search field is empty!");
      res.redirect("/listings");
      return;
  }

  // make the user input value is equals to category values
  let inputdata = searchinput.split("");
  let finalsearchvalue = "";
  let flag = false; // this tells if curr char is lower or capital
  for(let idx = 0; idx < inputdata.length; idx++){
      if(idx == 0 || flag == true){
          finalsearchvalue = finalsearchvalue + inputdata[idx].toUpperCase();
      }
      else{
          finalsearchvalue = finalsearchvalue + inputdata[idx].toLowerCase();
      }
      flag = inputdata[idx] == " ";
  }

  let allListings = await Listing.find({
  title: { $regex: finalsearchvalue, $options: "i" },
});
  if(allListings.length != 0){
      res.locals.success = `Search results for listings based on ${finalsearchvalue}`;
      res.render("listings/index.ejs", { allListings });
      return;
  }

  if(allListings.length == 0){
      allListings =  await Listing.find({
          category: { $regex: finalsearchvalue, $options: "i" },
      }).sort({ _id: -1 }); // -1 is used here for sorting the listings according to most recent entries first or it sorts in descending order

      if(allListings.length != 0){
          res.locals.success = `Search results for listings based on ${finalsearchvalue}`;
          res.render("listings/index.ejs", { allListings });
          return;
      }
  }

  if(allListings.length == 0){
      allListings =  await  Listing.find({
          country: { $regex: finalsearchvalue, $options: "i" },
      }).sort({ _id: -1 }); // -1 is used here for sorting the listings according to most recent entries first or it sorts in descending order

      if(allListings.length != 0){
          res.locals.success = `Search results for listings based on ${finalsearchvalue}`;
          res.render("listings/index.ejs", { allListings });
          return;
      }
  }

  if(allListings.length == 0){
      allListings =  await Listing.find({
          location: { $regex: finalsearchvalue, $options: "i" },
      }).sort({ _id: -1 }); // -1 is used here for sorting the listings according to most recent entries first or it sorts in descending order

      if(allListings.length != 0){
          res.locals.success = `Search results for listings based on ${finalsearchvalue}`;
          res.render("listings/index.ejs", { allListings });
          return;
      }
  }
  if (allListings.length == 0) {
		req.flash("error", "Oops! We couldn’t find any listings matching your search.");
		res.redirect("/listings");
	} 
}
