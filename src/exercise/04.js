// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'currentStep',
    parseInt(0),
  )
  const [history, setHistory] = useLocalStorageState('history', [])

  function restart() {
    setCurrentSquares(Array(9).fill(null))
    setHistory([])
    setCurrentStep(0)
  }

  function selectSquare(square) {
    if (calculateWinner(currentSquares) || currentSquares[square]) {
      return
    }

    const squaresCopy = [...currentSquares]

    squaresCopy[square] = calculateNextValue(currentSquares)

    setCurrentSquares(squaresCopy)

    const historyCopy = [...history]

    historyCopy[currentStep] = squaresCopy

    setHistory(historyCopy)

    setCurrentStep(currentStep => ++currentStep)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>
          {calculateStatus(
            calculateWinner(currentSquares),
            currentSquares,
            calculateNextValue(currentSquares),
          )}
        </div>
        <ol>
          {history.map((gameState, index) => {
            return (
              <li key={gameState}>
                <button
                  onClick={() => {
                    setCurrentSquares(gameState)
                    setCurrentStep(index + 1)
                  }}
                >
                  {index === 0 ? 'Go to game start' : `Go to move #${index}`}
                  {index === currentStep - 1 ? ' (current)' : ''}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
