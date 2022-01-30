// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
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

  return (
    <>
      {state.status === 'rejected' ? (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      ) : state.status === 'resolved' ? (
        <PokemonDataView pokemon={state.pokemon} />
      ) : state.status === 'pending' ? (
        <PokemonInfoFallback name={pokemonName} />
      ) : (
        'Submit a pokemon'
      )}
    </>
  )
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
