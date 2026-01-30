import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { AlertCircle, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}) {
    const [isDark, setIsDark] = useState(false);

    // Persistencia del tema
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

    const formatErrorMessage = (message: string) => {
        return message.replace(/(\d+\.\d+)/g, (match) =>
            Math.round(parseFloat(match)).toString(),
        );
    };

    return (
        <AuthLayout
            title="SICI-ISI Univalle"
            description="Ingresa tus credenciales para acceder al sistema"
        >
            <Head title="Log in" />

            {/* BOTÓN DE TEMA MINIMALISTA */}
            <div className="absolute top-6 right-6">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-muted-foreground transition-colors hover:text-primary"
                    type="button"
                >
                    {isDark ? (
                        <Sun size={18} strokeWidth={2.5} />
                    ) : (
                        <Moon size={18} strokeWidth={2.5} />
                    )}
                </button>
            </div>

            <style>{`
                /* TÍTULO BLANCO SIEMPRE */
                h1 { color: white !important; }

                /* EVITAR FLASH BLANCO EN F5 */
                html.dark body { background-color: black !important; }

                img[alt="Logo Sociedad"], 
                a[href="/"] svg, 
                .flex.justify-center.mb-4 {
                    margin-top: 115px !important; 
                    margin-bottom: 30px !important;
                }

                .text-center.space-y-2, h1, .text-center.space-y-2 + p {
                    margin-top: 30px !important;
                    display: block !important;
                }

                form {
                    margin-top: 5px !important;
                }
            `}</style>

            <Form
                action="/login"
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {errors.email && (
                            <div className="flex animate-in items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive duration-300 fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <div>
                                    <span className="font-bold">
                                        Aviso de seguridad:
                                    </span>
                                    <p className="mt-1 leading-relaxed">
                                        {formatErrorMessage(errors.email)}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@ejemplo.com"
                                    className={
                                        errors.email
                                            ? 'border-destructive focus-visible:ring-destructive'
                                            : ''
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="hidden"
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href="/forgot-password"
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    className={
                                        errors.password
                                            ? 'border-destructive focus-visible:ring-destructive'
                                            : ''
                                    }
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-medium"
                                >
                                    Recordar sesión
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full font-bold tracking-widest !text-white uppercase hover:opacity-90"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner className="mr-2 !text-white" />
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                ¿No tienes cuenta?{' '}
                                <TextLink
                                    href="/register"
                                    tabIndex={5}
                                    className="font-semibold underline"
                                >
                                    Regístrate aquí
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
