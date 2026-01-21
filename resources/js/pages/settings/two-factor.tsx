import { Form, Head } from '@inertiajs/react';
import {
    ShieldBan,
    ShieldCheck,
    ShieldEllipsis,
    Smartphone,
} from 'lucide-react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Autenticación de Doble Factor',
        href: show.url(),
    },
];

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Autenticación de Doble Factor (2FA)" />

            <h1 className="sr-only">
                Ajustes de Autenticación de Doble Factor
            </h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Doble Factor (2FA)"
                        description="Añade una capa extra de seguridad a tu cuenta de la SOC-ISI"
                    />

                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-5 rounded-xl border border-green-500/20 bg-green-500/5 p-6">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-green-600 hover:bg-green-700">
                                    Activado
                                </Badge>
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                                La autenticación de doble factor está activa.
                                Cuando inicies sesión, se te solicitará un
                                código PIN seguro generado por tu aplicación de
                                autenticación (como Microsoft Authenticator o
                                Google Authenticator).
                            </p>

                            <TwoFactorRecoveryCodes
                                recoveryCodesList={recoveryCodesList}
                                fetchRecoveryCodes={fetchRecoveryCodes}
                                errors={errors}
                            />

                            <div className="pt-2">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <Button
                                            variant="destructive"
                                            type="submit"
                                            disabled={processing}
                                            className="gap-2"
                                        >
                                            <ShieldBan className="h-4 w-4" />{' '}
                                            Desactivar 2FA
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-5 rounded-xl border border-border bg-muted/30 p-6">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">Desactivado</Badge>
                                <ShieldEllipsis className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Al activar la autenticación de doble factor, tu
                                cuenta será mucho más segura. Necesitarás un
                                código temporal desde tu teléfono móvil para
                                poder acceder al sistema.
                            </p>

                            <div className="flex items-center gap-3">
                                <Smartphone className="h-10 w-10 text-primary opacity-50" />
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="gap-2"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Continuar Configuración
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() =>
                                            setShowSetupModal(true)
                                        }
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="gap-2"
                                            >
                                                <ShieldCheck className="h-4 w-4" />
                                                Activar 2FA
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
