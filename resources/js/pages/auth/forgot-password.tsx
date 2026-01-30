// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    const [isDark, setIsDark] = useState(false);

    // Lógica de persistencia de tema
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (
            savedTheme === 'dark' ||
            (!savedTheme &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <AuthLayout
            title="¿Olvidaste tu contraseña?"
            description="Ingresa tu correo para recibir un enlace de restablecimiento"
        >
            <Head title="Recuperar contraseña" />

            {/* BOTÓN DE TEMA - FIXED ARRIBA A LA DERECHA */}
            <div className="fixed top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-muted-foreground transition-colors hover:text-primary active:scale-95"
                    type="button"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <style>{`
                /* FUERZA EL TEXTO BLANCO EN EL TÍTULO DE AUTH-LAYOUT */
                h1 { color: white !important; }
                
                /* FUERZA EL FONDO OSCURO EN F5 */
                html.dark body { background-color: black !important; }

                img[alt="Logo Sociedad"], 
                a[href="/"] svg, 
                .flex.justify-center.mb-4 {
                    margin-top: 100px !important; 
                    margin-bottom: 30px !important;
                }

                .text-center.space-y-2, h1, p {
                    margin-top: 20px !important;
                    position: relative !important;
                }
            `}</style>

            {status && (
                <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-bold text-emerald-500">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="correo@ejemplo.com"
                                    className="h-11"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="h-11 w-full font-bold tracking-widest !text-white uppercase shadow-lg shadow-primary/20"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    {processing
                                        ? 'Procesando...'
                                        : 'Enviar enlace de recuperación'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>O, volver al</span>
                    <TextLink
                        href={login()}
                        className="font-bold text-primary underline"
                    >
                        inicio de sesión
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
