import { useEffect, useRef, useState } from "react"

export const App = () => {
  const url = 'https://api.openweathermap.org/data/2.5/weather'
  const API_KEY = '357f3c3c98c6b7365bbf4282f510f0eb'
  const [ciudad, setCiudad] = useState('')
  const [dataClima, setDataClima] = useState(null)
  const [muestraData, setMuestraData] = useState('hidden')
  const [muestraError, setMuestraError] = useState('hidden')
  const difKelvin = 273.15

  const focusRef = useRef()

  const handleCiudad = (e) => {
    setCiudad(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(ciudad.length > 0) {
      setMuestraError('hidden')
      fetchClima()
      setCiudad('')
    }
  }

  const fetchClima = async() => {
    try{
      const city = formateaInput(ciudad)
      setCiudad(city)
      const response = await fetch(`${url}?q=${city}&appid=${API_KEY}&lang=es`)
      if (!response.ok) {
        setMuestraData('hidden')
        setMuestraError('')
        throw new Error(`No se obtuvo información: ${response.statusText}`)
      }
      
      const data = await response.json()
      setDataClima(data)
      setMuestraData('')
    }catch(error){
      console.error('Ocurrió el siguiente problema: ', error)
    }
  }

  useEffect(() => {
    focusRef.current.focus()
  },[])

  function formateaInput(str) {
    const sinEspacios = str.trim();
    const sinTildes = sinEspacios.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return sinTildes
  }

  return (
    <>
      <div className="flex flex-col items-center font-montserrat">
        <h1 className="mt-4 text-xl font-bold">Consulta el clima de una ciudad</h1>
        <a className="p-2 mb-2 font-semibold" href="https://openweathermap.org/">Desarrollado por: David D.</a>
        <form onSubmit={handleSubmit} className="flex flex-row shadow-slate-600 shadow-2xl rounded-full">
          <input 
            className="font-semibold shadow-xl rounded-l-full h-14 sm:w-72 w-52 border-gray-300 focus:outline-none focus:border-indigo-500 py-2 px-6"
            ref={focusRef}
            type="text"
            placeholder="Ciudad..."
            value={ciudad}
            onChange={handleCiudad}/>
          <button 
            className="sm:px-7 font-semibold sm:w-32 w-24 shadow-xl flex flex-row items-center p-4 bg-blue-200 rounded-r-full rounded-l-3xl hover:bg-blue-300 transition-colors active:text-white"
            type="submit">
            <svg className="sm:w-4 -ml-2" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
              <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"/>
            </svg>
            <span className="ml-2">Buscar</span>
          </button>
        </form>
        {
          dataClima ? (
            <div className={`mt-6 ${muestraData} w-full flex flex-col items-center`}>
              <div className="justify-start">
                <h2><strong className="text-lg">Ciudad:</strong> <strong>{dataClima.name}</strong></h2>
                <p><strong className="text-lg">Temperatura:</strong> <strong>{parseInt(dataClima?.main?.temp - difKelvin)}°C</strong></p>
                <p><strong className="text-lg">Sensación térmica:</strong> <strong>{parseInt(dataClima?.main?.feels_like - difKelvin)}°C</strong></p>
                <p><strong className="text-lg">Viento:</strong> <strong>{dataClima.wind.speed}m/s</strong></p>
                <p><strong className="text-lg">Humedad:</strong> <strong>{dataClima.main.humidity}%</strong></p>
                <p><strong className="text-lg">Meteorología:</strong> <strong>{dataClima?.weather[0]?.description}</strong></p>
              </div>
              <img src={`https://openweathermap.org/img/wn/${dataClima?.weather[0]?.icon}@2x.png`} />
            </div>
          ):<div></div>
        }
        <div className={`${muestraError} mt-4`}>
          <p className="text-red-900 font-bold">La ciudad ingresada no existe 😕</p>
        </div>
      </div>
    </>
  )
}