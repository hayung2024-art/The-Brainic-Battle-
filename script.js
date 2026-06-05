let questionBank =
JSON.parse(localStorage.getItem("questionBank")) || [];

let leaderboardData =
JSON.parse(localStorage.getItem("leaderboard")) || [];

let selectedQuestions = [];
let score = 0;
let timerInterval;
let timeLeft = 100;

// ADMIN FUNCTIONS

function saveQuestions(){
localStorage.setItem(
"questionBank",
JSON.stringify(questionBank)
);
}

function loadQuestions(){

const list =
document.getElementById("questionList");

if(!list) return;

let html = "";

questionBank.forEach((q,index)=>{

html += `
<div class="question">
<b>${index+1}. ${q.question}</b><br>
${q.options.join("<br>")}
<br><br>
<button onclick="deleteQuestion(${index})">
Delete
</button>
</div>
`;

});

list.innerHTML = html;
}

function addQuestion(){

const question =
document.getElementById("question").value;

const option1 =
document.getElementById("option1").value;

const option2 =
document.getElementById("option2").value;

const option3 =
document.getElementById("option3").value;

const option4 =
document.getElementById("option4").value;

const answer =
document.getElementById("answer").value;

if(
!question ||
!option1 ||
!option2 ||
!option3 ||
!option4 ||
!answer
){
alert("Fill all fields");
return;
}

questionBank.push({
question,
options:[
option1,
option2,
option3,
option4
],
answer
});

saveQuestions();
loadQuestions();

alert("Question Added");
}

function deleteQuestion(index){

questionBank.splice(index,1);

saveQuestions();
loadQuestions();
}

// QUIZ FUNCTIONS

function getRandomQuestions(count){

let shuffled =
[...questionBank]
.sort(()=>0.5-Math.random());

return shuffled.slice(0,count);
}

function startQuiz(){

const username =
document.getElementById("username");

if(!username) return;

const regno =
document.getElementById("regno").value;

const password =
document.getElementById("userpassword").value;

if(
regno === "" ||
username.value === "" ||
password === ""
){
alert(
"Please fill Registration Number, Name and Password"
);
return;
}

selectedQuestions =
getRandomQuestions(5);

let html = "";

selectedQuestions.forEach((q,index)=>{

html += `
<div class="question">
<h3>${index+1}. ${q.question}</h3>
`;

q.options.forEach(option=>{

html += `
<label>
<input type="radio"
name="q${index}"
value="${option}">
${option}
</label><br>
`;

});

html += "</div>";

});

document.getElementById(
"quizForm"
).innerHTML = html;

document.getElementById(
"quizSection"
).classList.remove("hidden");

startTimer();
}

function startTimer(){

timeLeft = 100;

document.getElementById(
"timer"
).innerText = timeLeft;

clearInterval(timerInterval);

timerInterval = setInterval(()=>{

timeLeft--;

document.getElementById(
"timer"
).innerText = timeLeft;

if(timeLeft<=0){

clearInterval(timerInterval);

submitQuiz();
}

},1000);
}

function submitQuiz(){

clearInterval(timerInterval);

score = 0;

selectedQuestions.forEach((q,index)=>{

const selected =
document.querySelector(
`input[name="q${index}"]:checked`
);

if(
selected &&
selected.value===q.answer
){
score++;
}

});

showResult();
}
function resetQuiz(){

clearInterval(timerInterval);

score = 0;

selectedQuestions = [];

document.getElementById(
"quizForm"
).innerHTML = "";

document.getElementById(
"quizSection"
).classList.add("hidden");

document.getElementById(
"resultSection"
).classList.add("hidden");

document.getElementById(
"username"
).value = "";

document.getElementById(
"timer"
).innerText = "100";
}
function downloadCertificate(){

const username =
document.getElementById("username").value;

const regno =
document.getElementById("regno").value;

const win =
window.open("","_blank");

win.document.write(`
<!DOCTYPE html>
<html>
<head>
<title>Certificate</title>

<style>

@page{
size:A4 landscape;
margin:0;
}

body{
margin:0;
padding:20px;
background:#f0f0f0;
font-family:'Times New Roman',serif;
}

.certificate{

width:297mm;
height:210mm;

margin:auto;

background:white;

border:15px solid gold;

padding:40px;

box-sizing:border-box;

text-align:center;

position:relative;

overflow:hidden;
}

.certificate:before{
content:"";
position:absolute;
top:0;
left:0;
right:0;
height:20px;

background:linear-gradient(
90deg,
red,
orange,
yellow,
green,
blue,
indigo,
violet
);
}

.certificate:after{
content:"";
position:absolute;
bottom:0;
left:0;
right:0;
height:20px;

background:linear-gradient(
90deg,
red,
orange,
yellow,
green,
blue,
indigo,
violet
);
}

.trophy{
font-size:80px;
margin-top:10px;
}

.title{
font-size:48px;
font-weight:bold;
color:#b8860b;
margin-top:10px;
}

.subtitle{
font-size:28px;
margin-top:10px;
color:#333;
}

.text{
font-size:24px;
margin-top:20px;
}

.name{
font-size:42px;
font-weight:bold;
color:#1a237e;
margin:25px 0;
text-decoration:underline;
}

.reg{
font-size:24px;
margin-bottom:20px;
}

.score{
font-size:30px;
font-weight:bold;
color:#e65100;
margin-top:20px;
}

.footer{
display:flex;
justify-content:space-between;
margin-top:60px;
padding:0 50px;
font-size:20px;
}

.sign{
border-top:2px solid black;
width:220px;
padding-top:10px;
}

</style>
</head>

<body>

<div class="certificate">

<div class="trophy">🏆</div>

<div class="title">
CERTIFICATE OF PARTICIPATION
</div>

<div class="subtitle">
THE BRAINIC BATTLE QUIZ COMPETITION
</div>

<div class="text">
This certificate is proudly presented to
</div>

<div class="name">
${username}
</div>

<div class="reg">
Registration No: <b>${regno}</b>
</div>

<div class="text">
For successfully participating in
The Brainic Battle Quiz Competition
</div>

<div class="score">
Score: ${score}/${selectedQuestions.length}
</div>

<div class="footer">

<div>
Date:<br>
${new Date().toLocaleDateString()}
</div>

<div class="sign">
Organizer Signature
</div>

</div>

</div>

<script>
window.print();
<\/script>

</body>
</html>
`);

win.document.close();

}
function showResult(){

document.getElementById(
"quizSection"
).classList.add("hidden");

const result =
document.getElementById(
"resultSection"
);

result.classList.remove("hidden");

let percentage =
(score / selectedQuestions.length) * 100;

let status =
percentage >= 40 ? "PASS" : "FAIL";

let html = `
<h2>Score: ${score}/${selectedQuestions.length}</h2>

<h3>Percentage: ${percentage.toFixed(2)}%</h3>

<h3>Status: ${status}</h3>

<hr>

<h2>Answer Review</h2>
`;

selectedQuestions.forEach((question,index)=>{

const selected =
document.querySelector(
`input[name="q${index}"]:checked`
);

const userAnswer =
selected ? selected.value : "Not Answered";

const correct =
userAnswer === question.answer;

html += `
<div class="question"
style="
background:${
correct ? '#d4edda' : '#f8d7da'
};
">

<b>Q${index+1}:
${question.question}</b>

<br><br>

Your Answer:
${userAnswer}

<br>

Correct Answer:
${question.answer}

<br><br>

<b>
${correct ? '✓ Correct' : '✗ Wrong'}
</b>

</div>
`;

});

html += `

<button onclick="downloadCertificate()">
Download Certificate
</button>

<button onclick="resetQuiz()">
Reset Quiz
</button>
`;

result.innerHTML = html;

const username =
document.getElementById(
"username"
).value;

const regno =
document.getElementById("regno").value;

leaderboardData.push({
regno: regno,
name: username,
score: score
});

localStorage.setItem(
"leaderboard",
JSON.stringify(leaderboardData)
);

updateLeaderboard();
}
// LEADERBOARD

