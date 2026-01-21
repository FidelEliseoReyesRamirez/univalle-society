import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
// Eliminamos la importación de DeleteUser
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { CheckCircle2, Mail, Save, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de perfil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de perfil" />

            <h1 className="sr-only">Ajustes de perfil</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Información del perfil"
                        description="Actualiza tu nombre público y dirección de correo electrónico"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        Nombre completo
                                    </Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Tu nombre completo"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="flex items-center gap-2"
                                    >
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        Correo electrónico
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="correo@ejemplo.com"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                                Tu dirección de correo no ha
                                                sido verificada.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-bold underline decoration-amber-500/30 underline-offset-4 transition-colors hover:decoration-amber-500"
                                                >
                                                    Haz clic aquí para reenviar
                                                    el correo de verificación.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    Se ha enviado un nuevo
                                                    enlace de verificación a tu
                                                    correo.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        className="gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Guardar cambios
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0 translate-x-2"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Cambios guardados
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
                {/* Se eliminó el componente DeleteUser de aquí */}
            </SettingsLayout>
        </AppLayout>
    );
}
