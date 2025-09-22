'use client'

import { useState } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '*':
        return firstValue * secondValue
      case '/':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const Button = ({ onClick, className = '', children }: any) => (
    <button
      onClick={onClick}
      className={`
        h-14 rounded-lg font-semibold text-lg
        transition-all active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  )

  return (
    <div className="h-full w-full bg-gray-950 p-4">
      <div className="max-w-xs mx-auto">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="text-right text-3xl font-mono text-white">
              {display}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Button
              onClick={clear}
              className="col-span-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Clear
            </Button>
            <Button
              onClick={() => performOperation('/')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              ÷
            </Button>
            <Button
              onClick={() => performOperation('*')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              ×
            </Button>

            <Button
              onClick={() => inputNumber('7')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              7
            </Button>
            <Button
              onClick={() => inputNumber('8')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              8
            </Button>
            <Button
              onClick={() => inputNumber('9')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              9
            </Button>
            <Button
              onClick={() => performOperation('-')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              -
            </Button>

            <Button
              onClick={() => inputNumber('4')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              4
            </Button>
            <Button
              onClick={() => inputNumber('5')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              5
            </Button>
            <Button
              onClick={() => inputNumber('6')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              6
            </Button>
            <Button
              onClick={() => performOperation('+')}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              +
            </Button>

            <Button
              onClick={() => inputNumber('1')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              1
            </Button>
            <Button
              onClick={() => inputNumber('2')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              2
            </Button>
            <Button
              onClick={() => inputNumber('3')}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              3
            </Button>
            <Button
              onClick={() => performOperation('=')}
              className="row-span-2 bg-pink-600 hover:bg-pink-700 text-white"
            >
              =
            </Button>

            <Button
              onClick={() => inputNumber('0')}
              className="col-span-2 bg-gray-800 hover:bg-gray-700 text-white"
            >
              0
            </Button>
            <Button
              onClick={inputDecimal}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              .
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}