# dhbw-customerFeedback
VoiceBot

## Set Up Local
### if port 8080 is used:
netstat -ano | findstr :8080
taskkill /PID [task id] /F

### start ngrok:
ngrok http 8080

### To RUN the APP:
node app.js

### ngrok beenden
taskkill /f /im ngrok.exe

## development hints

### Add to package.json below "main":
"type": "module",


#  npm packages:
dialogflow-fulfillment@0.6.1
express@4.17.3
mysql@2.18.1



# SQL

## Schema
CREATE SCHEMA `dhbw` ;

### Kunde
CREATE TABLE `dhbw`.`kunde` (
`idKunde` INT NOT NULL,
`Name` VARCHAR(45) NULL,
`Geburtstag` DATE NULL,
`Servicepin` INT NULL,
PRIMARY KEY (`idKunde`));

#### Kundendaten
INSERT INTO `dhbw`.`kunde` (`Name`, `Geburtstag`, `Servicepin`) VALUES ('Thomas Müller', '1989-09-13', '25');
INSERT INTO `dhbw`.`kunde` (`Name`, `Geburtstag`, `Servicepin`) VALUES ('Manuel Neuer', '1986-03-27', '1');
INSERT INTO `dhbw`.`kunde` (`Name`, `Geburtstag`, `Servicepin`) VALUES ('Robert Lewandowski', '1988-08-21', '9');

### Auftrag

CREATE TABLE `dhbw`.`auftrag` (
`idAuftrag` INT NOT NULL,
`idKunde` INT NULL,
PRIMARY KEY (`idAuftrag`));

#### Auftragsdaten
INSERT INTO `dhbw`.`auftrag` (`idKunde`) VALUES ('1');
INSERT INTO `dhbw`.`auftrag` (`idKunde`) VALUES ('2');
INSERT INTO `dhbw`.`auftrag` (`idKunde`) VALUES ('3');
INSERT INTO `dhbw`.`auftrag` (`idKunde`) VALUES ('1');





