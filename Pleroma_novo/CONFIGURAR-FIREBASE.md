# PLÉROMA — Como liberar edição apenas para você

A navegação SPA funciona sem conta e sem instalar nada. O **cadastro de conteúdo compartilhado** só é ativado quando você configurar o Firebase, serviço que guarda a mensagem e autentica sua conta Google.

1. Acesse https://console.firebase.google.com/ e crie um projeto.
2. Cadastre um aplicativo Web e copie `apiKey`, `authDomain`, `projectId` e `appId` para `js/firebase-config.js`.
3. Em **Authentication > Sign-in method**, ative **Google**. Em **Settings > Authorized domains**, cadastre o domínio do site publicado.
4. Em **Authentication > Users**, faça login no PLÉROMA pela primeira vez com o Gmail que será administrador. Copie o **UID** gerado para `adminUid` em `js/firebase-config.js`.
5. Em **Firestore Database**, crie o banco e substitua as regras pelas do arquivo `firestore.rules`. Troque `COLE_UID_DO_ADMINISTRADOR` pelo mesmo UID real e **publique** as regras.
6. Publique a pasta em um endereço HTTPS, por exemplo GitHub Pages; as importações do Firebase precisam de HTTP(S), e não de abrir o HTML diretamente como `file://`.
7. Entre com o Gmail autorizado, abra o **Painel** e altere a mensagem. Outros visitantes só poderão ler a mensagem.

**Importante:** o primeiro login serve apenas para obter o UID. Antes da publicação das regras, não use regras de teste abertas para escrita em produção. Não coloque contas privadas, senhas ou tokens secretos no código. A configuração pública do Firebase não é credencial secreta; o controle de autorização deve ficar nas regras do banco.

**Limites desta etapa:** não há gestão geral de pregações, biblioteca ou outros campos pelo painel; o editor cobre somente o card de inspiração. Cadastro geral de leitores ainda não foi implementado. A verificação por UID restringe esta edição a uma conta Google específica, independentemente de outros usuários entrarem no sistema.
