window.onload = function() {
    // Variables globales
    var canvas;
    var canvasWidth = 500;   // Largeur du canevas
    var canvasHeight = 300;  // Hauteur du canevas
    var blockSize = 10;      // Taille d'un bloc dans le jeu
    var ctx;                // Contexte de dessin du canevas
    var delay = 100;        // Délai entre chaque rafraîchissement
    var snakee;             // Instance du serpent
    var applee; 
    var score;
    var heightInBlocks = canvasHeight/blockSize;         // Instance de la pomme
    var WidthInBlocks = canvasWidth/blockSize;

    // Fonction d'initialisation appelée lorsque la page est chargée
    init();  
    
    function init() {
        // Crée un nouvel élément 'canvas'
        canvas = document.createElement('canvas');
        
        // Définit la largeur du canevas
        canvas.width = canvasWidth;
        
        // Définit la hauteur du canevas
        canvas.height = canvasHeight;
        
        // Ajoute une bordure de 1 pixel autour du canevas
        canvas.style.border = "25px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        
        // Ajoute le canevas au corps du document HTML
        document.body.appendChild(canvas);
    
        // Récupère le contexte de dessin en 2D du canevas
        ctx = canvas.getContext('2d');
        
        // Crée une instance du serpent avec une position initiale et une direction initiale
        snakee = new Snake([[6, 4], [5, 4], [4, 4],[3,4],[2,4]], "right");
        applee = new Apple([1, 1]); // Crée une pomme à la position (1,1)
        score=0;
        // Lance la boucle de rafraîchissement du canevas
        refreshCanvas();
    }
   
    function refreshCanvas() {
        // Avance le serpent (déplace-le) pour la prochaine itération
        snakee.advance();
        if(snakee.checkCollision()) {
            gameOver();
        } else {
            if(snakee.isEatingApple(applee)) {
                score++
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                } while(applee.isOnSnake(snakee));
            }

            // Efface l'ancien contenu du canevas
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
            // Dessine le serpent et la pomme sur le canevas
            drawScore();
            snakee.draw();
            applee.draw();
            
        
            // Répète la fonction après le délai défini
            setTimeout(refreshCanvas, delay);
        }
    }
    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 50px sans-serif"; // Taille et police du texte
        ctx.fillStyle = "#000";
        ctx.textAlign = "center"; // Aligne le texte au centre
        ctx.textBaseline = "middle"; // Aligne le texte au milieu verticalement
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY= canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY+50 );
        ctx.fillText("Game Over", centreX, centreY+50 );

        ctx.font = "bold 15px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer",centreX, centreY -100);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer",centreX, centreY -100);      
        ctx.restore();
    };
    function restart()
        {
        snakee = new Snake([[6, 4], [5, 4], [4, 4],[3,4],[2,4]], "right");
        applee = new Apple([1, 1]); // Crée une pomme à la position (1,1)
        score=0;
        // Lance la boucle de rafraîchissement du canevas
        refreshCanvas();
        };
    function drawScore()
        {
        ctx.save();
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center"
        ctx.fillText(score.toString(), canvasWidth/2,canvasHeight/1.8);
        ctx.restore();
        };
    

    function drawBlock(ctx, position) {
        // Calcule la position en pixels sur le canevas
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        
        // Dessine un bloc de taille `blockSize` à la position spécifiée
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        // Propriétés du serpent
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        // Méthode pour dessiner le serpent
        this.draw = function() {
            ctx.save();         // Sauvegarde l'état actuel du contexte
            ctx.fillStyle = "#ff0000";  // Définit la couleur du serpent
            
            // Dessine chaque segment du serpent
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            
            ctx.restore();      // Restaure l'état du contexte sauvegardé
        };

        // Méthode pour faire avancer le serpent
        this.advance = function() {
            // Crée une copie du premier segment du serpent
            var nextPosition = this.body[0].slice();
            
            // Déplace le serpent en fonction de la direction actuelle
            switch(this.direction) {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                default:
                    throw("Invalid Direction");
            }

            // Ajoute le nouveau segment au début du corps du serpent
            this.body.unshift(nextPosition);
            if(this.ateApple){

                this.ateApple = false;
            
            }
            else{
                // Enlève le dernier segment du corps du serpent (pour le déplacement)
                this.body.pop();
            }
        };

        // Méthode pour changer la direction du serpent
        this.setDirection = function(newDirection) {
            var allowedDirections;
            switch(this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "up":
                case "down":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };

        this.isEatingApple = function(appletoEat) {
            var head = this.body[0];
            if (head[0] === appletoEat.position[0] && head[1] === appletoEat.position[1]) {
                return true;
            } else {
                return false;
            }
        };

        this.checkCollision = function() {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = WidthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }
            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        }
    }

    function Apple(position) {
        this.position = position;

        // Méthode pour dessiner la pomme
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33"; // Couleur de la pomme
            ctx.beginPath();

            // Calcule la position en pixels et dessine un cercle (pomme)
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        };

        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (WidthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };

        this.isOnSnake = function(snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
                
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}
