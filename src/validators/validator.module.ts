import { Global, Module } from '@nestjs/common'
import { PasswordConfirmValidator } from './password-confirm.validator'
import { UniqueEmailValidator } from './unique-email.validator'

@Global()
@Module({
    imports: [
    ],
    providers: [
        PasswordConfirmValidator,
        UniqueEmailValidator,
    ],
    exports: [
        PasswordConfirmValidator,
        UniqueEmailValidator,
    ],
})
export class ValidatorModule {
}