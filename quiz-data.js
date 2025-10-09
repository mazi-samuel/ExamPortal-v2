// Quiz Questions Database for Kids Digital Literacy Test
const quizData = {
    5: {
        name: "Jayson's Adventure (5 years old)",
        categories: {
            "Computer Awareness": [
                {
                    question: "Point to the mouse. Which picture shows a computer mouse?",
                    options: ["🖱️ Computer Mouse", "🐭 Animal Mouse", "🧀 Cheese", "🏠 House"],
                    correct: 0,
                    explanation: "A computer mouse helps us click and move things on the screen!"
                },
                {
                    question: "What do you use to type letters?",
                    options: ["⌨️ Keyboard", "🖱️ Mouse", "📺 Screen", "🔊 Speaker"],
                    correct: 0,
                    explanation: "The keyboard has all the letters we need to type!"
                },
                {
                    question: "What happens when you move the mouse?",
                    options: ["The arrow moves on screen", "Music plays", "The computer turns off", "Nothing happens"],
                    correct: 0,
                    explanation: "When we move the mouse, the arrow pointer moves on the screen!"
                },
                {
                    question: "What is a screen?",
                    options: ["The part that shows pictures", "A type of food", "A toy", "A book"],
                    correct: 0,
                    explanation: "The screen is like a TV that shows us everything on the computer!"
                },
                {
                    question: "What shape is the power button usually?",
                    options: ["⭕ Circle", "⬜ Square", "🔺 Triangle", "⭐ Star"],
                    correct: 0,
                    explanation: "Most power buttons are round circles with a line through them!"
                },
                {
                    question: "What do you see on the computer screen when it's on?",
                    options: ["Pictures and colors", "Nothing", "Only black", "Only white"],
                    correct: 0,
                    explanation: "When the computer is on, we can see lots of colorful pictures and icons!"
                },
                {
                    question: "What do you press to make letters appear?",
                    options: ["Keys on the keyboard", "The screen", "The mouse", "The power button"],
                    correct: 0,
                    explanation: "Each key on the keyboard makes a different letter appear!"
                },
                {
                    question: "What is your favorite color you can see on the computer?",
                    options: ["🔴 Red", "🔵 Blue", "🟢 Green", "🟡 Yellow"],
                    correct: 0,
                    explanation: "Computers can show us all the beautiful colors! Any choice is correct!"
                },
                {
                    question: "What happens when you click something on the screen?",
                    options: ["It opens or does something", "Nothing happens", "The computer breaks", "It disappears forever"],
                    correct: 0,
                    explanation: "Clicking is like pressing a button - it makes things happen!"
                },
                {
                    question: "How do you turn on a tablet?",
                    options: ["Press the power button", "Shake it", "Clap your hands", "Say 'please'"],
                    correct: 0,
                    explanation: "Just like other devices, tablets have a power button to turn them on!"
                }
            ],
            "Logic and Patterns": [
                {
                    question: "Which comes next in this pattern: 🟦🟥🟦🟥🟦___?",
                    options: ["🟥 Red", "🟦 Blue", "🟢 Green", "🟡 Yellow"],
                    correct: 0,
                    explanation: "The pattern goes blue, red, blue, red... so red comes next!"
                },
                {
                    question: "What happens if you press the same button twice?",
                    options: ["It does the same thing twice", "Nothing happens", "It breaks", "It changes color"],
                    correct: 0,
                    explanation: "When we press a button twice, it usually does the same action two times!"
                },
                {
                    question: "If the cat goes up, then down, what happens next if we repeat?",
                    options: ["Cat goes up again", "Cat stays still", "Cat disappears", "Cat changes color"],
                    correct: 0,
                    explanation: "If we're repeating the pattern, the cat would go up again!"
                },
                {
                    question: "What does 'repeat' mean?",
                    options: ["Do it again", "Stop completely", "Go backwards", "Change everything"],
                    correct: 0,
                    explanation: "Repeat means to do the same thing over and over again!"
                },
                {
                    question: "Can you spot the odd one out? Which doesn't belong?",
                    options: ["🚗 Car", "🐶 Dog", "🐱 Cat", "🐭 Mouse"],
                    correct: 0,
                    explanation: "The car is different because it's not an animal like the others!"
                },
                {
                    question: "What should you do first when you want to play a game?",
                    options: ["Turn on the device", "Start playing immediately", "Close your eyes", "Run around"],
                    correct: 0,
                    explanation: "First we need to turn on the device before we can play!"
                },
                {
                    question: "What happens when you click the green flag in ScratchJr?",
                    options: ["The program starts", "Everything stops", "Colors change", "Music plays"],
                    correct: 0,
                    explanation: "The green flag is like saying 'GO!' - it starts our program!"
                },
                {
                    question: "Can you drag a block to make the cat move?",
                    options: ["Yes, I can drag blocks", "No, blocks don't move", "Only with magic", "Cats can't move"],
                    correct: 0,
                    explanation: "Yes! We can drag blocks to tell the cat what to do!"
                },
                {
                    question: "Which block makes the cat jump?",
                    options: ["The jump block", "The color block", "The sound block", "The stop block"],
                    correct: 0,
                    explanation: "The jump block tells the cat to jump up and down!"
                },
                {
                    question: "What kind of block makes sound?",
                    options: ["The sound block", "The move block", "The color block", "The number block"],
                    correct: 0,
                    explanation: "Sound blocks are special blocks that make music and sounds!"
                }
            ],
            "ScratchJr Concepts": [
                {
                    question: "What is a block in ScratchJr?",
                    options: ["A piece that tells the character what to do", "A toy to play with", "A type of food", "A color"],
                    correct: 0,
                    explanation: "Blocks are like instructions that tell our characters what to do!"
                },
                {
                    question: "What does the blue block do?",
                    options: ["Makes characters move", "Changes colors", "Makes sounds", "Stops everything"],
                    correct: 0,
                    explanation: "Blue blocks are motion blocks - they make our characters move!"
                },
                {
                    question: "What happens if you add more move blocks?",
                    options: ["The character moves more", "Nothing changes", "It goes backwards", "It disappears"],
                    correct: 0,
                    explanation: "More move blocks make the character move farther!"
                },
                {
                    question: "What is a character in ScratchJr?",
                    options: ["The cat, dog, or other friends we control", "A letter", "A number", "A color"],
                    correct: 0,
                    explanation: "Characters are our digital friends like the cat that we can make move and dance!"
                },
                {
                    question: "What is the background in ScratchJr?",
                    options: ["The scene behind the characters", "A character", "A block", "A sound"],
                    correct: 0,
                    explanation: "The background is like the scenery - it could be a park, house, or space!"
                },
                {
                    question: "How do you change the background?",
                    options: ["Click the background button and choose a new one", "Use magic", "Shake the tablet", "It changes by itself"],
                    correct: 0,
                    explanation: "We can click the background button to pick a new scene!"
                },
                {
                    question: "What happens when you press the green flag?",
                    options: ["Your story starts", "Everything disappears", "Colors change randomly", "It makes loud noises"],
                    correct: 0,
                    explanation: "The green flag is like pressing 'play' on your story!"
                },
                {
                    question: "Can you make your character dance?",
                    options: ["Yes, with dance blocks", "No, characters can't dance", "Only on weekends", "Only if it's happy"],
                    correct: 0,
                    explanation: "Yes! We can use special blocks to make our characters dance!"
                },
                {
                    question: "What color blocks make sounds?",
                    options: ["Purple blocks", "Blue blocks", "Green blocks", "Red blocks"],
                    correct: 0,
                    explanation: "Purple blocks are the sound blocks that make music and fun noises!"
                },
                {
                    question: "What color blocks control when things start?",
                    options: ["Yellow blocks", "Blue blocks", "Purple blocks", "Green blocks"],
                    correct: 0,
                    explanation: "Yellow blocks are trigger blocks - they tell our program when to start!"
                },
                {
                    question: "How do you make your story start?",
                    options: ["Press the green flag", "Clap your hands", "Say 'start'", "Tap the screen 5 times"],
                    correct: 0,
                    explanation: "The green flag button starts our story when we press it!"
                },
                {
                    question: "Can you add another character to your story?",
                    options: ["Yes, I can add more friends", "No, only one is allowed", "Only if I ask nicely", "Characters add themselves"],
                    correct: 0,
                    explanation: "Yes! We can add lots of characters to make our story more fun!"
                },
                {
                    question: "What happens if you join blocks together?",
                    options: ["They work as a team", "They fight each other", "Nothing happens", "They turn into one big block"],
                    correct: 0,
                    explanation: "When blocks are connected, they work together to make things happen!"
                },
                {
                    question: "What happens when you press the stop button?",
                    options: ["Everything stops moving", "Everything goes faster", "Colors change", "New characters appear"],
                    correct: 0,
                    explanation: "The stop button makes everything pause, like pressing pause on a video!"
                },
                {
                    question: "Can you show me how your story starts?",
                    options: ["Press the green flag to start", "Spin around three times", "Close my eyes", "Count to ten"],
                    correct: 0,
                    explanation: "Stories start when we press the green flag - that's our 'GO' button!"
                }
            ],
            "Creativity & Storytelling": [
                {
                    question: "What story can you make about a cat and a ball?",
                    options: ["The cat plays with the ball", "The cat eats the ball", "The cat is afraid of the ball", "The ball chases the cat"],
                    correct: 0,
                    explanation: "Stories about cats and balls are usually about playing and having fun!"
                },
                {
                    question: "What happens when the cat meets the dog in your story?",
                    options: ["They become friends", "They ignore each other", "They have a race", "They sing together"],
                    correct: 0,
                    explanation: "Any of these could happen! In stories, we decide what our characters do!"
                },
                {
                    question: "Can you draw a picture for your story?",
                    options: ["Yes, I love drawing", "No, I don't like drawing", "Only with help", "Only on paper"],
                    correct: 0,
                    explanation: "Drawing helps make our stories even more special and colorful!"
                },
                {
                    question: "What is your favorite color to use in stories?",
                    options: ["🌈 All colors are great", "🔴 Red", "🔵 Blue", "🟢 Green"],
                    correct: 0,
                    explanation: "Every color is wonderful! Colors make our stories bright and happy!"
                },
                {
                    question: "What sound would you add to your story?",
                    options: ["Happy music", "Animal sounds", "Funny noises", "No sounds"],
                    correct: 0,
                    explanation: "Sounds make our stories come alive and more exciting!"
                },
                {
                    question: "What happens first in your story?",
                    options: ["The characters meet", "They say hello", "They start playing", "Music begins"],
                    correct: 0,
                    explanation: "Stories need a beginning - what happens first is up to you!"
                },
                {
                    question: "What happens next in your story?",
                    options: ["Something fun happens", "They go on an adventure", "They learn something new", "They help each other"],
                    correct: 0,
                    explanation: "The middle of the story is where the fun adventure happens!"
                },
                {
                    question: "What happens at the end of your story?",
                    options: ["Everyone is happy", "They say goodbye", "They plan to meet again", "They celebrate"],
                    correct: 0,
                    explanation: "Good stories usually end with everyone feeling happy!"
                },
                {
                    question: "What would you call your story?",
                    options: ["My Amazing Adventure", "The Cat and Ball Story", "Fun with Friends", "My First Story"],
                    correct: 0,
                    explanation: "You can give your story any name you like - it's your creation!"
                },
                {
                    question: "Can you show how your character moves in the story?",
                    options: ["Yes, I can make them dance and jump", "They walk slowly", "They run fast", "They spin around"],
                    correct: 0,
                    explanation: "Characters can move in many different ways to make stories exciting!"
                }
            ],
            "Observation & Engagement": [
                {
                    question: "What is your favorite thing to do on a tablet?",
                    options: ["Play learning games", "Watch videos", "Draw pictures", "Listen to music"],
                    correct: 0,
                    explanation: "All of these activities are fun and help us learn new things!"
                },
                {
                    question: "Have you played ScratchJr before?",
                    options: ["Yes, I love it", "No, but I want to try", "A little bit", "I'm not sure"],
                    correct: 0,
                    explanation: "ScratchJr is a fun way to start learning about making programs!"
                },
                {
                    question: "What is your favorite color block in ScratchJr?",
                    options: ["🟦 Blue (move blocks)", "🟪 Purple (sound blocks)", "🟨 Yellow (start blocks)", "🟫 Brown (look blocks)"],
                    correct: 0,
                    explanation: "Each color block does something special - they're all important!"
                },
                {
                    question: "What do you like most about computers?",
                    options: ["They help me learn and play", "They show pretty colors", "They make sounds", "They help me create things"],
                    correct: 0,
                    explanation: "Computers are amazing tools that help us learn, create, and have fun!"
                },
                {
                    question: "What new thing would you love to learn about computers?",
                    options: ["How to make my own games", "How to draw digital pictures", "How to make music", "How to tell stories"],
                    correct: 0,
                    explanation: "Learning new things about computers opens up a world of creativity!"
                }
            ]
        }
    },
    9: {
        name: "Jesslyn's Challenge (9 years old)",
        categories: {
            "Computer Basics": [
                {
                    question: "What is a computer used for?",
                    options: ["Learning, working, and entertainment", "Only for games", "Only for homework", "Only for watching videos"],
                    correct: 0,
                    explanation: "Computers are versatile tools that help us with many different activities!"
                },
                {
                    question: "Name two parts of a computer.",
                    options: ["Monitor and keyboard", "Pizza and ice cream", "Car and bicycle", "Book and pencil"],
                    correct: 0,
                    explanation: "The monitor shows us information and the keyboard helps us type!"
                },
                {
                    question: "What does the mouse do?",
                    options: ["Controls the pointer on screen", "Makes cheese", "Runs around the house", "Plays music"],
                    correct: 0,
                    explanation: "The mouse helps us point, click, and select things on the computer screen!"
                },
                {
                    question: "What key helps you type capital letters?",
                    options: ["Shift key", "Space bar", "Enter key", "Delete key"],
                    correct: 0,
                    explanation: "Hold the Shift key while pressing a letter to make it capital!"
                },
                {
                    question: "What does 'Ctrl + S' do?",
                    options: ["Saves your work", "Starts the computer", "Makes sounds", "Changes colors"],
                    correct: 0,
                    explanation: "Ctrl + S is a shortcut to save your work so you don't lose it!"
                },
                {
                    question: "What is the internet?",
                    options: ["A global network connecting computers", "A type of fish net", "A spider web", "A basketball net"],
                    correct: 0,
                    explanation: "The internet connects computers all around the world so we can share information!"
                },
                {
                    question: "What is a file?",
                    options: ["A document or piece of information stored on a computer", "A tool for sharpening nails", "A line of people", "A type of fish"],
                    correct: 0,
                    explanation: "Files are like digital folders that store our documents, pictures, and other information!"
                },
                {
                    question: "What is a password used for?",
                    options: ["Keeping your accounts safe and private", "Opening doors", "Starting cars", "Turning on lights"],
                    correct: 0,
                    explanation: "Passwords protect our accounts like a key protects our house!"
                },
                {
                    question: "Name a safe website for kids.",
                    options: ["PBS Kids or National Geographic Kids", "Random unknown websites", "Sites without parent permission", "Adult-only websites"],
                    correct: 0,
                    explanation: "Safe kid websites like PBS Kids are designed specially for children to learn and have fun!"
                },
                {
                    question: "What is Canva used for?",
                    options: ["Creating designs and graphics", "Playing video games", "Writing code", "Sending emails"],
                    correct: 0,
                    explanation: "Canva helps us create beautiful posters, presentations, and other designs!"
                }
            ],
            "Logical Thinking": [
                {
                    question: "What is a pattern?",
                    options: ["Something that repeats in a predictable way", "A random mess", "Something that never changes", "A type of fabric"],
                    correct: 0,
                    explanation: "Patterns follow rules and repeat in ways we can predict!"
                },
                {
                    question: "If 2 + 2 = 4, what is 4 + 4?",
                    options: ["8", "6", "10", "12"],
                    correct: 0,
                    explanation: "If we double 4, we get 8! Math patterns help us solve problems!"
                },
                {
                    question: "What happens when you change one thing in a pattern?",
                    options: ["The whole pattern changes", "Nothing happens", "It disappears", "It becomes random"],
                    correct: 0,
                    explanation: "Changing one part of a pattern affects the whole sequence!"
                },
                {
                    question: "What does 'repeat' mean in programming?",
                    options: ["Do the same action multiple times", "Stop everything", "Go backwards", "Change randomly"],
                    correct: 0,
                    explanation: "Repeat means to do the same action over and over again!"
                },
                {
                    question: "What comes next in the sequence: 2, 4, 6, ___?",
                    options: ["8", "7", "10", "5"],
                    correct: 0,
                    explanation: "This pattern adds 2 each time: 2, 4, 6, 8!"
                },
                {
                    question: "If you are baking a cake, what do you do first?",
                    options: ["Mix ingredients", "Put it in the oven", "Eat it", "Decorate it"],
                    correct: 0,
                    explanation: "Following the right order is important - we mix ingredients before baking!"
                },
                {
                    question: "What is a step-by-step instruction called?",
                    options: ["An algorithm", "A mistake", "A guess", "A surprise"],
                    correct: 0,
                    explanation: "An algorithm is like a recipe with steps to follow in order!"
                },
                {
                    question: "What do we call an error in instructions?",
                    options: ["A bug", "A feature", "A surprise", "A gift"],
                    correct: 0,
                    explanation: "Bugs are mistakes in our instructions that we need to fix!"
                },
                {
                    question: "What do you do when something doesn't work in Scratch?",
                    options: ["Debug and fix the problem", "Give up immediately", "Ignore it", "Start over completely"],
                    correct: 0,
                    explanation: "Debugging means finding and fixing problems - it's a normal part of programming!"
                },
                {
                    question: "What does 'debug' mean?",
                    options: ["Find and fix errors", "Create new bugs", "Delete everything", "Make it more confusing"],
                    correct: 0,
                    explanation: "Debugging is like being a detective - we find problems and solve them!"
                }
            ],
            "Scratch Basics": [
                {
                    question: "What is a sprite in Scratch?",
                    options: ["A character or object you can program", "A type of drink", "A small fairy", "A computer virus"],
                    correct: 0,
                    explanation: "Sprites are the characters and objects we can make move and interact in Scratch!"
                },
                {
                    question: "How do you make a sprite move in Scratch?",
                    options: ["Use move blocks", "Push the computer screen", "Wish really hard", "Draw on paper"],
                    correct: 0,
                    explanation: "Move blocks tell sprites how many steps to take and in which direction!"
                },
                {
                    question: "What happens when you click the green flag?",
                    options: ["The program starts running", "The computer shuts down", "Sprites disappear", "Nothing happens"],
                    correct: 0,
                    explanation: "The green flag is like a 'GO' button that starts our Scratch programs!"
                },
                {
                    question: "What does the 'forever' block do?",
                    options: ["Repeats actions continuously", "Stops everything", "Runs once only", "Deletes sprites"],
                    correct: 0,
                    explanation: "Forever blocks make actions repeat over and over without stopping!"
                },
                {
                    question: "What is the purpose of a background in Scratch?",
                    options: ["Sets the scene for your story", "Hides the sprites", "Makes the program run faster", "Stores data"],
                    correct: 0,
                    explanation: "Backgrounds create the setting where our sprites act out their stories!"
                },
                {
                    question: "What block helps you make sound in Scratch?",
                    options: ["Play sound block", "Move block", "If block", "Variable block"],
                    correct: 0,
                    explanation: "Sound blocks let us add music, sound effects, and voices to our projects!"
                },
                {
                    question: "What does the 'if touching' block do?",
                    options: ["Detects when sprites bump into each other", "Makes sprites invisible", "Changes sprite colors", "Deletes sprites"],
                    correct: 0,
                    explanation: "This block helps sprites know when they're touching other sprites or objects!"
                },
                {
                    question: "What is a variable used for in Scratch?",
                    options: ["Storing and remembering information", "Making sprites move", "Creating sounds", "Changing backgrounds"],
                    correct: 0,
                    explanation: "Variables are like boxes that remember important information like scores or names!"
                },
                {
                    question: "What does the 'wait' block do?",
                    options: ["Pauses the program for a set time", "Speeds up the program", "Stops the program forever", "Restarts the program"],
                    correct: 0,
                    explanation: "Wait blocks create pauses, like taking a breath between actions!"
                },
                {
                    question: "How can you make your sprite jump?",
                    options: ["Change y position up then down", "Use only move blocks", "Change the background", "Delete other sprites"],
                    correct: 0,
                    explanation: "To jump, we move the sprite up quickly and then let it come back down!"
                },
                {
                    question: "What is the difference between 'repeat' and 'forever'?",
                    options: ["Repeat does it a set number of times, forever never stops", "They do the same thing", "Repeat is faster", "Forever is slower"],
                    correct: 0,
                    explanation: "Repeat blocks do something a specific number of times, while forever blocks never stop!"
                },
                {
                    question: "How do you add new sprites to your project?",
                    options: ["Click the sprite icon and choose or draw one", "Type their names", "Wait for them to appear", "Copy from other computers"],
                    correct: 0,
                    explanation: "We can add sprites by clicking the sprite button and choosing from the library or drawing our own!"
                },
                {
                    question: "What is a costume in Scratch?",
                    options: ["Different looks for the same sprite", "Clothes for people", "A type of block", "A background image"],
                    correct: 0,
                    explanation: "Costumes are different outfits or looks that sprites can wear!"
                },
                {
                    question: "How can you make your sprite talk?",
                    options: ["Use say blocks", "Type on the keyboard", "Draw speech bubbles", "Make loud noises"],
                    correct: 0,
                    explanation: "Say blocks make speech bubbles appear with the sprite's words!"
                },
                {
                    question: "What is the 'stop all' block used for?",
                    options: ["Stops all scripts in the project", "Stops only one sprite", "Pauses for 1 second", "Makes sprites invisible"],
                    correct: 0,
                    explanation: "Stop all blocks are like a master off switch that stops everything in the project!"
                }
            ],
            "Creativity and Design": [
                {
                    question: "What colors do you like using for fun posters?",
                    options: ["Bright, cheerful colors", "Only black and white", "Very dark colors", "No colors at all"],
                    correct: 0,
                    explanation: "Bright colors make posters fun, exciting, and catch people's attention!"
                },
                {
                    question: "What does 'alignment' mean in design?",
                    options: ["How things line up neatly", "The color of objects", "The size of text", "The number of pictures"],
                    correct: 0,
                    explanation: "Alignment makes designs look neat by lining things up properly!"
                },
                {
                    question: "What is a logo?",
                    options: ["A special symbol for a company or group", "A type of game", "A computer program", "A math problem"],
                    correct: 0,
                    explanation: "Logos are special pictures or symbols that represent companies or organizations!"
                },
                {
                    question: "What is a poster used for?",
                    options: ["Sharing information in a visual way", "Covering windows", "Playing games", "Writing stories"],
                    correct: 0,
                    explanation: "Posters display information in an attractive, easy-to-read visual format!"
                },
                {
                    question: "What does the undo button do?",
                    options: ["Takes back the last change you made", "Saves your work", "Prints your design", "Changes colors"],
                    correct: 0,
                    explanation: "Undo is like a magic eraser that takes back your last action!"
                },
                {
                    question: "What tool can you use to crop a picture?",
                    options: ["Crop tool in design software", "Scissors on paper", "Magnifying glass", "Ruler"],
                    correct: 0,
                    explanation: "Digital crop tools let us cut out just the part of a picture we want to keep!"
                },
                {
                    question: "What does 'bold' text mean?",
                    options: ["Thick, dark letters that stand out", "Slanted letters", "Colored letters", "Very small letters"],
                    correct: 0,
                    explanation: "Bold text is thicker and darker to make important words stand out!"
                },
                {
                    question: "What is animation?",
                    options: ["Making pictures appear to move", "Drawing with crayons", "Taking photographs", "Writing stories"],
                    correct: 0,
                    explanation: "Animation creates the illusion of movement by showing slightly different pictures quickly!"
                },
                {
                    question: "What makes a design look neat and organized?",
                    options: ["Good alignment and spacing", "Lots of different colors", "Very small text", "Random placement"],
                    correct: 0,
                    explanation: "When things are lined up and spaced well, designs look professional and easy to read!"
                },
                {
                    question: "What kind of creative project would you love to make?",
                    options: ["An animated story", "A poster for my room", "A game for my friends", "A digital art piece"],
                    correct: 0,
                    explanation: "All of these projects let you express creativity and share your ideas with others!"
                }
            ],
            "Problem Solving & Curiosity": [
                {
                    question: "What do you do when your computer freezes?",
                    options: ["Ask for help and try restarting", "Hit the computer", "Pour water on it", "Ignore the problem"],
                    correct: 0,
                    explanation: "When computers freeze, we should ask for help and try safe solutions like restarting!"
                },
                {
                    question: "What do you enjoy most about coding?",
                    options: ["Creating things and solving problems", "It's too difficult", "Nothing about it", "Only the games"],
                    correct: 0,
                    explanation: "Coding lets us be creative, solve puzzles, and bring our ideas to life!"
                },
                {
                    question: "What project would you love to build?",
                    options: ["A game to play with friends", "A story with animations", "A helpful app", "A digital art gallery"],
                    correct: 0,
                    explanation: "All of these projects would be amazing ways to use coding skills creatively!"
                },
                {
                    question: "How do you learn something new on a computer?",
                    options: ["Practice, ask questions, and explore", "Give up quickly", "Only watch others", "Avoid trying new things"],
                    correct: 0,
                    explanation: "The best way to learn is by practicing, asking questions, and not being afraid to explore!"
                },
                {
                    question: "Why do you think coding is important?",
                    options: ["It helps us create and solve problems", "It's only for adults", "It's not useful", "It's too hard to matter"],
                    correct: 0,
                    explanation: "Coding teaches us to think logically, be creative, and build solutions to help others!"
                }
            ]
        }
    },
    11: {
        name: "Joann's Expert Level (11 years old)",
        categories: {
            "Computer & Digital Literacy": [
                {
                    question: "What is an operating system?",
                    options: ["Software that manages computer hardware and other software", "A type of computer game", "A web browser", "A programming language"],
                    correct: 0,
                    explanation: "An operating system like Windows, macOS, or Linux manages all the computer's resources and programs!"
                },
                {
                    question: "Name two examples of web browsers.",
                    options: ["Chrome and Firefox", "Word and Excel", "Scratch and Python", "Windows and macOS"],
                    correct: 0,
                    explanation: "Web browsers like Chrome, Firefox, Safari, and Edge help us access websites on the internet!"
                },
                {
                    question: "What does 'save as' mean on a computer?",
                    options: ["Save a file with a new name or location", "Delete a file", "Open a file", "Print a file"],
                    correct: 0,
                    explanation: "'Save as' lets us save our work with a different name or in a different location!"
                },
                {
                    question: "What is the shortcut for copying text?",
                    options: ["Ctrl + C", "Ctrl + S", "Ctrl + P", "Ctrl + O"],
                    correct: 0,
                    explanation: "Ctrl + C copies text, and Ctrl + V pastes it somewhere else!"
                },
                {
                    question: "Explain what a file extension is (e.g., .jpg, .py).",
                    options: ["The part after the dot that tells us the file type", "The file's name", "The file's size", "The file's creation date"],
                    correct: 0,
                    explanation: "File extensions like .jpg (image), .py (Python), .docx (Word) tell us what type of file it is!"
                },
                {
                    question: "What is cloud storage used for?",
                    options: ["Storing files on remote servers accessible from anywhere", "Storing files only on your computer", "Deleting files automatically", "Making files smaller"],
                    correct: 0,
                    explanation: "Cloud storage like Google Drive or OneDrive lets us access our files from any device with internet!"
                },
                {
                    question: "How can you keep your computer safe from viruses?",
                    options: ["Use antivirus software and avoid suspicious links", "Never turn off the computer", "Click on every link you see", "Don't use passwords"],
                    correct: 0,
                    explanation: "Good security practices include antivirus software, safe browsing, and regular updates!"
                },
                {
                    question: "What is the difference between hardware and software?",
                    options: ["Hardware is physical parts, software is programs", "They are the same thing", "Hardware is software inside computers", "Software is always more expensive"],
                    correct: 0,
                    explanation: "Hardware includes physical parts like keyboard and monitor, while software includes programs and apps!"
                },
                {
                    question: "Name one online collaboration tool you know.",
                    options: ["Google Docs, Microsoft Teams, or Zoom", "Calculator", "Notepad", "Paint"],
                    correct: 0,
                    explanation: "Collaboration tools let multiple people work together on projects from different locations!"
                },
                {
                    question: "What is Canva primarily used for?",
                    options: ["Creating graphic designs and visual content", "Writing code", "Playing games", "Managing files"],
                    correct: 0,
                    explanation: "Canva is a user-friendly design tool for creating posters, presentations, and other visual content!"
                }
            ],
            "Computational Thinking": [
                {
                    question: "What is an algorithm?",
                    options: ["A step-by-step procedure to solve a problem", "A type of computer", "A programming language", "A computer virus"],
                    correct: 0,
                    explanation: "An algorithm is like a recipe - a clear set of steps to solve a problem or complete a task!"
                },
                {
                    question: "Arrange these steps in the right order: (a) Boil water (b) Pour tea (c) Add sugar.",
                    options: ["(a) Boil water, (b) Pour tea, (c) Add sugar", "(c) Add sugar, (a) Boil water, (b) Pour tea", "(b) Pour tea, (c) Add sugar, (a) Boil water", "All at the same time"],
                    correct: 0,
                    explanation: "Sequential thinking is important - we need to boil water first, then pour tea, then add sugar!"
                },
                {
                    question: "What does 'debugging' mean in programming?",
                    options: ["Finding and fixing errors in code", "Writing new code", "Deleting all code", "Running code faster"],
                    correct: 0,
                    explanation: "Debugging is like being a detective - finding problems in code and fixing them!"
                },
                {
                    question: "How many times will a loop 'for i in range(5)' execute?",
                    options: ["5 times", "4 times", "6 times", "Forever"],
                    correct: 0,
                    explanation: "range(5) creates numbers 0, 1, 2, 3, 4 - that's 5 numbers, so the loop runs 5 times!"
                },
                {
                    question: "What is a variable in programming?",
                    options: ["A container that stores data", "A type of loop", "A programming language", "A computer part"],
                    correct: 0,
                    explanation: "Variables are like labeled boxes that store information we want to remember and use later!"
                },
                {
                    question: "What does 'if-else' mean in coding?",
                    options: ["Make decisions based on conditions", "Repeat code forever", "Stop the program", "Print text"],
                    correct: 0,
                    explanation: "If-else statements let programs make decisions: 'if this is true, do this, otherwise do that!'"
                },
                {
                    question: "What does it mean when a program crashes?",
                    options: ["The program stops working due to an error", "The program runs perfectly", "The program runs faster", "The program saves data"],
                    correct: 0,
                    explanation: "When programs crash, they stop working because of an error or unexpected problem!"
                },
                {
                    question: "What is a Boolean value?",
                    options: ["True or False", "A number", "A text string", "A color"],
                    correct: 0,
                    explanation: "Boolean values can only be True or False - they're used for yes/no decisions in programming!"
                },
                {
                    question: "Write an example of a condition that checks if a number is greater than 10.",
                    options: ["if number > 10:", "if number = 10:", "if number + 10:", "if number < 10:"],
                    correct: 0,
                    explanation: "The > symbol means 'greater than', so 'number > 10' checks if the number is bigger than 10!"
                },
                {
                    question: "What is a function used for in programming?",
                    options: ["Grouping code to reuse and organize", "Storing data", "Making loops", "Creating variables"],
                    correct: 0,
                    explanation: "Functions are like mini-programs that do specific tasks and can be used over and over!"
                }
            ],
            "Scratch Programming": [
                {
                    question: "What is a sprite in Scratch?",
                    options: ["An object or character you can program", "A type of block", "A background image", "A sound file"],
                    correct: 0,
                    explanation: "Sprites are the actors in your Scratch projects - characters and objects you can program to move and interact!"
                },
                {
                    question: "How do you make a sprite move 10 steps in Scratch?",
                    options: ["Use the 'move 10 steps' block", "Click the sprite 10 times", "Press the spacebar 10 times", "Type '10 steps' in a text box"],
                    correct: 0,
                    explanation: "The 'move 10 steps' block from the Motion category makes sprites move forward!"
                },
                {
                    question: "What does the 'forever' block do?",
                    options: ["Repeats the blocks inside it continuously", "Runs code only once", "Stops all code", "Deletes the sprite"],
                    correct: 0,
                    explanation: "Forever blocks create infinite loops - the code inside keeps repeating until you stop the program!"
                },
                {
                    question: "What is the difference between 'broadcast' and 'say' blocks?",
                    options: ["Broadcast sends messages to other sprites, say shows text", "They do exactly the same thing", "Broadcast is louder than say", "Say sends messages, broadcast shows text"],
                    correct: 0,
                    explanation: "Broadcast blocks send invisible messages between sprites, while say blocks display text bubbles!"
                },
                {
                    question: "How do you change a background in Scratch?",
                    options: ["Click the stage and choose a new backdrop", "Drag a sprite to the background", "Use a say block", "Delete all sprites"],
                    correct: 0,
                    explanation: "Click on the stage (background area) and use the backdrop library to choose new backgrounds!"
                },
                {
                    question: "What does 'repeat 5' mean?",
                    options: ["Do the actions inside 5 times", "Wait for 5 seconds", "Move 5 steps", "Create 5 sprites"],
                    correct: 0,
                    explanation: "Repeat blocks create loops that run the code inside a specific number of times!"
                },
                {
                    question: "What is an event block in Scratch?",
                    options: ["A block that starts scripts when something happens", "A block that moves sprites", "A block that makes sounds", "A block that creates variables"],
                    correct: 0,
                    explanation: "Event blocks (like 'when green flag clicked') start scripts when specific things happen!"
                },
                {
                    question: "How can you detect when two sprites touch each other?",
                    options: ["Use the 'touching [sprite]' sensing block", "Look at the screen carefully", "Use a move block", "Use a sound block"],
                    correct: 0,
                    explanation: "The 'touching' block from Sensing can detect when sprites bump into each other!"
                },
                {
                    question: "What is a variable used for in Scratch?",
                    options: ["Storing and tracking information like scores", "Making sprites move", "Changing colors", "Playing sounds"],
                    correct: 0,
                    explanation: "Variables remember important information like player scores, names, or game settings!"
                },
                {
                    question: "What happens when you use the 'wait 2 seconds' block?",
                    options: ["The script pauses for 2 seconds before continuing", "The sprite moves for 2 seconds", "The sprite disappears for 2 seconds", "All sprites stop forever"],
                    correct: 0,
                    explanation: "Wait blocks create pauses in your script, like taking a breath between actions!"
                }
            ],
            "Python Introduction": [
                {
                    question: "What does the following code print? print('Hello, Joann!')",
                    options: ["Hello, Joann!", "print('Hello, Joann!')", "Error message", "Nothing"],
                    correct: 0,
                    explanation: "The print() function displays text on the screen exactly as written inside the quotes!"
                },
                {
                    question: "What is the difference between '=' and '==' in Python?",
                    options: ["= assigns values, == compares values", "They do the same thing", "= is for numbers, == is for text", "= is older, == is newer"],
                    correct: 0,
                    explanation: "= assigns a value to a variable, while == checks if two values are equal!"
                },
                {
                    question: "Write a simple 'if' statement in Python.",
                    options: ["if age > 10:", "if age = 10", "if (age > 10)", "if age > 10 then"],
                    correct: 0,
                    explanation: "Python if statements end with a colon and the code inside is indented!"
                },
                {
                    question: "What is a syntax error?",
                    options: ["An error in the code's grammar or structure", "A logical mistake in thinking", "A computer hardware problem", "A network connection issue"],
                    correct: 0,
                    explanation: "Syntax errors are like grammar mistakes - the computer can't understand what you wrote!"
                },
                {
                    question: "Name three Python data types.",
                    options: ["String, integer, and boolean", "Red, blue, and green", "Fast, medium, and slow", "Big, small, and tiny"],
                    correct: 0,
                    explanation: "Python has many data types: strings (text), integers (whole numbers), floats (decimals), booleans (True/False), and more!"
                },
                {
                    question: "What does input() do in Python?",
                    options: ["Gets text typed by the user", "Prints text to screen", "Does mathematical calculations", "Saves files"],
                    correct: 0,
                    explanation: "input() pauses the program and waits for the user to type something!"
                },
                {
                    question: "What is a list in Python?",
                    options: ["A collection of items in order", "A single number", "A true/false value", "A piece of text"],
                    correct: 0,
                    explanation: "Lists store multiple items in order, like a shopping list: ['apples', 'bananas', 'oranges']"
                },
                {
                    question: "How do you write a comment in Python?",
                    options: ["Use # before the text", "Use // before the text", "Use /* around the text */", "Use -- before the text"],
                    correct: 0,
                    explanation: "Comments start with # and help explain what your code does to other programmers!"
                },
                {
                    question: "What does this program output? for i in range(3): print('Hi')",
                    options: ["Hi Hi Hi (each on a new line)", "Hi Hi Hi (on one line)", "3", "Hi"],
                    correct: 0,
                    explanation: "This loop runs 3 times, printing 'Hi' each time on a new line!"
                },
                {
                    question: "What is indentation and why is it important in Python?",
                    options: ["Spaces that show which code belongs together", "Making code look pretty", "A type of error", "A Python keyword"],
                    correct: 0,
                    explanation: "Python uses indentation (spaces or tabs) to group code together, like paragraphs in writing!"
                }
            ],
            "Creativity & Design": [
                {
                    question: "What makes a digital design attractive?",
                    options: ["Good use of colors, fonts, and layout", "Using as many effects as possible", "Making everything the same size", "Using only one color"],
                    correct: 0,
                    explanation: "Attractive designs balance colors, fonts, spacing, and layout to create visual harmony!"
                },
                {
                    question: "Mention one tool you can use to design posters.",
                    options: ["Canva, Adobe Photoshop, or GIMP", "Microsoft Word only", "Calculator", "Web browser"],
                    correct: 0,
                    explanation: "Design tools like Canva are user-friendly, while Photoshop and GIMP offer more advanced features!"
                },
                {
                    question: "What colors would you use to design a fun children's poster and why?",
                    options: ["Bright, cheerful colors because they're engaging and energetic", "Only black and white to be serious", "Very dark colors to be mysterious", "Random colors with no plan"],
                    correct: 0,
                    explanation: "Bright colors like red, yellow, blue, and green capture children's attention and create excitement!"
                },
                {
                    question: "What is a template in design?",
                    options: ["A pre-made design you can customize", "A type of font", "A color scheme", "A picture file"],
                    correct: 0,
                    explanation: "Templates are like coloring books - they provide the structure, and you add your own content and style!"
                },
                {
                    question: "What is a thumbnail used for?",
                    options: ["A small preview image", "A type of font", "A measurement tool", "A color picker"],
                    correct: 0,
                    explanation: "Thumbnails are small preview images that help you quickly see what a design or video looks like!"
                },
                {
                    question: "How do you align text in Canva?",
                    options: ["Use the alignment tools in the toolbar", "Guess where it looks good", "Always put it in the center", "Text aligns itself automatically"],
                    correct: 0,
                    explanation: "Canva has alignment tools that help you line up text left, center, right, or justified!"
                },
                {
                    question: "What kind of design would you make for your coding project?",
                    options: ["A colorful interface that's easy to understand", "Something very complicated", "Only text with no graphics", "Copy someone else's design exactly"],
                    correct: 0,
                    explanation: "Good project designs are colorful, clear, and help users understand how to interact with your program!"
                },
                {
                    question: "Why is font choice important in a design?",
                    options: ["Different fonts convey different moods and readability", "All fonts look exactly the same", "Fonts don't matter at all", "Only one font should ever be used"],
                    correct: 0,
                    explanation: "Fonts can be playful, serious, elegant, or bold - they help communicate the right feeling!"
                },
                {
                    question: "What is animation in a presentation?",
                    options: ["Making objects move or appear with effects", "Adding lots of text", "Using only pictures", "Making slides change colors"],
                    correct: 0,
                    explanation: "Animation adds movement and visual interest, making presentations more engaging and dynamic!"
                },
                {
                    question: "If you could design an app, what would it do?",
                    options: ["Help people learn or solve a problem", "Do nothing useful", "Be impossible to use", "Copy existing apps exactly"],
                    correct: 0,
                    explanation: "The best apps solve real problems or help people learn, create, or connect with others!"
                }
            ]
        }
    },
    grade5: {
        name: "Grade 5 ICT Quiz (First Term)",
        categories: {
            "Week 1 - Revision of Previous Terms": [
                {
                    question: "ICT stands for __________.",
                    type: "fill-in-gap",
                    correct: "Information and Communication Technology",
                    explanation: "ICT stands for Information and Communication Technology - the use of technology to communicate and handle information."
                },
                {
                    question: "Which of these is a physical part of a computer?",
                    type: "multiple-choice",
                    options: ["Software", "CPU", "Hardware", "Paint"],
                    correct: 2,
                    explanation: "Hardware refers to the physical parts of a computer that you can see and touch."
                },
                {
                    question: "The instructions that tell the hardware what to do are called __________.",
                    type: "fill-in-gap",
                    correct: "Software",
                    explanation: "Software consists of programs and instructions that tell the computer hardware how to perform tasks."
                },
                {
                    question: "Which of these is an input device?",
                    type: "multiple-choice",
                    options: ["Monitor", "Speaker", "Keyboard", "Printer"],
                    correct: 2,
                    explanation: "A keyboard is an input device because it allows you to input data into the computer."
                },
                {
                    question: "Which device shows what we are doing on the computer screen?",
                    type: "multiple-choice",
                    options: ["Mouse", "Monitor", "Keyboard", "Scanner"],
                    correct: 1,
                    explanation: "The monitor displays everything we do on the computer visually."
                },
                {
                    question: "The brain of the computer is called the __________.",
                    type: "fill-in-gap",
                    correct: "CPU",
                    explanation: "The CPU (Central Processing Unit) is called the brain because it processes all information and controls the computer."
                },
                {
                    question: "Hardware includes the following except:",
                    type: "multiple-choice",
                    options: ["Mouse", "Monitor", "Paint", "Printer"],
                    correct: 2,
                    explanation: "Paint is software (a program), while mouse, monitor, and printer are hardware (physical components)."
                },
                {
                    question: "An example of software is __________.",
                    type: "fill-in-gap",
                    correct: "Microsoft Word",
                    explanation: "Microsoft Word is a software application used for creating and editing documents."
                },
                {
                    question: "Which of these is an output device?",
                    type: "multiple-choice",
                    options: ["Mouse", "Keyboard", "Printer", "Scanner"],
                    correct: 2,
                    explanation: "A printer is an output device because it produces results from the computer onto paper."
                },
                {
                    question: "ICT means using technology to handle and share __________.",
                    type: "fill-in-gap",
                    correct: "Information",
                    explanation: "ICT is about using technology to process, store, and communicate information effectively."
                }
            ],
            "Week 2 - Exploration of Files": [
                {
                    question: "A file is a collection of __________.",
                    type: "fill-in-gap",
                    correct: "Data or information",
                    explanation: "Files contain data or information that is stored digitally with a specific name."
                },
                {
                    question: "A folder is also called a __________.",
                    type: "fill-in-gap",
                    correct: "Directory",
                    explanation: "A folder is also called a directory - both terms refer to a container for organizing files."
                },
                {
                    question: "Which of the following is a document file type?",
                    type: "multiple-choice",
                    options: [".jpg", ".docx", ".mp3", ".mp4"],
                    correct: 1,
                    explanation: ".docx is the file extension for Microsoft Word documents."
                },
                {
                    question: "Which file type is used for pictures?",
                    type: "multiple-choice",
                    options: [".pdf", ".png", ".mp3", ".pptx"],
                    correct: 1,
                    explanation: ".png is a common image file format used for storing pictures."
                },
                {
                    question: "What file extension is used for music?",
                    type: "multiple-choice",
                    options: [".jpg", ".mp3", ".docx", ".pdf"],
                    correct: 1,
                    explanation: ".mp3 is a common audio file format used for storing music files."
                },
                {
                    question: "To create a new folder, you right-click, choose __________, then Folder.",
                    type: "fill-in-gap",
                    correct: "New",
                    explanation: "Right-clicking and selecting 'New' then 'Folder' creates a new folder."
                },
                {
                    question: "To rename a file, right-click and select __________.",
                    type: "fill-in-gap",
                    correct: "Rename",
                    explanation: "Right-clicking on a file and selecting 'Rename' allows you to change its name."
                },
                {
                    question: "When a file is deleted, it goes into the __________.",
                    type: "fill-in-gap",
                    correct: "Recycle Bin",
                    explanation: "Deleted files go to the Recycle Bin where they can be restored if needed."
                },
                {
                    question: "To move a file, click, hold, and __________ it to another folder.",
                    type: "fill-in-gap",
                    correct: "Drag",
                    explanation: "Dragging a file means clicking and holding while moving it to a new location."
                },
                {
                    question: "Which of these is a video file type?",
                    type: "multiple-choice",
                    options: [".mp4", ".docx", ".png", ".pdf"],
                    correct: 0,
                    explanation: ".mp4 is a video file format commonly used for storing movies and video clips."
                }
            ],
            "Week 3 - Keyboard Shortcuts": [
                {
                    question: "A keyboard shortcut helps you perform a task more __________.",
                    type: "fill-in-gap",
                    correct: "Quickly",
                    explanation: "Keyboard shortcuts make tasks faster and more efficient than using menus."
                },
                {
                    question: "Ctrl + C is used to __________.",
                    type: "multiple-choice",
                    options: ["Cut", "Copy", "Paste", "Save"],
                    correct: 1,
                    explanation: "Ctrl + C copies selected text or files to the clipboard."
                },
                {
                    question: "Ctrl + V is used to __________.",
                    type: "multiple-choice",
                    options: ["Paste", "Copy", "Undo", "Save"],
                    correct: 0,
                    explanation: "Ctrl + V pastes whatever is currently copied or cut from the clipboard."
                },
                {
                    question: "Ctrl + X is used to __________.",
                    type: "multiple-choice",
                    options: ["Cut", "Copy", "Paste", "Select All"],
                    correct: 0,
                    explanation: "Ctrl + X cuts (removes) selected text or files and places them on the clipboard."
                },
                {
                    question: "Ctrl + Z is used to __________ the last action.",
                    type: "fill-in-gap",
                    correct: "Undo",
                    explanation: "Ctrl + Z undoes the last action, helping to reverse mistakes."
                },
                {
                    question: "Ctrl + S helps you to __________ your work.",
                    type: "fill-in-gap",
                    correct: "Save",
                    explanation: "Ctrl + S saves the current document or file you're working on."
                },
                {
                    question: "Ctrl + A is used to __________ all text or items.",
                    type: "fill-in-gap",
                    correct: "Select",
                    explanation: "Ctrl + A selects all content in the current document or folder."
                },
                {
                    question: "Alt + Tab helps to switch between __________.",
                    type: "fill-in-gap",
                    correct: "Open applications",
                    explanation: "Alt + Tab allows quick switching between different open programs or applications."
                },
                {
                    question: "Windows Key + D shows or hides the __________.",
                    type: "fill-in-gap",
                    correct: "Desktop",
                    explanation: "Windows Key + D instantly shows the desktop by minimizing all open windows."
                },
                {
                    question: "Keyboard shortcuts make working on the computer more __________.",
                    type: "fill-in-gap",
                    correct: "Efficient",
                    explanation: "Shortcuts increase efficiency by reducing the time needed to perform common tasks."
                }
            ],
            "Week 4 - Introduction to the Internet": [
                {
                    question: "The Internet is a global network that connects __________.",
                    type: "fill-in-gap",
                    correct: "Millions of computers",
                    explanation: "The Internet connects millions of computers and devices worldwide."
                },
                {
                    question: "The Internet is also called the __________.",
                    type: "fill-in-gap",
                    correct: "Web",
                    explanation: "The Internet is also commonly called the Web or World Wide Web."
                },
                {
                    question: "A website is a collection of related __________.",
                    type: "fill-in-gap",
                    correct: "Web pages",
                    explanation: "Websites consist of multiple related web pages that are linked together."
                },
                {
                    question: "The unique address of a website is called a __________.",
                    type: "fill-in-gap",
                    correct: "URL",
                    explanation: "URL (Uniform Resource Locator) is the specific address of a website."
                },
                {
                    question: "Which of these is a search engine?",
                    type: "multiple-choice",
                    options: ["Facebook", "Google", "WhatsApp", "YouTube"],
                    correct: 1,
                    explanation: "Google is a search engine that helps find information on the Internet."
                },
                {
                    question: "Which of the following is an example of a website?",
                    type: "multiple-choice",
                    options: ["www.wikipedia.org", ".mp3", "Desktop", "CPU"],
                    correct: 0,
                    explanation: "Wikipedia.org is a website - a collection of web pages accessible through the Internet."
                },
                {
                    question: "You can send and receive __________ using the Internet.",
                    type: "fill-in-gap",
                    correct: "Emails",
                    explanation: "Email is one of the main ways we communicate through the Internet."
                },
                {
                    question: "Watching educational videos online is a benefit of using the __________.",
                    type: "fill-in-gap",
                    correct: "Internet",
                    explanation: "The Internet provides access to educational content and learning resources."
                },
                {
                    question: "It is important to use social media with __________.",
                    type: "fill-in-gap",
                    correct: "Adult supervision",
                    explanation: "Children should always use social media safely with adult supervision."
                },
                {
                    question: "Playing online games should be done with __________.",
                    type: "fill-in-gap",
                    correct: "Permission",
                    explanation: "Children should always get permission before playing online games for safety."
                }
            ]
        }
    }
};

// Function to get questions for a specific age
function getQuestionsForAge(age) {
    return quizData[age] || null;
}

// Function to get all questions for an age in a flat array
function getFlatQuestionArray(age) {
    const ageData = quizData[age];
    if (!ageData) return [];
    
    const questions = [];
    for (const category in ageData.categories) {
        ageData.categories[category].forEach(question => {
            questions.push({
                ...question,
                category: category
            });
        });
    }
    return questions;
}

// Function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}