const int pin1 = 8;
const int pin2 = 9;
const int pwm = 10;

void setup() {
  Serial.begin(115200);
  pinMode(pin1, OUTPUT);
  pinMode(pin2, OUTPUT);
  pinMode(pwm, OUTPUT);
  digitalWrite(pin1, LOW);
  digitalWrite(pin2, LOW);
  digitalWrite(pwm, LOW);
}

void loop() {
  if(Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    
    if(cmd == "f") {
      digitalWrite(pin1, HIGH);
      digitalWrite(pin2, LOW);
      analogWrite(pwm, 200);
      delay(2000);
      digitalWrite(pin1, LOW);
      digitalWrite(pin2, LOW);
      analogWrite(pwm, 0);
    }
    
    if(cmd == "b") {
      digitalWrite(pin1, LOW);
      digitalWrite(pin2, HIGH);
      analogWrite(pwm, 200);
      delay(2000);
      digitalWrite(pin1, LOW);
      digitalWrite(pin2, LOW);
      analogWrite(pwm, 0);
    }
  }
}
