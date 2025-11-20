// Récupération des objets du DOM

let gridWidthSetting = document.querySelector("#gridWidth")
let gridHeightSetting = document.querySelector("#gridHeight")
let mineNumberSetting = document.querySelector("#mineNumber")
let gridDisplay = document.querySelector("#gridDisplay")

// Récupération des fichiers sonores

let goodChoiceAudio = new Audio(src = "../assets/sounds/goodchoice.mp3")
let winAudio = new Audio(src = "../assets/sounds/win.mp3")
let explosionAudio = new Audio(src = "../assets/sounds/explosion.mp3")

// Création des variables

let gridWidth = 0
let gridHeight = 0
let gridSize = 0
let gridCell = 0
let mineNumber = 0
let ratio = 0
let time = 0
let minutes = 0
let seconds = 0
let mineFound = 0
let score = 0
let goal = 0
let timeCount
let selectedSquare
let face

// Création des fonctions

// Implémentation des paramètres définis par l'utilisateur

function settings() {
    let levelSetting = document.querySelector("input[name=level]:checked").value
    switch (levelSetting) {
        case "easy":
            gridWidth = 9
            gridHeight = 9
            mineNumber = 10
            break
        case "medium":
            gridWidth = 16
            gridHeight = 16
            mineNumber = 40
            break
        case "hard":
            gridWidth = 30
            gridHeight = 16
            mineNumber = 99
            break
        case "custom":
            gridWidth = parseInt(gridWidthSetting.value)
            gridHeight = parseInt(gridHeightSetting.value)
            mineNumber = parseInt(mineNumberSetting.value)
            break
    }
}

// Construction de la grille et attribution des fonctions aux clics droit et gauche

function gridCreation() {
    let square
    gridSize = gridWidth * gridHeight
    ratio = mineNumber / gridSize
    if (gridWidth > 15) {
        gridCell = 25
    } else if (gridWidth > 10 && gridWidth <= 15) {
        gridCell = 33
    } else {
        gridCell = 50
    }
    gridDisplay.style.width = `${gridCell * gridWidth}px`
    gridDisplay.style.gridTemplateColumns = `repeat(${gridWidth}, ${gridCell}px)`
    gridDisplay.style.gridTemplateRows = `repeat(${gridHeight}, ${gridCell}px)`
    for (let i = 0; i < gridSize; i++) {
        square = document.createElement("button")
        square.setAttribute("id", `square${i}`)
        square.addEventListener("click", () => {
            squareReveal(i)
        }, { once: true })
        square.addEventListener("mouseup", (e) => {
            switch (e.button) {
                case 2:
                    flagSet(i)
                    break
                default:
                    break
            }
        })
        square.addEventListener("contextmenu", (e) => {
            e.preventDefault()
        })
        gridDisplay.appendChild(square)
    }
}

// Création des mines à des emplacements aléatoires

function minesCreation() {
    let random = 0
    let mineImage
    let mineNumberCreation = mineNumber
    while (mineNumberCreation > 0) {
        for (let i = 0; i < gridSize; i++) {
            random = Math.random()
            if (random <= ratio && document.getElementById(`square${i}`).childNodes.length == 0 && mineNumberCreation > 0) {
                mineImage = document.createElement("img")
                mineImage.setAttribute("src", "../assets/images/mine.png")
                mineImage.classList.add("mine")
                document.getElementById(`square${i}`).classList.add("mineYes")
                document.getElementById(`square${i}`).appendChild(mineImage)
                mineNumberCreation--
            }
        }
    }
}

// Vérification de l'entourage de chaque case non minée pour leur attribuer une valeur numérique

