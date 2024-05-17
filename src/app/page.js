'use client'

import { React, useState, useEffect } from 'react'
import Link from 'next/link'

const typeColors = {
  fire: 'bg-orange-500',
  grass: 'bg-green-500',
  dark: 'bg-yellow-900',
  water: 'bg-blue-500',
  bug: 'bg-yellow-600',
  flying: 'bg-red-500',
  poison: 'bg-purple-600',
  normal: 'bg-yellow-300',
  fairy: 'bg-pink-400',
  ground: 'bg-neutral-600',
  electric: 'bg-red-400',
  fighting: 'bg-red-800'
} 

const HomePage = () => {
  const [pokemons, setPokemons] = useState([]) 
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    const fetchPokemons = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_POKEMON_API_URL}?limit=60&offset=0`)
      const data = await res.json()

      const detailedPokemons = await Promise.all(data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url)
        const details = await res.json()
        return {
          name: pokemon.name,
          image: details.sprites.front_default,
          id: details.id,
          types: details.types.map(typeInfo => typeInfo.type.name),
        }
      })) 

      setPokemons(detailedPokemons)
    } 

    fetchPokemons() 
  }, []) 

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <div className="container mx-auto lg:p-[60px] md:p-[40px] sm:p-[30px] p-[20px]">
      <div className="flex justify-end items-center mb-8">
        <div className="relative">
          <input 
            className="rounded-lg px-3 py-2 w-[300px] border border-[#d67eff] pr-10" 
            placeholder="Search pokemon"
            value={searchInput}
            onChange={(e)=>setSearchInput(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            className="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
            />
          </svg>
        </div>
      </div>
      <h1 className="lg:text-4xl text-xl font-bold mb-8 text-center">Pokemon App</h1>
      <div className="lg:mt-24 mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPokemons.map((pokemon) => (
          <Link key={pokemon.id} href={`/detail/${pokemon.id}`}>
            <div className="border border-[#d67eff] shadow-md hover:shadow-lg transition flex flex-col">
              <div className="flex justify-center items-center mb-4">
                <img src={pokemon.image} alt={pokemon.name} className="w-20 h-20" />
              </div>
              <h3 className="text-lg font-semibold capitalize p-4">{pokemon.name}</h3>
              <div className="bg-[#d67eff] flex flex-row gap-2 justify-center p-1">
                {pokemon.types.map((type) => (
                  <span key={type} className={`text-neutral-200 text-sm px-3 py-0 rounded-xl ${typeColors[type]}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HomePage