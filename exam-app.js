// ICT Examination Application - Enhanced with Weighted Scoring & Score Sheets
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
        this.weightedScores = {};
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
        document.getElementById('downloadReport').addEventListener('click', () => this.downloadStudentReport());
        document.getElementById('viewScoreSheet').addEventListener('click', () => {
            window.open('scoresheet.html', '_blank');
        });

        // Handle enter key
        document.getElementById('userName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startExam();
        });
    }

    validateForm() {
        const nameInput = document.getElementById('userName');
        const gradeSelect = document.getElementById('userGrade');
        const startButton = document.getElementById('startExam');
        const nameError = document.getElementById('nameError');
        
        const name = nameInput.value.trim();
        const nameParts = name.split(/\s+/).filter(p => p.length > 0);
        const nameValid = nameParts.length >= 2; // Require at least first name + surname
        const gradeValid = gradeSelect.value !== '';
        
        // Show/hide name validation error
        if (name.length > 0 && !nameValid) {
            nameError.style.display = 'block';
        } else {
            nameError.style.display = 'none';
        }
        
        const isValid = nameValid && gradeValid;
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
        
        const name = nameInput.value.trim();
        const nameParts = name.split(/\s+/).filter(p => p.length > 0);
        
        if (nameParts.length < 2) {
            this.showNotification('Please enter your full name (first name and surname)!', 'error');
            return;
        }
        
        if (gradeSelect.value === '') {
            this.showNotification('Please select your class!', 'error');
            return;
        }

        this.student.name = name;
        this.student.grade = gradeSelect.value;
        
        // Load exam data
        this.examData = getExamData(this.student.grade);
        if (!this.examData) {
            this.showNotification('Exam data not available for this class!', 'error');
            return;
        }

        // Initialize exam
        this.startTime = new Date();
        this.currentSectionIndex = 0;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.sectionScores = {};
        this.weightedScores = {};
        
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
            this.moveToNextSection();
            return;
        }

        const question = this.allQuestions[this.currentQuestionIndex];
        const questionNumberOverall = this.getTotalQuestionsAnswered() + 1;
        
        // Update section info
        document.getElementById('sectionTitle').textContent = this.currentSection.title;
        // show actual marks for the current section (uses values from exam-data.js)
        document.getElementById('sectionMarks').textContent = (this.currentSection.marks || 0) + ' Marks';
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
        
        setTimeout(() => textarea.focus(), 100);
    }

    selectAnswer(selectedIndex, selectedElement, question) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        selectedElement.classList.add('selected');
        
        const isCorrect = selectedIndex === question.correct;
        
        this.answers.push({
            section: this.currentSectionName,
            questionIndex: this.currentQuestionIndex,
            question: question.question,
            userAnswer: selectedIndex,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            explanation: question.explanation
        });
        
        this.showAnswerFeedback(isCorrect, question.explanation);
        document.getElementById('nextQuestion').disabled = false;
        
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
        
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    moveToNextSection() {
        this.currentSectionIndex++;
        
        if (this.currentSectionIndex < this.sectionNames.length) {
            const nextSection = this.sectionNames[this.currentSectionIndex];
            this.loadSection(nextSection);
            this.displayQuestion();
        } else {
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

    // ============================================
    // SCORING RULES (USER REQUEST)
    // Section A (Objectives) = 30 marks
    // Section B (Fill in the Gap) = 15 marks
    // Section C (Theory) = 15 marks
    // Total = 60 marks (final score)
    // ============================================
    calculateResults() {
        this.sectionScores = {};

        // compute raw section scores scaled to section.marks defined in exam-data.js
        for (const sectionName of this.sectionNames) {
            const sectionAnswers = this.answers.filter(a => a.section === sectionName);
            const correct = sectionAnswers.filter(a => a.isCorrect).length;
            const total = sectionAnswers.length;

            const sectionDef = this.examData.sections[sectionName] || { marks: 0 };
            const sectionMax = sectionDef.marks || 0; // 30, 15, 15

            const rawScore = total > 0 ? Math.round((correct / total) * sectionMax * 10) / 10 : 0;

            this.sectionScores[sectionName] = {
                correct: correct,
                total: total,
                rawScore: rawScore,
                maxScore: sectionMax,
                percentage: sectionMax > 0 ? Math.round((rawScore / sectionMax) * 100) : 0
            };
        }

        // Final total is the sum of scaled section raw scores (already on their section maxima)
        const aScore = this.sectionScores.objectives ? this.sectionScores.objectives.rawScore : 0; // /30
        const bScore = this.sectionScores.fillBlanks ? this.sectionScores.fillBlanks.rawScore : 0; // /15
        const cScore = this.sectionScores.theory ? this.sectionScores.theory.rawScore : 0; // /15

        const totalOutOf60 = Math.round((aScore + bScore + cScore) * 10) / 10; // final /60

        this.weightedScores = {
            sectionA: { raw: aScore, weighted: aScore, maxWeighted: this.examData.sections.objectives.marks },
            sectionB: { raw: bScore, weighted: bScore, maxWeighted: this.examData.sections.fillBlanks.marks },
            sectionC: { raw: cScore, weighted: cScore, maxWeighted: this.examData.sections.theory.marks },
            weightedTotal: totalOutOf60,
            maxWeightedTotal: 60,
            finalOver60: totalOutOf60,
            maxFinal: 60
        };
    }

    showResults() {
        const ws = this.weightedScores;
        const percentage = Math.round((ws.finalOver60 / 60) * 100);
        const grade = this.calculateGrade(percentage);
        
        // Display student info
        document.getElementById('resultStudentName').textContent = this.student.name;
        document.getElementById('resultGrade').textContent = this.getGradeLabel(this.student.grade);
        document.getElementById('resultDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Display overall score (final over 60)
        document.getElementById('scorePercentage').textContent = percentage + '%';
        document.getElementById('finalScore').textContent = ws.finalOver60;
        document.getElementById('totalMarks').textContent = '60';
        
        // Display grade
        document.getElementById('gradeBadge').textContent = grade.letter;
        document.getElementById('gradeLabel').textContent = grade.remark;
        
        const gradeBadge = document.getElementById('gradeBadge');
        gradeBadge.style.background = grade.color;
        
        // Display weighted score breakdown table
        this.displayWeightedScoreTable();
        
        // Display section breakdown
        this.displaySectionBreakdown();
        
        // Display remarks
        this.displayRemarks(percentage, grade);
        
        // Show results screen
        this.showScreen('resultsScreen');
        
        // Save results
        this.saveResults();
    }

    displayWeightedScoreTable() {
        const tbody = document.getElementById('weightedScoreBody');
        tbody.innerHTML = '';

        const sections = [
            { name: 'Section A: Objectives', key: 'sectionA', raw: this.weightedScores.sectionA },
            { name: 'Section B: Fill in the Blanks', key: 'sectionB', raw: this.weightedScores.sectionB },
            { name: 'Section C: Theory', key: 'sectionC', raw: this.weightedScores.sectionC }
        ];

        sections.forEach(section => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 12px; text-align: left; font-weight: 600;">${section.name}</td>
                <td style="padding: 12px; text-align: center;">${section.raw.raw} / ${section.raw.maxWeighted}</td>
                <td style="padding: 12px; text-align: center; font-weight: bold;">${section.raw.weighted} / ${section.raw.maxWeighted}</td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('weightedTotal').textContent = this.weightedScores.weightedTotal;
        document.getElementById('finalScoreOver60').textContent = this.weightedScores.finalOver60;
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
            'objectives': { label: 'Section A: Objectives', weight: '×1' },
            'fillBlanks': { label: 'Section B: Fill in the Blanks', weight: '×2' },
            'theory': { label: 'Section C: Theory', weight: '×2' }
        };
        
        const weightedKeys = { 'objectives': 'sectionA', 'fillBlanks': 'sectionB', 'theory': 'sectionC' };
        
        for (const sectionName in this.sectionScores) {
            const score = this.sectionScores[sectionName];
            const ws = this.weightedScores[weightedKeys[sectionName]];
            
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-score-card';
            
            sectionDiv.innerHTML = `
                <div class="section-name">${sectionLabels[sectionName].label}</div>
                <div class="section-stats">
                    <div class="stat">
                        <span class="stat-label">Questions:</span>
                        <span class="stat-value">${score.correct}/${score.total}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Raw Score:</span>
                        <span class="stat-value">${score.rawScore}/${this.examData.sections[sectionName].marks}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Weight:</span>
                        <span class="stat-value">${sectionLabels[sectionName].weight}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Weighted:</span>
                        <span class="stat-value">${ws.weighted}/${ws.maxWeighted}</span>
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
        const ws = this.weightedScores;
        const percentage = Math.round((ws.finalOver60 / 60) * 100);
        const grade = this.calculateGrade(percentage);
        
        document.getElementById('printStudentName').textContent = this.student.name;
        document.getElementById('printGrade').textContent = this.getGradeLabel(this.student.grade);
        document.getElementById('printDate').textContent = new Date().toLocaleDateString();
        
        // Populate scores table with weighted scoring
        const tbody = document.getElementById('printScoresBody');
        tbody.innerHTML = '';
        
        const sections = [
            { name: 'Section A: Objectives', sectionKey: 'objectives', wsKey: 'sectionA' },
            { name: 'Section B: Fill in the Blanks', sectionKey: 'fillBlanks', wsKey: 'sectionB' },
            { name: 'Section C: Theory', sectionKey: 'theory', wsKey: 'sectionC' }
        ];
        
        sections.forEach(section => {
            const score = this.sectionScores[section.sectionKey];
            const wsSection = ws[section.wsKey];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${section.name}</td>
                <td>${score.total}</td>
                <td>${score.correct}</td>
                <td>${score.rawScore} / ${wsSection.maxWeighted}</td>
                <td>Max: ${wsSection.maxWeighted}</td>
                <td>${wsSection.weighted} / ${wsSection.maxWeighted}</td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('printWeightedTotal').innerHTML = `<strong>${ws.weightedTotal}</strong>`;
        document.getElementById('printFinalOver60').innerHTML = `<strong>${ws.finalOver60}</strong>`;
        
        document.getElementById('printGradeLetter').textContent = grade.letter;
        document.getElementById('printGradeRemark').textContent = grade.remark;
        document.getElementById('printRemarks').textContent = document.getElementById('remarksBox').textContent;
        
        window.print();
    }

    // Download individual student report as text file
    downloadStudentReport() {
        const ws = this.weightedScores;
        const percentage = Math.round((ws.finalOver60 / 60) * 100);
        const grade = this.calculateGrade(percentage);
        
        let report = '';
        report += '================================================\n';
        report += '     ICT MID-TERM EXAMINATION REPORT\n';
        report += '     Primary School ICT Department\n';
        report += '     Academic Session 2025/2026 - Mid-Term\n';
        report += '================================================\n\n';
        report += `Student Name: ${this.student.name}\n`;
        report += `Class: ${this.getGradeLabel(this.student.grade)}\n`;
        report += `Date: ${new Date().toLocaleDateString()}\n\n`;
        report += '--- SCORE BREAKDOWN ---\n\n';
        report += 'Section                    Raw    Max   Weighted\n';
        report += '-----------------------------------------------------\n';
        report += `Section A: Objectives      ${this.padNum(ws.sectionA.raw)}    ${ws.sectionA.maxWeighted}    ${this.padNum(ws.sectionA.weighted)}/${ws.sectionA.maxWeighted}\n`;
        report += `Section B: Fill-in-Blanks  ${this.padNum(ws.sectionB.raw)}    ${ws.sectionB.maxWeighted}    ${this.padNum(ws.sectionB.weighted)}/${ws.sectionB.maxWeighted}\n`;
        report += `Section C: Theory          ${this.padNum(ws.sectionC.raw)}    ${ws.sectionC.maxWeighted}    ${this.padNum(ws.sectionC.weighted)}/${ws.sectionC.maxWeighted}\n`;
        report += '-----------------------------------------------------\n';
        report += `Weighted Total:                            ${ws.weightedTotal}/60\n`;
        report += `Final Score:                               ${ws.finalOver60}/60\n`;
        report += `Grade: ${grade.letter} - ${grade.remark}\n`;
        report += `Percentage: ${percentage}%\n\n`;
        report += '--- REMARKS ---\n';
        report += document.getElementById('remarksBox').textContent + '\n\n';
        report += '================================================\n';
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.student.name.replace(/\s+/g, '_')}_${this.student.grade}_ICT_Report.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    padNum(num) {
        return String(num).padStart(5, ' ');
    }

    saveResults() {
        const ws = this.weightedScores;
        const percentage = Math.round((ws.finalOver60 / 60) * 100);
        const grade = this.calculateGrade(percentage);
        
        const result = {
            name: this.student.name,
            grade: this.student.grade,
            gradeLabel: this.getGradeLabel(this.student.grade),
            date: new Date().toISOString(),
            dateFormatted: new Date().toLocaleDateString(),
            sectionA_raw: ws.sectionA.raw,
            sectionA_weighted: ws.sectionA.weighted,
            sectionB_raw: ws.sectionB.raw,
            sectionB_weighted: ws.sectionB.weighted,
            sectionC_raw: ws.sectionC.raw,
            sectionC_weighted: ws.sectionC.weighted,
            weightedTotal: ws.weightedTotal,
            finalOver60: ws.finalOver60,
            percentage: percentage,
            gradeLetter: grade.letter,
            gradeRemark: grade.remark,
            sectionScores: this.sectionScores,
            answers: this.answers,
            duration: new Date() - this.startTime
        };
        
        // Save to localStorage under 'examResults'
        let allResults = JSON.parse(localStorage.getItem('examResults') || '[]');
        allResults.push(result);
        
        // Keep up to 500 results
        if (allResults.length > 500) {
            allResults = allResults.slice(-500);
        }
        
        localStorage.setItem('examResults', JSON.stringify(allResults));
    }

    retakeExam() {
        this.showScreen('welcomeScreen');
        document.getElementById('userName').value = '';
        document.getElementById('userGrade').value = '';
        document.getElementById('startExam').disabled = true;
        const nameError = document.getElementById('nameError');
        if (nameError) nameError.style.display = 'none';
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
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
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
