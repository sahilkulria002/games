// Arduino Programming Game Logic

class ArduinoGame {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.attempts = 0;
        this.levels = this.initializeLevels();
        this.draggedElement = null;

        this.initializeEventListeners();
    }

    initializeLevels() {
        return {
            1: {
                title: "Level 1: Basic Code",
                correctCode: `void setup() {
    // put your setup code here, to run once:
    pinMode(13, OUTPUT);
}

void loop() {
    // put your main code here, to run repeatedly:
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
    delay(1000);
}`,
                wordBlocks: [
                    "void setup() {",
                    "    // put your setup code here, to run once:",
                    "    pinMode(13, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    // put your main code here, to run repeatedly:",
                    "    digitalWrite(13, HIGH);",
                    "    delay(1000);",
                    "    digitalWrite(13, LOW);",
                    "    delay(1000);",
                    "}"
                ],
                instructions: {
                    en: "Connect digital pin 13 to LED with resistor to ground. In setup, pinMode(13, OUTPUT) sets pin 13 as output. In loop, HIGH turns LED on, delay(1000) waits 1 second, LOW turns LED off, delay(1000) waits 1 second. This repeats.",
                    hi: "Arduino mein pin 13 ko LED aur resistor ke saath ground se jodte hain. setup() mein pinMode(13, OUTPUT) pin ko output bana deta hai. loop() mein digitalWrite(13, HIGH) LED on karta hai, delay(1000) 1 second ka rukawat hai, digitalWrite(13, LOW) LED off karta hai, delay(1000) wapas 1 second ka rukawat hai. yeh cycle repeat hota hai."
                }
            },
            2: {
                title: "Level 2: Blink LED",
                correctCode: `void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
    delay(1000);
}`,
                wordBlocks: [
                    "void setup() {",
                    "    pinMode(13, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    digitalWrite(13, HIGH);",
                    "    delay(1000);",
                    "    digitalWrite(13, LOW);",
                    "    delay(1000);",
                    "}"
                ],
                instructions: {
                    en: "Connect LED to pin 13 with resistor. setup() sets pin 13 as output. loop() turns LED ON with HIGH, waits 1 second, turns LED OFF with LOW, waits 1 second. This is simple blink behavior.",
                    hi: "LED ko pin 13 aur resistor se jodke ground par lagayein. setup() mein pin 13 output set hota hai. loop() mein digitalWrite(13, HIGH) say LED jalti hai, delay(1000) 1 second ke liye rukta hai, phir digitalWrite(13, LOW) say LED band hota hai, delay(1000) phir rukta hai. Yeh blink pattern hai."
                }
            },
            3: {
                title: "Level 3: Blink Multiple LEDs",
                correctCode: `void setup() {
    pinMode(13, OUTPUT);
    pinMode(12, OUTPUT);
    pinMode(11, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    digitalWrite(12, LOW);
    digitalWrite(11, LOW);
    delay(500);

    digitalWrite(13, LOW);
    digitalWrite(12, HIGH);
    digitalWrite(11, LOW);
    delay(500);

    digitalWrite(13, LOW);
    digitalWrite(12, LOW);
    digitalWrite(11, HIGH);
    delay(500);
}`,
                wordBlocks: [
                    "void setup() {",
                    "    pinMode(13, OUTPUT);",
                    "    pinMode(12, OUTPUT);",
                    "    pinMode(11, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    digitalWrite(13, HIGH);",
                    "    digitalWrite(12, LOW);",
                    "    digitalWrite(11, LOW);",
                    "    delay(500);",
                    "",
                    "    digitalWrite(13, LOW);",
                    "    digitalWrite(12, HIGH);",
                    "    digitalWrite(11, LOW);",
                    "    delay(500);",
                    "",
                    "    digitalWrite(13, LOW);",
                    "    digitalWrite(12, LOW);",
                    "    digitalWrite(11, HIGH);",
                    "    delay(500);",
                    "}"
                ],
                instructions: {
                    en: "Connect LEDs to pins 13, 12, and 11 through resistors. setup() sets all pins as OUTPUT. loop() lights one LED at a time for 500 ms while turning others off, creating a rotating blink pattern.",
                    hi: "LEDs ko pin 13, 12, 11 par resistor ke through lagayein. setup() mein sab pin OUTPUT set hain. loop() mein ek-ek LED ko 500 ms ke liye on karta hai aur baaki ko off karta hai, jis se ek ghoomte hue blink pattern banta hai."
                }
            },
            4: {
                title: "Level 4: Run DC Motor",
                correctCode: `void setup() {
    pinMode(9, OUTPUT);
}

void loop() {
    analogWrite(9, 255);
    delay(2000);
    analogWrite(9, 128);
    delay(2000);
    analogWrite(9, 0);
    delay(2000);
}`,
                wordBlocks: [
                    "void setup() {",
                    "    pinMode(9, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    analogWrite(9, 255);",
                    "    delay(2000);",
                    "    analogWrite(9, 128);",
                    "    delay(2000);",
                    "    analogWrite(9, 0);",
                    "    delay(2000);",
                    "}"
                ],
                instructions: {
                    en: "Connect DC motor driver input pin to Arduino pin 9, and enable motor supply. setup() sets pin 9 as OUTPUT. loop() uses analogWrite(9, 255) for full speed, 128 for half speed, 0 to stop, each for 2 seconds.",
                    hi: "DC motor driver ke input ko Arduino pin 9 se jodein, aur motor supply de. setup() mein pin 9 OUTPUT set hai. loop() analogWrite(9, 255) se full speed, 128 se half speed, aur 0 se stop karta hai, har stage 2 second ke liye."
                }
            },
            5: {
                title: "Level 5: Run Multiple DC Motors",
                correctCode: `void setup() {
    pinMode(9, OUTPUT);
    pinMode(10, OUTPUT);
}

void loop() {
    analogWrite(9, 255);
    analogWrite(10, 0);
    delay(2000);

    analogWrite(9, 0);
    analogWrite(10, 255);
    delay(2000);

    analogWrite(9, 128);
    analogWrite(10, 128);
    delay(2000);
}`,
                wordBlocks: [
                    "void setup() {",
                    "    pinMode(9, OUTPUT);",
                    "    pinMode(10, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    analogWrite(9, 255);",
                    "    analogWrite(10, 0);",
                    "    delay(2000);",
                    "",
                    "    analogWrite(9, 0);",
                    "    analogWrite(10, 255);",
                    "    delay(2000);",
                    "",
                    "    analogWrite(9, 128);",
                    "    analogWrite(10, 128);",
                    "    delay(2000);",
                    "}"
                ],
                instructions: {
                    en: "Connect two DC motor driver channels to pins 9 and 10. setup() sets both as OUTPUT. loop() runs first motor full on while second off, then second full on while first off, then both half speed, each for 2 seconds.",
                    hi: "Do DC motor channels ko pin 9 aur 10 se jodein. setup() mein dono OUTPUT set hain. loop() pehle ek motor full on karega jab doosra off hai, fir doosra full on jab pehla off hai, phir dono half speed chalenge, har stage 2 second rehga."
                }
            },
            6: {
                title: "Level 6: Ultrasonic Sensor",
                correctCode: `#define trigPin 9
#define echoPin 10

void setup() {
    Serial.begin(9600);
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
}

void loop() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    int distance = duration * 0.034 / 2;

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    delay(100);
}`,
                wordBlocks: [
                    "#define trigPin 9",
                    "#define echoPin 10",
                    "",
                    "void setup() {",
                    "    Serial.begin(9600);",
                    "    pinMode(trigPin, OUTPUT);",
                    "    pinMode(echoPin, INPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    digitalWrite(trigPin, LOW);",
                    "    delayMicroseconds(2);",
                    "    digitalWrite(trigPin, HIGH);",
                    "    delayMicroseconds(10);",
                    "    digitalWrite(trigPin, LOW);",
                    "",
                    "    long duration = pulseIn(echoPin, HIGH);",
                    "    int distance = duration * 0.034 / 2;",
                    "",
                    "    Serial.print(\"Distance: \");",
                    "    Serial.print(distance);",
                    "    Serial.println(\" cm\");",
                    "",
                    "    delay(100);",
                    "}"
                ],
                instructions: {
                    en: "Connect ultrasonic trig to pin 9 and echo to pin 10. setup() initializes serial and pin modes. loop() sends a pulse from trigPin and reads echoPin duration. distance is calculated from duration and printed. Use this to measure object distance.",
                    hi: "Ultrasonic module mein trig ko pin 9 aur echo ko pin 10 se jodein. setup() serial aur pin modes set karta hai. loop() trig se pulse bhejta hai, echo pin se duration padhta hai, distance duration se calculate karta hai aur serial par likhta hai. yeh object ki doori naptayega."
                }
            },
            7: {
                title: "Level 7: For Loop",
                correctCode: `void setup() {
    Serial.begin(9600);
    pinMode(13, OUTPUT);
}

void loop() {
    for(int i = 0; i < 5; i++) {
        digitalWrite(13, HIGH);
        delay(200);
        digitalWrite(13, LOW);
        delay(200);
        Serial.print("Blink #");
        Serial.println(i + 1);
    }
    delay(2000);
}`,
                wordBlocks: [
                    "void setup() {",
                    "    Serial.begin(9600);",
                    "    pinMode(13, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    for(int i = 0; i < 5; i++) {",
                    "        digitalWrite(13, HIGH);",
                    "        delay(200);",
                    "        digitalWrite(13, LOW);",
                    "        delay(200);",
                    "        Serial.print(\"Blink #\");",
                    "        Serial.println(i + 1);",
                    "    }",
                    "    delay(2000);",
                    "}"
                ],
                instructions: {
                    en: "Connect LED to pin 13 and serial monitor to USB. setup() starts Serial and sets pin 13 output. loop() uses for loop to blink LED 5 times, printing count to Serial each blink, then waits 2 seconds before repeating.",
                    hi: "LED ko pin 13 se jodein aur serial monitor ko USB se. setup() Serial start karta hai aur pin 13 output set karta hai. loop() for loop se LED ko 5 baar blink karta hai, har blink par count Serial par print karta hai, fir 2 second ka rukne ke liye delay karta hai."
                }
            },
            8: {
                title: "Level 8: Servo Motor",
                correctCode: `#include <Servo.h>

Servo myservo;

void setup() {
    myservo.attach(9);
}

void loop() {
    for(int pos = 0; pos <= 180; pos++) {
        myservo.write(pos);
        delay(15);
    }
    for(int pos = 180; pos >= 0; pos--) {
        myservo.write(pos);
        delay(15);
    }
}`,
                wordBlocks: [
                    "#include <Servo.h>",
                    "",
                    "Servo myservo;",
                    "",
                    "void setup() {",
                    "    myservo.attach(9);",
                    "}",
                    "",
                    "void loop() {",
                    "    for(int pos = 0; pos <= 180; pos++) {",
                    "        myservo.write(pos);",
                    "        delay(15);",
                    "    }",
                    "    for(int pos = 180; pos >= 0; pos--) {",
                    "        myservo.write(pos);",
                    "        delay(15);",
                    "    }",
                    "}"
                ],
                instructions: {
                    en: "Connect servo signal wire to pin 9, power to 5V and ground common with Arduino. setup() attaches servo to pin 9. loop() moves servo from 0 to 180 degrees and back to 0 with 15 ms delay steps, making sweeping motion.",
                    hi: "Servo signal wire ko pin 9 se jodein, power 5V aur ground Arduino ke ground ke saath common rakhein. setup() mein servo ko pin 9 se attach kiya jaata hai. loop() servo ko 0 se 180 degree aur phir 0 degree tak 15 ms step mein chalata hai, sweeping motion banata hai."
                }
            }
        };
    }

    shuffleArray(arr) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    initializeEventListeners() {
        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.startLevel(parseInt(e.target.dataset.level));
            });
        });

        // Game controls
        document.getElementById('check-arrangement').addEventListener('click', () => this.checkArrangement());
        document.getElementById('check-typing').addEventListener('click', () => this.checkTyping());
        document.getElementById('reset-level').addEventListener('click', () => this.resetLevel());
        document.getElementById('next-level').addEventListener('click', () => this.nextLevel());
        document.getElementById('back-to-levels').addEventListener('click', () => this.showLevelSelection());

        // Language / audio
        document.getElementById('language-select').addEventListener('change', () => this.updateInstructions());
        document.getElementById('play-audio').addEventListener('click', () => this.playInstructionsAudio());
        document.getElementById('pause-audio').addEventListener('click', () => this.pauseInstructionsAudio());

        // Drag and drop
        this.initializeDragAndDrop();
    }

    initializeDragAndDrop() {
        const lineOrderList = document.getElementById('line-order-list');

        let dragItem = null;

        lineOrderList.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.line-order-item');
            if (!item) return;
            dragItem = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        lineOrderList.addEventListener('dragend', () => {
            if (dragItem) {
                dragItem.classList.remove('dragging');
                dragItem = null;
            }
        });

        lineOrderList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(lineOrderList, e.clientY);
            const dragging = document.querySelector('.line-order-item.dragging');
            if (!dragging) return;
            if (afterElement == null) {
                lineOrderList.appendChild(dragging);
            } else {
                lineOrderList.insertBefore(dragging, afterElement);
            }
        });

        lineOrderList.addEventListener('click', (e) => {
            const upBtn = e.target.closest('.move-up');
            const downBtn = e.target.closest('.move-down');
            if (!upBtn && !downBtn) return;

            const item = e.target.closest('.line-order-item');
            if (!item) return;

            if (upBtn) {
                const prev = item.previousElementSibling;
                if (prev) lineOrderList.insertBefore(item, prev);
            }
            if (downBtn) {
                const next = item.nextElementSibling;
                if (next) lineOrderList.insertBefore(next, item);
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.line-order-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    removeFromCanvas(element) {
        const wordBank = document.getElementById('word-bank');
        const clone = element.cloneNode(true);
        clone.draggable = true;
        clone.style.cursor = 'grab';
        wordBank.appendChild(clone);
        element.remove();
    }

    startLevel(level) {
        this.currentLevel = level;
        this.attempts = 0;
        document.getElementById('level-selection').classList.add('hidden');
        document.getElementById('game-interface').classList.remove('hidden');
        document.getElementById('game-interface').classList.add('show');
        document.getElementById('next-level').classList.add('hidden');

        this.loadLevel();
        this.updateUI();
    }

    loadLevel() {
        this.updateInstructions();
        const level = this.levels[this.currentLevel];
        document.getElementById('level-title').textContent = level.title;
        document.getElementById('correct-code').textContent = level.correctCode;

        const lineOrderList = document.getElementById('line-order-list');
        lineOrderList.innerHTML = '';
        document.getElementById('code-input').value = '';

        const shuffledLines = this.shuffleArray(level.wordBlocks);
        shuffledLines.forEach((line, idx) => {
            const item = document.createElement('li');
            item.className = 'line-order-item';
            item.draggable = true;

            const lineText = document.createElement('span');
            lineText.className = 'line-text';
            lineText.textContent = line === '' ? '' : line;
            if (line === '') {
                lineText.textContent = '\u00A0';
            }

            const controls = document.createElement('span');
            controls.className = 'line-controls';

            const upBtn = document.createElement('button');
            upBtn.className = 'move-up';
            upBtn.title = 'Move up';
            upBtn.textContent = '↑';

            const downBtn = document.createElement('button');
            downBtn.className = 'move-down';
            downBtn.title = 'Move down';
            downBtn.textContent = '↓';

            controls.appendChild(upBtn);
            controls.appendChild(downBtn);
            item.appendChild(lineText);
            item.appendChild(controls);
            lineOrderList.appendChild(item);
        });
    }

    checkArrangement() {
        this.attempts++;
        const lineOrderList = document.getElementById('line-order-list');
        const userLines = Array.from(lineOrderList.children).map(item => {
            const text = item.querySelector('.line-text').textContent;
            return text === '\u00A0' ? '' : text;
        });
        const correctLines = this.levels[this.currentLevel].wordBlocks;

        const isCorrect = this.compareLineOrder(userLines, correctLines);

        this.showMessage(isCorrect ? 'success' : 'error',
            isCorrect ? 'Perfect arrangement! +50 points' : 'Arrangement incorrect. Try again!');

        if (isCorrect) {
            this.score += 50;
            document.getElementById('check-arrangement').disabled = true;
        }

        this.updateUI();
    }

    checkTyping() {
        this.attempts++;
        const userCode = document.getElementById('code-input').value.trim();
        const correctCode = this.levels[this.currentLevel].correctCode.trim();

        const isCorrect = this.compareCode(userCode, correctCode);

        this.showMessage(isCorrect ? 'success' : 'error',
            isCorrect ? 'Perfect code! +100 points' : 'Code doesn\'t match. Check syntax and try again!');

        if (isCorrect) {
            this.score += 100;
            document.getElementById('check-typing').disabled = true;

            // Check if both challenges are completed
            if (document.getElementById('check-arrangement').disabled) {
                document.getElementById('next-level').classList.remove('hidden');
            }
        }

        this.updateUI();
    }

    compareLineOrder(userLines, correctLines) {
        if (userLines.length !== correctLines.length) return false;

        const userNonEmpty = userLines.filter(l => l.trim() !== '');
        const correctNonEmpty = correctLines.filter(l => l.trim() !== '');
        const userEmptyCount = userLines.filter(l => l.trim() === '').length;
        const correctEmptyCount = correctLines.filter(l => l.trim() === '').length;

        if (userEmptyCount !== correctEmptyCount) return false;
        if (userNonEmpty.length !== correctNonEmpty.length) return false;

        for (let i = 0; i < userNonEmpty.length; i++) {
            if (userNonEmpty[i].trim() !== correctNonEmpty[i].trim()) {
                return false;
            }
        }
        return true;
    }

    compareCode(userCode, correctCode) {
        // Normalize whitespace for comparison
        const normalize = (code) => code.replace(/\s+/g, ' ').trim();
        return normalize(userCode) === normalize(correctCode);
    }

    autoTranslateToHindi(englishText) {
        const dictionary = {
            'connect': 'जोड़ें',
            'connects': 'जोड़ता है',
            'pin': 'pin',
            'pins': 'pin',
            'LED': 'LED',
            'resistor': 'resistor',
            'ground': 'ground',
            'setup': 'setup',
            'loop': 'loop',
            'pinMode': 'pinMode',
            'OUTPUT': 'OUTPUT',
            'INPUT': 'INPUT',
            'digitalWrite': 'digitalWrite',
            'analogWrite': 'analogWrite',
            'HIGH': 'HIGH',
            'LOW': 'LOW',
            'delay': 'delay',
            'seconds': 'second',
            'second': 'second',
            'full': 'full',
            'speed': 'speed',
            'runs': 'chalata hai',
            'motor': 'motor',
            'ultrasonic': 'ultrasonic',
            'sensor': 'sensor',
            'serial': 'Serial',
            'print': 'print',
            'distance': 'distance',
            'measure': 'measure',
            'one': '1',
            'two': '2',
            'three': '3',
            'five': '5',
            'time': 'time',
            'this': 'ye',
            'that': 'woh',
            'for': 'ke liye',
            'while': 'jab',
            'is': 'hai',
            'the': '',
            'and': 'aur',
            'with': 'ke saath',
            'in': 'mein',
            'to': 'ko',
            'from': 'se',
            'each': 'har',
            'repeat': 'dobaara',
            'repeatable': 'dobara',
            'print': 'print'
        };

        const tokens = englishText.split(/(\s+|\b)/);
        return tokens.map(token => {
            const lower = token.toLowerCase();
            if (dictionary[lower] !== undefined) {
                return dictionary[lower];
            }
            return token;
        }).join('');
    }

    showMessage(type, text) {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        const container = document.querySelector('.container');
        container.insertBefore(message, container.firstChild);

        setTimeout(() => message.remove(), 3000);
    }

    resetLevel() {
        this.attempts = 0;
        document.getElementById('check-arrangement').disabled = false;
        document.getElementById('check-typing').disabled = false;
        document.getElementById('next-level').classList.add('hidden');
        this.loadLevel();
        this.updateUI();
    }

    nextLevel() {
        if (this.currentLevel < Object.keys(this.levels).length) {
            this.startLevel(this.currentLevel + 1);
        } else {
            this.showMessage('success', 'Congratulations! You completed all levels!');
        }
    }

    showLevelSelection() {
        document.getElementById('game-interface').classList.remove('show');
        document.getElementById('game-interface').classList.add('hidden');
        document.getElementById('level-selection').classList.remove('hidden');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('attempts').textContent = this.attempts;
    }

    updateInstructions() {
        const selectedLang = document.getElementById('language-select').value;
        const level = this.levels[this.currentLevel];
        if (!level || !level.instructions || !level.instructions.en) {
            document.getElementById('instructions-text').textContent = '';
            return;
        }

        let text = level.instructions.en;
        if (selectedLang === 'hindi') {
            text = this.autoTranslateToHindi(text);
        }

        document.getElementById('instructions-text').textContent = text;
    }

    playInstructionsAudio() {
        const instructionsText = document.getElementById('instructions-text').textContent;
        if (!instructionsText) return;

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        this.currentUtterance = new SpeechSynthesisUtterance(instructionsText);
        this.currentUtterance.lang = document.getElementById('language-select').value === 'hindi' ? 'hi-IN' : 'en-US';
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;

        window.speechSynthesis.speak(this.currentUtterance);
    }

    pauseInstructionsAudio() {
        if (!window.speechSynthesis) return;

        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
        } else if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ArduinoGame();
});