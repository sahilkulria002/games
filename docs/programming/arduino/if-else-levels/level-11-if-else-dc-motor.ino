const int ldrPin = A0;
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
}
