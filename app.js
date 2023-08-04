const http = require('http');
const db = require('./connectivity.js');
const url = require('url');

const host = 'localhost';
const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url,true);
  console.log("abc",parsedUrl);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  let requestBody = '';

 


  if (req.url === '/' && req.method == 'GET') {                                              //plain api call
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
  }  //
  //
  //--------------- api call for all employees--------------
  //
  //
  else if (pathname =='/employee' && req.method=='GET') {           
    try {
      const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 100;
      const employees = await db.allEmployees(page,limit);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write('Employee Data :');
      res.end(JSON.stringify(employees));

    } catch (error) {
     
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error'+error.message);
    }
    
  }
  //
  //
   //------------- api call for by id or name ------------------
  //
  //
  else if (pathname === '/employees' && (query.id || query.name) && req.method=='GET') {  
    try {
      let employeeData;
      if(query.id){
         employeeData = await db.getEmployeeByKey(Object.keys(query)[0],query.id); 
      }else{
         employeeData = await db.getEmployeeByKey(Object.keys(query)[0],query.name); 
      }
      if(employeeData.length > 0){
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(employeeData));
          console.log("requested data send successfully ..");
      }else{
        res.end(`${query[Object.keys(query)[0]]}  does not exist in database`);
      }
      
    } catch (error) {
     
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error'+error.message);
    }
   }
    //
  //
      ///-------------api rout for insert new employee-----------------
  //
  //
   else if (req.method == 'POST' && pathname === '/employees') {        
    try {
      let requestBody = '';
      req.on('data', (chunk) => {
        requestBody += chunk.toString();
      });

      req.on('end', async () => {
        // Request body has been fully received
        // console.log('Request body:', requestBody);

        try {
          const employees = await db.addEmployees(JSON.parse(requestBody));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write("Your inserted data :");
          res.end(JSON.stringify(employees));
        } catch (error) {
          // if(error.message === 'Field imcomplete'){
          //   console.log("++++++++++++++++++++++++++++++++")
          // }
          console.error('Error while inserting employee:', error);
          res.end('while adding new user : ' +error.message);
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(error.message);
    }
    
  }
   //
  //
      ///-------------api rout for delete employee-----------------
  //
  //
  else if (req.method == 'DELETE' && pathname === '/employees') {           
    try {
      console.log("deletion process");
      employeeData = await db.deleteEmployee(query.id);
     
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end("Deleted successfully");
          console.log("delete successfully ..");
      
    } catch (error) {
     
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('For DELETION : '+error.message);
    }
    
  }
   //
  //
      ///-------------api rout for UPDATE employee-----------------
  //
  //
  else if (req.method == 'PUT' && pathname === '/employees') {           
    try {
      let requestBody = '';
      req.on('data', (chunk) => {
        requestBody += chunk.toString();
      });

      req.on('end', async () => {
        // Request body has been fully received
        console.log('Request body:', requestBody);

        try {
          const updated = await db.updateEmployees(JSON.parse(requestBody),query.id);
          console.log("updated status :",updated);
         res.end("updated successfully....")
        } catch (error) {
          console.error('Error while inserting employee:', error);
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('while updation :'+error.message);
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(error.message);
    }
  }
   else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
