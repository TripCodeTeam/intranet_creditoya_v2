"use client"

import { useAuth } from "@/context/useAuth";
import { ScalarClient } from "@/types/client";
import { GeneratedDocuments, ScalarLoanApplication } from "@/types/loan";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useLoan({ loanId, clientId }: { loanId: string, clientId: string }) {
    const [isRejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
    const [isAdjustModalOpen, setAdjustModalOpen] = useState<boolean>(false);
    const [rejectReason, setRejectReason] = useState<string>("");
    const [newAmount, setNewAmount] = useState<string>("");
    const [adjustReason, setAdjustReason] = useState<string>("");
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loanApplication, setLoanApplication] = useState<ScalarLoanApplication | null>(null);
    const [client, setClient] = useState<ScalarClient | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAccepting, setIsAccepting] = useState<boolean>(false);
    const [isRejecting, setIsRejecting] = useState<boolean>(false);

    console.log("loan", loanId, "client: ", clientId);

    const router = useRouter();
    const { user } = useAuth();

    const fetchLoanData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/dash/loan?loan_id=${loanId}&user_id=${clientId}`,
                { withCredentials: true }
            );

            console.log(response)

            if (response.data.success) {
                const loanData: ScalarLoanApplication = response.data.data;
                setLoanApplication({
                    id: loanData.id,
                    status: loanData.status,
                    cantity: loanData.cantity,
                    newCantity: loanData.newCantity,
                    reasonReject: loanData.reasonReject,
                    reasonChangeCantity: loanData.reasonChangeCantity,
                    fisrt_flyer: loanData.fisrt_flyer,
                    second_flyer: loanData.second_flyer,
                    phone: loanData.phone,
                    third_flyer: loanData.third_flyer,
                    labor_card: loanData.labor_card,
                    created_at: loanData.created_at,
                    userId: loanData.userId ?? "",
                    upid_first_flayer: loanData.upid_first_flyer ?? "",
                    upid_second_flyer: loanData.upid_second_flyer ?? "",
                    upid_third_flayer: loanData.upid_third_flyer ?? "",
                    upid_labor_card: loanData.upid_labor_card ?? "",
                    updated_at: loanData.updated_at ?? "",
                    approved_at: loanData.approved_at ?? "",
                    rejected_at: loanData.rejected_at ?? "",
                    adjusted_at: loanData.adjusted_at ?? "",
                    adjusted_by: loanData.adjusted_by ?? "",
                    rejected_by: loanData.rejected_by ?? "",
                    approved_by: loanData.approved_by ?? "",
                    entity: loanData.entity ?? "",
                    terms_and_conditions: loanData.terms_and_conditions ?? false,
                    signature: loanData.signature ?? "",
                    upSignatureId: loanData.upSignatureId ?? "",
                    bankSavingAccount: loanData.bankSavingAccount ?? "",
                    bankNumberAccount: loanData.bankNumberAccount ?? "",
                    user: loanData.user,
                    GeneratedDocuments: Array.isArray(loanData.GeneratedDocuments) && loanData.GeneratedDocuments.length > 0
                        ? loanData.GeneratedDocuments[0] as GeneratedDocuments
                        : undefined
                });
                setClient(loanData.user as ScalarClient);
            } else {
                setError("No se pudo obtener la información del préstamo");
            }
        } catch (error) {
            setError("Error al cargar los datos del préstamo");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loanId) {
            fetchLoanData();
        }
    }, [loanId]);

    const documents = loanApplication ? [
        { name: "Cedula en ambos lados", url: loanApplication.user?.Document?.[0]?.documentSides || "" },
        { name: "Primero volante de pago", url: loanApplication.fisrt_flyer || "" },
        { name: "Segundo volante de pago", url: loanApplication.second_flyer || "" },
        { name: "Tercer volante de pago", url: loanApplication.third_flyer || "" },
        { name: "Carta laboral actualizada", url: loanApplication.labor_card || "" },
    ] : [];

    const handleReject = async () => {
        try {
            setIsRejecting(true);
            const response = await axios.patch(`/api/dash/loan/status?loan_id=${loanId}`, {
                status: "Aplazado",
                reasonReject: rejectReason,
                employeeId: user?.id
            }, { withCredentials: true });

            console.log("response: ", response.data);

            if (response.data.success) {
                // Update local state
                if (loanApplication) {
                    setLoanApplication({
                        ...loanApplication,
                        status: "Aplazado",
                        reasonReject: rejectReason
                    });
                }
            }
        } catch (error) {
            console.error("Error al rechazar el préstamo:", error);
        } finally {
            setIsRejecting(false);
            setRejectModalOpen(false);
        }
    };

    const handleAdjust = async () => {
        try {
            const response = await axios.patch(`/api/dash/loan/status?loan_id=${loanId}`, {
                status: "Pendiente",
                newCantity: newAmount,
                reasonChangeCantity: adjustReason,
                employeeId: user?.id
            });

            if (response.data.success) {
                // Update local state
                if (loanApplication) {
                    setLoanApplication({
                        ...loanApplication,
                        newCantity: newAmount,
                        reasonChangeCantity: adjustReason
                    });
                }
            }
        } catch (error) {
            console.error("Error al ajustar el monto:", error);
        }
        setAdjustModalOpen(false);
    };

    const handleAccept = async () => {
        try {
            setIsAccepting(true);
            const response = await axios.patch(`/api/dash/loan/status?loan_id=${loanId}`, {
                status: "Aprobado",
                employeeId: user?.id
            });

            console.log(response.data);

            if (response.data.success) {
                // Update local state
                if (loanApplication) {
                    setLoanApplication({
                        ...loanApplication,
                        status: "Aprobado",
                        employeeId: response.data.data.employeeId,
                    });
                }
            }
        } catch (error) {
            console.error("Error al aceptar el préstamo:", error);
        } finally {
            setIsAccepting(false);
        }
    };

    return {
        loading,
        error,
        loanApplication,
        client,
        router,
        documents,
        isRejectModalOpen,
        isAdjustModalOpen,
        rejectReason,
        newAmount,
        adjustReason,
        selectedDocument,
        isAccepting,
        isRejecting,
        setSelectedDocument,
        handleAccept,
        setRejectModalOpen,
        setAdjustModalOpen,
        handleReject,
        handleAdjust,
        setNewAmount,
        setAdjustReason,
        setRejectReason,
    }
}

export default useLoan;