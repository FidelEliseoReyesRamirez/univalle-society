import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout
            title="Restablecer contraseña"
            description="Por favor, ingresa tu nueva contraseña a continuación"
        >
            <Head title="Restablecer contraseña" />

            {/* Ajuste de espacio para el logo y títulos */}
            <style>{`
                img[alt="Logo Sociedad"], 
                a[href="/"] svg, 
                .flex.justify-center.mb-4 {
                    margin-top: 100px !important; 
                    margin-bottom: 30px !important;
                }

                .text-center.space-y-2, h1, p {
                    margin-top: 20px !important;
                }
                
                form {
                    margin-top: 20px !important;
                }
            `}</style>

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full cursor-not-allowed bg-muted"
                                readOnly
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder="Ingresa tu nueva contraseña"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirmar contraseña
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder="Repite la contraseña"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full font-bold"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? <Spinner className="mr-2" /> : null}
                            {processing
                                ? 'Actualizando...'
                                : 'Restablecer contraseña'}
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
