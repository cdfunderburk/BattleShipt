// Game setup
const playerList = ['player1', 'player2']
const size = 10
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

const setBoard = () => {
  obj = {}
  for (let column of cols) {
    obj[column] = [...Array(size).fill(null)]
  }
  return obj
}


//State Management
const gameState = () => {
  return ({
    player1: {
      name: null,
      gameBoard: setBoard()
    },
    player2: {
      name: null,
      gameBoard: setBoard()
    },
    shipsPlaced: false,
    gameMode: null,
    currentPlayer: 'player1'
  });
}

const shipState = () => (
  {
    player1: [
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
    ],
    player2: [
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
    ],
    activeShip: 0,
    activeCoord: 0,
  }
)

let state = gameState()
let ships = shipState()

const updateState = (slice, data) => {
  state = { ...state, [slice]: data }
}

const setState = (newState) => {
  state = { ...newState }
}


// Player Management
const changePlayer = () => {
  ships = { ...ships, activeCoord: 0, activeShip: 0 }
  let nextPlayer = state.currentPlayer == "player1" ? 'player2' : "player1"
  updateState('currentPlayer', nextPlayer)
}

const inversePlayer = (player) => {
  return player == 'player1' ? 'player2' : 'player1'
}


// UI Management
const updateUI = (position, className) => {
  square = document.getElementById(position)
  square.classList.add(className)
}

const replaceBoard = (player) => {
  let board = document.getElementById(player)
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
  rows.map((row) => createRow(board, row, player))
}

const createSquare = (elem, col, row, player) => {
  let newSquare = createDomElem('div', '', 'square', `${player}-${col}${row}`)
  newSquare.addEventListener('click', (e) => (checkGame(e.target.id, row, col, player)))
  elem.appendChild(newSquare)
}

const createRow = (elem, rowId, player) => {
  let newRow = createDomElem('div', '', 'row')
  cols.map(col => createSquare(newRow, col, rowId, player))
  elem.appendChild(newRow)
}

const createBoard = () => {
  let wC = document.getElementById('wc')
  wC.parentNode.removeChild(wC)
  for (let player of playerList) {
    const board = document.getElementById(player)
    rows.map((row) => createRow(board, row, player))
  }
}

const pickGameModeButton = (obj, text, mode) => {
  let button = createDomElem('button', text, 'button', mode)
  button.addEventListener('click', () => {
    updateState('gameMode', button.id)
    createBoard()
    gameMessage("Set your Ships!")
  })
  obj.appendChild(button)
}

const gameMessage = (message) => {
  let display = document.getElementById('headerStatus')
  display.innerText = message
  setTimeout(() => {
    if (state.shipsPlaced == true) {
      display.innerText = 'Click square to make your move'
    } else {
      display.innerText = 'Click square to place ship'
    }
  }, 2000)
}

const welcomeScreen = () => {
  const board = document.getElementById('player1')
  welcomeContainer = createDomElem('div', '', 'welcome-container', 'wc')
  welcomeStatement = createDomElem('h1', 'Welcome to BattleShipt')
  subStatement = createDomElem('p', 'Please select a play mode')
  welcomeContainer.appendChild(welcomeStatement)
  welcomeContainer.appendChild(subStatement)
  pickGameModeButton(welcomeContainer, '2 Players', '2P')
  pickGameModeButton(welcomeContainer, 'Vs. Comp', 'C')
  board.appendChild(welcomeContainer)
}

const createDomElem = (type, text, className = null, id = null) => {
  let elem = document.createElement(type)
  let elemTxt = document.createTextNode(text)
  elem.appendChild(elemTxt)
  elem.classList.add(className)
  elem.setAttribute('id', id)
  return elem
}

window.addEventListener('DOMContentLoaded', () => {
  welcomeScreen()
})


// Ship Management
const linearShip = (player, row, col) => {
  console.log('row =>', row, 'col =>', col);
  colArray = []
  rowArray = []
  colIndex = cols.findIndex(item => item == col)
  console.log(colIndex);
  range = [-1, 0, 1]
  for (let i of range) {
    colArray.push(`${player}-${col}${row + i}`)
    rowArray.push(`${player}-${cols[colIndex + i]}${row}`)
  }
  return [...colArray, ...rowArray]
}

const placeShip = (player, ship, coord, grid, row = null, col = null) => {
  ship_length = ships[player][ship].position.length - 1
  if (coord == 0) {
    available = linearShip(player, row, col);
    console.log('aval =>', available)
  }
  if (available.includes(grid)) {
    ships[player][ship].position[coord] = grid
    ships = coord == ship_length ? { ...ships, activeCoord: 0, activeShip: ship + 1 } : { ...ships, activeCoord: coord + 1 }
    updateUI(grid, 'ship')
  } else {
    gameMessage("Ship pieces must be placed in a line and together")

  }
}

const isNotTaken = (player, grid) => {
  shipsArray = ships[player].map((ship) => (ship.position)).flat()
  return !shipsArray.includes(grid)
}

const shipPlaced = (player, ship) => {
  if (!ships[player][ship].position.includes(null)) {
    ships[player][ship].placed = true
  }
}

const allPlayerShipsPlaced = (player) => {
  placedArray = ships[player].map((ship) => (ship.placed))
  return placedArray.every(val => val == true)
}

