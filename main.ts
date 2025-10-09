// Fonction pour afficher la position actuelle
function afficherPosition () {
    x = Math.round(odometry.getX())
    y = Math.round(odometry.getY())
    angle = Math.round(odometry.getOrientationDegrees())
    basic.clearScreen()
    basic.showString("X:" + x)
    basic.pause(1000)
    basic.showString("Y:" + y)
    basic.pause(1000)
    basic.showString("A:" + angle)
    basic.pause(1000)
}
// Bouton A : Afficher la position actuelle
input.onButtonPressed(Button.A, function () {
    // Exemple : définir la position à (1000, 500) avec angle 0
    odometry.setPosition(100, 100, 0)
    basic.showIcon(IconNames.Target)
    basic.pause(500)
    basic.clearScreen()
})
// Boutons A+B : Définir une position de référence
input.onButtonPressed(Button.AB, function () {
    afficherPosition()
})
// Bouton B : Réinitialiser l'odométrie
input.onButtonPressed(Button.B, function () {
    odometry.reset()
    encoders.stop()
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
    basic.clearScreen()
    debug = 1
})
let rightDelta = 0
let leftDelta = 0
let scaledY = 0
let scaledX = 0
let angle = 0
let y = 0
let x = 0
let encoders: MagEncoders.MagEncoders = null
let debug = 0
let distance = 0
let angleRad = 0
let angleDeg = 0
debug = 0
// Configuration du robot
// Distance entre les roues en mm
let ENTRAXE_MM = 100
// Nombre de ticks par mètre
let TICKS_PAR_METRE = 130000
// Distance en mm représentée par chaque LED sur la matrice 5x5
let DISTANCE_PAR_LED_MM = 100
// Initialisation au démarrage
encoders = MagEncoders.createMagEncoder(
true,
false,
true,
true,
true,
true,
false
)
encoders.start()
odometry.initialize(ENTRAXE_MM, TICKS_PAR_METRE)
basic.showIcon(IconNames.Heart)
// ===== COMMUNICATION SÉRIE =====
// Envoi périodique de la position via le port série
loops.everyInterval(1000, function () {
	
})
// Affichage périodique de la position sur la matrice LED
basic.forever(function () {
    // Afficher un point représentant la position du robot
    // Mise à l'échelle pour la matrice 5x5
    // Chaque LED représente DISTANCE_PAR_LED_MM (50mm)
    // Centre de la matrice = position (0,0) du robot
    scaledX = Math.round(odometry.getY() / DISTANCE_PAR_LED_MM) + 2
    scaledY = Math.round(odometry.getX() / DISTANCE_PAR_LED_MM) + 2
    // Limiter aux dimensions de la matrice
    scaledX = Math.constrain(scaledX, 0, 4)
    scaledY = Math.constrain(scaledY, 0, 4)
    basic.clearScreen()
    // Inverser Y pour avoir Y+ vers le haut
    led.plot(scaledX, 4 - scaledY)
    basic.pause(200)
})
// ===== COMMUNICATION SÉRIE =====
// Envoi périodique de la position via le port série
loops.everyInterval(200, function () {
    encoders.getValues()
    // Obtenir les deltas des encodeurs
    leftDelta = encoders.getDeltaLeftValue()
    rightDelta = encoders.getDeltaRightValue()
    if (debug) {
        serial.writeNumbers([encoders.getLeftTotalCount(), encoders.getRightTotalCount()])
        serial.writeValue("X", Math.round(odometry.getX()))
        serial.writeValue("Y", Math.round(odometry.getY()))
        serial.writeValue("A", Math.round(odometry.getOrientationDegrees()))
    }
    // Mettre à jour l'odométrie seulement si il y a eu du mouvement
    if (leftDelta != 0 || rightDelta != 0) {
        odometry.updateFromTicks(leftDelta, rightDelta)
        serial.writeLine("X:" + Math.round(odometry.getX()) + ",Y:" + Math.round(odometry.getY()) + ",A:" + Math.round(odometry.getOrientationDegrees()))
    }
})
