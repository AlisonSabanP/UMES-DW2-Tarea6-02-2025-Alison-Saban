import { useReducer, useEffect } from 'react';
import './App.css';

const estadoInicial = {
  segundos: 0,
  minutos: 0,
  vueltas: [],
  parado: false,
};

function miReducer(estado, accion) {
  if (accion.tipo === 'INCREMENTAR') {
    let nuevosSegundos = estado.segundos + 1;
    let nuevosMinutos = estado.minutos;

    if (nuevosSegundos === 60) {
      nuevosSegundos = 0;
      nuevosMinutos = nuevosMinutos + 1;
    }

    return {
      ...estado,
      segundos: nuevosSegundos,
      minutos: nuevosMinutos,
    };
  }

  if (accion.tipo === 'GUARDAR_VUELTA') {
    const tiempo = estado.minutos.toString().padStart(2, '0') + ':' + estado.segundos.toString().padStart(2, '0');
    const nuevaVuelta = {
      id: estado.vueltas.length + 1,
      tiempo: tiempo,
    };
    return {
      ...estado,
      vueltas: [...estado.vueltas, nuevaVuelta],
    };
  }

  if (accion.tipo === 'DETENER') {
    return {
      ...estado,
      segundos: 0,
      minutos: 0,
      parado: true,
    };
  }

  return estado;
}

export default function App() {
  const [estado, dispatch] = useReducer(miReducer, estadoInicial);

  useEffect(() => {
    if (estado.parado) return;

    const id = setInterval(() => {
      dispatch({ tipo: 'INCREMENTAR' });
    }, 1000);

    return () => clearInterval(id);
  }, [estado.parado]);

  const tiempo = estado.minutos.toString().padStart(2, '0') + ':' + estado.segundos.toString().padStart(2, '0');

  return (
    <>
      <div className="card w-96 shadow-sm">
        <div className="flex justify-center items-center p-4">
          <h1>{tiempo}</h1>
        </div>
        <div className="card-body">
          <div className="flex flex-row justify-between">
            <button
              className="btn bg-green-500"
              onClick={() => dispatch({ tipo: 'GUARDAR_VUELTA' })}
            >
              LAP
            </button>
            <button
              className="btn bg-red-500"
              onClick={() => dispatch({ tipo: 'DETENER' })}
            >
              STOP
            </button>
          </div>
        </div>
        <div className="gap-2 p-4">
          {estado.vueltas.map((v) => (
            <div key={v.id} className="mt-2 bg-gray-300 rounded-lg flex justify-between p-4">
              <p>{v.id}</p>
              <p>{v.tiempo}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
