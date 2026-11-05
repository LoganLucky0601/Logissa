/* ============================================================
   PLÉROMA — Navegação SPA (JavaScript simples)
   1. Cada rota corresponde a uma tela, não a uma âncora.
   2. Só o conteúdo de <main> é substituído.
   3. O Firebase, em outro arquivo, controla quem pode editar.
   ============================================================ */

// Adicione aqui novas páginas: endereço, título e descrição.
const paginas = {
  'sobre': ['Sobre o PLÉROMA', 'Uma plataforma para estudar, refletir e viver a Palavra de Deus.'],
  'pregacoes/temas': ['Pregações por temas', 'Encontre ministrações organizadas por assunto: família, fé, identidade, heresias, valores, missão e visão.'],
  'pregacoes/pregadores': ['Pregações por pregador', 'Em breve: lista de pastores, pregadores e palestrantes.'],
  'pregacoes/recentes': ['Pregações mais recentes', 'As últimas ministrações adicionadas à plataforma aparecerão aqui.'],
  'pregacoes/ao-vivo': ['Ao vivo e transmissões', 'Em breve: links para cultos e eventos transmitidos ao vivo.'],
  'devocionais/diario': ['Devocional diário', 'Mensagens breves para meditar e aplicar a Palavra no dia a dia.'],
  'devocionais/planos': ['Planos de leitura', 'Guias de leitura bíblica de 30, 90 ou 365 dias.'],
  'devocionais/audios': ['Áudios e podcasts', 'Reflexões para ouvir em diferentes momentos do dia.'],
  'devocionais/artigos': ['Artigos e reflexões', 'Textos de aprofundamento sobre as Escrituras.'],
  'biblioteca/ebooks': ['E-books e livros', 'Livros e materiais digitais gratuitos ou recomendados.'],
  'biblioteca/estudos': ['Materiais de estudo', 'Apostilas, guias de pequenos grupos e estudos bíblicos.'],
  'biblioteca/artes': ['Infográficos e wallpapers', 'Versículos ilustrados e artes para baixar.'],
  'biblioteca/musicas': ['Músicas e cânticos', 'Playlists, cânticos e cifras para músicos.'],
  'materiais/apostilas': ['Apostilas e PDFs', 'Arquivos digitais para leitura e estudo.'],
  'materiais/roteiros': ['Roteiros de estudo', 'Perguntas e roteiros para aprofundamento bíblico.'],
  'materiais/guias': ['Guias de leitura', 'Sugestões de leitura bíblica organizadas por assunto.'],
  'materiais/anotacoes': ['Anotações', 'Esboços e sínteses de mensagens e estudos.']
};

const textoOriginal = '...para que sejais tomados de toda a plenitude de Deus.';
const referenciaOriginal = 'Efésios 3:19 (trecho)';
const conteudo = document.getElementById('conteudo');
let mensagem = { texto: textoOriginal, referencia: referenciaOriginal };
let usuarioAdmin = false;
let configurado = false;

// Texto é inserido como texto, nunca como HTML: impede execução de código digitado.
function elemento(tag, classe, texto) {
  const item = document.createElement(tag);
  if (classe) item.className = classe;
  if (texto !== undefined) item.textContent = texto;
  return item;
}

// A tela inicial é uma cópia do template original, preservando o design.
function mostrarInicio() {
  const modelo = document.getElementById('pagina-inicial');
  conteudo.appendChild(modelo.content.cloneNode(true));
  const trecho = document.getElementById('versiculo-texto');
  trecho.textContent = `“${mensagem.texto}”`;
  document.getElementById('versiculo-referencia').textContent = mensagem.referencia;
}

function mostrarCategoria(caminho) {
  const [titulo, descricao] = paginas[caminho];
  const secao = elemento('section', 'pagina-interna');
  const corpo = elemento('div', 'container');
  const voltar = elemento('a', 'pagina-voltar', '← Voltar ao início');
  voltar.href = '#inicio'; voltar.dataset.pagina = 'inicio';
  const kicker = elemento('p', 'section-kicker', 'PLÉROMA / EXPLORE');
  const tituloPagina = elemento('h1', '', titulo);
  const intro = elemento('p', 'section-intro', descricao);
  const card = elemento('article', 'content-card');
  card.append(elemento('p', 'card-tag', 'CONTEÚDOS'), elemento('h3', '', 'Publicações em preparação'), elemento('p', '', 'Esta seção terá publicações próprias. Ela já funciona como uma tela separada dentro da plataforma.'));
  corpo.append(voltar, kicker, tituloPagina, intro, card);
  // Só em “Por temas”, mostramos a lista exemplificativa pedida.
  if (caminho === 'pregacoes/temas') {
    const grupo = elemento('div', 'chip-list');
    ['Família', 'Fé', 'Identidade', 'Heresias', 'Valores', 'Missão', 'Visão'].forEach(t => grupo.appendChild(elemento('span', 'chip', t)));
    corpo.insertBefore(grupo, card);
  }
  secao.appendChild(corpo);
  conteudo.appendChild(secao);
}

