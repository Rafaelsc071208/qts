const path = require('path');
const express = require('express'); 
const mysql = require('mysql2/promise'); 
const cors = require('cors'); 
const app = express(); 
 
app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../')));

// Configuração do banco de dados
const dbConfig = { 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'crud_funcionarios' 
}; 
 
const db = mysql.createPool(dbConfig); 

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Index.html'));
});

// Rota para autenticação de login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verifica se o usuário existe no banco de dados
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            res.json({ success: true, message: 'Login realizado com sucesso!' });
        } else {
            res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para listar funcionários
app.get('/api/funcionarios', async (req, res) => { 
    try { 
        const [rows] = await db.execute('SELECT * FROM funcionarios ORDER BY id DESC'); 
        res.json(rows); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
// Rota para adicionar funcionário
app.post('/api/funcionarios', async (req, res) => { 
    try { 
        const { nome, funcao, salario } = req.body; 
        if (!nome || !funcao || !salario) { 
            return res.status(400).json({ error: 'Campos obrigatórios' }); 
        } 
        const [result] = await db.execute( 
            'INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)', 
            [nome, funcao, parseFloat(salario)] 
        ); 
        res.json({ success: true, id: result.insertId }); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
// Rota para atualizar funcionário
app.put('/api/funcionarios/:id', async (req, res) => {
    try { 
        const { nome, funcao, salario } = req.body; 
        const id = req.params.id; 
        await db.execute( 
            'UPDATE funcionarios SET nome = ?, funcao = ?, salario = ? WHERE id = ?', 
            [nome, funcao, parseFloat(salario), id] 
        ); 
        res.json({ success: true }); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
// Rota para deletar funcionário
app.delete('/api/funcionarios/:id', async (req, res) => { 
    try { 
        const id = req.params.id; 
        await db.execute('DELETE FROM funcionarios WHERE id = ?', [id]); 
        res.json({ success: true });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});