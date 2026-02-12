// ICT Mid-Term Examination Data for Grades 1-5
const examData = {
    grade1: {
        name: "YEAR 1 (BASIC 1) – ICT MID TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVES (10 × MCQ)",
                marks: 30,
                questions: [
                    { question: "A computer is a ______.", options: ["animal","machine","tree","food"], correct: 1 },
                    { question: "A printer gives us ______ copy.", options: ["soft","hard","small","loud"], correct: 1 },
                    { question: "A scanner is used to ______.", options: ["print","copy into computer","type","draw"], correct: 1 },
                    { question: "A flash drive is used to ______.", options: ["cook","store files","sing","wash"], correct: 1 },
                    { question: "RAM means ______.", options: ["Random Access Memory","Read And Move","Run And Move","Random Active Machine"], correct: 0 },
                    { question: "Before pressing the power button, we switch on the ______.", options: ["chair","power source","book","fan"], correct: 1 },
                    { question: "We must not ______ cables.", options: ["protect","pull","cover","clean"], correct: 1 },
                    { question: "The computer room is used for ______.", options: ["sleeping","learning","farming","cooking"], correct: 1 },
                    { question: "We should use ______ hands when using the computer.", options: ["dirty","wet","clean","oily"], correct: 2 },
                    { question: "USB cable is used to ______ devices.", options: ["break","connect","throw","cut"], correct: 1 }
                ]
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAP (5)",
                marks: 15,
                questions: [
                    { question: "The ______ stores information inside the computer.", correct: ["memory","hard drive","storage","ram","rom"] },
                    { question: "The ______ button is pressed to start the computer.", correct: ["power","power button","on button"] },
                    { question: "A computer room is a special ______ for computers.", correct: ["room","place"] },
                    { question: "We must not eat or ______ near the computer.", correct: ["drink","spill","eat"] },
                    { question: "ROM means ______ Only Memory.", correct: ["Read","Read Only Memory"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (3)",
                marks: 15,
                questions: [
                    { question: "Mention three parts of a computer.", correctAnswer: "Monitor, Keyboard, Mouse (any three parts)", keywords: ["monitor","keyboard","mouse","cpu"] },
                    { question: "State three safety rules in the computer room.", correctAnswer: "Keep hands clean, do not pull cables, do not eat/drink near computer", keywords: ["clean","no pull","no eat","no drink"] },
                    { question: "Explain two steps in starting a computer.", correctAnswer: "Switch on power source, then press power button", keywords: ["power","switch on","press power"] }
                ]
            }
        }
    },
    grade2: {
        name: "YEAR 2 (BASIC 2) – ICT MID TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVES (10 × MCQ)",
                marks: 30,
                questions: [
                    { question: "ICT means ______.", options: ["Internal Computer Task","Information and Communication Technology","Internet Control Tool","Information Cable Technology"], correct: 1 },
                    { question: "A workstation is ______.", options: ["a chair","a complete computer set","a table only","a classroom"], correct: 1 },
                    { question: "The Start button is used to ______.", options: ["print","open programs","type","draw"], correct: 1 },
                    { question: "Recycle Bin stores ______ files.", options: ["new","deleted","saved","printed"], correct: 1 },
                    { question: "File Explorer is used to open ______.", options: ["games","folders","food","chairs"], correct: 1 },
                    { question: "The largest and fastest computer is ______.", options: ["micro computer","mini computer","super computer","laptop"], correct: 2 },
                    { question: "Mainframe computers are used in ______.", options: ["homes","banks","farms","kitchens"], correct: 1 },
                    { question: "A laptop is a ______ computer.", options: ["super","mainframe","micro","mini"], correct: 2 },
                    { question: "Before turning on the CPU, we must switch on the ______.", options: ["book","power source","pen","desk"], correct: 1 },
                    { question: "Media Player is used to play ______.", options: ["food","music and videos","books","cables"], correct: 1 }
                ]
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAP (5)",
                marks: 15,
                questions: [
                    { question: "A ______ is a complete computer set arranged for use.", correct: ["workstation"] },
                    { question: "The Recycle Bin stores ______ files.", correct: ["deleted"] },
                    { question: "The smallest type of computer is called ______ computer.", correct: ["micro"] },
                    { question: "A ______ computer is used for weather forecasting.", correct: ["super"] },
                    { question: "File Explorer helps us open ______ and files.", correct: ["folders"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (3)",
                marks: 15,
                questions: [
                    { question: "Define a workstation.", correctAnswer: "A workstation is a complete computer set arranged for use.", keywords: ["complete","computer set","workstation"] },
                    { question: "Mention two uses of the Start button.", correctAnswer: "Open programs and access system tools.", keywords: ["open programs","access","start menu"] },
                    { question: "List the four types of computers by size.", correctAnswer: "Super, Mainframe, Mini and Micro (by size)", keywords: ["super","mainframe","mini","micro"] }
                ]
            }
        }
    },
    grade3: {
        name: "YEAR 3 (BASIC 3) – ICT MID TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVES (10 × MCQ)",
                marks: 30,
                questions: [
                    { question: "Hardware refers to ______.", options: ["programs","physical parts","games","internet"], correct: 1 },
                    { question: "MS Word is an example of ______.", options: ["hardware","application software","input device","storage device"], correct: 1 },
                    { question: "Encarta is used for ______.", options: ["cooking","research","printing","scanning"], correct: 1 },
                    { question: "Mavis Beacon teaches ______.", options: ["drawing","typing","singing","printing"], correct: 1 },
                    { question: "The brain of the computer is the ______.", options: ["mouse","keyboard","CPU","monitor"], correct: 2 },
                    { question: "The Control Unit directs ______.", options: ["students","computer activities","teachers","games"], correct: 1 },
                    { question: "The ALU performs ______.", options: ["cooking","calculations","drawing","printing"], correct: 1 },
                    { question: "Which of these is an input device?", options: ["Monitor","Printer","Mouse","Speaker"], correct: 2 },
                    { question: "MS Word is used for ______.", options: ["typing documents","watching movies","cooking","repairing"], correct: 0 },
                    { question: "Software can be ______.", options: ["touched","seen and touched","physical","not touched"], correct: 3 }
                ]
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAP (5)",
                marks: 15,
                questions: [
                    { question: "CPU means ______ Processing Unit.", correct: ["central"] },
                    { question: "The ______ Unit directs computer operations.", correct: ["control"] },
                    { question: "The ALU performs ______ calculations.", correct: ["arithmetic","math"] },
                    { question: "A program used for typing is ______.", correct: ["word","ms word"] },
                    { question: "Physical parts of a computer are called ______.", correct: ["hardware"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (3)",
                marks: 15,
                questions: [
                    { question: "Differentiate between hardware and software.", correctAnswer: "Hardware = physical parts; Software = programs.", keywords: ["hardware","software","physical","programs"] },
                    { question: "Mention two components of the CPU and their functions.", correctAnswer: "Control Unit directs operations; ALU performs calculations.", keywords: ["control unit","alu","calculations","directs"] },
                    { question: "List four examples of application software.", correctAnswer: "Word, Paint, Media Player, Encarta (any four)", keywords: ["word","paint","media player","encarta"] }
                ]
            }
        }
    },
    grade4: {
        name: "YEAR 4 (BASIC 4) – ICT MID TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVES (10 × MCQ)",
                marks: 30,
                questions: [
                    { question: "To create a new slide in PowerPoint, you click ______.", options: ["Save","New Slide","Print","Close"], correct: 1 },
                    { question: "Formatting means making your work ______.", options: ["dirty","neat and attractive","short","small"], correct: 1 },
                    { question: "Which of these makes text darker?", options: ["Italic","Bold","Underline","Font size"], correct: 1 },
                    { question: "A computer virus is a ______ program.", options: ["helpful","harmful","typing","saving"], correct: 1 },
                    { question: "Which of these is a type of virus?", options: ["Worm","Monitor","Keyboard","Printer"], correct: 0 },
                    { question: "Antivirus is used to ______ viruses.", options: ["create","spread","detect and remove","hide"], correct: 2 },
                    { question: "Which of these is an antivirus program?", options: ["PowerPoint","Avast","Word","Excel"], correct: 1 },
                    { question: "Coding means giving ______ to a computer.", options: ["food","instructions","games","virus"], correct: 1 },
                    { question: "One reason to learn coding is to build ______.", options: ["farms","games","chairs","clothes"], correct: 1 },
                    { question: "To save a PowerPoint file, click File and then ______.", options: ["Close","Save As","Delete","Print"], correct: 1 }
                ]
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAP (5)",
                marks: 15,
                questions: [
                    { question: "Formatting can change font ______ and color.", correct: ["size","style"] },
                    { question: "A ______ damages computer files.", correct: ["virus"] },
                    { question: "______ protects the computer from virus.", correct: ["antivirus"] },
                    { question: "Coding helps us create apps and ______.", correct: ["games","programs"] },
                    { question: "To type in PowerPoint, click the ______ box.", correct: ["text"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (3)",
                marks: 15,
                questions: [
                    { question: "Define computer virus and list two causes.", correctAnswer: "A computer virus is a harmful program that can corrupt files; causes include downloading infected files and opening unknown attachments.", keywords: ["harmful","infected","attachments","download"] },
                    { question: "Mention three examples of antivirus programs and state one use.", correctAnswer: "Examples: Avast, Norton, Kaspersky. Use: detect and remove viruses.", keywords: ["avast","norton","kaspersky","detect","remove"] },
                    { question: "Explain the steps involved in saving a PowerPoint presentation.", correctAnswer: "Click File → Save As → choose folder/name → Save.", keywords: ["file","save as","choose","save"] }
                ]
            }
        }
    },
    grade5: {
        name: "YEAR 5 (BASIC 5) – ICT MID TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVES (10 × MCQ)",
                marks: 30,
                questions: [
                    { question: "A search engine helps us to ______ information.", options: ["delete","find","print","draw"], correct: 1 },
                    { question: "Which of these is a search engine?", options: ["Google","Word","Excel","PowerPoint"], correct: 0 },
                    { question: "Email is used to send ______ through the internet.", options: ["food","messages","chairs","shoes"], correct: 1 },
                    { question: "The folder that stores received emails is called ______.", options: ["Sent","Draft","Inbox","Trash"], correct: 2 },
                    { question: "Spam emails are usually ______.", options: ["important","unwanted","school work","saved"], correct: 1 },
                    { question: "An attachment is a ______ added to an email.", options: ["file","book","keyboard","desk"], correct: 0 },
                    { question: "Internet safety means using the internet ______.", options: ["carelessly","wisely","loudly","slowly"], correct: 1 },
                    { question: "We should not share our ______ online.", options: ["books","passwords","shoes","chairs"], correct: 1 },
                    { question: "HTML means ______.", options: ["HyperText Markup Language","HighText Machine Language","Hyper Machine Link","High Mark Language"], correct: 0 },
                    { question: "The <body> tag is used inside an ______ document.", options: ["HTML","printer","flash drive","mouse"], correct: 0 }
                ]
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAP (5)",
                marks: 15,
                questions: [
                    { question: "Google is an example of a ______ engine.", correct: ["search"] },
                    { question: "Email stands for electronic ______.", correct: ["mail"] },
                    { question: "The folder that stores deleted emails is called ______.", correct: ["trash","deleted"] },
                    { question: "We must avoid sharing our ______ online.", correct: ["passwords"] },
                    { question: "HTML is used to create ______ pages.", correct: ["web","webpages","web pages","websites"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (3)",
                marks: 15,
                questions: [
                    { question: "Define a search engine and mention three examples.", correctAnswer: "A search engine finds information on the web (examples: Google, Bing, Yahoo).", keywords: ["google","bing","yahoo","search"] },
                    { question: "List and explain four parts of an email account.", correctAnswer: "Inbox, Sent, Drafts, Trash — Inbox stores received mail, Sent stores sent mail, Drafts stores unfinished messages, Trash stores deleted mail.", keywords: ["inbox","sent","drafts","trash"] },
                    { question: "Write a simple HTML structure using the tags: <html>, <head>, and <body>.", correctAnswer: "Basic structure: <html><head><title>Title</title></head><body>Content</body></html>", keywords: ["html","head","body","title"] }
                ]
            }
        }
    }
};

// Function to get exam data for a specific grade
function getExamData(grade) {
    return examData[grade] || null;
}

// Function to calculate total questions in exam
function getTotalQuestions(grade) {
    const exam = examData[grade];
    if (!exam) return 0;
    
    let total = 0;
    for (const section in exam.sections) {
        total += exam.sections[section].questions.length;
    }
    return total;
}

// Function to validate theory answer
function validateTheoryAnswer(userAnswer, question) {
    if (!userAnswer || userAnswer.trim() === '') return false;
    
    const cleanAnswer = userAnswer.toLowerCase().trim();
    const keywords = question.keywords || [];
    
    // Check if answer contains at least 2 keywords (flexible marking)
    let keywordMatches = 0;
    keywords.forEach(keyword => {
        if (cleanAnswer.includes(keyword.toLowerCase())) {
            keywordMatches++;
        }
    });
    
    // Pass if at least 40% of keywords are present
    return keywordMatches >= Math.max(2, Math.floor(keywords.length * 0.4));
}

// Function to validate fill-in-the-blank answer
function validateFillBlankAnswer(userAnswer, correctAnswers) {
    if (!userAnswer || userAnswer.trim() === '') return false;
    
    const cleanAnswer = userAnswer.toLowerCase().trim();
    
    // Check against all possible correct answers
    for (const correct of correctAnswers) {
        const cleanCorrect = correct.toLowerCase().trim();
        
        // Exact match
        if (cleanAnswer === cleanCorrect) return true;
        
        // Contains match (for longer answers)
        if (cleanAnswer.includes(cleanCorrect) || cleanCorrect.includes(cleanAnswer)) {
            // Check if at least 70% similarity
            const similarity = calculateSimilarity(cleanAnswer, cleanCorrect);
            if (similarity >= 0.7) return true;
        }
    }
    
    return false;
}

// Calculate string similarity
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longerLength - editDistance) / longerLength;
}

// Calculate edit distance (Levenshtein distance)
function getEditDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}
