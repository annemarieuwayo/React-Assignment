
//  SOLVIT Academy
//



// PART 1: STUDENT REGISTRATION


const students = [
  { name: "Alice", age: 22, score: 85 },
  { name: "Bob", age: 17, score: 92 },
  { name: "Charlie", age: 25, score: 45 },
  { name: "David", age: 19, score: 78 },
  { name: "Emma", age: 21, score: 95 },
  { name: "Frank", age: 16, score: 88 },
  { name: "Grace", age: 23, score: 67 },
  { name: "Henry", age: 20, score: 100 },
  { name: "Ivy", age: 18, score: 55 },
  { name: "Jack", age: 24, score: 73 }
];

// 
// Twist 1: Students younger than 18 are not allowed to participate.
// Remove them WITHOUT creating a new array.
//
// We use splice() on the same array. We loop BACKWARDS, because when
// an item is removed, the items after it move one place to the left.
// Looping backwards means we never skip a student.
// 
function twist1RemoveUnderage(list) {
  const removed = [];
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i].age < 18) {
      removed.unshift(list[i]); // keep them in original order for display
      list.splice(i, 1);        // remove from the SAME array
    }
  }
  return removed;
}

function part1Registration(list) {
  printTitle("PART 1: STUDENT REGISTRATION");
  console.log(`Registered students: ${list.length}`);

  // Final Boss Twists 9 and 10 also apply at registration (see below)
  const invalid = twist9RemoveInvalid(list);
  const duplicates = twist10RemoveDuplicates(list);
  const underage = twist1RemoveUnderage(list);

  invalid.forEach((s) => console.log(`  Twist 9  - removed ${s.name}: invalid age or score`));
  duplicates.forEach((s) => console.log(`  Twist 10 - removed ${s.name}: duplicate name`));
  underage.forEach((s) => console.log(`  Twist 1  - removed ${s.name}: age ${s.age} is under 18`));

  console.log(`Eligible students: ${list.map((s) => s.name).join(", ") || "none"}`);

  return invalid.length + duplicates.length + underage.length;
}


 
// PART 2: THE EXAMINATION
 

// 1. Generate a random score between 0 and 100
function randomScore() {
  return Math.floor(Math.random() * 101); // 0, 1, 2, ... 100
}

// Round to one decimal place, e.g. 76.6666 -> 76.7
function roundOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

function part2Examination(list) {
  printTitle("PART 2: THE EXAMINATION");

  list.forEach((student) => {
    // 1. Three random examination scores
    student.exams = [randomScore(), randomScore(), randomScore()];

    // 2. Average examination score
    const total = student.exams.reduce((sum, mark) => sum + mark, 0);
    student.average = roundOneDecimal(total / student.exams.length);

    // The final score starts as the average
    student.finalScore = student.average;

    let note = "";

    // Twist 2: 100 in all three examinations -> bonus of 20 points
    if (student.exams.every((mark) => mark === 100)) {
      student.finalScore += 20;
      note += " | Twist 2: +20 (three 100s)";
    }

    // Twist 3: below 30 in ANY examination -> deduct 15 points
    if (student.exams.some((mark) => mark < 30)) {
      student.finalScore -= 15;
      note += " | Twist 3: -15 (a mark below 30)";
    }

    student.finalScore = roundOneDecimal(student.finalScore);

    console.log(
      `${student.name.padEnd(8)} exams [${student.exams.join(", ")}] ` +
        `average ${student.average} -> ${student.finalScore}${note}`
    );
  });
}



// PART 3: THE MYSTERIOUS HACKER


const suspiciousStudents = ["Alice", "Henry", "Grace"];

// Twist 4: how many points each suspicious student loses
const hackerPenalties = { Alice: 10, Henry: 20, Grace: 5 };

function twist4HackerPenalty(list) {
  list.forEach((student) => {
    student.hacked = suspiciousStudents.includes(student.name);

    if (student.hacked) {
      const penalty = hackerPenalties[student.name];
      student.finalScore = roundOneDecimal(student.finalScore - penalty);
      console.log(`  Twist 4 - ${student.name} loses ${penalty} points -> ${student.finalScore}`);
    }
    // All other students remain unaffected
  });
}

// Twist 5: above 100 becomes exactly 100, below 0 becomes 0
function twist5LimitScores(list) {
  list.forEach((student) => {
    if (student.finalScore > 100) {
      console.log(`  Twist 5 - ${student.name}: ${student.finalScore} -> 100`);
      student.finalScore = 100;
    } else if (student.finalScore < 0) {
      console.log(`  Twist 5 - ${student.name}: ${student.finalScore} -> 0`);
      student.finalScore = 0;
    }
  });
}

function part3Hacker(list) {
  printTitle("PART 3: THE MYSTERIOUS HACKER");
  console.log(`Suspicious students: ${suspiciousStudents.join(", ")}`);
  twist4HackerPenalty(list);
  twist5LimitScores(list);
}



// PART 4: THE SECRET MISSION


