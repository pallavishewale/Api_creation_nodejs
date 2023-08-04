const { Pool } = require("pg");


const pool = new Pool({
    user: "postgres",
    host: 'localhost',
    database: 'hr',
    password: "root",
    port: 5433
})


// --------------table schema generation

pool.query('CREATE TABLE  IF NOT EXISTS employee(id SERIAL, name  VARCHAR(100) NOT NULL,age INTEGER NOT NULL, height FLOAT NOT NULL, is_student  BOOLEAN NOT NULL, birth_date  DATE  NOT NULL, salary NUMERIC NOT NULL)',
    (err, result) => {
        if (err) {
            console.log('error while table creation :', err);
        }
    })



//-------select all employees-----

const allEmployees = (page,pageSize) => {
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * pageSize;
        pool.query('SELECT * from employee LIMIT $1 OFFSET $2',[pageSize, offset], (error, response) => {
            if (error) {
                console.log('ERROR: at the time of all employee selection:', error);
                reject(error);
            } else {
                resolve(response.rows);
            }
        });
    });
};


// --------------fuction for fetch employee by id and name ---------

const getEmployeeByKey = (key,value) => {
    console.log("enter",key,":",value);
    return new Promise((resolve, reject) => {
        const query = `SELECT * from employee WHERE ${key}='${value}'`
        
        pool.query(query, (error, response) => {
            if (error) {
                console.log('ERROR: at the time of all employee selection:', error);
                reject(error);
            } else {
                console.log(response.rows);
                resolve(response.rows);
            }
        });
    });
};


const addEmployees = (requestBody) => {
    return new Promise((resolve, reject) => {
        //check validations
        isValid(requestBody)
        .then(() => {
            const { name, age,height,is_student,birth_date, salary } =  requestBody;
            let query = `INSERT INTO employee(name, age, height, is_student, birth_date, salary)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`
                const values = [name, age, height, is_student, birth_date, salary];
              
            pool.query(query,values, (error, response) => {
                if (error) {
                    console.log('ERROR: at the time of employee insertion:', error);
                    reject(error);
                } else {
                    resolve(response.rows);
                }
            });
        })
        .catch((error) => {
          // Handle validation errors here
          console.error('Validation error:', error.message);
          reject(error);
        });

      
    });
};

//delete function 
const deleteEmployee = (value) => {
    console.log("enter  id :",value);
    return new Promise((resolve, reject) => {

         //first check does id is exist in database or not
         pool.query(`select * from employee where id = ${value}`,(error, response) => {
            if (error) {
                console.log('ERROR: at the time of select query :', error);
                reject(error);
            } else {
              if(response.rowCount>0){     //******** if id present in database  */

                const query = `DELETE FROM employee
                WHERE id = ${value};`
                pool.query(query, (error, response) => {
                    if (error) {
                        console.log('ERROR: at the time of deletion :', error);
                        reject(error);
                    } else {
                        console.log(response.rows);
                        resolve(response.rows);
                    }
                });
            }else{
                reject(new Error(' Id not found .... '));
                return;
              }
            }
        });
    });
};



//update employee
const updateEmployees = (requestBody, id_value) => {
    return new Promise((resolve, reject) => {
       //ckeck validations 
       isValid(requestBody)
        .then(() => {
            const {  name, age,height,is_student,birth_date, salary } =  requestBody;

            //first check does id is exist in database or not
            pool.query(`select * from employee where id = ${id_value}`,(error, response) => {
                if (error) {
                    console.log('ERROR: at the time of select query :', error);
                    reject(error);
                } else {
                    console.log(response.rows);
                    console.log("length of response",response.rowCount);
                  if(response.rowCount>0){     //******** if id present in database  */

                    let query = `UPDATE employee
                    SET name=$1, age=$2, height=$3, is_student=$4, birth_date=$5, salary=$6
                    WHERE id = ${id_value};`
    
                    const values = [name, age, height, is_student, birth_date, salary];
                
                    pool.query(query,values, (error, response) => {
                        if (error) {
                            console.log('ERROR: at the time of employee updation:', error);
                            reject(error);
                        } else {
                            console.log('done.....');
                            resolve(response.rows);
                        }
                    });

                  }else{
                    reject(new Error(' Id not found .... '));
                    return;
                  }
                }
            });
            
               
          
        })
        .catch((error) => {
            // Handle validation errors here
            console.error('Validation error:', error.message);
            reject(error);
        });
    });
};



///
///validations
//
//
function isValid(requestBody) {
    return new Promise((resolve, reject) => {
      const { name, age, height, is_student, birth_date, salary } = requestBody;
  

      
      // condition for datatype of name
      if (typeof name !== 'string' || name.trim() === '') {
        reject(new Error('provide any name in string format'));
        return;
      }
  
      if (typeof age !== 'number' || age <= 18 || age >= 60) {
        reject(new Error('Age must be a positive number and between 18 - 60'));
        return;
      }
  
      // Validate birth_date (you may have more complex validation logic)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birth_date)) {
        reject(new Error('birth_date should be in yyyy-mm-dd format'));
        return;
      }
  
      if ( salary < 0) {
        reject(new Error('Salary should be an integer and greater than or equal to 0'));
        return;
      }
        // Validate required fields
        if (!name || !age || !height || !is_student || !birth_date || !salary) {
            reject(new Error('All attributes and values must be provided'));
            return;
        }
    
      // If all validations pass, resolve without an argument
      resolve();
    });
  }

module.exports = { allEmployees ,
    getEmployeeByKey, addEmployees,deleteEmployee,updateEmployees}





