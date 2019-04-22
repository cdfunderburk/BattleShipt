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

const playerList = ['player1','player2']
const size = 10
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const setBoard = () => [...Array(size)].map(() => [...Array(size).fill(null)])

let state = gameState()
let ships = shipState()

const updateState = (slice, data) => {
  state = { ...state, [slice]: data }
}

// let button = document.getElementById('actionButton')
// button.addEventListener('click', () => {
//   changePlayer()
// })

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
  shipsArray = ships[player].map((ship) => (ship.position)).flat()
  return !shipsArray.includes(grid)
}

const shipPlaced = (player, ship) => {
  console.log('coordinate ==> ', ships[player][ship].position);
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
  finalEval =  boardReady.every(val => val == true)
  return finalEval
}

const checkGame = (selectedGrid, row, column) => {
  console.log(selectedGrid);
  let { activeShip, activeCoord } = ships
  let { currentPlayer: player } = state
  if (!state.shipsPlaced) {
    // check if grid is taken
    if (isNotTaken(player, selectedGrid)) {
      // if grid is not taken place a marker on the board
      placeShip(player, activeShip, activeCoord, selectedGrid)
      // Check all ship grid positions to see if the ship is placed 
      shipPlaced(player, activeShip)
      //Check if all ships have been placed for player
      if (allPlayerShipsPlaced(player)){
        changePlayer()
        replaceBoard(player)
      }
      //Check if all ships have been placed for both users
      allShipsPlaced() ? updateState('shipsPlaced',true): null
    } else {
      // If grid is taken display error message
      console.log('That space is already taken choose another')
    }
  } else {
    console.log("The Game Begins")
    //player makes a move
    makeMove(player,row,column)
    //check if move hits a ship
    checkHit()
    //check if move sinks a ship
    checkSink()
    //check if all ships are sunk
    checkDefeat()
    //switches player

  }
}

const makeMove = (player,row,col) => {
  console.log(player,row,col);
  console.log("Move");

}

const checkHit = () => {
  console.log("Hit");
}

const checkSink = () => {
  console.log("Sink");
}

const checkDefeat = () => {
  console.log("Defeat");
}

const replaceBoard = (player) => {
  let board = document.getElementById(player)
  while (board.firstChild) {
      board.removeChild(board.firstChild);
  }
  rows.map((row) => createRow(board, row, player))
}

const createSquare = (elem, col, row, player) => {
  let newSquare = document.createElement('div')
  newSquare.classList.add('square')
  newSquare.setAttribute('id', `${player}-${col}${row}`)
  newSquare.addEventListener('click', (e) => (checkGame(e.target.id, row, col)))
  elem.appendChild(newSquare)
}

const createRow = (elem, rowId, player) => {
  let newRow = document.createElement('div')
  newRow.classList.add('row')
  cols.map(col => createSquare(newRow, col, rowId, player))
  elem.appendChild(newRow)
}

const createBoard = () => {
  let wC = document.getElementById('wc')
  wC.parentNode.removeChild(wC)
  for (let player of playerList) {
    console.log(player);
    const board = document.getElementById(player)
    rows.map((row) => createRow(board, row, player))
  }
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
  const board = document.getElementById('player1')
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
