const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { findOne } = require("../models/user");






exports.createUser =  (req,res,next)=>{
  const tempuserstatus = "user";
  const url = req.protocol + '://' + req.get("host");
  bcrypt.hash(req.body.password, 10)
    .then(hash =>
      {
        const user = new User({
          fullName: req.body.fullName,
          email:req.body.email,
          password:hash,
          phoneNumber:req.body.phoneNumber,
          fullAddress: req.body.fullAddress,
          cnicNumber:req.body.cnicNumber,
          dob: req.body.dob,
          genderStatus:req.body.genderStatus,
          //accountStatus: req.body.accountStatus,
          accountStatus: tempuserstatus,
          imagePath: url+"/images/" + req.file.filename,
          authorizedStatus: false
      });
      user.save().then(result =>
        {
          res.status(201).json({
            message: "User created sucesfully",
            result: result
          });
        })
          .catch(error => {
            res.status(500).json({
                message: "Invalid Authentication Credentials!"
            });
          });
  });
}


exports.userLogin= (req,res,next) =>
{
  //console.log("sucesfully");
  let fethcedUser;
  User.findOne({cnicNumber:req.body.cnicNumber})
    .then(user =>
    {
      if(!user)
      {
        return res.status(401).json(
        {
          message: "Authentication Failed"
        });
      }
      fethcedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
      .then(result =>
          {
            if(!result)
            {
              return res.status(401).json(
                {
                  message: "Invalid Authentication Credentials"
                });
            }
            //the second parameter "'secret_this_should_be_longer'" this would be changed in our real application for security purpose...and it is used in self created middleware check-auth
            const token = jwt.sign({cnicNumber: fethcedUser.cnicNumber, userId: fethcedUser._id, accountStatus: fethcedUser.accountStatus},
              process.env.JWT_KEY,
              {expiresIn: "1h"});
            res.status(200).json(
              {
                token : token,
                expiresIn: 3600,
                userId: fethcedUser._id,
                accountStatus: fethcedUser.accountStatus
                //message: "Succesfull"
              });
          })
          .catch(error =>
            {
              return res.status(401).json(
                {
                  message: "Authentication Failed"
                });
            });
    }





exports.userdetails = (req,res,next) =>
{

User.findOne({cnicNumber: req.params.cnicNumber}).then(userdetail =>{
 // console.log(userdetail);
  if(userdetail)
  {
    res.status(200).json({message:"Fetched sucesfully",
      userdetail});
    //console.log("fethcedUser sucesfully");
  }
  else
  {
    res.status(404).json({message:"error finding user"})
  }
  //res.status(200).json({message:"user fetch",
//users:userdetail})
}).catch(error =>console.log(error))
}




exports.deleteUser = (req,res,next) =>
{
  //const a = 3710558105901;
  /*console.log(req.params.cnicNumber);
  res.status(200).json({message:"user deleted"});*/
  User.deleteOne({cnicNumber: req.params.cnicNumber}).then(result =>
    {
      //console.log(req.params.cnicNumber);
      if(result.n > 0)
      {
        res.status(200).json({message:"User deleted successfully"});
      }
      else
      {
        res.status(401).json({message:"error deleting user"});
      }
    }).catch(error =>{res.status(500).json({message:"error deleting user"});
  });

 // console.log("deleted user");
}




exports.findUnverifiedUsers = (req,res) =>
{

  //console.log("req here", req);

  User.find({authorizedStatus:false})
  .then(results => {
    //console.log(results);
    res.status(200).json(
      {
        message:"Unverified Users Fetched Sucessfully",
        users:results

      })
      //console.log(results);
    })
  .catch(error => console.error(error))

 /* let fethcedUser;
  User.find()
  .then(documents =>
    {
      consol.log(documents);
    });
  res.status(200).json(
    {
      message:"Users Fetched Successfully",
      users: users
});*/
}


exports.approveuser =  (req,res,next) =>
{

 const a = User.findOne({cnicNumber: req.body.cnicNumber}).then(userdetail =>{
    //console.log(userdetail);
    if(userdetail)
    {
      res.status(200).json(userdetail);
      console.log("fethcedUser sucesfully");
    }
    else
    {
      res.status(404).json({message:"error finding user"})
    }
    //res.status(200).json({message:"user fetch",
  //users:userdetail})
  }).catch(error =>console.log(error))
    a.authorizedStatus=true;
    User.updateOne({cnicNumber:a.cnicNumber}).then(res =>
      {
        //a.authorizedStatus=true;
        if(authorizedStatus == true)
        {
          //a.save().then(res =>{res.status(200)})
          res.status(200).json({message:"Authorized Sucessfully"});
        }
        else
        {
          re.status(200).json({message:"Authorization error"});
        }
      }).catch(err =>
        {
          res.status(500).json({message:"couldnt authorize user"});
        })

 /* User.findOneAndUpdate(req.params.cnicNumber,{
    returnOriginal: false
  })
  .then(userdetail =>
    {
      if(userdetail)
    {
      userdetail.authorizedStatus = true;
      userdetail.save();
      res.status(200).json(userdetail);
      console.log("Authorized sucesfully");
    }
    else
    {
      res.status(404).json({message:"error authorizing user"})
    }
    }).catch(error =>console.log(error))

*/


/*
  const user = new User({
    authorizedStatus:true
  })
  User.find({cnicNumber:req.params.cnicNumber})
  .then(results => {
    results.authorizedStatus = true;
    if(authorizedStatus == true)
    {
      res.status(200).json({message:"User Authorized succesfully"});
    }
    else
    {
      res.status(400).json({message:"Error authorizing user"});
    }
  })*/
}
