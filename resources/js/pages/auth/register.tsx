import { Head, useForm } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    const [isDark, setIsDark] = useState(false);

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

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [requirements, setRequirements] = useState({
        length: false,
        number: false,
        special: false,
        uppercase: false,
    });

    useEffect(() => {
        setRequirements({
            length: data.password.length >= 8,
            number: /[0-9]/.test(data.password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
            uppercase: /[A-Z]/.test(data.password),
        });
    }, [data.password]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        /* El relative aquí asegura que el botón se posicione arriba a la derecha de la pantalla */
        <div className="relative min-h-screen">
            <AuthLayout
                title="Crear una cuenta"
                description="Ingresa tus datos a continuación para registrarte"
            >
                <Head title="Registro" />

                {/* BOTÓN DE TEMA - ESQUINA SUPERIOR DERECHA ABSOLUTA */}
                <div className="fixed top-4 right-4 z-50">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-muted-foreground transition-colors hover:text-primary active:scale-95"
                        type="button"
                    >
                        {isDark ? (
                            <Sun size={22} strokeWidth={2} />
                        ) : (
                            <Moon size={22} strokeWidth={2} />
                        )}
                    </button>
                </div>

                <style>{`
                    h1 { color: white !important; }
                    html.dark body { background-color: black !important; }
                    
                    img[alt="Logo Sociedad"], svg {
                        margin-top: 100px !important;
                        margin-bottom: 20px !important;
                    }
                    .text-center.space-y-2, h1, p {
                        margin-top: 25px !important;
                        position: relative !important;
                    }
                    form {
                        margin-top: 1px !important;
                    }
                `}</style>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="grid gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                autoFocus
                                placeholder="Tu nombre completo"
                                className="h-9"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                placeholder="correo@ejemplo.com"
                                className="h-9"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                                placeholder="Mínimo 8 caracteres"
                                className="h-9"
                            />

                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1.5 px-1">
                                <RequirementItem
                                    met={requirements.length}
                                    text="8+ caracteres"
                                />
                                <RequirementItem
                                    met={requirements.uppercase}
                                    text="Mayúscula"
                                />
                                <RequirementItem
                                    met={requirements.number}
                                    text="Número"
                                />
                                <RequirementItem
                                    met={requirements.special}
                                    text="Símbolo"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password_confirmation">
                                Confirmar contraseña
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                                placeholder="Repite tu contraseña"
                                className="h-9"
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-10 w-full font-bold tracking-widest !text-white uppercase hover:opacity-90"
                            disabled={
                                processing ||
                                !Object.values(requirements).every(Boolean)
                            }
                        >
                            {processing ? (
                                <Spinner className="h-4 w-4 !text-white" />
                            ) : (
                                'Crear cuenta'
                            )}
                        </Button>
                    </div>

                    <div className="mt-2 text-center text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <TextLink
                            href={login()}
                            className="font-semibold underline"
                        >
                            Iniciar sesión
                        </TextLink>
                    </div>
                </form>
            </AuthLayout>
        </div>
    );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div
                className={`h-1 w-1 shrink-0 rounded-full transition-all duration-300 ${
                    met
                        ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.7)]'
                        : 'bg-zinc-300 dark:bg-zinc-800'
                }`}
            />
            <span
                className={`text-[9px] font-bold tracking-tight uppercase transition-colors duration-300 ${
                    met
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-zinc-400 opacity-60 dark:text-zinc-500'
                }`}
            >
                {text}
            </span>
        </div>
    );
}
