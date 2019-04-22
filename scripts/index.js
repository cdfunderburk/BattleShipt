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
    ],
    player2: [
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
      { position: [null, null], placed: false, destroyed: false },
    ],

    activeShip: 0,
    activeCoord: 0,
  }
)

const size = 10
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const setBoard = () => [...Array(size)].map(() => [...Array(size).fill(null)])

let state = gameState()
let ships = shipState()

const updateState = (slice, data) => {
  state = { ...state, [slice]: data }
}

let button = document.getElementById('actionButton')
button.addEventListener('click', () => {
  changePlayer()
})

const changePlayer = () => {
  ships = { ...ships, activeCoord: 0, activeShip: 0 }
  let nextPlayer = state.currentPlayer == "player1" ? 'player2' : "player1"
  updateState('currentPlayer', nextPlayer)
}

const updateUI = (position, className) => {
  square = document.getElementById(position)
  square.classList.add(className)
}

const placeShip = (player, ship, coord, guess) => {
  console.log(player, ship, coord)
  ship_length = ships[player][ship].position.length - 1
  ships[player][ship].position[coord] = guess
  updateUI(guess,'ship')
  ships = coord == ship_length ? { ...ships, activeCoord: 0, activeShip: ship + 1 } : { ...ships, activeCoord: coord + 1 }
}

const isNotTaken = (player, grid) => {
  ships_array = ships[player].map((ship) => (ship.position)).flat()
  return !ships_array.includes(grid)
}

const shipPlaced = (player, ship) => {
  console.log('coordinate ==> ', ships[player][ship].position);
  if (!ships[player][ship].position.includes(null)) {
    ships[player][ship].placed = true
  }
}

const allPlayerShipsPlaced = (player) => {
  placed_array = ships[player].map((ship) => (ship.placed))
  return placed_array.every(val => val == true)
}

const allShipsPlaced = () => {
  placed_array = ships[player].map((ship) => (ship.placed))
  return placed_array.every(val => val == true)
}

const checkGame = (selectedGrid) => {
  let { activeShip, activeCoord } = ships
  let { currentPlayer: player } = state
  if (!state.shipsPlaced) {
    if (isNotTaken(player, selectedGrid)) {
      // console.log("ActiveShip:",activeShip,"ActiveCoord:", activeCoord);
      placeShip(player, activeShip, activeCoord, selectedGrid)
      shipPlaced(player, activeShip)
      allPlayerShipsPlaced(player) ? changePlayer(): null
      allShipsPlaced() ? updateState('shipsPlaced',true): null
    } else {
      console.log('That space is already taken choose another')
    }
    //player places a ship by clicking a square
    //Validations:
    // check if grid is taken
    // if grid is taken display error message
    // if grid is not taken place a marker on the board
    // do this for all ship grid positions for the first play
    //check if all ships have been placed for player
    //check if all ships have been placed for both users
  } else {
    console.log("The Game Begins")
    //player makes a move
    //check if move hits a ship
    //check if move sinks a ship
    //check if all ships are sunk
    //switches player
  }
}

const createSquare = (elem, col, row) => {
  let newSquare = document.createElement('div')
  newSquare.classList.add('square')
  newSquare.setAttribute('id', `${col}${row}`)
  newSquare.addEventListener('click', (e) => (checkGame(e.target.id)))
  elem.appendChild(newSquare)
}

const createRow = (elem, rowId) => {
  let newRow = document.createElement('div')
  newRow.classList.add('row')
  cols.map(col => createSquare(newRow, col, rowId))
  elem.appendChild(newRow)
}

const createBoard = () => {
  let wC = document.getElementById('wc')
  wC.parentNode.removeChild(wC)
  const board = document.getElementById('board')
  // Create Heading Row
  rows.map((row) => createRow(board, row))
}

const pickGameModeButton = (obj, text, mode) => {
  let button = document.createElement('button')
  let buttonTxt = document.createTextNode(text)
  button.appendChild(buttonTxt)
  button.classList.add('button')
  button.setAttribute('id', mode)
  button.addEventListener('click', () => {
    updateState('gameMode', button.id)
    createBoard()
    gameMessage("Set your Ships!")
    console.log(button.id, state)
  })
  obj.appendChild(button)
}

const gameMessage = (message) => {
  let display = document.getElementById('headerStatus')
  display.innerText = message
}

const welcomeScreen = () => {
  const board = document.getElementById('board')
  let welcomeContainer = document.createElement('div')
  welcomeContainer.classList.add('welcome-container')
  welcomeContainer.setAttribute('id', 'wc')
  let welcomeStatement = document.createElement('h1')
  let welcomeText = document.createTextNode('Welcome to BattleShipt')
  let subStatement = document.createElement('p')
  let subText = document.createTextNode('Before we start the game...blah,blah')
  welcomeStatement.appendChild(welcomeText)
  subStatement.appendChild(subText)
  welcomeContainer.appendChild(welcomeStatement)
  welcomeContainer.appendChild(subStatement)
  pickGameModeButton(welcomeContainer, '2 Players', '2P')
  pickGameModeButton(welcomeContainer, 'Vs. Comp', 'C')
  board.appendChild(welcomeContainer)


}

window.addEventListener('DOMContentLoaded', () => {
  welcomeScreen()
  // 
})
