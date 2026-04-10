#include <SoftwareSerial.h>

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
}
