import { Form } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, RefreshCw, ShieldAlert } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { regenerateRecoveryCodes } from '@/routes/two-factor';

import AlertError from './alert-error';

interface TwoFactorRecoveryCodesProps {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
}

export default function TwoFactorRecoveryCodes({
    recoveryCodesList,
    fetchRecoveryCodes,
    errors,
}: TwoFactorRecoveryCodesProps) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible(!codesAreVisible);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card className="border-amber-500/20 bg-amber-500/5 shadow-none dark:bg-amber-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                    <LockKeyhole
                        className="h-5 w-5 text-amber-600"
                        aria-hidden="true"
                    />
                    Códigos de Recuperación 2FA
                </CardTitle>
                <CardDescription className="text-amber-900/70 dark:text-amber-200/60">
                    Los códigos de recuperación te permiten acceder a tu cuenta
                    si pierdes tu dispositivo 2FA. Guárdalos en un gestor de
                    contraseñas seguro.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3 select-none sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={toggleCodesVisibility}
                        className="w-full gap-2 border-amber-500/20 hover:bg-amber-500/10 sm:w-fit"
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                        {codesAreVisible ? 'Ocultar' : 'Ver'} códigos de
                        recuperación
                    </Button>

                    {canRegenerateCodes && (
                        <Form
                            {...regenerateRecoveryCodes.form()}
                            options={{ preserveScroll: true }}
                            onSuccess={fetchRecoveryCodes}
                        >
                            {({ processing }) => (
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    disabled={processing}
                                    className="w-full gap-2 sm:w-fit"
                                    aria-describedby="regenerate-warning"
                                >
                                    <RefreshCw
                                        className={
                                            processing ? 'animate-spin' : ''
                                        }
                                    />
                                    Regenerar códigos
                                </Button>
                            )}
                        </Form>
                    )}
                </div>

                <div
                    id="recovery-codes-section"
                    className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
                    aria-hidden={!codesAreVisible}
                >
                    <div className="mt-4 space-y-4">
                        {errors?.length ? (
                            <AlertError errors={errors} />
                        ) : (
                            <>
                                <div
                                    ref={codesSectionRef}
                                    className="grid grid-cols-1 gap-2 rounded-xl border border-amber-500/10 bg-background p-5 font-mono text-sm sm:grid-cols-2"
                                    role="list"
                                    aria-label="Códigos de recuperación"
                                >
                                    {recoveryCodesList.length ? (
                                        recoveryCodesList.map((code, index) => (
                                            <div
                                                key={index}
                                                role="listitem"
                                                className="flex items-center gap-2 text-foreground/80 select-text"
                                            >
                                                <span className="text-[10px] text-muted-foreground opacity-50">
                                                    #
                                                    {(index + 1)
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </span>
                                                <span className="font-bold tracking-wider">
                                                    {code}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className="col-span-full space-y-2"
                                            aria-label="Cargando códigos..."
                                        >
                                            {Array.from(
                                                { length: 8 },
                                                (_, index) => (
                                                    <div
                                                        key={index}
                                                        className="h-5 animate-pulse rounded bg-muted-foreground/10"
                                                        aria-hidden="true"
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
                                    <ShieldAlert className="h-5 w-5 shrink-0 opacity-80" />
                                    <p
                                        id="regenerate-warning"
                                        className="leading-relaxed"
                                    >
                                        Cada código puede usarse{' '}
                                        <span className="font-bold underline">
                                            una sola vez
                                        </span>
                                        . Si usas uno para entrar, será
                                        invalidado. Si te quedan pocos, presiona{' '}
                                        <span className="font-bold">
                                            Regenerar códigos
                                        </span>{' '}
                                        para obtener una lista nueva (esto
                                        invalidará todos los anteriores).
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
