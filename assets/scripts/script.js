let rulesDisplay = document.querySelector("#rulesDisplay")
let gridDisplay = document.querySelector("#gridDisplay")

function gridCreation() {
    let square
    for (let i = 0; i < 81; i++) {
        square = document.createElement("button")
        square.setAttribute("id", `square${i}`)
        square.addEventListener("click", () => {
            squareReveal(i)
        })
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
    let minesCreationCounter = 10
    let mineImage
    while (minesCreationCounter > 0) {
        for (let i = 0; i < 81; i++) {
            random = Math.floor(Math.random() * 100)
            if (random <= 9 && document.getElementById(`square${i}`).childNodes.length == 0 && minesCreationCounter > 0) {
                mineImage = document.createElement("img")
                mineImage.setAttribute("src", "../assets/images/mine.png")
                document.getElementById(`square${i}`).appendChild(mineImage)
                minesCreationCounter--
            }
        }
    }
}

function neighbourCheck() {
    let neighbourMines = 0
    for (let i = 0; i < 81; i++) {
        if (i % 9 == 0 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = -8; j <= 10; j = j + 9) {
                if (document.getElementById(`square${i + j}`) != null && document.getElementById(`square${i + j}`).childNodes.length == 1) {
                    neighbourMines++
                }
            }
            if (document.getElementById(`square${i - 9}`) != null && document.getElementById(`square${i - 9}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + 9}`) != null && document.getElementById(`square${i + 9}`).childNodes.length == 1) {
                neighbourMines++
            }
            document.getElementById(`square${i}`).classList.add(`mines${neighbourMines}`)
            neighbourMines = 0
        } else if (i % 9 == 8 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = -10; j <= 8; j = j + 9) {
                if (document.getElementById(`square${i + j}`) != null && document.getElementById(`square${i + j}`).childNodes.length == 1) {
                    neighbourMines++
                }
            }
            if (document.getElementById(`square${i - 9}`) != null && document.getElementById(`square${i - 9}`).childNodes.length == 1) {
                neighbourMines++
            }
            if (document.getElementById(`square${i + 9}`) != null && document.getElementById(`square${i + 9}`).childNodes.length == 1) {
                neighbourMines++
            }
            document.getElementById(`square${i}`).classList.add(`mines${neighbourMines}`)
            neighbourMines = 0
        } else if (i % 9 != 0 && i % 9 != 8 && document.getElementById(`square${i}`).childNodes.length == 0) {
            for (let j = 8; j <= 10; j++) {
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
    console.log(index);
    if (index % 9 == 0) {
        if (document.getElementById(`square${index + 1}`) != null) {
            document.getElementById(`square${index + 1}`).click()
        }
        if (document.getElementById(`square${index - 9}`) != null) {
            document.getElementById(`square${index - 9}`).click()
        }
        if (document.getElementById(`square${index + 9}`) != null) {
            document.getElementById(`square${index + 9}`).click()
        }
    } else if (index % 9 == 8) {
        if (document.getElementById(`square${index - 1}`) != null) {
            document.getElementById(`square${index - 1}`).click()
        }
        if (document.getElementById(`square${index - 9}`) != null) {
            document.getElementById(`square${index - 9}`).click()
        }
        if (document.getElementById(`square${index + 9}`) != null) {
            document.getElementById(`square${index + 9}`).click()
        }
    } else {
        if (document.getElementById(`square${index - 9}`) != null) {
            document.getElementById(`square${index - 9}`).click()
        }
        if (document.getElementById(`square${index + 9}`) != null) {
            document.getElementById(`square${index + 9}`).click()
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
    let selectedSquare = document.getElementById(`square${index}`)
    selectedSquare.style.backgroundColor = "lightgrey"
    selectedSquare.childNodes[0].style.visibility = "visible"
    console.log(index);

    if (selectedSquare.childNodes[0].textContent == "") {
        emptyCheck(index)
    }
}

function flagSet(index) {
    console.log("Drapeau posé !");
    let flagSquare = document.getElementById(`square${index}`)
}

gridCreation()
minesCreation()
neighbourCheck()
boardFill()