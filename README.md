# 🏢 ResidentManager

Uma aplicação web moderna desenvolvida para simplificar e automatizar a administração e o gerenciamento financeiro de condomínios.

## 📄 Descrição do Projeto

O **ResidentManager** foi idealizado para substituir as tradicionais planilhas de gastos — que frequentemente contêm fórmulas complexas e propensas a erros de manipulação. A aplicação automatiza o rateio de despesas de forma inteligente.

### Principais Funcionalidades:
* **Rateio Automatizado:** Insira contas fixas (água, luz, manutenção) ou ocasionais, e o sistema calcula e divide automaticamente os valores entre os moradores.
* **Emissão de Relatórios:** Geração de arquivos PDF com os valores detalhados cobrados por cada unidade/apartamento.
* **Controle de Inadimplência:** Registro e monitoramento em tempo real de quais moradores realizaram ou não os pagamentos.

## 🔍 Como Funciona (Fluxo da Aplicação)

Para facilitar o entendimento, o fluxo de uso do sistema segue estes passos simples:

**Cadastro de Unidades:** O administrador cadastra os apartamentos/moradores do condomínio no sistema.

* **Lançamento de Despesas:** Ao receber uma conta do condomínio (ex: Conta de Água de R$ 1.200,00$), o administrador insere o valor, a descrição e o tipo de despesa no formulário.

* **Cálculo Automático:** O back-end recebe essa despesa e realiza o rateio (divisão) matemática do valor igualmente (ou conforme a regra configurada) entre todas as unidades cadastradas.

* **Visualização e Controle:** Na tela principal, o sistema exibe uma tabela com cada morador, o valor que ele deve pagar naquele mês e o status do pagamento (Pendente / Pago).

* **Geração de Relatório:** Com um clique, o administrador pode gerar um arquivo PDF individual para cada morador, servindo como um demonstrativo detalhado da cobrança.

* **Baixa de Pagamento:** Conforme os moradores pagam, o administrador atualiza o status no painel para manter o controle de inadimplência atualizado em tempo real.

---

## 🚀 Pré-requisitos

Antes de iniciar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Recomendado: versão 20 LTS ou superior)
* Um gerenciador de pacotes (npm já vem instalado junto com o Node)

---

## 💻 Como Instalar e Rodar a Aplicação

O projeto está dividido em duas partes: `backend` e `frontend`.

### 1. Configurando o Back-end
No terminal, acesse a pasta do servidor, instale as dependências e inicie o serviço:

```bash
cd backend
npm install
npm start
```

O servidor iniciará por padrão na porta configurada (ex: `http://localhost:3001`).

### 2. Configurando o Front-end
Abra um novo terminal, acesse a pasta da interface, instale as dependências e inicie o ambiente de desenvolvimento:

```bash
cd frontend
npm install
npm run dev
```

O navegador abrirá automaticamente o projeto no endereço indicado pelo Vite (geralmente `http://localhost:5173`).

## 🛠️ Tecnologias Utilizadas
A pilha de tecnologia (Stack) escolhida para este projeto inclui:

### Linguagem Principal

* **TypeScript:** Adiciona tipagem estática ao JavaScript, garantindo um código mais seguro, autoexplicativo e livre de erros comuns de runtime.

### Back-end
* **Express:** Framework web para construção das rotas e APIs.
* **CORS:** Gerenciamento de permissões de requisições externas.
* **SQLite:** Banco de dados relacional leve e de fácil configuração (dispensa instalação de servidores pesados).

### Front-end
* **React & React-dom:** Biblioteca base para a construção de uma interface de usuário dinâmica e reativa.
* **Vite:** Ferramenta de build ultra-rápida que otimiza o fluxo de desenvolvimento do projeto.
* **Axios:** Cliente HTTP para comunicação e consumo das rotas do Back-end de forma assíncrona.
* **jspdf:** Biblioteca especializada para a geração e download dos relatórios de cobrança em formato PDF.
* **React-icons:** Conjunto de ícones vetoriais personalizáveis para compor o layout visual.