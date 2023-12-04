# ***Task Manager***

*This project helps with managing tasks and teams for the organization for various projects.*

## **Tech Stack**
- **NestJS**
- **TypeORM**
- **MySQL**
- **Docker,Docker Compose (For Running MySQL Server)**


## **API Endpoints**

### ***Create Teams With new Members***
Creates a new Team with multiple new members. 
- **path**:- /teams
- **method**:- POST
- **body** :-
    - name(string): name of team
    - *members* : array of team members tbe created each member contains :
      - name(string): name of the member

### ***Create Multiple Task with/without Assignee***
Creates multiple tasks with/without assignee.
- **path**:- /tasks/create
- **method**:- POST
- **body** :-
  - *tasks*: array of task
    - description(string): Description of task
    - dueDate(Date string): Due Date for task
    - assignee(number,optional): Id of member to whom the task is assigned


### ***Assign Task to A Member***
Assign A already Made Task to a member.
- **path**:- /tasks/:id/assign
- **method**:- POST
- **parameters**:- 
  - id (number): Id of the task
- **body**:-
  - assignee (number): Id of the member

### ***Load All Tasks with Their respective Assignee***
Get All Task With assignee.
- **path**:- /tasks
- **method**:- GET


### ***Change Status/Properties***
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

