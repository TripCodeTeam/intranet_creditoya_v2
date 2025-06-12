"use client"

import useActives from "@/hooks/dashboard/useActives";
import { Dispatch, JSX, SetStateAction } from "react"

function ActiveTabNavigation() {

    const {
        setActiveTab,
        activeTab,
        UpdateIndicator
    } = useActives();

    return (
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
    )
}

export default ActiveTabNavigation