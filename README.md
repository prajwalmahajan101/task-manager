# ***Task Manager***

*This project helps with managing tasks and teams for the organization for various projects.*

## **Tech Stack**
- **NestJS**
- **TypeORM**
- **MySQL**
- **Docker,Docker Compose (For Running MySQL Server)**


## **API Endpoints**

> ### *****Task*****

- ####  ***Create Multiple Task with/without Assignee***
Creates multiple tasks with/without assignee. Also the Assignee has to be already created. 

- **path**:- /tasks/create
- **method**:- POST
- **body** :-
  - *tasks*: array of task
    - description(string): Description of task
    - dueDate(Date string): Due Date for task
    - assignee(number,optional): Id of member to whom the task is assigned

- #### ***Assign Task to A Member***
Assign A already Made Task to a member.
- **path**:- /tasks/:id/assign
- **method**:- POST
- **parameters**:- 
  - id (number): Id of the task
- **body**:-
  - assignee (number): Id of the member

- #### ***Load All Tasks with Their respective Assignee***
Get All Task With assignee.
- **path**:- /tasks
- **method**:- GET

- #### ***Change Status/Properties***
Update Task. Doesn't Allow to Change Assignee.
- **path**:- /tasks/:id
- **method**:- PATCH
- **parameters**:-
  - id (number): Id for the task
- **body**:-
  - description (string,optional): Description of task
  - dueDate (Date String(YYYY-MM-DD),optional): Due Date for task
  - *status* (string,optional):
    - not-started : Task Not Started
    - completed : Task Completed
    - in-progress : Task In Progress

- #### - ***Load A Task***
Get Specific Task with assignee.
- **path**:- /tasks/:id
- **method**:- GET
- **parameters**:-
  - id (number): Id for the task

- #### ***Create Single Task***
Create a single task with/without assignee.
- **path**:- /tasks
- **method**:- POST
- **body**:-
  - description (string): Description of the task
  - dueDate (Date String, YYYY-MM-DD): Due Date of the task
  - assignee (number,optional): Id of member to whom  you want to assign the task

> ### *****Team*****

- #### ***Create Teams With new Members***
Creates a new Team with multiple new members.
- **path**:- /teams
- **method**:- POST
- **body** :-
  - name(string): name of team
  - *members* : array of team members tbe created each member contains :
    - name(string): name of the member

- #### ***Load All Teams***
Get All Teams with members.
- **path**:- /teams
- **method**:- GET

- #### ***Load Specific Team's Details***
Get Specific Team with members.
- **path**:- /teams/:id
- **method**:- GET
- **parameters**:-
  - id (number): Id for the team

- #### ***Load Members of a Team***
- **path**:- /teams/:id/members
- **method**:- GET
- **parameters**:-
  - id (number): Id for the team

> ### *****Member*****

- #### ***Load All Task for A Member***
Get All Tasks for a Member

- **path**:- /members/:id/tasks
- **method**:- GET
- **parameters**:-
  - id (number):id of the member

- #### ***Load Members With Task***
Get All Members with Task
- **path**:- /members
- **method**:- GET

- #### ***Load A Members Details***
Get All Details of A Member
- **path**:- /members/:id
- **method**:- GET
- **parameters**:-
  - id (number):id of the member

> ### *****Auth*****

- #### ***Sign***
Dummy Sign In for User. Needed Due to All other End Points are protected and need a JWT token to get access.
*JWT token is valid for 10 hours*. 
- **path**:- /auth/login
- **method**:- POST
- **body**:-
  - username (string): prajwal {hard Coded}
  - password (string): admin {hard Coded}


## **TODO**
- **Proper Authentication** 
- **More Details to Team like number of members, Tech Stack, Manager, Assigned Project, Domain(Dev,Testing...)...**
- **More Details to Member like Designation, Specialization, Years of Experience...**
- **Model for Project and Task related to Specific Project**