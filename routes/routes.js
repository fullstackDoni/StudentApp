const express = require('express');
const router = express.Router();
const Student = require('../models/students');

const professions = ['Engineer', 'Doctor', 'IT', 'Teacher', 'CyberSport'];
const courses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Finished'];

router.route('/addStud')
    .get((req, res) => {
        const selectedCourse = 'defaultValue';
        const selectedProfession = 'defaultValue'
        res.render("add_students", {professions, courses, selectedCourse, selectedProfession});
    })
    .post((req, res) => {
        const {name, email, profession, course} = req.body;
        if (!professions.includes(profession) || !courses.includes(course)) {
            return res.status(400).send('Invalid profession or course');
        }
        res.redirect('/');
    });

router.route('/api/addStud')
    .post((req, res) => {
        const student = new Student({
            name: req.body.name,
            email: req.body.email,
            profession: req.body.profession,
            course: req.body.course,
        });

        student.save()
            .then(() => {
                res.redirect("/");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({error: "Internal Server Error"});
            });
    });

router.route('/')

    .get((req, res) => {

        Student.find().exec((err, students) => {
            if (err) {
                res.json({message: err.message});
            } else {
                res.render('index', {
                    title: 'Home Page',
                    students: students,
                });
            }
        });
    });

router.route('/edit/:id')
    .get((req, res) => {
        let id = req.params.id;
        Student.findById(id, (err, student) => {
            if (err) {
                res.redirect("/");
            } else {
                if (student == null) {
                    res.redirect("/");
                } else {
                    res.render("edit_students", {
                        title: "Edit Students",
                        student: student,
                        professions: professions,
                        courses: courses,
                    });
                }
            }
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        const updatedData = {
            name: req.body.name,
            email: req.body.email,
            profession: req.body.profession,
            course: req.body.course
        };

        Student.findOneAndUpdate(
            {_id: id},
            updatedData,
            {new: true},
            (err, updatedStudent) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({error: 'Could not update student'});
                }

                if (!updatedStudent) {
                    return res.status(404).json({error: 'Student not found'});
                }
                res.redirect("/");
            }
        );
    });

router.get('/api/edit/:id', (req, res) => {
    const id = req.params.id;
    Student.findById(id, (err, student) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.render('edit_students', {
            student: student, professions: professions,
            courses: courses,
        });
    });
});

router.post('/api/edit/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        profession: req.body.profession,
        course: req.body.course
    };

    Student.findOneAndUpdate(
        {_id: id},
        updatedData,
        {new: true},
        (err, updatedStudent) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: 'Could not update student'});
            }

            if (!updatedStudent) {
                return res.status(404).json({error: 'Student not found'});
            }

            res.redirect('/');
            res.render('edit_students', {
                professions: professions,
                courses: courses,
            });
        }
    );
});

router.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;
    Student.findByIdAndDelete(id, (err, deletedStudent) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: 'Could not delete student'});
        }
        if (!deletedStudent) {
            return res.status(404).json({error: 'Student not found'});
        }
        res.json({message: 'Student deleted successfully', student: deletedStudent});
    });
});

// router.delete('/api/delete/:id', (req, res) => {
//     const id = req.params.id;
//     Student.findByIdAndDelete(id, (err, deletedStudent) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Could not delete student' });
//         }
//         if (!deletedStudent) {
//             return res.status(404).json({ error: 'Student not found' });
//         }
//         res.redirect('/');
//     });
// });

module.exports = router;

// router.put('/api/edit/:id', (req, res) => {
//     const id = req.params.id;
//     const updatedData = {
//         name: req.body.name,
//         email: req.body.email,
//         profession: req.body.profession,
//         course: req.body.course
//     };
//
//     Student.findOneAndUpdate(
//         { _id: id },
//         updatedData,
//         { new: true },
//         (err, updatedStudent) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: 'Could not update student' });
//             }
//
//             if (!updatedStudent) {
//                 return res.status(404).json({ error: 'Student not found' });
//             }
//
//             res.json({ message: 'Student updated successfully', student: updatedStudent });
//         }
//     );
// });
