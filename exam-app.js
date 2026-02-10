// ICT Examination Application
class ExamApp {
    constructor() {
        this.student = {
            name: '',
            grade: ''
        };
        this.examData = null;
        this.currentSection = null;
        this.currentSectionName = '';
        this.allQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentSectionIndex = 0;
        this.sectionNames = ['objectives', 'fillBlanks', 'theory'];
        this.answers = [];
        this.sectionScores = {};
        this.startTime = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEventListeners();
        this.showScreen('welcomeScreen');
    }

    bindEventListeners() {
        // Welcome screen events
        document.getElementById('startExam').addEventListener('click', () => this.startExam());
        document.getElementById('userName').addEventListener('input', () => this.validateForm());
        document.getElementById('userGrade').addEventListener('change', () => this.validateForm());

        // Exam screen events
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());

        // Results screen events
        document.getElementById('printResults').addEventListener('click', () => this.printResults());
        document.getElementById('retakeExam').addEventListener('click', () => this.retakeExam());

        // Handle enter key
        document.getElementById('userName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startExam();
        });
    }

    validateForm() {
        const nameInput = document.getElementById('userName');
        const gradeSelect = document.getElementById('userGrade');
        const startButton = document.getElementById('startExam');
        
        const isValid = nameInput.value.trim() !== '' && gradeSelect.value !== '';
        startButton.disabled = !isValid;
        
        if (isValid) {
            startButton.classList.add('pulse');
        } else {
            startButton.classList.remove('pulse');
        }
    }

    startExam() {
        const nameInput = document.getElementById('userName');
        const gradeSelect = document.getElementById('userGrade');
        
        if (nameInput.value.trim() === '' || gradeSelect.value === '') {
            this.showNotification('Please enter your name and select your grade!', 'error');
            return;
        }

        this.student.name = nameInput.value.trim();
        this.student.grade = gradeSelect.value;
        
        // Load exam data
        this.examData = getExamData(this.student.grade);
        if (!this.examData) {
            this.showNotification('Exam data not available for this grade!', 'error');
            return;
        }

        // Initialize exam
        this.startTime = new Date();
        this.currentSectionIndex = 0;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.sectionScores = {};
        
        // Load first section
        this.loadSection(this.sectionNames[0]);
        
        // Setup exam interface
        this.setupExamInterface();
        this.showScreen('examScreen');
        this.displayQuestion();
    }

    loadSection(sectionName) {
        this.currentSectionName = sectionName;
        this.currentSection = this.examData.sections[sectionName];
        this.allQuestions = this.currentSection.questions;
        this.currentQuestionIndex = 0;
    }

    setupExamInterface() {
        document.getElementById('examTitle').textContent = this.examData.name;
        document.getElementById('displayName').textContent = this.student.name;
        document.getElementById('displayGrade').textContent = this.getGradeLabel(this.student.grade);
    }

    getGradeLabel(grade) {
        const labels = {
            'grade1': 'Grade 1',
            'grade2': 'Grade 2',
            'grade3': 'Grade 3',
            'grade4': 'Grade 4',
            'grade5': 'Grade 5'
        };
        return labels[grade] || grade;
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.allQuestions.length) {
            // Move to next section or show results
            this.moveToNextSection();
            return;
        }

        const question = this.allQuestions[this.currentQuestionIndex];
        const questionNumberOverall = this.getTotalQuestionsAnswered() + 1;
        
        // Update section info
        document.getElementById('sectionTitle').textContent = this.currentSection.title;
        document.getElementById('sectionMarks').textContent = `${this.currentSection.marks} Marks`;
        document.getElementById('currentSection').textContent = this.getSectionLabel();
        
        // Update question counter
        document.getElementById('questionBadge').textContent = `Question ${questionNumberOverall}`;
        document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.allQuestions.length;
        
        // Update progress bar
        this.updateProgress();
        
        // Display question text
        document.getElementById('questionText').textContent = question.question;
        
        // Create answer options based on question type
        if (this.currentSectionName === 'objectives') {
            this.createMultipleChoiceOptions(question);
        } else if (this.currentSectionName === 'fillBlanks') {
            this.createFillBlankInput(question);
        } else if (this.currentSectionName === 'theory') {
            this.createTheoryInput(question);
        }
        
        // Disable next button until answer is provided
        document.getElementById('nextQuestion').disabled = true;
    }

    getTotalQuestionsAnswered() {
        return this.answers.length;
    }

    getSectionLabel() {
        const labels = {
            'objectives': 'Section A: Objectives',
            'fillBlanks': 'Section B: Fill in the Blanks',
            'theory': 'Section C: Theory'
        };
        return labels[this.currentSectionName] || '';
    }

    createMultipleChoiceOptions(question) {
        const container = document.getElementById('answersContainer');
        container.innerHTML = '';
        container.className = 'answers-container';
        
        question.options.forEach((option, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${option}`;
            answerDiv.dataset.index = index;
            
            answerDiv.addEventListener('click', () => this.selectAnswer(index, answerDiv, question));
            
            container.appendChild(answerDiv);
        });
    }

    createFillBlankInput(question) {
        const container = document.getElementById('answersContainer');
        container.innerHTML = '';
        container.className = 'answers-container fill-blank-container';
        
        const inputDiv = document.createElement('div');
        inputDiv.className = 'input-answer-box';
        
        const label = document.createElement('label');
        label.textContent = 'Your Answer:';
        label.className = 'input-label';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'answer-input';
        input.placeholder = 'Type your answer here...';
        input.id = 'answerInput';
        
        input.addEventListener('input', (e) => {
            const nextBtn = document.getElementById('nextQuestion');
            nextBtn.disabled = e.target.value.trim() === '';
        });
        
        inputDiv.appendChild(label);
        inputDiv.appendChild(input);
        container.appendChild(inputDiv);
        
        // Focus on input
        setTimeout(() => input.focus(), 100);
    }

    createTheoryInput(question) {
        const container = document.getElementById('answersContainer');
        container.innerHTML = '';
        container.className = 'answers-container theory-container';
        
        const inputDiv = document.createElement('div');
        inputDiv.className = 'theory-answer-box';
        
        const label = document.createElement('label');
        label.textContent = 'Your Answer:';
        label.className = 'theory-label';
        
        const textarea = document.createElement('textarea');
        textarea.className = 'theory-textarea';
        textarea.placeholder = 'Write your answer here...';
        textarea.id = 'theoryAnswer';
        textarea.rows = 5;
        
        textarea.addEventListener('input', (e) => {
            const nextBtn = document.getElementById('nextQuestion');
            nextBtn.disabled = e.target.value.trim() === '';
        });
        
        inputDiv.appendChild(label);
        inputDiv.appendChild(textarea);
        container.appendChild(inputDiv);
        
        // Focus on textarea
        setTimeout(() => textarea.focus(), 100);
    }

    selectAnswer(selectedIndex, selectedElement, question) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mark current selection
        selectedElement.classList.add('selected');
        
        // Check if answer is correct
        const isCorrect = selectedIndex === question.correct;
        
        // Store the answer
        this.answers.push({
            section: this.currentSectionName,
            questionIndex: this.currentQuestionIndex,
            question: question.question,
            userAnswer: selectedIndex,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            explanation: question.explanation
        });
        
        // Show feedback
        this.showAnswerFeedback(isCorrect, question.explanation);
        
        // Enable next button
        document.getElementById('nextQuestion').disabled = false;
        
        // Highlight correct/incorrect after delay
        setTimeout(() => {
            this.highlightCorrectAnswer(question.correct, selectedIndex);
        }, 800);
    }

    highlightCorrectAnswer(correctIndex, selectedIndex) {
        const options = document.querySelectorAll('.answer-option');
        
        options.forEach((option, index) => {
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== correctIndex) {
                option.classList.add('incorrect');
            }
            // Disable clicking
            option.style.pointerEvents = 'none';
        });
    }

    showAnswerFeedback(isCorrect, explanation) {
        const feedbackDiv = document.getElementById('feedbackAnimation');
        const feedbackContent = feedbackDiv.querySelector('.feedback-content');
        const emojiDiv = feedbackDiv.querySelector('.feedback-emoji');
        const textDiv = feedbackDiv.querySelector('.feedback-text');
        
        if (isCorrect) {
            emojiDiv.textContent = '✅';
            textDiv.textContent = 'Correct! ' + explanation;
            feedbackContent.className = 'feedback-content correct';
        } else {
            emojiDiv.textContent = '📝';
            textDiv.textContent = explanation;
            feedbackContent.className = 'feedback-content incorrect';
        }
        
        feedbackDiv.classList.add('show');
        
        setTimeout(() => {
            feedbackDiv.classList.remove('show');
        }, 2500);
    }

    nextQuestion() {
        // For fill-blank and theory questions, handle answer submission
        if (this.currentSectionName === 'fillBlanks') {
            const input = document.getElementById('answerInput');
            if (!input || input.value.trim() === '') return;
            
            const question = this.allQuestions[this.currentQuestionIndex];
            const userAnswer = input.value.trim();
            const isCorrect = validateFillBlankAnswer(userAnswer, question.correct);
            
            this.answers.push({
                section: this.currentSectionName,
                questionIndex: this.currentQuestionIndex,
                question: question.question,
                userAnswer: userAnswer,
                correctAnswer: question.correct.join(' or '),
                isCorrect: isCorrect,
                explanation: question.explanation
            });
            
        } else if (this.currentSectionName === 'theory') {
            const textarea = document.getElementById('theoryAnswer');
            if (!textarea || textarea.value.trim() === '') return;
            
            const question = this.allQuestions[this.currentQuestionIndex];
            const userAnswer = textarea.value.trim();
            const isCorrect = validateTheoryAnswer(userAnswer, question);
            
            this.answers.push({
                section: this.currentSectionName,
                questionIndex: this.currentQuestionIndex,
                question: question.question,
                userAnswer: userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        }
        
        // Move to next question
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    moveToNextSection() {
        this.currentSectionIndex++;
        
        if (this.currentSectionIndex < this.sectionNames.length) {
            // Load next section
            const nextSection = this.sectionNames[this.currentSectionIndex];
            this.loadSection(nextSection);
            this.displayQuestion();
        } else {
            // All sections complete, show results
            this.calculateResults();
            this.showResults();
        }
    }

    updateProgress() {
        const totalQuestions = this.getTotalQuestions();
        const answered = this.answers.length;
        const progress = (answered / totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    getTotalQuestions() {
        let total = 0;
        for (const sectionName of this.sectionNames) {
            total += this.examData.sections[sectionName].questions.length;
        }
        return total;
    }

    calculateResults() {
        // Calculate score for each section
        this.sectionScores = {};
        
        for (const sectionName of this.sectionNames) {
            const sectionAnswers = this.answers.filter(a => a.section === sectionName);
            const correct = sectionAnswers.filter(a => a.isCorrect).length;
            const total = sectionAnswers.length;
            const marks = this.examData.sections[sectionName].marks;
            const marksObtained = (correct / total) * marks;
            
            this.sectionScores[sectionName] = {
                correct: correct,
                total: total,
                marks: marks,
                marksObtained: Math.round(marksObtained * 10) / 10,
                percentage: Math.round((marksObtained / marks) * 100)
            };
        }
    }

    showResults() {
        // Calculate overall score
        const totalMarks = this.examData.totalMarks;
        let totalObtained = 0;
        
        for (const sectionName in this.sectionScores) {
            totalObtained += this.sectionScores[sectionName].marksObtained;
        }
        
        const percentage = Math.round((totalObtained / totalMarks) * 100);
        const grade = this.calculateGrade(percentage);
        
        // Display student info
        document.getElementById('resultStudentName').textContent = this.student.name;
        document.getElementById('resultGrade').textContent = this.getGradeLabel(this.student.grade);
        document.getElementById('resultDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Display overall score
        document.getElementById('scorePercentage').textContent = percentage + '%';
        document.getElementById('finalScore').textContent = totalObtained.toFixed(1);
        document.getElementById('totalMarks').textContent = totalMarks;
        
        // Display grade
        document.getElementById('gradeBadge').textContent = grade.letter;
        document.getElementById('gradeLabel').textContent = grade.remark;
        
        // Apply grade color
        const gradeBadge = document.getElementById('gradeBadge');
        gradeBadge.style.background = grade.color;
        
        // Display section breakdown
        this.displaySectionBreakdown();
        
        // Display remarks
        this.displayRemarks(percentage, grade);
        
        // Show results screen
        this.showScreen('resultsScreen');
        
        // Save results
        this.saveResults();
    }

    calculateGrade(percentage) {
        if (percentage >= 90) {
            return { letter: 'A+', remark: 'Outstanding!', color: '#4caf50' };
        } else if (percentage >= 80) {
            return { letter: 'A', remark: 'Excellent!', color: '#8bc34a' };
        } else if (percentage >= 70) {
            return { letter: 'B', remark: 'Very Good!', color: '#ffc107' };
        } else if (percentage >= 60) {
            return { letter: 'C', remark: 'Good!', color: '#ff9800' };
        } else if (percentage >= 50) {
            return { letter: 'D', remark: 'Fair', color: '#ff5722' };
        } else {
            return { letter: 'F', remark: 'Needs Improvement', color: '#f44336' };
        }
    }

    displaySectionBreakdown() {
        const container = document.getElementById('breakdownContainer');
        container.innerHTML = '';
        
        const sectionLabels = {
            'objectives': 'Section A: Objectives',
            'fillBlanks': 'Section B: Fill in the Blanks',
            'theory': 'Section C: Theory'
        };
        
        for (const sectionName in this.sectionScores) {
            const score = this.sectionScores[sectionName];
            
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-score-card';
            
            sectionDiv.innerHTML = `
                <div class="section-name">${sectionLabels[sectionName]}</div>
                <div class="section-stats">
                    <div class="stat">
                        <span class="stat-label">Questions:</span>
                        <span class="stat-value">${score.correct}/${score.total}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Marks:</span>
                        <span class="stat-value">${score.marksObtained}/${score.marks}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Percentage:</span>
                        <span class="stat-value">${score.percentage}%</span>
                    </div>
                </div>
                <div class="section-progress-bar">
                    <div class="section-progress-fill" style="width: ${score.percentage}%; background: ${this.getProgressColor(score.percentage)}"></div>
                </div>
            `;
            
            container.appendChild(sectionDiv);
        }
    }

    getProgressColor(percentage) {
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 70) return '#8bc34a';
        if (percentage >= 60) return '#ffc107';
        if (percentage >= 50) return '#ff9800';
        return '#f44336';
    }

    displayRemarks(percentage, grade) {
        const remarksBox = document.getElementById('remarksBox');
        let remarks = '';
        
        if (percentage >= 90) {
            remarks = 'Outstanding performance! You have demonstrated excellent understanding of ICT concepts. Keep up the excellent work!';
        } else if (percentage >= 80) {
            remarks = 'Excellent work! You have shown strong grasp of ICT fundamentals. Continue practicing to maintain this level.';
        } else if (percentage >= 70) {
            remarks = 'Very good effort! You understand most concepts well. Review areas where you lost marks for better performance.';
        } else if (percentage >= 60) {
            remarks = 'Good attempt! You have fair understanding. Focus on studying the areas where you need improvement.';
        } else if (percentage >= 50) {
            remarks = 'Fair performance. You need to spend more time studying and practicing ICT concepts.';
        } else {
            remarks = 'You need significant improvement. Please see your teacher for extra help and study materials.';
        }
        
        remarksBox.textContent = remarks;
    }

    printResults() {
        // Populate print view with data
        const totalMarks = this.examData.totalMarks;
        let totalObtained = 0;
        
        for (const sectionName in this.sectionScores) {
            totalObtained += this.sectionScores[sectionName].marksObtained;
        }
        
        const percentage = Math.round((totalObtained / totalMarks) * 100);
        const grade = this.calculateGrade(percentage);
        
        document.getElementById('printStudentName').textContent = this.student.name;
        document.getElementById('printGrade').textContent = this.getGradeLabel(this.student.grade);
        document.getElementById('printDate').textContent = new Date().toLocaleDateString();
        
        // Populate scores table
        const tbody = document.getElementById('printScoresBody');
        tbody.innerHTML = '';
        
        const sectionLabels = {
            'objectives': 'Section A: Objectives',
            'fillBlanks': 'Section B: Fill in the Blanks',
            'theory': 'Section C: Theory'
        };
        
        for (const sectionName in this.sectionScores) {
            const score = this.sectionScores[sectionName];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sectionLabels[sectionName]}</td>
                <td>${score.total}</td>
                <td>${score.correct}</td>
                <td>${score.marksObtained.toFixed(1)}</td>
                <td>${score.marks}</td>
                <td>${score.percentage}%</td>
            `;
            tbody.appendChild(row);
        }
        
        document.getElementById('printTotalObtained').innerHTML = `<strong>${totalObtained.toFixed(1)}</strong>`;
        document.getElementById('printTotalMarks').innerHTML = `<strong>${totalMarks}</strong>`;
        document.getElementById('printOverallPercentage').innerHTML = `<strong>${percentage}%</strong>`;
        
        document.getElementById('printGradeLetter').textContent = grade.letter;
        document.getElementById('printGradeRemark').textContent = grade.remark;
        
        document.getElementById('printRemarks').textContent = document.getElementById('remarksBox').textContent;
        
        // Trigger print
        window.print();
    }

    saveResults() {
        const result = {
            name: this.student.name,
            grade: this.student.grade,
            date: new Date().toISOString(),
            totalMarks: this.examData.totalMarks,
            totalObtained: Object.values(this.sectionScores).reduce((sum, s) => sum + s.marksObtained, 0),
            percentage: Math.round((Object.values(this.sectionScores).reduce((sum, s) => sum + s.marksObtained, 0) / this.examData.totalMarks) * 100),
            sectionScores: this.sectionScores,
            answers: this.answers,
            duration: new Date() - this.startTime
        };
        
        let allResults = JSON.parse(localStorage.getItem('examResults') || '[]');
        allResults.push(result);
        
        if (allResults.length > 100) {
            allResults = allResults.slice(-100);
        }
        
        localStorage.setItem('examResults', JSON.stringify(allResults));
    }

    retakeExam() {
        this.showScreen('welcomeScreen');
        document.getElementById('userName').value = this.student.name;
        document.getElementById('userGrade').value = '';
        this.validateForm();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4caf50'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Comic Neue', cursive;
            font-weight: bold;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add notification animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @media print {
        body * {
            visibility: hidden;
        }
        #printView, #printView * {
            visibility: visible;
        }
        #printView {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
    }
`;
document.head.appendChild(styleSheet);

// Initialize the exam app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.examApp = new ExamApp();
});
