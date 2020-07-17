const PROTO_PATH = './pizzaria.proto';

const grpc = require('grpc');

const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).pizzaria;

const client = new protoDescriptor.ServicoPizzaria('localhost:50051',
                                        grpc.credentials.createInsecure());

/*
client.ListarCardapio({}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro no processo de listagem do cardápio!");
        return;
    }
    console.log("\n=============== CARDÁPIO ===============\n");
    for (var itemCardapio in response.pizzas) {
        console.log(itemCardapio+". "+response.pizzas[itemCardapio].sabor+" .................... R$ "+response.pizzas[itemCardapio].valor+".00\n", );
    }
});
*/
/*
client.CadastrarItem({sabor: "CALABRESA", valor: 20.00}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro no processo de cadastramento do item!");
        return;
    }

    console.log("Item cadastrado com sucesso!");
});
*/
/*
client.ExcluirItem({posicao: 1}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro no processo de cadastramento do item!");
        return;
    }

    console.log("Item exluído com sucesso!");
});
*/
/*
client.MontarPedido({posicao: 3}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro no processo de montagem do pedido!");
        return;
    }

    console.log("Item adicionado à sacola!");
});
*/

client.solicitarEntrega({endereco: "AVENIDA DOS HOLANDESES, 1000 CALHAU"}, function(err, response) {
    if (err != null) {
        console.log("Ocorreu um erro no processo de solicitação de entrega!");
        return;
    }
    var total = 0;
    console.log("\n=============== RESUMO ===============\n");
    for (var itemCardapio in response.pizzas) {
        console.log("- "+response.pizzas[itemCardapio].sabor+" .................... R$ "+response.pizzas[itemCardapio].valor+".00\n", );
        total = total + response.pizzas[itemCardapio].valor;
    };
    console.log("--------------------------------------\n")
    console.log("ENDEREÇO DE ENTREGA: \n\n"+ response.endereco +"\n");
    console.log("--------------------------------------\n")
    console.log("TOTAL: R$ "+total+".00\n");
});
