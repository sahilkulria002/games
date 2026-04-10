#include <Wire.h>
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
}
