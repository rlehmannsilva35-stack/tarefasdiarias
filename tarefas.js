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

function atualizarStatus() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.done).length;
  document.getElementById('total-tarefas').textContent = total;
  document.getElementById('tarefas-concluidas').textContent = concluidas;
  const statusInfo = document.getElementById('status-info');

  if (total === 0) {
    statusInfo.textContent = 'Nenhuma tarefa ainda. Adicione algo para começar.';
  } else if (concluidas === total) {
    statusInfo.textContent = 'Parabéns! Todas as tarefas foram concluídas.';
  } else {
    statusInfo.textContent = `${total - concluidas} tarefa(s) pendente(s). Continue firme!`;
  }
}

function render() {
  lista.innerHTML = '';
  atualizarStatus();
  if (tarefas.length === 0) {
    lista.innerHTML = '<li class="tarefa placeholder"><label>Nenhuma tarefa</label></li>';
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
  const allDone = tarefas.length > 0 && tarefas.every(t => t.done);
  tarefas = tarefas.map(t => ({...t, done: !allDone}));
  salvar();
  render();
});

const themeToggle = document.getElementById('theme-toggle');
const DARK_MODE_KEY = 'tarefasdiarias_dark_mode';

function aplicarTema(escuro) {
  document.body.classList.toggle('dark-mode', escuro);
  themeToggle.textContent = escuro ? 'Modo claro' : 'Modo escuro';
  localStorage.setItem(DARK_MODE_KEY, escuro ? '1' : '0');
}

themeToggle.addEventListener('click', () => {
  const estaEscuro = document.body.classList.contains('dark-mode');
  aplicarTema(!estaEscuro);
});

const temaSalvo = localStorage.getItem(DARK_MODE_KEY) === '1';
aplicarTema(temaSalvo);

render();