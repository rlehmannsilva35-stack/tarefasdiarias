const STORAGE_KEY = 'lista_tarefas_diarias_v1';

const form = document.getElementById('form-tarefa');
const input = document.getElementById('nova-tarefa');
const lista = document.getElementById('lista-tarefas');
const btnLimpar = document.getElementById('limpar-concluidas');
const btnMarcarTodas = document.getElementById('marcar-todas');

let tarefas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function render() {
  lista.innerHTML = '';
  if (tarefas.length === 0) {
    lista.innerHTML = '<li class="tarefa"><label>Nenhuma tarefa</label></li>';
    return;
  }

  tarefas.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = 'tarefa' + (t.done ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!t.done;
    checkbox.addEventListener('change', () => {
      tarefas[idx].done = checkbox.checked;
      salvar();
      render();
    });

    const label = document.createElement('label');
    label.textContent = t.text;

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = 'Remover';
    del.addEventListener('click', () => {
      tarefas.splice(idx,1);
      salvar();
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(del);
    lista.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tarefas.push({ text, done: false, created: Date.now() });
  input.value = '';
  salvar();
  render();
});

btnLimpar.addEventListener('click', () => {
  tarefas = tarefas.filter(t => !t.done);
  salvar();
  render();
});

btnMarcarTodas.addEventListener('click', () => {
  const allDone = tarefas.every(t => t.done);
  tarefas = tarefas.map(t => ({...t, done: !allDone}));
  salvar();
  render();
});

render();