let gridWidthSetting = document.querySelector("#gridWidth")
let gridHeightSetting = document.querySelector("#gridHeight")
let mineNumberSetting = document.querySelector("#mineNumber")
let gridDisplay = document.querySelector("#gridDisplay")

let goodChoiceAudio = new Audio(src = "../assets/sounds/goodchoice.mp3")
let winAudio = new Audio(src = "../assets/sounds/win.mp3")
let explosionAudio = new Audio(src = "../assets/sounds/explosion.mp3")

let gridWidth = 0
let gridHeight = 0
let gridSize = 0
let gridCell = 0
let mineNumber = 0
let ratio = 0
let time = 0
let score = 0
let goal = 0
let timeCount
let selectedSquare
let face

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
                document.getElementById(`square${i}`).classList.add("mineYes")
                document.getElementById(`square${i}`).appendChild(mineImage)
                mineNumberCreation--
            }
        }
    }
}

function neighbourCheck() {
    let neighbourMines = 0
    for (let i = 0; i < gridSize; i++) {
        if (i % gridWidth == 0 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = 1 - gridWidth; j <= 1 + gridWidth; j = j + gridWidth) {
                if (document.getElementById(`square${i + j}`) != null && document.getElementById(`square${i + j}`).childNodes.length == 1) {
                    neighbourMines++
                }
            }
            if (document.getElementById(`square${i - gridWidth}`) != null && document.getElementById(`square${i - 9}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + gridWidth}`) != null && document.getElementById(`square${i + 9}`).childNodes.length == 1) {
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
            if (document.getElementById(`square${i - gridWidth}`) != null && document.getElementById(`square${i - 9}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + gridWidth}`) != null && document.getElementById(`square${i + 9}`).childNodes.length == 1) {
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
        if (score == goal) {
            endGameWin()
        }
    }
}

function flagSet(index) {
    console.log("Drapeau posé !");
    mineNumber--
    document.getElementById("minesDisplay").textContent = mineNumber
    // selectedSquare = document.getElementById(`square${index}`)
    // let flagsquare = document.createElement("div")
    // flagsquare.classList.add("flag")
    // let flagImage = document.createElement("img")
    // flagImage.setAttribute("src", "../assets/images/flag.png")
    // flagsquare.appendChild(flagImage)
    // selectedSquare.appendChild(flagsquare)
}

function timer() {
    let minutes = parseInt(time / 60)
    let seconds = parseInt(time % 60)
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    document.getElementById("timerDisplay").textContent = `${minutes}:${seconds}`
    time++
}

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
}

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
}

document.querySelector("#easy").checked = true

document.querySelector("#custom").addEventListener("click", () => {
    document.getElementById("customForm").style.display = "flex"
})

document.querySelector("#easy").addEventListener("click", () => {
    document.getElementById("customForm").style.display = "none"
})

document.querySelector("#medium").addEventListener("click", () => {
    document.getElementById("customForm").style.display = "none"
})

document.querySelector("#hard").addEventListener("click", () => {
    document.getElementById("customForm").style.display = "none"
})

document.getElementById("start").addEventListener("click", () => {
    document.getElementById("rulesDisplay").style.display = "none"
    document.getElementById("gameDisplay").style.display = "block"
    settings()
    gridCreation()
    document.getElementById("minesDisplay").textContent = mineNumber
    minesCreation()
    neighbourCheck()
    boardFill()
    timer()
    timeCount = setInterval(timer, 1000)
})

