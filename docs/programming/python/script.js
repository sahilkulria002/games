// Python Programming Game Logic

class PythonGame {
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
                title: "Level 1: Print Statements",
                correctCode: `# Print different messages to the console
print("Hello, World!")
print("Welcome to Python!")
print("This is my first program")

# You can print numbers too
print(42)
print(3.14)`,
                wordBlocks: [
                    "# Print different messages to the console",
                    "print(\"Hello, World!\")",
                    "print(\"Welcome to Python!\")",
                    "print(\"This is my first program\")",
                    "",
                    "# You can print numbers too",
                    "print(42)",
                    "print(3.14)"
                ],
                instructions: {
                    en: "The print() function is the most basic tool in Python. It displays text and values to the console (output screen). Every piece of information inside the parentheses will be displayed. You can print strings (text in quotes), numbers, and variables. Think of it like speaking to the computer - print() makes it speak back to you with whatever you give it. The # symbol creates a comment - notes that Python ignores but help humans read the code.",
                    hi: "print() function Python ka sabse basic tool hai. Yeh console (output screen) par text aur values dikhata hai. Parentheses ke andar ka sab kuch display hoga. Aap strings (quoted text), numbers, aur variables print kar sakte hain. Isliye socho: print() computer ko bolata hai 'ye bata user ko'. # symbol se comment likhte hain - ye notes hote hain jo Python ignore karta hai lekin insaan ko code samajhne mein madad karte hain."
                }
            },
            2: {
                title: "Level 2: Variables",
                correctCode: `# Variables store data
name = "Alice"
age = 25
height = 5.8

# Print the variables
print(name)
print(age)
print(height)

# You can change variables
age = 26
print(age)`,
                wordBlocks: [
                    "# Variables store data",
                    "name = \"Alice\"",
                    "age = 25",
                    "height = 5.8",
                    "",
                    "# Print the variables",
                    "print(name)",
                    "print(age)",
                    "print(height)",
                    "",
                    "# You can change variables",
                    "age = 26",
                    "print(age)"
                ],
                instructions: {
                    en: "Variables are like labeled boxes that store information. When you write 'name = \"Alice\"', you're creating a box labeled 'name' and putting the value 'Alice' in it. Later, whenever you use the word 'name', Python remembers what's inside that box. The equals sign (=) is the assignment operator - it means 'put this value into this box'. You can store text (strings), whole numbers (integers), decimal numbers (floats), and more. Variables make your code reusable and organized - instead of typing the same data everywhere, you reference it by its name.",
                    hi: "Variables labeled boxes hote hain jo information store karte hain. Jab 'name = \"Alice\"' likhte ho, to ek box banate ho jispar 'name' likha ho aur usme 'Alice' rakho. Baad mein jab 'name' use karo, Python yaad rakhta hai us box ke andar kya hai. Equals sign (=) assignment operator hai - matlab 'is box mein ye value dalo'. Aap text (strings), poore numbers (integers), decimal numbers (floats), aur kuch aur store kar sakte ho. Variables se code reusable aur organized hota hai - har jagah data type karne ki jagay bas naam use karo."
                }
            },
            3: {
                title: "Level 3: Data Types",
                correctCode: `# Different data types in Python
student_name = "Bob"          # String
student_age = 18              # Integer
student_height = 5.9          # Float (decimal)
is_active = True              # Boolean (True/False)

# Print all types
print(student_name)
print(student_age)
print(student_height)
print(is_active)

# Check types with type()
print(type(student_name))
print(type(student_age))`,
                wordBlocks: [
                    "# Different data types in Python",
                    "student_name = \"Bob\"          # String",
                    "student_age = 18              # Integer",
                    "student_height = 5.9          # Float (decimal)",
                    "is_active = True              # Boolean (True/False)",
                    "",
                    "# Print all types",
                    "print(student_name)",
                    "print(student_age)",
                    "print(student_height)",
                    "print(is_active)",
                    "",
                    "# Check types with type()",
                    "print(type(student_name))",
                    "print(type(student_age))"
                ],
                instructions: {
                    en: "Python has four main data types you'll use constantly. Strings (str) are text - always written in quotes like \"Alice\". Integers (int) are whole numbers without decimals: 5, 100, -42. Floats (float) are decimal numbers: 3.14, 9.8, 0.5. Booleans (bool) are True or False - used for yes/no decisions. Each type behaves differently. You can add numbers, but you can't add text the same way. Python has a special type() function that tells you what type a value is. Understanding data types prevents errors - trying to do math with text, for example, causes problems. Think of types as different containers: a bucket holds water, a box holds books.",
                    hi: "Python ke char main data types hote hain jo constant use hote hain. Strings (str) text hote hain - hamesha quotes mein likhe jate hain jaise \"Alice\". Integers (int) poore numbers hote hain decimal ke bina: 5, 100, -42. Floats (float) decimal numbers hote hain: 3.14, 9.8, 0.5. Booleans (bool) True ya False hote hain - haan/nahi decisions ke liye use hote hain. Har type alag tarah kaam karta hai. Aap numbers add kar sakte ho, lekin text ko same way add nahi kar sakte. type() function se pata chal sakta hai ki kaunsi type hai. Data types samajhne se errors avoid hote hain. Think like: bucket mein pani, box mein books."
                }
            },
            4: {
                title: "Level 4: Lists",
                correctCode: `# Lists store multiple items
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["Alice", 25, 5.9, True]

# Access items using index (starts at 0)
print(fruits[0])      # "apple"
print(fruits[1])      # "banana"
print(numbers[2])     # 3

# Add items to a list
fruits.append("orange")
print(fruits)

# Get list length
print(len(fruits))`,
                wordBlocks: [
                    "# Lists store multiple items",
                    "fruits = [\"apple\", \"banana\", \"cherry\"]",
                    "numbers = [1, 2, 3, 4, 5]",
                    "mixed = [\"Alice\", 25, 5.9, True]",
                    "",
                    "# Access items using index (starts at 0)",
                    "print(fruits[0])      # \"apple\"",
                    "print(fruits[1])      # \"banana\"",
                    "print(numbers[2])     # 3",
                    "",
                    "# Add items to a list",
                    "fruits.append(\"orange\")",
                    "print(fruits)",
                    "",
                    "# Get list length",
                    "print(len(fruits))"
                ],
                instructions: {
                    en: "Lists are containers that hold multiple items in a specific order. Create a list using square brackets: [\"apple\", \"banana\"]. Lists can contain strings, numbers, booleans, or even other lists - all mixed together. To access items, use an index number in square brackets like fruits[0]. IMPORTANT: Python counts starting at 0, not 1! So the first item is at index 0, second at index 1, etc. Use .append() to add items to the end. len() gives you the total number of items. Lists are 'mutable' - you can change, add, or remove items after creating them. This makes them perfect for storing collections of data that might change.",
                    hi: "Lists containers hote hain jo multiple items ko specific order mein store karte hain. List banane ke liye square brackets use karo: [\"apple\", \"banana\"]. Lists strings, numbers, booleans, ya aur bhi lists contain kar sakte hain - sab mix. Items access karne ke liye index number use karo like fruits[0]. ZAROORI: Python 0 se count karta hai, 1 se nahi! First item index 0 par, second index 1 par. .append() use karke end mein items add karo. len() total items de deta hai. Lists 'mutable' hain - banane ke baad bhi change, add, ya remove kar sakte ho. Ye data collection store karne ke liye perfect hai."
                }
            },
            5: {
                title: "Level 5: For Loops",
                correctCode: `# For loops repeat code multiple times
fruits = ["apple", "banana", "cherry", "date"]

# Loop through each item
for fruit in fruits:
    print(fruit)

# Loop with range for numbers
for i in range(5):
    print(i)

# Loop with a counter
count = 0
for number in [10, 20, 30]:
    count = count + 1
    print(count, number)`,
                wordBlocks: [
                    "# For loops repeat code multiple times",
                    "fruits = [\"apple\", \"banana\", \"cherry\", \"date\"]",
                    "",
                    "# Loop through each item",
                    "for fruit in fruits:",
                    "    print(fruit)",
                    "",
                    "# Loop with range for numbers",
                    "for i in range(5):",
                    "    print(i)",
                    "",
                    "# Loop with a counter",
                    "count = 0",
                    "for number in [10, 20, 30]:",
                    "    count = count + 1",
                    "    print(count, number)"
                ],
                instructions: {
                    en: "For loops let you repeat a block of code multiple times without writing it over and over. 'for fruit in fruits:' means 'take each fruit from the list, one by one, and do the indented code below'. Indentation (spacing) is critical in Python - the indented lines are what repeat. range(5) creates numbers 0,1,2,3,4. You can loop through lists, ranges, or strings. Each iteration, the loop variable (like 'fruit' or 'i') holds the current item. Loops save enormous amounts of code - if you need to process 1000 items, one loop does it all instead of 1000 print statements. Understanding loops is fundamental to programming.",
                    hi: "For loops code ke block ko multiple times repeat karte hain - ek ek baar likhna nahi padta. 'for fruit in fruits:' ka matlab 'har fruit ko list se, ek-ek, le aur neeche ka indented code karo'. Indentation (space) Python mein zaroori hai - indented lines hi repeat hote hain. range(5) se numbers 0,1,2,3,4 bante hain. Aap lists, ranges, ya strings se loop kar sakte ho. Har iteration mein loop variable (fruit ya i) current item hold karta hai. Loops se code ki bhut saari lines Bach jaati hain - 1000 items process karne ke liye ek loop chahiye, 1000 print nahi. Loops samajhna fundamental hai."
                }
            },
            6: {
                title: "Level 6: If/Else Conditions",
                correctCode: `# If/Else makes decisions
age = 20

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Multiple conditions
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")`,
                wordBlocks: [
                    "# If/Else makes decisions",
                    "age = 20",
                    "",
                    "if age >= 18:",
                    "    print(\"You are an adult\")",
                    "else:",
                    "    print(\"You are a minor\")",
                    "",
                    "# Multiple conditions",
                    "score = 85",
                    "",
                    "if score >= 90:",
                    "    print(\"Grade: A\")",
                    "elif score >= 80:",
                    "    print(\"Grade: B\")",
                    "elif score >= 70:",
                    "    print(\"Grade: C\")",
                    "else:",
                    "    print(\"Grade: F\")"
                ],
                instructions: {
                    en: "If/Else statements let your code make decisions based on conditions. 'if age >= 18:' checks if the condition is true - if yes, it runs the indented code below. 'else:' runs if the condition is false. Use comparison operators: > (greater than), < (less than), >= (greater or equal), <= (less or equal), == (equal), != (not equal). 'elif' means 'else if' - check another condition if the first was false. You can chain multiple elif statements. Python checks conditions top to bottom and stops at the first true condition - the rest are skipped. If/Else is how programs react differently to different situations, making them intelligent and responsive.",
                    hi: "If/Else statements se code decisions lete hain conditions ke basis par. 'if age >= 18:' check karta hai - agar condition true hai to indented code chalega. 'else:' chalega agar condition false hai. Comparison operators use karo: > (bada), < (chhota), >= (bada ya barabar), <= (chhota ya barabar), == (barabar), != (barabar nahi). 'elif' matlab 'else if' - ek aur condition check karo. Multiple elif chain kar sakte ho. Python top se check karta hai aur pehli true condition par rukta hai - baki skip hote hain. Isliye se code alag-alag situations mein alag response de sakta hai."
                }
            },
            7: {
                title: "Level 7: Functions",
                correctCode: `# Define a function
def greet(name):
    print("Hello, " + name)
    print("Welcome!")

# Call the function
greet("Alice")
greet("Bob")

# Function with return value
def add(a, b):
    result = a + b
    return result

sum1 = add(5, 3)
sum2 = add(10, 20)
print(sum1)
print(sum2)`,
                wordBlocks: [
                    "# Define a function",
                    "def greet(name):",
                    "    print(\"Hello, \" + name)",
                    "    print(\"Welcome!\")",
                    "",
                    "# Call the function",
                    "greet(\"Alice\")",
                    "greet(\"Bob\")",
                    "",
                    "# Function with return value",
                    "def add(a, b):",
                    "    result = a + b",
                    "    return result",
                    "",
                    "sum1 = add(5, 3)",
                    "sum2 = add(10, 20)",
                    "print(sum1)",
                    "print(sum2)"
                ],
                instructions: {
                    en: "Functions are reusable blocks of code that do a specific job. Define a function with 'def functioname(parameters):' followed by indented code. Parameters are inputs the function receives - like variables. When you call a function by name with values, it runs that code with those values. The 'return' statement sends a value back from the function. Without return, functions just execute instructions. Functions are powerful because you write code once, then use it many times with different inputs. This prevents repetition and makes code easier to maintain. As programs grow larger, functions organize code into manageable pieces.",
                    hi: "Functions reusable code blocks hote hain jo specific kaam karte hain. 'def functionname(parameters):' se function define karte ho. Parameters inputs hote hain jo function ko milte hain. Function ko call karte hue values dete ho, to ye un values ke saath code chalata hai. 'return' statement function se value wapas bhejta hai. Return ke bina function bas instructions chalata hai. Functions powerful hain kyunki ek baar code likho, phir bohot baar use karo alag-alag inputs ke saath. Ye repetition hata deta hai aur code maintain karna aasan ban jata hai. Bade programs mein functions code ko organize karte hain."
                }
            },
            8: {
                title: "Level 8: String Methods",
                correctCode: `# String methods manipulate text
message = "Hello, World!"

# Convert case
print(message.lower())
print(message.upper())

# Find and replace
print(message.replace("World", "Python"))

# Check contents
print(message.startswith("Hello"))
print(message.endswith("!"))
print("World" in message)

# Split and join
words = message.split(",")
print(words)
sentence = " ".join(["Python", "is", "fun"])
print(sentence)`,
                wordBlocks: [
                    "# String methods manipulate text",
                    "message = \"Hello, World!\"",
                    "",
                    "# Convert case",
                    "print(message.lower())",
                    "print(message.upper())",
                    "",
                    "# Find and replace",
                    "print(message.replace(\"World\", \"Python\"))",
                    "",
                    "# Check contents",
                    "print(message.startswith(\"Hello\"))",
                    "print(message.endswith(\"!\"))",
                    "print(\"World\" in message)",
                    "",
                    "# Split and join",
                    "words = message.split(\",\")",
                    "print(words)",
                    "sentence = \" \".join([\"Python\", \"is\", \"fun\"])",
                    "print(sentence)"
                ],
                instructions: {
                    en: "Strings are objects with built-in methods (functions attached to them) that manipulate text. .lower() converts to lowercase, .upper() to uppercase. .replace(old, new) finds text and swaps it. .startswith() and .endswith() check how text begins or ends - useful for validation. The 'in' keyword checks if text exists within a string. .split(separator) breaks a string into a list by a delimiter (like comma or space). .join(list) does the opposite - combines list items into one string with a separator. String methods make text processing elegant and powerful. You're not limited to the methods shown - Python has many more. Understanding that strings are objects with methods teaches an important programming concept: everything in Python is an object with capabilities.",
                    hi: "Strings objects hote hain jinak attached methods (functions) hote hain jo text manipulate karte hain. .lower() lowercase banata hai, .upper() uppercase banata hai। .replace(old, new) text find karke swap karta hai. .startswith() aur .endswith() check karte hain text kaise start ya end hota hai. 'in' keyword check karta hai text string mein hai ya nahi. .split(separator) string ko list mein todta hai delimeter se. .join(list) opposite karta hai - list items ko ek string mein combine karta hai. String methods se text processing aasan hota hai। Python ke aur bhi methods hain. Ye samajhna important hai: Python mein sab kuch object hai jo capabilities karte hain."
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
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.startLevel(parseInt(e.target.dataset.level));
            });
        });

        document.getElementById('check-arrangement').addEventListener('click', () => this.checkArrangement());
        document.getElementById('check-typing').addEventListener('click', () => this.checkTyping());
        document.getElementById('reset-level').addEventListener('click', () => this.resetLevel());
        document.getElementById('next-level').addEventListener('click', () => this.nextLevel());
        document.getElementById('back-to-levels').addEventListener('click', () => this.showLevelSelection());

        document.getElementById('language-select').addEventListener('change', () => this.updateInstructions());
        document.getElementById('play-audio').addEventListener('click', () => this.playInstructionsAudio());
        document.getElementById('pause-audio').addEventListener('click', () => this.pauseInstructionsAudio());

        document.getElementById('chat-send').addEventListener('click', () => this.handleChatAsk());
        document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleChatAsk();
            }
        });

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
        shuffledLines.forEach((line) => {
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
        const normalize = (code) => code.replace(/\s+/g, ' ').trim();
        return normalize(userCode) === normalize(correctCode);
    }

    handleChatAsk() {
        const input = document.getElementById('chat-input');
        let question = input.value.trim();
        if (!question) return;

        const history = document.getElementById('chat-history');
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg user';
        userMsg.textContent = 'You: ' + question;
        history.appendChild(userMsg);

        const answer = this.getLocalChatAnswer(question);
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.textContent = 'Tutor: ' + answer;
        history.appendChild(botMsg);

        history.scrollTop = history.scrollHeight;
        input.value = '';

        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(answer);
            utterance.lang = document.getElementById('language-select').value === 'hindi' ? 'hi-IN' : 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    }

    getLocalChatAnswer(question) {
        const lang = document.getElementById('language-select').value;
        const questionLow = question.toLowerCase();

        const prelude = lang === 'hindi' ? 'Main ab bata sakta hoon:' : 'Let me explain:';

        if (questionLow.includes('print')) {
            return lang === 'hindi'
                ? `${prelude} print() se console par output dikta hai. print("text") se text dikhegi.`
                : `${prelude} print() displays output to the console. Use print("text") to display text.`;
        }
        if (questionLow.includes('variable')) {
            return lang === 'hindi'
                ? `${prelude} name = "value" se variable banate ho. Baad mein name use karo.`
                : `${prelude} Use name = value to create variables. Then use the variable name later.`;
        }
        if (questionLow.includes('list')) {
            return lang === 'hindi'
                ? `${prelude} [item1, item2] se list banta hai. items[0] first item deta hai.`
                : `${prelude} [item1, item2] creates a list. items[0] gets the first element.`;
        }
        if (questionLow.includes('loop') || questionLow.includes('for')) {
            return lang === 'hindi'
                ? `${prelude} for i in range(5): se 0,1,2,3,4 tak loop hota hai. for item in list: se sab items process hote hain.`
                : `${prelude} for i in range(5): loops through 0,1,2,3,4. for item in list: loops through all items.`;
        }
        if (questionLow.includes('if') || questionLow.includes('condition')) {
            return lang === 'hindi'
                ? `${prelude} if condition: true ho to code chalega. else: false ho to ye chalega. elif: aur condition.`
                : `${prelude} if condition: runs if true. else: runs if false. elif: checks another condition.`;
        }
        if (questionLow.includes('function') || questionLow.includes('def')) {
            return lang === 'hindi'
                ? `${prelude} def name(params): se function banta hai. return se value wapas bhejte ho.`
                : `${prelude} def name(params): defines a function. return sends a value back.`;
        }
        if (questionLow.includes('string')) {
            return lang === 'hindi'
                ? `${prelude} "text" = string. .lower(), .upper(), .replace(), .split(), .join() methods use karo.`
                : `${prelude} "text" is a string. Use .lower(), .upper(), .replace(), .split(), .join() methods.`;
        }
        if (questionLow.includes('syntax') || questionLow.includes('error')) {
            return lang === 'hindi'
                ? `${prelude} Colons (:) after if/for/def. Indentation zaroori hai. Quotes " " strings ke liye.`
                : `${prelude} Use colons : after if/for/def. Indentation is required. Use quotes for strings.`;
        }

        const examples = lang === 'hindi'
            ? 'Puchho: print, variable, list, loop, if, function, string, syntax'
            : 'Try asking about: print, variable, list, loop, if, function, string, syntax';

        return `${prelude} ${examples}`;
    }

    showMessage(type, text) {
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
            this.showMessage('success', 'Congratulations! You completed all Python levels!');
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
        if (!level || !level.instructions) {
            document.getElementById('instructions-text').textContent = '';
            return;
        }

        let text = level.instructions.en;
        if (selectedLang === 'hindi') {
            text = level.instructions.hi;
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
        this.currentUtterance.rate = 0.9;
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

document.addEventListener('DOMContentLoaded', () => {
    new PythonGame();
});