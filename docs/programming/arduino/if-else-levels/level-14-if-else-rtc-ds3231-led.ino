#include <Wire.h>
#include <RTClib.h>

RTC_DS3231 rtc;

void setup() {
  Serial.begin(9600);

  if (!rtc.begin()) {
    Serial.println("RTC not found");
    while (1);
  }

  // Only set time if RTC lost power
  // if (rtc.lostPower()) {
    // Serial.println("RTC lost power, setting time...");
    
    // rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  // } else {
    // Serial.println("RTC already has correct time");
  // }
}

void loop() {
  DateTime now = rtc.now();

  Serial.print("Time: ");
  Serial.print(now.hour());
  Serial.print(":");
  Serial.print(now.minute());
  Serial.print(":");
  Serial.println(now.second());

   int sec = now.second();

    if (sec % 3 == 0) {
        digitalWrite(ledPin, HIGH);
    } else {
        digitalWrite(ledPin, LOW);
    }


  delay(500);
}