function neighbourCheck() {
    let neighbourMines = 0
    for (let i = 0; i < gridSize; i++) {
        if (i % gridWidth == 0 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = 1 - gridWidth; j <= 1 + gridWidth; j = j + gridWidth) {
                if (document.getElementById(`square${i + j}`) != null && document.getElementById(`square${i + j}`).childNodes.length == 1) {
                    neighbourMines++
                }
            }
            if (document.getElementById(`square${i - gridWidth}`) != null && document.getElementById(`square${i - gridWidth}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + gridWidth}`) != null && document.getElementById(`square${i + gridWidth}`).childNodes.length == 1) {
                neighbourMines++
            }
            document.getElementById(`square${i}`).classList.add(`mines${neighbourMines}`)
            neighbourMines = 0
        } else if (i % gridWidth == gridWidth - 1 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = -1 - gridWidth; j <= gridWidth - 1; j = j + gridWidth) {
                if (document.getElementById(`square${i + j}`) != null && document.getElementById(`square${i + j}`).childNodes.length == 1) {
                    neighbourMines++
                }
            }
            if (document.getElementById(`square${i - gridWidth}`) != null && document.getElementById(`square${i - gridWidth}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + gridWidth}`) != null && document.getElementById(`square${i + gridWidth}`).childNodes.length == 1) {
                neighbourMines++
            }
            document.getElementById(`square${i}`).classList.add(`mines${neighbourMines}`)
            neighbourMines = 0
        } else if (i % gridWidth != 0 && i % gridWidth != gridWidth - 1 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = gridWidth - 1; j <= gridWidth + 1; j++) {
                if (document.getElementById(`square${i - j}`) != null && document.getElementById(`square${i - j}`).childNodes.length == 1) {
                    neighbourMines++
                }
                if (document.getElementById(`square${i + j}`) != null && document.getElementById(`square${i + j}`).childNodes.length == 1) {
                    neighbourMines++
                }
            }
            if (document.getElementById(`square${i - 1}`) != null && document.getElementById(`square${i - 1}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + 1}`) != null && document.getElementById(`square${i + 1}`).childNodes.length == 1) {
                neighbourMines++
            }
            document.getElementById(`square${i}`).classList.add(`mines${neighbourMines}`)
            neighbourMines = 0
        }
    }
}

// Remplissage simultané des cases non minées avec la valeur numérique qui leur a été attribuée

function boardFill() {
    let squaresToFill
    let number
    for (let i = 0; i < 9; i++) {
        squaresToFill = document.querySelectorAll(`.mines${i}`)
        goal += squaresToFill.length * i
        squaresToFill.forEach(element => {
            number = document.createElement("p")
            if (i > 0) {
                number.textContent = i
            }
            element.appendChild(number)
        })
    }
}

// Vérification des cases voisines d'une case vide et simulation d'un clic sur chaque case non minée orthogonalement adjacente

function emptyCheck(index) {
    if (index % gridWidth == 0) {
        if (document.getElementById(`square${index + 1}`) != null) {
            document.getElementById(`square${index + 1}`).click()
        }
        if (document.getElementById(`square${index - gridWidth}`) != null) {
            document.getElementById(`square${index - gridWidth}`).click()
        }
        if (document.getElementById(`square${index + gridWidth}`) != null) {
            document.getElementById(`square${index + gridWidth}`).click()
        }
    } else if (index % gridWidth == gridWidth - 1) {
        if (document.getElementById(`square${index - 1}`) != null) {
            document.getElementById(`square${index - 1}`).click()
        }
        if (document.getElementById(`square${index - gridWidth}`) != null) {
            document.getElementById(`square${index - gridWidth}`).click()
        }
        if (document.getElementById(`square${index + gridWidth}`) != null) {
            document.getElementById(`square${index + gridWidth}`).click()
        }
    } else {
        if (document.getElementById(`square${index - gridWidth}`) != null) {
            document.getElementById(`square${index - gridWidth}`).click()
        }
        if (document.getElementById(`square${index + gridWidth}`) != null) {
            document.getElementById(`square${index + gridWidth}`).click()
        }
        if (document.getElementById(`square${index - 1}`) != null) {
            document.getElementById(`square${index - 1}`).click()
        }
        if (document.getElementById(`square${index + 1}`) != null) {
            document.getElementById(`square${index + 1}`).click()
        }
    }
}

// Révélation du contenu d'une case avec vérification des conditions de fin de partie

function squareReveal(index) {
    selectedSquare = document.getElementById(`square${index}`)
    selectedSquare.style.backgroundColor = "lightgrey"
    selectedSquare.childNodes[0].style.visibility = "visible"
    if (selectedSquare.className.includes("mines0")) {
        emptyCheck(index)
    } else if (selectedSquare.className.includes("mineYes")) {
        endGameLose()
    } else {
        goodChoiceAudio.play()
        score += parseInt(selectedSquare.childNodes[0].textContent)
        console.log(score);
        
        if (score == goal) {
            endGameWin()
        }
    }
}

// Pose et dépose d'un drapeau sur une case

