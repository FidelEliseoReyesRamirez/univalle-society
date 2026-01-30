import { Head, useForm } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [isDark, setIsDark] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [requirements, setRequirements] = useState({
        length: false,
        number: false,
        special: false,
        uppercase: false,
    });

    // Manejo de tema y persistencia
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

    useEffect(() => {
        setRequirements({
            length: data.password.length >= 8,
            number: /[0-9]/.test(data.password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(data.password),
            uppercase: /[A-Z]/.test(data.password),
        });
    }, [data.password]);

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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Usamos la ruta directa para evitar errores de 'route' no definido
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Restablecer contraseña"
            description="Por favor, ingresa tu nueva contraseña a continuación"
        >
            <Head title="Restablecer contraseña" />

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

                /* EVITAR FLASH BLANCO */
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
                form {
                    margin-top: 20px !important;
                }
            `}</style>

            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            className="h-9 cursor-not-allowed bg-zinc-100 opacity-60 dark:bg-zinc-900"
                            readOnly
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="password">Nueva contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                            autoFocus
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
                                setData('password_confirmation', e.target.value)
                            }
                            required
                            placeholder="Repite tu contraseña"
                            className="h-9"
                        />
                        <InputError message={errors.password_confirmation} />
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
                            'Actualizar contraseña'
                        )}
                    </Button>
                </div>
            </form>
        </AuthLayout>
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
