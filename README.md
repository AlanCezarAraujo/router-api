# I4 Router

Esse sistema tem um objetivo de servir como um proxy de borda do 360Dialog para o ambiente da I4 gerenciado via N8N.

## Rodando a aplicação

Primeiro instale as dependências com `pnpm install`.
Depois inicie o servidor em modo produção com `pnpm start`, ou em modo desenvolvimento com `pnpn start:dev`
Para subir a aplicação com Docker, basta executar `docker compose up --build --detach`.

## Instalando e executando o MongoDB no MacOS

Atualize as referência do Brew:
```sh
brew tap mongodb/brew
```

Depois instale a versão community do MongoDB:
```sh
brew install mongodb-community
```

Para executar:
```sh
brew services start mongodb/brew/mongodb-community
```
