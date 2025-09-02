// Este array guardará todos los procesos. Es como una "base de datos" simple.
let processes = [];

// Unifica la lógica de cálculo para FCFS, SJF y Priority
function calcularPlanificaciones() {
  // FCFS
  let arrayFCFS = [...processes];
  let arrayEsperaFCFS = [0];
  let esperaTotalFCFS = 0;
  for (let i = 0; i < arrayFCFS.length - 1; i++) {
    arrayEsperaFCFS[i + 1] = arrayEsperaFCFS[i] + arrayFCFS[i].time;
    esperaTotalFCFS += arrayEsperaFCFS[i + 1];
  }
  let promedioEsperaFCFS =
    arrayFCFS.length > 0 ? esperaTotalFCFS / arrayFCFS.length : 0;

  // SJF
  let arraySJF = [...processes].sort((a, b) => a.time - b.time);
  let arrayEsperaSJF = [0];
  let esperaTotalSJF = 0;
  for (let i = 0; i < arraySJF.length - 1; i++) {
    arrayEsperaSJF[i + 1] = arrayEsperaSJF[i] + arraySJF[i].time;
    esperaTotalSJF += arrayEsperaSJF[i + 1];
  }
  let promedioEsperaSJF =
    arraySJF.length > 0 ? esperaTotalSJF / arraySJF.length : 0;

  // Priority
  let arrayPriority = [...processes].sort((a, b) => a.priority - b.priority);
  let arrayEsperaPriority = [0];
  let esperaTotalPriority = 0;
  for (let i = 0; i < arrayPriority.length - 1; i++) {
    arrayEsperaPriority[i + 1] = arrayEsperaPriority[i] + arrayPriority[i].time;
    esperaTotalPriority += arrayEsperaPriority[i + 1];
  }
  let promedioEsperaPriority =
    arrayPriority.length > 0 ? esperaTotalPriority / arrayPriority.length : 0;

  return {
    FCFS: {
      procesos: arrayFCFS,
      esperas: arrayEsperaFCFS,
      promedio: promedioEsperaFCFS,
    },
    SJF: {
      procesos: arraySJF,
      esperas: arrayEsperaSJF,
      promedio: promedioEsperaSJF,
    },
    Priority: {
      procesos: arrayPriority,
      esperas: arrayEsperaPriority,
      promedio: promedioEsperaPriority,
    },
  };
}

// Función para añadir un nuevo proceso a la lista.
function addProcess() {
  // Obtiene los elementos del formulario directamente por su ID.
  const nameInput = document.getElementById("processName");
  const timeInput = document.getElementById("processTime");
  const priorityInput = document.getElementById("processPriority");

  const name = nameInput.value.trim();
  const time = parseFloat(timeInput.value);
  const priority = parseFloat(priorityInput.value);

  // Valida que los datos sean correctos.
  if (name === "" || isNaN(time) || isNaN(priority)) {
    alert("Por favor, ingresa datos válidos para el proceso.");
    return;
  }

  // Crea un objeto simple para el nuevo proceso.
  const newProcess = {
    name: name,
    time: time,
    priority: priority,
  };

  // Agrega el proceso al array.
  processes.push(newProcess);

  // Limpia los campos del formulario.
  nameInput.value = "";
  timeInput.value = "";
  priorityInput.value = "";
  console.log(processes);
  // Vuelve a dibujar la tabla para mostrar el nuevo proceso.
  renderTable();
}

