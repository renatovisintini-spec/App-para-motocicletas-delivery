const TOTAL_MOTORCYCLES = 8;
const TOTAL_TIME_SLOTS = 24;
const START_HOUR = 8;
const SLOT_MINUTES = 30;

const scheduleElement = document.querySelector("#horario");
const motorcyclesElement = document.querySelector("#motos");
const totalElement = document.querySelector("#totalMotos");
const availableElement = document.querySelector("#motosDisponibles");
const busyElement = document.querySelector("#motosEnUso");
const statusMessageElement = document.querySelector("#statusMessage");

const motorcycles = Array.from({ length: TOTAL_MOTORCYCLES }, (_, index) => ({
  id: index + 1,
  assignedSlotId: null,
}));

const assignments = new Map();

function formatTime(slotIndex) {
  const totalMinutes = START_HOUR * 60 + slotIndex * SLOT_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

function createSchedule() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < TOTAL_TIME_SLOTS; index += 1) {
    const slotId = `H${index + 1}`;
    const button = document.createElement("button");

    button.type = "button";
    button.id = slotId;
    button.className = "time-slot";
    button.dataset.slotId = slotId;
    button.dataset.time = formatTime(index);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      <span class="time-slot__time">${formatTime(index)}</span>
      <span class="time-slot__state">Disponible</span>
    `;

    fragment.appendChild(button);
  }

  scheduleElement.appendChild(fragment);
}

function createMotorcycles() {
  const fragment = document.createDocumentFragment();

  motorcycles.forEach((motorcycle) => {
    const card = document.createElement("article");
    card.id = `M${motorcycle.id}`;
    card.className = "motorcycle";
    card.innerHTML = `
      <span class="motorcycle__badge">M${motorcycle.id}</span>
      <span class="motorcycle__status">Disponible</span>
    `;
    fragment.appendChild(card);
  });

  motorcyclesElement.appendChild(fragment);
}

function getAvailableMotorcycle() {
  return motorcycles.find((motorcycle) => motorcycle.assignedSlotId === null);
}

function updateSummary(message = "") {
  const busyCount = assignments.size;
  const availableCount = TOTAL_MOTORCYCLES - busyCount;

  totalElement.textContent = TOTAL_MOTORCYCLES;
  availableElement.textContent = availableCount;
  busyElement.textContent = busyCount;

  statusMessageElement.classList.toggle("status-message--warning", availableCount === 0);

  if (message) {
    statusMessageElement.textContent = message;
    return;
  }

  statusMessageElement.textContent = availableCount === 1
    ? "Queda 1 motocicleta disponible."
    : `Hay ${availableCount} motocicletas disponibles.`;
}

function updateMotorcycleCard(motorcycle) {
  const card = document.querySelector(`#M${motorcycle.id}`);
  const status = card.querySelector(".motorcycle__status");
  const isBusy = motorcycle.assignedSlotId !== null;

  card.classList.toggle("motorcycle--busy", isBusy);

  if (isBusy) {
    const slot = document.querySelector(`#${motorcycle.assignedSlotId}`);
    status.textContent = `En uso · ${slot.dataset.time}`;
  } else {
    status.textContent = "Disponible";
  }
}

function assignMotorcycle(slotButton) {
  const motorcycle = getAvailableMotorcycle();

  if (!motorcycle) {
    updateSummary("No quedan motocicletas disponibles. Libera una franja ocupada para continuar.");
    return;
  }

  const slotId = slotButton.dataset.slotId;
  motorcycle.assignedSlotId = slotId;
  assignments.set(slotId, motorcycle.id);

  slotButton.classList.add("time-slot--occupied");
  slotButton.setAttribute("aria-pressed", "true");
  slotButton.querySelector(".time-slot__state").textContent = `M${motorcycle.id} asignada`;

  updateMotorcycleCard(motorcycle);

  const availableCount = TOTAL_MOTORCYCLES - assignments.size;
  const message = availableCount === 0
    ? "Todas las motocicletas están asignadas. Pulsa una franja ocupada para liberar una."
    : `M${motorcycle.id} asignada a las ${slotButton.dataset.time}.`;

  updateSummary(message);
}

function releaseMotorcycle(slotButton) {
  const slotId = slotButton.dataset.slotId;
  const motorcycleId = assignments.get(slotId);
  const motorcycle = motorcycles.find((item) => item.id === motorcycleId);

  if (!motorcycle) {
    return;
  }

  motorcycle.assignedSlotId = null;
  assignments.delete(slotId);

  slotButton.classList.remove("time-slot--occupied");
  slotButton.setAttribute("aria-pressed", "false");
  slotButton.querySelector(".time-slot__state").textContent = "Disponible";

  updateMotorcycleCard(motorcycle);
  updateSummary(`M${motorcycle.id} liberada de las ${slotButton.dataset.time} y disponible nuevamente.`);
}

function handleScheduleClick(event) {
  const slotButton = event.target.closest(".time-slot");

  if (!slotButton) {
    return;
  }

  if (assignments.has(slotButton.dataset.slotId)) {
    releaseMotorcycle(slotButton);
  } else {
    assignMotorcycle(slotButton);
  }
}

createSchedule();
createMotorcycles();
updateSummary();
scheduleElement.addEventListener("click", handleScheduleClick);
