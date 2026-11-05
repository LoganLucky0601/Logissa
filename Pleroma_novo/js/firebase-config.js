/*
  CONFIGURAÇÃO DO FIREBASE — preencher após criar seu projeto.
  Estes identificadores não são senhas. A proteção real é feita
  pelas regras firestore.rules, nunca escondendo o botão de editar.
*/
export const firebaseConfig = {
  apiKey: 'COLE_AQUI',
  authDomain: 'COLE_AQUI',
  projectId: 'COLE_AQUI',
  appId: 'COLE_AQUI'
};

// UID do usuário administrador: copie da área Authentication > Users do Firebase.
// Usar UID e regras no servidor evita confiar apenas em um e-mail digitado.
export const adminUid = 'COLE_UID_DO_ADMINISTRADOR';
