void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while(!Serial){
    //wait until port opens
  }
}
void loop() {
  int sensor = analogRead(A0);
  Serial.println(sensor);
  delay(100);
}
