import {Request, Response, Router } from 'express';
import pool from '../config/database';
const route = Router();

const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

route.get('/students',(req:Request, res:Response)=>{
     pool.query('select * from students', (error:Error, results:any)=>{
        if (error) {
            console.log('Error retrieving data', error);
            res.status(500).send('Internal server error');
          } else {
            res.json(results); 
          }          
    })
})

route.post('/students', (req: Request, res:Response) => {
  interface students{
    name:string;
    email:string;
    phoneNo: string;
    address:string;
  }

  const {name,email,phoneNo,address}:students = req.body;

  if (!nameRegex.test(name)) {
    res.status(400).json({ error: 'Invalid name format' });
    return;
  }

  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  if (!phoneRegex.test(phoneNo)) {
    res.status(400).json({ error: 'Invalid phone number format' });
    return;
  }

  pool.query('SELECT * FROM students WHERE email = ?', [email], (error:Error | null, emailResults:Array<object>) => {
    if (error) {
      console.log('Error checking email:', error);
      res.status(500).send('Internal Server Error');
    } else if (emailResults.length > 0) {
      res.status(409).json({ error: 'Email already exists' });
      return;
    } else {
      pool.query('SELECT * FROM students WHERE phoneNo = ?', [phoneNo], (error:Error | null, phoneResults:Array<object>) => {
        if (error) {
          console.log('Error checking phone number:', error);
          res.status(500).send('Internal Server Error');
        } else if (phoneResults.length > 0) {
          res.status(409).json({ error: 'Phone number already exists' });
          return;
        } else {
          pool.query(
            'INSERT INTO students (name, email, phoneNo, address) VALUES (?, ?, ?, ?)',
            [name, email, phoneNo, address],
            (error:Error | null, insertResults:Array<object>) => {
              if (error) {
                console.log('Error creating student:', error);
                res.status(500).send('Internal Server Error');
              } else {
                res.json(insertResults);
              }
            }
          );
        }
      });
    }
  });
  
});

export default route;