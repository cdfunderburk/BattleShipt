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

    gameMode: null,
    currentPlayer: 'player1'
  });
}

const shipState = () => (
  {
    player1: [
      { position: [[null, null], [null, null]], destroyed: false },
      { position: [[null, null], [null, null]], destroyed: false },
      { position: [[null, null], [null, null]], destroyed: false },
    ],
    player2: [
      { position: [[null, null], [null, null]], destroyed: false },
      { position: [[null, null], [null, null]], destroyed: false },
      { position: [[null, null], [null, null]], destroyed: false },
    ],
  }
)

const size = 10
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const setBoard = () => [...Array(size)].map(() => [...Array(size).fill(null)])


// const makePlay = (state, row, column, player) => {
//   board = state[player].gameBoard
//   if (!board[row][column]) {
//     // console.log("Miss!")
//     updatedBoard = [...board]
//     updatedBoard[row][column] = "M"
//     return state = { ...state, [player]: { gameBoard: updatedBoard } }
//   } else if (board[row][column] == "M") {
//     console.log("You have already picked this square")
//   } else if (board[row][column] == "H") {
//     console.log("You have already picked this square")
//   }
// }

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
  let heading = document.getElementById('headerStatus')
  let nextPlayer = state.currentPlayer == "player1" ? 'player2' : "player1"
  heading.innerText = nextPlayer
  updateState('currentPlayer', nextPlayer)
}

// const placeShips = (ships, player, position) => {
//   if (ships[player]) {
//     ships[player].map(ship => (ship.position.map((item) => {
//       if (item.includes(null)) {
//         shipGridSetter(item)
//       }
//     })))
//   }
// }

// const shipGridSetter = (item) => {
//   console.log(item)
// }

// placeShips(ships, 'player1')

const createSquare = (elem, col, row) => {
  let newSquare = document.createElement('div')
  newSquare.classList.add('square')
  newSquare.setAttribute('id', `${col}${row}`)
  newSquare.addEventListener('click', (e) => (console.log(e.target.id,state)))
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
    console.log(button.id, state)
  })
  obj.appendChild(button)
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
