const express=require('express'),session=require('express-session'),FileStore=require('session-file-store')(session);
const app=express();app.set('view engine','ejs');app.use(express.urlencoded({extended:true}));app.use(session({store:new FileStore({path:'./sessions'}),secret:'change-this-secret',resave:false,saveUninitialized:false}));
const auth=(r,s,n)=>r.session.user?n():s.redirect('/');
app.get('/',(r,s)=>s.render('login',{error:''}));app.post('/login',(r,s)=>{if(r.body.username==='student'&&r.body.password==='1234'){r.session.user=r.body.username;return s.redirect('/one')}s.render('login',{error:'Invalid login'})});
app.get('/one',auth,(r,s)=>s.send('<h2>Protected Page 1</h2><a href="/two">Page 2</a> <a href="/logout">Logout</a>'));
app.get('/two',auth,(r,s)=>s.send('<h2>Protected Page 2</h2><a href="/one">Page 1</a> <a href="/logout">Logout</a>'));
app.get('/logout',(r,s)=>r.session.destroy(()=>s.redirect('/')));app.listen(3001,()=>console.log('http://localhost:3001'));