// Components
import { Form, Head } from '@inertiajs/react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verifica tu correo"
            description="Por favor, verifica tu dirección de correo haciendo clic en el enlace que te acabamos de enviar."
        >
            <Head title="Verificación de correo" />

            {/* Estilo para asegurar que el logo no se corte y no choque */}
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
                    margin-top: 30px !important;
                }
            `}</style>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Se ha enviado un nuevo enlace de verificación a la dirección
                    de correo que proporcionaste durante el registro.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            variant="secondary"
                            className="w-full font-bold"
                        >
                            {processing ? <Spinner className="mr-2" /> : null}
                            {processing
                                ? 'Reenviando...'
                                : 'Reenviar correo de verificación'}
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm font-medium underline"
                        >
                            Cerrar sesión
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
