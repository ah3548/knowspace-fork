# knowspace

### Problem Statement:

We aim to change the way adults (>14) approach education. Many learning styles exist and our approach is to let the user figure that out themselves. We do this by treating learning as a "Choose Your Own Adventure" game. By presenting the "Knowledge Space" through a node graph visualization we give the student a map. Along the journey we leverage the stack overflow API and the <a href="http://www.cs.cmu.edu/~dmovshov/papers/asonam_2013.pdf">StackOverflow Reputation System</a> to present discussions around relevant topics. To drill in further we leverage Wikipedia to give clarification around complex topics.
The ultimate goal is that users can provide back into stack overflow their opinions, metaphors, guidance, analogies, and so much more to further improve our topic associations. For example, I was a mechanic but know nothing about linear algebra. Could we describe the topic in terms of how car engines operate? As our application learns more from user interaction and users' private information we can further improve how and which information we should present to users in a probabilistic way. At its core we aim to prove that yes 90% of people find describing code as cooking recipes but 10% might understand it better through karaoke song selection techniques. There are as many possibilities as people in the world are learning right now. 
	
### Current Scope:

As a proof of concept we are going to present a use case to learn linear algebra using our tool. 
We are going to use elastic search to determine topic relationships.
    
### Future Scope:
* A key improvement would be the ability to write data back into stack overflow so that interaction is live and interactive. 
* Stack overflow is not the be-all and end-all of subject forums, i.e. integration with reddit could improve our information repository.
* The tool can be applied to a classroom setting where teachers are experts guiding students along their journey.
* Gamification of tool can further improve motivation, i.e. awarding badges.
* Further research can be done on stack overflow question and answer owners.
* Non-text based information (i.e. images) can be cataloged as well.
* The tool can be further improved with natural language processing offered by node-natural. 

### Existing Results:
* All existing knowledge bases require pre-compiled knowledge (i.e. Khan Academy, Coursera, etc.) created by paid content creators. The summarize, compile, and pre-prescribe a regimented path.
* Khan Academy tried a similar <a href="https://www.khanacademy.org/exercisedashboard">Exercise Dashboard</a> but simply as a tie in to their existing platform rather than proposing topic relationship.
* Slides/Videos/Images - all prepared material
* Teachers/Grading/Stress - This platform is for learning for the sake of learning
	
### New Method:

Use existing Knowledge Base and Present in New Friendly Manner (Node Graph, Stack Overflow Conversation, and Wiki Articles)
Dynamically modifies content to provide non-regimented education flow
	
### Hypothesis:

Existing education platforms treat the pursuit of knowledge as a regimented set of steps. Unfortunately not everyone can follow the same steps but rather must pave their own path. In addition, static content with regimented steps do not motivate curiosity and creativity. Knowledge space aims to present information in an interactive dynamic way. At the core of the platform is that philosophy that we each must create our own map. Wikipedia is a good starting point but in aggregate with stack overflow we can begin challenging ourselves to find the answers. 

### Technology Stack
| TECHNOLOGY | IMPLEMENTATION |
| ---------- | --------------- |
| WIKIPEDIA  | NodeJs Http Client against Wikipedia Api |
| ELASTIC SEARCH | NodeJS Client against Local Elastic Search 5.3.0 API</li></ul> |
| UI |  <ul><li>AngularJS 1.x </li><li>Bootstrap</li><li>Cytoscape</li></ul> |


Steps to Run:
1. [Download Elastic Search](https://www.elastic.co/downloads/elasticsearch)
2. Unzip Elastic Search package
3. `cd elasticsearch-5.x.x/bin` (folder path is based on your package)
4. Run elasticsearch.bat (Windows) or elasticsearch (Linux)
5. (OPTIONAL) [Download Kibana](https://www.elastic.co/downloads/kibana)
6. (OPTIONAL) Unzip Kibana package
7. (OPTIONAL) `cd kibana-5.x.x-<OS>/bin`
8. (OPTIONAL) Run kibana
9. (OPTIONAL) Check if kibana is running - http://linserv2.cims.nyu.edu:19909
10. Clone knowspace-fork from this repo
11. `cd knowspace-fork`
11. `module load node-6.9.1` 
12. `npm install`
13. `node ks`
14. Navigate to application - http://linserv2.cims.nyu.edu:19910/ks/
