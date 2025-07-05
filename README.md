# 🚀 ElyumJS – Microframework Web com TypeScript, Decorators e Injeção de Dependência

![ElyumJS](https://img.shields.io/badge/Made_with-ElyumJS-blueviolet?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

**ElyumJS** é um microframework backend criado do zero com **TypeScript**, inspirado na arquitetura do NestJS.

Foi desenvolvido com foco em **modularidade**, **injeção de dependência**, **validação automática** e **arquitetura desacoplada**, oferecendo um core leve, testável e extensível.

---

## 🧠 Principais Recursos

- ✅ Roteamento automático com decorators: `@Controller`, `@Module`, `@Get`, `@Post`, etc.
- ✅ Injeção de dependência baseada em metadata
- ✅ Validação automática com **Zod**
- ✅ Escopo de dependências por módulo com `imports` e `exports`
- ✅ Sistema de **Guards** (nível global, por módulo, controller e handler)
- ✅ Arquitetura modular e testável

---

## 🧱 Estrutura do Projeto

```
src/
├── kernel/
│   ├── decorators/         # Controller, Get, Post, Schema
│   ├── context/            # RequestContext para o context dos Guards
│   └── di/                 # Registry de injeção
├── application/
│   ├── modules/            # Módulos de exemplo do sistema
│   ├── guards/
│   └── errors/
├── main/
│   ├── contracts/
│   ├── lib/
│   ├── AppModule          # Modulo global
│   └── main               # Start do projeto
└── shared/
    ├── contracts/         # Contratos/interfaces do sistema
    ├── utils/             # Funções utilitárias do sistema
    └── types/             # Tipagens genéricas Request<T>, Response<T>
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

```ts
@GlobalModule({
  imports: [AccountsModule],
  guards: [AuthGuard], // Guard global
})
export class AccountsModule {}
```

---

# 🔐 Sistema de Guards

ElyumJS permite aplicar guards em múltiplos níveis:

- Global (AppModule)

- Módulo (Module)

- Controller (@Guard)

- Handler (@Guard no método)

Todos são resolvidos com injeção de dependência, e respeitam escopo via imports/exports.
Os guards devem implementar o método:

```ts
class AuthGuard implements IGuard {
  canActivate(context: RequestContextMetadata): boolean | Promise<boolean> {
    // lógica de autenticação
  }
}
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

---

## ⚙️ Comandos para rodar o projeto

- pnpm build -> para transpilar o código
- pnpm start -> para inicializar

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
Desenvolvedor Full Stack | Engenheiro de Software em formação
Apaixonado por arquitetura limpa, backend moderno e TypeScript
🔗 GitHub | 💼 LinkedIn
