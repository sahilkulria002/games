const int sensorPin = A0;
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
}
