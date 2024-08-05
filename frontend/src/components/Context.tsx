'use client'
import { Column } from "@/utils/requests/Column";
import { Table } from "@/utils/requests/Table";
import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

type ModeContextType = {
    mode: "light" | "dark";
    setMode: Dispatch<React.SetStateAction<"light" | "dark">>;
    columns: Column[];
    setColumns: Dispatch<React.SetStateAction<Column[]>>;
    selectedTable : Table | null;
    setSelectedTable : Dispatch<React.SetStateAction<Table | null>>;
};

export const ModeContext = createContext<ModeContextType | null>(null);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useReducer(
        (state: "light" | "dark", action: "light" | "dark") => action,
        "dark"
    );
    const [columns, setColumns] = useReducer(
        (state: Column[], action: Column[]) => action,
        []
    );

    const [selectedTable, setSelectedTable] = useReducer(
        (state: Table | null, action: Table | null) => action,
        null
    )
    return (
        <ModeContext.Provider value={{ mode, setMode : setMode as Dispatch<React.SetStateAction<"light" | "dark">>, columns, setColumns : setColumns as Dispatch<React.SetStateAction<Column[]>>, selectedTable, setSelectedTable : setSelectedTable as Dispatch<React.SetStateAction<Table | null>> }}>
            {children}
        </ModeContext.Provider>
    );
};
