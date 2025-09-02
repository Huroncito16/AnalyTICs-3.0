function addProcess() {
    const processList = [];

    const processNameInput = document.getElementById('processName');
    const processTimeInput = document.getElementById('processTime');
    const processPriorityInput = document.getElementById('processPriority');
    const addButton = document.getElementById('addButton');
    const processTableBody = document.querySelector('#processTable tbody');

    const name = processNameInput.value;
        const time = processTimeInput.value;
        const priority = processPriorityInput.value;

        if (name && time && priority) {
            const newProcess = [name, parseInt(time), parseInt(priority)];
            processList.push(newProcess);

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${name}</td>
                <td>${time}</td>
                <td>${priority}</td>
            `;
            processTableBody.appendChild(newRow);

            // Limpiar los campos de entrada
            processNameInput.value = '';
            processTimeInput.value = '';
            processPriorityInput.value = '';

            console.log('Procesos actuales:', processList);
        } else {
            alert('Por favor, complete todos los campos.');
        }
};

addButton.addEventListener('click',addProcess);