const allShipsPlaced = () => {
  boardReady = []
  for (let player of playerList) {
    placedArray = ships[player].map((ship) => (ship.placed))
    eval = placedArray.every(val => val == true)
    boardReady.push(eval)
  }
  finalEval = boardReady.every(val => val == true)
  return finalEval
}

const checkHit = (grid, player) => {
  shipsArray = ships[player].map((ship) => (ship.position.findIndex((coord) => (coord == grid)))).flat()
  hitShipIndex = shipsArray.findIndex(ind => (ind == 0 || ind == 1))
  hitShipCoord = shipsArray[hitShipIndex]
  recieverLabel = player == 'player1' ? "Player 1" : "Player 2"
  playerLabel = state.gameMode == 'C' ? player == 'player1' ? "Computer" : "You" : "You"
  if (hitShipIndex != -1) {
    ships[player][hitShipIndex].position[hitShipCoord] = "HIT"
    updateUI(grid, 'hit')
    console.log("Hit");
    gameMessage(`${playerLabel} hit ${recieverLabel}'s ship!`)
  } else {
    updateUI(grid, 'miss')
    console.log("Miss");
    gameMessage(`${playerLabel} missed ${recieverLabel}'s ship!`)
  }
}

const checkSink = (player) => {
  recieverLabel = player == 'player1' ? "Player 1" : "Player 2"
  shipsArray = ships[player].map((ship) => {
    if (ship.position.every(val => val == "HIT") && ship.destroyed == false) {
      ship.destroyed = true
      gameMessage(`${recieverLabel}'s ship was destroyed!`)
    }
  })
}


// Game Management
const checkGame = (selectedGrid, row, column, boardPlayer) => {
  let { activeShip, activeCoord } = ships
  let { currentPlayer: player } = state

  if (!state.shipsPlaced) {
    if (boardPlayer != player) {
      gameMessage("You can't place a ship on your opponent's board")
    } else if (isNotTaken(player, selectedGrid)) {
      // if grid is not taken place a marker on the board
      placeShip(player, activeShip, activeCoord, selectedGrid, row, column)
      // Check all ship grid positions to see if the ship is placed 
      shipPlaced(player, activeShip)
      //Check if all ships have been placed for player
      if (allPlayerShipsPlaced(player)) {
        changePlayer()
        setTimeout(() => (replaceBoard(player)), 500)
        if (state.gameMode == 'C') {
          computerShips()
          replaceBoard('player2')
          changePlayer()
        }
      }
      //Check if all ships have been placed for both users
      if (allShipsPlaced()) {
        updateState('shipsPlaced', true)
        gameMessage("All Ships have been placed! Ready for battle!")
      }
    } else {
      // If grid is taken display error message
      gameMessage('That space is already taken choose another')
    }
  } else {
    player = inversePlayer(player)
    if (boardPlayer != player) {
      gameMessage("You can't place a move on your own board")
    } else if (state[player].gameBoard[column][row - 1] == "X") {
      gameMessage("Already Played! Choose Another Space")
    } else {
      //flip the player because while the current player might be 'player1' the move is being compared to 'player2''s grid/ships
      //player makes a move
      makeMove(player, row, column)
      //check if move hits a ship
      checkHit(selectedGrid, player)
      //check if move sinks a ship
      checkSink(player)
      //check if all ships are sunk
      if (checkDefeat(player)) {
        gameMessage("Game Over")
      }
      if (state.gameMode == 'C') {
        setTimeout(() => {
          player = inversePlayer(player)
          rowC = randomNumber(1, 10)
          columnC = randomNumber(0, 9)
          columnValue = cols[columnC]
          position = `${player}-${columnValue}${rowC}`
          makeMove(player, rowC + 1, columnValue)
          //check if move hits a ship
          checkHit(position, player)
          //check if move sinks a ship
          checkSink(player)
          //check if all ships are sunk
          if (checkDefeat(player)) {
            gameMessage("Game Over")
          }
          console.log('---------------------------------');
        }, 500)
      } else {
        changePlayer()
      }
    }
  }
}

const makeMove = (player, row, col) => {
  tempState = { ...state }
  tempState[player].gameBoard[col][row - 1] = "X"
  setState(tempState)
}

const checkDefeat = (player) => {
  sunkArray = ships[player].map((ship) => (ship.destroyed))
  return sunkArray.every(val => val == true)
}


// Computer Ships Management
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * max) + min;
}

const computerShips = () => {
  shipcount = ships.player2.map((shipObject) => (shipObject.position)).flat().length
  for (i = 0; i < shipcount; i++) {
    let { activeShip: ship, activeCoord: coord } = ships
    if (coord != 0) {
      let removeGridOriginal = (array) => array.filter((v) => v !== positionName)
      available = removeGridOriginal(available)
      index = randomNumber(0, 3)
      positionName = available[index]
      row = null
      columnValue = null
    } else {
      row = randomNumber(2, 8)
      column = randomNumber(2, 8)
      columnValue = cols[column]
      positionName = `player2-${columnValue}${row}`
    }
    placeShip('player2', ship, coord, positionName, row, columnValue)
    shipPlaced('player2', ship)
  }
}



