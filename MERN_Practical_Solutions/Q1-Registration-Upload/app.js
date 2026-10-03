const express=require('express'), multer=require('multer'), {body,validationResult}=require('express-validator'), path=require('path');
const app=express(); app.set('view engine','ejs'); app.use(express.urlencoded({extended:true})); app.use('/uploads',express.static('uploads'));
const storage=multer.diskStorage({destination:(r,f,cb)=>cb(null,'uploads/'),filename:(r,f,cb)=>cb(null,Date.now()+'-'+f.originalname.replace(/[^a-zA-Z0-9.]/g,'_'))});
const upload=multer({storage,limits:{fileSize:2*1024*1024},fileFilter:(r,f,cb)=>cb(null,/^image\/(jpeg|png|gif)$/.test(f.mimetype))});
app.get('/',(req,res)=>res.render('form',{data:{},errors:[],result:null}));
app.post('/',upload.fields([{name:'profile',maxCount:1},{name:'others',maxCount:5}]),[
body('username').trim().notEmpty().withMessage('Username required'),body('password').isLength({min:6}).withMessage('Password must be 6+ chars'),
body('confirm').custom((v,{req})=>v===req.body.password).withMessage('Passwords do not match'),body('email').isEmail().withMessage('Valid email required'),
body('gender').notEmpty().withMessage('Select gender'),body('hobbies').custom(v=>!!v).withMessage('Select at least one hobby')
],(req,res)=>{const errs=validationResult(req).array();const data=req.body;data.hobbies=Array.isArray(data.hobbies)?data.hobbies:[data.hobbies].filter(Boolean);
if(!req.files?.profile?.length)errs.push({path:'profile',msg:'Profile picture required'});
if(errs.length)return res.status(400).render('form',{data,errors:errs,result:null});
res.render('form',{data,errors:[],result:{...data,profile:req.files.profile[0].filename,others:(req.files.others||[]).map(f=>f.filename)}})});
app.get('/download/:name',(req,res)=>{const name=path.basename(req.params.name);res.download(path.join(__dirname,'uploads',name))});
app.listen(3000,()=>console.log('http://localhost:3000'));
