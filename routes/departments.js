// Exporting a function that sets up API routes related to departments
module.exports = function (server) {
  // Import necessary functions and data from the "utils" module
  const { readLastUsedDepartmentId } = require("../utils");

  // Read the last used department ID from the JSON file using the imported function
  let departmentIdCounter = readLastUsedDepartmentId();

  // Import the json-server module
  const jsonServer = require("json-server");

  // Create a router based on the JSON file (assumed to be "db.json")
  //This line creates a router using json-server. The router is responsible for handling HTTP requests
  // and providing the corresponding responses based on the data in the JSON file specified (in this case, "db.json").
  //The "db.json" file typically contains the initial data for your API, and json-server automatically generates RESTful routes 
  //for the data in the JSON file.
  //In summary, the router is a crucial part of the json-server library, providing a convenient way to handle HTTP requests 
  //and responses, interact with the data in the JSON file, and automatically generate RESTful routes.
  // It simplifies the process of creating a mock server for development purposes.
  const router = jsonServer.router("db.json");

  // Define a POST endpoint for creating departments
  //In this example, the server.post endpoint is defined for creating new departments. 
  //The router is used to access and modify the "departments" data based on the HTTP POST request.
  server.post("/api/departments", (request, response) => {
    // Extract the request body
    const requestBody = request.body;

    // Generate a new unique and auto-incrementing ID if not provided in the request
    if (requestBody.id === undefined) {
      let departmentId = departmentIdCounter++;

      // Create a new department object with the provided name and auto-incremented ID
      const newDepartment = {
        id: departmentId,
        name: requestBody.name,
        employee_list: [],
      };

      // Get the existing departments data
      //Here, router.db.get("departments") is retrieving the "departments" data from the JSON file, and .value() is
      // used to get the actual JavaScript value. 
      //The code then performs operations on this data, such as creating a new department or updating an existing one.
      const departmentsData = router.db.get("departments").value();

      // Add the new department to the existing data
      departmentsData.push(newDepartment);

      // Update the departments data in the JSON file
      router.db.set("departments", departmentsData).write();

      // Update the last used ID and write it to the JSON file
      const lastUsedId = router.db.get("lastUsedId").value();
      lastUsedId.departmentId = departmentIdCounter;
      router.db.set("lastUsedId", lastUsedId).write();

      // Respond with the newly created department
      response.json(newDepartment);
    } else {
      // If the department ID is provided in the request body
      const departmentsData = router.db.get("departments").value();

      // Log the department ID and existing departments data for debugging
      console.log(requestBody.id);
      console.log(departmentsData);

      // Find the index of the department with the provided ID
      const index = departmentsData.findIndex((dept) => dept.id === departmentId);

      // Log the index for debugging
      console.log(index);

      // If the department with the provided ID is not found
      if (index === -1) {
        response.status(404).json({ error: "Department not found" });
      } else {
        // Update the department with the new data
        //requestBody.id = parseInt(requestBody.id);: This line is converting the id property of the requestBody object to an 
        //integer using the parseInt function. The parseInt function parses a string and returns an integer.
        // This is commonly done to ensure that the id is stored as a numeric value, as opposed to a string.
        //departmentsData[index] = { ...departmentsData[index], ...requestBody };: 
        // This line is updating the departmentsData array at the specified index. 
        //It uses the spread (...) syntax to create a new object that includes the existing properties of departmentsData[index] 
        //and the properties of requestBody. The spread syntax is a concise way to merge objects or arrays.
        //...departmentsData[index]: This part spreads the existing properties of the department object at the specified index.
        //...requestBody: This part spreads the properties of the requestBody object.

        
        // Përditëso departamentin me të dhënat e reja
     //requestBody.id = parseInt(requestBody.id);: Ky rresht po konverton pronën id të objektit requestBody në një numër të plotë 
     //duke përdorur funksionin parseInt. Funksioni parseInt analizon një varg dhe kthen një numër të plotë.
    // Kjo bëhet shpesh për të siguruar që id është ruajtur si një vlerë numerike, në vend të një vargu.
//departmentsData[index] = { ...departmentsData[index], ...requestBody };: Ky rresht po përditëson vargun departmentsData 
//në indeksin e caktuar. Përdor sintaksën e shpërndarjes (...) për të krijuar një objekt të ri që përfshin pronat ekzistuese të 
//departmentsData[index] dhe pronat e requestBody. Sintaksa e shpërndarjes është një mënyrë e shkurtuar për të bashkuar 
//objekte ose vargje.
//...departmentsData[index]: Ky pjesë shpërndan pronat ekzistuese të objektit të departamentit në indeksin e caktuar.
//...requestBody: Ky pjesë shpërndan pronat e objektit të requestBody.

        requestBody.id = parseInt(requestBody.id);
        departmentsData[index] = {
          ...departmentsData[index],
          ...requestBody,
        };

        // Update the departments data in the JSON file
        router.db.set("departments", departmentsData).write();

        // Respond with the updated department
        response.json(departmentsData[index]);
      }
    }
  });

  // Define a DELETE endpoint for deleting departments by ID
  //RESTful API endpoint that is designed to handle HTTP
  server.delete("/api/departments/delete/:id", (request, response) => {
    // Parse the department ID from the request parameters
    const departmentId = parseInt(request.params.id);

    // Get the existing departments data
    const departmentsData = router.db.get("departments").value();

    // Filter out the department with the provided ID
    const updatedDepartments = departmentsData.filter(
      (dept) => dept.id !== departmentId
    );

    // Update the departments data in the JSON file
    router.db.set("departments", updatedDepartments).write();

    // Respond with a success message
    response.json({ message: "Department deleted successfully" });
  });

  // Define a GET endpoint for retrieving all departments
  server.get("/api/departments/all", (request, response) => {
    // Get the existing departments data
    const departmentsData = router.db.get("departments").value();

    // Respond with the list of all departments
    response.json(departmentsData);
  });

  // Define a GET endpoint for retrieving a department by ID
  server.get("/api/departments/id/:id", (request, response) => {
    // Parse the department ID from the request parameters
    const departmentId = parseInt(request.params.id);

    // Get the existing departments data
    const departmentsData = router.db.get("departments").value();

    // Find the department with the provided ID
    const department = departmentsData.find((dept) => dept.id === departmentId);

    // If the department is not found, respond with an error
    if (!department) {
      response.status(404).json({ error: "Department not found" });
    } else {
      // Respond with the details of the found department
      response.json(department);
    }
  });
};
