# 🚀 Mini Framework Web com TypeScript, Decorators e Injeção de Dependência

![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen)
![TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

Este projeto é um microframework backend criado do zero com **TypeScript**, inspirado em conceitos do NestJS.
Foi desenvolvido com foco em **modularidade**, **injeção de dependência**, **validação automática** e **arquitetura desacoplada**.

---

## 🧠 Principais Recursos

- ✅ Roteamento com decorators: `@Controller`, `@Get`, `@Post`, etc.
- ✅ Registro automático de rotas
- ✅ Injeção de dependência baseada em metadata
- ✅ Adaptador HTTP desacoplado do Express
- ✅ Validação automática com **Zod**
- ✅ Controllers independentes do framework HTTP
- ✅ Estrutura modular e testável

---

## 🧱 Estrutura do Projeto

```
src/
├── kernel/
│   ├── decorators/         # Controller, Get, Post, Schema
│   ├── di/                 # Registry de injeção
│   └── http/               # Adaptadores e roteamento
├── application/
│   ├── controllers/
│   ├── services/
│   ├── schemas/
│   └── repositories/
├── main/
│   ├─── contracts/
│   ├─── lib/
│   ├─── AppModule          # Modulo global
│   └─── main               # Start do projeto
└── shared/
    └── types/              # Tipagens genéricas Request<T>, Response<T>
```

---

## ✨ Exemplo de Uso

```ts
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':accountId')
  @Schema({ params: getOneAccountQuerySchema })
  getOne(
    request: Request<null, GetOneAccountQuery>,
  ): Response<{ accountId: string }> {
    return {
      code: 200,
      body: { accountId: request.params.accountId },
    };
  }

  @Post()
  @Schema({ body: createAccountSchema })
  create(request: Request<CreateAccountDto>): Response<Account> {
    const result = this.accountsService.createAccount(request.body);
    return { code: 201, body: result };
  }
}
```

```ts
@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
})
export class AccountsModule {}
```

---

## 📦 Validação com `Zod`

Você pode criar schemas e aplicá-los diretamente no decorator `@Schema`:

```ts
export const createAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
```

```ts
@Schema({ body: createAccountSchema })
```

---

## ⚙️ Requisitos

- Node.js `v20+`
- TypeScript `5.x`
- `reflect-metadata` ativado:

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

E em algum ponto inicial do projeto:

```ts
import 'reflect-metadata';
```

---

## 🧪 Testes e extensibilidade

Como os controllers não dependem diretamente do Express ou do Fastify, podem ser testados facilmente com objetos puros:

```ts
const controller = new AccountsController(serviceMock);

const result = controller.create({
  body: { name: 'Daniel', email: 'a@a.com', password: '123456' },
});

expect(result.code).toBe(201);
```

---

## ✍️ Autor

**Daniel Rodrigues**
Desenvolvedor Full Stack | Engenheiro de Software
Construído com propósito, estudo e paixão por arquitetura limpa.
