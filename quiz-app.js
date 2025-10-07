// Kids Digital Literacy Quiz Application
class QuizApp {
    constructor() {
        this.currentUser = {
            name: '',
            age: null
        };
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = {
            correct: 0,
            incorrect: 0
        };
        this.categoryScores = {};
        this.quizStartTime = null;
        this.userAnswers = [];
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEventListeners();
        this.showScreen('welcomeScreen');
        this.loadPreviousResults();
    }

    bindEventListeners() {
        // Welcome screen events
        document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('userName').addEventListener('input', () => this.validateForm());
        document.getElementById('userAge').addEventListener('change', () => this.validateForm());

        // Quiz screen events
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());

        // Results screen events
        document.getElementById('retakeQuiz').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('viewAllResults').addEventListener('click', () => this.showAllResults());
        document.getElementById('backToResults').addEventListener('click', () => this.showScreen('resultsScreen'));

        // Handle enter key in name input
        document.getElementById('userName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startQuiz();
        });
    }

    validateForm() {
        const nameInput = document.getElementById('userName');
        const ageSelect = document.getElementById('userAge');
        const startButton = document.getElementById('startQuiz');
        
        const isValid = nameInput.value.trim() !== '' && ageSelect.value !== '';
        startButton.disabled = !isValid;
        
        if (isValid) {
            startButton.classList.add('pulse');
        } else {
            startButton.classList.remove('pulse');
        }
    }

    startQuiz() {
        const nameInput = document.getElementById('userName');
        const ageSelect = document.getElementById('userAge');
        
        if (nameInput.value.trim() === '' || ageSelect.value === '') {
            this.showNotification('Please enter your name and select your age!', 'error');
            return;
        }

        this.currentUser.name = nameInput.value.trim();
        this.currentUser.age = parseInt(ageSelect.value);
        
        // Get questions for the selected age
        const questionsData = getFlatQuestionArray(this.currentUser.age);
        if (questionsData.length === 0) {
            this.showNotification('No questions available for this age group!', 'error');
            return;
        }

        // Shuffle questions and take first 50 (or all if less than 50)
        this.currentQuestions = shuffleArray(questionsData).slice(0, 50);
        this.currentQuestionIndex = 0;
        this.score = { correct: 0, incorrect: 0 };
        this.categoryScores = {};
        this.userAnswers = [];
        this.quizStartTime = new Date();

        // Initialize category scores
        const ageData = getQuestionsForAge(this.currentUser.age);
        for (const category in ageData.categories) {
            this.categoryScores[category] = { correct: 0, total: 0 };
        }

        this.setupQuizInterface();
        this.showScreen('quizScreen');
        this.displayQuestion();
    }

    setupQuizInterface() {
        // Display user info
        document.getElementById('displayName').textContent = `👋 ${this.currentUser.name}`;
        document.getElementById('displayAge').textContent = `🎂 ${this.currentUser.age} years old`;
        
        // Reset scores
        document.getElementById('correctCount').textContent = '0';
        document.getElementById('incorrectCount').textContent = '0';
        
        // Set total questions
        document.getElementById('totalQuestions').textContent = this.currentQuestions.length;
        
        // Reset progress
        this.updateProgress();
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update question number and progress
        document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
        this.updateProgress();
        
        // Display category badge
        const categoryBadge = document.getElementById('categoryBadge');
        categoryBadge.textContent = question.category;
        
        // Display question text
        document.getElementById('questionText').textContent = question.question;
        
        // Create answer options
        this.createAnswerOptions(question);
        
        // Disable next button until answer is selected
        document.getElementById('nextQuestion').disabled = true;
    }

    createAnswerOptions(question) {
        const container = document.getElementById('answersContainer');
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = option;
            answerDiv.dataset.index = index;
            
            answerDiv.addEventListener('click', () => this.selectAnswer(index, answerDiv));
            
            container.appendChild(answerDiv);
        });
    }

    selectAnswer(selectedIndex, selectedElement) {
        // Remove previous selections
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mark current selection
        selectedElement.classList.add('selected');
        
        // Store the answer
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        this.userAnswers.push({
            questionIndex: this.currentQuestionIndex,
            selectedAnswer: selectedIndex,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            category: question.category,
            question: question.question,
            explanation: question.explanation
        });
        
        // Update scores
        if (isCorrect) {
            this.score.correct++;
            this.categoryScores[question.category].correct++;
        } else {
            this.score.incorrect++;
        }
        this.categoryScores[question.category].total++;
        
        // Update score display
        this.updateScoreDisplay();
        
        // Show feedback
        this.showAnswerFeedback(isCorrect, question.explanation);
        
        // Enable next button
        document.getElementById('nextQuestion').disabled = false;
        
        // Show correct/incorrect styling after a brief delay
        setTimeout(() => {
            this.highlightCorrectAnswer(question.correct, selectedIndex);
        }, 1000);
    }

    highlightCorrectAnswer(correctIndex, selectedIndex) {
        const options = document.querySelectorAll('.answer-option');
        
        options.forEach((option, index) => {
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== correctIndex) {
                option.classList.add('incorrect');
            }
        });
    }

    showAnswerFeedback(isCorrect, explanation) {
        const feedbackDiv = document.getElementById('feedbackAnimation');
        const feedbackContent = feedbackDiv.querySelector('.feedback-content');
        const emojiDiv = feedbackDiv.querySelector('.feedback-emoji');
        const textDiv = feedbackDiv.querySelector('.feedback-text');
        
        if (isCorrect) {
            emojiDiv.textContent = '🎉';
            textDiv.textContent = 'Awesome! ' + explanation;
            feedbackContent.className = 'feedback-content correct';
            this.animateScoreEmoji('correct');
        } else {
            emojiDiv.textContent = '💝';
            textDiv.textContent = 'Good try! ' + explanation;
            feedbackContent.className = 'feedback-content incorrect';
            this.animateScoreEmoji('incorrect');
        }
        
        feedbackDiv.classList.add('show');
        
        setTimeout(() => {
            feedbackDiv.classList.remove('show');
        }, 3000);
    }

    animateScoreEmoji(type) {
        const emoji = document.querySelector(`.score-item.${type} .emoji`);
        emoji.style.animation = 'none';
        setTimeout(() => {
            emoji.style.animation = 'feedbackPulse 0.6s ease-out';
        }, 10);
    }

    updateScoreDisplay() {
        document.getElementById('correctCount').textContent = this.score.correct;
        document.getElementById('incorrectCount').textContent = this.score.incorrect;
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    showResults() {
        this.calculateFinalResults();
        this.displayFinalScore();
        this.createCategoryAnalysis();
        this.saveResults();
        this.showScreen('resultsScreen');
    }

    calculateFinalResults() {
        const totalQuestions = this.currentQuestions.length;
        this.finalPercentage = Math.round((this.score.correct / totalQuestions) * 100);
    }

    displayFinalScore() {
        document.getElementById('scorePercentage').textContent = this.finalPercentage + '%';
        document.getElementById('finalCorrect').textContent = this.score.correct;
        document.getElementById('finalIncorrect').textContent = this.score.incorrect;
        
        // Animate the score circle
        setTimeout(() => {
            const circle = document.querySelector('.score-circle');
            circle.style.animation = 'celebrationBounce 2s infinite';
        }, 500);
    }

    createCategoryAnalysis() {
        const chartsContainer = document.getElementById('categoryCharts');
        chartsContainer.innerHTML = '';
        
        for (const category in this.categoryScores) {
            const data = this.categoryScores[category];
            if (data.total === 0) continue;
            
            const percentage = Math.round((data.correct / data.total) * 100);
            
            const chartDiv = document.createElement('div');
            chartDiv.className = 'category-chart';
            
            chartDiv.innerHTML = `
                <h4>${category}</h4>
                <div class="chart-bar">
                    <div class="chart-fill" style="width: 0%"></div>
                </div>
                <div class="chart-label">
                    <span>${data.correct} / ${data.total} correct</span>
                    <span>${percentage}%</span>
                </div>
            `;
            
            chartsContainer.appendChild(chartDiv);
            
            // Animate the bar fill
            setTimeout(() => {
                const fill = chartDiv.querySelector('.chart-fill');
                fill.style.width = percentage + '%';
            }, 500);
        }
    }

    saveResults() {
        const result = {
            name: this.currentUser.name,
            age: this.currentUser.age,
            date: new Date().toISOString(),
            score: this.score,
            percentage: this.finalPercentage,
            categoryScores: this.categoryScores,
            totalQuestions: this.currentQuestions.length,
            userAnswers: this.userAnswers,
            duration: new Date() - this.quizStartTime
        };
        
        // Get existing results
        let allResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        
        // Add new result
        allResults.push(result);
        
        // Keep only the last 50 results to avoid localStorage limits
        if (allResults.length > 50) {
            allResults = allResults.slice(-50);
        }
        
        // Save to localStorage
        localStorage.setItem('quizResults', JSON.stringify(allResults));
    }

    loadPreviousResults() {
        const allResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
        return allResults;
    }

    showAllResults() {
        const allResults = this.loadPreviousResults();
        const container = document.getElementById('allResultsList');
        
        if (allResults.length === 0) {
            container.innerHTML = '<p>No previous results found. Take the quiz to see your results here!</p>';
        } else {
            container.innerHTML = allResults
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(result => this.createResultItem(result))
                .join('');
        }
        
        this.showScreen('allResultsScreen');
    }

    createResultItem(result) {
        const date = new Date(result.date).toLocaleDateString();
        const duration = this.formatDuration(result.duration);
        
        return `
            <div class="result-item">
                <div class="result-info">
                    <div class="result-name">${result.name}</div>
                    <div class="result-details">
                        Age: ${result.age} | Date: ${date} | Duration: ${duration}
                    </div>
                    <div class="result-details">
                        ${result.score.correct}/${result.totalQuestions} correct
                    </div>
                </div>
                <div class="result-score">${result.percentage}%</div>
            </div>
        `;
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    retakeQuiz() {
        // Reset to welcome screen but keep the name
        const userName = document.getElementById('userName');
        userName.value = this.currentUser.name;
        this.showScreen('welcomeScreen');
        this.validateForm();
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4caf50'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: 'Comic Neue', cursive;
            font-weight: bold;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Add CSS for notifications animation
const notificationStyles = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .pulse {
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the quiz app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
    
    // Add some fun interactions
    addFloatingEmojis();
    addClickEffects();
});

// Add floating emojis for extra fun
function addFloatingEmojis() {
    const emojis = ['🌟', '⭐', '✨', '🎯', '🚀', '💫'];
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }
    }, 3000);
}

function createFloatingEmoji(emoji) {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;
    emojiElement.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        font-size: 2rem;
        z-index: -1;
        pointer-events: none;
        animation: floatUp 8s linear forwards;
    `;
    
    document.body.appendChild(emojiElement);
    
    setTimeout(() => {
        document.body.removeChild(emojiElement);
    }, 8000);
}

// Add click effects
function addClickEffects() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
            createClickEffect(e.clientX, e.clientY);
        }
    });
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: clickEffect 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 600);
}

// Add the additional CSS animations
const additionalStyles = `
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes clickEffect {
        from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;

styleSheet.textContent += additionalStyles;