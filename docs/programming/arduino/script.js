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
                    en: "Hardware: LED anode to digital pin 13, LED cathode to resistor, then to GND. If you use the built-in board LED, no external wiring is needed. In setup(), pinMode(13, OUTPUT) sets pin 13 as output. In loop(), digitalWrite(13, HIGH) turns the LED on, delay(1000) waits 1 second, digitalWrite(13, LOW) turns it off, and delay(1000) waits 1 second.",
                    hi: "Hardware: LED ka lambai wala pin digital pin 13 se jodein, chhota pin resistor ke through ground se jodein. Agar aap built-in board LED use kar rahe hain toh extra wiring nahi chahiye. setup() mein pinMode(13, OUTPUT) pin 13 ko output banata hai. loop() mein digitalWrite(13, HIGH) LED ko on karta hai, delay(1000) 1 second ke liye rukta hai, digitalWrite(13, LOW) LED ko off karta hai, aur delay(1000) fir rukta hai."
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
                    en: "Hardware: LED anode to pin 13, cathode to resistor and then GND. setup() sets pin 13 as OUTPUT. loop() uses digitalWrite(13, HIGH) to turn LED on, delay(1000) to keep it on for 1 second, digitalWrite(13, LOW) to turn it off, and delay(1000) again. This creates a blink.",
                    hi: "Hardware: LED ka anode pin 13 se jodein, cathode resistor ke through GND se jodein. setup() pin 13 ko OUTPUT set karta hai. loop() digitalWrite(13, HIGH) se LED ko on karta hai, delay(1000) 1 second ke liye rukta hai, digitalWrite(13, LOW) se LED ko off karta hai, aur delay(1000) phir rukta hai. Yeh blink banata hai."
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
                    en: "Hardware: three LEDs each with a resistor, connected to pins 13, 12, and 11. All LED cathodes should go to common ground. setup() sets pins 13, 12, and 11 as OUTPUT. loop() turns only one LED on at a time for 500 ms, then moves to the next LED to create a rotating blink effect.",
                    hi: "Hardware: teen LEDs ko resistor ke saath pin 13, 12, aur 11 se jodein. Sab LED cathode common ground se jani chahiye. setup() pins 13, 12, 11 ko OUTPUT set karta hai. loop() ek samay par sirf ek LED on karta hai 500 ms ke liye, phir doosri par chala jaata hai, jis se ghoomta hua blink effect milta hai."
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
                    en: "Hardware: use a DC motor driver or transistor. Arduino pin 9 should connect to the driver input or transistor base (with a resistor). The motor power must come from an external supply, and the motor GND must share ground with the Arduino. setup() sets pin 9 as OUTPUT. loop() writes analog values to pin 9 for full speed, half speed, and stop, each for 2 seconds.",
                    hi: "Hardware: DC motor driver ya transistor ka istemal karein. Arduino pin 9 ko driver input ya resistor ke through transistor base se jodein. Motor power bahar se de aur motor ka ground Arduino ground ke saath common ho. setup() pin 9 ko OUTPUT set karta hai. loop() analogWrite(9, 255) se full speed, 128 se half speed, aur 0 se stop karta hai, har stage 2 second ke liye."
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
                    en: "Hardware: connect two DC motor driver channels to Arduino pins 9 and 10. Each motor driver channel should have its motor power supply and the motor grounds must share common ground with the Arduino. setup() sets pins 9 and 10 as OUTPUT. loop() alternates one motor on while the other is off, then runs both at half speed, each state for 2 seconds.",
                    hi: "Hardware: do DC motor driver channels ko Arduino pins 9 aur 10 se jodein. Har motor driver channel ke liye motor power supply hona chahiye aur motor grounds Arduino ground ke saath common hone chahiye. setup() pins 9 aur 10 ko OUTPUT set karta hai. loop() pehle ek motor on karta hai jab doosra off hai, fir doosra on karta hai jab pehla off hai, phir dono half speed par chalta hai, har state 2 second ke liye."
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
                    en: "Hardware: HC-SR04 ultrasonic sensor VCC to 5V, GND to Arduino GND, Trig to pin 9, Echo to pin 10. setup() initializes Serial at 9600 and sets trigPin OUTPUT and echoPin INPUT. loop() sends a pulse on trigPin, reads the pulse duration on echoPin, converts that duration to distance, and prints the result to Serial.",
                    hi: "Hardware: HC-SR04 ultrasonic sensor ka VCC 5V se, GND Arduino GND se, Trig pin 9 se, aur Echo pin 10 se jodein. setup() Serial ko 9600 par initialize karta hai aur trigPin ko OUTPUT, echoPin ko INPUT set karta hai. loop() trigPin par pulse bhejta hai, echoPin se duration padhta hai, duration ko distance mein badalta hai, aur result Serial par print karta hai."
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
                    en: "Hardware: LED anode to pin 13, cathode to resistor to GND, and open the Serial Monitor over USB. setup() starts Serial at 9600 and sets pin 13 as OUTPUT. loop() uses a for loop to blink the LED 5 times, printing the blink count to Serial on each cycle, then waits 2 seconds before repeating.",
                    hi: "Hardware: LED ka anode pin 13 se jodein, cathode resistor ke through GND se jodein, aur USB ke zariye Serial Monitor kholen. setup() Serial ko 9600 par chalata hai aur pin 13 ko OUTPUT set karta hai. loop() for loop se LED ko 5 baar blink karta hai aur har cycle mein blink count Serial par print karta hai, phir 2 second ke liye rukta hai."
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
                    en: "Hardware: servo signal wire to pin 9, servo VCC to 5V, servo GND to Arduino GND (common ground). setup() attaches the servo to pin 9. loop() sweeps the servo from 0 to 180 degrees and back to 0 using 15 ms delay steps.",
                    hi: "Hardware: servo signal wire pin 9 se jodein, servo VCC 5V se aur servo GND Arduino GND ke saath common rakhein. setup() servo ko pin 9 se attach karta hai. loop() servo ko 0 se 180 degree tak aur phir 0 degree tak 15 ms step mein chalata hai."
                }
            },
            9: {
                title: "Level 9: If Else with LED",
                correctCode: `const int buttonPin = 2;
const int ledPin = 13;

void setup() {
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(ledPin, OUTPUT);
}

void loop() {
    int buttonState = digitalRead(buttonPin);

    if (buttonState == LOW) {
        digitalWrite(ledPin, HIGH);
    } else {
        digitalWrite(ledPin, LOW);
    }
}`,
                wordBlocks: [
                    "const int buttonPin = 2;",
                    "const int ledPin = 13;",
                    "",
                    "void setup() {",
                    "    pinMode(buttonPin, INPUT_PULLUP);",
                    "    pinMode(ledPin, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    int buttonState = digitalRead(buttonPin);",
                    "",
                    "    if (buttonState == LOW) {",
                    "        digitalWrite(ledPin, HIGH);",
                    "    } else {",
                    "        digitalWrite(ledPin, LOW);",
                    "    }",
                    "}"
                ],
                instructions: {
                    en: "Hardware: connect push button to pin 2 and GND, and LED to pin 13 (or use built-in LED). setup() enables INPUT_PULLUP for button and OUTPUT for LED. loop() uses if/else: if button is pressed (LOW), LED turns on, else LED turns off.",
                    hi: "Hardware: push button ko pin 2 aur GND se jodein, aur LED ko pin 13 se jodein (ya built-in LED use karein). setup() button ke liye INPUT_PULLUP aur LED ke liye OUTPUT set karta hai. loop() mein if/else hai: agar button press ho (LOW) to LED on, warna LED off."
                }
            },
            10: {
                title: "Level 10: If Else with Servo",
                correctCode: `#include <Servo.h>

Servo gateServo;
const int potPin = A0;

void setup() {
    gateServo.attach(9);
}

void loop() {
    int sensorValue = analogRead(potPin);

    if (sensorValue > 512) {
        gateServo.write(180);
    } else {
        gateServo.write(0);
    }

    delay(20);
}`,
                wordBlocks: [
                    "#include <Servo.h>",
                    "",
                    "Servo gateServo;",
                    "const int potPin = A0;",
                    "",
                    "void setup() {",
                    "    gateServo.attach(9);",
                    "}",
                    "",
                    "void loop() {",
                    "    int sensorValue = analogRead(potPin);",
                    "",
                    "    if (sensorValue > 512) {",
                    "        gateServo.write(180);",
                    "    } else {",
                    "        gateServo.write(0);",
                    "    }",
                    "",
                    "    delay(20);",
                    "}"
                ],
                instructions: {
                    en: "Hardware: servo signal to pin 9, VCC to 5V, GND to GND, and potentiometer middle pin to A0. loop() reads analog value from A0. if value is greater than 512, servo moves to 180 degrees; else servo moves to 0 degrees.",
                    hi: "Hardware: servo signal pin 9 par, VCC 5V par, GND common ground par, aur potentiometer ka middle pin A0 par jodein. loop() A0 ka analog value padhta hai. agar value 512 se badi ho to servo 180 degree par jaata hai, warna 0 degree par."
                }
            },
            11: {
                title: "Level 11: If Else with DC Motor",
                correctCode: `const int ldrPin = A0;
const int motorPin = 9;

void setup() {
    pinMode(motorPin, OUTPUT);
}

void loop() {
    int lightValue = analogRead(ldrPin);

    if (lightValue < 400) {
        analogWrite(motorPin, 220);
    } else {
        analogWrite(motorPin, 0);
    }

    delay(100);
}`,
                wordBlocks: [
                    "const int ldrPin = A0;",
                    "const int motorPin = 9;",
                    "",
                    "void setup() {",
                    "    pinMode(motorPin, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    int lightValue = analogRead(ldrPin);",
                    "",
                    "    if (lightValue < 400) {",
                    "        analogWrite(motorPin, 220);",
                    "    } else {",
                    "        analogWrite(motorPin, 0);",
                    "    }",
                    "",
                    "    delay(100);",
                    "}"
                ],
                instructions: {
                    en: "Hardware: LDR sensor output to A0 and DC motor driver input to pin 9. In loop(), if room is dark (light value < 400), motor runs at high speed. Else, motor stops.",
                    hi: "Hardware: LDR sensor ka output A0 par jodein aur DC motor driver ka input pin 9 par jodein. loop() mein agar andhera ho (light value < 400) to motor high speed par chalta hai. warna motor band ho jaata hai."
                }
            },
            12: {
                title: "Level 12: If Else with Ultrasonic and LED",
                correctCode: `const int trigPin = 9;
const int echoPin = 10;
const int ledPin = 13;

void setup() {
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    int distance = duration * 0.034 / 2;

    if (distance < 20) {
        digitalWrite(ledPin, HIGH);
    } else {
        digitalWrite(ledPin, LOW);
    }

    Serial.println(distance);
    delay(100);
}`,
                wordBlocks: [
                    "const int trigPin = 9;",
                    "const int echoPin = 10;",
                    "const int ledPin = 13;",
                    "",
                    "void setup() {",
                    "    pinMode(trigPin, OUTPUT);",
                    "    pinMode(echoPin, INPUT);",
                    "    pinMode(ledPin, OUTPUT);",
                    "    Serial.begin(9600);",
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
                    "    if (distance < 20) {",
                    "        digitalWrite(ledPin, HIGH);",
                    "    } else {",
                    "        digitalWrite(ledPin, LOW);",
                    "    }",
                    "",
                    "    Serial.println(distance);",
                    "    delay(100);",
                    "}"
                ],
                instructions: {
                    en: "Hardware: HC-SR04 trig to pin 9, echo to pin 10, LED to pin 13. loop() measures distance and uses if/else: if object is closer than 20 cm, LED turns on; else LED turns off.",
                    hi: "Hardware: HC-SR04 ka trig pin 9 par, echo pin 10 par, aur LED pin 13 par jodein. loop() distance measure karta hai aur if/else lagata hai: agar object 20 cm se paas ho to LED on, warna LED off."
                }
            },
            13: {
                title: "Level 13: Assignment - Ultrasonic and Multiple LEDs",
                correctCode: ``,
                wordBlocks: [],
                instructions: {
                    en: "Assignment (No starter code): Build an Arduino sketch using HC-SR04 ultrasonic sensor and three LEDs (LED1 on pin 11, LED2 on pin 12, LED3 on pin 13). Measure distance in centimeters continuously. Apply if/else-if/else logic for ranges: if distance is 1 to 10 cm, only LED1 should glow; if distance is 11 to 20 cm, LED1 should turn off and only LED2 should glow; if distance is 21 to 30 cm, LED1 and LED2 should turn off and only LED3 should glow; otherwise (distance greater than 30 cm or no valid object), all LEDs should stay OFF. Print distance in Serial Monitor so behavior can be verified.",
                    hi: "Assignment (starter code nahi diya gaya): HC-SR04 ultrasonic sensor aur 3 LEDs (LED1 pin 11, LED2 pin 12, LED3 pin 13) ka use karke khud se Arduino sketch banao. Distance ko centimeters me continuously measure karo. if/else-if/else logic lagao: agar distance 1 se 10 cm ho to sirf LED1 ON ho; agar distance 11 se 20 cm ho to LED1 OFF ho aur sirf LED2 ON ho; agar distance 21 se 30 cm ho to LED1 aur LED2 OFF ho aur sirf LED3 ON ho; warna (distance 30 cm se zyada ho ya valid object na ho) sabhi LEDs OFF rahen. Behavior verify karne ke liye Serial Monitor me distance print karo."
                }
            },
            14: {
                title: "Level 14: If Else If Traffic LEDs",
                correctCode: `const int sensorPin = A0;
const int greenLed = 11;
const int yellowLed = 12;
const int redLed = 13;

void setup() {
    pinMode(greenLed, OUTPUT);
    pinMode(yellowLed, OUTPUT);
    pinMode(redLed, OUTPUT);
}

void loop() {
    int value = analogRead(sensorPin);

    if (value < 300) {
        digitalWrite(greenLed, HIGH);
        digitalWrite(yellowLed, LOW);
        digitalWrite(redLed, LOW);
    } else if (value < 700) {
        digitalWrite(greenLed, LOW);
        digitalWrite(yellowLed, HIGH);
        digitalWrite(redLed, LOW);
    } else {
        digitalWrite(greenLed, LOW);
        digitalWrite(yellowLed, LOW);
        digitalWrite(redLed, HIGH);
    }

    delay(100);
}`,
                wordBlocks: [
                    "const int sensorPin = A0;",
                    "const int greenLed = 11;",
                    "const int yellowLed = 12;",
                    "const int redLed = 13;",
                    "",
                    "void setup() {",
                    "    pinMode(greenLed, OUTPUT);",
                    "    pinMode(yellowLed, OUTPUT);",
                    "    pinMode(redLed, OUTPUT);",
                    "}",
                    "",
                    "void loop() {",
                    "    int value = analogRead(sensorPin);",
                    "",
                    "    if (value < 300) {",
                    "        digitalWrite(greenLed, HIGH);",
                    "        digitalWrite(yellowLed, LOW);",
                    "        digitalWrite(redLed, LOW);",
                    "    } else if (value < 700) {",
                    "        digitalWrite(greenLed, LOW);",
                    "        digitalWrite(yellowLed, HIGH);",
                    "        digitalWrite(redLed, LOW);",
                    "    } else {",
                    "        digitalWrite(greenLed, LOW);",
                    "        digitalWrite(yellowLed, LOW);",
                    "        digitalWrite(redLed, HIGH);",
                    "    }",
                    "",
                    "    delay(100);",
                    "}"
                ],
                instructions: {
                    en: "Hardware: connect three LEDs to pins 11, 12, 13 and sensor/potentiometer to A0. loop() uses if, else if, else to show green, yellow, or red based on sensor value ranges.",
                    hi: "Hardware: teen LEDs ko pins 11, 12, 13 se jodein aur sensor/potentiometer ko A0 par jodein. loop() if, else if, else use karke sensor value ke hisaab se green, yellow, ya red LED jalata hai."
                }
            },
            15: {
                title: "Level 15: RTC (DS3231) and LED If Else",
                correctCode: `#include <Wire.h>
#include <RTClib.h>

RTC_DS3231 rtc;
const int ledPin = 13;

void setup() {
    pinMode(ledPin, OUTPUT);
    Serial.begin(9600);

    if (!rtc.begin()) {
        Serial.println("RTC not found");
        while (1) {}
    }
}

void loop() {
    DateTime now = rtc.now();
    int sec = now.second();

    if (sec % 3 == 0) {
        digitalWrite(ledPin, HIGH);
    } else {
        digitalWrite(ledPin, LOW);
    }

    Serial.println(sec);
    delay(200);
}`,
                wordBlocks: [
                    "#include <Wire.h>",
                    "#include <RTClib.h>",
                    "",
                    "RTC_DS3231 rtc;",
                    "const int ledPin = 13;",
                    "",
                    "void setup() {",
                    "    pinMode(ledPin, OUTPUT);",
                    "    Serial.begin(9600);",
                    "",
                    "    if (!rtc.begin()) {",
                    "        Serial.println(\"RTC not found\");",
                    "        while (1) {}",
                    "    }",
                    "}",
                    "",
                    "void loop() {",
                    "    DateTime now = rtc.now();",
                    "    int sec = now.second();",
                    "",
                    "    if (sec % 3 == 0) {",
                    "        digitalWrite(ledPin, HIGH);",
                    "    } else {",
                    "        digitalWrite(ledPin, LOW);",
                    "    }",
                    "",
                    "    Serial.println(sec);",
                    "    delay(200);",
                    "}"
                ],
                instructions: {
                    en: "Hardware: connect DS3231 via I2C (VCC to 5V, GND to GND, SDA to SDA, SCL to SCL) and LED to pin 13. loop() reads seconds from RTC. if second is multiple of 3, LED turns on; else LED turns off.",
                    hi: "Hardware: DS3231 ko I2C se jodein (VCC 5V, GND GND, SDA SDA, SCL SCL) aur LED ko pin 13 se jodein. loop() RTC se seconds padhta hai. agar second 3 ka multiple ho to LED on, warna LED off."
                }
            },
            16: {
                title: "Level 16: HC-05 Bluetooth with LED If Else",
                correctCode: `#include <SoftwareSerial.h>

SoftwareSerial bluetooth(2, 3);
const int ledPin = 13;

void setup() {
    pinMode(ledPin, OUTPUT);
    bluetooth.begin(9600);
}

void loop() {
    if (bluetooth.available()) {
        char command = bluetooth.read();

        if (command == '1') {
            digitalWrite(ledPin, HIGH);
        } else {
            digitalWrite(ledPin, LOW);
        }
    }
}`,
                wordBlocks: [
                    "#include <SoftwareSerial.h>",
                    "",
                    "SoftwareSerial bluetooth(2, 3);",
                    "const int ledPin = 13;",
                    "",
                    "void setup() {",
                    "    pinMode(ledPin, OUTPUT);",
                    "    bluetooth.begin(9600);",
                    "}",
                    "",
                    "void loop() {",
                    "    if (bluetooth.available()) {",
                    "        char command = bluetooth.read();",
                    "",
                    "        if (command == '1') {",
                    "            digitalWrite(ledPin, HIGH);",
                    "        } else {",
                    "            digitalWrite(ledPin, LOW);",
                    "        }",
                    "    }",
                    "}"
                ],
                instructions: {
                    en: "Hardware: HC-05 VCC to 5V, GND to GND, HC-05 TXD to Arduino pin 2, HC-05 RXD to Arduino pin 3 (use voltage divider for RXD), and LED to pin 13. loop() checks Bluetooth data. if command is '1' then LED turns on, else LED turns off.",
                    hi: "Hardware: HC-05 ka VCC 5V, GND GND, HC-05 TXD Arduino pin 2 par, HC-05 RXD Arduino pin 3 par jodein (RXD ke liye voltage divider use karein), aur LED pin 13 par jodein. loop() Bluetooth data check karta hai. agar command '1' ho to LED on, warna LED off."
                }
            },
            17: {
                title: "Level 17: HC-05 Bluetooth with DC Motor If Else",
                correctCode: `#include <SoftwareSerial.h>

SoftwareSerial bluetooth(2, 3);
const int motorPin = 9;

void setup() {
    pinMode(motorPin, OUTPUT);
    bluetooth.begin(9600);
}

void loop() {
    if (bluetooth.available()) {
        char command = bluetooth.read();

        if (command == 'F') {
            analogWrite(motorPin, 220);
        } else {
            analogWrite(motorPin, 0);
        }
    }
}`,
                wordBlocks: [
                    "#include <SoftwareSerial.h>",
                    "",
                    "SoftwareSerial bluetooth(2, 3);",
                    "const int motorPin = 9;",
                    "",
                    "void setup() {",
                    "    pinMode(motorPin, OUTPUT);",
                    "    bluetooth.begin(9600);",
                    "}",
                    "",
                    "void loop() {",
                    "    if (bluetooth.available()) {",
                    "        char command = bluetooth.read();",
                    "",
                    "        if (command == 'F') {",
                    "            analogWrite(motorPin, 220);",
                    "        } else {",
                    "            analogWrite(motorPin, 0);",
                    "        }",
                    "    }",
                    "}"
                ],
                instructions: {
                    en: "Hardware: HC-05 TXD to pin 2, RXD to pin 3 (through a voltage divider), and motor driver input to pin 9. Motor power should be external and all grounds must be common. loop() reads Bluetooth command. if command is 'F', motor runs; else motor stops.",
                    hi: "Hardware: HC-05 TXD pin 2 par, RXD pin 3 par (voltage divider ke saath), aur motor driver input pin 9 par jodein. Motor power external rakhein aur sabka ground common ho. loop() Bluetooth command padhta hai. agar command 'F' ho to motor chalega, warna motor ruk jayega."
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

        // Chat support (free local logic)
        document.getElementById('chat-send').addEventListener('click', () => this.handleChatAsk());
        document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleChatAsk();
            }
        });

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
        const code = this.levels[this.currentLevel].correctCode;

        const prelude = lang === 'hindi'
            ? 'Main yeh bata sakta hoon:'
            : 'I can help with:';

        const pinMatch = questionLow.match(/pin\s*(\d+)/);
        if (pinMatch) {
            const pinNum = pinMatch[1];
            const isOutput = /output|led|motor|servo|analogwrite|digitalwrite/.test(questionLow);
            const isInput = /input|button|sensor|echo|ultrasonic/.test(questionLow);
            if (isOutput && !isInput) {
                return lang === 'hindi'
                    ? `${prelude} Pin ${pinNum} ko output se jodhen. pinMode(${pinNum}, OUTPUT) lagayein.`
                    : `${prelude} Use pin ${pinNum} as output with pinMode(${pinNum}, OUTPUT).`;
            }
            if (isInput && !isOutput) {
                return lang === 'hindi'
                    ? `${prelude} Pin ${pinNum} ko input se jodhen. pinMode(${pinNum}, INPUT) lagayein.`
                    : `${prelude} Use pin ${pinNum} as input with pinMode(${pinNum}, INPUT).`;
            }
            return lang === 'hindi'
                ? `${prelude} Pin ${pinNum} ka use sensor ya actuator ke liye ho sakta hai; code ko check karein.`
                : `${prelude} Pin ${pinNum} can be used for sensor or actuator; check the code context.`;
        }

        if (questionLow.includes('delay')) {
            return lang === 'hindi' ? `${prelude} delay(1000) 1 second ka wait hai.` : `${prelude} delay(1000) waits for 1 second.`;
        }
        if (questionLow.includes('pinmode') || questionLow.includes('pin mode')) {
            return lang === 'hindi'
                ? `${prelude} pinMode(pin, OUTPUT) output, pinMode(pin, INPUT) input ko set karta hai.`
                : `${prelude} pinMode(pin, OUTPUT) sets pin as output; pinMode(pin, INPUT) sets pin as input.`;
        }
        if (questionLow.includes('setup')) {
            return lang === 'hindi'
                ? `${prelude} setup() ek baar start mein chalega. yah pinMode aur initial setup karta hai.`
                : `${prelude} setup() executes once and does initialization such as pinMode.`;
        }
        if (questionLow.includes('loop')) {
            return lang === 'hindi'
                ? `${prelude} loop() baar-baar chalta hai aur code ko repeat karta hai.`
                : `${prelude} loop() runs repeatedly and repeats your code block.`;
        }
        if (questionLow.includes('motor')) {
            return lang === 'hindi'
                ? `${prelude} analogWrite(pin, value) se DC motor speed control hoti hai. 255 full speed, 0 band.`
                : `${prelude} analogWrite(pin, value) controls motor PWM speed. 255 is full speed, 0 is off.`;
        }
        if (questionLow.includes('ultrasonic')) {
            return lang === 'hindi'
                ? `${prelude} Ultrasonic sensor mein trig pin pulse bhejta hai, echo pin duration wapas leta hai, distance calculate hota hai.`
                : `${prelude} In ultrasonic, trig sends pulse and echo measures duration. Distance is calculated from duration.`;
        }

        if (questionLow.includes('what') && questionLow.includes('code')) {
            return lang === 'hindi'
                ? `${prelude} Is level ka code: ${this.autoTranslateToHindi(code)}`
                : `${prelude} This level code is: ${code}`;
        }

        const sampleHelp = lang === 'hindi'
            ? 'Kuch example puchhein: delay, pinMode, setup, loop, motor, ultrasonic, pin 13.'
            : 'Try asking about: delay, pinMode, setup, loop, motor, ultrasonic, pin 13.';

        return `${prelude} ${sampleHelp}`;
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