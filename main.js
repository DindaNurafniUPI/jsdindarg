// This function processes command line arguments passed to the script
async function process_argv() {
  let { argv } = process;
  argv = argv.slice(2);

  // Calls the appropriate function based on the first argument
  const result = await studentActivitiesRegistration(argv);

  return result;
}

// This function retrieves all activities from the server
async function getStudentActivities() {
  const response = await fetch("http://localhost:3001/activities");
  const result = await response.json();
  return result;
}

// This function determines which operation to perform based on the command
async function studentActivitiesRegistration(data) {
  let result = data[0];

  switch (result) {
    case 'CREATE':
      let name = data[1];
      let day = data[2];
      return addStudent(name, day);
    
    case 'DELETE':
      let id = data[1];
      return deleteStudent(id);
    
    default:
      throw new Error('Invalid command');
  }
}

// This function retrieves activities for a specific day from the server
async function getStudentActivities(day) {
  const response = await fetch("http://localhost:3001/activities");
  const activities = await response.json();

  // Filter activities based on the given day
  const filteredActivities = activities.filter(activity => activity.days.includes(day));

  return filteredActivities;
}

// This function adds a new student with the given name and day
async function addStudent(name, day) {
  const activities = await getStudentActivities(day);
  const newStudent = {
    name: name,
    activities: activities.map((activity) => ({
      name: activity.name,
      desc: activity.desc,
    })),
  };
  const postResponse = await fetch("http://localhost:3001/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStudent),
  });
  return postResponse.json();
}

// This function deletes the student with the given ID
async function deleteStudent(id) {
  const response = await fetch(`http://localhost:3001/students/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
}

// Executes the process_argv function and logs the result or error
process_argv()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });

// Export functions for use in other modules
module.exports = {
  studentActivitiesRegistration,
  getStudentActivities,
  addStudent,
  deleteStudent,
};
