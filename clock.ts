$(document).ready(function() {
$(".modal").modal();
}); 

function displayError(err) {
alert(err);
}

function parseTime(timeStr) {
let timeInt = -1; 
let colonPos = timeStr.indexOf(":");

// If a colon exists, slice it out
if (colonPos > -1) {
let hours = timeStr.slice(0, colonPos);
let minutes = timeStr.slice(colonPos + 1, timeStr.length);
timeInt = parseInt(hours + minutes);

// Otherwise, just parse it as a normal int
} else {
timeInt = parseInt(timeStr);
}

// If the int is a valid representation of a real time, return it
if (timeInt > 0 && timeInt <= 2400) {
return timeInt;
} else {
console.log(`Error, invalid time input: ${timeInt}`);
return -1; // TODO: Throw error later on
}
}

function getBellCount(time) {
if (time == 0) return 0
else if (((time/100) % 12) == 0) return 12
return (time/100) % 12
}

function getBellCountAll(startTime, endTime) {
let totalBellCount = 0;
let pStartTime = parseTime(startTime)
let pEndTime = parseTime(endTime)

if (pStartTime < pEndTime) {
while (pStartTime <= pEndTime) {
  if (pStartTime % 100 == 0)
    totalBellCount += getBellCount(pStartTime);
  pStartTime++;
}
} else if (pStartTime > pEndTime) {
while (pStartTime <= 2400) {
  if (pStartTime % 100 == 0)
    totalBellCount += getBellCount(pStartTime);
  pStartTime++;
}

let i = 1;
while (i <= pEndTime) {
  if (i % 100 == 0)
    totalBellCount += getBellCount(i);
  i++;
}
} else {
totalBellCount = 78;
}

return totalBellCount;
}

class ClockTower {
lastBellCount: number;

constructor() {
this.lastBellCount = 0;
}

countBells(startTime, endTime) {
let bellCount = getBellCountAll(startTime, endTime);
updateTimeDisplay(startTime, endTime, bellCount);
this.lastBellCount = bellCount;
return bellCount;
}

/*
* Play bells based on lastBellCount
*/
playBells(count) {
if (count == undefined) {
  console.log(`Using last bell count of ${this.lastBellCount}`)
  this.playBells(this.lastBellCount);
} else if (count >= 1) {
  console.log(`Playing count #${count}...`)
  playBellSound()
  count -= 1
  setTimeout(() => {
    console.log(count)
    this.playBells(count)
  }, 6000)
} else {
  console.log("End of count.")
}
}
}

let myClockTower = new ClockTower();

/*
* Upon clicking "Calculate" Button...
* Opens modal and populates with bell count information.
* @function displayBellCount
*/
function displayBellCount() {
let startTimeInput = document.getElementById("startTimeInput").value;
let endTimeInput = document.getElementById("endTimeInput").value;

if (startTimeInput && endTimeInput) {
let bellCount = myClockTower.countBells(startTimeInput, endTimeInput);
if (bellCount < 0) {
  alert("Invalid input detected!");
} else {
  $("#modal1").modal("open");
}
} else {
displayError("Please fill out Start Time and End Time!");
}
}

function playBellsUsingCount() {
myClockTower.playBells()
}

/* === Test Cases ===
1. INPUT $startTime = '2:00'; $endTime = '3:00'; OUTPUT 5
2. INPUT $startTime = '14:00'; $endTime = '15:00'; OUTPUT 5
3. INPUT $startTime = '14:23'; $endTime = '15:42'; OUTPUT 3
4. INPUT $startTime = '23:00'; $endTime = '1:00'; OUTPUT 24
*/

function test() {
console.log(
`
getBellCountAll("2:00", "3:00") - Expected 5. Actual ${getBellCountAll("2:00", "3:00")}.
getBellCountAll("14:00", "15:00") - Expected: 5. Actual ${getBellCountAll("14:00", "15:00")}.
getBellCountAll("14:23", "15:42") - Expected: 3. Actual: ${getBellCountAll("14:23", "15:42")}.
getBellCountAll("23:00", "1:00") - Expected: 24. Actual: ${getBellCountAll("23:00", "1:00")}.
`
)
}

//====== Extra ======

// Modals

function updateTimeDisplay(startTime, endTime, bellCount) {
let timeModalText = document.getElementById("timeModalText");
timeModalText.innerHTML = `
  The number of times the clock tower bell will ring between
  <strong>${startTime}</strong> and <strong>${endTime}</strong> is...
`;

let countDisplay = document.getElementById("countDisplay");
countDisplay.innerHTML = bellCount;
}

interface AudioObject {
src: String; // AudioObjects require a source path to a valid audio file
title?: String; // AudioObjects may have a title field to describe the audio file
overlap?: Boolean; // Optional boolean value that toggles audio overlapping
}

class AudioPlayer {
audioObj: AudioObject;
audioPlayer: any;

constructor(audioObj: AudioObject) {
this.audioObj = audioObj;
}

// Uses the 'src' property of the passed in AudioObject, creates an audio element,
// and plays it.
play() {
if (this.audioPlayer && !this.audioObj.overlap) this.audioPlayer.pause();
if (this.audioObj.title) console.log(`Now playing ${this.audioObj.title}!`);
this.audioPlayer = new Audio(this.audioObj.src);
this.audioPlayer.play();
}
}

// AudioPlayer Usage:
let clockBellAudio = {
src:
"https://d1490khl9dq1ow.cloudfront.net/sfx/mp3preview/tolling-2_MJTcAnEd.mp3",
title: "Clock Bell Tolling Audio Clip",
overlap: false
};

let clockBellPlayer = new AudioPlayer(clockBellAudio);

function playBellSound() {
clockBellPlayer.play();
}