function updateLeaderboard(){

const board =
document.getElementById(
"leaderboard"
);

if(!board) return;

let sorted =
leaderboardData.sort(
(a,b)=>b.score-a.score
);

let html="";

sorted.forEach((user,index)=>{

html += `
<tr>
<td>${index+1}</td>
<td>${user.regno}</td>
<td>${user.name}</td>
<td>${user.score}</td>
</tr>
`;

});

board.innerHTML = html;
}
if(questionBank.length === 0){

questionBank.push(

{
question:"What is the capital of India?",
options:[
"Delhi",
"Mumbai",
"Kolkata",
"Chennai"
],
answer:"Delhi"
},

{
question:"2 + 2 = ?",
options:[
"3",
"4",
"5",
"6"
],
answer:"4"
},

{
question:"Largest planet in the Solar System?",
options:[
"Earth",
"Mars",
"Jupiter",
"Venus"
],
answer:"Jupiter"
},

{
question:"HTML stands for?",
options:[
"Hyper Text Markup Language",
"Home Tool Markup Language",
"Hyper Transfer Markup Language",
"Hyper Tool Markup Language"
],
answer:"Hyper Text Markup Language"
},

{
question:"National Animal of India?",
options:[
"Tiger",
"Lion",
"Elephant",
"Horse"
],
answer:"Tiger"
},

{
question:"Who is known as the Father of the Nation in India?",
options:[
"Jawaharlal Nehru",
"Mahatma Gandhi",
"Subhas Chandra Bose",
"Sardar Patel"
],
answer:"Mahatma Gandhi"
},

{
question:"Which language is used for web page styling?",
options:[
"HTML",
"CSS",
"Python",
"Java"
],
answer:"CSS"
},

{
question:"How many continents are there in the world?",
options:[
"5",
"6",
"7",
"8"
],
answer:"7"
},

{
question:"Which is the largest ocean?",
options:[
"Indian Ocean",
"Atlantic Ocean",
"Pacific Ocean",
"Arctic Ocean"
],
answer:"Pacific Ocean"
},

{
question:"What is the national bird of India?",
options:[
"Parrot",
"Peacock",
"Eagle",
"Sparrow"
],
answer:"Peacock"
},

{
question:"Which planet is called the Red Planet?",
options:[
"Earth",
"Venus",
"Mars",
"Saturn"
],
answer:"Mars"
},

{
question:"Who invented the telephone?",
options:[
"Thomas Edison",
"Alexander Graham Bell",
"Nikola Tesla",
"Isaac Newton"
],
answer:"Alexander Graham Bell"
},

{
question:"What is the square root of 64?",
options:[
"6",
"7",
"8",
"9"
],
answer:"8"
},

{
question:"Which country is known as the Land of the Rising Sun?",
options:[
"China",
"Japan",
"Thailand",
"South Korea"
],
answer:"Japan"
},

{
question:"Which gas do plants absorb from the atmosphere?",
options:[
"Oxygen",
"Nitrogen",
"Carbon Dioxide",
"Hydrogen"
],
answer:"Carbon Dioxide"
}

);

saveQuestions();
}
loadQuestions();
updateLeaderboard();