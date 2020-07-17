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

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition).pizzaria;

var cardapio = [];
var sacola = [];

function listarCardapio(call, callback) {
    console.log("CARDÁPIO:");
    console.log(cardapio);
    callback(null, {pizzas: cardapio});
}

function cadastrarItem(call, callback) {
    const pizza = {
        sabor: call.request.sabor,
        valor: call.request.valor,
    }
    cardapio.push(pizza);
    console.log("Item cadastrado com sucesso!");
    console.log(pizza);
    callback(null, {});
}

function excluirItem(call, callback) {
    const posicao = call.request.posicao;
    cardapio.splice(posicao, 1);
    console.log("Item exluído com sucesso!");
    console.log(cardapio);
    callback(null, {});
}

function montarPedido(call, callback) {
    const posicao = call.request.posicao;
    sacola.push(cardapio[posicao]);
    console.log("Item adicionado à sacola!");
    console.log(sacola);
    callback(null, {});
}

function solicitarEntrega(call, callback) {
    const endereco = call.request.endereco;
    console.log("PEDIDO FINALIZADO:");
    console.log(sacola);
    console.log("ENDEREÇO:\n" + endereco);
    callback(null, {pizzas: sacola, endereco: endereco});
}

const server = new grpc.Server();

server.addService(protoDescriptor.ServicoPizzaria.service,
                        {
                            ListarCardapio: listarCardapio,
                            CadastrarItem: cadastrarItem,
                            ExcluirItem: excluirItem,
                            MontarPedido: montarPedido,
                            SolicitarEntrega: solicitarEntrega,
                        });

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
