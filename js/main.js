
let processes = [];

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

function addProcess() {
  // Obtiene los elementos del formulario directamente por su ID.
  const nameInput = document.getElementById("processName");
  const timeInput = document.getElementById("processTime");
  const priorityInput = document.getElementById("processPriority");

  const name = nameInput.value.trim();
  const time = parseFloat(timeInput.value);
  const priority = parseFloat(priorityInput.value);

  if (name === "" || isNaN(time) || isNaN(priority)) {
    alert("Por favor, ingresa datos válidos para el proceso.");
    return;
  }

  const newProcess = {
    name: name,
    time: time,
    priority: priority,
  };

  processes.push(newProcess);

  nameInput.value = "";
  timeInput.value = "";
  priorityInput.value = "";
  console.log(processes);
  renderTable();
}

function renderTable() {
  const tableBody = document.querySelector("#processTable tbody");
  tableBody.innerHTML = "";

  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.time}</td>
      <td>${p.priority}</td>
      <td>
        <button onclick="deleteProcess(${i})">Eliminar</button>
        <button onclick="openEditModal(${i})">Editar</button>
      </td>
    `;
  }
}

function deleteProcess(index) {
  processes.splice(index, 1);
  renderTable();
}

const form = document.getElementById("addProcessForm");
form.addEventListener("submit", function (event) {
  event.preventDefault(); 
  addProcess();
});

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
  const clearButton = document.getElementById("clearButton");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      processes = [];
      renderTable();
      const output = document.getElementById("resultsOutput");
      if (output) output.innerHTML = "";
    });
  }
});

function openEditModal(index) {
  const modal = document.getElementById("editModal");
  const p = processes[index];
  document.getElementById("editName").value = p.name;
  document.getElementById("editTime").value = p.time;
  document.getElementById("editPriority").value = p.priority;
  document.getElementById("editIndex").value = index;
  modal.style.display = "flex";
}
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}
document.getElementById("closeModal").addEventListener("click", closeEditModal);

document
  .getElementById("editProcessForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById("editIndex").value);
    processes[idx].name = document.getElementById("editName").value;
    processes[idx].time = parseFloat(document.getElementById("editTime").value);
    processes[idx].priority = parseFloat(
      document.getElementById("editPriority").value
    );
    renderTable();
    closeEditModal();
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
  let html = `<h3>Round Robin</h3><table border='1' class='result-table'><tr><th>No.</th><th>Nombre</th><th>Tiempo</th><th>tiempo de ejecucio</th><th>Tiempo Restante</th><th>Prioridad</th><th>Tiempo de Espera</th></tr>`;
  resultado.historial.forEach((r) => {
    html += `<tr><td>${r.ronda}</td><td>${r.nombre}</td><td>${r.tiempoAntes}</td><td>${r.usado}</td><td>${r.tiempoDespues}</td><td>${r.prioridad}</td><td>${r.esperaAcumulada}</td></tr>`;
  });
  html += `</table><p>Promedio espera: <b>${resultado.promedio.toFixed(
    2
  )}</b></p>`;
  output.innerHTML = html;
}

function RR(quantum) {
  let cola = processes.map((p) => ({ ...p }));

  let espera = 0;
  let historial = [];
  let tiempoDeEjecucion;
  let ronda = 1;
  //let esperaAcumulada = 0;

  while (cola.length > 0) {
    tiempoDeEjecucion = Math.min(cola[0].time, quantum);
    cola[0].time -= tiempoDeEjecucion;

    let proceso = {
      ronda: ronda,
      nombre: cola[0].name,
      tiempoAntes: cola[0].time + tiempoDeEjecucion,
      usado: tiempoDeEjecucion,
      tiempoDespues: cola[0].time,
      prioridad: cola[0].priority,
      esperaAcumulada: espera,
    };

    historial.push(proceso);
    espera += tiempoDeEjecucion;

    if (cola[0].time === 0) {
      cola.shift();
    } else {
      cola.push(cola.shift());
    }

    if (cola.length === 1) {
      espera = 0;
    }

    ronda++;
  }

  let sumaEspera = 0;
  let divisor = 0;

  historial.forEach((p, i) => {
    sumaEspera += p.esperaAcumulada;
    if (p.esperaAcumulada > 0 || i === 0) {
      divisor++;
    }
  });

  let promedioEspera = divisor > 0 ? sumaEspera / divisor : 0;

  return { historial, promedio: promedioEspera };
}