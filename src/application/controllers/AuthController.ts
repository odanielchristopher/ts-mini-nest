import { Controller } from '../../kernel/decorators/Controller';
import { Post } from '../../kernel/decorators/http/Post';
import { Response } from '../../shared/types/Response';

@Controller('auth')
export class AuthController {
  @Post('sign-in')
  signin(): Response<{ ok: boolean }> {
    return {
      code: 200,
      body: { ok: true },
    };
  }
}
