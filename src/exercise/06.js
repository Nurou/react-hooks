// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: 'idle', pokemon: null})
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: null, pokemon: null})
    setError(null)

    async function fetcher() {
      setState({status: 'pending', pokemon: state.pokemon})
      await fetchPokemon(pokemonName)
        .then(pokemon => {
          setState({status: 'resolved', pokemon})
        })
        .catch(e => {
          setError(e)
          setState({status: 'rejected', pokemon: state.pokemon})
        })
    }

    fetcher()
  }, [pokemonName])

  if (state.status === 'rejected') {
    throw error
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === 'resolved') {
    return <PokemonDataView pokemon={state.pokemon} />
  } else if (state.status === 'idle') {
    return 'Submit a pokemon'
  } else {
    throw new Error(`Unexpected status: ${state.status}`)
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo
            pokemonName={pokemonName}
            onReset={() => {
              setPokemonName('')
            }}
          />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
