// ICT FINAL TERM EXAMINATION DATA FOR GRADES 1-5
// Total marks structure: Exam (60) + Project/40% component (40) = 100
const examDataFinalTerm = {
    grade1: {
        name: "YEAR 1 (BASIC 1) – ICT FINAL TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVE QUESTIONS (15 MARKS)",
                marks: 15,
                questions: [
                    { id: 1, question: "A computer is an ______ machine.", options: ["animal", "electronic", "food", "toy"], correct: 1 },
                    { id: 2, question: "A computer helps us to ______", options: ["cook", "learn", "sleep", "run"], correct: 1 },
                    { id: 3, question: "Devices connected to a computer are called ______", options: ["tools", "peripherals", "wires", "parts"], correct: 1 },
                    { id: 4, question: "Which of these prints documents?", options: ["Scanner", "Printer", "Mouse", "Keyboard"], correct: 1 },
                    { id: 5, question: "A scanner is used to ______", options: ["print", "copy documents", "type", "draw"], correct: 1 },
                    { id: 6, question: "The hard disk is used to ______", options: ["cook food", "store information", "type", "draw"], correct: 1 },
                    { id: 7, question: "A flash drive is used to ______", options: ["eat", "store and carry files", "cook", "play"], correct: 1 },
                    { id: 8, question: "A CD is ______ in shape", options: ["square", "round", "long", "triangle"], correct: 1 },
                    { id: 9, question: "RAM helps the computer to ______", options: ["sleep", "work fast", "cook", "run"], correct: 1 },
                    { id: 10, question: "ROM stores ______", options: ["food", "instructions", "water", "games"], correct: 1 },
                    { id: 11, question: "To start a computer, press the ______", options: ["mouse", "power button", "screen", "keyboard"], correct: 1 },
                    { id: 12, question: "A computer needs ______ to work", options: ["sand", "electricity", "water", "oil"], correct: 1 },
                    { id: 13, question: "We should not touch the computer with ______ hands", options: ["clean", "dry", "wet", "small"], correct: 2 },
                    { id: 14, question: "A computer room is a place where we ______", options: ["cook", "learn computers", "sleep", "fight"], correct: 1 },
                    { id: 15, question: "We should always ______ the computer properly", options: ["hit", "shut down", "break", "throw"], correct: 1 }
                ],
                markingScheme: {
                    1: "B", 2: "B", 3: "B", 4: "B", 5: "B",
                    6: "B", 7: "B", 8: "B", 9: "B", 10: "B",
                    11: "B", 12: "B", 13: "C", 14: "B", 15: "B"
                }
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAPS (15 MARKS)",
                marks: 15,
                questions: [
                    { id: 1, question: "A computer uses __________ to work.", correct: ["electricity"] },
                    { id: 2, question: "We type using the __________.", correct: ["keyboard"] },
                    { id: 3, question: "A __________ prints documents.", correct: ["printer"] },
                    { id: 4, question: "Do not use the computer with __________ hands.", correct: ["wet"] },
                    { id: 5, question: "A __________ is used to store files.", correct: ["flash drive", "hard disk", "storage device"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (30 MARKS)",
                marks: 30,
                questions: [
                    { id: 1, question: "What is a computer?", fullMarks: 10, suggestedAnswer: "An electronic machine that helps us work, learn, draw, type, and play." },
                    { id: 2, question: "Mention any two computer peripherals.", fullMarks: 10, suggestedAnswer: "Printer, Scanner, Flash drive, Hard disk (any 2)" },
                    { id: 3, question: "State two rules in a computer room.", fullMarks: 10, suggestedAnswer: "Keep quiet, Do not run, Follow teacher's instructions, Do not touch without permission (any 2)" }
                ]
            }
        }
    },
    grade2: {
        name: "YEAR 2 (BASIC 2) – ICT FINAL TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVE QUESTIONS (15 MARKS)",
                marks: 15,
                questions: [
                    { id: 1, question: "ICT means ______", options: ["Information and Communication Technology", "Internal Computer Technology", "Information Control Tool", "Internet Communication Tool"], correct: 0 },
                    { id: 2, question: "ICT is used to ______ information", options: ["destroy", "send", "hide", "burn"], correct: 1 },
                    { id: 3, question: "Which part of the computer shows what it is doing?", options: ["Keyboard", "Mouse", "Monitor", "CPU"], correct: 2 },
                    { id: 4, question: "The keyboard is used for ______", options: ["drawing", "typing", "printing", "clicking"], correct: 1 },
                    { id: 5, question: "The mouse is used for ______", options: ["typing", "clicking", "printing", "storing"], correct: 1 },
                    { id: 6, question: "The CPU is called the ______ of the computer", options: ["hand", "leg", "brain", "eye"], correct: 2 },
                    { id: 7, question: "Which of these is an input device?", options: ["Printer", "Monitor", "Keyboard", "Speaker"], correct: 2 },
                    { id: 8, question: "Which of these is an output device?", options: ["Mouse", "Keyboard", "Monitor", "Flash drive"], correct: 2 },
                    { id: 9, question: "A flash drive is a ______ device", options: ["input", "output", "storage", "display"], correct: 2 },
                    { id: 10, question: "A workstation is ______", options: ["a game", "a computer set for one user", "a chair", "a book"], correct: 1 },
                    { id: 11, question: "Which of these is NOT part of a workstation?", options: ["Monitor", "Mouse", "Table fan", "Keyboard"], correct: 2 },
                    { id: 12, question: "Before turning on the computer, you should ______", options: ["press keys", "connect power cables", "play games", "remove cables"], correct: 1 },
                    { id: 13, question: "An icon is a ______ on the screen", options: ["cable", "picture", "wire", "sound"], correct: 1 },
                    { id: 14, question: "Recycle Bin is used to store ______ files", options: ["new", "deleted", "printed", "typed"], correct: 1 },
                    { id: 15, question: "The smallest type of computer is ______", options: ["Supercomputer", "Mainframe", "Mini computer", "Micro computer"], correct: 3 }
                ],
                markingScheme: {
                    1: "A", 2: "B", 3: "C", 4: "B", 5: "B",
                    6: "C", 7: "C", 8: "C", 9: "C", 10: "B",
                    11: "C", 12: "B", 13: "B", 14: "B", 15: "D"
                }
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAPS (15 MARKS)",
                marks: 15,
                questions: [
                    { id: 1, question: "ICT means __________ and __________ Technology.", correct: ["Information", "Communication"] },
                    { id: 2, question: "A __________ is used to type.", correct: ["keyboard"] },
                    { id: 3, question: "The __________ button is used to open programs.", correct: ["Start"] },
                    { id: 4, question: "A __________ is a small picture on the screen.", correct: ["icon"] },
                    { id: 5, question: "The largest computer is called a __________.", correct: ["Supercomputer"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (30 MARKS)",
                marks: 30,
                questions: [
                    { id: 1, question: "Define ICT.", fullMarks: 10, suggestedAnswer: "ICT is the use of computers and electronic devices to send, receive, store, and share information." },
                    { id: 2, question: "List any three parts of a computer.", fullMarks: 10, suggestedAnswer: "Monitor, Keyboard, Mouse, CPU, Printer (any 3)" },
                    { id: 3, question: "What is a workstation?", fullMarks: 10, suggestedAnswer: "A workstation is a complete computer system arranged for one person to use." }
                ]
            }
        }
    },
    grade3: {
        name: "YEAR 3 (BASIC 3) – ICT FINAL TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVE QUESTIONS (20 MARKS)",
                marks: 20,
                questions: [
                    { id: 1, question: "A computer is an ______ machine", options: ["cooking", "electronic", "playing", "writing"], correct: 1 },
                    { id: 2, question: "A computer helps us to work ______", options: ["slower", "faster", "harder", "longer"], correct: 1 },
                    { id: 3, question: "Which of these is a part of a computer?", options: ["Spoon", "Keyboard", "Plate", "Cup"], correct: 1 },
                    { id: 4, question: "One use of a computer is ______", options: ["cooking", "typing", "washing", "sleeping"], correct: 1 },
                    { id: 5, question: "System applications are ______", options: ["hardware parts", "programs that help the computer work", "cables", "wires"], correct: 1 },
                    { id: 6, question: "Microsoft Word is used for ______", options: ["drawing", "typing documents", "playing games", "cooking"], correct: 1 },
                    { id: 7, question: "Paint is used for ______", options: ["typing", "drawing", "printing", "scanning"], correct: 1 },
                    { id: 8, question: "Hardware are parts of the computer that can be ______", options: ["seen only", "touched", "deleted", "hidden"], correct: 1 },
                    { id: 9, question: "Software are ______", options: ["physical parts", "programs", "wires", "cables"], correct: 1 },
                    { id: 10, question: "Which of these is hardware?", options: ["Microsoft Word", "Paint", "Mouse", "Game"], correct: 2 },
                    { id: 11, question: "Which of these is software?", options: ["Keyboard", "Monitor", "Word", "CPU"], correct: 2 },
                    { id: 12, question: "The control unit is the ______ of the computer", options: ["hand", "leg", "boss", "eye"], correct: 2 },
                    { id: 13, question: "The control unit controls ______", options: ["only games", "all activities", "only typing", "only printing"], correct: 1 },
                    { id: 14, question: "ALU means ______", options: ["Arithmetic Logic Unit", "Automatic Logic Unit", "Arithmetic Line Unit", "Advanced Logic Unit"], correct: 0 },
                    { id: 15, question: "ALU is used for ______", options: ["typing", "calculations", "printing", "drawing"], correct: 1 },
                    { id: 16, question: "Which of these is done by ALU?", options: ["singing", "addition", "typing", "scanning"], correct: 1 },
                    { id: 17, question: "Input devices are used to ______ data", options: ["remove", "enter", "delete", "hide"], correct: 1 },
                    { id: 18, question: "Which of these is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correct: 2 },
                    { id: 19, question: "The first step in opening Microsoft Word is ______", options: ["click Save", "click Start", "click Print", "close program"], correct: 1 },
                    { id: 20, question: "Microsoft Word is used for ______", options: ["cooking", "typing letters", "playing games", "washing"], correct: 1 }
                ],
                markingScheme: {
                    1: "B", 2: "B", 3: "B", 4: "B", 5: "B",
                    6: "B", 7: "B", 8: "B", 9: "B", 10: "C",
                    11: "C", 12: "C", 13: "B", 14: "A", 15: "B",
                    16: "B", 17: "B", 18: "C", 19: "B", 20: "B"
                }
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAPS (10 MARKS)",
                marks: 10,
                questions: [
                    { id: 1, question: "A computer is an __________ machine.", correct: ["electronic"] },
                    { id: 2, question: "Hardware can be __________.", correct: ["touched"] },
                    { id: 3, question: "ALU means __________ Logic Unit.", correct: ["Arithmetic"] },
                    { id: 4, question: "Input devices are used to __________ data.", correct: ["enter"] },
                    { id: 5, question: "Click __________ to open Microsoft Word.", correct: ["Start"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (30 MARKS)",
                marks: 30,
                questions: [
                    { id: 1, question: "Mention three parts of a computer.", fullMarks: 7, suggestedAnswer: "Monitor, Keyboard, Mouse, CPU (any 3)" },
                    { id: 2, question: "What are system applications? Give two examples.", fullMarks: 8, suggestedAnswer: "System applications are programs that help the computer perform tasks. Examples: Microsoft Word, Paint, Media Player, Games (any 2)" },
                    { id: 3, question: "State two differences between hardware and software.", fullMarks: 8, suggestedAnswer: "Hardware can be touched; software cannot be touched. Hardware can break physically; software can be deleted." },
                    { id: 4, question: "Explain the function of the Control Unit.", fullMarks: 4, suggestedAnswer: "The Control Unit controls all activities of the computer and directs data flow." },
                    { id: 5, question: "Write the steps for opening Microsoft Word.", fullMarks: 3, suggestedAnswer: "Click Start, Select All Programs, Choose Microsoft Office, Click Microsoft Word" }
                ]
            }
        }
    },
    grade4: {
        name: "YEAR 4 (BASIC 4) – ICT FINAL TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVE QUESTIONS (20 MARKS)",
                marks: 20,
                questions: [
                    { id: 1, question: "Typing in PowerPoint means ______", options: ["printing text", "entering text", "deleting text", "drawing"], correct: 1 },
                    { id: 2, question: "To open PowerPoint, you click on ______", options: ["File", "Start menu", "Keyboard", "Mouse"], correct: 1 },
                    { id: 3, question: "A new slide is added by clicking ______", options: ["Save", "New Slide", "Print", "Close"], correct: 1 },
                    { id: 4, question: "Text is entered into a ______", options: ["shape", "text box", "file", "slide show"], correct: 1 },
                    { id: 5, question: "Saving a file helps to ______", options: ["delete work", "keep work safe", "print work", "move work"], correct: 1 },
                    { id: 6, question: "\"Save As\" is used to ______", options: ["open file", "save file", "close file", "delete file"], correct: 1 },
                    { id: 7, question: "Formatting means ______", options: ["deleting work", "making work neat and attractive", "typing fast", "printing work"], correct: 1 },
                    { id: 8, question: "Which of these is NOT a formatting tool?", options: ["Bold", "Italic", "Underline", "Delete"], correct: 3 },
                    { id: 9, question: "Changing the size of text is called ______", options: ["font color", "font size", "bold", "save"], correct: 1 },
                    { id: 10, question: "A computer virus is a ______", options: ["useful program", "harmful program", "typing tool", "game"], correct: 1 },
                    { id: 11, question: "Which of these is a type of virus?", options: ["Keyboard", "Worm", "Monitor", "Printer"], correct: 1 },
                    { id: 12, question: "Computer viruses can come from ______", options: ["books", "infected flash drives", "chairs", "tables"], correct: 1 },
                    { id: 13, question: "Anti-virus is used to ______", options: ["type text", "draw pictures", "protect computer", "play games"], correct: 2 },
                    { id: 14, question: "Which of these is an antivirus program?", options: ["Word", "Excel", "Avast", "Paint"], correct: 2 },
                    { id: 15, question: "Coding means ______", options: ["drawing pictures", "giving instructions to computer", "printing documents", "saving files"], correct: 1 },
                    { id: 16, question: "Coding is used to build ______", options: ["chairs", "houses", "apps", "food"], correct: 2 },
                    { id: 17, question: "Which of these is a use of coding?", options: ["cooking", "making games", "washing", "sleeping"], correct: 1 },
                    { id: 18, question: "Coding can be used in ______", options: ["ATMs", "books", "desks", "clothes"], correct: 0 },
                    { id: 19, question: "Which device uses coding?", options: ["Robot", "Spoon", "Plate", "Cup"], correct: 0 },
                    { id: 20, question: "One reason to learn coding is for ______", options: ["playing only", "future jobs", "sleeping", "eating"], correct: 1 }
                ],
                markingScheme: {
                    1: "B", 2: "B", 3: "B", 4: "B", 5: "B",
                    6: "B", 7: "B", 8: "D", 9: "B", 10: "B",
                    11: "B", 12: "B", 13: "C", 14: "C", 15: "B",
                    16: "C", 17: "B", 18: "A", 19: "A", 20: "B"
                }
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAPS (10 MARKS)",
                marks: 10,
                questions: [
                    { id: 1, question: "Formatting makes work __________ and attractive.", correct: ["neat"] },
                    { id: 2, question: "A computer virus is a __________ program.", correct: ["harmful"] },
                    { id: 3, question: "__________ protects the computer from viruses.", correct: ["Anti-virus"] },
                    { id: 4, question: "Coding means giving __________ to a computer.", correct: ["instructions"] },
                    { id: 5, question: "Click File → __________ As to save a file.", correct: ["Save"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (30 MARKS)",
                marks: 30,
                questions: [
                    { id: 1, question: "Explain how to save a file in PowerPoint.", fullMarks: 6, suggestedAnswer: "Click File, Click Save As, Choose location, Type file name, Click Save" },
                    { id: 2, question: "What is formatting? Mention two types of formatting.", fullMarks: 8, suggestedAnswer: "Formatting is making work neat and attractive. Types: Bold, Italic, Underline, Font size, Font color (any 2)" },
                    { id: 3, question: "Define computer virus and list two causes.", fullMarks: 8, suggestedAnswer: "A computer virus is a harmful program that damages files. Causes: Infected flash drives, Internet downloads, Sharing files (any 2)" },
                    { id: 4, question: "What is anti-virus? Mention two examples.", fullMarks: 4, suggestedAnswer: "Anti-virus is a program that protects the computer from viruses. Examples: Avast, Kaspersky, Norton, Windows Defender (any 2)" },
                    { id: 5, question: "What is coding? State two uses of coding.", fullMarks: 4, suggestedAnswer: "Coding is giving instructions to a computer. Uses: Websites, Apps, Games, Robots, ATMs (any 2)" }
                ]
            }
        }
    },
    grade5: {
        name: "YEAR 5 (BASIC 5) – ICT FINAL TERM",
        totalMarks: 60,
        sections: {
            objectives: {
                title: "SECTION A: OBJECTIVE QUESTIONS (20 MARKS)",
                marks: 20,
                questions: [
                    { id: 1, question: "A search engine is used to ______", options: ["type documents", "find information", "draw pictures", "print files"], correct: 1 },
                    { id: 2, question: "Which of these is a search engine?", options: ["Microsoft Word", "Google", "Paint", "Excel"], correct: 1 },
                    { id: 3, question: "Another example of a search engine is ______", options: ["Bing", "Keyboard", "Monitor", "Printer"], correct: 0 },
                    { id: 4, question: "Search engines are used for ______", options: ["cooking", "research", "sleeping", "washing"], correct: 1 },
                    { id: 5, question: "Email means ______", options: ["sending letters by hand", "sending messages through the internet", "typing on paper", "printing documents"], correct: 1 },
                    { id: 6, question: "Which of these is a part of email?", options: ["Inbox", "Keyboard", "Mouse", "CPU"], correct: 0 },
                    { id: 7, question: "The folder that stores received emails is ______", options: ["Sent", "Draft", "Inbox", "Trash"], correct: 2 },
                    { id: 8, question: "The folder that stores deleted emails is ______", options: ["Inbox", "Spam", "Trash", "Sent"], correct: 2 },
                    { id: 9, question: "Before sending an email, you click ______", options: ["Reply", "Send", "Delete", "Close"], correct: 1 },
                    { id: 10, question: "An attachment in email is ______", options: ["a message", "a file added to email", "a keyboard", "a printer"], correct: 1 },
                    { id: 11, question: "Internet safety means ______", options: ["using the internet wisely", "breaking computers", "sharing passwords", "visiting all sites"], correct: 0 },
                    { id: 12, question: "Which of these is a safety rule?", options: ["Share passwords", "Talk to strangers", "Avoid fake sites", "Click everything"], correct: 2 },
                    { id: 13, question: "We should not ______ our password", options: ["hide", "share", "protect", "keep"], correct: 1 },
                    { id: 14, question: "HTML means ______", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Tool Mark Language", "Home Text Mark Language"], correct: 0 },
                    { id: 15, question: "HTML is used to create ______", options: ["games", "websites", "food", "books"], correct: 1 },
                    { id: 16, question: "Which of these is an HTML tag?", options: ["<p>", "keyboard", "monitor", "mouse"], correct: 0 },
                    { id: 17, question: "Which tag is used for paragraph?", options: ["<h1>", "<p>", "<body>", "<head>"], correct: 1 },
                    { id: 18, question: "The <body> tag contains ______", options: ["title", "main content", "images only", "nothing"], correct: 1 },
                    { id: 19, question: "Which of these helps you learn new things online?", options: ["Search engine", "Printer", "Mouse", "Speaker"], correct: 0 },
                    { id: 20, question: "One use of email is to ______", options: ["cook food", "send messages", "wash clothes", "sleep"], correct: 1 }
                ],
                markingScheme: {
                    1: "B", 2: "B", 3: "A", 4: "B", 5: "B",
                    6: "A", 7: "C", 8: "C", 9: "B", 10: "B",
                    11: "A", 12: "C", 13: "B", 14: "A", 15: "B",
                    16: "A", 17: "B", 18: "B", 19: "A", 20: "B"
                }
            },
            fillBlanks: {
                title: "SECTION B: FILL IN THE GAPS (10 MARKS)",
                marks: 10,
                questions: [
                    { id: 1, question: "A __________ helps us find information online.", correct: ["search engine"] },
                    { id: 2, question: "Email is sending __________ through the internet.", correct: ["messages"] },
                    { id: 3, question: "The __________ folder stores received emails.", correct: ["Inbox"] },
                    { id: 4, question: "Do not share your __________ online.", correct: ["password"] },
                    { id: 5, question: "HTML means __________ Markup Language.", correct: ["HyperText"] }
                ]
            },
            theory: {
                title: "SECTION C: THEORY (30 MARKS)",
                marks: 30,
                questions: [
                    { id: 1, question: "Define a search engine and give two examples.", fullMarks: 7, suggestedAnswer: "A search engine is a tool used to find information on the internet. Examples: Google, Bing, Yahoo, DuckDuckGo (any 2)" },
                    { id: 2, question: "What is email? List three parts of an email.", fullMarks: 7, suggestedAnswer: "Email is sending messages through the internet. Parts: Inbox, Sent, Draft, Trash, Spam (any 3)" },
                    { id: 3, question: "Explain the steps in sending an email.", fullMarks: 5, suggestedAnswer: "Click compose, Type message, Attach file (if needed), Click send" },
                    { id: 4, question: "What is internet safety? Mention three safety rules.", fullMarks: 6, suggestedAnswer: "Internet safety is using the internet wisely. Rules: Do not share passwords, Avoid strangers, Avoid fake websites (any 3)" },
                    { id: 5, question: "What is HTML? Write three HTML tags.", fullMarks: 5, suggestedAnswer: "HTML is HyperText Markup Language used to create web pages. Tags: <html>, <head>, <body>, <p>, <h1> (any 3)" }
                ]
            }
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = examDataFinalTerm;
}
