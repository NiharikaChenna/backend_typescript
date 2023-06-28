import mysql from 'mysql'

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'niha'
});
pool.connect((err:Error) => {
    if (err) throw err;
    console.log("connected db");
  });

  export default pool;