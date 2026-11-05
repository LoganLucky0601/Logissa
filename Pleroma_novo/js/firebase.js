/*
   Firebase: autenticação Google e publicação do card.
   Só fica ativo após completar firebase-config.js.
   Firestore valida o UID do administrador de verdade.
*/
import { firebaseConfig, adminUid } from './firebase-config.js';

// Sem configuração, o protótipo continua navegável e somente leitura.
if (firebaseConfig.apiKey !== 'COLE_AQUI' && firebaseConfig.projectId !== 'COLE_AQUI' && adminUid !== 'COLE_UID_DO_ADMINISTRADOR') {
  iniciarFirebase().catch(() => { /* mantém visualização estática se offline */ });
}

async function iniciarFirebase() {
  const versao = '11.10.0';
  const [{ initializeApp }, autenticacao, banco] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${versao}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${versao}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${versao}/firebase-firestore.js`)
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = autenticacao.getAuth(app);
  const db = banco.getFirestore(app);
  const docRef = banco.doc(db, 'configuracaoPublica', 'inspiracao');

  // Qualquer pessoa lê a mensagem publicada, sem permissão para alterar.
  banco.onSnapshot(docRef, snapshot => {
    if (snapshot.exists()) window.PleromaApp.atualizarMensagem(snapshot.data());
  });

  autenticacao.onAuthStateChanged(auth, async usuario => {
    // Apenas o UID autorizado pode acessar o editor. Firestore faz a mesma verificação.
    const permitido = Boolean(usuario && usuario.uid === adminUid && usuario.emailVerified);
    window.PleromaApp.atualizarAcesso(permitido, true);
  });

  window.PleromaFirebase = {
    async login() {
      const provedor = new autenticacao.GoogleAuthProvider();
      try { await autenticacao.signInWithPopup(auth, provedor); }
      catch { window.alert('Não foi possível entrar com Google. Confira o domínio autorizado.'); }
    },
    async salvar(dados) {
      if (!auth.currentUser || auth.currentUser.uid !== adminUid || !auth.currentUser.emailVerified) throw Error('Sem permissão');
      await banco.setDoc(docRef, {texto: dados.texto, referencia: dados.referencia});
    },
    async sair() { await autenticacao.signOut(auth); location.hash = '#inicio'; }
  };
}
