const express = require("express");

const app = express();

// A porta foi definida como PORT, mas o listen usa 'port'. Corrigindo para usar PORT.
const PORT = 3000;
// Ela "ensina" o Express a ler e interpretar o formato JSON no corpo das requisições.
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API de Produtos está funcionando!");
});

// A estrutura inicial de produtos foi alterada para seguir o Modelo de Dados (nome, preco, estoque).
let proximoId = 1;
const produtos = [
    { id: proximoId++, nome: 'Calça Jeans', preco: 99.90, estoque: 50 },
    { id: proximoId++, nome: 'Camiseta Básica', preco: 39.90, estoque: 100 },
];


// Endpoints Essenciais (CRUD):
// i. POST /produtos - Cadastra um novo produto.
// ii. GET /produtos - Lista todos os produtos.
// iii. GET /produtos/:id - Busca um produto específico por ID.
// iv. PUT /produtos/:id - Atualiza os dados de um produto por ID.
// v. DELETE /produtos/:id - Deleta um produto por ID.

// Modelo de Dados (Objeto produto ):
// id : Number (único)
// nome : String
// preco : Number
// estoque : Number


// Rota para adicionar um novo produto (POST /produtos)
app.post('/produtos', (req, res) => {
    const { nome, preco, estoque } = req.body; // Desestrutura as propriedades esperadas

    if (!nome || preco === undefined || estoque === undefined) {
        return res.status(400).json({ error: "Dados inválidos. O produto deve ter nome, preco e estoque." });
    }

    const novoProduto = {
        id: proximoId++,
        nome,
        preco,
        estoque
    };

    produtos.push(novoProduto); // Adiciona o novo produto ao array
    res.status(201).json({ message: "Produto cadastrado com sucesso!", produto: novoProduto });
});
// A rota POST /produtos estava duplicada no código original. A segunda rota duplicada foi removida.

// GET – pegar todos os produtos (GET /produtos)
app.get("/produtos", (req, res) => {
    res.json(produtos);
});

// GET – buscar um produto específico por ID (GET /produtos/:id)
app.get("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (produto) {
        res.json(produto);
    } else {
        // Retorna 404 Not Found se o produto não for encontrado
        res.status(404).json({ error: "Produto não encontrado." });
    }
});


// PUT – modificar um produto (PUT /produtos/:id)
app.put("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
    const { nome, preco, estoque } = req.body; // Pega todas as propriedades a serem atualizadas

    const index = produtos.findIndex((produto) => produto.id === id);

    if (index === -1) {
        // Retorna 404 Not Found se o produto não for encontrado
        return res.status(404).json({ error: "Produto não encontrado." });
    }


    // Atualizar as propriedades do produto existente no array.
    produtos[index].nome = nome !== undefined ? nome : produtos[index].nome;
    produtos[index].preco = preco !== undefined ? preco : produtos[index].preco;
    produtos[index].estoque = estoque !== undefined ? estoque : produtos[index].estoque;

    res.json({ mensagem: "Produto atualizado com sucesso!", produto: produtos[index] });
});

// DELETE – remover produto por ID (DELETE /produtos/:id)
// Removido o 'async' desnecessário
app.delete("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);

    const initialLength = produtos.length;
    let produtos = produtos.filter((produto) => produto.id !== id);

    if (produtos.length === initialLength) {
        // Retorna 404 Not Found se o produto não foi encontrado para deletar
        return res.status(404).json({ error: "Produto não encontrado para exclusão." });
    }

    // Retorna 204 No Content para indicar sucesso na exclusão.
    res.status(204).send();
});

// Implementação da busca (Desafio): GET /produtos/buscar?nome=termo
app.get("/produtos/buscar", (req, res) => {
    const termoBusca = req.query.nome ? req.query.nome.toLowerCase() : '';

    if (!termoBusca) {
        // Se não houver termo de busca, retorna 400 Bad Request
        return res.status(400).json({ error: "Por favor, forneça um termo de busca via query parameter 'nome'." });
    }

    const resultados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termoBusca)
    );

    if (resultados.length > 0) {
        res.json(resultados);
    } else {
        // Retorna 404 Not Found se nenhum produto for encontrado
        res.status(404).json({ message: "Nenhum produto encontrado com o termo pesquisado." });
    }
});


// Rota de inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});