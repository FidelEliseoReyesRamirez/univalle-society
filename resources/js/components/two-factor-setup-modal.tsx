import { Form } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy, ScanLine } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';

import AlertError from './alert-error';
import { Spinner } from './ui/spinner';

function GridScanIcon() {
    return (
        <div className="mb-3 rounded-full border border-border bg-card p-0.5 shadow-sm">
            <div className="relative overflow-hidden rounded-full border border-border bg-muted p-2.5">
                <div className="absolute inset-0 grid grid-cols-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`col-${i + 1}`}
                            className="border-r border-border last:border-r-0"
                        />
                    ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-5 opacity-50">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={`row-${i + 1}`}
                            className="border-b border-border last:border-b-0"
                        />
                    ))}
                </div>
                <ScanLine className="relative z-20 size-6 text-foreground" />
            </div>
        </div>
    );
}

function TwoFactorSetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const IconComponent = copiedText === manualSetupKey ? Check : Copy;

    return (
        <>
            {errors?.length ? (
                <AlertError errors={errors} />
            ) : (
                <>
                    <div className="mx-auto flex max-w-md overflow-hidden">
                        <div className="mx-auto aspect-square w-64 rounded-xl border border-border bg-white p-4 shadow-inner">
                            <div className="z-10 flex h-full w-full items-center justify-center">
                                {qrCodeSvg ? (
                                    <div
                                        className="aspect-square w-full [&_svg]:size-full"
                                        dangerouslySetInnerHTML={{
                                            __html: qrCodeSvg,
                                        }}
                                        style={{
                                            filter:
                                                resolvedAppearance === 'dark'
                                                    ? 'invert(1) brightness(1.2) contrast(1.2)'
                                                    : undefined,
                                        }}
                                    />
                                ) : (
                                    <Spinner />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full">
                        <Button
                            className="w-full font-bold"
                            onClick={onNextStep}
                        >
                            {buttonText}
                        </Button>
                    </div>

                    <div className="relative flex w-full items-center justify-center">
                        <div className="absolute inset-0 top-1/2 h-px w-full bg-border" />
                        <span className="relative bg-card px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            o ingresa el código manualmente
                        </span>
                    </div>

                    <div className="flex w-full space-x-2">
                        <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-border bg-muted/50">
                            {!manualSetupKey ? (
                                <div className="flex h-12 w-full items-center justify-center p-3">
                                    <Spinner />
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        readOnly
                                        value={manualSetupKey}
                                        className="h-12 w-full bg-transparent px-4 font-mono text-sm text-foreground outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => copy(manualSetupKey)}
                                        className="flex items-center border-l border-border px-4 transition-colors hover:bg-primary hover:text-primary-foreground"
                                        title="Copiar código"
                                    >
                                        <IconComponent className="w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function TwoFactorVerificationStep({
    onClose,
    onBack,
}: {
    onClose: () => void;
    onBack: () => void;
}) {
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 50);
    }, []);

    return (
        <Form
            {...confirm.form()}
            onSuccess={() => onClose()}
            resetOnError
            resetOnSuccess
        >
            {({
                processing,
                errors,
            }: {
                processing: boolean;
                errors?: { confirmTwoFactorAuthentication?: { code?: string } };
            }) => (
                <>
                    <div
                        ref={pinInputContainerRef}
                        className="relative w-full space-y-4"
                    >
                        <div className="flex w-full flex-col items-center space-y-4 py-2">
                            <InputOTP
                                id="otp"
                                name="code"
                                maxLength={OTP_MAX_LENGTH}
                                onChange={setCode}
                                disabled={processing}
                                pattern={REGEXP_ONLY_DIGITS}
                            >
                                <InputOTPGroup className="gap-2">
                                    {Array.from(
                                        { length: OTP_MAX_LENGTH },
                                        (_, index) => (
                                            <InputOTPSlot
                                                key={index}
                                                index={index}
                                                className="rounded-md border-border"
                                            />
                                        ),
                                    )}
                                </InputOTPGroup>
                            </InputOTP>
                            <InputError
                                message={
                                    errors?.confirmTwoFactorAuthentication?.code
                                }
                            />
                        </div>

                        <div className="flex w-full space-x-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1"
                                onClick={onBack}
                                disabled={processing}
                            >
                                Atrás
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 font-bold"
                                disabled={
                                    processing || code.length < OTP_MAX_LENGTH
                                }
                            >
                                {processing ? 'Verificando...' : 'Confirmar'}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}

interface TwoFactorSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
}

export default function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    clearSetupData,
    fetchSetupData,
    errors,
}: TwoFactorSetupModalProps) {
    const [showVerificationStep, setShowVerificationStep] =
        useState<boolean>(false);

    const modalConfig = useMemo<{
        title: string;
        description: string;
        buttonText: string;
    }>(() => {
        if (twoFactorEnabled) {
            return {
                title: 'Autenticación Activada',
                description:
                    'El doble factor ya está activo. Escanea el código o guarda la clave en tu aplicación de autenticación.',
                buttonText: 'Cerrar',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'Verificar Código',
                description:
                    'Ingresa el código de 6 dígitos generado por tu aplicación.',
                buttonText: 'Continuar',
            };
        }

        return {
            title: 'Activar Doble Factor',
            description:
                'Para terminar la activación, escanea el código QR o ingresa la clave manual en tu app de autenticación.',
            buttonText: 'Continuar',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);
            return;
        }

        clearSetupData();
        onClose();
    }, [requiresConfirmation, clearSetupData, onClose]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);

        if (twoFactorEnabled) {
            clearSetupData();
        }
    }, [twoFactorEnabled, clearSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            fetchSetupData();
        }
    }, [isOpen, qrCodeSvg, fetchSetupData]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="border-primary/10 sm:max-w-md">
                <DialogHeader className="flex flex-col items-center justify-center space-y-2">
                    <GridScanIcon />
                    <DialogTitle className="text-xl font-bold tracking-tight">
                        {modalConfig.title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm">
                        {modalConfig.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-6 pt-2">
                    {showVerificationStep ? (
                        <TwoFactorVerificationStep
                            onClose={onClose}
                            onBack={() => setShowVerificationStep(false)}
                        />
                    ) : (
                        <TwoFactorSetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleModalNextStep}
                            errors={errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