// Only ONE bonus per student. We check the biggest bonus first and stop
// at the first rule that matches.
// (Example: "Alice" starts with A AND contains a and e -> gets 15.)
function getSecretMissionBonus(name) {
  const lower = name.toLowerCase(); // case-insensitive

  if (lower.includes("a") && lower.includes("e")) return 15; // both a and e
  if (lower.startsWith("a")) return 10;                      // starts with A
  if (lower.includes("a")) return 5;                         // contains a
  return 0;
}

function part4SecretMission(list) {
  printTitle("PART 4: THE SECRET MISSION");

  list.forEach((student) => {
    // Twist 6: a student penalised by the hacker gets NO bonus
    if (student.hacked) {
      console.log(`  ${student.name}: no bonus (Twist 6 - penalised by the hacker)`);
      return;
    }

    const bonus = getSecretMissionBonus(student.name);
    if (bonus > 0) {
      student.finalScore = roundOneDecimal(student.finalScore + bonus);
      console.log(`  ${student.name}: +${bonus} -> ${student.finalScore}`);
    } else {
      console.log(`  ${student.name}: no bonus (no letter "a" in name)`);
    }
  });

  // The bonus can push a score above 100, so apply Twist 5 again
  twist5LimitScores(list);
}




// PART 5: THE COMPETITION RANKING


// Twist 7: same score -> older student wins
//          same age   -> name that comes first alphabetically wins
function rankStudents(list) {
  return [...list].sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    if (b.age !== a.age) return b.age - a.age;
    return a.name.localeCompare(b.name);
  });
}

function part5Ranking(list) {
  printTitle("PART 5: THE COMPETITION RANKING");

  const ranking = rankStudents(list);
  ranking.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.name.padEnd(8)} score ${s.finalScore}  (age ${s.age})`);
  });

  console.log("\nTop three:");
  ranking.slice(0, 3).forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.name} - ${s.finalScore}`);
  });

  return ranking;
}



// PART 6: THE UNEXPECTED BETRAYAL


// Twist 8: disqualify the highest-ranked student, so everyone moves up.
// BUT if the highest-ranked student is younger than 20,
// disqualify the second-ranked student instead.
function part6Betrayal(ranking) {
  printTitle("PART 6: THE UNEXPECTED BETRAYAL");

  if (ranking.length === 0) {
    console.log("  Nobody to disqualify.");
    return ranking;
  }

  let cheaterIndex = 0;
  if (ranking[0].age < 20 && ranking.length > 1) {
    cheaterIndex = 1;
    console.log(`  ${ranking[0].name} is ranked first but is younger than 20 (age ${ranking[0].age}).`);
    console.log(`  So the second-ranked student is disqualified instead.`);
  }

  const cheater = ranking[cheaterIndex];
  console.log(`  Disqualified: ${cheater.name} (score ${cheater.finalScore})`);

  // Remove the cheater; everybody below moves up one place
  return ranking.filter((_, i) => i !== cheaterIndex);
}



// PART 7: THE FINAL REPORT


function part7FinalReport(totalRegistered, eligible, disqualified, finalRanking) {
  const line = "====================================";

  printTitle("PART 7: THE FINAL REPORT");
  console.log("\n" + line);
  console.log("       SOLVIT ACADEMY RESULTS");
  console.log(line + "\n");

  console.log(`Total Registered Students: ${totalRegistered}`);
  console.log(`Eligible Students: ${eligible}`);
  console.log(`Disqualified Students: ${disqualified}\n`);

  // Twist 11: if all students are disqualified
  if (finalRanking.length === 0) {
    console.log("No winner today!\n");
    console.log(line);
    return;
  }

  const places = ["WINNER", "SECOND PLACE", "THIRD PLACE"];
  finalRanking.slice(0, 3).forEach((student, i) => {
    console.log(`${places[i]}: ${student.name}`);
    console.log(`Score: ${student.finalScore}\n`);
  });

  // Summary uses the students left AFTER the betrayal (Part 6)
  const scores = finalRanking.map((s) => s.finalScore);

  console.log(line);
  console.log("        COMPETITION SUMMARY");
  console.log(line + "\n");

  console.log(`Highest Score: ${Math.max(...scores)}`);
  console.log(`Lowest Score: ${Math.min(...scores)}`);
  console.log(`Average Score: ${classAverage(finalRanking)}\n`);

  console.log("Congratulations to all participants!");
  console.log(line);
}



// FINAL BOSS: ADDITIONAL TWISTS (9 - 15)


// Twist 9: a student cannot have a negative age or a score outside 0-100
function isValidStudent(student) {
  return (
    typeof student.name === "string" &&
    student.name.trim() !== "" &&
    typeof student.age === "number" &&
    student.age >= 0 &&
    typeof student.score === "number" &&
    student.score >= 0 &&
    student.score <= 100
  );
}

function twist9RemoveInvalid(list) {
  const removed = [];
  for (let i = list.length - 1; i >= 0; i--) {
    if (!isValidStudent(list[i])) {
      removed.unshift(list[i]);
      list.splice(i, 1);
    }
  }
  return removed;
}

