import React, { useEffect, useState } from 'react';
import './App.css'

function App() {
    const [data, setData] = useState([]);

    const [filter, setFilter] = useState([]);

    const [search, setSearch] = useState('');

    const [position, setPosition] = useState(0);

    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const [typeFilter, setTypeFilter] = useState('');
    const page = 8;

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=500");
                const { results } = await response.json();
                const fetchDetails = await Promise.all(
                    results.map(async (pokemon) => {
                        const response = await fetch(pokemon.url);
                        const details = await response.json();
                        return {
                            id: details.id,
                            name: details.name,
                            type: details.type,
                            image: details.sprites.front_default,
                            types: details.types.map((type) => type.type.name),
                            stats: {
                                speed: details.stats.find((stat) => stat.stat.name === "speed").base_stat,
                                specialDefense: details.stats.find((stat) => stat.stat.name === "special-defense").base_stat,
                                specialAttack: details.stats.find((stat) => stat.stat.name === "special-attack").base_stat,
                                defense: details.stats.find((stat) => stat.stat.name === "defense").base_stat,
                                attack: details.stats.find((stat) => stat.stat.name === "attack").base_stat,
                                hp: details.stats.find((stat) => stat.stat.name === "hp").base_stat,
                            },
                        };
                    })
                );
                setData(fetchDetails);
                setFilter(fetchDetails.slice(0, page));
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getData();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearch(term);
        const filtered = data.filter((pokemon) => pokemon.name.toLowerCase().includes(term));
        setFilter(filtered.slice(0, page));
        setPosition(0);
    };

    const handleTypeFilter = (e) => {
        const selectedType = e.target.value.toLowerCase();
        setTypeFilter(selectedType);
        const filtered = data.filter((pokemon) =>
            pokemon.types.map((type) => type.toLowerCase()).includes(selectedType)
        );
        setFilter(filtered.slice(0, page));
        setPosition(0);
    };

    useEffect(() => {
        setFilter(data.slice(position, position + page));
    }, [position, data]);

    const handlePrevious = () => {
        if (position > 0) {
            setPosition((prevPosition) => prevPosition - page);
        }
    };

    const handleNext = () => {
        const nextPosition = position + page;
        if (nextPosition < data.length) {
            setPosition((prevPosition) => prevPosition + page);
        }
    };

    const handleCardClick = (pokemon) => {
        setSelectedPokemon(pokemon);
    };

    const handleCloseModal = () => {
        setSelectedPokemon(null);
    };

    return (
        <div className="container mt-4" style={{marginTop:'-40px'}}>
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search Pokemon..."
                className="form-control mb-3"
                style={{width:'200px',height:'30px',marginLeft:'350px',marginTop:'-1px',position:'absolute'}}
            />
            <input
                type="text"
                value={typeFilter}
                onChange={handleTypeFilter}
                placeholder="Filter by Type..."
                className="form-control mb-3"
                style={{width:'200px',height:'30px',marginLeft:'600px'}}
            />
            {filter.length > 0 && (
                <div className="d-flex flex-row flex-wrap">
                    {filter.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="card m-2"
                            style={{
                                width: '15rem',
                                cursor: 'pointer',
                                backgroundColor: getColorForType(pokemon.types[0]),
                            }}
                            onClick={() => handleCardClick(pokemon)}
                        >
                            <img
                                src={pokemon.image}
                                className="card-img-top"
                                alt={pokemon.name}
                                style={{ height: '100px', width:'130px',objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{pokemon.name}</h5>
                                <p className="card-text">
                                    Speed: {pokemon.stats.speed} <br />
                                    Types: {pokemon.types.join(', ')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="text-center">
                <button onClick={handlePrevious} disabled={position === 0} className="btn btn-secondary mr-2" style={{marginLeft:'-200px',position:'absolute',marginTop:'50px'}}>
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={position + page >= data.length}
                    className="btn btn-secondary"
                    style={{marginLeft:'50px',position:'absolute',marginTop:'50px'}}
                >
                    Next
                </button>
            </div>

            {selectedPokemon && (

                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedPokemon.name}</h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Speed: {selectedPokemon.stats.speed}</p>
                                <p>Special Defense: {selectedPokemon.stats.specialDefense}</p>
                                <p>Special Attack: {selectedPokemon.stats.specialAttack}</p>
                                <p>Defense: {selectedPokemon.stats.defense}</p>
                                <p>Attack: {selectedPokemon.stats.attack}</p>
                                <p>HP: {selectedPokemon.stats.hp}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Close
     </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;


function getColorForType(type) {
    switch (type) {
        case 'grass':
            return '#eb4d4b'; 
        case 'fire':
            return '#eb4d4b'; 
        case 'water':
            return '#e056fd';
        case 'normal':
           return '#4834d4';
     case 'ground':
          return '#6ab04c';
        
        default:
            return '#7ed6df';
    }
}
