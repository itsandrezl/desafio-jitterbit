const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

// Configuração do banco
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'senha_do_banco', // insira a sua senha do banco aqui
    database: 'jitterbit_db'
};

// Rota inicial
app.get('/', (req, res) => {
    res.send('API Jitterbit funcionando 🚀');
});

/**
 * POST /order
 * Cria um novo pedido
 */
app.post('/order', async (req, res) => {

    let connection;

    try {

        connection = await mysql.createConnection(dbConfig);

        const payload = req.body;

        // Mapping de dados
        const orderData = {
            orderId: payload.numeroPedido.split('-')[0],
            value: payload.valorTotal,
            creationDate: new Date(payload.dataCriacao)
        };

        // Inserir pedido
        await connection.execute(
            'INSERT INTO `Order` (orderId, value, creationDate) VALUES (?, ?, ?)',
            [orderData.orderId, orderData.value, orderData.creationDate]
        );

        // Inserir itens
        for (const item of payload.items) {

            await connection.execute(
                'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                [
                    orderData.orderId,
                    Number(item.idItem),
                    item.quantidadeItem,
                    item.valorItem
                ]
            );

        }

        res.status(201).json({
            message: "Pedido criado com sucesso",
            orderId: orderData.orderId
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    } finally {

        if (connection) await connection.end();

    }

});


/**
 * GET /order/:id
 * Buscar pedido pelo ID
 */
app.get('/order/:id', async (req, res) => {

    let connection;

    try {

        connection = await mysql.createConnection(dbConfig);

        const orderId = req.params.id;

        const [orders] = await connection.execute(
            'SELECT * FROM `Order` WHERE orderId = ?',
            [orderId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ message: "Pedido não encontrado" });
        }

        const [items] = await connection.execute(
            'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
            [orderId]
        );

        res.json({
            ...orders[0],
            items
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    } finally {

        if (connection) await connection.end();

    }

});


/**
 * GET /order/list
 * Listar todos os pedidos
 */
app.get('/order/list', async (req, res) => {

    let connection;

    try {

        connection = await mysql.createConnection(dbConfig);

        const [orders] = await connection.execute(
            'SELECT * FROM `Order`'
        );

        res.json(orders);

    } catch (error) {

        res.status(500).json({ error: error.message });

    } finally {

        if (connection) await connection.end();

    }

});


/**
 * DELETE /order/:id
 * Deletar pedido
 */
app.delete('/order/:id', async (req, res) => {

    let connection;

    try {

        connection = await mysql.createConnection(dbConfig);

        const orderId = req.params.id;

        await connection.execute(
            'DELETE FROM Items WHERE orderId = ?',
            [orderId]
        );

        await connection.execute(
            'DELETE FROM `Order` WHERE orderId = ?',
            [orderId]
        );

        res.json({
            message: "Pedido deletado com sucesso"
        });

    } catch (error) {

        res.status(500).json({ error: error.message });

    } finally {

        if (connection) await connection.end();

    }

});


// Iniciar servidor
app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});