// Función para dibujar la tabla en la página.
function renderTable() {
  const tableBody = document.querySelector("#processTable tbody");
  // Borra todo el contenido actual de la tabla.
  tableBody.innerHTML = "";

  // Recorre el array de procesos y crea una fila para cada uno.
  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.time}</td>
      <td>${p.priority}</td>
      <td><button onclick="deleteProcess(${i})">Eliminar</button></td>
    `;
  }
}

// Función para eliminar un proceso por su posición (índice).
function deleteProcess(index) {
  // Elimina un elemento del array en la posición especificada.
  processes.splice(index, 1);
  // Vuelve a dibujar la tabla para que se actualice.
  renderTable();
}

// Escucha el evento 'submit' del formulario para añadir un proceso.
const form = document.getElementById("addProcessForm");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que la página se recargue.
  addProcess();
});

// Listener para calcular FCFS, SJF y Priority juntos
document.addEventListener("DOMContentLoaded", function () {
  renderTable();
  const btnAll = document.getElementById("calculateAllButton");
  if (btnAll) {
    btnAll.addEventListener("click", function () {
      const resultados = calcularPlanificaciones();
      mostrarResultados(resultados);
    });
  }
  const btnRR = document.getElementById("rrButton");
  if (btnRR) {
    btnRR.addEventListener("click", function () {
      const quantumInput = document.getElementById("quantumInput");
      const quantum = parseInt(quantumInput.value);
      if (isNaN(quantum) || quantum <= 0) {
        alert("Por favor, ingrese un quantum válido mayor a 0.");
        return;
      }
      const resultadoRR = RR(quantum);
      mostrarResultadosRR(resultadoRR);
    });
  }
});

// Función para mostrar los resultados de FCFS, SJF y Priority
function mostrarResultados(resultados) {
  const output = document.getElementById("resultsOutput");
  if (!output) return;
  output.innerHTML = "";
  ["FCFS", "SJF", "Priority"].forEach((tipo) => {
    const res = resultados[tipo];
    let html = `<h3>${tipo}</h3><table border='1'><tr><th>Nombre</th><th>Tiempo</th><th>Prioridad</th><th>Espera</th></tr>`;
    res.procesos.forEach((p, i) => {
      html += `<tr><td>${p.name}</td><td>${p.time}</td><td>${p.priority}</td><td>${res.esperas[i]}</td></tr>`;
    });
    html += `</table><p>Promedio espera: <b>${res.promedio.toFixed(2)}</b></p>`;
    output.innerHTML += html;
  });
}

// Función para mostrar el recorrido de RR
function mostrarResultadosRR(resultado) {
  const output = document.getElementById("resultsOutput");
  if (!output) return;
  // Obtener nombres únicos de procesos
  const nombres = processes.map((p) => p.name);
  // Crear estructura de rondas
  let rondas = [];
  let tiempos = processes.map((p) => p.time);
  let terminado = (procesos) => procesos.every((t) => t <= 0);
  let quantumInput = document.getElementById("quantumInput");
  let quantum = quantumInput ? parseInt(quantumInput.value) : 1;
  let tiemposActuales = [...tiempos];
  while (!terminado(tiemposActuales)) {
    let ronda = [];
    for (let i = 0; i < tiemposActuales.length; i++) {
      if (tiemposActuales[i] > 0) {
        let usado = Math.min(quantum, tiemposActuales[i]);
        tiemposActuales[i] -= usado;
        ronda.push(tiemposActuales[i]);
      } else {
        ronda.push(0);
      }
    }
    rondas.push([...ronda]);
  }
  // Construir tabla
  let html = `<h3>Round Robin</h3><table border='1'><tr><th>Ronda</th>`;
  nombres.forEach((n) => {
    html += `<th>${n}</th>`;
  });
  html += `</tr>`;
  rondas.forEach((ronda, idx) => {
    html += `<tr><td>${idx + 1}</td>`;
    ronda.forEach((tiempo) => {
      html += `<td>${tiempo}</td>`;
    });
    html += `</tr>`;
  });
  html += `</table><p>Promedio espera: <b>${resultado.promedio.toFixed(
    2
  )}</b></p>`;
  output.innerHTML = html;
}

// RR se mantiene aparte y se recalcula solo cuando el usuario lo solicita
function RR(quantum) {
  let arrayRR = [];
  let arrayRRaux = [...processes];
  let arrayEspera = [0];
  let esperaTotal = 0;
  let counter = 0;
  while (arrayRRaux.length > 0) {
    // Evita acceder fuera de rango
    if (counter >= arrayRRaux.length) counter = 0;
    arrayRR.push({ ...arrayRRaux[counter] });
    if (arrayRRaux[counter].time <= quantum) {
      arrayEspera[arrayRR.length] =
        arrayRRaux[counter].time + arrayEspera[arrayRR.length - 1];
      esperaTotal += arrayEspera[arrayRR.length];
      arrayRRaux.splice(counter, 1);
      // Si eliminamos, no incrementamos counter
    } else {
      arrayRRaux[counter].time -= quantum;
      arrayEspera[arrayRR.length] = quantum + arrayEspera[arrayRR.length - 1];
      esperaTotal += arrayEspera[arrayRR.length];
      counter++;
    }
  }
  let promedioEspera = arrayRR.length > 0 ? esperaTotal / arrayRR.length : 0;
  return { procesos: arrayRR, esperas: arrayEspera, promedio: promedioEspera };
}
