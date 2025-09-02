// Módulo para gestionar el estado de la aplicación (la lista de procesos)
const ProcessStore = {
    processes: [],

    getProcesses: function() {
        return this.processes;
    },

    addProcess: function(process) {
        this.processes.push(process);
    },

    deleteProcess: function(index) {
        if (index >= 0 && index < this.processes.length) {
            this.processes.splice(index, 1);
        }
    }
};

// Módulo para gestionar la interfaz de usuario (DOM)
const UIManager = {
    elements: {
        nameInput: document.getElementById('processName'),
        timeInput: document.getElementById('processTime'),
        priorityInput: document.getElementById('processPriority'),
        form: document.getElementById('addProcessForm'), // Changed from addButton
        tableBody: document.querySelector('#processTable tbody')
    },

    getInputs: function() {
        const name = this.elements.nameInput.value;
        const time = this.elements.timeInput.value;
        const priority = this.elements.priorityInput.value;
        return { name, time, priority };
    },

    clearInputs: function() {
        this.elements.nameInput.value = '';
        this.elements.timeInput.value = '';
        this.elements.priorityInput.value = '';
    },

    renderTable: function(processes) {
        this.elements.tableBody.innerHTML = ''; // Limpiar la tabla
        processes.forEach((process, index) => {
            const row = this.elements.tableBody.insertRow();
            row.innerHTML = `
                <td>${process[0]}</td>
                <td>${process[1]}</td>
                <td>${process[2]}</td>
                <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
            `;
        });
    }
};

// Módulo principal que orquesta la aplicación
const App = {
    init: function() {
        console.log("Planificador de procesos inicializado.");
        this.addEventListeners();
    },

    addEventListeners: function() {
        // Listen for form submission instead of button click
        UIManager.elements.form.addEventListener('submit', this.handleAddProcess.bind(this));
        UIManager.elements.tableBody.addEventListener('click', this.handleDeleteProcess.bind(this));
    },

    handleAddProcess: function(event) {
        event.preventDefault(); // Prevent page reload
        const { name, time, priority } = UIManager.getInputs();

        if (name && time && priority) {
            const newProcess = [name, parseInt(time), parseInt(priority)];
            ProcessStore.addProcess(newProcess);
            UIManager.renderTable(ProcessStore.getProcesses());
            UIManager.clearInputs();
            console.log('Procesos actuales:', ProcessStore.getProcesses());
        } else {
            // This else block might not be necessary anymore because of the `required` attribute,
            // but it's good for browsers that might not support it.
            alert('Por favor, complete todos los campos.');
        }
    },

    handleDeleteProcess: function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const indexToDelete = parseInt(event.target.getAttribute('data-index'));
            ProcessStore.deleteProcess(indexToDelete);
            UIManager.renderTable(ProcessStore.getProcesses());
            console.log('Procesos actuales:', ProcessStore.getProcesses());
        }
    }
};

// Iniciar la aplicación
App.init();