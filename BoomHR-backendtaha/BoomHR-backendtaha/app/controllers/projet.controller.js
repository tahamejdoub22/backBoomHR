const Project = require('../models/projet.model');
const Employe = require('../models/employer.model');

// exports.createProject = async (req, res) => {
//   try {
//     const { name, startDate, endDate ,projectManager} = req.body; //tasks,team
//     const project = new Project({
//       name :name,
//       startDate:startDate,
//       endDate:endDate,
//       //team,
//      // tasks,
//       projectManager:projectManager
//     });
   
//     res.status(201).json({ project });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
exports.createProject = async (req, res) => {
  try {
    const { name, startDate, endDate, projectManager } = req.body;
    const project = new Project({
      name: name,
      startDate: startDate,
      endDate: endDate,
      projectManager: projectManager
    });
    const savedProject = await project.save();
    res.status(201).json({ project: savedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    console.log(projects);

    // Iterate through projects and fetch project manager data
    const projectsWithManagerData = await Promise.all(
      projects.map(async (project) => {
        const employe = await Employe.findById(project.projectManager);
        console.log("user is " + employe);

        // Return a new object with the project manager's data
        return {
          ...project.toObject(),
          projectManagerData: employe,
        };
      })
    );

    res.status(200).json(projectsWithManagerData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Le projet n'a pas été trouvé." });
    }
    return res.status(200).json(project);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du projet.' });
  }
}


exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, team, tasks, projectManager } = req.body;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    project.name = name || project.name;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.team = team || project.team;
    project.tasks = tasks || project.tasks;
    project.projectManager = projectManager || project.projectManager;
    await project.save();
    res.status(200).json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.remove();
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Function to assign a user as project manager
exports.assignProjectManager= async (req, res) =>{
    const { projectId, emplyerId } = req.body;
  
    try {
      // Find the project by ID
      const project = await Project.findById(projectId);
  
      // Assign the user as project manager
      project.projectManager = emplyerId;
  
      // Save the changes to the project
      await project.save();
  
      res.status(200).json({ success: true, message: `User with ID ${emplyerId} has been assigned as project manager for project with ID ${projectId}.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error assigning user as project manager.' });
    }
  };
  
  // Function to add a user to the team members of the project
  exports.addTeamMember = async (req, res) =>{
    const { projectId, emplyerId } = req.body;
  
    try {
      // Find the project by ID
      const project = await Project.findById(projectId);
  
      // Add the user to the team members
      project.team.push(emplyerId);
  
      // Save the changes to the project
      await project.save();
  
      res.status(200).json({ success: true, message: `User with ID  has been added to the team members of project with ID ${projectId}.` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error adding user to the team members of the project.' });
    }
  };