function flagSet(index) {
    console.log("Drapeau posé !");
    selectedSquare = document.getElementById(`square${index}`)
    if (selectedSquare.className.includes("flag")) {
        selectedSquare.childNodes[1].remove()
        selectedSquare.childNodes[0].style.display = "block"
        selectedSquare.classList.remove("flag")
        mineFound++
        document.getElementById("minesDisplay").textContent = mineFound
    } else {
        selectedSquare.childNodes[0].style.display = "none"
        let flagsquare = document.createElement("div")
        selectedSquare.classList.add("flag")
        let flagImage = document.createElement("img")
        flagImage.setAttribute("src", "../assets/images/flag.png")
        flagsquare.appendChild(flagImage)
        selectedSquare.appendChild(flagsquare)
        mineFound--
        document.getElementById("minesDisplay").textContent = mineFound
    }
}

// Chronomètre

function timer() {
    minutes = parseInt(time / 60)
    seconds = parseInt(time % 60)
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    document.getElementById("timerDisplay").textContent = `${minutes}:${seconds}`
    time++
}

// Fin de partie sur défaite

function endGameLose() {
    explosionAudio.play()
    document.getElementById("faceDisplay").replaceChildren()
    face = document.createElement("img")
    face.setAttribute("src", "../assets/images/lose.png")
    document.getElementById("faceDisplay").appendChild(face)
    clearInterval(timeCount)
    let minesSet = document.querySelectorAll(".mineYes")
    minesSet.forEach(element => {
        element.childNodes[0].style.visibility = "visible"
    })
    endGameDisplay("lose")
}

// Fin de partie sur victoire

function endGameWin() {
    winAudio.play()
    document.getElementById("faceDisplay").replaceChildren()
    face = document.createElement("img")
    face.setAttribute("src", "../assets/images/win.png")
    document.getElementById("faceDisplay").appendChild(face)
    clearInterval(timeCount)
    let minesSet = document.querySelectorAll(".mineYes")
    minesSet.forEach(element => {
        element.childNodes[0].style.visibility = "visible"
    })
    endGameDisplay("win")
}

// Affichage de la modale selon victoire ou défaite

function endGameDisplay(condition) {
    if (condition == "win") {
        document.getElementById("result").textContent = "Vous avez gagné !"
        document.getElementById("time").textContent = `Vous avez trouvé toutes les mines en ${minutes} min ${seconds} s !`
        document.querySelector("dialog").showModal()
    } else if (condition == "lose") {
        document.getElementById("result").textContent = "Vous avez perdu !"
        document.getElementById("time").textContent = `Vous avez explosé au contact d'une mine !`
        document.querySelector("dialog").showModal()
    }
}

// Cochage automatique d'un paramètre de grille et apparition / disparition des paramètres personnalisés selon besoin

document.querySelector("#easy").checked = true

document.querySelector("#custom").addEventListener("click", () => {
    document.getElementById("customForm").style.display = "flex"
})

let noncustom = document.querySelectorAll(".noncustom")
noncustom.forEach(element => {
    element.addEventListener("click", () => {
        document.getElementById("customForm").style.display = "none"
    })
})

// Attribution des fonctions aux différents boutons

document.getElementById("start").addEventListener("click", () => {
    document.getElementById("rulesDisplay").style.display = "none"
    document.getElementById("gameDisplay").style.display = "block"
    settings()
    gridCreation()
    mineFound = mineNumber
    document.getElementById("minesDisplay").textContent = mineFound
    minesCreation()
    neighbourCheck()
    boardFill()
    timer()
    timeCount = setInterval(timer, 1000)
})

document.getElementById("restart").addEventListener("click", () => {
    document.querySelector("dialog").close()
    gridDisplay.replaceChildren()
    gridCreation()
    mineFound = mineNumber
    goal = 0
    document.getElementById("minesDisplay").textContent = mineFound
    minesCreation()
    neighbourCheck()
    boardFill()
    score = 0
    document.getElementById("faceDisplay").replaceChildren()
    face = document.createElement("img")
    face.setAttribute("src", "../assets/images/smile.png")
    document.getElementById("faceDisplay").appendChild(face)
    clearInterval(timer)
    time = 0
    timer()
    timeCount = setInterval(timer, 1000)
})

document.getElementById("quit").addEventListener("click", () => {
    location.reload()
})