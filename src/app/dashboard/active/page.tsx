"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { handleKeyToCompany } from "@/handlers/keyToCompany";
import useActives from "@/hooks/dashboard/useActives";
import {
    FiSearch,
    FiUser,
    FiDollarSign,
    FiCalendar,
    FiFileText,
    FiChevronLeft,
    FiChevronRight,
    FiX
} from "react-icons/fi";

function ActiveSection() {
    const {
        activeTab,
        setActiveTab,
        searchQuery,
        handleSearchChange,
        clearSearch,
        isLoading,
        error,
        loanData,
        formatCurrency,
        formatDate,
        pagination,
        handlePageChange,
        UpdateIndicator,
        router
    } = useActives();

    console.log(pagination);

    // Función para generar números de página para paginación
    const getPageNumbers = () => {
        const totalPages = pagination.totalPages;
        const currentPage = pagination.currentPage;
        const maxPageNumbers = 5;
        const pageNumbers = [];

        if (totalPages <= maxPageNumbers) {
            // Mostrar todos los números de página si el total es menor que maxPageNumbers
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Incluir siempre primera página, última página, página actual y
            // una o dos páginas a cada lado de la página actual

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Ajustar si currentPage está cerca del principio
            if (currentPage <= 2) {
                endPage = Math.min(totalPages - 1, 4);
            }

            // Ajustar si currentPage está cerca del final
            if (currentPage >= totalPages - 1) {
                startPage = Math.max(2, totalPages - 3);
            }

            // Incluir siempre la página 1
            pageNumbers.push(1);

            // Añadir elipsis si es necesario
            if (startPage > 2) {
                pageNumbers.push('...');
            }

            // Añadir páginas intermedias
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Añadir elipsis si es necesario
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }

            // Incluir siempre la última página
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    console.log("LoanData: ", loanData)

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                        {activeTab === 'aprobados'
                            ? 'Solicitudes Aprobadas'
                            : activeTab === 'aplazados'
                                ? 'Solicitudes Aplazadas'
                                : 'Solicitudes con Ajuste de Monto'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Gestiona las solicitudes según su estado
                    </p>
                </header>

                {/* Tab navigation */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <UpdateIndicator />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('aprobados')}
                            className={`text-sm px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'aprobados'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Aprobados
                        </button>

                        <button
                            onClick={() => setActiveTab('aplazados')}
                            className={`text-sm px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'aplazados'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Aplazados
                        </button>

                        <button
                            onClick={() => setActiveTab('cambio')}
                            className={`text-sm px-5 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'cambio'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Ajuste
                        </button>
                    </div>
                </div>

                {/* Search input */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Busca por Numero de documento / Nombre completo / ID solicitud"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                onClick={clearSearch}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Limpiar búsqueda"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Content area */}
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-red-500 mb-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 opacity-40"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium text-center">{error}</p>
                        </div>
                    ) : loanData.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {loanData.map((item) => (
                                    <div onClick={() => router.push(`/dashboard/loan/${item.loanApplication.id}?userId=${item.loanApplication.userId}`)} key={item.loanApplication.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                            <div className="mb-3 md:mb-0">
                                                <div className="flex items-center mb-2">
                                                    <FiUser className="mr-2 text-gray-500" />
                                                    <h3 className="font-semibold text-lg">{`${item.user.names} ${item.user.firstLastName} ${item.user.secondLastName}`}</h3>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FiFileText className="mr-2" />
                                                    <span>{`${item.document.typeDocument}: ${item.document.number}`}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex items-center mb-1">
                                                    <span className="font-medium">{formatCurrency(item.loanApplication.cantity)}</span>
                                                </div>
                                                {item.loanApplication.newCantity && (
                                                    <div className="flex items-center text-sm text-blue-600">
                                                        <span className="font-medium">Nuevo: {formatCurrency(item.loanApplication.newCantity)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap justify-between items-center">
                                            <div className="flex items-center text-sm text-gray-600 mb-2 md:mb-0">
                                                <FiCalendar className="mr-1" />
                                                <span>{formatDate(String(item.loanApplication.created_at))}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="text-sm mr-2">{handleKeyToCompany(item.user.currentCompanie || "Sin Definir")}</span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.loanApplication.status === 'Aprobado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : item.loanApplication.status === 'Aplazado'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {item.loanApplication.status}
                                                </span>
                                            </div>
                                        </div>

                                        {(item.loanApplication.reasonChangeCantity || item.loanApplication.reasonReject) && (
                                            <div className="mt-2 text-sm italic text-gray-600 border-t pt-2">
                                                <span>Motivo: {item.loanApplication.reasonChangeCantity || item.loanApplication.reasonReject}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-8 mb-4">
                                {/* Botón Anterior */}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className={`flex items-center px-4 py-2 rounded-l-lg border ${pagination.currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                        }`}
                                >
                                    <FiChevronLeft className="mr-2" />
                                    Anterior
                                </button>

                                {/* Indicador de página y páginas numéricas */}
                                <div className="hidden md:flex">
                                    {getPageNumbers().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <button
                                                key={`page-${page}`}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-4 py-2 border-t border-b ${pagination.currentPage === page
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700"
                                            >
                                                {page}
                                            </span>
                                        )
                                    ))}
                                </div>

                                {/* Indicador móvil simple */}
                                <div className="md:hidden flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                                    {pagination.currentPage} / {pagination.totalPages}
                                </div>

                                {/* Botón Siguiente */}
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className={`flex items-center px-4 py-2 rounded-r-lg border ${pagination.currentPage === pagination.totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                        }`}
                                >
                                    Siguiente
                                    <FiChevronRight className="ml-2" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-gray-400 mb-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 opacity-40"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium text-center">
                                No hay solicitudes en este estado
                            </p>
                            <p className="text-gray-400 text-sm text-center mt-1">
                                {searchQuery
                                    ? 'No se encontraron resultados para tu búsqueda'
                                    : 'Las solicitudes aparecerán aquí cuando estén disponibles'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}

export default ActiveSection;