function mostrarEntrada() {
  const secao = elemento('section', 'pagina-interna');
  const corpo = elemento('div', 'container');
  corpo.append(elemento('p', 'section-kicker', 'ÁREA DE ACESSO'), elemento('h1', '', 'Entrar no PLÉROMA'));
  const card = elemento('div', 'card-informativo');
  card.appendChild(elemento('p', '', 'A autenticação por conta Google será utilizada para identificar o administrador. O cadastro geral de leitores ficará para uma próxima etapa.'));
  const entrar = elemento('button', 'btn btn-primary', usuarioAdmin ? 'Abrir administração' : 'Continuar com Google');
  entrar.type = 'button';
  entrar.addEventListener('click', () => {
    if (usuarioAdmin) navegar('admin');
    else if (window.PleromaFirebase?.login) window.PleromaFirebase.login();
    else window.alert('Configure o Firebase conforme o arquivo CONFIGURAR-FIREBASE.md para ativar o login.');
  });
  card.appendChild(entrar);
  card.appendChild(elemento('p', 'aviso-seguranca', configurado ? 'O acesso à edição só será liberado para a conta definida nas regras do banco.' : 'Modo de avaliação: login desativado até configurar seu projeto Firebase.'));
  corpo.appendChild(card); secao.appendChild(corpo); conteudo.appendChild(secao);
}

function mostrarAdmin() {
  if (!usuarioAdmin) { mostrarEntrada(); return; }
  const secao = elemento('section', 'pagina-interna');
  const corpo = elemento('div', 'container');
  corpo.append(elemento('p', 'section-kicker', 'ACESSO RESTRITO'), elemento('h1', '', 'Painel do administrador'), elemento('p', 'section-intro', 'Altere a mensagem do card. A publicação será compartilhada com os visitantes após salvar no banco de dados.'));
  const form = elemento('form', 'formulario-admin');
  const rotuloTexto = elemento('label', '', 'Mensagem / trecho bíblico'); rotuloTexto.htmlFor = 'admin-texto';
  const campoTexto = elemento('textarea'); campoTexto.id = 'admin-texto'; campoTexto.maxLength = 260; campoTexto.required = true; campoTexto.value = mensagem.texto;
  const rotuloRef = elemento('label', '', 'Referência bíblica'); rotuloRef.htmlFor = 'admin-ref';
  const campoRef = elemento('input'); campoRef.id = 'admin-ref'; campoRef.maxLength = 90; campoRef.required = true; campoRef.value = mensagem.referencia;
  const salvar = elemento('button', 'btn btn-primary', 'Publicar alterações'); salvar.type = 'submit';
  const estado = elemento('p', 'mensagem-status'); estado.setAttribute('role', 'status');
  form.append(rotuloTexto, campoTexto, rotuloRef, campoRef, salvar, estado);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!window.PleromaFirebase?.salvar) { estado.textContent = 'Configure o Firebase para publicar.'; return; }
    salvar.disabled = true;
    try {
      await window.PleromaFirebase.salvar({ texto: campoTexto.value.trim(), referencia: campoRef.value.trim() });
      estado.textContent = 'Mensagem publicada com sucesso!';
    } catch (erro) { estado.textContent = 'Não foi possível publicar. Verifique sua permissão e a conexão.'; }
    finally { salvar.disabled = false; }
  });
  const sair = elemento('button', 'btn btn-outline', 'Sair da conta'); sair.type = 'button'; sair.addEventListener('click', () => window.PleromaFirebase?.sair?.());
  corpo.append(form, sair); secao.appendChild(corpo); conteudo.appendChild(secao);
}

// O endereço hash permite usar Voltar/Avançar do navegador e links diretos.
function navegar(caminho) { window.location.hash = '#' + caminho; if (window.location.hash === '#' + caminho) renderizar(); }
function renderizar() {
  const caminho = decodeURIComponent(window.location.hash.slice(1)) || 'inicio';
  conteudo.replaceChildren();
  if (caminho === 'inicio') mostrarInicio();
  else if (caminho === 'entrar') mostrarEntrada();
  else if (caminho === 'admin') mostrarAdmin();
  else if (paginas[caminho]) mostrarCategoria(caminho);
  else { window.location.hash = '#inicio'; return; }
  document.title = 'PLÉROMA | ' + (paginas[caminho]?.[0] || (caminho === 'admin' ? 'Administração' : 'Fé que transborda'));
  document.querySelectorAll('.dropdown[open]').forEach(menu => menu.open = false);
  document.querySelectorAll('[data-pagina]').forEach(link => {
    if (link.dataset.pagina === caminho) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange', renderizar);
// Em rotas já abertas, clicar novamente na logo também sobe ao topo.
document.addEventListener('click', evento => {
  const link = evento.target.closest('a[data-pagina]');
  if (link && link.dataset.pagina === (location.hash.slice(1) || 'inicio')) window.scrollTo({top:0,behavior:'instant'});
});

// Interface mínima utilizada pelo arquivo firebase.js para atualizar o conteúdo.
window.PleromaApp = {
  atualizarMensagem(novaMensagem) {
    if (!novaMensagem || typeof novaMensagem.texto !== 'string' || typeof novaMensagem.referencia !== 'string') return;
    mensagem = novaMensagem;
    if ((location.hash.slice(1) || 'inicio') === 'inicio') renderizar();
  },
  atualizarAcesso(admin, firebasePronto) {
    usuarioAdmin = admin;
    configurado = firebasePronto;
    document.getElementById('botao-conta').textContent = admin ? 'Painel' : 'Entrar';
    document.getElementById('botao-conta').href = admin ? '#admin' : '#entrar';
    document.getElementById('botao-conta').dataset.pagina = admin ? 'admin' : 'entrar';
    if (['admin', 'entrar'].includes(location.hash.slice(1))) renderizar();
  }
};
renderizar();
