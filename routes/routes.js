const express = require('express');
const router = express.Router();
const Student = require('../models/students');
const multer = require('multer');
const students = require('../models/students');


var storage = multer.diskStorage({
    destination:function(req, file,cb){
        cb(null, './uploads')
    },
    filename:function(req, file,cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage:storage,
}).single("image");

router.post('/addStud',upload,(req,res) => {
    const student = new Student({
        name:req.body.name,
        email:req.body.email,
        profession:req.body.profession,
        course:req.body.course,
    })
    student.save().
    then(() => {
        console.log("Student Added successfully")
    }).catch((err) => {
        console.log("Student added unsuccessfully")
    })
    res.redirect('/')
});



router.get('/',(req,res) =>{
    Student.find().exec((err,students) => {
        if(err){
            res.json({message:err.message});
        }else{
            res.render('index',{
                title:'Home Page',
                students:students,
            })
        }
    })
});
router.get('/addStud',(req,res) => {
    res.render("add_students", { title: "Add Students" });
});
router.get('/edit/:id', (req,res) => {
     let id = req.params.id;
     students.findById(id, (err, student) => {
        if(err){
            res.redirect('/');
        }else{
            if(student == null){
                res.redirect('/');
            }else{
                res.render("edit_students",{
                    title:"Edit Students",
                    student:student,
                })
            }
        }
     })
});


router.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      profession: req.body.profession,
      course: req.body.course
    };
  
    Student.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true },
      (err, updatedStudent) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Could not update student' });
        }
  
        if (!updatedStudent) {
          return res.status(404).json({ error: 'Student not found' });
        }
        res.redirect("/");
      }
    );
  });
  


router.get('/delete/:id', (req,res) => {
    let id = req.params.id;
    Student.findByIdAndDelete(id, (res) => {
    })  
    res.redirect("/");
})

module.exports = router;
