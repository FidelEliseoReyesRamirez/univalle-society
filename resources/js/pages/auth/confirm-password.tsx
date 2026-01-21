import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Confirmar contraseña"
            description="Esta es un área segura de la aplicación. Por favor, confirma tu contraseña antes de continuar."
        >
            <Head title="Confirmar contraseña" />

            {/* Ajuste de espacio para que el logo no se corte y no choque con los textos */}
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
                    margin-top: 25px !important;
                }
            `}</style>

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full font-bold"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : null}
                                {processing
                                    ? 'Confirmando...'
                                    : 'Confirmar contraseña'}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
