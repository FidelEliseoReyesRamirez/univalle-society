import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/user-password';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de contraseña',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Estados para el "jueguito" y visibilidad
    const [passwordValue, setPasswordValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [requirements, setRequirements] = useState({
        length: false,
        number: false,
        special: false,
        upper: false,
    });

    useEffect(() => {
        setRequirements({
            length: passwordValue.length >= 8,
            number: /[0-9]/.test(passwordValue),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
            upper: /[A-Z]/.test(passwordValue),
        });
    }, [passwordValue]);

    const Requirement = ({ met, label }: { met: boolean; label: string }) => (
        <div
            className={cn(
                'flex items-center gap-2 text-[11px] transition-all duration-300',
                met ? 'font-bold text-green-500' : 'text-muted-foreground/50',
            )}
        >
            <div
                className={cn(
                    'h-1.5 w-1.5 rounded-full transition-all duration-500',
                    met
                        ? 'scale-125 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                        : 'bg-muted-foreground/30',
                )}
            />
            {label}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de contraseña" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Actualizar contraseña"
                        description="Usa una combinación fuerte para proteger tu acceso a la SOC-ISI"
                    />

                    <Form
                        {...PasswordController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        className="space-y-6"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">
                                        Contraseña actual
                                    </Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        placeholder="Contraseña actual"
                                    />
                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Nueva contraseña
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Nueva contraseña"
                                            className="pr-10"
                                            onChange={(e) =>
                                                setPasswordValue(e.target.value)
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Panel de validación visual mejorado */}
                                    <div className="mt-2 space-y-2 rounded-xl border border-border bg-muted/20 p-4 transition-all">
                                        <p className="text-[10px] font-black tracking-widest text-muted-foreground/70 uppercase">
                                            Seguridad requerida
                                        </p>
                                        <div className="grid grid-cols-2 gap-y-2">
                                            <Requirement
                                                met={requirements.length}
                                                label="8+ caracteres"
                                            />
                                            <Requirement
                                                met={requirements.upper}
                                                label="Mayúscula"
                                            />
                                            <Requirement
                                                met={requirements.number}
                                                label="Número"
                                            />
                                            <Requirement
                                                met={requirements.special}
                                                label="Símbolo"
                                            />
                                        </div>
                                    </div>

                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirmar contraseña
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        placeholder="Repite la contraseña"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        className="px-6 shadow-md shadow-primary/10 transition-transform active:scale-95"
                                    >
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Guardar cambios
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-out duration-500"
                                        enterFrom="opacity-0 -translate-y-2"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-300"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="flex items-center gap-1 text-sm font-bold text-green-600 dark:text-green-400">
                                            <Check className="h-4 w-4" />{' '}
                                            ¡Actualizado!
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
