#include <Servo.h>

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
}
