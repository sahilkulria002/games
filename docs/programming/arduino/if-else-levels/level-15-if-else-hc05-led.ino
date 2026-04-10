#include <SoftwareSerial.h>

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
}
