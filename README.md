# Gerenciador de Tarefas API

Uma API para um sistema de Gerenciamento de Tarefas com Node.js. Os usuários poderão criar contas, autenticar-se com segurança e gerenciar suas tarefas. Cada tarefa poderá ser atribuída a membros do time, classificada por status e prioridade, e o progresso poderá ser acompanhado de forma simples e organizada.

## 🚀 Funcionalidades Principais

- Autenticação Segura: Cadastro de usuários e login com geração de Token JWT.
- Gestão de Equipes: Criação, edição e gerenciamento de membros por time.
- Controle de Tarefas: Atribuição de tarefas, definição de prioridades e monitoramento de status.
- Histórico de Alterações: Rastreabilidade completa das modificações em cada tarefa.
- Níveis de Acesso: Diferenciação entre administradores e membros comuns.

## 📦 Endpoints

**Usuários e Autenticação**

- POST	/users	Cria uma nova conta (Padrão: member)
- POST	/sessions	Login: retorna Token JWT e dados do usuário

**Equipes (Teams)**

- POST	/teams Cria um novo time
- GET	/teams	Lista todos os times cadastrados
- PATCH	/teams/:id	Atualiza informações de um time
- DELETE	/teams/:id	Remove um time do sistema


**Membros da Equipe (Team Members)**

- POST	/teams-members	Adiciona um usuário a um time
- GET	/teams-members/:team_id	Lista todos os membros de um time específico
- DELETE	/teams-members/:id	Remove um membro de um time

**Tarefas (Tasks)** 

- POST	/tasks	Cria uma nova tarefa
- GET	/tasks	Lista tarefas (Admin: todas) (Member: as eles)
- GET	/tasks/:id	Detalhes de uma tarefa específica
- PATCH	/tasks/:id	Atualiza os dados da tarefa
- PATCH	/tasks/:id/assign	Atribui um usuário responsável à tarefa
- GET	/tasks/history	Exibe o histórico de logs daquela tarefa
- DELETE	/tasks/:id	Remove uma tarefa

## 🛠️ Como executar o projeto
Siga os passos abaixo para rodar a aplicação em seu ambiente local:

1. **Clone o repositório:**
   ```bash
   ```


2. **Instale as dependências:**
     ```bash
      npm install
    ```

3. **Criar o banco de dados:**
    ```bash
        docker-compose up -d
    ```

4. **Inicie o servidor de desenvolvimento:**

    ```bash
        npm run dev
    ```


## 🧪 Como executar os testes do projeto 
Siga os passos abaixo para rodar a aplicação em seu ambiente local:

1. **Inicie os testes:**
   ```bash
    npm test
   ```



*Desenvolvido por Isabelle Vicente Oliveira*