// Twist 10: identical names -> keep only the FIRST registered student
function twist10RemoveDuplicates(list) {
  const removed = [];
  for (let i = list.length - 1; i >= 0; i--) {
    const name = list[i].name.toLowerCase();
    // look for the same name EARLIER in the list
    const firstIndex = list.findIndex((s) => s.name.toLowerCase() === name);
    if (firstIndex < i) {
      removed.unshift(list[i]);
      list.splice(i, 1);
    }
  }
  return removed;
}

// Twist 11 is inside part7FinalReport ("No winner today!")

// Twist 12: search for a student by name (case-insensitive)
function twist12SearchStudent(list, name) {
  return list.find((s) => s.name.toLowerCase() === name.toLowerCase()) || null;
}

// Helper: class average of final scores
function classAverage(list) {
  if (list.length === 0) return 0;
  const total = list.reduce((sum, s) => sum + s.finalScore, 0);
  return roundOneDecimal(total / list.length);
}

// Twist 13: students whose final scores are above the class average
function twist13AboveAverage(list) {
  const average = classAverage(list);
  return list.filter((s) => s.finalScore > average);
}

// Twist 14: the student with the longest name
function twist14LongestName(list) {
  if (list.length === 0) return null;
  return list.reduce((longest, s) => (s.name.length > longest.name.length ? s : longest));
}

// Twist 15: names in reverse alphabetical order
function twist15ReverseAlphabetical(list) {
  return list.map((s) => s.name).sort((a, b) => b.localeCompare(a));
}

function finalBoss(list, searchName) {
  printTitle("FINAL BOSS: ADDITIONAL TWISTS");

  console.log("Twist 9  - Invalid students (negative age / score outside 0-100) removed at registration");
  console.log("Twist 10 - Duplicate names removed at registration (first one kept)");
  console.log("Twist 11 - \"No winner today!\" is shown when nobody is left");

  // Twist 12
  const found = twist12SearchStudent(list, searchName);
  if (found) {
    console.log(`Twist 12 - Search "${searchName}": found, age ${found.age}, final score ${found.finalScore}`);
  } else {
    console.log(`Twist 12 - Search "${searchName}": student not found`);
  }

  // Twist 13
  const above = twist13AboveAverage(list);
  console.log(
    `Twist 13 - Above the class average of all eligible students (${classAverage(list)}): ` +
      (above.map((s) => `${s.name} (${s.finalScore})`).join(", ") || "none")
  );

  // Twist 14
  const longest = twist14LongestName(list);
  console.log(`Twist 14 - Longest name: ${longest ? longest.name : "none"}`);

  // Twist 15
  console.log(`Twist 15 - Reverse alphabetical order: ${twist15ReverseAlphabetical(list).join(", ") || "none"}`);
}



// HELPERS


function printTitle(title) {
  console.log("\n------------------------------------");
  console.log(title);
  console.log("------------------------------------");
}



// RUN THE COMPETITION (Part 1 -> Part 7 -> Final Boss)


function runCompetition(list, searchName) {
  const totalRegistered = list.length;

  const disqualified = part1Registration(list); // Part 1 + Twists 1, 9, 10
  part2Examination(list);                       // Part 2 + Twists 2, 3
  part3Hacker(list);                            // Part 3 + Twists 4, 5
  part4SecretMission(list);                     // Part 4 + Twist 6
  const ranking = part5Ranking(list);           // Part 5 + Twist 7
  const finalRanking = part6Betrayal(ranking);  // Part 6 + Twist 8

  part7FinalReport(totalRegistered, list.length, disqualified, finalRanking); // Part 7 + Twist 11
  finalBoss(list, searchName);                  // Twists 12 - 15
}


// EDGE CASE TEST (runs first, so the real results are shown LAST)
// The challenge says the program must work when the student list changes.
// Here every student is removed, so Twist 11 shows "No winner today!".

function edgeCaseTest() {
  printTitle("EDGE CASE TEST (Twists 9, 10, 1 and 11)");

  const testStudents = [
    { name: "Zed", age: -3, score: 50 },  // Twist 9: negative age
    { name: "Amy", age: 30, score: 150 }, // Twist 9: score above 100
    { name: "Leo", age: 15, score: 80 },  // Twist 1: younger than 18
    { name: "Leo", age: 25, score: 70 }   // Twist 10: duplicate name
  ];
  const total = testStudents.length;

  const removed =
    twist9RemoveInvalid(testStudents).length +
    twist10RemoveDuplicates(testStudents).length +
    twist1RemoveUnderage(testStudents).length;

  console.log(`Test students: ${total}, removed: ${removed}, left: ${testStudents.length}`);
  console.log(testStudents.length === 0 ? "Result: No winner today!" : "Result: there is a winner");
}

edgeCaseTest();


// THE REAL COMPETITION

runCompetition(students, "Emma");
