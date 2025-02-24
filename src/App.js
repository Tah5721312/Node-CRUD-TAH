const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: true }));
const User = require("../models/customerSchema");
app.set("view engine", "ejs");
app.use(express.static('public'))
var moment = require('moment'); 
var methodOverride = require('method-override')
app.use(methodOverride('_method'))


var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

// Auto Refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
////////////////////////

// model.save() ==> to send data to DB
  
// model.find() ==> to get all data from DB
// model.findById("64c084e1ba1c09af7a125c58)

////////////////////////////////////
// GET All Data
app.get("/", (req, res) => {
  // result ==> array of objects
  User.find()   // User بستقبلها فوق من ---> customerSchema.js
      .then((result) => {

        if (result.length === 0) {  // إذا لم توجد بيانات
                res.render("user/message", { message: "No data found  Please Enter Data" });  // عرض رسالة أو توجيه إلى صفحة "message"
              } else {
                res.render("index", { arr: result, moment: moment });  // إذا كانت هناك بيانات، عرضها في صفحة index
              }
            
              })
      .catch((err) => {
               console.log(err);
             });
});


////////////////////////////////


app.get("/user/add.html", (req, res) => {  // Removed `.html` from the route
  res.render("user/add", { country_list: country_list });  // Render add user form
});

////////////////////////////////////////////
app.get("/edit/:id", (req, res) => {
  // result ==> object    
  User.findById(req.params.id)
      .then((result) => { 
                 res.render("user/edit", {obj: result ,moment:moment , country_list: country_list }); //  obj و تاخد معاك  view  تروح تعرض 
           })
      .catch((err) => {
                console.log(err);
           });
});

///////////GET one Data by id ///////////////////////

app.get("/view/:id", (req, res) => {
  // result ==> object    
  User.findById(req.params.id)
      .then((result) => { 
                 res.render("user/view", {obj: result ,moment:moment }); //  obj و تاخد معاك  view  تروح تعرض 
           })
      .catch((err) => {
                console.log(err);
           });
});


////////////////////////////////////////
/// insert
app.post("/user/add.html", (req, res) => {
  console.log(req.body);

  User.create(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

////////////////////////
//Delete
// DELETE User by ID using findByIdAndDelete
app.delete("/edit/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});
//////
// DELETE User by ID using deleteOne
// app.delete("/edit/:id", (req, res) => {
//   User.deleteOne({_id: req.params.id})
//     .then((result) => {
//       res.redirect("/");
//       console.log(result)
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
//////////////////////////
///Update  findByIdAndUpdate
// app.put("/edit/:id", (req, res) => {
//   // console.log(req.body); // للتأكد من أن البيانات تُرسل بشكل صحيح
 
//   User.findByIdAndUpdate(req.params.id, req.body)
//     .then((result) => {
//       res.redirect("/");  // إعادة التوجيه بعد التحديث
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
///Update  findByIdAndUpdate
app.put("/edit/:id", (req, res) => {
  // console.log(req.body); // للتأكد من أن البيانات تُرسل بشكل صحيح
 
  User.updateOne({_id: req.params.id}, req.body)
    .then((result) => {
      res.redirect("/");  // إعادة التوجيه بعد التحديث
    })
    .catch((err) => {
      console.log(err);
    });
});

/////////////////////////////////
//search
// Search Route
app.get("/search", (req, res) => {
  const searchQuery = req.query.searchtext; // Capture the search query from the URL

  // إذا كان البحث فارغًا، عرض رسالة تطلب من المستخدم إدخال قيمة
  if (!searchQuery || searchQuery.trim() === '') {
    res.render("user/message", { message: "You should enter a value" });  // عرض رسالة إذا كان البحث فارغًا
    return;
  }

  // إذا كان هناك نص في البحث، يتم البحث باستخدام الاستعلام
  User.find({
    $or: [
      { fireName: { $regex: searchQuery, $options: "i" } }, // البحث باستخدام fireName
      { lastName: { $regex: searchQuery, $options: "i" } },  // أو lastName
    ]
  })
  .then((result) => {
    // إذا كانت نتائج البحث فارغة، سيتم عرض رسالة "There is no result"
    if (result.length === 0) {
      res.render("user/message", { message: "There is no result." });  // عرض رسالة بعدم وجود نتائج
    } else {
      // إذا كانت هناك نتائج، سيتم عرضها
      res.render("user/search", { 
        arr: result, 
        moment: moment
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
});





mongoose
  .connect(
    "mongodb+srv://tah57:12345@cluster0.kmley.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
    // "mongodb+srv://devali:Y3mkQvum8gItJ861@cluster0.5cqribi.mongodb.net/all-data?retryWrites=true&w=majority"
    //  "mongodb://localhost:27017/all-data"   // all-data name of database
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
